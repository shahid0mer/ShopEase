import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    products: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        seller_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
    paymentType: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, default: "Order placed" },
    cancelledAt: { type: Date },
    payment_id: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    ispaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Order = mongoose.models.order || mongoose.model("Order", orderSchema);

export default Order;
