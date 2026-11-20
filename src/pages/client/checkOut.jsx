
import { useRef, useState } from "react";
import { BiMinus, BiTrash, BiPlus, BiCart } from "react-icons/bi";
import { useNavigate, Link } from "react-router-dom";
import { GetCart } from "../../utils/cart";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function CheckoutPage() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(() => GetCart());
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submittingRef = useRef(false);

  // Calculate order total
  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.qty),
    0
  );

  const totalItems = cart.reduce(
    (sum, item) => sum + Number(item.qty),
    0
  );

  function formatPrice(value) {
    return Number(value || 0).toLocaleString("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  // Synchronize React state and localStorage
  function updateCart(newCart) {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  }

  function removeFromCart(index) {
    if (submittingRef.current) return;

    const newCart = cart.filter((_, i) => i !== index);
    updateCart(newCart);
  }

  function changeQuantity(index, change) {
    if (submittingRef.current) return;

    const item = cart[index];
    if (!item) return;

    const newQty = Number(item.qty) + change;

    if (newQty <= 0) {
      removeFromCart(index);
      return;
    }

    const newCart = cart.map((product, i) =>
      i === index ? { ...product, qty: newQty } : product
    );

    updateCart(newCart);
  }

  // Place order
  async function placeOrder() {
    if (submittingRef.current) return;

    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    const phoneRegex = /^07\d{8}$/;

    if (!phoneRegex.test(phoneNumber.trim())) {
      toast.error(
        "Enter a valid 10-digit Sri Lankan mobile number"
      );
      return;
    }

    if (address.trim().length < 10) {
      toast.error("Please enter a complete delivery address");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please Login First");
      return;
    }

    const orderInformation = {
      products: cart.map((item) => ({
        productId: item.productId,
        qty: Number(item.qty),
      })),
      phone: phoneNumber.trim(),
      address: address.trim(),
    };

    submittingRef.current = true;
    setIsSubmitting(true);

    try {
      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/orders",
        orderInformation,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      toast.success("Order Placed Successfully");

      localStorage.removeItem("cart");
      setCart([]);
      navigate("/my-orders");
    } catch (err) {
      console.error("Order placement failed:", err);

      toast.error(
        err.response?.data?.message || "Error Placing Order"
      );
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full min-h-screen bg-primary px-4 py-8 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Checkout
          </h1>

          <p className="text-slate-400 mt-2">
            Review your products and enter your delivery details.
          </p>
        </div>

        {cart.length === 0 ? (
          /* Empty Checkout */
          <div className="bg-white rounded-2xl shadow-lg py-20 px-4 flex flex-col items-center text-center">
            <BiCart className="text-7xl text-slate-300 mb-4" />

            <h2 className="text-2xl font-bold text-slate-900">
              Your cart is empty
            </h2>

            <p className="text-slate-500 mt-2 mb-6">
              Add products before proceeding to checkout.
            </p>

            <Link
              to="/products"
              className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* LEFT: Products */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-semibold text-white">
                Your Products ({totalItems})
              </h2>

              {cart.map((item, index) => (
                <div
                  key={item.productId}
                  className="bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row gap-4"
                >
                  {/* Product Image */}
                  <div className="w-full sm:w-28 h-40 sm:h-28 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name || "Product"}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Product Information */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-slate-900 break-words">
                      {item.name}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      Product ID: {item.productId}
                    </p>

                    <div className="mt-3">
                      {Number(item.labeledPrice) >
                        Number(item.price) && (
                        <span className="text-sm text-slate-400 line-through mr-2">
                          Rs. {formatPrice(item.labeledPrice)}
                        </span>
                      )}

                      <span className="text-lg font-bold text-accent">
                        Rs. {formatPrice(item.price)}
                      </span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          disabled={isSubmitting}
                          aria-label={`Decrease quantity of ${item.name}`}
                          onClick={() => changeQuantity(index, -1)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 text-slate-900 hover:bg-slate-200 disabled:opacity-50"
                        >
                          <BiMinus />
                        </button>

                        <span className="text-slate-900 font-semibold min-w-6 text-center">
                          {item.qty}
                        </span>

                        <button
                          type="button"
                          disabled={isSubmitting}
                          aria-label={`Increase quantity of ${item.name}`}
                          onClick={() => changeQuantity(index, 1)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 text-slate-900 hover:bg-slate-200 disabled:opacity-50"
                        >
                          <BiPlus />
                        </button>
                      </div>

                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => removeFromCart(index)}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                      >
                        <BiTrash className="text-lg" />
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Item Subtotal */}
                  <div className="sm:text-right sm:min-w-32 border-t sm:border-t-0 pt-3 sm:pt-0">
                    <p className="text-xs text-slate-500">
                      Subtotal
                    </p>

                    <p className="text-lg font-bold text-slate-900 mt-1">
                      Rs. {formatPrice(
                        Number(item.price) * Number(item.qty)
                      )}
                    </p>
                  </div>
                </div>
              ))}

              <Link
                to="/cart"
                className="inline-block text-sky-400 hover:text-sky-300 font-medium mt-3"
              >
                ← Back to Cart
              </Link>
            </div>

            {/* RIGHT: Order Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6 lg:sticky lg:top-6">
              <h2 className="text-xl font-bold text-slate-900 mb-5">
                Order Summary
              </h2>

              <div className="flex justify-between text-slate-600 mb-3">
                <span>Total Items</span>
                <span>{totalItems}</span>
              </div>

              <div className="flex justify-between text-slate-600 mb-4">
                <span>Subtotal</span>
                <span>Rs. {formatPrice(total)}</span>
              </div>

              <div className="border-t border-slate-200 pt-4 mb-6">
                <div className="flex justify-between items-center gap-3">
                  <span className="text-lg font-bold text-slate-900">
                    Total
                  </span>

                  <span className="text-xl font-bold text-accent">
                    Rs. {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Delivery Information */}
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Delivery Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="checkout-phone"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Phone Number
                  </label>

                  <input
                    id="checkout-phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="07XXXXXXXX"
                    autoComplete="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full min-w-0 border border-slate-300 rounded-lg px-3 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="checkout-address"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Delivery Address
                  </label>

                  <textarea
                    id="checkout-address"
                    rows={3}
                    placeholder="Enter your complete delivery address"
                    autoComplete="street-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full min-w-0 border border-slate-300 rounded-lg px-3 py-3 text-slate-900 resize-none focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Submit Order */}
              <button
                type="button"
                onClick={placeOrder}
                disabled={cart.length === 0 || isSubmitting}
                className="w-full mt-6 bg-accent text-white py-3 rounded-lg font-semibold hover:bg-secondary transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? "Placing Order..."
                  : "Place Order"}
              </button>

              <p className="text-xs text-slate-500 mt-4 text-center">
                Please verify your delivery details before
                placing your order.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
