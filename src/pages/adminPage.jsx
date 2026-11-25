
import {
    NavLink,
    Navigate,
    Route,
    Routes,
    useNavigate
} from "react-router-dom";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {
    FiPackage,
    FiShoppingBag,
    FiUsers,
    FiLogOut,
    FiUser
} from "react-icons/fi";

import AddProductPage from "./admin/addProductPage";
import AdminProductsPage from "./admin/productsPage";
import EditProductPage from "./admin/editProductPage";
import AdminOrdersPage from "./admin/adminOrdersPage";
import AdminUserPage from "./admin/adminUserPage";
import AdminProfilePage from "./admin/adminProfilePage";
import Loading from "../components/loading";

export default function AdminPage() {

    const navigate = useNavigate();

    const [status, setStatus] = useState("loading");
    const [admin, setAdmin] = useState(null);
    const [imageFailed, setImageFailed] = useState(false);

    // Verify admin authentication
    useEffect(() => {

        const controller = new AbortController();

        async function verifyAdmin() {

            const token = localStorage.getItem("token");

            if (!token) {

                setStatus("unauthorized");

                navigate("/login", { replace: true });

                return;
            }

            try {

                const response = await axios.get(
                    import.meta.env.VITE_BACKEND_URL +
                    "/api/users/",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        signal: controller.signal
                    }
                );

                if (controller.signal.aborted) return;

                if (response.data.role !== "admin") {

                    setStatus("unauthorized");

                    toast.error(
                        "You are not authorized to access the admin panel"
                    );

                    navigate("/", { replace: true });

                    return;
                }

                setAdmin(response.data);
                setStatus("authorized");

            } catch (error) {

                if (
                    axios.isCancel(error) ||
                    controller.signal.aborted
                ) return;

                if (
                    error.response?.status === 401 ||
                    error.response?.status === 403
                ) {

                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    setStatus("unauthorized");

                    toast.error(
                        "Session invalid or account unavailable. Please sign in again."
                    );

                    navigate("/login", { replace: true });

                } else {

                    setStatus("error");

                    toast.error(
                        "Unable to verify your session"
                    );

                }
            }
        }

        verifyAdmin();

        return () => controller.abort();

    }, [navigate]);

    // Logout and clear local session
    function handleLogout() {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setAdmin(null);
        setStatus("unauthorized");

        toast.success("Logged out successfully");

        navigate("/login", { replace: true });

    }

    // Handle expired session or successful password change
    function handleSessionExpired(
        message = "Session expired or unavailable. Please sign in again.",
        success = false
    ) {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setAdmin(null);
        setStatus("unauthorized");

        if (success) {
            toast.success(message);
        } else {
            toast.error(message);
        }

        navigate("/login", { replace: true });

    }

    // Synchronize profile information
    function handleProfileUpdated(updatedUser) {

        setAdmin(updatedUser);
        setImageFailed(false);

    }

    // Sidebar navigation
    const navigationItems = [
        {
            name: "Products",
            path: "/admin/products",
            icon: FiPackage
        },
        {
            name: "Orders",
            path: "/admin/orders",
            icon: FiShoppingBag
        },
        {
            name: "Users",
            path: "/admin/users",
            icon: FiUsers
        },
        {
            name: "My Profile",
            path: "/admin/profile",
            icon: FiUser
        }
    ];

    // Loading state
    if (status === "loading") {

        return (
            <div className="w-full h-screen flex items-center justify-center bg-primary">
                <Loading />
            </div>
        );

    }

    // Server or network error
    if (status === "error") {

        return (
            <div className="w-full min-h-screen flex flex-col items-center justify-center bg-primary text-white gap-4">

                <h1 className="text-xl font-semibold">
                    Unable to verify your session
                </h1>

                <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="bg-sky-400 text-slate-950 px-6 py-3 rounded-lg font-semibold"
                >
                    Try Again
                </button>

                <button
                    type="button"
                    onClick={handleLogout}
                    className="text-slate-400 hover:text-white"
                >
                    Back to Login
                </button>

            </div>
        );

    }

    if (status !== "authorized") {
        return null;
    }

    const adminName =
        `${admin?.firstName || ""} ${admin?.lastName || ""}`.trim()
        || "Administrator";

    return (

        <div className="w-full h-screen flex bg-accent overflow-hidden">

            {/* Sidebar */}
            <aside className="h-full w-[72px] md:w-[280px] shrink-0 flex flex-col bg-white border-r border-slate-200">

                {/* Branding */}
                <div className="px-3 md:px-6 py-7 border-b border-slate-200">

                    <div className="flex items-center justify-center md:justify-start gap-2">

                        <span className="text-sky-500 text-3xl">
                            ◈
                        </span>

                        <h1 className="hidden md:block text-2xl font-bold text-slate-900 tracking-tight">

                            Nova<span className="text-sky-500">Mobiles</span>

                        </h1>

                    </div>

                    <p className="hidden md:block text-xs font-semibold tracking-widest text-slate-400 mt-3">
                        ADMIN PANEL
                    </p>

                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-2 p-2 md:p-4 flex-1 overflow-y-auto">

                    {navigationItems.map((item) => {

                        const Icon = item.icon;

                        return (

                            <NavLink
                                key={item.name}
                                to={item.path}
                                title={item.name}
                                aria-label={item.name}
                                className={({ isActive }) =>
                                    `flex items-center justify-center md:justify-start gap-3 px-3 md:px-4 py-4 rounded-xl font-semibold transition-colors ${
                                        isActive
                                            ? "bg-accent text-white shadow-md"
                                            : "text-accent hover:bg-slate-100"
                                    }`
                                }
                            >

                                <Icon className="text-xl shrink-0" />

                                <span className="hidden md:block">
                                    {item.name}
                                </span>

                            </NavLink>

                        );

                    })}

                </nav>

                {/* Admin account */}
                <div className="border-t border-slate-200 p-2 md:p-4">

                    <NavLink
                        to="/admin/profile"
                        title="My Profile"
                        aria-label="Open my profile"
                        className="flex items-center justify-center md:justify-start gap-3 mb-4 p-2 rounded-xl hover:bg-slate-100 transition"
                    >

                        <div className="w-11 h-11 shrink-0 rounded-full bg-sky-100 flex items-center justify-center overflow-hidden">

                            {admin?.img && !imageFailed ? (

                                <img
                                    src={admin.img}
                                    alt="Admin avatar"
                                    referrerPolicy="no-referrer"
                                    onError={() =>
                                        setImageFailed(true)
                                    }
                                    className="w-full h-full object-cover"
                                />

                            ) : (

                                <FiUser className="text-xl text-sky-600" />

                            )}

                        </div>

                        <div className="hidden md:block min-w-0">

                            <p className="text-sm font-bold text-slate-900 truncate">
                                {adminName}
                            </p>

                            <p className="text-xs text-slate-500 truncate">
                                {admin?.email || "Admin account"}
                            </p>

                        </div>

                    </NavLink>

                    {/* Logout */}
                    <button
                        type="button"
                        onClick={handleLogout}
                        title="Logout"
                        aria-label="Logout"
                        className="w-full flex items-center justify-center md:justify-start gap-3 px-3 md:px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors"
                    >

                        <FiLogOut className="text-xl shrink-0" />

                        <span className="hidden md:block">
                            Logout
                        </span>

                    </button>

                </div>

            </aside>

            {/* Admin content */}
            <main className="flex-1 min-w-0 h-full overflow-y-auto border-accent border-4 rounded-2xl bg-white">

                <Routes>

                    <Route
                        index
                        element={
                            <Navigate to="products" replace />
                        }
                    />

                    <Route
                        path="products"
                        element={<AdminProductsPage />}
                    />

                    <Route
                        path="orders"
                        element={<AdminOrdersPage />}
                    />

                    <Route
                        path="users"
                        element={<AdminUserPage />}
                    />

                    <Route
                        path="profile"
                        element={
                            <AdminProfilePage
                                admin={admin}
                                onProfileUpdated={handleProfileUpdated}
                                onSessionExpired={handleSessionExpired}
                            />
                        }
                    />

                    <Route
                        path="add-product"
                        element={<AddProductPage />}
                    />

                    <Route
                        path="edit-product"
                        element={<EditProductPage />}
                    />

                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/admin/products"
                                replace
                            />
                        }
                    />

                </Routes>

            </main>

        </div>

    );

}
