import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../Features/Product/productSlice";
import { fetchCategories } from "../Features/Product/categorySlice";

const AddProduct = () => {
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector(
    (state) => state.product
  );
  const {
    categories,
    loading: loadingCategories,
    error: categoryError,
  } = useSelector((state) => state.category);

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    offerPrice: "",
    category_id: "",
  });

  const [images, setImages] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      alert(successMessage);
      setProductData({
        name: "",
        description: "",
        price: "",
        offerPrice: "",
        category_id: "",
      });
      setImages([]);
      // Clear the success message after showing it
      dispatch({ type: "product/clearMessages" });
    }
  }, [successMessage, dispatch]);

  // Clear messages when component unmounts
  useEffect(() => {
    return () => {
      dispatch({ type: "product/clearMessages" });
    };
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!productData.name || !productData.category_id) {
      alert("Product name and category are required");
      return;
    }

    if (images.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    // Dispatch with separate productData and images
    dispatch(addProduct({ productData, images }));
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addImages(selectedFiles);
  };

  const addImages = (files) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length !== files.length) {
      alert("Only image files are allowed");
    }
    setImages((prev) => [...prev, ...imageFiles]);
  };

  const removeImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  // Drag and Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    addImages(files);
  };

  // Drag and drop for reordering images
  const handleImageDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index);
  };

  const handleImageDragOver = (e) => {
    e.preventDefault();
  };

  const handleImageDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));

    if (dragIndex !== dropIndex) {
      const newImages = [...images];
      const draggedImage = newImages[dragIndex];

      // Remove dragged image
      newImages.splice(dragIndex, 1);
      // Insert at new position
      newImages.splice(dropIndex, 0, draggedImage);

      setImages(newImages);
    }
  };

  return (
    <div className="w-full p-6 rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error.message}
        </div>
      )}

      {categoryError && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          Failed to load categories: {categoryError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Upload Box with Drag & Drop */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Product Images
          </h2>

          <div
            className={`cursor-pointer border-2 border-dashed rounded-lg h-32 w-full max-w-md flex flex-col items-center justify-center transition-all duration-200 ${
              isDragOver
                ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                : "border-gray-300 text-gray-400 hover:text-gray-600 hover:border-gray-400"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("imageInput").click()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span className="text-sm font-medium mb-1">
              {isDragOver ? "Drop images here" : "Upload Images"}
            </span>
            <span className="text-xs text-gray-500">
              Drag & drop or click to select
            </span>
            <input
              id="imageInput"
              type="file"
              className="hidden"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {/* Uploaded Previews with Drag & Drop Reordering */}
          {images.length > 0 && (
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-3">
                Drag images to reorder them (first image will be the main image)
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="h-24 w-24 relative border-2 border-gray-300 rounded-md overflow-hidden group cursor-move hover:border-emerald-400 transition-colors"
                    draggable
                    onDragStart={(e) => handleImageDragStart(e, index)}
                    onDragOver={handleImageDragOver}
                    onDrop={(e) => handleImageDrop(e, index)}
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="h-full w-full object-cover"
                    />

                    {/* Main image indicator */}
                    {index === 0 && (
                      <div className="absolute top-1 left-1 bg-emerald-500 text-white text-xs px-1 rounded">
                        Main
                      </div>
                    )}

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                      className="absolute top-1 right-1 text-white bg-red-500 hover:bg-red-600 rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>

                    {/* Drag handle */}
                    <div className="absolute bottom-1 right-1 text-white bg-black bg-opacity-50 rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Name */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Product Name *
          </h2>
          <input
            type="text"
            placeholder="Type here"
            className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 rounded"
            value={productData.name}
            onChange={(e) =>
              setProductData({ ...productData, name: e.target.value })
            }
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Product Description
          </h2>
          <textarea
            placeholder="Type here"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 rounded"
            value={productData.description}
            onChange={(e) =>
              setProductData({ ...productData, description: e.target.value })
            }
          />
        </div>

        {/* Category Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Category *
          </h2>
          {loadingCategories ? (
            <div className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-50 text-gray-500">
              Loading categories...
            </div>
          ) : (
            <select
              className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 bg-white rounded"
              value={productData.category_id}
              onChange={(e) =>
                setProductData({ ...productData, category_id: e.target.value })
              }
              disabled={loadingCategories}
            >
              <option value="">
                {(categories || []).length === 0
                  ? "No categories available"
                  : "Select a category"}
              </option>
              {(categories || []).map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
          {!loadingCategories &&
            (categories || []).length === 0 &&
            !categoryError && (
              <p className="text-sm text-gray-500 mt-1">
                No categories found. Please add categories first.
              </p>
            )}
        </div>

        {/* Pricing */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Product Price
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Original Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 rounded"
                  value={productData.price}
                  onChange={(e) =>
                    setProductData({ ...productData, price: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Offer Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 rounded"
                  value={productData.offerPrice}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      offerPrice: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || loadingCategories}
          className={`w-full py-3 px-6 ${
            loading || loadingCategories
              ? "bg-emerald-400 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-700"
          } text-white font-medium rounded-lg shadow-sm transition-colors`}
        >
          {loading
            ? "ADDING..."
            : loadingCategories
            ? "LOADING..."
            : "ADD PRODUCT"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
