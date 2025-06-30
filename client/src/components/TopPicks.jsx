import React from "react";
import sample from "../assets/sample.jpg";

const TopPicks = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <p className="text-center font-montserrat font-extrabold text-[2rem] sm:text-[2.25rem] md:text-[2.5rem] text-[var(--neutral-800)]">
        Top Picks Just For You
      </p>
      <p className="text-center max-w-2xl mx-auto text-[var(--neutral-500)] text-[1rem] sm:text-[1.125rem]">
        "Explore our most-loved products, handpicked by our community and
        trending this week."
      </p>
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 overflow-x-auto py-4 ">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="flex justify-center mt-[var(--space-4xl)] min-w-[300px] sm:min-w-[350px] md:w-[400px] dark:bg-neutral-800"
          >
            <div className="flex-col w-full max-w-[400px] h-auto p-3 hover:translate-y-[-8px] transition-all duration-300 border border-[var(--neutral-200)] shadow-[var(--shadow-md)] dark:bg-neutral-800">
              <img
                className="hover:ease-in duration-300 transform transition-all w-full rounded-[var(--radius-lg)] object-contain"
                src={sample}
                alt=""
              />
              <p className="text-left mt-[var(--space-md)]">Electronics</p>
              <p className="text-[1.25rem] sm:text-[1.375rem] font-bold mt-[var(--space-md)]">
                Noise-Cancelling Wireless Headphones
              </p>
              <p className="text-wrap mt-[var(--space-md)] text-[var(--neutral-500)]">
                Experience immersive sound and long-lasting comfort. Perfect for
                music, calls, and gaming.
              </p>
              <div className="w-auto flex justify-center">
                <button className="mt-5 border-none rounded-[var(--radius-md)] bg-[var(--secondary)] text-white font-semibold py-[var(--space-md)] px-[var(--space-md)] hover:bg-[var(--secondary-dark)] hover:translatey-[-2px] hover:shadow-[var(--shadow-md)] duration-400 transition-all active:scale-95 w-full">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPicks;
