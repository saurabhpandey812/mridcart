import { API_BASE_URL } from './config';
import type { Category } from '../types';

export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
}

export async function fetchCategoryById(id: number): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`);
  if (!response.ok) {
    throw new Error('Category not found');
  }
  return response.json();
}
