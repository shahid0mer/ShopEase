import React from "react";

const Producthero = () => {
  return (
    <div
      className="mt-[50px] h-[300px] flex flex-col items-center justify-center
                    bg-[linear-gradient(135deg,var(--primary-light)0%,rgba(124,58,237,0.05)100%)]
                    dark:bg-gradient-to-br dark:from-neutral-900 dark:to-neutral-950"
    >
      {" "}
      {/* Dark mode gradient */}
      <p
        className="text-center text-4xl sm:text-5xl lg:text-6xl font-sans font-bold text-gray-800 mb-6 leading-tight
                    dark:text-neutral-100"
      >
        {" "}
        {/* Dark mode heading text */}
        Our Latest Collection
      </p>
      <p
        className="text-center text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed
                    dark:text-neutral-300"
      >
        {" "}
        {/* Dark mode paragraph text */}
        Discover a curated selection of high-quality products. Find exactly what
        you need with ease.
      </p>
    </div>
  );
};

export default Producthero;
