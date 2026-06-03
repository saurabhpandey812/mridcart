import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { calcDeliveryFee } from '../utils/checkout';
import '../styles/commerce.css';
import './CartPage.css';

export function CartPage() {
  const {
    items,
    itemCount,
    totalPrice,
    removeFromCart,
    removeLineItem,
    updateQuantity,
    clearCart,
  } = useCart();

  const deliveryFee = calcDeliveryFee(totalPrice);
  const orderTotal = totalPrice + deliveryFee;

  if (items.length === 0) {
    return (
      <section className="commerce-page cart-page empty-cart" aria-labelledby="cart-heading">
        <h1 id="cart-heading">Your Bag</h1>
        <p className="commerce-subtitle">Your bag is empty.</p>
        <Link to="/" className="btn-primary">
          Continue Shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="commerce-page commerce-page--wide cart-page" aria-labelledby="cart-heading">
      <header className="cart-header">
        <div>
          <h1 id="cart-heading">Your Bag</h1>
          <p className="commerce-subtitle">{itemCount} items</p>
        </div>
        <button type="button" className="btn-text" onClick={clearCart}>
          Clear bag
        </button>
      </header>

      <div className="cart-layout">
        <ul className="cart-list">
          {items.map((item) => {
            const thumb =
              item.product.images[0] ?? 'https://placehold.co/80x80';
            return (
              <li key={item.product.id} className="cart-item">
                <img src={thumb} alt="" className="cart-item-thumb" />
                <div className="cart-item-info">
                  <Link to={`/product/${item.product.id}`}>
                    {item.product.title}
                  </Link>
                  <p className="cart-item-brand">{item.product.category.name}</p>
                  <p className="cart-item-price">₹{item.product.price.toFixed(0)}</p>
                  <div className="qty-controls">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="cart-item-right">
                  <p className="cart-item-total">
                    ₹{(item.product.price * item.quantity).toFixed(0)}
                  </p>
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => removeLineItem(item.product.id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="cart-summary commerce-card">
          <h2>Price details</h2>
          <div className="order-summary-row">
            <span>Subtotal</span>
            <span>₹{totalPrice.toFixed(0)}</span>
          </div>
          <div className="order-summary-row">
            <span>Delivery</span>
            <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
          </div>
          <div className="order-summary-row total">
            <span>Total</span>
            <span>₹{orderTotal.toFixed(0)}</span>
          </div>
          <Link to="/checkout" className="btn-primary cart-checkout-btn">
            Place Order
          </Link>
          <Link to="/" className="btn-secondary cart-continue-btn">
            Continue Shopping
          </Link>
        </aside>
      </div>
    </section>
  );
}
