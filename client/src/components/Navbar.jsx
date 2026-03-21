import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const { cartCount } = useCart();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        navigate('/login');
        setMobileOpen(false);
    };

    const closeMobile = () => setMobileOpen(false);

    return (
        <nav className="navbar">
            <div className="container">
                <Link to="/" className="navbar-logo" onClick={closeMobile}>
                    Sole<span>Store</span> 👟
                </Link>

                <button
                    className="navbar-mobile-toggle"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? '✕' : '☰'}
                </button>

                <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
                    <Link
                        to="/products"
                        className={isActive('/products') ? 'active' : ''}
                        onClick={closeMobile}
                    >
                        Products
                    </Link>

                    <Link
                        to="/cart"
                        className={`nav-cart ${isActive('/cart') ? 'active' : ''}`}
                        onClick={closeMobile}
                    >
                        Cart
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <span className="nav-user-name">Hi, {user?.name?.split(' ')[0]}</span>
                            <button className="nav-logout" onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className={isActive('/login') ? 'active' : ''}
                                onClick={closeMobile}
                            >
                                Login
                            </Link>
                            <Link to="/register" onClick={closeMobile}>
                                <button className="btn btn-primary btn-sm">Sign Up</button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
