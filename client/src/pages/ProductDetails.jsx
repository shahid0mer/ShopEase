import React from "react";
import ProductDisplay from "../components/ProductDisplay";

import ReviewComponent from "../components/ReviewComponent";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
   const { productId } = useParams(); 
  return (
    <div>
      <ProductDisplay />
      <div>
        <ReviewComponent productId={productId} />
      </div>
    </div>
  );
};

export default ProductDetails;
