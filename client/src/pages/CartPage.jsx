import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, cartTotal } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const shippingCost = cartTotal > 500 ? 0 : 50;
    const total = cartTotal + shippingCost;

    const handleCheckout = () => {
        if (!isAuthenticated) {
            toast.error('Please login to proceed to checkout');
            navigate('/login', { state: { from: { pathname: '/checkout' } } });
            return;
        }
        navigate('/checkout');
    };

    if (items.length === 0) {
        return (
            <div className="page">
                <div className="container">
                    <div className="empty-state">
                        <div className="empty-state-icon">🛒</div>
                        <h2>Your Cart is Empty</h2>
                        <p>Looks like you haven&apos;t added anything to your cart yet.</p>
                        <Link to="/products" className="btn btn-primary">
                            Continue Shopping →
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container">
                <h1 className="page-title">Shopping Cart</h1>

                <div className="cart-layout">
                    {/* Cart Items */}
                    <div className="cart-items">
                        {items.map((item) => (
                            <div className="cart-item" key={`${item._id}-${item.size}`}>
                                <img
                                    className="cart-item-image"
                                    src={item.image || 'https://via.placeholder.com/80x80?text=Shoe'}
                                    alt={item.name}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/80x80?text=Shoe';
                                    }}
                                />

                                <div className="cart-item-info">
                                    <h3>{item.name}</h3>
                                    <p className="cart-item-size">Size: {item.size}</p>
                                    <p className="cart-item-price">
                                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                    </p>
                                </div>

                                <div className="cart-item-controls">
                                    <div className="cart-item-qty">
                                        <button
                                            onClick={() =>
                                                updateQuantity(item._id, item.size, item.quantity - 1)
                                            }
                                        >
                                            −
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            onClick={() =>
                                                updateQuantity(item._id, item.size, item.quantity + 1)
                                            }
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        className="cart-item-remove"
                                        onClick={() => removeFromCart(item._id, item.size)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="cart-summary">
                        <h2>Order Summary</h2>

                        <div className="cart-summary-row">
                            <span>Subtotal</span>
                            <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="cart-summary-row">
                            <span>Shipping</span>
                            <span className={shippingCost === 0 ? 'free-shipping' : ''}>
                                {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
                            </span>
                        </div>

                        {shippingCost > 0 && (
                            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
                                Free shipping on orders above ₹500
                            </p>
                        )}

                        <div className="cart-summary-row total">
                            <span>Total</span>
                            <span>₹{total.toLocaleString('en-IN')}</span>
                        </div>

                        <button className="btn btn-primary btn-lg" onClick={handleCheckout}>
                            Proceed to Checkout →
                        </button>

                        <div style={{ textAlign: 'center', marginTop: '12px' }}>
                            <Link
                                to="/products"
                                style={{ fontSize: '0.875rem', color: '#f97316', fontWeight: '500' }}
                            >
                                ← Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
