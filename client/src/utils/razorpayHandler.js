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

export const startRazorpayPayment = async ({
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
    toast.error("Razorpay Key ID is not available.");
    return;
  }

  const scriptLoaded = await loadRazorpayScript();

  if (!scriptLoaded) {
    toast.error("Failed to load Razorpay SDK.");
    return;
  }

  const options = {
    key: razorpayKeyId,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    order_id: razorpayOrder.id,
    name: "Your E-commerce Store",
    description: `Order for ${product.name}`,
    image: "https://placehold.co/100x100/A0B0C0/FFFFFF?text=Logo",
    handler: async function (response) {
      const dataToSendToBackend = {
        razorpayPaymentId: response.razorpay_payment_id,
        razorpayOrderId: response.razorpay_order_id,
        razorpaySignature: response.razorpay_signature,
        productId: originalCheckoutData.productId,
        quantity: originalCheckoutData.quantity,
        address: originalCheckoutData.address,
        paymentType: originalCheckoutData.paymentType,
      };

      const result = await dispatch(placeOnlineOrderThunk(dataToSendToBackend));

      if (
        result.meta.requestStatus === "fulfilled" &&
        result.payload?.order?._id
      ) {
        toast.success("Payment successful! Order placed.");
        navigate(`/account/orders`);
      } else {
        toast.error(
          `Payment verification failed: ${
            result.payload?.message || JSON.stringify(result.payload)
          }`
        );
      }
    },
    prefill: {
      name: user?.name || "",
      email: user?.email || "",
      contact: selectedAddress?.phone || "",
    },
    notes: {
      addressLine1: selectedAddress?.addressLine1 || "",
      city: selectedAddress?.city || "",
    },
    theme: {
      color: "#3399CC",
    },
  };

  const paymentObject = new window.Razorpay(options);

  paymentObject.on("payment.failed", function (response) {
    toast.error(
      `Payment Failed: ${response.error.description || "Unknown error"}`
    );
  });

  paymentObject.open();
};
