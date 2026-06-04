import { API_BASE_URL } from './config';
import type { Product } from '../types';

export async function fetchProductById(id: number): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!response.ok) {
    throw new Error('Product not found');
  }
  return response.json();
}

function buildQuery(params: Record<string, string | number>): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    search.set(key, String(value));
  });
  return search.toString();
}

export async function fetchAllProducts(title?: string): Promise<Product[]> {
  const query = buildQuery({
    limit: 100,
    ...(title ? { title } : {}),
  });
  const response = await fetch(`${API_BASE_URL}/products?${query}`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
}

export async function fetchProductsByCategoryId(
  categoryId: number,
  title?: string
): Promise<Product[]> {
  const query = buildQuery({
    categoryId,
    limit: 100,
    ...(title ? { title } : {}),
  });
  const response = await fetch(`${API_BASE_URL}/products?${query}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch products for category ${categoryId}`);
  }
  return response.json();
}

export async function fetchProductsForCategories(
  categoryIds: number[],
  title?: string
): Promise<Product[]> {
  if (categoryIds.length === 0) {
    return fetchAllProducts(title);
  }

  if (categoryIds.length === 1) {
    return fetchProductsByCategoryId(categoryIds[0], title);
  }

  const results = await Promise.all(
    categoryIds.map((id) => fetchProductsByCategoryId(id, title))
  );

  const seen = new Set<number>();
  const merged: Product[] = [];

  for (const list of results) {
    for (const product of list) {
      if (!seen.has(product.id)) {
        seen.add(product.id);
        merged.push(product);
      }
    }
  }

  return merged;
}
