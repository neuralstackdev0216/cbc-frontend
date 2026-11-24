
import { useEffect, useRef, useState } from "react";

import {
    Link,
    NavLink,
    useLocation
} from "react-router-dom";

import {
    FiMapPin,
    FiHeadphones,
    FiUser,
    FiShoppingBag,
    FiChevronDown,
    FiPackage,
    FiLogOut,
    FiLogIn,
    FiMenu,
    FiX,
    FiHome,
    FiGrid,
    FiInfo
} from "react-icons/fi";

import { getCartCount } from "../utils/cart";

const links = [
    { name: "Home", path: "/", icon: FiHome },
    { name: "Products", path: "/products", icon: FiGrid },
    { name: "About", path: "/#connect-with-us", icon: FiInfo }
];

export default function Header() {

    const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);
    const [cartCount, setCartCount] = useState(getCartCount);

    const accountRef = useRef(null);
    const location = useLocation();

    const token = localStorage.getItem("token");

    // Update cart count
    useEffect(() => {

        function updateCartCount() {
            setCartCount(getCartCount());
        }

        window.addEventListener("cart-updated", updateCartCount);
        window.addEventListener("storage", updateCartCount);

        return () => {

            window.removeEventListener(
                "cart-updated",
                updateCartCount
            );

            window.removeEventListener(
                "storage",
                updateCartCount
            );

        };

    }, []);

    // Close menus when navigating
    useEffect(() => {

        setAccountOpen(false);
        setSideDrawerOpen(false);
        setCartCount(getCartCount());

    }, [location.pathname, location.search, location.hash]);

    // Close account dropdown when clicking outside
    useEffect(() => {

        function handleOutsideClick(event) {

            if (
                accountRef.current &&
                !accountRef.current.contains(event.target)
            ) {
                setAccountOpen(false);
            }

        }

        function handleEscape(event) {

            if (event.key === "Escape") {

                setAccountOpen(false);
                setSideDrawerOpen(false);

            }

        }

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        document.addEventListener(
            "keydown",
            handleEscape
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );

            document.removeEventListener(
                "keydown",
                handleEscape
            );

        };

    }, []);

    function handleLogout() {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setAccountOpen(false);
        setSideDrawerOpen(false);

        window.location.href = "/";

    }

    function renderNavigationLink(link, mobile = false) {

        const Icon = link.icon;

        const isAbout = link.name === "About";

        const isActive = isAbout
            ? location.pathname === "/" &&
              location.hash === "#connect-with-us"
            : link.path === "/"
                ? location.pathname === "/" && !location.hash
                : location.pathname === link.path;

        return (

            <Link
                key={link.name}
                to={link.path}
                onClick={() => setSideDrawerOpen(false)}
                className={`
                    relative flex items-center gap-3
                    font-medium transition-colors duration-200
                    ${mobile ? "px-4 py-3 rounded-xl" : "py-2"}
                    ${
                        isActive
                            ? "text-sky-400"
                            : "text-slate-200 hover:text-sky-400"
                    }
                    ${
                        mobile && isActive
                            ? "bg-sky-500/10"
                            : ""
                    }
                `}
            >

                {mobile && <Icon className="text-lg" />}

                {link.name}

                {!mobile && isActive && (

                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-400 rounded-full" />

                )}

            </Link>

        );

    }

    function renderCartButton(mobile = false) {

        return (

            <Link
                to="/cart"
                aria-label={`Shopping cart, ${cartCount} items`}
                className={`
                    relative flex items-center gap-3
                    bg-[#0d1428] border border-slate-700
                    rounded-xl hover:border-sky-400
                    transition-all duration-200
                    ${mobile ? "p-3" : "px-4 py-3"}
                `}
            >

                <FiShoppingBag className="text-2xl text-sky-400" />

                {!mobile && (

                    <span className="text-sm font-semibold text-white">
                        Cart
                    </span>

                )}

                <span className={`
                    flex items-center justify-center
                    min-w-5 h-5 px-1
                    bg-sky-400 text-slate-950
                    rounded-full text-xs font-bold
                    ${mobile ? "absolute -top-2 -right-2" : ""}
                `}>

                    {cartCount > 99 ? "99+" : cartCount}

                </span>

            </Link>

        );

    }

    return (

        <header className="w-full bg-[#1c2739] text-white shadow-lg relative z-40">

            {/* Top Information Bar */}
            <div className="w-full bg-[#0b1120] border-b border-slate-800">

                <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 flex justify-end items-center gap-5 md:gap-7">

                    <Link
                        to="/#store-location"
                        className="flex items-center gap-2 text-xs md:text-sm text-slate-300 hover:text-sky-400 transition-colors"
                    >
                        <FiMapPin className="text-sky-400" />
                        Store Location
                    </Link>

                    <Link
                        to="/#customer-support"
                        className="flex items-center gap-2 text-xs md:text-sm text-slate-300 hover:text-sky-400 transition-colors"
                    >
                        <FiHeadphones className="text-sky-400" />
                        Support
                    </Link>

                </div>

            </div>

            {/* Main Header */}
            <div className="max-w-7xl mx-auto h-20 md:h-24 px-4 md:px-6 flex items-center justify-between gap-4">

                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2 shrink-0"
                >

                    <span className="text-sky-400 text-3xl md:text-4xl">
                        ◈
                    </span>

                    <span className="text-xl md:text-2xl font-bold tracking-tight">

                        Nova<span className="text-sky-400">Mobiles</span>

                    </span>

                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-9">

                    {links.map((link) =>
                        renderNavigationLink(link)
                    )}

                </nav>

                {/* Desktop Actions */}
                <div className="hidden lg:flex items-center gap-5">

                    {/* Account Dropdown */}
                    <div
                        ref={accountRef}
                        className="relative"
                    >

                        <button
                            type="button"
                            aria-label="Account menu"
                            aria-expanded={accountOpen}
                            onClick={() => setAccountOpen(!accountOpen)}
                            className="flex items-center gap-2 group"
                        >

                            <span className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-700/60 border border-slate-600 group-hover:border-sky-400 transition-colors">

                                <FiUser className="text-xl group-hover:text-sky-400" />

                            </span>

                            <FiChevronDown
                                className={`
                                    text-slate-400 transition-transform
                                    ${accountOpen ? "rotate-180" : ""}
                                `}
                            />

                        </button>

                        {accountOpen && (

                            <div className="absolute right-0 top-full mt-4 w-60 bg-[#1c2739] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">

                                <div className="px-5 py-4 bg-[#0d1428] border-b border-slate-700">

                                    <h3 className="font-semibold text-white">
                                        My Account
                                    </h3>

                                    <p className="text-xs text-slate-400 mt-1">
                                        {token
                                            ? "Manage your account"
                                            : "Welcome to NovaMobiles"}
                                    </p>

                                </div>

                                <div className="p-2">

                                    {token ? (

                                        <>

                                            <Link
                                                to="/my-orders"
                                                onClick={() => setAccountOpen(false)}
                                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700/60 hover:text-sky-400 transition-colors"
                                            >

                                                <FiPackage className="text-lg" />

                                                My Orders

                                            </Link>

                                            <div className="border-t border-slate-700 my-2" />

                                            <button
                                                type="button"
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                                            >

                                                <FiLogOut className="text-lg" />

                                                Logout

                                            </button>

                                        </>

                                    ) : (

                                        <Link
                                            to="/login"
                                            onClick={() => setAccountOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700/60 hover:text-sky-400"
                                        >

                                            <FiLogIn className="text-lg" />

                                            Sign In

                                        </Link>

                                    )}

                                </div>

                            </div>

                        )}

                    </div>

                    {renderCartButton()}

                </div>

                {/* Mobile Actions */}
                <div className="flex lg:hidden items-center gap-4">

                    {renderCartButton(true)}

                    <button
                        type="button"
                        onClick={() => setSideDrawerOpen(true)}
                        aria-label="Open menu"
                        className="text-2xl hover:text-sky-400"
                    >

                        <FiMenu />

                    </button>

                </div>

            </div>

            {/* Mobile Drawer */}
            {sideDrawerOpen && (

                <div
                    className="fixed inset-0 z-50 bg-black/70 lg:hidden"
                    onClick={() => setSideDrawerOpen(false)}
                >

                    <div
                        className="absolute right-0 top-0 h-full w-[320px] max-w-[90vw] bg-[#1c2739] shadow-2xl overflow-y-auto"
                        onClick={(event) => event.stopPropagation()}
                    >

                        <div className="flex items-center justify-between px-5 py-6 border-b border-slate-700">

                            <span className="text-xl font-bold">

                                Nova<span className="text-sky-400">Mobiles</span>

                            </span>

                            <button
                                type="button"
                                onClick={() => setSideDrawerOpen(false)}
                                aria-label="Close menu"
                                className="text-2xl text-slate-300 hover:text-white"
                            >

                                <FiX />

                            </button>

                        </div>

                        <nav className="p-4 flex flex-col gap-2">

                            <p className="px-4 mb-2 text-xs font-semibold tracking-widest text-slate-400">
                                NAVIGATION
                            </p>

                            {links.map((link) =>
                                renderNavigationLink(link, true)
                            )}

                            <div className="border-t border-slate-700 my-4" />

                            <p className="px-4 mb-2 text-xs font-semibold tracking-widest text-slate-400">
                                MY ACCOUNT
                            </p>

                            {token ? (

                                <>

                                    <Link
                                        to="/my-orders"
                                        onClick={() => setSideDrawerOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-700/60"
                                    >

                                        <FiPackage />

                                        My Orders

                                    </Link>

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10"
                                    >

                                        <FiLogOut />

                                        Logout

                                    </button>

                                </>

                            ) : (

                                <Link
                                    to="/login"
                                    onClick={() => setSideDrawerOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-700/60"
                                >

                                    <FiLogIn />

                                    Sign In

                                </Link>

                            )}

                            <div className="border-t border-slate-700 my-4" />

                            <Link
                                to="/#store-location"
                                onClick={() => setSideDrawerOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-sky-400"
                            >

                                <FiMapPin className="text-sky-400" />

                                Store Location

                            </Link>

                            <Link
                                to="/#customer-support"
                                onClick={() => setSideDrawerOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-sky-400"
                            >

                                <FiHeadphones className="text-sky-400" />

                                Support

                            </Link>

                        </nav>

                    </div>

                </div>

            )}

        </header>

    );

}
