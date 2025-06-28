import mongoose from "mongoose";

const carouselSchema = new mongoose.Schema({
  title: String,
  subtitle: String, // ✅ New field
  imageUrl: { type: String, required: true },
  link: String,
  alt: String,
  createdAt: { type: Date, default: Date.now },
});

const Carousel =
  mongoose.models.Carousel || mongoose.model("Carousel", carouselSchema);

export default Carousel;
