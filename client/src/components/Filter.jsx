// Filter.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsWithFilters } from "../Features/Product/productSlice.js";
import { useParams, useSearchParams } from "react-router-dom";

const Filter = ({ sort = null, keyword = "" }) => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.product);
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Get current URL parameters
  const urlKeyword = searchParams.get("keyword") || keyword;
  const urlSort = searchParams.get("sort") || sort;
  const urlPage = parseInt(searchParams.get("page")) || 1;

  const [activeFilters, setActiveFilters] = useState({
    categories: [],
    priceRange: {
      min: filters?.minPrice?.price || 0,
      max: filters?.maxPrice?.price || 10000,
    },
    brands: [],
    ratings: null,
  });

  useEffect(() => {
    if (filters) {
      setActiveFilters((prev) => ({
        ...prev,
        priceRange: {
          min: filters.minPrice?.price || 0,
          max: filters.maxPrice?.price || 10000,
        },
      }));
    }
  }, [filters]);

  const filterGroups = [
    {
      title: "Categories",
      type: "categories",
      options: [
        { label: "Over-Ear", count: 42 },
        { label: "On-Ear", count: 18 },
        { label: "In-Ear", count: 36 },
        { label: "Earbuds", count: 29 },
        { label: "True Wireless", count: 24 },
      ],
    },
    {
      title: "Brands",
      type: "brands",
      options: [
        { label: "Sony", count: 32 },
        { label: "Bose", count: 18 },
        { label: "Sennheiser", count: 14 },
        { label: "JBL", count: 22 },
        { label: "Apple", count: 15 },
        { label: "Beats", count: 12 },
      ],
    },
    {
      title: "Customer Ratings",
      type: "ratings",
      options: [
        { label: "★★★★★", value: 5, count: 48 },
        { label: "★★★★☆ & Up", value: 4, count: 112 },
        { label: "★★★☆☆ & Up", value: 3, count: 156 },
      ],
    },
  ];

  const toggleFilter = (filterType, value) => {
    setActiveFilters((prev) => {
      if (filterType === "ratings") {
        return { ...prev, ratings: prev.ratings === value ? null : value };
      }

      const currentFilters = prev[filterType];
      return {
        ...prev,
        [filterType]: currentFilters.includes(value)
          ? currentFilters.filter((item) => item !== value)
          : [...currentFilters, value],
      };
    });
  };

  const updatePriceRange = (e, type) => {
    const value = parseInt(e.target.value) || 0;
    setActiveFilters((prev) => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: Math.min(Math.max(value, 0), 10000),
      },
    }));
  };

  const clearFilters = () => {
    setActiveFilters({
      categories: [],
      priceRange: { min: 0, max: 10000 },
      brands: [],
      ratings: null,
    });

    // Clear filters but preserve keyword and other URL params
    dispatch(
      fetchProductsWithFilters({
        category: categoryId || "",
        keyword: urlKeyword,
        page: 1,
        limit: 20,
        sort: urlSort,
      })
    );
  };

  const applyFilters = () => {
    const effectiveCategoryId = categoryId || "";

    dispatch(
      fetchProductsWithFilters({
        category: effectiveCategoryId,
        keyword: urlKeyword, // Use URL keyword to maintain search
        page: 1,
        limit: 20,
        minPrice: activeFilters.priceRange.min,
        maxPrice: activeFilters.priceRange.max,
        brands: activeFilters.brands,
        rating: activeFilters.ratings,
        sort: urlSort,
      })
    );
    setIsMobileFilterOpen(false);
  };

  // Apply filters when price range changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters();
    }, 500);
    return () => clearTimeout(timer);
  }, [activeFilters.priceRange]);

  // Apply filters when other filters change
  useEffect(() => {
    if (
      activeFilters.categories.length > 0 ||
      activeFilters.brands.length > 0 ||
      activeFilters.ratings !== null
    ) {
      applyFilters();
    }
  }, [activeFilters.categories, activeFilters.brands, activeFilters.ratings]);

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <button
        onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-40 bg-emerald-600 text-white p-4 rounded-full shadow-lg hover:bg-emerald-700 transition-colors
                   dark:bg-emerald-700 dark:hover:bg-emerald-600 dark:shadow-xl dark:shadow-emerald-900/50" // Dark mode adjustments
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isMobileFilterOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileFilterOpen(false)}
        />
      )}

      {/* Filter Panel */}
      <div
        className={`fixed lg:sticky top-0 left-0 h-full lg:h-auto w-72 bg-white p-6 shadow-sm border border-gray-100 z-40 transform transition-transform duration-300 ease-in-out ${
          isMobileFilterOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:mt-14
                   dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-lg dark:shadow-neutral-900/30`} // Dark mode panel
      >
        <div className="flex justify-between items-center mb-6">
          <h2
            className="text-xl font-semibold text-gray-900
                         dark:text-neutral-100"
          >
            {" "}
            {/* Dark mode heading */}
            Filters
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={clearFilters}
              className="text-sm font-medium text-emerald-600 hover:text-emerald-800 transition-colors
                         dark:text-emerald-400 dark:hover:text-emerald-300" // Dark mode clear button
            >
              Clear all
            </button>
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700
                         dark:text-neutral-400 dark:hover:text-neutral-200" // Dark mode close button
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Show current search keyword if exists */}
        {urlKeyword && (
          <div
            className="mb-4 p-3 bg-blue-50 rounded-lg
                          dark:bg-blue-900 dark:bg-opacity-30"
          >
            {" "}
            {/* Dark mode search keyword background */}
            <p
              className="text-sm text-blue-700
                          dark:text-blue-300"
            >
              {" "}
              {/* Dark mode search keyword text */}
              <span className="font-medium">Searching for:</span> "{urlKeyword}"
            </p>
          </div>
        )}

        <div className="space-y-8 h-[calc(100%-180px)] overflow-y-auto pb-4">
          {/* Price Range */}
          <div>
            <h3
              className="text-base font-medium text-gray-800 mb-4
                           dark:text-neutral-200"
            >
              {" "}
              {/* Dark mode price range heading */}
              Price Range
            </h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1">
                <label
                  className="block text-xs text-gray-500 mb-1
                                  dark:text-neutral-400"
                >
                  {" "}
                  {/* Dark mode label */}
                  Min
                </label>
                <div className="relative">
                  <span
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400
                                   dark:text-neutral-500"
                  >
                    {" "}
                    {/* Dark mode dollar sign */}$
                  </span>
                  <input
                    type="number"
                    value={activeFilters.priceRange.min}
                    onChange={(e) => updatePriceRange(e, "min")}
                    className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500
                               dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-50 dark:focus:ring-emerald-800 dark:focus:border-emerald-400" // Dark mode input
                  />
                </div>
              </div>
              <div className="flex-1">
                <label
                  className="block text-xs text-gray-500 mb-1
                                  dark:text-neutral-400"
                >
                  {" "}
                  {/* Dark mode label */}
                  Max
                </label>
                <div className="relative">
                  <span
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400
                                   dark:text-neutral-500"
                  >
                    {" "}
                    {/* Dark mode dollar sign */}$
                  </span>
                  <input
                    type="number"
                    value={activeFilters.priceRange.max}
                    onChange={(e) => updatePriceRange(e, "max")}
                    className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500
                               dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-50 dark:focus:ring-emerald-800 dark:focus:border-emerald-400" // Dark mode input
                  />
                </div>
              </div>
            </div>
            <div className="px-2">
              <input
                type="range"
                min="0"
                max="10000"
                value={activeFilters.priceRange.min}
                onChange={(e) => updatePriceRange(e, "min")}
                className="w-full h-1.5 bg-gray-200 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500
                           dark:bg-neutral-600 dark:[&::-webkit-slider-thumb]:bg-emerald-400" // Dark mode range input and thumb
              />
              <input
                type="range"
                min="0"
                max="10000"
                value={activeFilters.priceRange.max}
                onChange={(e) => updatePriceRange(e, "max")}
                className="w-full h-1.5 bg-gray-200 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500 mt-2
                           dark:bg-neutral-600 dark:[&::-webkit-slider-thumb]:bg-emerald-400" // Dark mode range input and thumb
              />
            </div>
          </div>

          {/* Filter Groups */}
          {filterGroups.map((group) => (
            <div
              key={group.title}
              className="border-t border-gray-100 pt-6
                                            dark:border-neutral-700"
            >
              {" "}
              {/* Dark mode border */}
              <h3
                className="text-base font-medium text-gray-800 mb-3
                             dark:text-neutral-200"
              >
                {" "}
                {/* Dark mode group heading */}
                {group.title}
              </h3>
              <ul className="space-y-2">
                {group.options.map((option) => (
                  <li key={option.label || option.value}>
                    <label className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center">
                        {group.type === "ratings" ? (
                          <>
                            <input
                              type="radio"
                              name="ratings"
                              checked={activeFilters.ratings === option.value}
                              onChange={() =>
                                toggleFilter(group.type, option.value)
                              }
                              className="h-4 w-4 border-gray-300 text-emerald-600 focus:ring-emerald-500
                                         dark:border-neutral-500 dark:bg-neutral-700 dark:checked:bg-emerald-500 dark:focus:ring-emerald-600 dark:checked:focus:bg-emerald-500" // Dark mode radio
                            />
                            <span
                              className="ml-3 text-gray-700 flex items-center
                                             dark:text-neutral-300"
                            >
                              {" "}
                              {/* Dark mode label */}
                              {option.label}
                              <span className="ml-2 text-amber-400">
                                {"★".repeat(5)}
                              </span>
                            </span>
                          </>
                        ) : (
                          <>
                            <input
                              type="checkbox"
                              checked={activeFilters[group.type].includes(
                                option.label
                              )}
                              onChange={() =>
                                toggleFilter(group.type, option.label)
                              }
                              className="h-4 w-4 border-gray-300 rounded text-emerald-600 focus:ring-emerald-500
                                         dark:border-neutral-500 dark:bg-neutral-700 dark:checked:bg-emerald-500 dark:focus:ring-emerald-600 dark:checked:focus:bg-emerald-500" // Dark mode checkbox
                            />
                            <span
                              className="ml-3 text-gray-700
                                             dark:text-neutral-300"
                            >
                              {" "}
                              {/* Dark mode label */}
                              {option.label}
                            </span>
                          </>
                        )}
                      </div>
                      <span
                        className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full
                                       dark:text-neutral-400 dark:bg-neutral-700"
                      >
                        {" "}
                        {/* Dark mode count bubble */}
                        {option.count}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mt-8 pt-6 border-t border-gray-100
                        dark:border-neutral-700"
        >
          {" "}
          {/* Dark mode border */}
          <button
            onClick={applyFilters}
            className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow-md
                       dark:bg-emerald-700 dark:hover:bg-emerald-600 dark:shadow-lg dark:shadow-emerald-900/50" // Dark mode apply button
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default Filter;
