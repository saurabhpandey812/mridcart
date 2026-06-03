import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import type { CheckoutDraft, PaymentMethod } from '../types';
import { calcDeliveryFee } from '../utils/checkout';
import '../styles/commerce.css';

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; desc: string }[] = [
  { id: 'upi', label: 'UPI', desc: 'GPay, PhonePe, Paytm' },
  { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', label: 'Net Banking', desc: 'All major banks' },
  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive' },
];

export function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { placeOrder } = useAuth();

  const draft = (location.state as { draft?: CheckoutDraft } | null)?.draft;
  const [method, setMethod] = useState<PaymentMethod>('upi');
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');

  const deliveryFee = calcDeliveryFee(totalPrice);
  const orderTotal = totalPrice + deliveryFee;

  if (!draft || items.length === 0) {
    return (
      <section className="commerce-page">
        <h1>Payment</h1>
        <p className="commerce-subtitle">Please complete checkout first.</p>
        <Link to="/checkout" className="btn-primary">
          Go to checkout
        </Link>
      </section>
    );
  }

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (method === 'card' && cardNumber.replace(/\s/g, '').length < 12) {
      return;
    }
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1200));

    const order = placeOrder({
      items: [...items],
      subtotal: totalPrice,
      deliveryFee,
      total: orderTotal,
      address: draft.address,
      paymentMethod: method,
    });

    clearCart();
    navigate('/order-success', { state: { orderId: order.id }, replace: true });
  };

  return (
    <section className="commerce-page commerce-page--wide" aria-labelledby="payment-heading">
      <div className="checkout-steps">
        <span className="checkout-step done">Bag</span>
        <span className="checkout-step done">Address</span>
        <span className="checkout-step active">Payment</span>
      </div>

      <h1 id="payment-heading">Payment</h1>
      <p className="commerce-subtitle">
        Delivering to {draft.address.city}, {draft.address.pincode}
      </p>

      <form className="commerce-card" onSubmit={handlePay}>
        <div className="payment-options">
          {PAYMENT_OPTIONS.map((opt) => (
            <label key={opt.id} className="payment-option">
              <input
                type="radio"
                name="payment"
                value={opt.id}
                checked={method === opt.id}
                onChange={() => setMethod(opt.id)}
              />
              <div>
                <strong>{opt.label}</strong>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#94969f' }}>
                  {opt.desc}
                </p>
              </div>
            </label>
          ))}
        </div>

        {method === 'card' && (
          <div className="form-field" style={{ marginTop: '1rem' }}>
            <label htmlFor="card">Card number (demo)</label>
            <input
              id="card"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
            />
          </div>
        )}

        <div className="order-summary-row total" style={{ marginTop: '1.25rem' }}>
          <span>Amount payable</span>
          <span>₹{orderTotal.toFixed(0)}</span>
        </div>

        <button
          type="submit"
          className="btn-primary"
          style={{ width: '100%', marginTop: '1rem' }}
          disabled={processing}
        >
          {processing ? 'Processing…' : `Pay ₹${orderTotal.toFixed(0)}`}
        </button>
      </form>

      <Link to="/checkout" className="btn-text" style={{ display: 'inline-block', marginTop: '1rem' }}>
        ← Edit address
      </Link>
    </section>
  );
}
