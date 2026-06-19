import { Link } from "react-router-dom";


export default function ProductCard({ product }) {
    return (
        <Link to={"/overview/"+product.productId} className="w-[300px] bg-white rounded- shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">

            {/* Product Image */}
            <div className="h-[220px] w-full bg-gray-100">
                <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Product Details */}
            <div className="p-4 flex flex-col gap-2">

                {/* Product Name */}
                <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
                    {product.name}
                </h2>

                {/* Description */}
                <p className="text-sm text-gray-500 line-clamp-2">
                    {product.description}
                </p>

                {/* Price Section */}
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-xl font-bold text-green-600">
                        Rs. {product.price.toLocaleString()}
                    </span>

                    {product.labeledPrice > product.price && (
                        <span className="text-sm text-gray-400 line-through">
                            Rs. {product.labeledPrice.toLocaleString()}
                        </span>
                    )}
                </div>

                {/* Stock Status */}
                <div className="mt-1">
                    {product.isAvailable && product.stock > 0 ? (
                        <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                            In Stock ({product.stock})
                        </span>
                    ) : (
                        <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">
                            Out of Stock
                        </span>
                    )}
                </div>

                {/* Button */}
                <button
                    disabled={!product.isAvailable || product.stock <= 0}
                    className={`mt-3 w-full py-2 rounded-lg font-medium transition
                    ${
                        product.isAvailable && product.stock > 0
                            ? "bg-black text-white hover:bg-gray-800"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                    Add to Cart
                </button>
            </div>
        </Link>
    )
}


//EEF5FF
//44444E
//176B87