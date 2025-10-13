import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRandomProducts } from "../Features/Product/productSlice"; // adjust path if needed

const TopPicks = () => {
  const dispatch = useDispatch();
  const { topPicks, loading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchRandomProducts());
  }, [dispatch]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 ">
      <p className="text-center font-montserrat font-extrabold text-[2rem] sm:text-[2.25rem] md:text-[2.5rem] text-[var(--neutral-800)]">
        Top Picks Just For You
      </p>
      <p className="text-center max-w-2xl mx-auto text-[var(--neutral-500)] text-[1rem] sm:text-[1.125rem]">
        Explore our most-loved products, handpicked by our community and trending this week.
      </p>

      <div className="flex flex-col md:flex-row justify-center items-center gap-6 overflow-x-auto py-4 ">
        {topPicks.length > 0 ? (
          topPicks.map((product) => (
            <div
              key={product._id}
              className="flex flex-col justify-between w-full max-w-[400px] h-[520px] p-3 hover:translate-y-[-8px] transition-all duration-300 border border-[var(--neutral-200)] shadow-[var(--shadow-md)] dark:bg-neutral-800 bg-[var(--neutral-50)] "
            >
              
              <div className="flex justify-center items-center h-48 mb-4">
                <img
                  className="w-full h-full object-contain rounded-[var(--radius-lg)]"
                  src={product.images[0]}
                  alt={product.name}
                />
              </div>

             
              <div className="flex flex-col flex-grow justify-between">
                <div>
                  <p className="text-left mt-[var(--space-sm)] truncate">{product.category}</p>
                  <p className="text-[1.25rem] sm:text-[1.375rem] font-bold mt-[var(--space-md)] truncate">
                    {product.name}
                  </p>
                  
                  <p className="text-wrap mt-[var(--space-md)] text-[var(--neutral-500)] line-clamp-3 overflow-hidden">
                    {product.description}
                  </p>
                </div>

                
                <div className="w-auto flex justify-center mt-4">
                  <button className="border-none rounded-[var(--radius-md)] bg-[var(--secondary)] text-white font-semibold py-[var(--space-md)] px-[var(--space-md)] hover:bg-[var(--secondary-dark)] hover:translate-y-[-2px] hover:shadow-[var(--shadow-md)] duration-300 transition-all active:scale-95 w-full">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default TopPicks;
