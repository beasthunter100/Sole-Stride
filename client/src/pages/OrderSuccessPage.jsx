import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

export default function OrderSuccessPage() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await api.get(`/orders/${orderId}`);
                setOrder(res.data.order);
            } catch (err) {
                console.error('Failed to fetch order:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    if (loading) {
        return (
            <div className="page">
                <div className="spinner-container">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="page">
                <div className="container">
                    <div className="empty-state">
                        <div className="empty-state-icon">❓</div>
                        <h2>Order Not Found</h2>
                        <p>We couldn&apos;t find this order. Please check your order ID.</p>
                        <Link to="/products" className="btn btn-primary">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container">
                <div className="order-success">
                    <div className="order-success-icon">✓</div>
                    <h1>Order Placed Successfully!</h1>
                    <p className="order-id">Order ID: {order._id}</p>

                    {/* Items */}
                    <div className="order-success-details">
                        <h3>Order Items</h3>
                        {order.items.map((item, i) => (
                            <div className="order-success-item" key={i}>
                                <span>
                                    {item.name} (Size: {item.size}) × {item.quantity}
                                </span>
                                <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                            </div>
                        ))}
                        <div className="order-success-total">
                            <span>Total</span>
                            <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="order-success-address">
                        <h3>Shipping Address</h3>
                        <p>
                            {order.shippingAddress.fullName}<br />
                            {order.shippingAddress.phone}<br />
                            {order.shippingAddress.addressLine1}
                            {order.shippingAddress.addressLine2 && <>, {order.shippingAddress.addressLine2}</>}
                            <br />
                            {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="order-success-actions">
                        <Link to="/products" className="btn btn-primary">
                            Continue Shopping →
                        </Link>
                        <Link to="/products" className="btn btn-secondary">
                            View All Products
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
