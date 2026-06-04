import React from 'react';
import { Link } from 'react-router-dom';
import './AboutSection.css';

export function AboutSection() {
  return (
    <section className="about-section" aria-labelledby="about-heading">
      <div className="section-wrap about-grid">
        <div className="about-image-wrap">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
            alt="Fashion craftsmanship"
            className="about-image"
            loading="lazy"
          />
        </div>
        <div className="about-content">
          <h2 id="about-heading" className="about-title serif">
            More Than Just Clothes
          </h2>
          <p>
            We believe fashion is a form of self-expression. Our collections are
            curated to empower you to tell your story, with quality pieces designed
            to last.
          </p>
          <p>
            From timeless classics to the latest trends, CHICCHAPS helps you build
            a wardrobe that is uniquely yours — inspired by luxury craft and modern
            ease.
          </p>
          <Link to="/shop" className="about-link">
            Learn more →
          </Link>
        </div>
      </div>
    </section>
  );
}
