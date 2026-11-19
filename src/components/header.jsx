import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { BsCart3 } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";

export default function Header(){
    const [sideDrawerOpen,setSideDrawerOpen] = useState(false)
    const navigate=useNavigate()
    const token=localStorage.getItem("token")
    const links = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    ];

    if (token) {
        links.push({ name: "My Orders", path: "/my-orders" });
    }

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
    }

    return (
        <header className="w-full bg-surface text-secondary shadow-lg relative z-40">
            <div className="max-w-7xl mx-auto h-20 px-4 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <span className="text-accent text-3xl">◈</span>
                    <span className="text-xl font-bold">
                        Nova<span className="text-accent">Mobiles</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-5">
                    {links.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            end={link.path === "/"}
                            className={({ isActive }) =>
                                isActive
                                    ? "text-accent font-semibold"
                                    : "text-secondary hover:text-accent"
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </nav>

                {/* Desktop Actions */}
                <div className="hidden lg:flex items-center gap-4">
                    {token ? (
                        <button onClick={handleLogout} className="hover:text-accent">
                            Logout
                        </button>
                    ) : (
                        <Link to="/login" className="hover:text-accent">
                            Login
                        </Link>
                    )}

                    <Link to="/cart" className="text-2xl hover:text-accent">
                        <BsCart3 />
                    </Link>
                </div>

                {/* Mobile Actions */}
                <div className="flex lg:hidden items-center gap-5">
                    <Link to="/cart" className="text-2xl">
                        <BsCart3 />
                    </Link>

                    <button
                        onClick={() => setSideDrawerOpen(true)}
                        aria-label="Open menu"
                        className="text-2xl"
                    >
                        <GiHamburgerMenu />
                    </button>
                </div>
            </div>

            {/* Mobile Drawer */}
            {sideDrawerOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 md:hidden">
                    <div className="w-[300px] max-w-[85vw] h-full bg-surface p-6 shadow-xl">

                        <div className="flex justify-between items-center mb-8">
                            <span className="font-bold text-xl text-accent">
                                NovaMobiles
                            </span>

                            <button
                                onClick={() => setSideDrawerOpen(false)}
                                aria-label="Close menu"
                                className="text-2xl"
                            >
                                <IoClose />
                            </button>
                        </div>

                        <nav className="flex flex-col gap-5">
                            {links.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    end={link.path === "/"}
                                    onClick={() => setSideDrawerOpen(false)}
                                    className={({ isActive }) =>
                                        isActive
                                            ? "text-accent font-semibold"
                                            : "hover:text-accent"
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            ))}

                            {token ? (
                                <button
                                    onClick={handleLogout}
                                    className="text-left hover:text-accent"
                                >
                                    Logout
                                </button>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setSideDrawerOpen(false)}
                                    className="hover:text-accent"
                                >
                                    Login
                                </Link>
                            )}
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
}

