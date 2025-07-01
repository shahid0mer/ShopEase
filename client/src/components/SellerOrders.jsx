import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellerOrders } from "../Features/Order/orderSlice";
import { toast } from "sonner";

const SellerOrders = () => {
  const dispatch = useDispatch();

  const {
    sellerOrders: orders,
    loading,
    error,
  } = useSelector((state) => state.order);

  console.log("Orders from Redux:", orders);

  useEffect(() => {
    dispatch(fetchSellerOrders());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <div className="p-4 dark:bg-[var(--neutral-50)] dark:text-[var(--neutral-700)]">
      <h2 className="text-xl font-bold mb-4">My Product Orders</h2>

      {loading && <p>Loading orders...</p>}

      {!loading && orders?.length === 0 && (
        <p className="text-sm text-gray-500">No orders found.</p>
      )}

      <div className="space-y-4">
        {orders?.map((order) => (
          <div
            key={order._id}
            className="border rounded-lg p-4 shadow-md bg-white dark:bg-[var(--neutral-100)]"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-base">
                Order #{order._id.slice(-6)}
              </h3>
              <span
                className={`text-sm px-2 py-1 rounded-full ${
                  order.status === "Cancelled"
                    ? "bg-red-100 text-red-600"
                    : order.status === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.status}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-1">
              Buyer: <strong>{order.user_id?.name}</strong> (
              {order.user_id?.email})
            </p>
            <p className="text-sm text-gray-600 mb-3">
              Ordered on: {new Date(order.createdAt).toLocaleString()}
            </p>

            <div className="border-t pt-3 space-y-2">
              {order.products.map((product) => (
                <div
                  key={product.product_id?._id}
                  className="flex items-center gap-3"
                >
                  <img
                    src={product.product_id?.images?.[0]}
                    alt={product.product_id?.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="text-sm font-medium">
                      {product.product_id?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {product.quantity} | Price: ₹
                      {product.product_id?.offerPrice}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerOrders;
