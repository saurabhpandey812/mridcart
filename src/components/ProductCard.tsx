import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import type { Product } from '../types';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const wishlisted = isInWishlist(product.id);
  const thumbnail = product.images[0] ?? 'https://placehold.co/500x650/1a1a1a/eee?text=CHICCHAPS';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <article className="product-luxury">
      <Link to={`/product/${product.id}`} className="product-luxury-link">
        <div className="product-luxury-media">
          <img src={thumbnail} alt={product.title} loading="lazy" />
          <div className="product-luxury-actions">
            <button
              type="button"
              className={`product-luxury-wish ${wishlisted ? 'active' : ''}`}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(product);
              }}
            >
              {wishlisted ? '♥' : '♡'}
            </button>
            <button
              type="button"
              className="product-luxury-cart"
              onClick={handleQuickAdd}
            >
              Quick Add
            </button>
          </div>
        </div>
        <div className="product-luxury-info">
          <p className="product-luxury-brand">{product.category.name}</p>
          <h3 className="product-luxury-title">{product.title}</h3>
          <p className="product-luxury-price">₹{product.price.toFixed(0)}</p>
        </div>
      </Link>
    </article>
  );
}
