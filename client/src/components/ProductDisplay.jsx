import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductById } from "../Features/Product/productSlice";
import BreadcrumbTrail from "./BreadcrumbTrail";
import { AnimatePresence, motion } from "framer-motion";
import { addToCartAsync } from "../Features/Cart/cartSlice";
import { toast } from "sonner";

const ProductDisplay = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    loading,
    error,
    ProductInfo: product,
  } = useSelector((state) => state.product);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [thumbnail, setThumbnail] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleAddToCart = (product) => {
    dispatch(addToCartAsync({ product_id: product._id, quantity: 1 }));
    if (!isAuthenticated) {
      toast.error("Please sign in to add to Cart");
    } else {
      toast.success(`${product.name} added to cart`);
    }
  };

  useEffect(() => {
    dispatch(fetchProductById(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (product?.images?.length > 0) {
      setThumbnail(product.images[0]);
    }
  }, [product]);

  if (loading)
    return (
      <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin">
        {" "}
        loading
      </div>
    );
  if (error) return toast.error(error);
  if (!product) return <div className="p-4 text-center">No product found.</div>;

  const collapsedHeight = "300px";

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div>
        <BreadcrumbTrail />
      </div>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-20 mt-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-row sm:flex-col gap-2 sm:gap-3 order-2 sm:order-1">
            {product.images.map((image, index) => (
              <div
                key={index}
                onClick={() => setThumbnail(image)}
                className="border max-w-16 sm:max-w-20 md:max-w-24 border-gray-300 rounded overflow-hidden cursor-pointer"
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full object-contain"
                />
              </div>
            ))}
          </div>

          <div className="border border-gray-300 rounded overflow-hidden w-full h-[300px] sm:h-[400px] md:h-[540px] order-1 sm:order-2">
            <img
              src={thumbnail || product.images[0]}
              alt="Selected product"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="text-sm w-full md:w-1/2 mt-6 md:mt-0">
          <h1 className="text-2xl sm:text-3xl font-medium">{product.name}</h1>

          <div className="flex items-center gap-1 mt-2">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <svg
                  key={i}
                  width="14"
                  height="13"
                  viewBox="0 0 18 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z"
                    fill={i < product.rating ? "#615fff" : "#615fff80"}
                  />
                </svg>
              ))}
            <p className="text-base ml-2">({product.rating || 0})</p>
          </div>

          <div className="mt-4 sm:mt-6">
            <p className="text-gray-500/70 line-through">
              MRP: ${product.price}
            </p>
            <p className="text-xl sm:text-2xl font-medium">
              MRP: ${product.offerPrice}
            </p>
            <span className="text-gray-500/70">(inclusive of all taxes)</span>
          </div>

          <div className="mt-4 sm:mt-6">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              <p className="text-2xl sm:text-[2.25rem] font-medium">
                About Product
              </p>
              <motion.svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                animate={{ rotate: showFullDescription ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </motion.svg>
            </div>
            <div className="relative">
              {/* No AnimatePresence needed here because motion.ul is always mounted */}
              <motion.ul
                className="list-disc ml-4 text-[var(--neutral-500)] text-[0.95rem] overflow-hidden"
                // Animate based on showFullDescription state
                animate={{
                  height: showFullDescription ? "auto" : collapsedHeight,
                }}
                transition={{
                  height: { duration: 0.3, ease: "easeInOut" },
                }}
              >
                {product.description?.map((desc, index) => (
                  <li key={index} className="mb-1">
                    {desc}
                  </li>
                ))}
              </motion.ul>

              {/* AnimatePresence for the fade overlay, as it is conditionally rendered */}
              <AnimatePresence>
                {!showFullDescription && (
                  <motion.div
                    key="fade-overlay" // Important for AnimatePresence
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[var(--neutral-50)] via-[var(--neutral-50)]/70 to-transparent pointer-events-none"
                  ></motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center mt-6 sm:mt-10 gap-3 sm:gap-4 text-base">
            <button
              className="w-full py-3 sm:py-3.5 cursor-pointer font-medium bg-[var(--primary-light)] text-[var(--neutral-800)] hover:bg-[var(--primary)] active:scale-95 transition"
              onClick={() => handleAddToCart(product)}
            >
              Add to Cart
            </button>
            <button
              className="w-full py-3 sm:py-3.5 cursor-pointer font-medium bg-[var(--secondary)] text-white hover:bg-[var(--secondary-dark)] active:scale-95 transition"
              onClick={() =>
                navigate("/checkout", {
                  state: {
                    product: {
                      ...product,
                      quantity: 1,
                    },
                  },
                })
              }
            >
              Buy now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;
