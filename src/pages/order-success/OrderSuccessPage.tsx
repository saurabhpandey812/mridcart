import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/commerce.css';
import './OrderSuccessPage.css';

export function OrderSuccessPage() {
  const location = useLocation();
  const orderId = (location.state as { orderId?: string } | null)?.orderId;

  return (
    <section className="commerce-page order-success" aria-labelledby="success-heading">
      <div className="commerce-card" style={{ textAlign: 'center', padding: '2rem' }}>
        <p className="success-icon" aria-hidden="true">
          ✓
        </p>
        <h1 id="success-heading">Order placed!</h1>
        <p className="commerce-subtitle">
          Thank you for shopping with ShopEase.
          {orderId && (
            <>
              <br />
              Order ID: <strong>{orderId.slice(-12).toUpperCase()}</strong>
            </>
          )}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
          <Link to="/profile" className="btn-primary">
            View orders
          </Link>
          <Link to="/" className="btn-secondary">
            Continue shopping
          </Link>
        </div>
      </div>
    </section>
  );
}
