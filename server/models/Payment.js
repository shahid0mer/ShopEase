import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  paymentMethod: {
    type: String,
    required: true,
    enum: [
      "Credit Card",
      "Debit Card",
      "UPI",
      "Netbanking",
      "COD",
      "CARD",
      "ONLINE",
    ],
  },

  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    index: true,
  },

  razorpayOrderId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  currency: {
    type: String,
    required: true,
    default: "INR",
  },
  status: {
    type: String,
    enum: ["Processing", "Success", "Failed"],
    default: "Processing",
  },

  transactionId: {
    type: String,
    required: true,
    unique: true,
  },

  paidAt: {
    type: Date,
    default: Date.now,
  },
});

const Payment =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

export default Payment;
