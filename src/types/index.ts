export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  creationAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  images: string[];
  category: Category;
  creationAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type SortOption = 'price-asc' | 'price-desc' | 'title-asc' | 'title-desc';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface Address {
  fullName: string;
  phone: string;
  pincode: string;
  addressLine: string;
  city: string;
  state: string;
}

export type PaymentMethod = 'upi' | 'card' | 'cod' | 'netbanking';

export interface Order {
  id: string;
  userId: string | null;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  address: Address;
  paymentMethod: PaymentMethod;
  status: 'confirmed' | 'shipped' | 'delivered';
  createdAt: string;
}

export interface CheckoutDraft {
  address: Address;
  email: string;
}
