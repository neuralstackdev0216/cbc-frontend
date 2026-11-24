
import { Link } from "react-router-dom";

import {
    FiShield,
    FiHeadphones,
    FiMapPin,
    FiMail,
    FiPackage,
    FiArrowUpRight,
    FiArrowUp,
    FiFacebook,
    FiInstagram,
    FiYoutube
} from "react-icons/fi";

import { BiWallet, BiDiamond } from "react-icons/bi";
import { FaTiktok } from "react-icons/fa";

import { categories } from "../utils/productMeta";

const quickLinks = [
    { name: "Home", path: "/" },
    { name: "All Products", path: "/products" },
    { name: "About Us", path: "/#connect-with-us" },
    { name: "Contact Us", path: "/#customer-support" },
    { name: "My Orders", path: "/my-orders" }
];

const socialLinks = [
    {
        name: "Facebook",
        icon: FiFacebook,
        url: import.meta.env.VITE_FACEBOOK_URL,
        color: "hover:bg-blue-600"
    },
    {
        name: "Instagram",
        icon: FiInstagram,
        url: import.meta.env.VITE_INSTAGRAM_URL,
        color: "hover:bg-pink-600"
    },
    {
        name: "TikTok",
        icon: FaTiktok,
        url: import.meta.env.VITE_TIKTOK_URL,
        color: "hover:bg-slate-600"
    },
    {
        name: "YouTube",
        icon: FiYoutube,
        url: import.meta.env.VITE_YOUTUBE_URL,
        color: "hover:bg-red-600"
    }
];

export default function Footer() {

    function scrollToTop() {

        window.scrollTo({
            top: 0,
            behavior: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches ? "auto" : "smooth"
        });

    }

    return (

        <footer className="w-full mt-6 bg-[#0b1120] text-slate-300 border-t border-slate-800">

            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 lg:grid-cols-4 gap-10">

                {/* Brand */}
                <div className="col-span-2 lg:col-span-1">

                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 mb-5"
                    >

                        <BiDiamond className="text-sky-400 text-3xl" />

                        <span className="text-2xl font-bold text-white">
                            Nova
                            <span className="text-sky-400">
                                Mobiles
                            </span>
                        </span>

                    </Link>

                    <p className="text-slate-400 text-sm leading-7">
                        Your destination for smartphones,
                        tablets, smartwatches and premium
                        tech accessories.
                    </p>

                    <p className="text-sky-400 text-sm font-medium mt-5">
                        Technology. Quality. Trust.
                    </p>

                    <Link
                        to="/#store-location"
                        className="flex items-center gap-2 mt-5 text-slate-400 text-sm hover:text-sky-400"
                    >

                        <FiMapPin className="text-sky-400" />

                        Sri Lanka

                    </Link>

                    {/* Social Media */}
                    <div className="mt-7">

                        <h4 className="text-white text-sm font-semibold mb-4">
                            Follow Us
                        </h4>

                        <div className="flex items-center gap-3">

                            {socialLinks.map((social) => {

                                const Icon = social.icon;

                                return social.url ? (

                                    <a
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.name}
                                        className={`w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:-translate-y-1 transition-all duration-300 ${social.color}`}
                                    >

                                        <Icon className="text-lg" />

                                    </a>

                                ) : (

                                    <span
                                        key={social.name}
                                        title={`${social.name} - Coming soon`}
                                        aria-label={`${social.name} coming soon`}
                                        className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 cursor-default"
                                    >

                                        <Icon className="text-lg" />

                                    </span>

                                );

                            })}

                        </div>

                    </div>

                </div>

                {/* Quick Links */}
                <div>

                    <h3 className="text-white text-lg font-semibold mb-5">
                        Quick Links
                    </h3>

                    <ul className="space-y-3">

                        {quickLinks.map((link) => (

                            <li key={link.name}>

                                <Link
                                    to={link.path}
                                    className="group inline-flex items-center gap-2 text-sm text-slate-400 hover:text-sky-400 transition-colors"
                                >

                                    {link.name}

                                    <FiArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity" />

                                </Link>

                            </li>

                        ))}

                    </ul>

                </div>

                {/* Product Categories */}
                <div>

                    <h3 className="text-white text-lg font-semibold mb-5">
                        Shop by Category
                    </h3>

                    <ul className="space-y-3">

                        {categories.map((category) => (

                            <li key={category.name}>

                                <Link
                                    to={
                                        "/products?category=" +
                                        encodeURIComponent(category.name)
                                    }
                                    className="text-sm text-slate-400 hover:text-sky-400 transition-colors"
                                >

                                    {category.name}

                                </Link>

                            </li>

                        ))}

                    </ul>

                </div>

                {/* Customer Care */}
                <div className="col-span-2 lg:col-span-1">

                    <h3 className="text-white text-lg font-semibold mb-5">
                        Customer Care
                    </h3>

                    <div className="space-y-4">

                        <Link
                            to="/#customer-support"
                            className="flex items-center gap-3 text-sm text-slate-400 hover:text-sky-400 transition-colors"
                        >

                            <FiMail className="text-sky-400 text-lg" />

                            Contact our team

                        </Link>

                        <Link
                            to="/my-orders"
                            className="flex items-center gap-3 text-sm text-slate-400 hover:text-sky-400 transition-colors"
                        >

                            <FiPackage className="text-sky-400 text-lg" />

                            Track your orders

                        </Link>

                        <Link
                            to="/#customer-support"
                            className="flex items-center gap-3 text-sm text-slate-400 hover:text-sky-400 transition-colors"
                        >

                            <FiHeadphones className="text-sky-400 text-lg" />

                            Help & Support

                        </Link>

                        <Link
                            to="/#store-location"
                            className="flex items-center gap-3 text-sm text-slate-400 hover:text-sky-400 transition-colors"
                        >

                            <FiMapPin className="text-sky-400 text-lg" />

                            Find our store

                        </Link>

                    </div>

                    {/* Payment Method */}
                    <div className="mt-7">

                        <h4 className="text-white text-sm font-semibold mb-3">
                            Payment Method
                        </h4>

                        <div className="inline-flex items-center gap-3 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg">

                            <BiWallet className="text-sky-400 text-2xl" />

                            <span className="text-sm text-slate-300">
                                Cash on Delivery
                            </span>

                        </div>

                    </div>

                </div>

            </div>

            {/* Bottom Footer */}
            <div className="border-t border-slate-800">

                <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">

                    <p className="text-slate-500 text-xs md:text-sm text-center">
                        © {new Date().getFullYear()} NovaMobiles.
                        All rights reserved.
                    </p>

                    <div className="flex items-center gap-2 text-slate-400 text-sm">

                        <FiShield className="text-sky-400" />

                        Shop with confidence

                    </div>

                    <button
                        type="button"
                        onClick={scrollToTop}
                        className="flex items-center gap-2 text-sm text-slate-400 hover:text-sky-400 transition-colors"
                    >

                        Back to top

                        <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">

                            <FiArrowUp />

                        </span>

                    </button>

                </div>

            </div>

        </footer>

    );

}
