import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { scrollToSection } from '../utils/scrollToSection';
import { fetchCategories } from '../api/categories';
import { BRAND } from '../config/brand';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import type { Category } from '../types';
import { getCategoryPath, parseCategoryRouteId } from '../utils/categoryRoutes';
import './Layout.css';

const NAV_CATEGORY_LIMIT = 6;

export function Layout() {
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [navCategories, setNavCategories] = useState<Category[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleBrandClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setMenuOpen(false);
    const needsNav = location.pathname !== '/';
    if (needsNav) {
      navigate('/');
    }
    scrollToSection('hero', needsNav ? 200 : 0);
  };

  const activeCategoryId = parseCategoryRouteId(location.pathname);

  useEffect(() => {
    fetchCategories()
      .then((data) => setNavCategories(data.slice(0, NAV_CATEGORY_LIMIT)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="layout">
      <header className="site-header">
        <div className="header-bar">
          <button
            type="button"
            className="header-menu-btn"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
            <span />
          </button>

          <Link to="/" className="brand" title={BRAND.name} onClick={handleBrandClick}>
            <img src={BRAND.logo} alt={BRAND.logoAlt} className="brand-logo" />
          </Link>

          <nav
            className={`header-nav ${menuOpen ? 'open' : ''}`}
            aria-label="Categories"
          >
            {navCategories.length === 0 ? (
              <span className="nav-loading">Loading…</span>
            ) : (
              navCategories.map((cat) => (
                <Link
                  key={cat.id}
                  to={getCategoryPath(cat.id)}
                  className={`nav-cat-btn ${
                    activeCategoryId === cat.id ? 'active' : ''
                  }`}
                  title={`Shop ${cat.name}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))
            )}
          </nav>

          <div className="header-actions">
            <Link
              to={isAuthenticated ? '/profile' : '/login'}
              className="header-icon-btn"
              title="Account"
              aria-label="Account"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
              </svg>
            </Link>
            <Link to="/wishlist" className="header-icon-btn" title="Wishlist" aria-label="Wishlist">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6C19 16.5 12 21 12 21z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="header-badge">{wishlistCount}</span>
              )}
            </Link>
            <Link to="/cart" className="header-icon-btn" title="Bag" aria-label="Bag">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M6 6h15l-1.5 9h-12L6 6z" />
                <path d="M6 6L5 3H2" />
                <circle cx="9" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
              {itemCount > 0 && <span className="header-badge">{itemCount}</span>}
            </Link>
          </div>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="footer-wrap">
          <img src={BRAND.logo} alt={BRAND.logoAlt} className="footer-logo" />
          <p className="footer-copy">
            © {new Date().getFullYear()}{' '}
            <a href={BRAND.website} target="_blank" rel="noopener noreferrer">
              {BRAND.name}
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
