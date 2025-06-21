// components/ProductSkeletonCard.jsx
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductSkeletonCard = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md space-y-3">
      <Skeleton height={200} borderRadius={12} />
      <Skeleton height={20} width={`80%`} />
      <Skeleton height={15} width={`60%`} />
      <div className="flex justify-between items-center mt-2">
        <Skeleton width={60} height={20} />
        <Skeleton width={80} height={30} borderRadius={8} />
      </div>
    </div>
  );
};

export default ProductSkeletonCard;
