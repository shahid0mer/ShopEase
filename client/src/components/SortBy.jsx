import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const SortBy = ({ onSortChange }) => {
  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
  const [isDiscountDropdownOpen, setIsDiscountDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSort = (value) => {
    onSortChange(value);
    // Close all dropdowns after selection
    setIsPriceDropdownOpen(false);
    setIsDiscountDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden bg-white p-4 border border-gray-200 shadow-sm mt-14 w-full flex justify-between items-center
                   dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-900/30" // Dark mode: background, border, shadow
      >
        <span
          className="text-sm font-medium text-gray-700
                         dark:text-neutral-300"
        >
          {" "}
          {/* Dark mode: text color */}
          Sort Options
        </span>
        {isMobileMenuOpen ? (
          <FaChevronUp className="text-xs dark:text-neutral-300" /> // Dark mode: icon color
        ) : (
          <FaChevronDown className="text-xs dark:text-neutral-300" /> // Dark mode: icon color
        )}
      </button>

      {/* Desktop */}
      <div
        className="hidden lg:block bg-white p-4 border border-gray-200 shadow-sm mt-14 mx-auto
                      dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-900/30"
      >
        {" "}
        {/* Dark mode: background, border, shadow */}
        <div
          className="flex items-center space-x-6 text-gray-700
                        dark:text-neutral-300"
        >
          {" "}
          {/* Dark mode: text color */}
          <div className="relative">
            <button
              onClick={() => {
                setIsPriceDropdownOpen(!isPriceDropdownOpen);
                setIsDiscountDropdownOpen(false); // Close other dropdown
              }}
              className="flex items-center text-sm font-medium hover:text-emerald-600
                         dark:hover:text-emerald-400" // Dark mode: hover text color
            >
              Price
              {isPriceDropdownOpen ? (
                <FaChevronUp className="ml-1 text-xs dark:text-neutral-300" /> // Dark mode: icon color
              ) : (
                <FaChevronDown className="ml-1 text-xs dark:text-neutral-300" /> // Dark mode: icon color
              )}
            </button>
            {isPriceDropdownOpen && (
              <div
                className="absolute top-full left-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10
                              dark:bg-neutral-700 dark:border-neutral-600 dark:shadow-lg dark:shadow-neutral-900/30"
              >
                {" "}
                {/* Dark mode: dropdown background, border, shadow */}
                <button
                  onClick={() => handleSort("price_asc")}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100
                             dark:text-neutral-200 dark:hover:bg-neutral-600" // Dark mode: text color, hover background
                >
                  Price: Low to High
                </button>
                <button
                  onClick={() => handleSort("price_desc")}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100
                             dark:text-neutral-200 dark:hover:bg-neutral-600" // Dark mode: text color, hover background
                >
                  Price: High to Low
                </button>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => {
                setIsDiscountDropdownOpen(!isDiscountDropdownOpen);
                setIsPriceDropdownOpen(false); // Close other dropdown
              }}
              className="flex items-center text-sm font-medium hover:text-emerald-600
                         dark:hover:text-emerald-400" // Dark mode: hover text color
            >
              Discount
              {isDiscountDropdownOpen ? (
                <FaChevronUp className="ml-1 text-xs dark:text-neutral-300" /> // Dark mode: icon color
              ) : (
                <FaChevronDown className="ml-1 text-xs dark:text-neutral-300" /> // Dark mode: icon color
              )}
            </button>
            {isDiscountDropdownOpen && (
              <div
                className="absolute top-full left-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10
                              dark:bg-neutral-700 dark:border-neutral-600 dark:shadow-lg dark:shadow-neutral-900/30"
              >
                {" "}
                {/* Dark mode: dropdown background, border, shadow */}
                <button
                  onClick={() => handleSort("highestDiscount")}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100
                             dark:text-neutral-200 dark:hover:bg-neutral-600" // Dark mode: text color, hover background
                >
                  Highest Discount
                </button>
                <button
                  onClick={() => handleSort("lowestDiscount")}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100
                             dark:text-neutral-200 dark:hover:bg-neutral-600" // Dark mode: text color, hover background
                >
                  Lowest Discount
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu (conditionally rendered) */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden bg-white border border-gray-200 shadow-sm
                        dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-900/30"
        >
          {" "}
          {/* Dark mode: background, border, shadow */}
          <div
            className="flex flex-col space-y-4 p-4 text-gray-700
                          dark:text-neutral-300"
          >
            {" "}
            {/* Dark mode: text color */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsPriceDropdownOpen(!isPriceDropdownOpen);
                  setIsDiscountDropdownOpen(false); // Close other dropdown
                }}
                className="flex justify-between w-full text-sm font-medium hover:text-emerald-600
                           dark:hover:text-emerald-400" // Dark mode: hover text color
              >
                Price
                {isPriceDropdownOpen ? (
                  <FaChevronUp className="text-xs dark:text-neutral-300" /> // Dark mode: icon color
                ) : (
                  <FaChevronDown className="text-xs dark:text-neutral-300" /> // Dark mode: icon color
                )}
              </button>
              {isPriceDropdownOpen && (
                <div className="pl-4 mt-2 space-y-2">
                  <button
                    onClick={() => handleSort("price_asc")}
                    className="block w-full text-left text-sm hover:bg-gray-100 p-2 rounded
                               dark:text-neutral-200 dark:hover:bg-neutral-600" // Dark mode: text color, hover background
                  >
                    Price: Low to High
                  </button>
                  <button
                    onClick={() => handleSort("price_desc")}
                    className="block w-full text-left text-sm hover:bg-gray-100 p-2 rounded
                               dark:text-neutral-200 dark:hover:bg-neutral-600" // Dark mode: text color, hover background
                  >
                    Price: High to Low
                  </button>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => {
                  setIsDiscountDropdownOpen(!isDiscountDropdownOpen);
                  setIsPriceDropdownOpen(false); // Close other dropdown
                }}
                className="flex justify-between w-full text-sm font-medium hover:text-emerald-600
                           dark:hover:text-emerald-400" // Dark mode: hover text color
              >
                Discount
                {isDiscountDropdownOpen ? (
                  <FaChevronUp className="text-xs dark:text-neutral-300" /> // Dark mode: icon color
                ) : (
                  <FaChevronDown className="text-xs dark:text-neutral-300" /> // Dark mode: icon color
                )}
              </button>
              {isDiscountDropdownOpen && (
                <div className="pl-4 mt-2 space-y-2">
                  <button
                    onClick={() => handleSort("highestDiscount")}
                    className="block w-full text-left text-sm hover:bg-gray-100 p-2 rounded
                               dark:text-neutral-200 dark:hover:bg-neutral-600" // Dark mode: text color, hover background
                  >
                    Highest Discount
                  </button>
                  <button
                    onClick={() => handleSort("lowestDiscount")}
                    className="block w-full text-left text-sm hover:bg-gray-100 p-2 rounded
                               dark:text-neutral-200 dark:hover:bg-neutral-600" // Dark mode: text color, hover background
                  >
                    Lowest Discount
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SortBy;
