import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

export default function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data.product);
            } catch (err) {
                console.error('Failed to fetch product:', err);
                toast.error('Product not found');
                navigate('/products');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="page">
                <div className="spinner-container">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    if (!product) return null;

    const discount =
        product.originalPrice && product.originalPrice > product.price
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;

    const handleAddToCart = () => {
        if (!selectedSize) {
            toast.error('Please select a size');
            return;
        }
        addToCart(product, selectedSize, quantity);
    };

    const handleBuyNow = () => {
        if (!selectedSize) {
            toast.error('Please select a size');
            return;
        }
        addToCart(product, selectedSize, quantity);
        navigate('/cart');
    };

    return (
        <div className="page">
            <div className="container">
                <div className="product-detail">
                    <img
                        className="product-detail-image"
                        src={product.images?.[0] || 'https://via.placeholder.com/600x600?text=Shoe+Image'}
                        alt={product.name}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/600x600?text=Shoe+Image';
                        }}
                    />

                    <div className="product-detail-info">
                        <span className="product-detail-brand">{product.brand}</span>
                        <h1 className="product-detail-name">{product.name}</h1>

                        <div className="product-detail-rating">
                            <span className="stars">{renderStars(product.rating)}</span>
                            <span>{product.rating} / 5</span>
                            <span>({product.numReviews} reviews)</span>
                        </div>

                        <div className="product-detail-price-box">
                            <span className="product-detail-price">
                                ₹{product.price.toLocaleString('en-IN')}
                            </span>
                            {product.originalPrice && product.originalPrice > product.price && (
                                <span className="product-detail-original">
                                    ₹{product.originalPrice.toLocaleString('en-IN')}
                                </span>
                            )}
                            {discount > 0 && (
                                <span className="product-detail-discount">{discount}% OFF</span>
                            )}
                        </div>

                        <p className="product-detail-desc">{product.description}</p>

                        <span
                            className={`product-detail-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'
                                }`}
                        >
                            {product.stock > 0 ? `✓ In Stock (${product.stock} available)` : '✕ Out of Stock'}
                        </span>

                        {/* Size selector */}
                        <div className="size-selector">
                            <h4>Select Size</h4>
                            <div className="size-options">
                                {product.sizes?.map((size) => (
                                    <button
                                        key={size}
                                        className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity selector */}
                        <div className="quantity-selector">
                            <h4>Quantity</h4>
                            <button
                                className="qty-btn"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            >
                                −
                            </button>
                            <span className="qty-value">{quantity}</span>
                            <button
                                className="qty-btn"
                                onClick={() => setQuantity(quantity + 1)}
                            >
                                +
                            </button>
                        </div>

                        {/* Action buttons */}
                        <div className="product-detail-actions">
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                            >
                                Add to Cart
                            </button>
                            <button
                                className="btn btn-dark btn-lg"
                                onClick={handleBuyNow}
                                disabled={product.stock === 0}
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
