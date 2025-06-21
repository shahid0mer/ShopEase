// import mongoose from "mongoose";

// const sellerSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },
//     email: { type: String, required: true, unique: true, index: true },
//     phone: { type: Number },
//     address: { type: String },
//     password: { type: String, required: true, minLength: 6 },
//     storeLogo: { type: String },
//     isVerified: { type: Boolean, default: false }, // can be used fr Seller approval system from admin
//     products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
//   },
//   { timestamps: true }
// );

// const Seller = mongoose.models.seller || mongoose.model("seller", sellerSchema);

// export default Seller;
