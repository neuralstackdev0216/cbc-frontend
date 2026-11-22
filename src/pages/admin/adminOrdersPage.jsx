
import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import Loading from "../../components/loading";
import Modal from "react-modal";

Modal.setAppElement("#root");

// Order status badge colors
const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-800",
  Processing: "bg-blue-100 text-blue-800",
  Shipped: "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

const orderStatuses = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function AdminOrdersPage() {
  // State management
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  // Modal state
  const [modalIsOpen, setIsOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  // Status update state
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Prevent repeated requests before React re-renders
  const updatingRef = useRef(false);

  // Fetch all orders
  useEffect(() => {
    const controller = new AbortController();

    async function fetchOrders() {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view orders.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const response = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/api/orders",
          {
            headers: {
              Authorization: "Bearer " + token,
            },
            signal: controller.signal,
          }
        );

        if (!controller.signal.aborted) {
          setOrders(
            Array.isArray(response.data.orders)
              ? response.data.orders
              : []
          );
        }
      } catch (err) {
        if (axios.isCancel(err) || controller.signal.aborted) {
          return;
        }

        console.error("Fetching orders failed:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load orders. Please try again."
        );

        toast.error("Fetching orders failed");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchOrders();

    return () => controller.abort();
  }, [retryCount]);

  // Open order details modal
  function openOrder(order) {
    if (updatingRef.current) return;

    setActiveOrder(order);
    setIsOpen(true);
  }

  // Close order details modal
  function closeOrder() {
    if (updatingRef.current) return;

    setActiveOrder(null);
    setIsOpen(false);
  }

  // Update order status
  async function updateOrderStatus(newStatus) {
    if (!activeOrder || updatingRef.current) return;

    if (newStatus === activeOrder.status) return;

    if (!orderStatuses.includes(newStatus)) {
      toast.error("Invalid order status");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login again");
      return;
    }

    // Lock immediately to prevent duplicate requests
    updatingRef.current = true;
    setIsUpdatingStatus(true);

    const orderId = activeOrder.orderId;
    const mongoId = activeOrder._id;

    try {
      const response = await axios.put(
        import.meta.env.VITE_BACKEND_URL +
          "/api/orders/" +
          encodeURIComponent(orderId) +
          "/" +
          encodeURIComponent(newStatus),
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      // Use the backend status if returned
      const savedStatus =
        response.data?.order?.status || newStatus;

      // Update modal
      setActiveOrder((previousOrder) => {
        if (!previousOrder || previousOrder._id !== mongoId) {
          return previousOrder;
        }

        return {
          ...previousOrder,
          status: savedStatus,
        };
      });

      // Update orders table
      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === mongoId
            ? {
                ...order,
                status: savedStatus,
              }
            : order
        )
      );

      toast.success("Order status updated successfully");
    } catch (err) {
      console.error("Updating order status failed:", err);

      toast.error(
        err.response?.data?.message ||
          "Failed to update order status"
      );
    } finally {
      updatingRef.current = false;
      setIsUpdatingStatus(false);
    }
  }

  // Retry fetching orders
  function retryFetch() {
    setRetryCount((previous) => previous + 1);
  }

  // Sort newest orders first
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full min-h-full bg-primary p-6 flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold text-red-400">
          Unable to Load Orders
        </h2>

        <p className="text-gray-300 text-center">
          {error}
        </p>

        <button
          type="button"
          onClick={retryFetch}
          className="px-6 py-2 bg-accent text-white rounded-lg font-semibold hover:opacity-80 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full overflow-y-auto p-4 md:p-6 bg-primary">
      {/* Page Header */}
      <h1 className="text-2xl font-bold text-white mb-2">
        Orders
      </h1>

      <p className="text-gray-400 mb-6">
        Manage customer orders
      </p>

      {/* Orders Table */}
      {sortedOrders.length === 0 ? (
        <div className="bg-white p-8 text-center rounded-lg">
          <p className="text-gray-500">
            No orders found.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg overflow-x-auto shadow-md">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-100">
              <tr className="text-slate-900">
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
              {sortedOrders.map((order) => (
                <tr
                  key={order._id}
                  onClick={() => openOrder(order)}
                  className="border-t border-gray-200 hover:bg-gray-50 cursor-pointer text-slate-800"
                >
                  <td className="p-3 text-accent font-semibold">
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

                  <td className="p-3 font-semibold">
                    Rs.{" "}
                    {Number(order.total || 0).toLocaleString(
                      "en-LK"
                    )}
                  </td>

                  <td className="p-3">
                    {order.date
                      ? new Date(order.date).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="p-3">
                    <span
                      className={
                        "inline-block px-3 py-1 rounded-full text-sm font-semibold " +
                        (statusStyles[order.status] ||
                          "bg-gray-100 text-gray-700")
                      }
                    >
                      {order.status || "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeOrder}
        shouldCloseOnOverlayClick={!isUpdatingStatus}
        shouldCloseOnEsc={!isUpdatingStatus}
        contentLabel="Order Details"
        className="bg-white p-4 md:p-6 rounded-xl w-[90%] max-w-xl max-h-[85vh] overflow-y-auto outline-none shadow-xl"
        overlayClassName="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
      >
        {activeOrder && (
          <div className="text-slate-800">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-slate-900">
                Order Details
              </h2>

              <button
                type="button"
                onClick={closeOrder}
                disabled={isUpdatingStatus}
                aria-label="Close order details"
                className="text-2xl text-slate-600 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ×
              </button>
            </div>

            {/* Order Information */}
            <div className="space-y-3 text-sm">
              <p>
                <strong>Order ID:</strong>{" "}
                {activeOrder.orderId || "-"}
              </p>

              <p>
                <strong>Customer:</strong>{" "}
                {activeOrder.name || "-"}
              </p>

              <p className="break-words">
                <strong>Email:</strong>{" "}
                {activeOrder.email || "-"}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {activeOrder.phone || "-"}
              </p>

              <p className="break-words">
                <strong>Address:</strong>{" "}
                {activeOrder.address || "-"}
              </p>

              <p>
                <strong>Payment Method:</strong>{" "}
                {activeOrder.paymentMethod ||
                  "Not specified"}
              </p>

              {/* Status Update */}
              <div className="flex flex-wrap items-center gap-2">
                <strong>Status:</strong>

                <select
                  value={activeOrder.status || "Pending"}
                  onChange={(event) =>
                    updateOrderStatus(event.target.value)
                  }
                  disabled={isUpdatingStatus}
                  aria-busy={isUpdatingStatus}
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {orderStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                {isUpdatingStatus && (
                  <span
                    className="text-sm text-blue-600"
                    role="status"
                  >
                    Updating...
                  </span>
                )}

                <span
                  className={
                    "px-3 py-1 rounded-full text-xs font-semibold " +
                    (statusStyles[activeOrder.status] ||
                      "bg-gray-100 text-gray-700")
                  }
                >
                  {activeOrder.status || "Pending"}
                </span>
              </div>

              <p>
                <strong>Date:</strong>{" "}
                {activeOrder.date
                  ? new Date(activeOrder.date).toLocaleString()
                  : "-"}
              </p>

              <p>
                <strong>Labeled Total:</strong>{" "}
                Rs.{" "}
                {Number(
                  activeOrder.labeledTotal || 0
                ).toLocaleString("en-LK")}
              </p>

              <p className="text-base font-bold text-slate-900">
                Total: Rs.{" "}
                {Number(
                  activeOrder.total || 0
                ).toLocaleString("en-LK")}
              </p>
            </div>

            {/* Ordered Products */}
            <div className="mt-6">
              <h3 className="font-bold text-slate-900 mb-3">
                Products
              </h3>

              {activeOrder.products?.length > 0 ? (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  {activeOrder.products.map(
                    (product, index) => {
                      const unitPrice = Number(
                        product.productInfo?.price ??
                          product.price ??
                          0
                      );

                      const quantity = Number(
                        product.quantity ?? 0
                      );

                      return (
                        <div
                          key={product._id || index}
                          className="p-3 border-b border-gray-200 last:border-b-0"
                        >
                          <p className="font-semibold text-slate-900 mb-2">
                            {product.productInfo?.name ||
                              product.name ||
                              "Product"}
                          </p>

                          <p className="text-sm text-slate-600">
                            <strong>Quantity:</strong>{" "}
                            {quantity}
                          </p>

                          <p className="text-sm text-slate-600">
                            <strong>Unit Price:</strong>{" "}
                            Rs.{" "}
                            {unitPrice.toLocaleString("en-LK")}
                          </p>

                          <p className="text-sm font-semibold text-slate-800 mt-1">
                            Subtotal: Rs.{" "}
                            {(
                              unitPrice * quantity
                            ).toLocaleString("en-LK")}
                          </p>
                        </div>
                      );
                    }
                  )}
                </div>
              ) : (
                <p className="text-gray-500">
                  No product information available.
                </p>
              )}
            </div>

            {/* Close Button */}
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={closeOrder}
                disabled={isUpdatingStatus}
                className="px-5 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
