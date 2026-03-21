import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
    const { items, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
    });

    const [paymentMethod] = useState('COD');

    const shippingCost = cartTotal > 500 ? 0 : 50;
    const total = cartTotal + shippingCost;

    // Redirect if cart is empty
    useEffect(() => {
        if (items.length === 0) {
            navigate('/products');
        }
    }, [items, navigate]);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const validate = () => {
        const { fullName, phone, addressLine1, city, state, pincode } = form;
        if (!fullName.trim()) return 'Full name is required';
        if (!phone.trim() || !/^\d{10}$/.test(phone.trim())) return 'Valid 10-digit phone number is required';
        if (!addressLine1.trim()) return 'Address Line 1 is required';
        if (!city.trim()) return 'City is required';
        if (!state.trim()) return 'State is required';
        if (!pincode.trim() || !/^\d{6}$/.test(pincode.trim())) return 'Valid 6-digit pincode is required';
        return null;
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        const error = validate();
        if (error) {
            toast.error(error);
            return;
        }

        setLoading(true);
        try {
            const orderItems = items.map((item) => ({
                product: item._id,
                name: item.name,
                image: item.image,
                price: item.price,
                size: item.size,
                quantity: item.quantity,
            }));

            const res = await api.post('/orders', {
                items: orderItems,
                shippingAddress: form,
                paymentMethod,
            });

            clearCart();
            toast.success('Order placed successfully!');
            navigate(`/order-success/${res.data.order._id}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) return null;

    return (
        <div className="page">
            <div className="container">
                <h1 className="page-title">Checkout</h1>

                <div className="checkout-layout">
                    {/* Shipping Form */}
                    <form className="checkout-form" onSubmit={handlePlaceOrder}>
                        <h2>📦 Shipping Address</h2>

                        <div className="form-group">
                            <label htmlFor="fullName">Full Name *</label>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                placeholder="John Doe"
                                value={form.fullName}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Phone Number *</label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="10-digit number"
                                value={form.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="addressLine1">Address Line 1 *</label>
                            <input
                                id="addressLine1"
                                name="addressLine1"
                                type="text"
                                placeholder="House no., Street name"
                                value={form.addressLine1}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="addressLine2">Address Line 2</label>
                            <input
                                id="addressLine2"
                                name="addressLine2"
                                type="text"
                                placeholder="Landmark, Area (optional)"
                                value={form.addressLine2}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="city">City *</label>
                                <input
                                    id="city"
                                    name="city"
                                    type="text"
                                    placeholder="Mumbai"
                                    value={form.city}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="state">State *</label>
                                <input
                                    id="state"
                                    name="state"
                                    type="text"
                                    placeholder="Maharashtra"
                                    value={form.state}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="pincode">Pincode *</label>
                            <input
                                id="pincode"
                                name="pincode"
                                type="text"
                                placeholder="6-digit pincode"
                                value={form.pincode}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Payment Method */}
                        <h2 style={{ marginTop: '32px' }}>💳 Payment Method</h2>

                        <div className="payment-option selected">
                            <input type="radio" name="payment" value="COD" checked readOnly />
                            <span className="payment-option-label">Cash on Delivery</span>
                        </div>

                        <div className="payment-option disabled">
                            <input type="radio" name="payment" value="card" disabled />
                            <span className="payment-option-label">Card Payment</span>
                            <span className="payment-option-tag">Coming Soon</span>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            disabled={loading}
                            style={{ width: '100%', marginTop: '24px' }}
                        >
                            {loading ? 'Placing Order...' : `Place Order — ₹${total.toLocaleString('en-IN')}`}
                        </button>
                    </form>

                    {/* Order Summary */}
                    <div className="checkout-order-summary">
                        <h2>Order Summary ({items.length} item{items.length !== 1 ? 's' : ''})</h2>

                        {items.map((item) => (
                            <div className="checkout-item" key={`${item._id}-${item.size}`}>
                                <img
                                    src={item.image || 'https://via.placeholder.com/48x48?text=Shoe'}
                                    alt={item.name}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/48x48?text=Shoe';
                                    }}
                                />
                                <div className="checkout-item-info">
                                    <h4>{item.name}</h4>
                                    <p>Size: {item.size} | Qty: {item.quantity}</p>
                                </div>
                                <span className="checkout-item-price">
                                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                </span>
                            </div>
                        ))}

                        <div className="cart-summary-row" style={{ marginTop: '16px' }}>
                            <span>Subtotal</span>
                            <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="cart-summary-row">
                            <span>Shipping</span>
                            <span style={{ color: shippingCost === 0 ? '#10b981' : undefined }}>
                                {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
                            </span>
                        </div>
                        <div className="cart-summary-row total">
                            <span>Total</span>
                            <span>₹{total.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
