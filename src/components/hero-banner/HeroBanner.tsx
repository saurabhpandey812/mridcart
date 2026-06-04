import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './HeroBanner.css';

const LINES = ['LOOK CHIC', 'FEEL CHAP', 'BE CHICO'];

export function HeroBanner() {
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLineIndex((i) => (i + 1) % LINES.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="hero" className="hero-luxury" aria-label="New arrivals">
      <div className="hero-luxury-bg" />
      <div className="hero-luxury-overlay" />

      <div className="hero-luxury-content">
        <p className="hero-luxury-eyebrow">New Arrivals Only</p>
        <h1 className="hero-luxury-title serif">
          <span className="hero-line" key={lineIndex}>
            {LINES[lineIndex]}
          </span>
        </h1>
        <p className="hero-luxury-desc">
          Curated modern fashion — crafted for those who define elegance on their own terms.
        </p>
        <div className="hero-luxury-actions">
          <Link to="/shop" className="btn-luxury btn-luxury--light">
            Shop Collection
          </Link>
          <Link to="/categories" className="btn-luxury btn-luxury--outline">
            Explore Categories
          </Link>
        </div>
      </div>

      <div className="hero-luxury-scroll" aria-hidden="true">
        <span>Scroll</span>
        <span className="hero-scroll-line" />
      </div>
    </section>
  );
}
