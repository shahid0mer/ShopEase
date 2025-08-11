import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { fetchCarousels } from "../Features/Carousal/carousalSlice";
import { motion, AnimatePresence } from "framer-motion";

const Carousel = () => {
  const dispatch = useDispatch();
  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef(null);

  const {
    items: banners,
    loading,
    error,
  } = useSelector((state) => state.carousel);

  useEffect(() => {
    dispatch(fetchCarousels());
  }, [dispatch]);

  const fadeInOutVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const autoNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const goToNextSlide = () => {
    clearInterval(intervalRef.current);
    setCurrentSlide((prev) => (prev + 1) % banners.length);
    startAutoSlide();
  };

  const goToPrevSlide = () => {
    clearInterval(intervalRef.current);
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    startAutoSlide();
  };

  // Start auto-slide timer
  const startAutoSlide = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(autoNextSlide, 5000);
  };

  // Initialize auto-slide when banners are available
  useEffect(() => {
    if (banners.length > 0) {
      startAutoSlide();
    }

    return () => clearInterval(intervalRef.current);
  }, [banners.length]);

  // Reset timer when user interacts with shop button
  const handleShopClick = () => {
    clearInterval(intervalRef.current);
    const currentBanner = banners[currentSlide];
    if (currentBanner?.link) {
      window.location.href = currentBanner.link;
    } else {
      toast.info("No link provided for this banner.");
    }
    startAutoSlide();
  };

  if (loading) return <p className="text-center py-10">Loading banners...</p>;
  if (error) return <p className="text-center text-red-600 py-10">{error}</p>;
  if (!banners.length)
    return <p className="text-center py-10">No banners found.</p>;

  const { title, subtitle, imageUrl } = banners[currentSlide];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Responsive height - smaller on mobile, larger on desktop */}
      <div className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] relative">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSlide}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${imageUrl})` }}
            variants={fadeInOutVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 1, ease: "easeInOut" }}
          ></motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 text-center px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-3 md:mb-4 drop-shadow-md font-montserrat">
            {title}
          </h2>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-3 sm:mb-4 md:mb-5 lg:mb-6 drop-shadow-sm max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl px-2">
            {subtitle}
          </p>

          <button
            className="bg-orange-600 hover:translate-y-1 active:scale-95 hover:bg-orange-700 text-white font-semibold px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-md shadow-lg transition duration-300 text-sm sm:text-base"
            onClick={handleShopClick}
          >
            Shop now
          </button>
        </div>

        <button
          onClick={goToPrevSlide}
          className="absolute left-2 active:scale-95 sm:left-4 top-1/2 transform -translate-y-1/2 p-1.5 sm:p-2 rounded-full bg-gray-200 bg-opacity-60 text-gray-700 hover:bg-opacity-80 z-20 transition-all"
          aria-label="Previous slide"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
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
          className="absolute right-2 active:scale-95 sm:right-4 top-1/2 transform -translate-y-1/2 p-1.5 sm:p-2 rounded-full bg-gray-200 bg-opacity-60 text-gray-700 hover:bg-opacity-80 z-20 transition-all"
          aria-label="Next slide"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
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
  );
};

export default Carousel;
