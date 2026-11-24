
import { Link } from "react-router-dom";
import { addToCart } from "../utils/cart.jsx";
import { toast } from "react-hot-toast";

export default function ProductCard({
    product,
    fullWidth = false
}) {

    const inStock = product.isAvailable && product.stock > 0;

    return (

        <div
            className={`
                ${fullWidth ? "w-full min-w-0" : "w-[300px] max-w-full"}
                bg-surface text-secondary border border-slate-700
                rounded-xl overflow-hidden shadow-lg flex flex-col
                hover:border-accent hover:-translate-y-1
                transition-all duration-300
            `}
        >

            {/* Product Image */}
            <Link
                to={"/overview/" + product.productId}
                className="block h-[150px] sm:h-[190px] lg:h-[220px] w-full bg-slate-100 p-3"
            >
                <img
                    src={product.images?.[0]}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-contain"
                />
            </Link>

            {/* Product Details */}
            <div className="p-3 md:p-4 flex flex-col gap-2 flex-1">

                {/* Product Name */}
                <Link
                    to={"/overview/" + product.productId}
                    className="text-sm md:text-lg font-semibold text-slate-100 line-clamp-2 min-h-[40px] md:min-h-[56px] hover:text-sky-400 transition-colors"
                >
                    {product.name}
                </Link>

                {/* Description */}
                {!fullWidth && (
                    <p className="text-sm text-slate-400 line-clamp-2 overflow-hidden max-h-10">
                        {product.description}
                    </p>
                )}

                {/* Price Section */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2">

                    <span className="text-base md:text-xl font-bold text-accent">
                        Rs. {product.price.toLocaleString()}
                    </span>

                    {product.labeledPrice > product.price && (

                        <span className="text-xs md:text-sm text-gray-400 line-through">
                            Rs. {product.labeledPrice.toLocaleString()}
                        </span>

                    )}

                </div>

                {/* Stock Status */}
                <div className="mt-1">

                    {inStock ? (

                        <span className="inline-block text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                            In Stock ({product.stock})
                        </span>

                    ) : (

                        <span className="inline-block text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">
                            Out of Stock
                        </span>

                    )}

                </div>

                {/* Add to Cart */}
                <div className="mt-auto pt-3">

                    <button
                        type="button"
                        onClick={() => {
                            addToCart(product, 1);
                            toast.success("Added to cart");
                        }}
                        disabled={!inStock}
                        className={`
                            w-full py-2.5 md:py-3 rounded-lg
                            text-sm md:text-base font-semibold transition
                            ${
                                inStock
                                    ? "bg-accent text-primary hover:bg-sky-300"
                                    : "bg-slate-700 text-muted cursor-not-allowed"
                            }
                        `}
                    >
                        Add to Cart
                    </button>

                </div>

            </div>

        </div>

    );
}
