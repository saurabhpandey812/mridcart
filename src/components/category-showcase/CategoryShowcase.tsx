import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Category } from '../../types';
import { getCategoryPath } from '../../utils/categoryRoutes';
import { getCategoryImageUrl } from '../../utils/mediaUrl';
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
            <CategoryCard key={cat.id} category={cat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({
  category: cat,
  index,
}: {
  category: Category;
  index: number;
}) {
  const fallbackSrc = getCategoryImageUrl(cat.id, cat.image, 'card');
  const [imageSrc, setImageSrc] = useState(fallbackSrc);

  useEffect(() => {
    setImageSrc(getCategoryImageUrl(cat.id, cat.image, 'card'));
  }, [cat.id, cat.image]);

  return (
    <article className="category-card-wrap">
      <Link to={getCategoryPath(cat.id)} className="category-card">
        <img
          src={imageSrc}
          alt={cat.name}
          className="category-card-img"
          loading="lazy"
          onError={() => {
            if (imageSrc !== fallbackSrc) setImageSrc(fallbackSrc);
          }}
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
  );
}
