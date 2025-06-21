import React, { useState } from "react";
import { toast } from "sonner";

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToNextSlide = () => {
    console.log("Next slide");
  };

  const goToPrevSlide = () => {
    console.log("Previous slide");
  };

  return (
    <div className="relative w-full overflow-hidden py-16 md:py-24 lg:py-32 bg-[linear-gradient(135deg,var(--primary-light)0%,rgba(124,58,237,0.05)100%)]">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
        {/* Left Arrow Navigation - Hidden on mobile, shown on md+ */}
        <button
          onClick={goToPrevSlide}
          className="hidden md:block p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none hover:scale-120 active:scale-95 focus:ring-gray-400 focus:ring-opacity-75 transition-all duration-400 z-10"
          aria-label="Previous slide"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </button>

        <div className="flex flex-col md:flex-row items-center justify-center w-full md:flex-grow max-w-5xl mx-auto gap-8 md:gap-12 lg:gap-20">
          {/* Image Placeholder */}
          <div className="w-full max-w-sm md:w-1/2 lg:w-[500px] h-64 md:h-80 lg:h-96 bg-gray-200 flex items-center justify-center rounded-lg overflow-hidden">
            <svg
              className="w-24 h-24 text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v14a2 2 0 002 2h16a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 1.5a.5.5 0 11-1 0 .5.5 0 011 0zm-3 1.5a.5.5 0 11-1 0 .5.5 0 011 0zm-4 1.5a.5.5 0 11-1 0 .5.5 0 011 0zM4.5 19.5h15L15 10.5l-4 4-2.5-2.5-4 4z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>

          {/* Text Content */}
          <div className="flex-grow text-center md:text-left px-4 sm:px-0">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-sans font-bold text-gray-800 mb-4 sm:mb-6 leading-tight">
              Luxury Meets Comfort
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-10 leading-relaxed">
              Discover timeless designs crafted for the modern lifestyle. Shop
              quality, feel the difference.
            </p>
            <button
              className="px-6 sm:px-8 py-2 sm:py-3 bg-[var(--secondary)] text-white font-semibold rounded-md shadow-lg hover:bg-[var(--secondary-dark)] hover:translate-y-[-2px] hover:shadow-[var(--shadow-md)] duration-300 focus:outline-none active:scale-95 transition-all"
              onClick={() => toast("Toast Is working")}
            >
              Shop now
            </button>
          </div>
        </div>

        {/* Right Arrow Navigation - Hidden on mobile, shown on md+ */}
        <button
          onClick={goToNextSlide}
          className="hidden md:block p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none hover:scale-120 active:scale-95 focus:ring-gray-400 focus:ring-opacity-75 transition-all duration-400 z-10"
          aria-label="Next slide"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </button>

        {/* Mobile Navigation - Arrows at bottom */}
        <div className="flex md:hidden justify-center gap-4 mt-8 w-full">
          <button
            onClick={goToPrevSlide}
            className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none hover:scale-120 active:scale-95 transition-all duration-400"
            aria-label="Previous slide"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>
          <button
            onClick={goToNextSlide}
            className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none hover:scale-120 active:scale-95 transition-all duration-400"
            aria-label="Next slide"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
