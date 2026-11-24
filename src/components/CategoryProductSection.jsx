
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

import ProductCard from "./productCard";
import Loading from "./loading";

export default function CategoryProductSection({ category }) {

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {

        const controller = new AbortController();

        setIsLoading(true);
        setHasError(false);
        setProducts([]);

        axios.get(
            import.meta.env.VITE_BACKEND_URL + "/api/products",
            {
                params: {
                    category: category,
                    page: 1,
                    limit: 8
                },
                signal: controller.signal
            }
        )
        .then((response) => {

            const availableProducts = response.data.products
                .filter((product) =>
                    product.isAvailable && product.stock > 0
                )
                .slice(0, 4);

            setProducts(availableProducts);
            setIsLoading(false);

        })
        .catch((error) => {

            if (axios.isCancel(error)) return;

            setHasError(true);
            setIsLoading(false);

        });

        return () => controller.abort();

    }, [category]);

    // Hide categories without available products
    if (!isLoading && !hasError && products.length === 0) {
        return null;
    }

    return (

        <section className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8">

            {/* Section Header */}
            <div className="flex items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-700">

                <div className="flex items-center gap-3">

                    <div className="w-1 h-7 bg-sky-400 rounded-full" />

                    <h2 className="text-xl md:text-3xl font-bold text-white">
                        {category}
                    </h2>

                </div>

                <Link
                    to={`/products?category=${encodeURIComponent(category)}`}
                    className="flex items-center gap-2 bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-400 hover:text-slate-950 px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 whitespace-nowrap"
                >
                    View All
                    <FiArrowRight className="text-base" />
                </Link>

            </div>

            {/* Products */}
            {isLoading ? (

                <div className="w-full flex justify-center py-10">
                    <Loading />
                </div>

            ) : hasError ? (

                <p className="text-slate-400 text-center py-6">
                    Unable to load products. Please try again later.
                </p>

            ) : (

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">

                    {products.map((product) => (

                        <ProductCard
                            key={product.productId}
                            product={product}
                            fullWidth={true}
                        />

                    ))}

                </div>

            )}

        </section>

    );
}
