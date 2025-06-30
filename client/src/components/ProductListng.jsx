import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getSellerProducts,
  updateProductStock,
} from "../Features/Product/productSlice.js";
import { motion } from "framer-motion";
import { toast } from "sonner";

const ProductListng = () => {
  const dispatch = useDispatch();
  const { sellerProducts, loading, error } = useSelector(
    (state) => state.product
  );
  const { user } = useSelector((state) => state.auth);

  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (user && user._id) {
      dispatch(getSellerProducts(user._id));
    }
  }, [user, dispatch]);

  const handleStockToggle = (productId, checked) => {
    setUpdatingId(productId);
    dispatch(updateProductStock({ productId, inStock: checked }))
      .unwrap()
      .catch((err) => {
        console.error("Stock update failed:", err);
        toast.error("Failed to update stock.");
      })
      .finally(() => setUpdatingId(null));
  };

  const productsToDisplay = sellerProducts;

  return (
    <div className="py-8 md:py-16 flex flex-col justify-between w-full h-full bg-white dark:bg-neutral-900">
      <div className="w-full h-full p-2 sm:p-4 md:p-8 lg:p-16 overflow-x-auto">
        <h2 className="pb-4 md:pb-8 text-xl sm:text-2xl md:text-3xl font-medium text-gray-800 dark:text-white">
          All Products
        </h2>

        {/* Mobile Card View */}
        <div className="block md:hidden space-y-4">
          {error ? (
            <div className="text-center py-8 text-red-500 dark:text-red-400 bg-white dark:bg-neutral-800 border border-gray-500/20 dark:border-neutral-700 rounded-lg">
              Error: {error.message || "An unknown error occurred."}
            </div>
          ) : productsToDisplay && productsToDisplay.length > 0 ? (
            productsToDisplay.map((product) => (
              <motion.div
                key={product._id}
                initial={false}
                animate={{
                  opacity: product.inStock ? 1 : 0.6,
                }}
                className={`bg-white dark:bg-neutral-800 border border-gray-500/20 dark:border-neutral-700 rounded-lg p-4 ${
                  !product.inStock ? "opacity-60" : ""
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start space-x-4 flex-1 min-w-0">
                    <div className="border border-gray-300 p-2 dark:border-neutral-600 dark:bg-neutral-800 shrink-0 rounded">
                      <img
                        src={
                          product.images[0] ||
                          "https://placehold.co/64x64/E2E8F0/A0AEC0?text=No+Image"
                        }
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/64x64/E2E8F0/A0AEC0?text=Error";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-medium text-gray-700 dark:text-neutral-200 truncate">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
                        {product.category_id?.name ||
                          product.category_id ||
                          "N/A"}
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white mt-2">
                        ${product.offerPrice?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full border-t border-gray-200 dark:border-neutral-700 pt-4 overflow-visible">
                    <span className="text-sm font-medium text-gray-700 dark:text-neutral-200">
                      In Stock
                    </span>
                    {updatingId === product._id ? (
                      <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin dark:border-blue-500 dark:border-t-transparent" />
                    ) : (
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={product.inStock}
                          onChange={(e) =>
                            handleStockToggle(product._id, e.target.checked)
                          }
                        />
                        <div className="relative w-12 h-7 bg-slate-300 dark:bg-neutral-600 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200">
                          <span className="absolute left-1 top-1 w-5 h-5 bg-white dark:bg-neutral-300 rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-[1.25rem] shadow-sm" />
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : loading ? (
            <div className="text-center py-8 text-gray-500 dark:text-neutral-400 bg-white dark:bg-neutral-800 border border-gray-500/20 dark:border-neutral-700 rounded-lg">
              Loading products...
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-neutral-400 bg-white dark:bg-neutral-800 border border-gray-500/20 dark:border-neutral-700 rounded-lg">
              No products found for this seller.
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block w-full bg-white dark:bg-neutral-800 border border-gray-500/20 dark:border-neutral-700 rounded-lg overflow-x-auto">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] table-auto">
              <thead className="text-gray-900 dark:text-neutral-200 text-base lg:text-lg text-left">
                <tr>
                  <th className="px-4 lg:px-8 py-4 lg:py-6 font-semibold">
                    Product
                  </th>
                  <th className="px-4 lg:px-8 py-4 lg:py-6 font-semibold">
                    Category
                  </th>
                  <th className="px-4 lg:px-8 py-4 lg:py-6 font-semibold">
                    Price
                  </th>
                  <th className="px-4 lg:px-8 py-4 lg:py-6 font-semibold">
                    Stock
                  </th>
                </tr>
              </thead>
              <tbody className="text-base lg:text-lg text-gray-500 dark:text-neutral-400">
                {error ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-8 text-red-500 dark:text-red-400"
                    >
                      Error: {error.message || "An unknown error occurred."}
                    </td>
                  </tr>
                ) : productsToDisplay && productsToDisplay.length > 0 ? (
                  productsToDisplay.map((product) => (
                    <motion.tr
                      key={product._id}
                      initial={false}
                      animate={{
                        opacity: product.inStock ? 1 : 0.6,
                      }}
                      className={`border-t border-gray-500/20 dark:border-neutral-700 ${
                        !product.inStock
                          ? "bg-gray-100 dark:bg-neutral-700"
                          : "dark:bg-neutral-800"
                      }`}
                    >
                      <td className="px-4 lg:px-8 py-4 lg:py-6 dark:bg-neutral-800">
                        <div className="flex items-center space-x-4 lg:space-x-6">
                          <div className="border border-gray-300 p-2 lg:p-4 dark:border-neutral-600 dark:bg-neutral-800 shrink-0 rounded">
                            <img
                              src={
                                product.images[0] ||
                                "https://placehold.co/64x64/E2E8F0/A0AEC0?text=No+Image"
                              }
                              alt={product.name}
                              className="w-16 lg:w-24 h-16 lg:h-24 object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://placehold.co/64x64/E2E8F0/A0AEC0?text=Error";
                              }}
                            />
                          </div>
                          <span className="text-sm lg:text-base text-gray-700 dark:text-neutral-200 min-w-0 flex-1">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 lg:px-8 py-4 lg:py-6 dark:bg-neutral-800 text-sm lg:text-base">
                        {product.category_id?.name ||
                          product.category_id ||
                          "N/A"}
                      </td>
                      <td className="px-4 lg:px-8 py-4 lg:py-6 dark:bg-neutral-800 text-sm lg:text-base">
                        ${product.offerPrice?.toFixed(2) || "0.00"}
                      </td>
                      <td className="px-4 lg:px-8 py-4 lg:py-6 dark:bg-neutral-800">
                        {updatingId === product._id ? (
                          <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto dark:border-blue-500 dark:border-t-transparent" />
                        ) : (
                          <label className="relative inline-flex items-center cursor-pointer shrink-0">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={product.inStock}
                              onChange={(e) =>
                                handleStockToggle(product._id, e.target.checked)
                              }
                            />
                            <div className="relative w-12 h-7 lg:w-16 lg:h-9 bg-slate-300 dark:bg-neutral-600 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200">
                              <span className="absolute left-1 top-1 w-5 h-5 lg:w-7 lg:h-7 bg-white dark:bg-neutral-300 rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-[1.25rem] lg:peer-checked:translate-x-[1.75rem] shadow-sm" />
                            </div>
                          </label>
                        )}
                      </td>
                    </motion.tr>
                  ))
                ) : loading ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-8 text-gray-500 dark:text-neutral-400"
                    >
                      Loading products...
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-8 text-gray-500 dark:text-neutral-400"
                    >
                      No products found for this seller.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListng;
