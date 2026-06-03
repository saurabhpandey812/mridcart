import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchProductById } from '../api/products';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import type { Product } from '../types';
import '../styles/commerce.css';
import './ProductDetailPage.css';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const productId = parseInt(id ?? '', 10);
    if (Number.isNaN(productId)) {
      setError('Invalid product ID');
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    fetchProductById(productId)
      .then((data) => {
        if (!cancelled) setProduct(data);
      })
      .catch(() => {
        if (!cancelled) setError('Product not found');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, 1);
    navigate('/checkout');
  };

  if (loading) return <LoadingSpinner />;

  if (error || !product) {
    return (
      <section className="commerce-page pdp-page">
        <p role="alert">{error ?? 'Product not found'}</p>
        <Link to="/" className="btn-primary">
          Back to Shop
        </Link>
      </section>
    );
  }

  const image = product.images[0] ?? 'https://placehold.co/800x1000';
  const mrp = Math.round(product.price * 1.4);
  const inWishlist = isInWishlist(product.id);

  return (
    <article className="pdp-page" aria-labelledby="product-title">
      <nav className="pdp-breadcrumb">
        <Link to="/">← Back to collection</Link>
      </nav>

      <div className="pdp-grid">
        <div className="pdp-gallery">
          <img src={image} alt={product.title} />
        </div>
        <div className="pdp-info">
          <p className="pdp-brand">{product.category.name}</p>
          <h1 id="product-title" className="pdp-title serif">
            {product.title}
          </h1>
          <div className="pdp-prices">
            <span className="pdp-price">₹{product.price.toFixed(0)}</span>
            <span className="pdp-mrp">₹{mrp}</span>
          </div>
          <p className="pdp-desc">{product.description}</p>

          <div className="pdp-actions">
            <button
              type="button"
              className={`btn-primary ${added ? 'added' : ''}`}
              onClick={handleAddToCart}
            >
              {added ? 'Added ✓' : 'Add to Bag'}
            </button>
            <button type="button" className="btn-secondary" onClick={handleBuyNow}>
              Buy Now
            </button>
            <button
              type="button"
              className={`btn-wishlist-pdp ${inWishlist ? 'active' : ''}`}
              onClick={() => toggleWishlist(product)}
            >
              {inWishlist ? '♥ Saved' : '♡ Wishlist'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
