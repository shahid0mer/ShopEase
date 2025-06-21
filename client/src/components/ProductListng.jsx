import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getSellerProducts,
  updateProductStock,
} from "../Features/Product/productSlice.js";
import { motion } from "motion/react";

const ProductListng = () => {
  const dispatch = useDispatch();
  const { sellerProducts, loading, error } = useSelector(
    (state) => state.product
  );
  const { user } = useSelector((state) => state.auth);

  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (user) {
      dispatch(getSellerProducts(user._id));
    }
  }, [user]);

  const handleStockToggle = (productId, checked) => {
    setUpdatingId(productId);
    dispatch(updateProductStock({ productId, inStock: checked }))
      .unwrap()
      .catch((err) => console.error("Stock update failed:", err))
      .finally(() => setUpdatingId(null));
  };

  const productsToDisplay = sellerProducts;

  return (
    <div className="py-16 flex flex-col justify-between w-full h-full">
      <div className="w-full h-full md:p-16 p-8">
        <h2 className="pb-8 text-3xl font-medium">All Products</h2>
        <div className="flex flex-col items-center w-full min-w-[800px] max-w-[1200px] overflow-hidden bg-white border border-gray-500/20">
          <table className="w-full min-w-[800px] table-auto">
            <thead className="text-gray-900 text-lg text-left">
              <tr>
                <th className="px-8 py-6 font-semibold truncate">Product</th>
                <th className="px-8 py-6 font-semibold truncate">Category</th>
                <th className="px-8 py-6 font-semibold truncate hidden md:block">
                  Selling Price
                </th>
                <th className="px-8 py-6 font-semibold truncate">In Stock</th>
              </tr>
            </thead>
            <tbody className="text-lg text-gray-500">
              {error ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-red-500">
                    Error: {error.message}
                  </td>
                </tr>
              ) : productsToDisplay && productsToDisplay.length > 0 ? (
                productsToDisplay.map((product) => (
                  <motion.tr
                    initial={false}
                    animate={{
                      backgroundColor: product.inStock
                        ? "rgba(255, 255, 255, 1)"
                        : "rgba(243, 244, 246, 1)",
                      opacity: product.inStock ? 1 : 0.6,
                    }}
                    key={product._id}
                    className={`border-t border-gray-500/20 ${
                      !product.inStock ? "bg-gray-100 opacity-60" : ""
                    }`}
                  >
                    <td className="md:px-8 pl-4 md:pl-8 py-6 flex items-center space-x-6 truncate">
                      <div className="border border-gray-300 p-4">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-24"
                        />
                      </div>
                      <span className="truncate max-sm:hidden w-full text-lg">
                        {product.name}
                      </span>
                    </td>

                    <td className="px-8 py-6">
                      {product.category_id?.name ||
                        product.category_id ||
                        "N/A"}
                    </td>
                    <td className="px-8 py-6 max-sm:hidden">
                      ${product.offerPrice}
                    </td>
                    <td className="px-8 py-6">
                      {updatingId === product._id ? (
                        <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />
                      ) : (
                        <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-6">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked={product.inStock}
                            onChange={(e) =>
                              handleStockToggle(product._id, e.target.checked)
                            }
                          />
                          <div className="w-16 h-9 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200" />
                          <span className="dot absolute left-1 top-1 w-7 h-7 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-7" />
                        </label>
                      )}
                    </td>
                  </motion.tr>
                ))
              ) : loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    Loading products...
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No products found for this seller.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductListng;
