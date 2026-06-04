import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { AppProviders } from './context/AppProviders';
import { CartPage } from './pages/cart/CartPage';
import { CheckoutPage } from './pages/checkout/CheckoutPage';
import { HomePage } from './pages/home/HomePage';
import { LoginPage, RegisterPage } from './pages/login/LoginPage';
import { OrderSuccessPage } from './pages/order-success/OrderSuccessPage';
import { PaymentPage } from './pages/payment/PaymentPage';
import { ProductDetailPage } from './pages/product-detail/ProductDetailPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { CategoryPage } from './pages/category/CategoryPage';
import { WishlistPage } from './pages/wishlist/WishlistPage';
import './styles/commerce.css';

function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="shop" element={<HomePage scrollTo="products" />} />
            <Route path="categories" element={<HomePage scrollTo="categories" />} />
            <Route path="category/:id" element={<CategoryPage />} />
            <Route path="product/:id" element={<ProductDetailPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="payment" element={<PaymentPage />} />
            <Route path="order-success" element={<OrderSuccessPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
