import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const categoryList = [
    { label: 'All', value: 'all' },
    { label: 'Running', value: 'running' },
    { label: 'Casual', value: 'casual' },
    { label: 'Formal', value: 'formal' },
    { label: 'Sports', value: 'sports' },
    { label: 'Sneakers', value: 'sneakers' },
];

const sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
];

export default function ProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [searchDebounced, setSearchDebounced] = useState('');

    const category = searchParams.get('category') || 'all';
    const sort = searchParams.get('sort') || 'newest';

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchDebounced(search);
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = {};
            if (category && category !== 'all') params.category = category;
            if (sort) params.sort = sort;
            if (searchDebounced) params.search = searchDebounced;

            const res = await api.get('/products', { params });
            setProducts(res.data.products);
        } catch (err) {
            console.error('Failed to fetch products:', err);
        } finally {
            setLoading(false);
        }
    }, [category, sort, searchDebounced]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleCategoryChange = (value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value === 'all') {
            newParams.delete('category');
        } else {
            newParams.set('category', value);
        }
        setSearchParams(newParams);
    };

    const handleSortChange = (value) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('sort', value);
        setSearchParams(newParams);
    };

    return (
        <div className="page">
            <div className="container">
                <h1 className="page-title">
                    {category !== 'all'
                        ? `${category.charAt(0).toUpperCase() + category.slice(1)} Shoes`
                        : 'All Products'}
                </h1>

                <div className="products-layout">
                    {/* Sidebar */}
                    <aside className="products-sidebar">
                        <div className="filter-group">
                            <h3>Search</h3>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search shoes..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="filter-group">
                            <h3>Category</h3>
                            {categoryList.map((cat) => (
                                <label
                                    key={cat.value}
                                    className={`filter-option ${category === cat.value ? 'active' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={category === cat.value}
                                        onChange={() => handleCategoryChange(cat.value)}
                                    />
                                    {cat.label}
                                </label>
                            ))}
                        </div>

                        <div className="filter-group">
                            <h3>Sort By</h3>
                            <select
                                value={sort}
                                onChange={(e) => handleSortChange(e.target.value)}
                                className="search-input"
                            >
                                {sortOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </aside>

                    {/* Products */}
                    <div>
                        <p className="products-count">
                            {loading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
                        </p>

                        {loading ? (
                            <div className="spinner-container">
                                <div className="spinner"></div>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">🔍</div>
                                <h2>No products found</h2>
                                <p>Try adjusting your search or filter to find what you&apos;re looking for.</p>
                            </div>
                        ) : (
                            <div className="product-grid">
                                {products.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
