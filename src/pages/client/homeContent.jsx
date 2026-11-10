import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import ProductCard from "../../components/productCard"
import Loading from "../../components/loading"
import { categories } from "../../utils/productMeta"

export default function HomeContent(){
    const [featured,setFeatured]=useState([])
    const [isLoading,setIsLoading]=useState(true)

    useEffect(()=>{
        axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products", {
            params: {
                page: 1,
                limit: 8
            }
        })
        .then((response) => {
            setFeatured(
                response.data.products.filter((p) => p.stock > 0)
            );

            setIsLoading(false);
        })
        .catch(()=>{
            setIsLoading(false)
        })
    },[])

    return(
        <div className="w-full min-h-full self-start flex flex-col items-center">
            {/* Hero */}
            <section className="w-full bg-secondary text-white py-16 px-6 flex flex-col items-center text-center gap-4">
                <h1 className="text-4xl md:text-6xl font-bold">Latest Smartphones & Accessories</h1>
                <p className="text-lg md:text-xl text-gray-200 max-w-2xl">
                    Genuine devices, great prices and fast delivery.
                </p>
                <Link to="/products" className="mt-2 bg-accent hover:bg-accent/80 text-white font-bold px-8 py-3 rounded-full transition-all duration-300">
                    Shop Now
                </Link>
            </section>

            {/* Categories */}
            <section className="w-full max-w-5xl p-6">
                <h2 className="text-3xl font-bold text-secondary text-center mb-6">Shop by Category</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categories.map((c)=>(
                        <Link
                            key={c.name}
                            to={"/products?category="+encodeURIComponent(c.name)}
                            className="bg-primary rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col items-center gap-2">
                            <span className="text-4xl">{c.icon}</span>
                            <span className="font-semibold text-secondary">{c.name}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured */}
            <section className="w-full max-w-7xl p-6 flex flex-col items-center">
                <h2 className="text-3xl font-bold text-secondary text-center mb-6">Featured Products</h2>
                {isLoading ? <Loading /> : featured.length==0 ? (
                    <p className="text-gray-500">New products coming soon.</p>
                ) : (
                    <div className="w-full flex flex-wrap justify-center gap-5">
                        {featured.map((product)=>(
                            <ProductCard key={product.productId} product={product} />
                        ))}
                    </div>
                )}
                <Link to="/products" className="mt-8 text-accent font-bold hover:underline">View all products →</Link>
            </section>

            <footer className="w-full bg-secondary text-white text-center py-6 mt-6">
                © {new Date().getFullYear()} Mobile Shop. All rights reserved.
            </footer>
        </div>
    )
}