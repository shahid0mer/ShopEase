import Product from "../models/Product.js";
import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import razorpay from "../configs/razorpay.js";
import Address from "../models/Address.js";
import crypto from "crypto";

export const singleProductCheckout = async (req, res) => {
  try {
    const user_id = req.user._id;
    const { productId, quantity, address, paymentType, amount, currency } =
      req.body;

    if (
      !productId ||
      !quantity ||
      !address ||
      !paymentType ||
      !amount ||
      !currency
    ) {
      return res
        .status(400)
        .json({ message: "Missing required fields for checkout." });
    }

    const finalAmountInPaise = Math.round(parseFloat(amount));
    if (isNaN(finalAmountInPaise) || finalAmountInPaise <= 0) {
      return res.status(400).json({ message: "Invalid amount provided." });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (!product.seller_id) {
      throw new Error(`Product (ID: ${productId}) is missing a seller ID.`);
    }

    const shippingAddress = await Address.findById(address._id);
    if (!shippingAddress) {
      return res.status(404).json({ message: "Shipping address not found." });
    }

    const basePrice = product.offerPrice || product.price || 0;
    const expectedAmountInPaise = Math.round(basePrice * quantity * 1.02 * 100);

    if (finalAmountInPaise !== expectedAmountInPaise) {
      console.error("Amount mismatch:", {
        received: finalAmountInPaise,
        expected: expectedAmountInPaise,
      });
      return res
        .status(400)
        .json({ message: "Amount validation failed on server." });
    }

    if (paymentType === "ONLINE") {
      const razorpayOptions = {
        amount: finalAmountInPaise,
        currency: currency,
        receipt: `order_rcptid_${Date.now()}`,
        notes: {
          userId: user_id.toString(),
          productId: productId.toString(),
          shippingAddressId: shippingAddress._id.toString(),
        },
      };

      try {
        const razorpayOrder = await razorpay.orders.create(razorpayOptions);

        return res.status(200).json({
          success: true,
          requiresPayment: true,
          paymentData: {
            id: razorpayOrder.id,
            amount: finalAmountInPaise,
            currency: razorpayOrder.currency,
          },
          message: "Razorpay order initiated. Awaiting payment.",
        });
      } catch (razorpayError) {
        console.error("Razorpay order creation failed:", razorpayError);
        let errorMessage = "Failed to initiate online payment with Razorpay.";
        if (razorpayError.error && razorpayError.error.description) {
          errorMessage = `Razorpay Error: ${razorpayError.error.description}`;
        }
        return res.status(400).json({ success: false, message: errorMessage });
      }
    } else if (paymentType === "COD") {
      return res
        .status(400)
        .json({ message: "COD not implemented in this function." });
    } else {
      return res
        .status(400)
        .json({ message: "Invalid payment type provided." });
    }
  } catch (error) {
    console.error("Backend: Top-level error in singleProductCheckout:", error);
    res
      .status(500)
      .json({ message: error.message || "An unexpected error occurred." });
  }
};

export const verifyPaymentAndCreateOrder = async (req, res) => {
  try {
    const {
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      productId,
      quantity,
      address,
    } = req.body;
    const user_id = req.user._id;

    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed: Invalid signature.",
      });
    }

    const paymentDetails = await razorpay.payments.fetch(razorpayPaymentId);
    if (paymentDetails.status !== "captured") {
      return res.status(400).json({
        success: false,
        message: `Payment not captured. Status: ${paymentDetails.status}`,
      });
    }

    const product = await Product.findById(productId);
    const basePrice = product.offerPrice || product.price || 0;
    const expectedAmountInPaise = Math.round(basePrice * quantity * 1.02 * 100);

    if (paymentDetails.amount !== expectedAmountInPaise) {
      return res.status(400).json({
        success: false,
        message: "Payment amount mismatch. Potential fraud.",
      });
    }

    const paymentRecord = new Payment({
      user_id,
      paymentMethod: paymentDetails.method.toUpperCase(),
      razorpayOrderId,
      transactionId: razorpayPaymentId,
      status: "Success",
      amount: paymentDetails.amount,
      currency: paymentDetails.currency,
    });
    await paymentRecord.save();

    const createdOrder = await Order.create({
      user_id,
      products: [
        { product_id: productId, quantity, seller_id: product.seller_id },
      ],
      paymentType: "ONLINE",
      payment_id: paymentRecord._id,
      amount: paymentDetails.amount,
      shippingAddress: address._id,
      status: "Completed",
      isPaid: true,
    });

    paymentRecord.order_id = createdOrder._id;
    await paymentRecord.save();

    return res.status(200).json({
      success: true,
      message: "Order placed and payment verified successfully!",
      order: createdOrder,
    });
  } catch (error) {
    console.error(
      "Backend: Critical error in verifyPaymentAndCreateOrder:",
      error
    );
    return res
      .status(500)
      .json({ success: false, message: "Order finalization failed." });
  }
};
