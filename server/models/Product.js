import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: Array, required: true },
    price: { type: Number, required: true, min: 0 },
    offerPrice: { type: Number, min: 0, required: true },
    images: { type: Array, required: true },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    seller_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ category_id: 1 });

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
