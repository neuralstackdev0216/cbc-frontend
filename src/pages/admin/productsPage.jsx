
import { useState, useEffect } from "react";
import axios from "axios";
import { sampleProducts } from "../../assets/sampleData";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function AdminProductsPage() {
    const [products, setProducts] = useState(sampleProducts);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        if (isLoading === true) {
            axios
                .get(import.meta.env.VITE_BACKEND_URL + "/api/products")
                .then((response) => {
                    setProducts(response.data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                    toast.error("Error loading products");
                    setIsLoading(false);
                });
        }
    }, [isLoading]);

    function deleteProduct(productId) {
        const token = localStorage.getItem("token");

        if (token == null) {
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
                setIsLoading(true);
            })
            .catch((e) => {
                console.log(e);

                if (e.response?.data?.message) {
                    toast.error(e.response.data.message);
                } else {
                    toast.error("Error deleting product");
                }
            });
    }

    return (
        <div className="w-full h-full max-h-full overflow-y-auto bg-primary p-6 relative">

            {/* Page Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-secondary">
                        Products
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage your products and inventory
                    </p>
                </div>

                <Link
                    to="/admin/add-product"
                    className="flex items-center gap-2 bg-accent hover:bg-secondary text-white font-bold px-5 py-3 rounded-lg shadow-md transition-all duration-300"
                >
                    <FaPlus />
                    Add Product
                </Link>
            </div>

            {/* Product Count */}
            {!isLoading && (
                <div className="mb-4">
                    <span className="text-sm text-gray-500">
                        Total Products:{" "}
                        <span className="font-bold text-accent">
                            {products.length}
                        </span>
                    </span>
                </div>
            )}

            {/* Loading */}
            {isLoading ? (
                <div className="w-full h-[500px] flex flex-col justify-center items-center">

                    <div className="w-[65px] h-[65px] border-[5px] border-gray-300 border-t-accent rounded-full animate-spin"></div>

                    <p className="mt-4 text-secondary font-semibold">
                        Loading products...
                    </p>

                </div>
            ) : products.length === 0 ? (

                /* Empty State */
                <div className="w-full h-[400px] flex flex-col justify-center items-center bg-white rounded-2xl shadow-md">

                    <h2 className="text-2xl font-bold text-secondary">
                        No Products Found
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Start by adding your first product.
                    </p>

                    <Link
                        to="/admin/add-product"
                        className="mt-5 bg-accent hover:bg-secondary text-white px-5 py-3 rounded-lg font-bold transition-all duration-300"
                    >
                        Add Product
                    </Link>

                </div>

            ) : (

                /* Product Table */
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">

                    <div className="overflow-x-auto">

                        <table className="w-full text-center border-collapse">

                            <thead>
                                <tr className="bg-secondary text-white">

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
                                        className="border-b border-gray-200 hover:bg-primary transition-all duration-200"
                                    >

                                        {/* Product ID */}
                                        <td className="px-5 py-4">
                                            <span className="font-semibold text-secondary">
                                                {item.productId}
                                            </span>
                                        </td>

                                        {/* Product Name */}
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col items-start">
                                                <span className="font-bold text-secondary">
                                                    {item.name}
                                                </span>

                                                <span className="text-xs text-gray-400">
                                                    Product
                                                </span>
                                            </div>
                                        </td>

                                        {/* Product Image */}
                                        <td className="px-5 py-4">

                                            <div className="flex justify-center">

                                                <img
                                                    src={item.images[0]}
                                                    alt={item.name}
                                                    className="w-[65px] h-[65px] object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                                                />

                                            </div>

                                        </td>

                                        {/* Labeled Price */}
                                        <td className="px-5 py-4">

                                            <span className="text-gray-500 line-through">
                                                Rs.{" "}
                                                {item.labeledPrice.toFixed(2)}
                                            </span>

                                        </td>

                                        {/* Price */}
                                        <td className="px-5 py-4">

                                            <span className="text-lg font-bold text-accent">
                                                Rs.{" "}
                                                {item.price.toFixed(2)}
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

                                                <button
                                                    className="w-[40px] h-[40px] flex justify-center items-center rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
                                                    title="Edit Product"
                                                    onClick={() => {
                                                        navigate(
                                                            "/admin/edit-product",
                                                            {
                                                                state: item,
                                                            }
                                                        );
                                                    }}
                                                >
                                                    <FaEdit />
                                                </button>

                                                <button
                                                    className="w-[40px] h-[40px] flex justify-center items-center rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300"
                                                    title="Delete Product"
                                                    onClick={() =>
                                                        deleteProduct(
                                                            item.productId
                                                        )
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

                </div>
            )}

        </div>
    );
}
