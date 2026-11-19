import { Link } from "react-router-dom";
import { addToCart} from "../utils/cart.jsx"
import { toast } from "react-hot-toast"
 
export default function ProductCard({ product }) {
    return (
        <Link
            to={"/overview/" + product.productId}
            className="w-[300px] bg-surface text-secondary border border-slate-700 rounded-xl overflow-hidden shadow-lg hover:border-accent hover:-translate-y-1 transition-all duration-300"
        >

            {/* Product Image */}
            <div className="h-[220px] w-full bg-slate-100 p-3">
                <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-contain"
                />
            </div>

            {/* Product Details */}
            <div className="p-4 flex flex-col gap-2">

                {/* Product Name */}
                <h2 className="text-lg font-semibold text-slate-100 line-clamp-1">
                    {product.name}
                </h2>

                {/* Description */}
                <p className="text-sm text-slate-400 line-clamp-2">
                    {product.description}
                </p>

                {/* Price Section */}
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-xl font-bold text-accent">
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

                
                <button
                    type="button"
                    onClick={(e)=>{
                        e.preventDefault()
                        e.stopPropagation()
                        addToCart(product,1)
                        toast.success("Added to cart")
                    }}
                    disabled={!product.isAvailable || product.stock <= 0}
                    className={`mt-3 w-full py-3 rounded-lg font-semibold transition
                    ${
                        product.isAvailable && product.stock > 0
                            ? "bg-accent text-primary hover:bg-sky-300"
                            : "bg-slate-700 text-muted cursor-not-allowed"
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