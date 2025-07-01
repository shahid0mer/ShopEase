import Product from "../models/Product.js";
import { v2 as cloudinary } from "cloudinary";
import connectCloudinary from "../configs/cloudinary.js";
import streamifier from "streamifier";

await connectCloudinary();

// View Product : /api/product/:id
export const productView = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add Product : /api/product/add
export const addProduct = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    const productData = JSON.parse(req.body.productData);

    if (!productData.name || !productData.category_id) {
      return res.status(400).json({
        success: false,
        message: "Name and category are required",
      });
    }

    const uploadToCloudinary = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const imagesUrl = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer))
    );

    const newProduct = await Product.create({
      name: productData.name,
      description: productData.description,
      price: productData.price,
      offerPrice: productData.offerPrice,
      category_id: productData.category_id,
      images: imagesUrl,
      seller_id: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update stock : /api/product/update/:id
export const changeStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { inStock } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (!product.seller_id.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    product.inStock = inStock;
    await product.save();

    res
      .status(200)
      .json({ success: true, message: "Product stock updated successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Product: /api/product/updateproduct/:id
export const updatefullProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = JSON.parse(req.body.productData);

    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (!product.seller_id.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    let updatedImages = [];

    if (req.files && req.files.length > 0) {
      const uploadToCloudinary = (fileBuffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "image" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url);
            }
          );
          streamifier.createReadStream(fileBuffer).pipe(stream);
        });
      };

      updatedImages = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file.buffer))
      );

      updatedData.images = updatedImages;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Product : /api/product/delete/:id
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (!product.seller_id.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await product.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Products : /api/product/all
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Products by Category : /api/product/category/:categoryId
export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const products = await Product.find({ category_id: categoryId }).populate(
      "category_id",
      "name"
    );

    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Search Products : /api/product/search/:query
export const searchProducts = async (req, res) => {
  res.status(200).send({ message: "product controller" });
};
