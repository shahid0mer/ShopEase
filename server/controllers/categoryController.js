import Category from "../models/Category.js";
import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import mongoose from "mongoose";

// GET /api/category/view
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json({ success: true, categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFilteredOrSearchedProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    categoryId,
    keyword,
    minPrice,
    maxPrice,
    rating,
    sort = "newest", // default fallback
    brands,
    colors,
    sizes,
  } = req.query;

  const sortKey = String(sort).trim().toLowerCase();

  const skip = (page - 1) * limit;

  const filterQuery = { inStock: true };

  // If keyword is provided, use text search
  if (keyword) {
    filterQuery.$text = { $search: keyword };
  }

  // If categoryId is valid, add category filter
  if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
    filterQuery.category_id = categoryId;
  }

  // Price range
  if (minPrice || maxPrice) {
    filterQuery.price = {};
    if (minPrice) filterQuery.price.$gte = Number(minPrice);
    if (maxPrice) filterQuery.price.$lte = Number(maxPrice);
  }

  // Brand
  if (brands) {
    filterQuery.brand = {
      $in: Array.isArray(brands) ? brands : brands.split(","),
    };
  }

  // Color
  if (colors) {
    filterQuery["attributes.color"] = {
      $in: Array.isArray(colors) ? colors : colors.split(","),
    };
  }

  // Size
  if (sizes) {
    filterQuery["attributes.size"] = {
      $in: Array.isArray(sizes) ? sizes : sizes.split(","),
    };
  }

  // Rating
  if (rating) {
    filterQuery.rating = { $gte: Number(rating) };
  }

  // Sort options
  const sortMap = {
    price_asc: { offerPrice: 1 },
    price_desc: { offerPrice: -1 },
    rating: { rating: -1 },
    newest: { createdAt: -1 },
    popular: { numReviews: -1 },
  };

  try {
    const [total, products] = await Promise.all([
      Product.countDocuments(filterQuery),
      Product.find(filterQuery)
        .sort(sortMap[sortKey] || sortMap["newest"])
        .skip(skip)
        .limit(Number(limit))
        .populate("category_id", "name slug")
        .select("-__v")
        .lean(),
    ]);

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: "No matching products found.",
      });
    }

    // Optional: dynamic filter suggestions
    const availableFilters = {
      minPrice: await Product.findOne(filterQuery)
        .sort({ price: 1 })
        .select("price"),
      maxPrice: await Product.findOne(filterQuery)
        .sort({ price: -1 })
        .select("price"),
      brands: await Product.distinct("brand", filterQuery),
      colors: await Product.distinct("attributes.color", filterQuery),
      sizes: await Product.distinct("attributes.size", filterQuery),
    };

    res.status(200).json({
      success: true,
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      filters: availableFilters,
    });
  } catch (error) {
    console.error("Product listing error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching products",
      error: error.message,
    });
  }
});
