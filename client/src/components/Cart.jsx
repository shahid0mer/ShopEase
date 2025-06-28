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
  placeOrderCOD, // Your COD order thunk
  placeOnlineOrderCart, // Your thunk for online cart checkout verification
  placeCartOrder, // Your thunk for initiating the Razorpay order on backend
} from "../Features/Order/orderSlice.js";
import { getAddresses } from "../Features/User/addressSlice.js";
import axios from "axios";
import { RAZOR_KEY } from "../utils/config.js";
import { startRazorpayCartPayment } from "../utils/razorpayHandlerCart.js";

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
    dispatch(getAddresses());
  }, [dispatch]);

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
      alert("Please select a delivery address.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add items before placing an order.");
      return;
    }

    if (paymentMethod === "ONLINE" && !razorpayKeyId) {
      alert("Payment gateway is not ready. Please wait a moment or refresh.");
      return;
    }

    // This array prepares items for the backend, mapping them to
    // { product_id, quantity, seller_id } which is used internally for total calculation
    // and for the `products` array in the `Order` model.
    const itemsForOrder = cartItems.map((item) => ({
      product_id: item.product_id._id, // Assumes product_id is correctly populated with the actual ID
      quantity: item.quantity,
      seller_id: item.product_id.seller_id, // Include seller_id as per your Order model
    }));

    let result;
    if (paymentMethod === "COD") {
      // --- IMPORTANT: Construct payload specifically for placeOrderCOD backend function ---
      const orderPayloadCOD = {
        // `placeOrderCOD` expects an `items` array where each item has a `product` field (the product ID)
        // and `quantity`. It then fetches product details and seller_id on the backend.
        items: itemsForOrder.map((item) => ({
          product: item.product_id,
          quantity: item.quantity,
        })),
        // `placeOrderCOD` expects the full `address` object, not just its ID.
        address: selectedAddress,
      };

      console.log("Order Payload for COD =>", orderPayloadCOD);
      result = await dispatch(placeOrderCOD(orderPayloadCOD)); // Dispatch the COD-specific payload

      if (
        result.meta.requestStatus === "fulfilled" &&
        result.payload?.success
      ) {
        alert("Order placed successfully with Cash On Delivery!");
        // Ensure result.payload.order?._id is available for navigation
        navigate(`/order-success/${result.payload.order?._id || "unknown"}`);
      } else {
        alert(
          "COD order failed: " +
            (result.payload?.message || "Unknown error occurred.")
        );
      }
    } else {
      // ONLINE Payment
      // This payload is used to initiate the Razorpay order on your backend (placeCartOrder thunk)
      // and later for verification (originalCheckoutData).
      const orderPayloadOnline = {
        products: itemsForOrder, // This matches the structure expected by cartCheckout for online
        shippingAddress: selectedAddress._id,
        paymentType: paymentMethod,
        amount: totalPaise, // Total amount in paise for the entire cart, calculated on frontend
        currency: "INR",
        // user_id will be automatically added by the backend from req.user
      };

      console.log("Order Payload for Online =>", orderPayloadOnline);
      result = await dispatch(placeCartOrder(orderPayloadOnline)); // This initiates Razorpay order on backend

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
          originalCheckoutData: orderPayloadOnline, // Pass the full online order payload
          dispatch,
          placeOnlineOrderThunk: placeOnlineOrderCart,
          navigate,
        });
      } else if (
        result.meta.requestStatus === "fulfilled" &&
        result.payload?.order?._id
      ) {
        alert("Order placed successfully (no payment required).");
        navigate(`/order-success/${result.payload.order._id}`);
      } else {
        alert(
          "Online order initiation failed: " +
            (result.payload?.message || "Unknown error occurred.")
        );
      }
    }
  };

  // --- Loading States ---
  if (
    cartStatus === "loading" ||
    addressLoading ||
    orderLoading ||
    (paymentMethod === "ONLINE" && razorpayKeyId === null)
  ) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">Loading cart and checkout information...</div>
      </div>
    );
  }

  // --- Error States ---
  if (cartStatus === "failed") {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="font-montserrat text-lg text-red-500">
          Error loading cart: {cartError}. Please Login to View Your Cart.
        </div>
      </div>
    );
  }

  if (orderError) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="font-montserrat text-lg text-red-500">
          Order Processing Error: {orderError}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row py-16 max-w-6xl w-full px-6 mx-auto ">
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart{" "}
          <span className="text-sm text-[var(--primary)]">
            {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
          </span>
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg">Your cart is empty</p>
            <button
              className="mt-4 !text-[var(--primary)] hover:underline"
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
              <p className="text-left">Product Details</p>
              <p className="text-center">Subtotal</p>
              <p className="text-center">Action</p>
            </div>

            {cartItems.map((item) => (
              <AnimatePresence key={item._id}>
                <motion.div
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
                  className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3 pb-3"
                >
                  <div className="flex items-center md:gap-6 gap-3">
                    <div className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden">
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
                        className="text-gray-400 text-sm text-center p-2"
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
                      <p className="font-semibold text-gray-800 mb-2">
                        {item.product_id?.name || "Unknown Product"}
                      </p>
                      <div className="font-normal text-gray-500/70 space-y-1">
                        <p>
                          Size: <span>{item.size || "N/A"}</span>
                        </p>
                        <div className="flex items-center gap-2">
                          <p>Qty:</p>
                          <select
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(item._id, e.target.value)
                            }
                            className="outline-none border border-gray-300 rounded px-2 py-1"
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
                          Price: $
                          {(
                            item.product_id?.offerPrice ||
                            item.product_id?.price ||
                            0
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-center font-semibold">
                    $
                    {(
                      (item.product_id?.offerPrice ||
                        item.product_id?.price ||
                        0) * item.quantity
                    ).toFixed(2)}
                  </p>
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      className="cursor-pointer p-2 hover:bg-red-50 rounded transition-colors"
                      title="Remove item"
                    >
                      <svg
                        className="w-5 h-5 text-red-500"
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
              </AnimatePresence>
            ))}

            <button
              className="group cursor-pointer flex items-center mt-8 gap-2 text-[var(--primary)] font-medium"
              onClick={() => navigate("/")}
            >
              <svg
                width="15"
                height="11"
                viewBox="0 0 15 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.09 5.5H1M6.143 10 1 5.5 6.143 1"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Continue Shopping
            </button>
          </>
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="max-w-[360px] h-fit w-full bg-gray-100/40 p-7 max-md:mt-16 border border-gray-300/70 rounded sticky top-[130px]">
          <h2 className="text-xl font-medium">Order Summary</h2>
          <hr className="border-gray-300 my-5" />

          <div className="mb-6">
            <p className="text-sm font-medium uppercase">Delivery Address</p>
            <div className="relative flex justify-between items-start mt-2">
              <p className="text-gray-500">
                {selectedAddress
                  ? `${selectedAddress.addressLine1}, ${selectedAddress.city}`
                  : "No address selected"}
              </p>
              <button
                onClick={() => setShowAddress(!showAddress)}
                className="text-[var(--primary)] hover:underline cursor-pointer"
              >
                Change
              </button>
              {showAddress && (
                <div className="absolute top-8 py-1 bg-white border border-gray-300 text-sm w-full z-10">
                  {addresses.map((addr) => (
                    <p
                      key={addr._id}
                      onClick={() => {
                        setSelectedAddress(addr);
                        setShowAddress(false);
                      }}
                      className="text-gray-500 p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {addr.addressLine1}, {addr.city}
                    </p>
                  ))}
                  <p
                    onClick={() => {
                      navigate("/account/editaddress");
                      setShowAddress(false);
                    }}
                    className="text-indigo-500 text-center cursor-pointer p-2 hover:bg-indigo-500/10"
                  >
                    Add address
                  </p>
                </div>
              )}
            </div>

            <p className="text-sm font-medium uppercase mt-6">Payment Method</p>
            <select
              className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="COD">Cash On Delivery</option>
              <option value="ONLINE">Online Payment</option>
            </select>
          </div>

          <hr className="border-gray-300 my-5" />

          <div className="text-gray-500 mt-4 space-y-2">
            <p className="flex justify-between">
              <span>Price</span>
              <span>${displaySubtotal}</span>
            </p>
            <p className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="text-green-600">Free</span>
            </p>
            <p className="flex justify-between">
              <span>Tax (2%)</span>
              <span>${displayTax}</span>
            </p>
            <hr className="border-gray-300 my-3" />
            <p className="flex justify-between text-lg font-medium text-gray-800">
              <span>Total Amount:</span>
              <span>${displayTotal}</span>
            </p>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={orderLoading || cartItems.length === 0}
            className="w-full py-3 mt-6 bg-[var(--primary)] text-white font-medium hover:bg-[var(--primary-dark)] active:scale-95 transition duration-300 rounded disabled:bg-gray-400"
          >
            {orderLoading
              ? "Placing Order..."
              : `Place Order ($${displayTotal})`}
          </button>
          {orderError && (
            <p className="text-red-500 text-sm mt-2">{orderError}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;
