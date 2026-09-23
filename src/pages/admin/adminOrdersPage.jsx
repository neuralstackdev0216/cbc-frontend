import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import Loading from "../../components/loading";
import Modal from "react-modal";

Modal.setAppElement("#root");

export default function AdminOrdersPage() {

    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [activeOrder, setActiveOrder] = useState(null);

    useEffect(() => {

        if (!isLoading) return;

        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Please Login First");
            setIsLoading(false);
            return;
        }

        axios.get(import.meta.env.VITE_BACKEND_URL + "/api/orders", {
            headers: {
                Authorization: "Bearer " + token
            }
        })
            .then((response) => {
                setOrders(response.data.orders || []);
                setIsLoading(false);
            })
            .catch((e) => {
                console.log(e);
                setIsLoading(false);
                toast.error("Fetching orders failed");
            });

    }, [isLoading]);

    const openOrder = (order) => {
        setActiveOrder(order);
        setIsOpen(true);
    };

    const closeOrder = () => {
        setActiveOrder(null);
        setIsOpen(false);
    };

    if (isLoading) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <Loading />
            </div>
        );
    }

    return (
        <div className="w-full h-full overflow-y-auto p-6 bg-primary">

            <h1 className="text-2xl font-bold text-secondary mb-2">
                Orders
            </h1>

            <p className="text-gray-500 mb-6">
                Manage customer orders
            </p>

            {orders.length === 0 ? (

                <div className="bg-white p-8 text-center rounded-lg">
                    <p className="text-gray-500">
                        No orders found.
                    </p>
                </div>

            ) : (

                <div className="bg-white rounded-lg overflow-x-auto">

                    <table className="w-full min-w-[900px]">

                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left">Order ID</th>
                                <th className="p-3 text-left">Customer</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Phone</th>
                                <th className="p-3 text-left">Total</th>
                                <th className="p-3 text-left">Date</th>
                                <th className="p-3 text-left">Status</th>
                            </tr>
                        </thead>

                        <tbody>

                            {orders.map((order) => (

                                <tr
                                    key={order._id}
                                    onClick={() => openOrder(order)}
                                    className="border-t hover:bg-gray-50 cursor-pointer"
                                >

                                    <td className="p-3 text-accent font-medium">
                                        {order.orderId}
                                    </td>

                                    <td className="p-3">
                                        {order.name || "-"}
                                    </td>

                                    <td className="p-3">
                                        {order.email || "-"}
                                    </td>

                                    <td className="p-3">
                                        {order.phone || "-"}
                                    </td>

                                    <td className="p-3">
                                        Rs. {Number(order.total || 0).toLocaleString()}
                                    </td>

                                    <td className="p-3">
                                        {order.date
                                            ? new Date(order.date).toLocaleDateString()
                                            : "-"
                                        }
                                    </td>

                                    <td className="p-3">
                                        <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-sm">
                                            {order.status || "Pending"}
                                        </span>
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeOrder}
                contentLabel="Order Details"
                className="bg-white p-6 rounded-lg w-[90%] max-w-xl outline-none"
                overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center"
            >

                {activeOrder && (

                    <div>

                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-xl font-bold text-secondary">
                                Order Details
                            </h2>

                            <button
                                onClick={closeOrder}
                                className="text-xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-2">

                            <p>
                                <b>Order ID:</b> {activeOrder.orderId || "-"}
                            </p>

                            <p>
                                <b>Customer:</b> {activeOrder.name || "-"}
                            </p>

                            <p>
                                <b>Email:</b> {activeOrder.email || "-"}
                            </p>

                            <p>
                                <b>Phone:</b> {activeOrder.phone || "-"}
                            </p>

                            <p>
                                <b>Address:</b> {activeOrder.address || "-"}
                            </p>

                            
                            <p>
                                <b>Status:</b>{" "}
                                <span>
                                    <select
                                        value={activeOrder.status || "Pending"}
                                        onChange={async (e) => {
                                            const newStatus = e.target.value;

                                            try {
                                                const token = localStorage.getItem("token");

                                                await axios.put(
                                                    import.meta.env.VITE_BACKEND_URL +
                                                    "/api/orders/" +
                                                    activeOrder.orderId +
                                                    "/" +
                                                    newStatus,
                                                    {},
                                                    {
                                                        headers: {
                                                            Authorization: "Bearer " + token
                                                        }
                                                    }
                                                );

                                                const updatedOrder = { ...activeOrder };
                                                updatedOrder.status = newStatus;

                                                setActiveOrder(updatedOrder);

                                                setOrders(
                                                    orders.map((order) =>
                                                        order._id === activeOrder._id
                                                            ? updatedOrder
                                                            : order
                                                    )
                                                );

                                                toast.success("Status updated successfully");

                                            } catch (e) {
                                                toast.error("Failed to update status");
                                                console.log(e);
                                            }
                                        }}
                                        className="border rounded px-2 py-1 ml-2"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </span>
                            </p>



                            <p>
                                <b>Date:</b>{" "}
                                {activeOrder.date
                                    ? new Date(activeOrder.date).toLocaleString()
                                    : "-"
                                }
                            </p>

                            <p>
                                <b>Labeled Total:</b>{" "}
                                Rs. {Number(activeOrder.labeledTotal || 0).toLocaleString()}
                            </p>

                            <p>
                                <b>Total:</b>{" "}
                                Rs. {Number(activeOrder.total || 0).toLocaleString()}
                            </p>

                        </div>

                        <div className="mt-5">

                            <h3 className="font-semibold text-secondary mb-2">
                                Products
                            </h3>

                            {activeOrder.products?.length > 0 ? (

                                <div className="border rounded">

                                    {activeOrder.products.map((product, index) => (

                                        <div
                                            key={product._id || index}
                                            className="p-3 border-b"
                                        >

                                            <p>
                                                <b>Name:</b>{" "}
                                                {product.name ||
                                                    product.productName ||
                                                    "Product"}
                                            </p>

                                            <p>
                                                <b>Quantity:</b>{" "}
                                                {product.quantity || 1}
                                            </p>

                                            {product.price !== undefined && (
                                                <p>
                                                    <b>Price:</b>{" "}
                                                    Rs. {Number(product.price).toLocaleString()}
                                                </p>
                                            )}

                                        </div>

                                    ))}

                                </div>

                            ) : (

                                <p className="text-gray-500">
                                    No product information available.
                                </p>

                            )}

                        </div>

                        <div className="mt-5 flex justify-end">

                            <button
                                onClick={closeOrder}
                                className="px-4 py-2 bg-secondary text-white rounded"
                            >
                                Close
                            </button>

                        </div>

                    </div>

                )}

            </Modal>

        </div>
    );
}

