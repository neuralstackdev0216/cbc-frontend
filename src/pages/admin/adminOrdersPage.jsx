import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import Loading from "../../components/loading";
import Modal from "react-modal";

export default function AdminOrdersPage() {

    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [activeOrder, setActiveOrder] = useState(null);


    // =========================
    // Fetch Orders
    // =========================

    useEffect(() => {

        if (!isLoading) {
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Please Login First");
            setIsLoading(false);
            return;
        }

        axios
            .get(
                import.meta.env.VITE_BACKEND_URL + "/api/orders",
                {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            )
            .then((response) => {

                setOrders(response.data.orders || []);

                console.log(response.data);

                setIsLoading(false);
            })
            .catch((e) => {

                console.log(e);

                setIsLoading(false);

                toast.error("Fetching orders failed");
            });

    }, [isLoading]);


    // =========================
    // Open Order Modal
    // =========================

    const openOrderModal = (order) => {

        setActiveOrder(order);

        setIsOpen(true);
    };


    // =========================
    // Close Order Modal
    // =========================

    const closeOrderModal = () => {

        setIsOpen(false);

        setActiveOrder(null);
    };


    // =========================
    // Format Currency
    // =========================

    const formatCurrency = (amount) => {

        if (amount === undefined || amount === null) {
            return "Rs. 0";
        }

        return `Rs. ${Number(amount).toLocaleString("en-LK")}`;
    };


    // =========================
    // Format Date
    // =========================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString("en-LK", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };


    // =========================
    // Format Time
    // =========================

    const formatTime = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleTimeString("en-LK", {
            hour: "2-digit",
            minute: "2-digit"
        });
    };


    // =========================
    // Status Styling
    // =========================

    const getStatusStyle = (status) => {

        const normalizedStatus = status?.toLowerCase();

        if (normalizedStatus === "completed") {

            return "bg-green-100 text-green-700 border-green-200";

        }

        if (normalizedStatus === "cancelled") {

            return "bg-red-100 text-red-700 border-red-200";

        }

        if (normalizedStatus === "processing") {

            return "bg-blue-100 text-blue-700 border-blue-200";

        }

        return "bg-yellow-100 text-yellow-700 border-yellow-200";
    };


    // =========================
    // Loading
    // =========================

    if (isLoading) {

        return (
            <div className="w-full h-full flex items-center justify-center bg-primary">
                <Loading />
            </div>
        );
    }


    return (

        <div className="w-full h-full overflow-y-auto p-6 bg-primary">

            {/* ========================================= */}
            {/* PAGE HEADER */}
            {/* ========================================= */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">

                <div>

                    <h1 className="text-3xl font-bold text-secondary">
                        Orders
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage and view all customer orders
                    </p>

                </div>


                {/* Total Orders */}

                <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 shadow-sm">

                    <p className="text-sm text-gray-500">
                        Total Orders
                    </p>

                    <p className="text-2xl font-bold text-accent">
                        {orders.length}
                    </p>

                </div>

            </div>


            {/* ========================================= */}
            {/* NO ORDERS */}
            {/* ========================================= */}

            {orders.length === 0 ? (

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center">

                    <div className="text-5xl mb-4">
                        📦
                    </div>

                    <h2 className="text-xl font-semibold text-secondary">
                        No Orders Found
                    </h2>

                    <p className="text-gray-500 mt-2">
                        There are currently no orders in the system.
                    </p>

                </div>

            ) : (

                /* ========================================= */
                /* ORDERS TABLE */
                /* ========================================= */

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                    {/* Table Header */}

                    <div className="px-6 py-4 border-b border-gray-200">

                        <h2 className="text-lg font-semibold text-secondary">
                            Customer Orders
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Click an order to view complete order information.
                        </p>

                    </div>


                    {/* ========================================= */}
                    {/* ORDER DETAILS MODAL */}
                    {/* ========================================= */}

                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={closeOrderModal}
                        contentLabel="Order Details"
                        ariaHideApp={false}
                        className="outline-none w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
                        overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    >

                        {activeOrder && (

                            <div>

                                {/* ================================= */}
                                {/* MODAL HEADER */}
                                {/* ================================= */}

                                <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-200">

                                    <div>

                                        <div className="flex items-center gap-3">

                                            <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-accent text-xl">
                                                📦
                                            </div>

                                            <div>

                                                <h2 className="text-xl font-bold text-secondary">
                                                    Order Details
                                                </h2>

                                                <p className="text-sm text-gray-500 mt-0.5">
                                                    {activeOrder.orderId || "Unknown Order"}
                                                </p>

                                            </div>

                                        </div>

                                    </div>


                                    {/* Close Button */}

                                    <button
                                        onClick={closeOrderModal}
                                        className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition flex items-center justify-center text-xl"
                                    >
                                        ×
                                    </button>

                                </div>


                                {/* ================================= */}
                                {/* MODAL CONTENT */}
                                {/* ================================= */}

                                <div className="p-6 space-y-6">


                                    {/* ================================= */}
                                    {/* ORDER SUMMARY */}
                                    {/* ================================= */}

                                    <div>

                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                            Order Summary
                                        </h3>


                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                                            {/* Order ID */}

                                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">

                                                <p className="text-xs text-gray-500 mb-1">
                                                    Order ID
                                                </p>

                                                <p className="font-bold text-accent break-all">
                                                    {activeOrder.orderId || "-"}
                                                </p>

                                            </div>


                                            {/* Status */}

                                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">

                                                <p className="text-xs text-gray-500 mb-2">
                                                    Status
                                                </p>

                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold ${getStatusStyle(
                                                        activeOrder.status
                                                    )}`}
                                                >
                                                    {activeOrder.status || "Pending"}
                                                </span>

                                            </div>


                                            {/* Total */}

                                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">

                                                <p className="text-xs text-gray-500 mb-1">
                                                    Order Total
                                                </p>

                                                <p className="font-bold text-lg text-secondary">
                                                    {formatCurrency(activeOrder.total)}
                                                </p>

                                            </div>


                                            {/* Labeled Total */}

                                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">

                                                <p className="text-xs text-gray-500 mb-1">
                                                    Labeled Total
                                                </p>

                                                <p className="font-bold text-lg text-secondary">
                                                    {formatCurrency(activeOrder.labeledTotal)}
                                                </p>

                                            </div>

                                        </div>

                                    </div>


                                    {/* ================================= */}
                                    {/* CUSTOMER INFORMATION */}
                                    {/* ================================= */}

                                    <div>

                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                            Customer Information
                                        </h3>


                                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

                                            {/* Customer Name */}

                                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">

                                                <div className="w-14 h-14 rounded-full bg-primary border border-gray-200 flex items-center justify-center text-accent text-xl font-bold">

                                                    {activeOrder.name
                                                        ?.charAt(0)
                                                        ?.toUpperCase() || "U"}

                                                </div>


                                                <div>

                                                    <p className="text-lg font-semibold text-secondary">
                                                        {activeOrder.name || "Unknown Customer"}
                                                    </p>

                                                    <p className="text-sm text-gray-500">
                                                        Customer
                                                    </p>

                                                </div>

                                            </div>


                                            <div className="border-t border-gray-100 grid grid-cols-1 md:grid-cols-2">

                                                {/* Email */}

                                                <div className="p-5 border-b md:border-b-0 md:border-r border-gray-100">

                                                    <p className="text-xs text-gray-500 mb-1">
                                                        Email
                                                    </p>

                                                    <p className="text-sm font-medium text-secondary break-all">
                                                        {activeOrder.email || "-"}
                                                    </p>

                                                </div>


                                                {/* Phone */}

                                                <div className="p-5">

                                                    <p className="text-xs text-gray-500 mb-1">
                                                        Phone
                                                    </p>

                                                    <p className="text-sm font-medium text-secondary">
                                                        {activeOrder.phone || "-"}
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    </div>


                                    {/* ================================= */}
                                    {/* DELIVERY INFORMATION */}
                                    {/* ================================= */}

                                    <div>

                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                            Delivery Information
                                        </h3>


                                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">

                                            <div className="flex gap-4">

                                                <div className="w-10 h-10 shrink-0 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-lg">
                                                    📍
                                                </div>


                                                <div>

                                                    <p className="text-xs text-gray-500 mb-1">
                                                        Delivery Address
                                                    </p>

                                                    <p className="text-sm font-medium text-secondary leading-relaxed">
                                                        {activeOrder.address || "No address provided"}
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    </div>


                                    {/* ================================= */}
                                    {/* DATE & TIME */}
                                    {/* ================================= */}

                                    <div>

                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                            Order Date & Time
                                        </h3>


                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">

                                                <p className="text-xs text-gray-500 mb-1">
                                                    Date
                                                </p>

                                                <p className="font-medium text-secondary">
                                                    {formatDate(activeOrder.date)}
                                                </p>

                                            </div>


                                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">

                                                <p className="text-xs text-gray-500 mb-1">
                                                    Time
                                                </p>

                                                <p className="font-medium text-secondary">
                                                    {formatTime(activeOrder.date)}
                                                </p>

                                            </div>

                                        </div>

                                    </div>


                                    {/* ================================= */}
                                    {/* PRODUCTS */}
                                    {/* ================================= */}

                                    <div>

                                        <div className="flex items-center justify-between mb-3">

                                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                                Ordered Products
                                            </h3>

                                            <span className="text-xs font-medium text-gray-500">
                                                {activeOrder.products?.length || 0} item(s)
                                            </span>

                                        </div>


                                        {activeOrder.products &&
                                        activeOrder.products.length > 0 ? (

                                            <div className="border border-gray-200 rounded-xl overflow-hidden">

                                                {activeOrder.products.map((product, index) => (

                                                    <div
                                                        key={product._id || index}
                                                        className={`p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                                                            index !== activeOrder.products.length - 1
                                                                ? "border-b border-gray-100"
                                                                : ""
                                                        }`}
                                                    >

                                                        <div className="flex items-center gap-4">

                                                            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-accent font-bold">

                                                                {index + 1}

                                                            </div>


                                                            <div>

                                                                <p className="font-semibold text-secondary">
                                                                    {product.name ||
                                                                        product.productName ||
                                                                        "Product"}
                                                                </p>

                                                                {product.quantity && (

                                                                    <p className="text-sm text-gray-500">
                                                                        Quantity: {product.quantity}
                                                                    </p>

                                                                )}

                                                            </div>

                                                        </div>


                                                        <div className="text-left sm:text-right">

                                                            {product.price !== undefined && (

                                                                <p className="font-semibold text-secondary">
                                                                    {formatCurrency(product.price)}
                                                                </p>

                                                            )}

                                                        </div>

                                                    </div>

                                                ))}

                                            </div>

                                        ) : (

                                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">

                                                <div className="text-3xl mb-2">
                                                    🛒
                                                </div>

                                                <p className="font-medium text-secondary">
                                                    No product information available
                                                </p>

                                                <p className="text-sm text-gray-500 mt-1">
                                                    This order currently contains an empty products array.
                                                </p>

                                            </div>

                                        )}

                                    </div>


                                    {/* ================================= */}
                                    {/* PAYMENT / TOTAL SECTION */}
                                    {/* ================================= */}

                                    <div>

                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                            Payment Summary
                                        </h3>


                                        <div className="bg-secondary rounded-xl p-5">

                                            <div className="flex items-center justify-between gap-4">

                                                <div>

                                                    <p className="text-sm text-gray-300">
                                                        Total Order Amount
                                                    </p>

                                                    <p className="text-2xl font-bold text-white mt-1">
                                                        {formatCurrency(activeOrder.total)}
                                                    </p>

                                                </div>


                                                <div className="text-right">

                                                    <p className="text-xs text-gray-400">
                                                        Labeled Total
                                                    </p>

                                                    <p className="font-semibold text-white mt-1">
                                                        {formatCurrency(activeOrder.labeledTotal)}
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    </div>


                                    {/* ================================= */}
                                    {/* DATABASE INFORMATION */}
                                    {/* ================================= */}

                                    <div>

                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                            System Information
                                        </h3>


                                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">

                                            <div>

                                                <p className="text-xs text-gray-500 mb-1">
                                                    Database ID
                                                </p>

                                                <p className="text-xs font-mono text-secondary break-all">
                                                    {activeOrder._id || "-"}
                                                </p>

                                            </div>


                                            <div>

                                                <p className="text-xs text-gray-500 mb-1">
                                                    Version
                                                </p>

                                                <p className="text-sm text-secondary">
                                                    {activeOrder.__v ?? "-"}
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                </div>


                                {/* ================================= */}
                                {/* MODAL FOOTER */}
                                {/* ================================= */}

                                <div className="px-6 py-4 border-t border-gray-200 flex justify-end">

                                    <button
                                        onClick={closeOrderModal}
                                        className="px-5 py-2.5 rounded-lg bg-secondary text-white font-medium hover:opacity-90 transition"
                                    >
                                        Close
                                    </button>

                                </div>

                            </div>

                        )}

                    </Modal>


                    {/* ========================================= */}
                    {/* TABLE */}
                    {/* ========================================= */}

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[1100px]">

                            <thead className="bg-gray-50 border-b border-gray-200">

                                <tr>

                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Order ID
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Address
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Phone
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="divide-y divide-gray-100">

                                {orders.map((order) => (

                                    <tr
                                        key={order._id}
                                        onClick={() => openOrderModal(order)}
                                        className="hover:bg-gray-50 transition duration-150 cursor-pointer"
                                    >

                                        {/* Order ID */}

                                        <td className="px-6 py-4 whitespace-nowrap">

                                            <span className="font-semibold text-accent">
                                                {order.orderId}
                                            </span>

                                        </td>


                                        {/* Customer */}

                                        <td className="px-6 py-4 whitespace-nowrap">

                                            <div className="flex items-center gap-3">

                                                <div className="w-9 h-9 rounded-full bg-primary border border-gray-200 flex items-center justify-center text-accent font-semibold">

                                                    {order.name
                                                        ?.charAt(0)
                                                        ?.toUpperCase() || "U"}

                                                </div>

                                                <span className="font-medium text-secondary">
                                                    {order.name || "-"}
                                                </span>

                                            </div>

                                        </td>


                                        {/* Email */}

                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {order.email || "-"}
                                        </td>


                                        {/* Address */}

                                        <td className="px-6 py-4 text-sm text-gray-600 max-w-[220px]">

                                            <div
                                                className="truncate"
                                                title={order.address}
                                            >
                                                {order.address || "-"}
                                            </div>

                                        </td>


                                        {/* Phone */}

                                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                            {order.phone || "-"}
                                        </td>


                                        {/* Total */}

                                        <td className="px-6 py-4 whitespace-nowrap">

                                            <span className="font-semibold text-secondary">
                                                {formatCurrency(order.total)}
                                            </span>

                                        </td>


                                        {/* Date */}

                                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">

                                            {formatDate(order.date)}

                                        </td>


                                        {/* Status */}

                                        <td className="px-6 py-4 whitespace-nowrap">

                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold ${getStatusStyle(
                                                    order.status
                                                )}`}
                                            >
                                                {order.status || "Pending"}
                                            </span>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            )}

        </div>
    );
}

