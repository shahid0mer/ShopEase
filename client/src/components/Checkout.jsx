import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  singleProductCheckout,
  placeOrderCOD,
  placeOnlineOrder,
} from "../Features/Order/orderSlice.js";
import { getAddresses } from "../Features/User/addressSlice.js";
import axios from "axios";
import { RAZOR_KEY } from "../utils/config.js";
import { startRazorpayPayment } from "../utils/razorpayHandler";
import { toast } from "sonner";

const Checkout = () => {
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [razorpayKeyId, setRazorpayKeyId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { product } = location.state || {};
  const [productQuantity, setProductQuantity] = useState(
    product ? product.quantity : 1
  );

  const { loading: orderLoading, error: orderError } = useSelector(
    (state) => state.order
  );

  const {
    addresses,
    defaultAddress,
    loading: addressLoading,
  } = useSelector((state) => state.address);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getAddresses());

    const fetchRazorpayKey = async () => {
      try {
        const response = await axios.get(RAZOR_KEY, {
          withCredentials: true,
        });
        if (response.data?.key_id) {
          setRazorpayKeyId(response.data.key_id);
        } else {
          toast.error(
            "Failed to load payment configuration. Please try again."
          );
        }
      } catch (error) {
        toast.error("Error fetching payment configuration. Please try again.");
      }
    };

    fetchRazorpayKey();
  }, [dispatch]);

  useEffect(() => {
    if (defaultAddress) {
      setSelectedAddress(defaultAddress);
    } else if (addresses.length > 0) {
      setSelectedAddress(addresses[0]);
    }
  }, [defaultAddress, addresses]);

  useEffect(() => {
    if (product) {
      setProductQuantity(product.quantity || 1);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-red-500">
          No product selected for checkout.
        </div>
      </div>
    );
  }

  const itemBasePrice = parseFloat(product.offerPrice || product.price || 0);
  const itemPriceInPaise = Math.round(itemBasePrice * 100);
  const subtotalPaise = itemPriceInPaise * productQuantity;
  const taxRate = 0.02;
  const taxPaise = Math.round(subtotalPaise * taxRate);
  const totalPaise = subtotalPaise + taxPaise;

  const displaySubtotal = (subtotalPaise / 100).toFixed(2);
  const displayTax = (taxPaise / 100).toFixed(2);
  const displayTotal = (totalPaise / 100).toFixed(2);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.info("Please select a delivery address.");
      return;
    }

    if (paymentMethod === "ONLINE" && !razorpayKeyId) {
      toast.error("Payment gateway is not ready. Please wait or refresh.");
      return;
    }

    const originalCheckoutData = {
      productId: product._id,
      quantity: productQuantity,
      address: selectedAddress,
      paymentType: paymentMethod,
      amount: totalPaise,
      currency: "INR",
    };

    if (paymentMethod === "COD") {
      const checkoutDataForCOD = {
        items: [{ product: product._id, quantity: productQuantity }],
        address: selectedAddress,
      };
      const result = await dispatch(placeOrderCOD(checkoutDataForCOD));
      if (result.meta.requestStatus === "fulfilled" && result.payload.success) {
        toast.success("Order placed successfully with COD!");
        navigate("/account/orders");
      } else {
        toast.error(
          "Checkout failed: " + (result.payload?.message || "Unknown error")
        );
      }
    } else {
      const result = await dispatch(
        singleProductCheckout(originalCheckoutData)
      );

      if (
        result.meta.requestStatus === "fulfilled" &&
        result.payload?.requiresPayment &&
        result.payload.paymentData
      ) {
        startRazorpayPayment({
          razorpayKeyId,
          razorpayOrder: result.payload.paymentData,
          product,
          user,
          selectedAddress,
          originalCheckoutData,
          dispatch,
          placeOnlineOrderThunk: placeOnlineOrder,
          navigate,
        });
      } else if (result.payload?.order) {
        navigate(`/account/orders`);
      } else {
        toast.error("Online checkout failed. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (
      addressLoading ||
      (paymentMethod === "ONLINE" && razorpayKeyId === null)
    ) {
      const loadingToast = toast.loading("Loading checkout information...", {
        duration: Infinity,
      });

      return () => {
        toast.dismiss(loadingToast);
      };
    }
  }, [addressLoading, paymentMethod, razorpayKeyId]);

  return (
    <div className="flex flex-col md:flex-row py-16 max-w-6xl w-full px-6 mx-auto ">
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Checkout <span className="text-sm text-[var(--primary)]">1 Item</span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        <AnimatePresence>
          <motion.div
            key={product._id}
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
                {product.images && product.images.length > 0 ? (
                  <img
                    className="w-full h-full object-cover"
                    src={product.images[0]}
                    alt={product.name || "Product"}
                  />
                ) : (
                  <div className="text-gray-400 text-sm text-center p-2">
                    No Image Available
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 mb-2 dark:text-neutral-300">
                  {product.name || "Unknown Product"}
                </p>
                <div className="font-normal text-gray-500/70 space-y-1">
                  <p>
                    Size: <span>{product.size || "N/A"}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <p>Qty:</p>
                    <select
                      value={productQuantity}
                      onChange={(e) =>
                        setProductQuantity(Number(e.target.value))
                      }
                      className="border border-gray-300 rounded px-2 py-1 outline-none text-gray-700"
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-sm">Price: ${itemBasePrice.toFixed(2)}</p>
                </div>
              </div>
            </div>
            <p className="text-center font-semibold">${displaySubtotal}</p>
            <div className="flex justify-center"></div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div
        className="max-w-[360px] h-fit w-full bg-gray-100/40 p-7 max-md:mt-16 border border-gray-300/70 rounded sticky top-[130px]
                       dark:bg-neutral-800 dark:border-neutral-700"
      >
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

          <p className="text-sm font-medium uppercase mt-6 text-gray-700 dark:text-neutral-300">
            Payment Method
          </p>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
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
          disabled={orderLoading}
          className="w-full py-3 mt-6 bg-[var(--primary)] text-white font-medium hover:bg-[var(--primary-dark)] active:scale-95 transition duration-300 rounded disabled:bg-gray-400"
        >
          {orderLoading ? "Placing Order..." : `Place Order ($${displayTotal})`}
        </button>
        {orderError && (
          <p className="text-red-500 text-sm mt-2">{orderError}</p>
        )}
      </div>
    </div>
  );
};

export default Checkout;
