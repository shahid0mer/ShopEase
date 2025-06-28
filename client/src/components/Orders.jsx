import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "../Features/Order/orderSlice"; // Adjust the import path as needed

const Orders = () => {
  const boxIcon =
    "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/boxIcon.svg";

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { userOrders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    if (user && user._id) {
      dispatch(fetchUserOrders(user._id));
    }
  }, [dispatch, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-700">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-red-500">
          Error: {error}. Please try again.
        </p>
      </div>
    );
  }

  if (!userOrders || userOrders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-600">
          You haven't placed any orders yet.
        </p>
      </div>
    );
  }

  return (
    <div className="md:p-10 p-4 space-y-4">
      <h2 className="text-lg font-medium">Orders List</h2>
      {console.log(
        "Orders.jsx: Value of userOrders before map:",
        userOrders,
        typeof userOrders,
        Array.isArray(userOrders)
      )}
      {userOrders.map((order) => (
        <div
          key={order._id}
          className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center gap-5 p-5 max-w-4xl rounded-md border border-gray-300 text-gray-800"
        >
          {/* Main Product/Items Column - Re-structured */}
          <div className="flex flex-col gap-3">
            {" "}
            {/* Use flex-col for stacked items */}
            {order.products && order.products.length > 0 ? (
              order.products.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center gap-3">
                  {" "}
                  {/* Individual product row */}
                  {/* Product Image */}
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center border border-gray-300 rounded overflow-hidden">
                    {item.product_id?.images?.[0] ? (
                      <img
                        className="w-full h-full object-cover"
                        src={item.product_id.images[0]}
                        alt={item.product_id.name || "Product Image"}
                      />
                    ) : (
                      <img
                        className="w-10 h-10 object-contain opacity-60"
                        src={boxIcon}
                        alt="boxIcon"
                      />
                    )}
                  </div>
                  {/* Product Name, Quantity, and Price */}
                  <div className="flex flex-col flex-grow">
                    {" "}
                    {/* Use a div for name and price, stacked */}
                    <p className="font-medium">
                      {item.product_id?.name || "Unknown Product"}{" "}
                      {item.quantity > 1 && (
                        <span className="text-indigo-500">
                          x {item.quantity}
                        </span>
                      )}
                    </p>
                    {/* Display individual item price */}
                    <p className="text-sm text-gray-600">
                      $
                      {(
                        item.product_id?.offerPrice ||
                        item.product_id?.price ||
                        0
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No items in this order.</p>
            )}
          </div>

          {/* Display shipping address details */}
          <div className="text-sm">
            {order.shippingAddress ? (
              <>
                <p className="font-medium mb-1">{order.shippingAddress.name}</p>
                <p>
                  {order.shippingAddress.addressLine1},{" "}
                  {order.shippingAddress.city}, {order.shippingAddress.state},{" "}
                  {order.shippingAddress.pincode},{" "}
                  {order.shippingAddress.country}
                </p>
              </>
            ) : (
              <p className="text-gray-500">Shipping address not available.</p>
            )}
          </div>

          {/* Display total amount */}
          <p className="font-medium text-base my-auto text-black/70">
            ${(order.amount / 100).toFixed(2)}{" "}
            {/* Assuming amount is in paise, convert to dollars/rupees */}
          </p>

          {/* Display payment details and date */}
          <div className="flex flex-col text-sm">
            <p>Method: {order.paymentType}</p>
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
            <p>Status: {order.status}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
