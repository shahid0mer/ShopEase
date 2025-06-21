import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, index: true },
    phone: { type: Number },
    address: { type: String },
    password: { type: String, required: true, minLength: 6 },
    role: {
      type: String,
      enum: ["user", "seller", "admin"],
      default: "user",
    },
    storeLogo: { type: String }, // specific to sellers
    isVerified: { type: Boolean }, // seller verification
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // seller-specific
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
