import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  removeFromCart,
  updateQuantity,
  fetchCartAsync,
} from "../Features/Cart/cartSlice.js";
import {
  placeOrderCOD,
  placeOnlineOrderCart,
  placeCartOrder,
} from "../Features/Order/orderSlice.js";
import { getAddresses } from "../Features/User/addressSlice.js";
import axios from "axios";
import { RAZOR_KEY } from "../utils/config.js";
import { startRazorpayCartPayment } from "../utils/razorpayHandlerCart.js";
import { toast } from "sonner";

const Cart = () => {
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [razorpayKeyId, setRazorpayKeyId] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    cartItems,
    status: cartStatus,
    error: cartError,
  } = useSelector((state) => state.cart);
  const {
    addresses,
    defaultAddress,
    loading: addressLoading,
  } = useSelector((state) => state.address);
  const { user } = useSelector((state) => state.auth);
  const { loading: orderLoading, error: orderError } = useSelector(
    (state) => state.order
  );

  // --- Initial Data Fetching ---
  useEffect(() => {
    dispatch(fetchCartAsync());

    if (!addresses.length) {
      dispatch(getAddresses());
    }
  }, [dispatch, addresses.length]);

  // --- Handle Default Address Selection ---
  useEffect(() => {
    if (defaultAddress) {
      setSelectedAddress(defaultAddress);
    } else if (addresses.length > 0) {
      setSelectedAddress(addresses[0]);
    }
  }, [defaultAddress, addresses]);

  // --- Fetch Razorpay Key ---
  useEffect(() => {
    const fetchRazorpayKey = async () => {
      try {
        const response = await axios.get(RAZOR_KEY, {
          withCredentials: true,
        });
        if (response.data?.key_id) {
          setRazorpayKeyId(response.data.key_id);
        } else {
          console.error(
            "Failed to load payment configuration: key_id missing."
          );
        }
      } catch (error) {
        console.error("Error fetching payment configuration:", error);
      }
    };
    fetchRazorpayKey();
  }, []);

  // --- Price Calculations ---
  const subtotalAmount = cartItems.reduce(
    (total, item) =>
      total +
      (parseFloat(item.product_id?.offerPrice) ||
        parseFloat(item.product_id?.price) ||
        0) *
        item.quantity,
    0
  );
  const subtotalPaise = Math.round(subtotalAmount * 100);
  const taxRate = 0.02;
  const taxPaise = Math.round(subtotalPaise * taxRate);
  const totalPaise = subtotalPaise + taxPaise;

  const displaySubtotal = (subtotalPaise / 100).toFixed(2);
  const displayTax = (taxPaise / 100).toFixed(2);
  const displayTotal = (totalPaise / 100).toFixed(2);

  // --- Cart Item Actions ---
  const handleQuantityChange = (itemId, newQuantity) => {
    dispatch(
      updateQuantity({ itemId: itemId, quantity: parseInt(newQuantity) })
    );
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  // --- Place Order Logic ---
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.info("Please select a delivery address.");
      return;
    }

    if (cartItems.length === 0) {
      toast.warning(
        "Your cart is empty. Please add items before placing an order."
      );
      return;
    }

    if (paymentMethod === "ONLINE" && !razorpayKeyId) {
      toast.warning(
        "Payment gateway is not ready. Please wait a moment or refresh."
      );
      return;
    }

    const itemsForOrder = cartItems.map((item) => ({
      product_id: item.product_id._id,
      quantity: item.quantity,
      seller_id: item.product_id.seller_id,
    }));

    let result;
    if (paymentMethod === "COD") {
      const orderPayloadCOD = {
        items: itemsForOrder.map((item) => ({
          product: item.product_id,
          quantity: item.quantity,
        })),
        address: selectedAddress,
      };

      result = await dispatch(placeOrderCOD(orderPayloadCOD));

      if (
        result.meta.requestStatus === "fulfilled" &&
        result.payload?.success
      ) {
        toast.success("Order placed successfully with Cash On Delivery!");
        navigate(`/account/orders || "unknown"}`);
      } else {
        toast.error(
          "COD order failed: " +
            (result.payload?.message || "Unknown error occurred.")
        );
      }
    } else {
      const orderPayloadOnline = {
        products: itemsForOrder,
        shippingAddress: selectedAddress._id,
        paymentType: paymentMethod,
        amount: totalPaise,
        currency: "INR",
      };

      console.log("Order Payload for Online =>", orderPayloadOnline);
      result = await dispatch(placeCartOrder(orderPayloadOnline));

      if (
        result.meta.requestStatus === "fulfilled" &&
        result.payload?.requiresPayment &&
        result.payload.paymentData
      ) {
        startRazorpayCartPayment({
          razorpayKeyId,
          razorpayOrder: result.payload.paymentData,
          product: { name: "Your Shopping Cart Order" },
          user,
          selectedAddress,
          originalCheckoutData: orderPayloadOnline,
          dispatch,
          placeOnlineOrderThunk: placeOnlineOrderCart,
          navigate,
        });
      } else if (
        result.meta.requestStatus === "fulfilled" &&
        result.payload?.order?._id
      ) {
        toast.success("Order placed successfully.");
        navigate(`/account/orders`);
      } else {
        toast.error(
          "Online order initiation failed: " +
            (result.payload?.message || "Unknown error occurred.")
        );
      }
    }
  };

  if (
    cartStatus === "loading" ||
    (addressLoading && addresses.length === 0) ||
    orderLoading ||
    (paymentMethod === "ONLINE" && razorpayKeyId === null)
  ) {
    return (
      <div className="flex justify-center items-center min-h-[400px] bg-white dark:bg-neutral-900">
        <div className="text-lg dark:text-neutral-100">
          Loading cart and checkout information...
        </div>
      </div>
    );
  }

  // --- Error States ---
  if (cartStatus === "failed") {
    return (
      <div className="flex justify-center items-center min-h-[400px] bg-white dark:bg-neutral-900">
        <div className="font-montserrat text-lg text-red-500 dark:text-red-400">
          Error loading cart: {cartError}. Please Login to View Your Cart.
        </div>
      </div>
    );
  }

  if (orderError) {
    return (
      <div className="flex justify-center items-center min-h-[400px] bg-white dark:bg-neutral-900">
        <div className="font-montserrat text-lg text-red-500 dark:text-red-400">
          Order Processing Error: {orderError}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row py-16 max-w-6xl w-full px-6 mx-auto bg-white dark:bg-neutral-900">
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6 text-gray-900 dark:text-neutral-50">
          Shopping Cart{" "}
          <span className="text-sm text-[var(--primary)] dark:text-emerald-400">
            {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
          </span>
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-10 text-gray-600 dark:text-neutral-300">
            <p className="text-lg">Your cart is empty</p>
            <button
              className="mt-4 !text-[var(--primary)] hover:underline dark:!text-emerald-400 dark:hover:text-emerald-300"
              onClick={() => navigate("/")}
            >
              <svg
                width="15"
                height="11"
                viewBox="0 0 15 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="inline-block mr-2"
              >
                <path
                  d="M14.09 5.5H1M6.143 10 1 5.5 6.143 1"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="dark:stroke-emerald-400"
                />
              </svg>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3 border-b border-gray-200 dark:text-neutral-400 dark:border-neutral-700">
              <p className="text-left">Product Details</p>
              <p className="text-center">Subtotal</p>
              <p className="text-center">Action</p>
            </div>

            {/* AnimatePresence moved here, outside the map */}
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item._id} // Key is now on motion.div
                  initial={{ opacity: 1, height: "auto" }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    padding: 0,
                    margin: 0,
                    transition: { duration: 0.3, ease: "easeOut" },
                  }}
                  transition={{ duration: 0.3, ease: "easeIn" }}
                  className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3 pb-3 border-b border-gray-200 dark:text-neutral-400 dark:border-neutral-700"
                >
                  <div className="flex items-center md:gap-6 gap-3">
                    <div className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden bg-white dark:border-neutral-600 dark:bg-neutral-700">
                      {item.product_id?.images &&
                      item.product_id.images.length > 0 ? (
                        <img
                          className="w-full h-full object-cover"
                          src={item.product_id.images[0]}
                          alt={item.product_id.name || "Product"}
                          onError={(e) => {
                            e.target.style.display = "none";
                            if (e.target.nextSibling) {
                              e.target.nextSibling.style.display = "block";
                            }
                          }}
                        />
                      ) : null}
                      <div
                        className="text-gray-400 text-sm text-center p-2 dark:text-neutral-500"
                        style={{
                          display:
                            !item.product_id?.images ||
                            item.product_id.images.length === 0 ||
                            (item.product_id.images.length > 0 &&
                              !item.product_id.images[0])
                              ? "block"
                              : "none",
                        }}
                      >
                        No Image Available
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 mb-2 dark:text-neutral-100">
                        {item.product_id?.name || "Unknown Product"}
                      </p>
                      <div className="font-normal text-gray-500/70 space-y-1 dark:text-neutral-400">
                        <p>
                          Size:{" "}
                          <span className="dark:text-neutral-300">
                            {item.size || "N/A"}
                          </span>
                        </p>
                        <div className="flex items-center gap-2">
                          <p>Qty:</p>
                          <select
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(item._id, e.target.value)
                            }
                            className="outline-none border border-gray-300 rounded px-2 py-1 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
                          >
                            {Array(10)
                              .fill("")
                              .map((_, i) => (
                                <option key={i} value={i + 1}>
                                  {i + 1}
                                </option>
                              ))}
                          </select>
                        </div>
                        <p className="text-sm">
                          Price: ${" "}
                          <span className="dark:text-neutral-300">
                            {(
                              item.product_id?.offerPrice ||
                              item.product_id?.price ||
                              0
                            ).toFixed(2)}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-center font-semibold text-gray-800 dark:text-neutral-100">
                    ${" "}
                    {(
                      (item.product_id?.offerPrice ||
                        item.product_id?.price ||
                        0) * item.quantity
                    ).toFixed(2)}
                  </p>
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      className="cursor-pointer p-2 hover:bg-red-50 rounded transition-colors dark:hover:bg-red-900/20"
                      title="Remove item"
                    >
                      <svg
                        className="w-5 h-5 text-red-500 dark:text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <button
              className="group cursor-pointer flex items-center mt-8 gap-2 text-[var(--primary)] font-medium dark:text-emerald-400 dark:hover:text-emerald-300"
              onClick={() => navigate("/")}
            >
              <svg
                width="15"
                height="11"
                viewBox="0 0 15 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="inline-block mr-2"
              >
                <path
                  d="M14.09 5.5H1M6.143 10 1 5.5 6.143 1"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="dark:stroke-emerald-400"
                />
              </svg>
              Continue Shopping
            </button>
          </>
        )}
      </div>

      {cartItems.length > 0 && (
        <div
          className="max-w-[360px] h-fit w-full bg-gray-100/40 p-7 max-md:mt-16 border border-gray-300/70 rounded sticky top-[130px]
                       dark:bg-neutral-800 dark:border-neutral-700"
        >
          <h2 className="text-xl font-medium text-gray-900 dark:text-neutral-50">
            Order Summary
          </h2>
          <hr className="border-gray-300 my-5 dark:border-neutral-600" />

          <div className="mb-6">
            <p className="text-sm font-medium uppercase text-gray-700 dark:text-neutral-300">
              Delivery Address
            </p>
            <div className="relative flex justify-between items-start mt-2">
              <p className="text-gray-500 dark:text-neutral-400">
                {selectedAddress
                  ? `${selectedAddress.addressLine1}, ${selectedAddress.city}`
                  : "No address selected"}
              </p>
              <button
                onClick={() => setShowAddress(!showAddress)}
                className="text-[var(--primary)] hover:underline cursor-pointer dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                Change
              </button>
              {showAddress && (
                <div className="absolute top-8 py-1 bg-white border border-gray-300 text-sm w-full z-10 dark:bg-neutral-700 dark:border-neutral-600">
                  {addresses.map((addr) => (
                    <p
                      key={addr._id}
                      onClick={() => {
                        setSelectedAddress(addr);
                        setShowAddress(false);
                      }}
                      className="text-gray-500 p-2 hover:bg-gray-100 cursor-pointer dark:text-neutral-300 dark:hover:bg-neutral-600"
                    >
                      {addr.addressLine1}, {addr.city}
                    </p>
                  ))}
                  <p
                    onClick={() => {
                      navigate("/account/editaddress");
                      setShowAddress(false);
                    }}
                    className="text-indigo-500 text-center cursor-pointer p-2 hover:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
                  >
                    Add address
                  </p>
                </div>
              )}
            </div>

            <p className="text-sm font-medium uppercase mt-6 text-gray-700 dark:text-neutral-300">
              Payment Method
            </p>
            <select
              className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="COD">Cash On Delivery</option>
              <option value="ONLINE">Online Payment</option>
            </select>
          </div>

          <hr className="border-gray-300 my-5 dark:border-neutral-600" />

          <div className="text-gray-500 mt-4 space-y-2 dark:text-neutral-400">
            <p className="flex justify-between">
              <span>Price</span>
              <span className="dark:text-neutral-300">${displaySubtotal}</span>
            </p>
            <p className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="text-green-600 dark:text-emerald-400">Free</span>
            </p>
            <p className="flex justify-between">
              <span>Tax (2%)</span>
              <span className="dark:text-neutral-300">${displayTax}</span>
            </p>
            <hr className="border-gray-300 my-3 dark:border-neutral-600" />
            <p className="flex justify-between text-lg font-medium text-gray-800 dark:text-neutral-100">
              <span>Total Amount:</span>
              <span>${displayTotal}</span>
            </p>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={orderLoading || cartItems.length === 0}
            className="w-full py-3 mt-6 bg-[var(--primary)] text-white font-medium hover:bg-[var(--primary-dark)] active:scale-95 transition duration-300 rounded disabled:bg-gray-400
                       dark:bg-emerald-700 dark:hover:bg-emerald-600 dark:active:scale-95 dark:disabled:bg-neutral-600"
          >
            {orderLoading
              ? "Placing Order..."
              : `Place Order ($${displayTotal})`}
          </button>
          {orderError && (
            <p className="text-red-500 text-sm mt-2 dark:text-red-400">
              {orderError}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;
