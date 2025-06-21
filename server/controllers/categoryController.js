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

export const getPaginatedProductsWithFilter = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  // Validate and sanitize pagination parameters
  const page = Math.max(1, parseInt(req.query.page)) || 1;
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit)));

  if (isNaN(page) || isNaN(limit)) {
    return res.status(400).json({
      success: false,
      message: "Invalid pagination parameters",
    });
  }
  const skip = (page - 1) * limit;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid category ID format",
    });
  }

  const baseQuery = {
    category_id: categoryId,
    inStock: true,
  };

  // Add optional filters if provided
  const { minPrice, maxPrice, brands, colors, sizes, rating } = req.query;
  const filterQuery = { ...baseQuery };

  // Price range filter
  if (minPrice || maxPrice) {
    filterQuery.price = {};
    if (minPrice) filterQuery.price.$gte = Number(minPrice);
    if (maxPrice) filterQuery.price.$lte = Number(maxPrice);
  }

  // Brand filter (accepts both array and comma-separated string)
  if (brands) {
    filterQuery.brand = {
      $in: Array.isArray(brands) ? brands : brands.split(","),
    };
  }

  // Color filter
  if (colors) {
    filterQuery["attributes.color"] = {
      $in: Array.isArray(colors) ? colors : colors.split(","),
    };
  }

  // Size filter
  if (sizes) {
    filterQuery["attributes.size"] = {
      $in: Array.isArray(sizes) ? sizes : sizes.split(","),
    };
  }

  // Rating filter
  if (rating) {
    filterQuery.rating = { $gte: Number(rating) };
  }

  // Sorting options
  let sortOption = {};
  if (req.query.sort) {
    switch (req.query.sort) {
      case "price_asc":
        sortOption.price = 1;
        break;
      case "price_desc":
        sortOption.price = -1;
        break;
      case "rating":
        sortOption.rating = -1;
        break;
      case "newest":
        sortOption.createdAt = -1;
        break;
      case "popular":
        sortOption.numReviews = -1;
        break;
      default:
        sortOption.createdAt = -1;
    }
  }

  try {
    // Get total count and products in parallel
    const [total, products] = await Promise.all([
      Product.countDocuments(filterQuery),
      Product.find(filterQuery)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .populate("category_id", "name slug")
        .select("-__v")
        .lean(),
    ]);

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: "No products found matching your criteria",
        availableFilters: {
          minPrice: await Product.findOne(baseQuery)
            .sort({ price: 1 })
            .select("price"),
          maxPrice: await Product.findOne(baseQuery)
            .sort({ price: -1 })
            .select("price"),
          brands: await Product.distinct("brand", baseQuery),
          colors: await Product.distinct("attributes.color", baseQuery),
          sizes: await Product.distinct("attributes.size", baseQuery),
        },
      });
    }

    res.status(200).json({
      success: true,
      products,
      total,
      page,
      pages: Math.ceil(total / limit),
      filters: {
        minPrice: await Product.findOne(filterQuery)
          .sort({ price: 1 })
          .select("price"),
        maxPrice: await Product.findOne(filterQuery)
          .sort({ price: -1 })
          .select("price"),
        brands: await Product.distinct("brand", filterQuery),
        colors: await Product.distinct("attributes.color", filterQuery),
        sizes: await Product.distinct("attributes.size", filterQuery),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching products",
      error: error.message,
    });
  }
});
