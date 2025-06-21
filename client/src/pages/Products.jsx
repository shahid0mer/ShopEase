import React, { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Filter from "../components/Filter";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BreadcrumbTrail from "../components/BreadcrumbTrail";
import Producthero from "../components/Producthero";
import SortBy from "../components/SortBy";
import ProductGrid from "../components/ProductGrid";
import Pagination from "../components/Pagination";
import { fetchPaginatedProductsByCategory } from "../Features/Product/productSlice";
import ProductSkeletonCard from "../components/ProductSkeletonCard";
import noproductfound from "../assets/no-product-found.png";

const Products = () => {
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = 8;

  const { currentPage, totalPages, loading, error } = useSelector(
    (state) => state.product
  );
  useEffect(() => {
    dispatch(
      fetchPaginatedProductsByCategory({
        categoryId,
        page: page,
        limit: limit,
      })
    );
  }, [dispatch, categoryId, page]);

  return (
    <div>
      <div className="mx-auto">
        <BreadcrumbTrail />
        <div className="my-6">
          <Producthero />
        </div>
        <div className="flex flex-col md:flex-row mt-6 gap-6 p-10">
          <Filter />
          <div className="flex-1">
            <div className="mb-6">
              <SortBy />
            </div>
            <div className="bg-white shadow-md p-6  ">
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
