
const CART_KEY = "cart";

export function GetCart() {

    try {

        const savedCart = localStorage.getItem(CART_KEY);

        if (!savedCart) return [];

        const cart = JSON.parse(savedCart);

        return Array.isArray(cart) ? cart : [];

    } catch {

        return [];

    }
}

function saveCart(cart) {

    localStorage.setItem(CART_KEY, JSON.stringify(cart));

    window.dispatchEvent(new Event("cart-updated"));

}

export function removeFromCart(productId) {

    const cart = GetCart();

    const newCart = cart.filter(
        (item) => item.productId !== productId
    );

    saveCart(newCart);

}

export function addToCart(product, qty) {

    const quantity = Number(qty);

    if (!Number.isSafeInteger(quantity) || quantity === 0) {
        return;
    }

    const cart = GetCart();

    const index = cart.findIndex(
        (item) => item.productId === product.productId
    );

    if (index === -1) {

        if (quantity <= 0) return;

        cart.push({
            productId: product.productId,
            name: product.name,
            labeledPrice: product.labeledPrice,
            image: product.images?.[0] || product.image || "",
            price: product.price,
            qty: quantity
        });

    } else {

        const newQty = Number(cart[index].qty) + quantity;

        if (newQty <= 0) {

            removeFromCart(product.productId);

            return;

        }

        cart[index].qty = newQty;

    }

    saveCart(cart);

}

export function getTotal() {

    return GetCart().reduce(
        (total, item) =>
            total + Number(item.price) * Number(item.qty),
        0
    );

}

export function getCartCount() {

    return GetCart().reduce(
        (total, item) => total + Number(item.qty || 0),
        0
    );

}

export function clearCart() {

    localStorage.removeItem(CART_KEY);

    window.dispatchEvent(new Event("cart-updated"));

}
