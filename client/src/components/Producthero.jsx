import React from "react";

const Producthero = () => {
  return (
    <div className=" mt-[50px] bg-[linear-gradient(135deg,var(--primary-light)0%,rgba(124,58,237,0.05)100%)] h-[300px] flex flex-col items-center justify-center">
      <p className="text-center text-4xl sm:text-5xl lg:text-6xl font-sans font-bold text-gray-800 mb-6 leading-tight">
        Our Latest Collection
      </p>
      <p className=" text-center text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed">
        Discover a curated selection of high-quality products. Find exactly what
        you need with ease.
      </p>
    </div>
  );
};

export default Producthero;
