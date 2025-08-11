import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCartAsync } from "../Features/Cart/cartSlice";

import { toast } from "sonner";

const ProductGrid = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log("Received product:", product);

  const { filteredProducts = [], loading } = useSelector(
    (state) => state.product
  );
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleAddToCart = (product) => {
    dispatch(addToCartAsync({ product_id: product._id, quantity: 1 }));
    if (!isAuthenticated) {
      toast.error("Please sign in to add to Cart");
    } else {
      toast.success(`${product.name} added to cart`);
    }
  };

  const productsToDisplay =
    filteredProducts?.filter(
      (product) => product !== null && product.inStock !== false
    ) || [];

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
      {loading ? (
        <p className="text-center col-span-full dark:text-white">Loading...</p> // Dark mode text
      ) : productsToDisplay?.length === 0 ? (
        <p className="text-center col-span-full dark:text-white">
          No products found.
        </p> // Dark mode text
      ) : (
        productsToDisplay
          .filter((product) => product !== null && product.inStock !== false)
          .map((product) => (
            <div
              key={product._id}
              className="border border-gray-200 p-3 sm:p-4 flex flex-col justify-between items-center shadow-sm hover:shadow-md transition-shadow h-full
                         dark:border-neutral-700 dark:bg-neutral-800 dark:shadow-neutral-900/30 dark:hover:shadow-neutral-900/50" // Dark mode card
            >
              {/* Image */}
              <div
                className="w-full h-48 xs:h-40 sm:h-48 md:h-52 mb-3 flex items-center justify-center cursor-pointer"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <img
                  className="object-contain max-h-full max-w-full transition-transform duration-300 hover:scale-105"
                  src={product.images[0]}
                  alt={product.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/300x300?text=No+Image";
                  }}
                />
              </div>

              {/* Name */}
              <h3
                className="text-center font-medium text-base sm:text-lg text-gray-800 mb-2 px-1 line-clamp-2 cursor-pointer
                           dark:text-neutral-100" // Dark mode text
                onClick={() => navigate(`/product/${product._id}`)}
              >
                {product.name}
              </h3>

              {/* Prices */}
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <span
                  className="text-green-600 font-bold text-base sm:text-lg
                                 dark:text-emerald-400"
                >
                  {" "}
                  {/* Dark mode green text */}${product.offerPrice}
                </span>
                <span
                  className="relative text-[var(--neutral-500)] text-xs sm:text-sm line-through
                                 dark:text-neutral-400"
                >
                  {" "}
                  {/* Dark mode line-through text */}${product.price}
                </span>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 sm:gap-3 w-full mt-auto">
                <button
                  className="flex items-center justify-center bg-[var(--primary-light)] p-2 sm:p-3 hover:bg-[var(--primary)] transition duration-300 active:scale-95 w-[50px]
                             dark:bg-emerald-700 dark:hover:bg-emerald-600" // Dark mode background for cart button
                  onClick={() => handleAddToCart(product)}
                  aria-label="Add to cart"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="-1 -1 32 32"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    stroke="#000000" // Original stroke color
                    height="32"
                    width="32"
                    className="dark:stroke-white" // Dark mode stroke color for SVG
                  >
                    <path
                      d="M13.125 12.5h5m-2.5 -2.5v5m5 11.25a1.875 1.875 0 1 0 0 -3.75 1.875 1.875 0 0 0 0 3.75m-10 0a1.875 1.875 0 1 0 0 -3.75 1.875 1.875 0 0 0 0 3.75M4.6375 6.75h19.0175c1.7225 0 2.96625 1.5875 2.49375 3.185l-2.0675 7c-.31875 1.26-1.33625 2-2.49375 2H10.14c-1.15875 0 -2.1775 -.74125 -2.495 -1.815zm0 0L3.75 3.75"
                      strokeWidth="2"
                    ></path>
                  </svg>
                </button>

                <button
                  className="flex-1 bg-[var(--secondary)] text-white font-medium text-sm sm:text-base py-2 sm:py-3 px-2 sm:px-4 hover:bg-[var(--secondary-dark)] transition duration-300 active:scale-95
                             dark:bg-amber-600 dark:hover:bg-amber-500" // Dark mode background for checkout button
                  onClick={() => {
                    navigate("/checkout", {
                      state: {
                        product: {
                          ...product,
                          quantity: 1,
                        },
                      },
                    });
                  }}
                >
                  Check Out
                </button>
              </div>
            </div>
          ))
      )}
    </div>
  );
};

export default ProductGrid;
