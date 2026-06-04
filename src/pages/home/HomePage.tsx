import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { scrollToSection } from '../../utils/scrollToSection';
import { AboutSection } from '../../components/about/AboutSection';
import { CategoryShowcase } from '../../components/category-showcase/CategoryShowcase';
import { FeaturedCollection } from '../../components/featured-collection/FeaturedCollection';
import { HeroBanner } from '../../components/hero-banner/HeroBanner';
import { TestimonialsSection } from '../../components/testimonials/TestimonialsSection';
import { fetchCategories } from '../../api/categories';
import { fetchProductsForCategories } from '../../api/products';
import { ProductCard } from '../../components/product-card/ProductCard';
import { LoadingSpinner } from '../../components/loading-spinner/LoadingSpinner';
import type { Category, Product, SortOption } from '../../types';
import { sortProducts } from '../../utils/sortProducts';
import { parseCategoryIds, parseSort } from '../../utils/urlParams';
import './HomePage.css';

export type HomeScrollTarget = 'products' | 'categories';

interface HomePageProps {
  scrollTo?: HomeScrollTarget;
}

export function HomePage({ scrollTo }: HomePageProps) {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoriesParam = searchParams.get('categories') ?? '';
  const sortParam = searchParams.get('sort');
  const searchQuery = searchParams.get('q') ?? '';

  const selectedCategories = useMemo(
    () => parseCategoryIds(categoriesParam || null),
    [categoriesParam]
  );
  const sort = useMemo(() => parseSort(sortParam), [sortParam]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activeCategoryLabel = useMemo(() => {
    if (selectedCategories.length === 1) {
      return categories.find((c) => c.id === selectedCategories[0])?.name;
    }
    return null;
  }, [selectedCategories, categories]);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setError('Could not load categories'));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const categoryIds = parseCategoryIds(categoriesParam || null);
    const titleFilter = searchQuery.trim() || undefined;

    fetchProductsForCategories(categoryIds, titleFilter)
      .then((data) => {
        if (!cancelled) setProducts(sortProducts(data, sort));
      })
      .catch(() => {
        if (!cancelled) setError('Could not load products');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [categoriesParam, sort, searchQuery]);

  useEffect(() => {
    const hashTarget = location.hash.replace('#', '') as HomeScrollTarget;
    const target = scrollTo || hashTarget;
    if (target !== 'products' && target !== 'categories') return;

    const delay = target === 'products' && loading ? 350 : 150;
    const timer = window.setTimeout(() => scrollToSection(target, 0), delay);
    return () => window.clearTimeout(timer);
  }, [scrollTo, location.hash, loading]);

  const updateUrl = useCallback(
    (newCategories: number[], newSort: SortOption) => {
      const params = new URLSearchParams(searchParams);
      if (newCategories.length > 0) params.set('categories', newCategories.join(','));
      else params.delete('categories');
      if (newSort !== 'title-asc') params.set('sort', newSort);
      else params.delete('sort');
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  return (
    <div className="home-page">
      <HeroBanner />
      <CategoryShowcase categories={categories} />
      <FeaturedCollection />

      <section className="products-luxury" id="products" aria-labelledby="products-heading">
        <div className="section-wrap">
          <header className="section-head">
            <h2 id="products-heading" className="section-head-title serif">
              {activeCategoryLabel || searchQuery
                ? activeCategoryLabel || `Results: ${searchQuery}`
                : 'Featured Products'}
            </h2>
            <span className="section-head-line" />
            {!loading && products.length > 0 && (
              <p className="products-count">{products.length} pieces</p>
            )}
          </header>

          <div className="products-toolbar">
            <p className="products-toolbar-hint">
              {activeCategoryLabel
                ? `Category: ${activeCategoryLabel}`
                : 'Browse all products or pick a category above'}
            </p>
            <select
              className="sort-select"
              value={sort}
              onChange={(e) =>
                updateUrl(selectedCategories, e.target.value as SortOption)
              }
              aria-label="Sort products"
            >
              <option value="title-asc">Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="title-desc">Newest</option>
            </select>
          </div>

          {loading && <LoadingSpinner />}
          {error && <p className="products-error" role="alert">{error}</p>}
          {!loading && !error && products.length === 0 && (
            <p className="products-empty">No products found.</p>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="product-grid-luxury">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <AboutSection />
      <TestimonialsSection />
    </div>
  );
}
