
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";
import axios from "axios";
import {
  categoryNames,
  brands,
  parseSpecs,
  specsToText,
} from "../../utils/productMeta";

export default function EditProductPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Product passed from Admin Products page
  const existingProduct = location.state;

  // Product details
  const [productId] = useState(
    existingProduct?.productId ?? ""
  );

  const [name, setName] = useState(
    existingProduct?.name ?? ""
  );

  const [altName, setAltName] = useState(
    existingProduct?.altName?.join(", ") ?? ""
  );

  const [description, setDescription] = useState(
    existingProduct?.description ?? ""
  );

  // New images selected by the admin
  const [images, setImages] = useState([]);

  const [labeledPrice, setLabeledPrice] = useState(
    existingProduct?.labeledPrice ?? 0
  );

  const [price, setPrice] = useState(
    existingProduct?.price ?? 0
  );

  const [stock, setStock] = useState(
    existingProduct?.stock ?? 0
  );

  // Correctly load existing brand
  const [brand, setBrand] = useState(
    existingProduct?.brand ?? ""
  );

  // Correctly load existing category
  const [category, setCategory] = useState(
    existingProduct?.category ?? categoryNames[0] ?? ""
  );

  // Convert existing specifications into editable text
  const [specsText, setSpecsText] = useState(
    specsToText(existingProduct?.specs ?? {})
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect when no product was selected
  useEffect(() => {
    if (!existingProduct) {
      toast.error("Please select a product to edit");

      navigate("/admin/products", {
        replace: true,
      });
    }
  }, [existingProduct, navigate]);

  // Validate product details
  function validateProduct() {
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

    return true;
  }

  // Update product
  async function updateProduct(event) {
    event.preventDefault();

    if (isSubmitting || !existingProduct) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please Login First");
      return;
    }

    if (!validateProduct()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Keep existing images unless new ones are selected
      let imageUrls = existingProduct.images ?? [];

      if (images.length > 0) {
        imageUrls = await Promise.all(
          images.map((image) => mediaUpload(image))
        );
      }

      const altNamesArray = altName
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const product = {
        productId,
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

      await axios.put(
        import.meta.env.VITE_BACKEND_URL +
          "/api/products/" +
          productId,
        product,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      toast.success("Product updated successfully");

      navigate("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update product. Please try again."
      );
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
            <h1 className="text-3xl font-bold text-white">
              Edit Product
            </h1>

            <p className="text-slate-400 mt-2">
              Update existing product information
            </p>
          </div>

          <Link
            to="/admin/products"
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition"
          >
            Back to Products
          </Link>
        </div>

        <form
          onSubmit={updateProduct}
          className="bg-white rounded-2xl shadow-xl border border-slate-200 p-5 md:p-8"
        >
          {/* Basic Information */}
          <h2 className="text-xl font-bold text-slate-900 mb-5 border-b border-slate-200 pb-3">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <div>
              <label htmlFor="productId" className={labelClass}>
                Product ID
              </label>

              <input
                id="productId"
                type="text"
                value={productId}
                disabled
                className={`${inputClass} bg-slate-100 text-slate-500 cursor-not-allowed`}
              />
            </div>

            <div>
              <label htmlFor="productName" className={labelClass}>
                Product Name *
              </label>

              <input
                id="productName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="altNames" className={labelClass}>
                Alternative Names
              </label>

              <input
                id="altNames"
                type="text"
                value={altName}
                onChange={(e) => setAltName(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className={labelClass}>
                Description
              </label>

              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                className={inputClass}
              />
            </div>
          </div>

          {/* Classification */}
          <h2 className="text-xl font-bold text-slate-900 mb-5 border-b border-slate-200 pb-3">
            Product Classification
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <div>
              <label htmlFor="brand" className={labelClass}>
                Brand
              </label>

              <input
                id="brand"
                list="brandList"
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Samsung"
                className={inputClass}
              />

              <datalist id="brandList">
                {brands.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
            </div>

            <div>
              <label htmlFor="category" className={labelClass}>
                Category *
              </label>

              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputClass}
              >
                {existingProduct?.category &&
                  !categoryNames.includes(existingProduct.category) && (
                    <option value={existingProduct.category}>
                      {existingProduct.category}
                    </option>
                  )}

                {categoryNames.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Specifications */}
          <h2 className="text-xl font-bold text-slate-900 mb-5 border-b border-slate-200 pb-3">
            Product Specifications
          </h2>

          <div className="mb-8">
            <label
              htmlFor="specifications"
              className={labelClass}
            >
              Specifications
            </label>

            <textarea
              id="specifications"
              rows={5}
              value={specsText}
              onChange={(e) => setSpecsText(e.target.value)}
              placeholder={
                "RAM: 8GB\nStorage: 256GB\nBattery: 5000mAh"
              }
              className={inputClass}
            />
          </div>

          {/* Product Images */}
          <h2 className="text-xl font-bold text-slate-900 mb-5 border-b border-slate-200 pb-3">
            Product Images
          </h2>

          <div className="mb-8">
            <label
              htmlFor="productImages"
              className={labelClass}
            >
              Replace Product Images (Optional)
            </label>

            {existingProduct?.images?.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-4">
                {existingProduct.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Product image ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-lg border border-slate-200"
                  />
                ))}
              </div>
            )}

            <input
              id="productImages"
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                setImages(Array.from(e.target.files || []))
              }
              className="block w-full text-sm text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-sky-100 file:text-sky-700 file:font-semibold hover:file:bg-sky-200"
            />

            <p className="text-xs text-slate-500 mt-2">
              Leave empty to keep existing images.
              Selecting new images will replace all existing images.
            </p>
          </div>

          {/* Pricing */}
          <h2 className="text-xl font-bold text-slate-900 mb-5 border-b border-slate-200 pb-3">
            Pricing & Inventory
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <div>
              <label htmlFor="labeledPrice" className={labelClass}>
                Labeled Price (Rs.) *
              </label>

              <input
                id="labeledPrice"
                type="number"
                min="0"
                step="0.01"
                value={labeledPrice}
                onChange={(e) =>
                  setLabeledPrice(Number(e.target.value))
                }
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="price" className={labelClass}>
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

            <div>
              <label htmlFor="stock" className={labelClass}>
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

          {/* Buttons */}
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
                ? "Updating Product..."
                : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
