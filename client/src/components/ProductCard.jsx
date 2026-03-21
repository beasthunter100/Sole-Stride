import { Link } from 'react-router-dom';

function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

export default function ProductCard({ product }) {
    const discount =
        product.originalPrice && product.originalPrice > product.price
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;

    return (
        <div className="product-card">
            <img
                className="product-card-image"
                src={product.images?.[0] || 'https://via.placeholder.com/600x400?text=Shoe+Image'}
                alt={product.name}
                loading="lazy"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/600x400?text=Shoe+Image';
                }}
            />
            <div className="product-card-body">
                <span className="product-card-brand">{product.brand}</span>
                <h3 className="product-card-name">{product.name}</h3>
                <div className="product-card-price">
                    <span className="current">₹{product.price.toLocaleString('en-IN')}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                        <span className="original">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                    )}
                    {discount > 0 && <span className="discount">{discount}% OFF</span>}
                </div>
                <div className="product-card-rating">
                    <span className="stars">{renderStars(product.rating)}</span>
                    <span>({product.numReviews})</span>
                </div>
            </div>
            <div className="product-card-footer">
                <Link to={`/products/${product._id}`} className="btn btn-primary btn-sm">
                    View Details
                </Link>
            </div>
        </div>
    );
}
