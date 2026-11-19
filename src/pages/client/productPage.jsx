import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/productCard";
import Loading from "../../components/loading";
import { categories, brands } from "../../utils/productMeta";

export default function ProductPage() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        totalProducts: 0,
        limit: 10,
        hasNextPage: false,
        hasPreviousPage: false
    });

    const [searchParams, setSearchParams] = useSearchParams();

    // Read filters from URL
    const category = searchParams.get("category") || "";
    const search = searchParams.get("search") || "";
    const brand = searchParams.get("brand") || "";
    const sort = searchParams.get("sort") || "";

    // Applied price filters from URL
    const selectedMinPrice = searchParams.get("minPrice") || "";
    const selectedMaxPrice = searchParams.get("maxPrice") || "";

    // Price input states
    const [minPrice, setMinPrice] = useState(selectedMinPrice);
    const [maxPrice, setMaxPrice] = useState(selectedMaxPrice);

    // Keep inputs synchronized with URL changes
    useEffect(() => {
        setMinPrice(selectedMinPrice);
        setMaxPrice(selectedMaxPrice);
    }, [selectedMinPrice, selectedMaxPrice]);

    // Fetch products
    useEffect(() => {
        const controller = new AbortController();

        setIsLoading(true);

        const params = {
            page: page,
            limit: 2
        };

        if (category) params.category = category;
        if (search) params.search = search;
        if (brand) params.brand = brand;
        if (sort) params.sort = sort;

        // Send applied price range to backend
        if (selectedMinPrice !== "") {
            params.minPrice = selectedMinPrice;
        }

        if (selectedMaxPrice !== "") {
            params.maxPrice = selectedMaxPrice;
        }

        axios.get(
            import.meta.env.VITE_BACKEND_URL + "/api/products",
            { params, signal: controller.signal }
        )
            .then((response) => {
                setProducts(response.data.products);
                setPagination(response.data.pagination);
            })
            .catch((error) => {
                if (error.code === "ERR_CANCELED") return;

                console.error("Failed to load products:", error);
                setProducts([]);
                setPagination({
                    currentPage: 1,
                    totalPages: 0,
                    totalProducts: 0,
                    limit: 2,
                    hasNextPage: false,
                    hasPreviousPage: false
                });
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            });

        return () => controller.abort();

    }, [
        category,
        search,
        brand,
        sort,
        selectedMinPrice,
        selectedMaxPrice,
        page
    ]);

    // Apply price range
    const handleApplyPrice = () => {
        const invalidMin =
            minPrice !== "" &&
            (!Number.isFinite(Number(minPrice)) || Number(minPrice) < 0);

        const invalidMax =
            maxPrice !== "" &&
            (!Number.isFinite(Number(maxPrice)) || Number(maxPrice) < 0);

        const invalidRange =
            minPrice !== "" &&
            maxPrice !== "" &&
            Number(minPrice) > Number(maxPrice);

        if (invalidMin || invalidMax || invalidRange) {
            alert("Please enter a valid price range.");
            return;
        }

        const params = new URLSearchParams(searchParams);

        if (minPrice !== "") {
            params.set("minPrice", minPrice);
        } else {
            params.delete("minPrice");
        }

        if (maxPrice !== "") {
            params.set("maxPrice", maxPrice);
        } else {
            params.delete("maxPrice");
        }

        setPage(1);
        setSearchParams(params);
    };

    return (
        <div className="w-full min-h-screen bg-primary text-secondary px-4 py-8">

            {/* Page Heading */}
            <section className="max-w-7xl mx-auto bg-surface rounded-2xl p-6 mb-8">
                <p className="text-accent text-sm font-semibold mb-2">
                    NOVAMOBILES COLLECTION
                </p>

                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    Explore Our Products
                </h1>

                <p className="text-muted">
                    Discover smartphones, tablets, accessories and more.
                </p>
            </section>

            {/* Product Filters */}
            <section className="max-w-7xl mx-auto bg-surface rounded-2xl p-5 mb-8">

                <h2 className="text-xl font-bold text-secondary mb-5">
                    Find Your Device
                </h2>

                {/* Category Buttons */}
                <div className="flex flex-wrap justify-center gap-3 mb-6">

                    <button
                        onClick={() => {
                            setPage(1);
                            setSearchParams({});
                        }}
                        className={`px-4 py-2 rounded-full border font-semibold transition
                            ${category === ""
                                ? "bg-accent text-primary border-accent"
                                : "border-slate-600 text-secondary hover:border-accent"
                            }`}
                    >
                        All
                    </button>

                    {categories.map((c) => (
                        <button
                            key={c.name}
                            onClick={() => {
                                setPage(1);
                                setSearchParams({ category: c.name });
                            }}
                            className={`px-4 py-2 rounded-full border font-semibold transition
                                ${category === c.name
                                    ? "bg-accent text-primary border-accent"
                                    : "border-slate-600 text-secondary hover:border-accent"
                                }`}
                        >
                            {c.icon} {c.name}
                        </button>
                    ))}
                </div>

                {/* Brand and Sorting Filters */}
                <div className="flex flex-wrap justify-center gap-4">

                    {/* Brand Filter */}
                    <select
                        aria-label="Filter by brand"
                        value={brand}
                        onChange={(e) => {
                            const params = new URLSearchParams(searchParams);

                            if (e.target.value) {
                                params.set("brand", e.target.value);
                            } else {
                                params.delete("brand");
                            }

                            setPage(1);
                            setSearchParams(params);
                        }}
                        className="bg-primary text-secondary border border-slate-600 rounded-lg px-4 py-3 focus:border-accent focus:outline-none"
                    >
                        <option value="">All Brands</option>

                        {brands.map((b) => (
                            <option key={b} value={b}>
                                {b}
                            </option>
                        ))}
                    </select>

                    {/* Price Sorting */}
                    <select
                        aria-label="Sort products"
                        value={sort}
                        onChange={(e) => {
                            const params = new URLSearchParams(searchParams);

                            if (e.target.value) {
                                params.set("sort", e.target.value);
                            } else {
                                params.delete("sort");
                            }

                            setPage(1);
                            setSearchParams(params);
                        }}
                        className="bg-primary text-secondary border border-slate-600 rounded-lg px-4 py-3 focus:border-accent focus:outline-none"
                    >
                        <option value="">Default Sorting</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                    </select>
                </div>

                {/* Price Range Filter */}
                <div className="mt-6">

                    <h3 className="font-semibold mb-3">
                        Price Range (LKR)
                    </h3>

                    <div className="flex flex-wrap gap-3">

                        {/* Minimum Price */}
                        <input
                            type="number"
                            min="0"
                            placeholder="Min Price"
                            aria-label="Minimum price"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-36 bg-primary text-secondary border border-slate-600 rounded-lg p-3 focus:border-accent focus:outline-none"
                        />

                        {/* Maximum Price */}
                        <input
                            type="number"
                            min="0"
                            placeholder="Max Price"
                            aria-label="Maximum price"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-36 bg-primary text-secondary border border-slate-600 rounded-lg p-3 focus:border-accent focus:outline-none"
                        />

                        {/* Apply Button */}
                        <button
                            type="button"
                            onClick={handleApplyPrice}
                            className="bg-accent text-primary font-semibold px-5 py-3 rounded-lg hover:bg-sky-300 transition"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </section>

            {/* Product List */}
            {isLoading ? (
                <Loading />
            ) : products.length === 0 ? (
                <p className="text-center text-muted text-xl mt-10">
                    No products found.
                </p>
            ) : (
                <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-5 p-2">
                    {products.map((product) => (
                        <ProductCard
                            key={product.productId}
                            product={product}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!isLoading && pagination.totalPages > 0 && (
                <div className="flex justify-center items-center gap-4 mt-8 mb-8">

                    <button
                        onClick={() => setPage((prev) => prev - 1)}
                        disabled={!pagination.hasPreviousPage}
                        className="px-4 py-2 bg-accent text-primary font-semibold rounded-lg disabled:bg-slate-700 disabled:text-muted disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>

                    <span className="font-semibold">
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </span>

                    <button
                        onClick={() => setPage((prev) => prev + 1)}
                        disabled={!pagination.hasNextPage}
                        className="px-4 py-2 bg-accent text-primary font-semibold rounded-lg disabled:bg-slate-700 disabled:text-muted disabled:cursor-not-allowed"
                    >
                        Next
                    </button>

                </div>
            )}
        </div>
    );
}
