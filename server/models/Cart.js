import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
export default Cart;
