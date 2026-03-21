import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const categories = [
    { name: 'Running', slug: 'running', icon: '🏃' },
    { name: 'Casual', slug: 'casual', icon: '👟' },
    { name: 'Formal', slug: 'formal', icon: '👞' },
    { name: 'Sports', slug: 'sports', icon: '⚽' },
    { name: 'Sneakers', slug: 'sneakers', icon: '🔥' },
];

export default function HomePage() {
    const [featured, setFeatured] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products');
                setFeatured(res.data.products.slice(0, 4));
            } catch (err) {
                console.error('Failed to fetch featured products:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <span className="hero-badge">✨ New Collection 2024</span>
                        <h1>
                            Step Into Your <span>Best Stride</span>
                        </h1>
                        <p>
                            Discover premium footwear for every occasion. From track-ready runners
                            to sleek formals — find your perfect pair at SoleStore.
                        </p>
                        <div className="hero-buttons">
                            <Link to="/products" className="btn btn-primary btn-lg">
                                Shop Now →
                            </Link>
                            <Link to="/products" className="btn btn-secondary btn-lg">
                                View Deals
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2>Featured Products</h2>
                        <p>Handpicked styles loved by our customers</p>
                    </div>

                    {loading ? (
                        <div className="spinner-container">
                            <div className="spinner"></div>
                        </div>
                    ) : (
                        <div className="product-grid">
                            {featured.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}

                    <div style={{ textAlign: 'center', marginTop: '32px' }}>
                        <Link to="/products" className="btn btn-dark">
                            View All Products →
                        </Link>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="section" style={{ background: '#ffffff' }}>
                <div className="container">
                    <div className="section-header">
                        <h2>Shop by Category</h2>
                        <p>Find exactly what you&apos;re looking for</p>
                    </div>

                    <div className="category-grid">
                        {categories.map((cat) => (
                            <Link
                                key={cat.slug}
                                to={`/products?category=${cat.slug}`}
                                className="category-card"
                            >
                                <div className="category-card-icon">{cat.icon}</div>
                                <div className="category-card-name">{cat.name}</div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-brand">SoleStore 👟</div>
                    <p>© {new Date().getFullYear()} SoleStore. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
