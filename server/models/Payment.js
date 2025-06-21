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
    enum: ["Credit Card", "Debit Card", "UPI", "COD"],
  },
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  status: { type: String, default: "Processing" },
  transactionId: { type: String, required: true },
  paidAt: { type: Date, default: Date.now },
});

const Payment =
  mongoose.models.payment || mongoose.model("Payment", paymentSchema);

export default Payment;
