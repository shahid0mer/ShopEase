import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders, cancelOrderById } from "../Features/Order/orderSlice";
import { toast } from "sonner";

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

  const handleCancel = (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      dispatch(cancelOrderById(orderId))
        .unwrap()
        .then((res) => {
          toast.success(res.message);
          dispatch(fetchUserOrders(user._id)); // ✅ Refresh orders after cancel
        })
        .catch((err) => toast.error(err));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 dark:bg-[var(--neutral-50)]">
        <p className="text-lg text-gray-700 dark:text-[var(--neutral-700)]">
          Loading your orders...
        </p>
      </div>
    );
  }

  if (error) {
    toast.error(error);
    return null;
  }

  if (!userOrders || userOrders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 dark:bg-[var(--neutral-50)]">
        <p className="text-lg text-gray-600 dark:text-[var(--neutral-500)]">
          You haven't placed any orders yet.
        </p>
      </div>
    );
  }

  return (
    <div className="md:p-10 p-4 space-y-4 dark:bg-[var(--neutral-50)]">
      <h2 className="text-lg font-medium dark:text-[var(--neutral-700)]">
        Orders List
      </h2>
      {userOrders.map((order) => (
        <div
          key={order._id}
          className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center gap-5 p-5 max-w-4xl rounded-md border border-gray-300 text-gray-800 dark:border-[var(--neutral-200)] dark:bg-[var(--neutral-50)] dark:text-[var(--neutral-700)]"
        >
          {/* Products */}
          <div className="flex flex-col gap-3">
            {order.products?.length > 0 ? (
              order.products.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded overflow-hidden dark:border-[var(--neutral-200)]">
                    {item.product_id?.images?.[0] ? (
                      <img
                        src={item.product_id.images[0]}
                        alt={item.product_id.name || "Product"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={boxIcon}
                        alt="Box Icon"
                        className="w-10 h-10 opacity-60 object-contain"
                      />
                    )}
                  </div>
                  <div className="flex flex-col flex-grow">
                    <p className="font-medium dark:text-[var(--neutral-700)]">
                      {item.product_id?.name || "Unknown Product"}{" "}
                      {item.quantity > 1 && (
                        <span className="text-indigo-500 dark:text-indigo-300">
                          x{item.quantity}
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-[var(--neutral-500)]">
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
              <p className="text-gray-500 dark:text-[var(--neutral-500)]">
                No items in this order.
              </p>
            )}
          </div>

          {/* Address */}
          <div className="text-sm dark:text-[var(--neutral-500)]">
            {order.shippingAddress ? (
              <>
                <p className="font-medium mb-1 dark:text-[var(--neutral-700)]">
                  {order.shippingAddress.name}
                </p>
                <p>
                  {order.shippingAddress.addressLine1},{" "}
                  {order.shippingAddress.city}, {order.shippingAddress.state},{" "}
                  {order.shippingAddress.pincode},{" "}
                  {order.shippingAddress.country}
                </p>
              </>
            ) : (
              <p className="text-gray-500">No address</p>
            )}
          </div>

          {/* Amount */}
          <p className="font-medium text-base my-auto text-black/70 dark:text-[var(--neutral-800)]">
            ${(order.amount / 100).toFixed(2)}
          </p>

          {/* Payment + Cancel */}
          <div className="flex flex-col gap-1 text-sm dark:text-[var(--neutral-500)]">
            <p>Method: {order.paymentType}</p>
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
            <p>Status: {order.status}</p>

            {/* Cancel button if allowed */}
            {order.status !== "Delivered" && order.status !== "Cancelled" && (
              <button
                onClick={() => handleCancel(order._id)}
                className="mt-2 text-sm w-fit px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
