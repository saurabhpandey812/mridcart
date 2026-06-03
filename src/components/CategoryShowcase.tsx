import React from 'react';
import { Link } from 'react-router-dom';
import type { Category } from '../types';
import { getCategoryPath } from '../utils/categoryRoutes';
import { getCategoryImageUrl } from '../utils/categoryImage';
import './CategoryShowcase.css';

interface CategoryShowcaseProps {
  categories: Category[];
}

export function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  if (categories.length === 0) return null;

  const display = categories.slice(0, 6);

  return (
    <section className="category-showcase" id="categories" aria-labelledby="cat-heading">
      <div className="section-wrap">
        <header className="section-head">
          <h2 id="cat-heading" className="section-head-title serif">
            Shop by Category
          </h2>
          <span className="section-head-line" />
        </header>

        <div className="category-grid">
          {display.map((cat, index) => (
            <article key={cat.id} className="category-card-wrap">
              <Link
                to={getCategoryPath(cat.id)}
                className="category-card"
              >
                <img
                  src={getCategoryImageUrl(cat.id, cat.image, 'card')}
                  alt={cat.name}
                  className="category-card-img"
                  loading="lazy"
                />
                <div className="category-card-overlay" />
                <div className="category-card-content">
                  <span className="category-card-index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="category-card-name serif">{cat.name}</h3>
                  <span className="category-card-cta">Shop now →</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
