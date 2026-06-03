import React from 'react';
import { Link } from 'react-router-dom';
import './FeaturedCollection.css';

export function FeaturedCollection() {
  return (
    <section className="featured-collection" aria-label="Featured collection">
      <div className="featured-collection-media">
        <div
          className="featured-collection-bg"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80')",
          }}
        />
        <div className="featured-collection-overlay" />
      </div>
      <div className="featured-collection-content section-wrap">
        <p className="featured-eyebrow">Featured Collection</p>
        <h2 className="featured-title serif">The Art of Modern Dressing</h2>
        <p className="featured-text">
          Discover pieces that blend timeless silhouettes with contemporary edge —
          designed for the bold and the refined.
        </p>
        <Link to="/shop" className="btn-luxury btn-luxury--dark">
          View Collection
        </Link>
      </div>
    </section>
  );
}
