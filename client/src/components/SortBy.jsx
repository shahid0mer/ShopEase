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
        className="lg:hidden bg-white p-4 border border-gray-200 shadow-sm mt-14 w-full flex justify-between items-center"
      >
        <span className="text-sm font-medium text-gray-700">Sort Options</span>
        {isMobileMenuOpen ? (
          <FaChevronUp className="text-xs" />
        ) : (
          <FaChevronDown className="text-xs" />
        )}
      </button>

      {/* Desktop */}
      <div className="hidden lg:block bg-white p-4 border border-gray-200 shadow-sm mt-14 mx-auto">
        <div className="flex items-center space-x-6 text-gray-700">
          <div className="relative">
            <button
              onClick={() => {
                setIsPriceDropdownOpen(!isPriceDropdownOpen);
                setIsDiscountDropdownOpen(false); // Close other dropdown
              }}
              className="flex items-center text-sm font-medium hover:text-emerald-600"
            >
              Price
              {isPriceDropdownOpen ? (
                <FaChevronUp className="ml-1 text-xs" />
              ) : (
                <FaChevronDown className="ml-1 text-xs" />
              )}
            </button>
            {isPriceDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
                <button
                  onClick={() => handleSort("price_asc")}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Price: Low to High
                </button>
                <button
                  onClick={() => handleSort("price_desc")}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
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
              className="flex items-center text-sm font-medium hover:text-emerald-600"
            >
              Discount
              {isDiscountDropdownOpen ? (
                <FaChevronUp className="ml-1 text-xs" />
              ) : (
                <FaChevronDown className="ml-1 text-xs" />
              )}
            </button>
            {isDiscountDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
                <button
                  onClick={() => handleSort("highestDiscount")}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Highest Discount
                </button>
                <button
                  onClick={() => handleSort("lowestDiscount")}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Lowest Discount
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border border-gray-200 shadow-sm">
          <div className="flex flex-col space-y-4 p-4 text-gray-700">
            <div className="relative">
              <button
                onClick={() => {
                  setIsPriceDropdownOpen(!isPriceDropdownOpen);
                  setIsDiscountDropdownOpen(false); // Close other dropdown
                }}
                className="flex justify-between w-full text-sm font-medium hover:text-emerald-600"
              >
                Price
                {isPriceDropdownOpen ? (
                  <FaChevronUp className="text-xs" />
                ) : (
                  <FaChevronDown className="text-xs" />
                )}
              </button>
              {isPriceDropdownOpen && (
                <div className="pl-4 mt-2 space-y-2">
                  <button
                    onClick={() => handleSort("price_asc")}
                    className="block w-full text-left text-sm hover:bg-gray-100 p-2 rounded"
                  >
                    Price: Low to High
                  </button>
                  <button
                    onClick={() => handleSort("price_desc")}
                    className="block w-full text-left text-sm hover:bg-gray-100 p-2 rounded"
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
                className="flex justify-between w-full text-sm font-medium hover:text-emerald-600"
              >
                Discount
                {isDiscountDropdownOpen ? (
                  <FaChevronUp className="text-xs" />
                ) : (
                  <FaChevronDown className="text-xs" />
                )}
              </button>
              {isDiscountDropdownOpen && (
                <div className="pl-4 mt-2 space-y-2">
                  <button
                    onClick={() => handleSort("highestDiscount")}
                    className="block w-full text-left text-sm hover:bg-gray-100 p-2 rounded"
                  >
                    Highest Discount
                  </button>
                  <button
                    onClick={() => handleSort("lowestDiscount")}
                    className="block w-full text-left text-sm hover:bg-gray-100 p-2 rounded"
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
