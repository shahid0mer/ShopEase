import React, { useEffect, useState, useCallback } from "react";
import {
  useParams,
  useSearchParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Filter from "../components/Filter";
import Navbar from "../components/Navbar"; // Navbar is imported but not directly rendered in this component's return
import Footer from "../components/Footer";
import BreadcrumbTrail from "../components/BreadcrumbTrail";
import Producthero from "../components/Producthero";
import SortBy from "../components/SortBy";
import ProductGrid from "../components/ProductGrid";
import Pagination from "../components/Pagination";
import { fetchProductsWithFilters } from "../Features/Product/productSlice";
import ProductSkeletonCard from "../components/ProductSkeletonCard";
import noproductfound from "../assets/no-product-found.png";
import { fetchCategories } from "../Features/Product/categorySlice";

const Products = () => {
  const { categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories } = useSelector((state) => state.category);
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
    const newParams = new URLSearchParams(searchParams);

    newParams.set("sort", newSort);
    newParams.set("page", "1");

    if (keyword) {
      newParams.set("keyword", keyword);
    }

    if (categoryId) {
      newParams.set("categoryId", categoryId);
    }

    setSearchParams(newParams);
  };

  const fetchProducts = useCallback(() => {
    const urlKeyword = searchParams.get("keyword") || "";
    const urlSort = searchParams.get("sort") || "createdAt_desc";
    const urlPage = parseInt(searchParams.get("page")) || 1;

    const effectiveCategoryId =
      categoryId || searchParams.get("categoryId") || "";

    const filters = {
      keyword: urlKeyword,
      category: effectiveCategoryId,
      page: urlPage,
      limit,
      sort: urlSort,
    };

    dispatch(fetchProductsWithFilters(filters));
  }, [dispatch, searchParams, categoryId, limit]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [searchParams, categoryId]);

  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories]);

  return (
    <div className="bg-white dark:bg-neutral-950">
      {" "}
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
            <div
              className="bg-white shadow-md p-6
                            dark:bg-neutral-800 dark:shadow-neutral-900/30"
            >
              {" "}
              {loading ? (
                <div className="grid ...">
                  {[...Array(8)].map((_, index) => (
                    <ProductSkeletonCard key={index} />
                  ))}
                </div>
              ) : error ? (
                <div className="w-auto h-[993px] flex flex-col justify-center items-center animate-pulse dark:bg-neutral-800">
                  <img
                    src={noproductfound}
                    alt="No product found"
                    className="dark:filter dark:invert dark:opacity-80"
                  />
                  <p className="text-red-500 mt-4 dark:text-red-400">
                    Products Doesnt Exist .
                  </p>
                </div>
              ) : (
                <ProductGrid />
              )}
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
