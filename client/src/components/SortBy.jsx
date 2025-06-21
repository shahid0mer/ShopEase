import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const SortBy = () => {
  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
  const [isDiscountDropdownOpen, setIsDiscountDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button (hidden on desktop) */}
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

      {/* Desktop Version (unchanged) */}
      <div className="hidden lg:block bg-white p-4 border border-gray-200 shadow-sm mt-14 mx-auto">
        <div className="flex items-center space-x-6 text-gray-700">
          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors duration-200">
            Sort By
          </button>
          <button className="text-sm font-medium hover:text-emerald-600 transition-colors duration-200">
            Popularity
          </button>
          <div className="relative">
            <button
              onClick={() => setIsPriceDropdownOpen(!isPriceDropdownOpen)}
              className="flex items-center text-sm font-medium hover:text-emerald-600 focus:outline-none transition-colors duration-200"
            >
              Price
              {isPriceDropdownOpen ? (
                <FaChevronUp className="ml-1 text-xs" />
              ) : (
                <FaChevronDown className="ml-1 text-xs" />
              )}
            </button>
            {isPriceDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Price: Low to High
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Price: High to Low
                </button>
              </div>
            )}
          </div>
          <button className="text-sm font-medium hover:text-emerald-600 transition-colors duration-200">
            New Arrivals
          </button>
          <div className="relative">
            <button
              onClick={() => setIsDiscountDropdownOpen(!isDiscountDropdownOpen)}
              className="flex items-center text-sm font-medium hover:text-emerald-600 focus:outline-none transition-colors duration-200"
            >
              Discount
              {isDiscountDropdownOpen ? (
                <FaChevronUp className="ml-1 text-xs" />
              ) : (
                <FaChevronDown className="ml-1 text-xs" />
              )}
            </button>
            {isDiscountDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Highest Discount
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Lowest Discount
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu (shown when toggled) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border border-gray-200 shadow-sm">
          <div className="flex flex-col space-y-4 p-4 text-gray-700">
            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50">
              Sort By
            </button>
            <button className="text-left text-sm font-medium hover:text-emerald-600 py-2">
              Popularity
            </button>
            <div className="relative">
              <button
                onClick={() => setIsPriceDropdownOpen(!isPriceDropdownOpen)}
                className="flex items-center justify-between w-full text-sm font-medium hover:text-emerald-600 py-2"
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
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    Price: Low to High
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    Price: High to Low
                  </button>
                </div>
              )}
            </div>
            <button className="text-left text-sm font-medium hover:text-emerald-600 py-2">
              New Arrivals
            </button>
            <div className="relative">
              <button
                onClick={() => setIsDiscountDropdownOpen(!isDiscountDropdownOpen)}
                className="flex items-center justify-between w-full text-sm font-medium hover:text-emerald-600 py-2"
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
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    Highest Discount
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
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