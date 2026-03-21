import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [items, setItems] = useState(() => {
        try {
            const saved = localStorage.getItem('cart');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // Persist cart to localStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (product, size, quantity = 1) => {
        setItems((prev) => {
            const existingIndex = prev.findIndex(
                (item) => item._id === product._id && item.size === size
            );

            if (existingIndex !== -1) {
                const updated = [...prev];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + quantity,
                };
                return updated;
            }

            return [
                ...prev,
                {
                    _id: product._id,
                    name: product.name,
                    image: product.images?.[0] || '',
                    price: product.price,
                    size,
                    quantity,
                },
            ];
        });
        toast.success('Added to cart!');
    };

    const removeFromCart = (_id, size) => {
        setItems((prev) => prev.filter((item) => !(item._id === _id && item.size === size)));
        toast.success('Removed from cart');
    };

    const updateQuantity = (_id, size, newQty) => {
        if (newQty <= 0) {
            removeFromCart(_id, size);
            return;
        }
        setItems((prev) =>
            prev.map((item) =>
                item._id === _id && item.size === size
                    ? { ...item, quantity: newQty }
                    : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartCount,
                cartTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}

export default CartContext;
