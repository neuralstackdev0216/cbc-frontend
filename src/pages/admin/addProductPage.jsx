
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBoxOpen, FaUpload } from "react-icons/fa";
import axios from "axios";

import mediaUpload from "../../utils/mediaUpload";
import {
  categoryNames,
  brands,
  parseSpecs,
} from "../../utils/productMeta.jsx";

export default function AddProductPage() {
  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [altName, setAltName] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  const [labeledPrice, setLabeledPrice] = useState(0);
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);

  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState(
    categoryNames[0] ?? ""
  );
  const [specsText, setSpecsText] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // Validate product details before submitting
  function validateProduct() {
    if (!productId.trim()) {
      toast.error("Product ID is required");
      return false;
    }

    if (!name.trim()) {
      toast.error("Product name is required");
      return false;
    }

    if (!category) {
      toast.error("Please select a category");
      return false;
    }

    if (!Number.isFinite(price) || price <= 0) {
      toast.error("Price must be greater than zero");
      return false;
    }

    if (
      !Number.isFinite(labeledPrice) ||
      labeledPrice < price
    ) {
      toast.error(
        "Labeled price cannot be less than selling price"
      );
      return false;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      toast.error("Stock must be a non-negative whole number");
      return false;
    }

    if (images.length === 0) {
      toast.error("Please upload at least one product image");
      return false;
    }

    return true;
  }

  // Submit new product to backend
  async function addProduct(event) {
    event.preventDefault();

    if (isSubmitting) return;

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      return;
    }

    if (!validateProduct()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload all selected product images
      const imageUrls = await Promise.all(
        images.map((image) => mediaUpload(image))
      );

      // Convert comma-separated names to an array
      const altNamesArray = altName
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      // Prepare product object
      const product = {
        productId: productId.trim(),
        name: name.trim(),
        altName: altNamesArray,
        description: description.trim(),
        images: imageUrls,
        labeledPrice,
        price,
        stock,
        brand: brand.trim() || "Other",
        category,
        specs: parseSpecs(specsText),
      };

      // Send POST request
      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/products",
        product,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      toast.success("Product added successfully");

      navigate("/admin/products");
    } catch (error) {
      console.error("Error adding product:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Failed to add product. Please try again.";

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-slate-300 " +
    "bg-white text-slate-900 placeholder:text-slate-400 " +
    "focus:outline-none focus:ring-2 focus:ring-sky-500 " +
    "focus:border-sky-500 transition";

  const labelClass =
    "block text-sm font-semibold text-slate-700 mb-2";

  return (
    <div className="w-full h-full overflow-y-auto bg-primary p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <FaBoxOpen className="text-sky-400" />
              Add Product
            </h1>

            <p className="text-slate-400 mt-2">
              Add a new product to your store inventory
            </p>
          </div>

          <Link
            to="/admin/products"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition"
          >
            <FaArrowLeft />
            Back to Products
          </Link>
        </div>

        {/* Product Form */}
        <form
          onSubmit={addProduct}
          className="bg-white rounded-2xl shadow-xl border border-slate-200 p-5 md:p-8"
        >
          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-5 border-b border-slate-200 pb-3">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Product ID */}
              <div>
                <label
                  htmlFor="productId"
                  className={labelClass}
                >
                  Product ID *
                </label>

                <input
                  id="productId"
                  type="text"
                  placeholder="e.g. SAM001"
                  value={productId}
                  onChange={(e) =>
                    setProductId(e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              {/* Product Name */}
              <div>
                <label
                  htmlFor="productName"
                  className={labelClass}
                >
                  Product Name *
                </label>

                <input
                  id="productName"
                  type="text"
                  placeholder="e.g. Samsung Galaxy S24"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* Alternative Names */}
              <div className="md:col-span-2">
                <label
                  htmlFor="altNames"
                  className={labelClass}
                >
                  Alternative Names
                </label>

                <input
                  id="altNames"
                  type="text"
                  placeholder="e.g. Galaxy S24, Samsung S24"
                  value={altName}
                  onChange={(e) =>
                    setAltName(e.target.value)
                  }
                  className={inputClass}
                />

                <p className="text-xs text-slate-500 mt-2">
                  Separate multiple names using commas.
                </p>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className={labelClass}
                >
                  Description
                </label>

                <textarea
                  id="description"
                  rows={4}
                  placeholder="Enter product description..."
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Classification */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-5 border-b border-slate-200 pb-3">
              Product Classification
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Brand */}
              <div>
                <label
                  htmlFor="brand"
                  className={labelClass}
                >
                  Brand
                </label>

                <input
                  id="brand"
                  list="brandList"
                  type="text"
                  placeholder="e.g. Samsung"
                  value={brand}
                  onChange={(e) =>
                    setBrand(e.target.value)
                  }
                  className={inputClass}
                />

                <datalist id="brandList">
                  {brands.map((item) => (
                    <option
                      key={item}
                      value={item}
                    />
                  ))}
                </datalist>
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className={labelClass}
                >
                  Category *
                </label>

                <select
                  id="category"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                  className={inputClass}
                >
                  {categoryNames.length === 0 && (
                    <option value="">
                      No categories available
                    </option>
                  )}

                  {categoryNames.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Product Specifications */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-5 border-b border-slate-200 pb-3">
              Product Specifications
            </h2>

            <label
              htmlFor="specifications"
              className={labelClass}
            >
              Specifications
            </label>

            <textarea
              id="specifications"
              rows={5}
              placeholder={
                "RAM: 8GB\n" +
                "Storage: 256GB\n" +
                "Battery: 5000mAh"
              }
              value={specsText}
              onChange={(e) =>
                setSpecsText(e.target.value)
              }
              className={inputClass}
            />

            <p className="text-xs text-slate-500 mt-2">
              Enter one specification per line using
              Key: Value format.
            </p>
          </div>

          {/* Images */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-5 border-b border-slate-200 pb-3">
              Product Images
            </h2>

            <label
              htmlFor="productImages"
              className={labelClass}
            >
              Upload Images *
            </label>

            <div className="border-2 border-dashed border-slate-300 rounded-xl p-5 bg-slate-50">
              <div className="flex items-center gap-3 mb-3">
                <FaUpload className="text-sky-500 text-xl" />

                <span className="text-sm text-slate-600">
                  Select one or more product images
                </span>
              </div>

              <input
                id="productImages"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  setImages(
                    Array.from(e.target.files || [])
                  )
                }
                className="block w-full text-sm text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-sky-100 file:text-sky-700 file:font-semibold hover:file:bg-sky-200"
              />

              {images.length > 0 && (
                <p className="text-sm text-green-700 mt-3 font-medium">
                  {images.length} image(s) selected
                </p>
              )}
            </div>
          </div>

          {/* Pricing and Inventory */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-5 border-b border-slate-200 pb-3">
              Pricing & Inventory
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Labeled Price */}
              <div>
                <label
                  htmlFor="labeledPrice"
                  className={labelClass}
                >
                  Labeled Price (Rs.) *
                </label>

                <input
                  id="labeledPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={labeledPrice}
                  onChange={(e) =>
                    setLabeledPrice(
                      Number(e.target.value)
                    )
                  }
                  className={inputClass}
                />
              </div>

              {/* Selling Price */}
              <div>
                <label
                  htmlFor="price"
                  className={labelClass}
                >
                  Selling Price (Rs.) *
                </label>

                <input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) =>
                    setPrice(Number(e.target.value))
                  }
                  className={inputClass}
                />
              </div>

              {/* Stock */}
              <div>
                <label
                  htmlFor="stock"
                  className={labelClass}
                >
                  Stock Quantity *
                </label>

                <input
                  id="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={stock}
                  onChange={(e) =>
                    setStock(Number(e.target.value))
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-6">
            <Link
              to="/admin/products"
              className="px-6 py-3 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-7 py-3 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Adding Product..."
                : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
