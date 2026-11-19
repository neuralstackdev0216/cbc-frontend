
import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { toast } from "react-hot-toast";

// Number of products displayed per page
const PAGE_LIMIT = 10;

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Used to refresh product data without reloading the page
  const [refreshKey, setRefreshKey] = useState(0);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    limit: PAGE_LIMIT,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const navigate = useNavigate();

  // Fetch products when page or refreshKey changes
  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);

    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/products", {
        params: {
          page: currentPage,
          limit: PAGE_LIMIT,
        },
        signal: controller.signal,
      })
      .then((response) => {
        if (controller.signal.aborted) return;

        setProducts(response.data.products);
        setPagination(response.data.pagination);
      })
      .catch((error) => {
        if (axios.isCancel(error) || controller.signal.aborted) {
          return;
        }

        console.error(error);
        toast.error("Error loading products");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [currentPage, refreshKey]);

  // Navigate between product pages
  function changePage(newPage) {
    if (newPage < 1 || newPage > pagination.totalPages) {
      return;
    }

    if (newPage === currentPage) {
      return;
    }

    setCurrentPage(newPage);
  }

  // Delete a product after confirmation
  function deleteProduct(productId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please Login First");
      return;
    }

    axios
      .delete(
        import.meta.env.VITE_BACKEND_URL +
          "/api/products/" +
          productId,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then(() => {
        toast.success("Product deleted successfully");

        // If this was the last product on a later page,
        // return to the previous page.
        if (products.length === 1 && currentPage > 1) {
          setCurrentPage((previousPage) => previousPage - 1);
        } else {
          // Fetch updated products without reloading the browser
          setRefreshKey((previousKey) => previousKey + 1);
        }
      })
      .catch((error) => {
        console.error(error);

        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Error deleting product");
        }
      });
  }

  return (
    <div className="w-full h-full max-h-full overflow-y-auto bg-primary p-6 relative">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Products
          </h1>

          <p className="text-slate-400 mt-1">
            Manage your products and inventory
          </p>
        </div>

        <Link
          to="/admin/add-product"
          className="flex items-center gap-2 bg-accent hover:bg-sky-500 text-white font-bold px-5 py-3 rounded-lg shadow-md transition-all duration-300"
        >
          <FaPlus />
          Add Product
        </Link>
      </div>

      {/* Product Count */}
      {!isLoading && (
        <div className="mb-4">
          <span className="text-sm text-slate-400">
            Total Products:{" "}
            <span className="font-bold text-accent">
              {pagination.totalProducts}
            </span>
          </span>
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="w-full h-[500px] flex flex-col justify-center items-center">
          <div className="w-[65px] h-[65px] border-[5px] border-slate-600 border-t-accent rounded-full animate-spin"></div>

          <p className="mt-4 text-white font-semibold">
            Loading products...
          </p>
        </div>
      ) : products.length === 0 ? (
        /* Empty State */
        <div className="w-full h-[400px] flex flex-col justify-center items-center bg-white rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold text-slate-900">
            No Products Found
          </h2>

          <p className="text-slate-500 mt-2">
            Start by adding your first product.
          </p>

          <Link
            to="/admin/add-product"
            className="mt-5 bg-accent hover:bg-sky-500 text-white px-5 py-3 rounded-lg font-bold transition-all duration-300"
          >
            Add Product
          </Link>
        </div>
      ) : (
        /* Product Table */
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-slate-800 text-white">
                  <th className="px-5 py-4 text-sm font-bold">
                    Product ID
                  </th>

                  <th className="px-5 py-4 text-sm font-bold">
                    Product
                  </th>

                  <th className="px-5 py-4 text-sm font-bold">
                    Image
                  </th>

                  <th className="px-5 py-4 text-sm font-bold">
                    Labeled Price
                  </th>

                  <th className="px-5 py-4 text-sm font-bold">
                    Price
                  </th>

                  <th className="px-5 py-4 text-sm font-bold">
                    Stock
                  </th>

                  <th className="px-5 py-4 text-sm font-bold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-slate-200 hover:bg-slate-50 transition-all duration-200"
                  >
                    {/* Product ID */}
                    <td className="px-5 py-4">
                      <span className="font-semibold text-slate-900">
                        {item.productId}
                      </span>
                    </td>

                    {/* Product Name */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col items-start">
                        <span className="font-bold text-slate-900">
                          {item.name}
                        </span>

                        <span className="text-xs text-slate-500">
                          Product
                        </span>
                      </div>
                    </td>

                    {/* Product Image */}
                    <td className="px-5 py-4">
                      <div className="flex justify-center">
                        <img
                          src={item.images?.[0] || ""}
                          alt={item.name}
                          className="w-[65px] h-[65px] object-cover rounded-xl border-2 border-slate-200 shadow-sm"
                        />
                      </div>
                    </td>

                    {/* Labeled Price */}
                    <td className="px-5 py-4">
                      <span className="text-slate-500 line-through">
                        Rs.{" "}
                        {Number(item.labeledPrice).toFixed(2)}
                      </span>
                    </td>

                    {/* Selling Price */}
                    <td className="px-5 py-4">
                      <span className="text-lg font-bold text-accent">
                        Rs. {Number(item.price).toFixed(2)}
                      </span>
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-4">
                      {item.stock > 0 ? (
                        <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold text-sm">
                          {item.stock} Available
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-600 font-bold text-sm">
                          Out of Stock
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex justify-center items-center gap-3">
                        {/* Edit Button */}
                        <button
                          type="button"
                          className="w-[40px] h-[40px] flex justify-center items-center rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
                          title="Edit Product"
                          aria-label={`Edit ${item.name}`}
                          onClick={() => {
                            navigate("/admin/edit-product", {
                              state: item,
                            });
                          }}
                        >
                          <FaEdit />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          className="w-[40px] h-[40px] flex justify-center items-center rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300"
                          title="Delete Product"
                          aria-label={`Delete ${item.name}`}
                          onClick={() =>
                            deleteProduct(item.productId)
                          }
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-wrap justify-between items-center gap-4 px-6 py-4 border-t border-slate-200 bg-slate-50">
            <p className="text-sm text-slate-600">
              Page {pagination.currentPage} of{" "}
              {pagination.totalPages}
            </p>

            <div className="flex items-center gap-2">
              {/* Previous */}
              <button
                type="button"
                onClick={() => changePage(currentPage - 1)}
                disabled={!pagination.hasPreviousPage}
                className="px-4 py-2 rounded-lg bg-slate-800 text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700"
              >
                Previous
              </button>

              {/* Numbered Pages */}
              {Array.from(
                { length: pagination.totalPages },
                (_, index) => index + 1
              ).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => changePage(pageNumber)}
                  disabled={pageNumber === currentPage}
                  className={`w-10 h-10 rounded-lg font-semibold ${
                    currentPage === pageNumber
                      ? "bg-accent text-white"
                      : "bg-white border border-slate-300 text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              {/* Next */}
              <button
                type="button"
                onClick={() => changePage(currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="px-4 py-2 rounded-lg bg-slate-800 text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
