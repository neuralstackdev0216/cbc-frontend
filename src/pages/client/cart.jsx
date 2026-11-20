
import { useState } from "react";
import { BiMinus, BiPlus, BiTrash, BiCart } from "react-icons/bi";
import { Link } from "react-router-dom";
import {
  addToCart,
  GetCart,
  removeFromCart,
} from "../../utils/cart";

export default function CartPage() {
  const [cart, setCart] = useState(() => GetCart());

  // Calculate total using React state
  const total = cart.reduce((sum, item) => {
    return sum + Number(item.price) * Number(item.qty);
  }, 0);

  const totalItems = cart.reduce((sum, item) => {
    return sum + Number(item.qty);
  }, 0);

  // Increase or decrease quantity
  function changeQuantity(item, change) {
    addToCart(item, change);
    setCart(GetCart());
  }

  // Remove a product
  function handleRemove(productId) {
    removeFromCart(productId);
    setCart(GetCart());
  }

  // Format prices
  function formatPrice(value) {
    return Number(value || 0).toLocaleString("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return (
    <div className="w-full min-h-screen bg-primary px-4 py-8 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Shopping Cart
          </h1>

          <p className="text-slate-400 mt-2">
            Review your selected products before checkout.
          </p>
        </div>

        {cart.length === 0 ? (
          /* Empty Cart */
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-2xl shadow-lg text-center">
            <BiCart className="text-7xl text-slate-300 mb-4" />

            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Your cart is empty
            </h2>

            <p className="text-slate-500 mb-6">
              Browse our products and add something to your cart.
            </p>

            <Link
              to="/products"
              className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Cart Products */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
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

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold text-slate-900 break-words">
                      {item.name}
                    </h2>

                    <p className="text-xs text-slate-500 mt-1">
                      Product ID: {item.productId}
                    </p>

                    {/* Price */}
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

                    {/* Quantity and Remove */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${item.name}`}
                          onClick={() => changeQuantity(item, -1)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 transition"
                        >
                          <BiMinus />
                        </button>

                        <span className="text-slate-900 font-semibold min-w-6 text-center">
                          {item.qty}
                        </span>

                        <button
                          type="button"
                          aria-label={`Increase quantity of ${item.name}`}
                          onClick={() => changeQuantity(item, 1)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 transition"
                        >
                          <BiPlus />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemove(item.productId)}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium"
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

              {/* Continue Shopping */}
              <Link
                to="/products"
                className="inline-block text-sky-400 hover:text-sky-300 font-medium mt-3"
              >
                ← Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
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

              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between items-center gap-3">
                  <span className="text-lg font-bold text-slate-900">
                    Total
                  </span>

                  <span className="text-xl font-bold text-accent">
                    Rs. {formatPrice(total)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-4 mb-5">
                Delivery charges, if applicable, will be
                confirmed during order processing.
              </p>

              <Link
                to="/checkout"
                className="w-full flex items-center justify-center bg-accent text-white py-3 rounded-lg font-semibold hover:bg-secondary transition-colors"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
