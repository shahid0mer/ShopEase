import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getSellerProducts,
  updateProductStock,
} from "../Features/Product/productSlice.js";
import { toast } from "sonner";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const maxPageButtons = 5;

  const getPageNumbers = () => {
    const half = Math.floor(maxPageButtons / 2);
    let startPage = Math.max(1, currentPage - half);
    let endPage = Math.min(totalPages, currentPage + half);

    if (endPage - startPage + 1 < maxPageButtons) {
      if (currentPage <= half) {
        endPage = Math.min(totalPages, maxPageButtons);
      } else {
        startPage = Math.max(1, totalPages - maxPageButtons + 1);
      }
    }

    const pages = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );

    if (pages[0] > 1) {
      pages.unshift("...");
      pages.unshift(1);
    }

    if (pages[pages.length - 1] < totalPages) {
      pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center mt-8">
      <div className="flex items-center gap-2 text-sm text-gray-300">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-full p-2 disabled:opacity-50 hover:bg-gray-700"
          aria-label="Previous page"
        >
          ←
        </button>

        {pageNumbers.map((page, idx) =>
          page === "..." ? (
            <span key={`ellipsis-${idx}`} className="px-2">
              ...
            </span>
          ) : (
            <button
              key={`page-${page}`}
              onClick={() => onPageChange(page)}
              className={`h-8 w-8 flex items-center justify-center rounded-full text-sm transition-all duration-200 ${
                page === currentPage
                  ? "bg-gray-600 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-full p-2 disabled:opacity-50 hover:bg-gray-700"
          aria-label="Next page"
        >
          →
        </button>
      </div>
    </div>
  );
};

const ProductListng = () => {
  const dispatch = useDispatch();
  const { sellerProducts, loading, error } = useSelector(
    (state) => state.product
  );
  const { user } = useSelector((state) => state.auth);

  const [updatingId, setUpdatingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = sellerProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(sellerProducts.length / itemsPerPage);

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 bg-white dark:bg-neutral-900">
        <p className="text-lg text-red-500 dark:text-red-400">
          Error: {error.message || "An unknown error occurred."}
        </p>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-16 flex flex-col justify-between w-full h-full bg-white dark:bg-neutral-900">
      <div className="w-full h-full p-2 sm:p-4 md:p-8 lg:p-16">
        <h2 className="pb-4 md:pb-8 text-xl sm:text-2xl md:text-3xl font-medium text-gray-800 dark:text-white">
          All Products
        </h2>

        {/* Responsive Product Cards */}
        <div className="space-y-4">
          {currentProducts && currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <div
                key={product._id}
                className={`flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center gap-5 p-5 max-w-full rounded-md border border-gray-300 dark:border-neutral-700 ${
                  !product.inStock
                    ? "bg-gray-100 dark:bg-neutral-700"
                    : "bg-white dark:bg-neutral-800"
                }`}
              >
                {/* Product Info */}
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center border border-gray-300 dark:border-neutral-600 rounded overflow-hidden shrink-0">
                    <img
                      src={
                        product.images[0] ||
                        "https://placehold.co/64x64/E2E8F0/A0AEC0?text=No+Image"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/64x64/E2E8F0/A0AEC0?text=Error";
                      }}
                    />
                  </div>
                  <div className="flex flex-col flex-grow min-w-0">
                    <p className="font-medium text-gray-700 dark:text-neutral-200 text-sm md:text-base">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-neutral-400 md:hidden">
                      Category:{" "}
                      {product.category_id?.name ||
                        product.category_id ||
                        "N/A"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-neutral-400 md:hidden">
                      Price: ${product.offerPrice?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                </div>

                {/* Category - Hidden on mobile */}
                <div className="hidden md:block text-sm text-gray-600 dark:text-neutral-400">
                  {product.category_id?.name || product.category_id || "N/A"}
                </div>

                {/* Price - Hidden on mobile */}
                <div className="hidden md:block text-sm text-gray-600 dark:text-neutral-400">
                  ${product.offerPrice?.toFixed(2) || "0.00"}
                </div>

                {/* Stock Toggle */}
                <div className="flex items-center justify-between md:justify-start gap-2">
                  <span className="text-sm text-gray-600 dark:text-neutral-400 md:hidden">
                    Stock Status:
                  </span>
                  <div className="flex items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={product.inStock}
                        onChange={(e) =>
                          handleStockToggle(product._id, e.target.checked)
                        }
                      />
                      <div className="relative w-12 h-7 bg-slate-300 peer-checked:bg-blue-600 dark:bg-neutral-600 rounded-full transition-colors duration-200"></div>
                      <span className="absolute left-1 top-1 w-5 h-5 bg-white dark:bg-neutral-300 rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-[1.25rem] shadow-sm pointer-events-none" />
                    </label>
                    {updatingId === product._id && (
                      <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin dark:border-blue-500 dark:border-t-transparent" />
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin dark:border-blue-500 dark:border-t-transparent" />
              <span className="ml-3 text-gray-600 dark:text-neutral-400">
                Loading products...
              </span>
            </div>
          ) : (
            <div className="flex justify-center items-center py-8">
              <p className="text-lg text-gray-600 dark:text-neutral-400">
                No products found for this seller.
              </p>
            </div>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ProductListng;
