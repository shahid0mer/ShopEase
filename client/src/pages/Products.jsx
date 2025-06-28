import React, { useEffect, useState, useCallback } from "react";
import {
  useParams,
  useSearchParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Filter from "../components/Filter";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BreadcrumbTrail from "../components/BreadcrumbTrail";
import Producthero from "../components/Producthero";
import SortBy from "../components/SortBy";
import ProductGrid from "../components/ProductGrid";
import Pagination from "../components/Pagination";
import { fetchProductsWithFilters } from "../Features/Product/productSlice";
import ProductSkeletonCard from "../components/ProductSkeletonCard";
import noproductfound from "../assets/no-product-found.png";

const Products = () => {
  const { categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const sort = searchParams.get("sort") || "createdAt_desc";
  const page = parseInt(searchParams.get("page")) || 1;
  const keyword = searchParams.get("keyword") || "";
  const limit = 20;

  const { currentPage, totalPages, loading, error } = useSelector(
    (state) => state.product
  );

  const handleSortChange = (newSort) => {
    // Create new URLSearchParams from current search params
    const newParams = new URLSearchParams(searchParams);

    // Update sort and reset page to 1
    newParams.set("sort", newSort);
    newParams.set("page", "1");

    // Always preserve the keyword if it exists
    if (keyword) {
      newParams.set("keyword", keyword);
    }

    // Always preserve the category if we're on a category page
    if (categoryId) {
      newParams.set("categoryId", categoryId);
    }

    console.log("Setting sort with params:", Object.fromEntries(newParams));

    // Update the URL using React Router's setSearchParams
    setSearchParams(newParams);
  };

  // Memoize the fetch function to prevent unnecessary re-renders
  const fetchProducts = useCallback(() => {
    // Get current URL parameters
    const urlKeyword = searchParams.get("keyword") || "";
    const urlSort = searchParams.get("sort") || "createdAt_desc";
    const urlPage = parseInt(searchParams.get("page")) || 1;

    // Determine the category - prioritize route param over URL param
    const effectiveCategoryId =
      categoryId || searchParams.get("categoryId") || "";

    const filters = {
      keyword: urlKeyword,
      category: effectiveCategoryId,
      page: urlPage,
      limit,
      sort: urlSort,
    };

    console.log("Fetching products with filters:", filters);
    console.log("Route categoryId:", categoryId);
    console.log("URL keyword:", urlKeyword);
    console.log("URL sort:", urlSort);
    console.log("URL page:", urlPage);

    dispatch(fetchProductsWithFilters(filters));
  }, [dispatch, searchParams, categoryId, limit]);

  // Single useEffect that handles all URL parameter changes
  useEffect(() => {
    // Add a small delay to prevent rapid successive calls
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [searchParams, categoryId]); // Simplified dependencies

  return (
    <div>
      <div className="mx-auto">
        <BreadcrumbTrail />
        <div className="my-6">
          <Producthero />
        </div>
        <div className="flex flex-col md:flex-row mt-6 gap-6 p-10">
          <Filter sort={sort} keyword={keyword} />
          <div className="flex-1">
            <div className="mb-6">
              <SortBy onSortChange={handleSortChange} />
            </div>
            <div className="bg-white shadow-md p-6">
              {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, index) => (
                    <ProductSkeletonCard key={index} />
                  ))}
                </div>
              )}
              {error && (
                <div className="w-auto h-[993px] flex justify-center items-center animate-pulse">
                  <img src={noproductfound} alt="" />
                </div>
              )}
              <ProductGrid />
            </div>
          </div>
        </div>
        <div className="p-10">
          {!loading && currentPage && totalPages && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              categoryId={categoryId}
              sort={sort}
              keyword={keyword}
            />
          )}
        </div>
      </div>
      <div className="mt-[200px]">
        <Footer />
      </div>
    </div>
  );
};

export default Products;
