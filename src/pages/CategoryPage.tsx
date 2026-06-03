import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { fetchCategoryById } from '../api/categories';
import { fetchProductsByCategoryId } from '../api/products';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ProductCard } from '../components/ProductCard';
import type { Category, Product, SortOption } from '../types';
import { sortProducts } from '../utils/sortProducts';
import { parseSort } from '../utils/urlParams';
import { getCategoryImageUrl } from '../utils/categoryImage';
import './CategoryPage.css';

export function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = parseInt(id ?? '', 10);

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sort = useMemo(() => parseSort(searchParams.get('sort')), [searchParams]);

  useEffect(() => {
    if (Number.isNaN(categoryId)) {
      setError('Invalid category');
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      fetchCategoryById(categoryId),
      fetchProductsByCategoryId(categoryId),
    ])
      .then(([cat, list]) => {
        if (!cancelled) {
          setCategory(cat);
          setProducts(sortProducts(list, sort));
        }
      })
      .catch(() => {
        if (!cancelled) setError('Could not load this category');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [categoryId, sort]);

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as SortOption;
    const params = new URLSearchParams(searchParams);
    if (value !== 'title-asc') params.set('sort', value);
    else params.delete('sort');
    setSearchParams(params);
  };

  if (Number.isNaN(categoryId)) {
    return (
      <div className="category-page-empty">
        <p>Invalid category.</p>
        <Link to="/" className="btn-primary">
          Back to home
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="category-page-loading">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="category-page-empty">
        <p role="alert">{error ?? 'Category not found'}</p>
        <Link to="/" className="btn-primary">
          Back to home
        </Link>
      </div>
    );
  }

  const heroImage = getCategoryImageUrl(category.id, category.image, 'hero');

  return (
    <div className="category-page">
      <section className="category-hero" aria-labelledby="category-hero-title">
        <img
          src={heroImage}
          alt=""
          className="category-hero-bg"
        />
        <div className="category-hero-overlay" />
        <div className="category-hero-content">
          <Link to="/categories" className="category-hero-back">
            ← All categories
          </Link>
          <p className="category-hero-label">Collection</p>
          <h1 id="category-hero-title" className="category-hero-title serif">
            {category.name}
          </h1>
          <p className="category-hero-sub">
            Explore our curated {category.name.toLowerCase()} selection
          </p>
          <span className="category-hero-count">
            {products.length} products available
          </span>
        </div>
      </section>

      <section className="category-products" aria-labelledby="category-products-heading">
        <div className="section-wrap">
          <header className="category-products-head">
            <h2 id="category-products-heading" className="serif">
              Shop {category.name}
            </h2>
            <select
              className="sort-select"
              value={sort}
              onChange={handleSort}
              aria-label="Sort products"
            >
              <option value="title-asc">Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="title-desc">Newest</option>
            </select>
          </header>

          {products.length === 0 ? (
            <p className="category-products-empty">
              No products in this category right now.
            </p>
          ) : (
            <div className="product-grid-luxury">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
