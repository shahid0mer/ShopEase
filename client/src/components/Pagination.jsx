import React from "react";
import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchProductsWithFilters } from "../Features/Product/productSlice.js";

const Pagination = ({ currentPage, totalPages, categoryId, sort }) => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const maxPageButtons = 5;
  const limit = 20;

  const handlePageChange = (newPage) => {
    const pageNumber = Math.max(1, Math.min(newPage, totalPages));
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", pageNumber);
    window.history.pushState(null, "", `?${newSearchParams.toString()}`);

    const paramsObj = Object.fromEntries(newSearchParams.entries());
    dispatch(
      fetchProductsWithFilters({
        ...paramsObj,
        categoryId,
        limit,
        page: pageNumber,
        sort,
      })
    );

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center mt-8">
      <div className="flex items-center justify-between w-full max-w-80 text-gray-500 font-medium">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`rounded-full p-2 ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-100"
          }`}
          aria-label="Previous page"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          {getPageNumbers()[0] > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="h-10 w-10 flex items-center justify-center hover:bg-gray-100 rounded-full"
              >
                1
              </button>
              {getPageNumbers()[0] > 2 && <span className="mx-1">...</span>}
            </>
          )}

          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`h-10 w-10 flex items-center justify-center rounded-full ${
                page === currentPage
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}

          {getPageNumbers().slice(-1)[0] < totalPages && (
            <>
              {getPageNumbers().slice(-1)[0] < totalPages - 1 && (
                <span className="mx-1">...</span>
              )}
              <button
                onClick={() => handlePageChange(totalPages)}
                className="h-10 w-10 flex items-center justify-center hover:bg-gray-100 rounded-full"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`rounded-full p-2 ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-100"
          }`}
          aria-label="Next page"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  categoryId: PropTypes.string.isRequired,
  sort: PropTypes.string,
};

export default Pagination;
