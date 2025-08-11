import { toast } from "sonner";

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay SDK.");
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

/**
 * Initiates a Razorpay payment specifically for a shopping cart order.
 *
 * @param {Object} params
 * @param {string} params.razorpayKeyId
 * @param {Object} params.razorpayOrder
 * @param {Object} params.product
 * @param {Object} params.user - User details (name, email, phone) for prefill.
 * @param {Object} params.selectedAddress - Selected shipping address details for prefill and notes.
 * @param {Object} params.originalCheckoutData - The complete order payload from Cart.jsx
 * @param {Function} params.dispatch - Redux dispatch function.
 * @param {Function} params.placeOnlineOrderThunk
 * @param {Function} params.navigate
 */
export const startRazorpayCartPayment = async ({
  razorpayKeyId,
  razorpayOrder,
  product,
  user,
  selectedAddress,
  originalCheckoutData,
  dispatch,
  placeOnlineOrderThunk,
  navigate,
}) => {
  if (!razorpayKeyId) {
    toast.error(
      "Razorpay Key ID is not available. Cannot proceed with payment."
    );
    return;
  }

  if (!razorpayOrder || !razorpayOrder.id || !razorpayOrder.amount) {
    console.error(
      "Invalid Razorpay order details provided to cart handler:",
      razorpayOrder
    );
    toast.error(
      "Payment initiation failed. Missing crucial order details from backend."
    );
    return;
  }

  const scriptLoaded = await loadRazorpayScript();
  if (!scriptLoaded) {
    toast.error(
      "Failed to load Razorpay SDK. Please check your internet connection."
    );
    return;
  }

  const options = {
    key: razorpayKeyId,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency || "INR",
    order_id: razorpayOrder.id,
    name: "Your E-commerce Store",
    description: product.name || "Shopping Cart Order",
    image: "https://placehold.co/100x100/A0B0C0/FFFFFF?text=Logo",
    handler: async function (response) {
      console.log("Razorpay success response for cart payment:", response);

      const dataToSendToBackend = {
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
        // Pass the ENTIRE original checkout data for the cart to allow backend re-validation
        orderDetails: originalCheckoutData,
      };

      console.log(
        "Sending to backend for cart payment verification:",
        dataToSendToBackend
      );

      const result = await dispatch(placeOnlineOrderThunk(dataToSendToBackend));

      if (
        result.meta.requestStatus === "fulfilled" &&
        result.payload?.success &&
        result.payload?.order?._id
      ) {
        toast.success("Payment successful! Your cart order has been placed.");

        navigate(`/account/orders`);
      } else {
        // Handle cases where payment was successful but backend verification failed
        console.error(
          "Backend order verification failed for cart:",
          result.payload
        );
        toast.error(
          "Payment successful, but order verification failed: " +
            (result.payload?.message ||
              "Unknown error occurred during order processing.") +
            " Please contact support with Payment ID: " +
            response.razorpay_payment_id
        );
        navigate("/");
      }
    },
    prefill: {
      name: user?.name || "",
      email: user?.email || "",
      contact: selectedAddress?.phone || user?.phone || "",
    },
    notes: {
      addressLine1: selectedAddress?.addressLine1 || "",
      city: selectedAddress?.city || "",
      userId: user?._id || "Guest",
    },
    theme: {
      color: "#10b981",
    },
  };

  const paymentObject = new window.Razorpay(options);

  // Attach a listener for payment failure events
  paymentObject.on("payment.failed", function (response) {
    console.error("Razorpay payment failed for cart:", response);
    toast.error(
      `Payment Failed: ${
        response.error.description || "Unknown error occurred."
      }`
    );
    // Navigate to a payment failed page
    navigate("/");
  });

  paymentObject.open();
};
