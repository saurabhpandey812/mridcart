import React from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../../components/product-card/ProductCard';
import { useWishlist } from '../../context/WishlistContext';
import '../../styles/commerce.css';
import './WishlistPage.css';

export function WishlistPage() {
  const { items, clearWishlist } = useWishlist();

  if (items.length === 0) {
    return (
      <section className="commerce-page wishlist-page" aria-labelledby="wishlist-heading">
        <h1 id="wishlist-heading">My Wishlist</h1>
        <p className="commerce-subtitle">Save items you love — tap ♡ on any product.</p>
        <Link to="/" className="btn-primary">
          Browse Products
        </Link>
      </section>
    );
  }

  return (
    <section className="commerce-page commerce-page--wide wishlist-page" aria-labelledby="wishlist-heading">
      <header className="wishlist-header">
        <div>
          <h1 id="wishlist-heading">My Wishlist</h1>
          <p className="commerce-subtitle">{items.length} saved items</p>
        </div>
        <button type="button" className="btn-text" onClick={clearWishlist}>
          Clear wishlist
        </button>
      </header>
      <div className="wishlist-grid">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
