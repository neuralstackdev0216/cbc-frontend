
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import HeroBanner from "../../components/HeroBanner";
import Footer from "../../components/Footer";
import ServiceBenefits from "../../components/ServiceBenefits";
import CategoryProductSection from "../../components/CategoryProductSection";
import ConnectWithUs from "../../components/ConnectWithUs";
import { categories } from "../../utils/productMeta";

const homeCategories = [
    "Smartphones",
    "Tablets",
    "Smartwatches",
    "Earbuds"
];

export default function HomeContent() {

    const [search, setSearch] = useState("");

    const navigate = useNavigate();

    function handleSearch(e) {

        e.preventDefault();

        const keyword = search.trim();

        if (!keyword) return;

        navigate(
            `/products?search=${encodeURIComponent(keyword)}`
        );

    }

    return (

        <div className="w-full min-h-full self-start flex flex-col items-center">

            {/* Hero Banner */}
            <HeroBanner />

            {/* Product Search */}
            <form
                onSubmit={handleSearch}
                className="w-full max-w-3xl mx-auto flex gap-2 my-6 px-4"
            >

                <input
                    type="text"
                    placeholder="Search phones, tablets, accessories..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 min-w-0 border border-slate-600 rounded-lg px-4 py-3 bg-[#1c2739] text-white placeholder:text-slate-400 focus:outline-none focus:border-sky-400 transition-colors"
                />

                <button
                    type="submit"
                    className="bg-sky-400 text-slate-950 font-semibold px-5 md:px-6 py-3 rounded-lg hover:bg-sky-300 transition-colors"
                >
                    Search
                </button>

            </form>

            {/* Service Benefits */}
            <ServiceBenefits />

            {/* Category Shortcuts */}
            <section className="w-full max-w-7xl mx-auto px-4 md:px-6 py-10">

                <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
                    Shop by Category
                </h2>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">

                    {categories
                        .filter((category) =>
                            homeCategories.includes(category.name)
                        )
                        .map((category) => (

                            <Link
                                key={category.name}
                                to={
                                    "/products?category=" +
                                    encodeURIComponent(category.name)
                                }
                                className="group bg-[#1c2739] border border-slate-700 rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center gap-4 shadow-lg hover:border-sky-400/60 hover:bg-[#243449] hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300"
                            >

                                <span className="text-4xl md:text-5xl group-hover:scale-110 transition-transform duration-300">
                                    {category.icon}
                                </span>

                                <span className="text-sm md:text-lg font-semibold text-white group-hover:text-sky-400 transition-colors duration-300">
                                    {category.name}
                                </span>

                            </Link>

                        ))}

                </div>

            </section>

            {/* Category-wise Product Sections */}
            <div className="w-full flex flex-col gap-4 pb-10">

                {homeCategories.map((category) => (

                    <CategoryProductSection
                        key={category}
                        category={category}
                    />

                ))}

            </div>

            <ConnectWithUs/>

            {/* Footer */}
            <Footer />

        </div>

    );

}
