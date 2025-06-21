import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  updateQuantity,
  fetchCartAsync,
} from "../Features/Cart/cartSlice.js";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

const Cart = () => {
  const [showAddress, setShowAddress] = useState(false);
  const dispatch = useDispatch();
  const { cartItems, status, error } = useSelector((state) => state.cart);
  const navigate = useNavigate();

  // Fetch cart on component mount
  useEffect(() => {
    dispatch(fetchCartAsync());
  }, [dispatch]);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (total, item) =>
      total +
      (item.product_id?.offerPrice || item.product_id?.price || 0) *
        item.quantity,
    0
  );
  const tax = Math.round(subtotal * 0.02);
  const total = subtotal + tax;

  const handleQuantityChange = (itemId, newQuantity) => {
    dispatch(
      updateQuantity({ itemId: itemId, quantity: parseInt(newQuantity) })
    );
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">Loading cart...</div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="font-montserrat  text-lg text-red-500">
          Please Login to View Your Cart
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

            <button className="mt-4 !text-[var(--primary)] hover:underline">
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
              <AnimatePresence>
                <motion.div
                  key={item._id}
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
                  className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3  pb-3"
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
                            e.target.nextSibling.style.display = "block";
                          }}
                        />
                      ) : null}

                      <div
                        className="text-gray-400 text-sm text-center p-2"
                        style={{
                          display:
                            item.product_id?.images?.length > 0 &&
                            item.product_id.images[0]
                              ? "none"
                              : "block",
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
                            {Array(10) // Allow quantities up to 10
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
                          {item.product_id?.offerPrice ||
                            item.product_id?.price ||
                            0}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-center font-semibold">
                    $
                    {(item.product_id?.offerPrice ||
                      item.product_id?.price ||
                      0) * item.quantity}
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
        <div className="max-w-[360px] h-[550px] w-full bg-gray-100/40 p-7 max-md:mt-16 border border-gray-300/70 rounded sticky top-[130px]">
          <h2 className="text-xl font-medium">Order Summary</h2>
          <hr className="border-gray-300 my-5" />

          <div className="mb-6">
            <p className="text-sm font-medium uppercase">Delivery Address</p>
            <div className="relative flex justify-between items-start mt-2">
              <p className="text-gray-500">No address found</p>{" "}
              <button
                onClick={() => setShowAddress(!showAddress)}
                className="text-[var(--primary)] hover:underline cursor-pointer"
              >
                Change
              </button>
              {showAddress && (
                <div className="absolute top-8 py-1 bg-white border border-gray-300 text-sm w-full z-10">
                  {" "}
                  <p
                    onClick={() => {
                      //
                      setShowAddress(false);
                    }}
                    className="text-gray-500 p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    New York, USA
                  </p>
                  <p
                    onClick={() => {
                      //
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
            <select className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none">
              <option value="COD">Cash On Delivery</option>
              <option value="Online">Online Payment</option>
            </select>
          </div>

          <hr className="border-gray-300 my-5" />

          <div className="text-gray-500 mt-4 space-y-2">
            <p className="flex justify-between">
              <span>Price</span>
              <span>${subtotal.toFixed(2)}</span>{" "}
              {/* Format to 2 decimal places */}
            </p>
            <p className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="text-green-600">Free</span>
            </p>
            <p className="flex justify-between">
              <span>Tax (2%)</span>
              <span>${tax.toFixed(2)}</span> {/* Format to 2 decimal places */}
            </p>
            <hr className="border-gray-300 my-3" />{" "}
            {/* Added missing hr based on original code flow */}
            <p className="flex justify-between text-lg font-medium text-gray-800">
              <span>Total Amount:</span>
              <span>${total.toFixed(2)}</span>{" "}
              {/* Format to 2 decimal places */}
            </p>
          </div>

          <button className="w-full py-3 mt-6 bg-[var(--primary)] text-white font-medium hover:bg-[var(--primary-dark)] active:scale-95 transition duration-300 rounded">
            Place Order (${total.toFixed(2)}) {/* Format to 2 decimal places */}
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
