
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "../../components/loading.jsx";
import { Link, useNavigate } from "react-router-dom";

const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-green-100 text-green-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function MyOrdersPage() {
  const navigate = useNavigate();

  // State management
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Track which order is expanded
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Expand or collapse an order
  function toggleOrderDetails(orderId) {
    setExpandedOrderId((previousId) =>
      previousId === orderId ? null : orderId
    );
  }

  // Fetch customer orders
  useEffect(() => {
    const controller = new AbortController();

    async function fetchOrders() {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to view your orders");
        navigate("/login", { replace: true });
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const response = await axios.get(
          import.meta.env.VITE_BACKEND_URL +
            "/api/orders?mine=true",
          {
            headers: {
              Authorization: "Bearer " + token,
            },
            signal: controller.signal,
          }
        );

        setOrders(
          Array.isArray(response.data.orders)
            ? response.data.orders
            : []
        );
      } catch (err) {
        if (axios.isCancel(err)) return;

        console.error("Fetching orders failed:", err);

        setError(
          "Unable to load your orders. Please try again."
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
  }, [navigate]);

  // Loading state
  if (isLoading) {
    return <Loading />;
  }

  // Error state
  if (error) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4 p-6">
        <h2 className="text-xl font-bold text-red-600">
          Unable to Load Orders
        </h2>

        <p className="text-gray-500 text-center">
          {error}
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="bg-accent text-white px-6 py-2 rounded-lg font-semibold hover:bg-secondary transition"
        >
          Retry
        </button>
      </div>
    );
  }

  // Sort orders newest first
  const sorted = [...orders].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="w-full min-h-full self-start flex flex-col items-center p-4 md:p-6">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-white mb-6">
        My Orders
      </h1>

      {sorted.length === 0 ? (
        // Empty orders state
        <div className="flex flex-col items-center gap-4 mt-10 text-center">
          <p className="text-slate-400 text-lg">
            You haven't placed any orders yet.
          </p>

          <Link
            to="/products"
            className="bg-accent text-white font-bold px-6 py-2 rounded-full hover:bg-accent/80 transition-all duration-300"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        // Customer order list
        <div className="w-full max-w-3xl flex flex-col gap-4">
          {sorted.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-md p-4 border border-gray-100"
            >
              {/* Order Header */}
              <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                <div>
                  <p className="font-bold text-accent">
                    {order.orderId}
                  </p>

                  <p className="text-sm text-gray-500">
                    {new Date(order.date).toLocaleString()}
                  </p>
                </div>

                {/* Order Status */}
                <span
                  className={
                    "px-3 py-1 rounded-full text-sm font-semibold " +
                    (statusStyles[order.status] ||
                      "bg-gray-100 text-gray-700")
                  }
                >
                  {order.status}
                </span>
              </div>

              {/* Ordered Products */}
              <div className="flex flex-col gap-2">
                {(order.products || []).map((item, index) => (
                  <div
                    key={item._id || index}
                    className="flex items-center gap-3"
                  >
                    {/* Product Image */}
                    {item.productInfo?.images?.[0] ? (
                      <img
                        src={item.productInfo.images[0]}
                        alt={
                          item.productInfo?.name ||
                          "Ordered product"
                        }
                        className="w-14 h-14 object-cover rounded-lg bg-gray-100"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-500">
                        No image
                      </div>
                    )}

                    {/* Product Information */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 line-clamp-1">
                        {item.productInfo?.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {item.quantity} × Rs.{" "}
                        {Number(
                          item.productInfo?.price || 0
                        ).toLocaleString("en-LK")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mt-4 pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-500 break-words">
                  Delivery to: {order.address}
                </p>

                <p className="text-lg font-bold text-slate-900 shrink-0">
                  Rs.{" "}
                  {Number(order.total || 0).toLocaleString(
                    "en-LK"
                  )}
                </p>
              </div>

              {/* View Details / Hide Details */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() =>
                    toggleOrderDetails(order.orderId)
                  }
                  aria-expanded={
                    expandedOrderId === order.orderId
                  }
                  className="text-accent font-semibold hover:underline"
                >
                  {expandedOrderId === order.orderId
                    ? "Hide Details"
                    : "View Details"}
                </button>

                {/* Expanded Order Details */}
                {expandedOrderId === order.orderId && (
                  <div className="mt-4 p-4 bg-slate-100 rounded-xl space-y-3">
                    <h3 className="text-lg font-bold text-slate-900">
                      Order Information
                    </h3>

                    <p className="text-sm text-slate-700">
                      <strong>Order ID:</strong>{" "}
                      {order.orderId}
                    </p>

                    <p className="text-sm text-slate-700">
                      <strong>Payment Method:</strong>{" "}
                      {order.paymentMethod || "Not specified"}
                    </p>

                    <p className="text-sm text-slate-700 break-words">
                      <strong>Delivery Address:</strong>{" "}
                      {order.address}
                    </p>

                    <p className="text-sm text-slate-700">
                      <strong>Order Status:</strong>{" "}
                      {order.status}
                    </p>

                    <div className="border-t border-slate-300 pt-3">
                      <h4 className="font-semibold text-slate-900 mb-3">
                        Product Subtotals
                      </h4>

                      <div className="space-y-3">
                        {(order.products || []).map(
                          (item, index) => (
                            <div
                              key={item._id || index}
                              className="flex flex-wrap justify-between gap-2 text-sm text-slate-700"
                            >
                              <span className="flex-1 min-w-0 break-words">
                                {item.productInfo?.name} ×{" "}
                                {item.quantity}
                              </span>

                              <span className="font-semibold">
                                Rs.{" "}
                                {(
                                  Number(
                                    item.productInfo?.price || 0
                                  ) *
                                  Number(item.quantity || 0)
                                ).toLocaleString("en-LK")}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div className="border-t border-slate-300 pt-3 flex flex-wrap justify-between gap-2">
                      <span className="font-bold text-slate-900">
                        Order Total
                      </span>

                      <span className="font-bold text-slate-900">
                        Rs.{" "}
                        {Number(order.total || 0).toLocaleString(
                          "en-LK"
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
