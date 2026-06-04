import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import type { Address, CheckoutDraft } from '../../types';
import { calcDeliveryFee } from '../../utils/checkout';
import { FIELD_LIMITS } from '../../utils/fieldLimits';
import { normalizePhoneInput, validatePhone } from '../../utils/phoneValidation';
import { validateEmail } from '../../utils/authValidation';
import '../../styles/commerce.css';
import './CheckoutPage.css';

const emptyAddress: Address = {
  fullName: '',
  phone: '',
  pincode: '',
  addressLine: '',
  city: '',
  state: '',
};

export function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState(user?.email ?? '');
  const [address, setAddress] = useState<Address>({
    ...emptyAddress,
    fullName: user?.name ?? '',
    phone: user?.phone ?? '',
  });
  const [error, setError] = useState('');

  const deliveryFee = calcDeliveryFee(totalPrice);
  const orderTotal = totalPrice + deliveryFee;

  if (items.length === 0) {
    return (
      <section className="commerce-page">
        <h1>Checkout</h1>
        <p className="commerce-subtitle">Your bag is empty.</p>
        <Link to="/" className="btn-primary">
          Shop now
        </Link>
      </section>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }
    const phoneError = validatePhone(address.phone);
    if (phoneError) {
      setError(phoneError);
      return;
    }
    const draft: CheckoutDraft = {
      email: email.trim(),
      address: { ...address, phone: normalizePhoneInput(address.phone) },
    };
    navigate('/payment', { state: { draft } });
  };

  return (
    <section className="commerce-page commerce-page--wide checkout-page" aria-labelledby="checkout-heading">
      <div className="checkout-steps">
        <span className="checkout-step done">Bag</span>
        <span className="checkout-step active">Address</span>
        <span className="checkout-step">Payment</span>
      </div>

      <h1 id="checkout-heading">Checkout</h1>
      <p className="commerce-subtitle">Enter delivery details</p>

      <div className="checkout-layout">
        <form className="checkout-form commerce-card form-grid" onSubmit={handleSubmit}>
          {error && <p className="form-error" role="alert">{error}</p>}

          <div className="form-field">
            <label htmlFor="checkout-email">Email</label>
            <input
              id="checkout-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={FIELD_LIMITS.email.max}
            />
          </div>

          <div className="form-grid form-grid--2">
            <div className="form-field">
              <label htmlFor="fullName">Full name</label>
              <input
                id="fullName"
                required
                value={address.fullName}
                onChange={(e) =>
                  setAddress({ ...address, fullName: e.target.value })
                }
                maxLength={FIELD_LIMITS.name.max}
                minLength={FIELD_LIMITS.name.min}
              />
            </div>
            <div className="form-field">
              <label htmlFor="phone">Phone (10 digits)</label>
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                required
                value={address.phone}
                onChange={(e) =>
                  setAddress({
                    ...address,
                    phone: normalizePhoneInput(e.target.value),
                  })
                }
                maxLength={FIELD_LIMITS.phone.max}
                minLength={FIELD_LIMITS.phone.min}
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="addressLine">Address</label>
            <textarea
              id="addressLine"
              rows={3}
              required
              value={address.addressLine}
              onChange={(e) =>
                setAddress({ ...address, addressLine: e.target.value })
              }
              maxLength={FIELD_LIMITS.addressLine.max}
            />
          </div>

          <div className="form-grid form-grid--2">
            <div className="form-field">
              <label htmlFor="city">City</label>
              <input
                id="city"
                required
                value={address.city}
                onChange={(e) =>
                  setAddress({ ...address, city: e.target.value })
                }
                maxLength={FIELD_LIMITS.city.max}
              />
            </div>
            <div className="form-field">
              <label htmlFor="state">State</label>
              <input
                id="state"
                required
                value={address.state}
                onChange={(e) =>
                  setAddress({ ...address, state: e.target.value })
                }
                maxLength={FIELD_LIMITS.state.max}
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="pincode">Pincode</label>
            <input
              id="pincode"
              type="text"
              inputMode="numeric"
              required
              pattern="[0-9]{6}"
              value={address.pincode}
              onChange={(e) =>
                setAddress({
                  ...address,
                  pincode: e.target.value.replace(/\D/g, '').slice(0, FIELD_LIMITS.pincode.max),
                })
              }
              maxLength={FIELD_LIMITS.pincode.max}
              minLength={FIELD_LIMITS.pincode.min}
            />
          </div>

          <button type="submit" className="btn-primary">
            Continue to payment
          </button>
        </form>

        <aside className="checkout-summary commerce-card">
          <h2>Order summary</h2>
          <ul className="checkout-items">
            {items.map((item) => (
              <li key={item.product.id}>
                <span>{item.product.title.slice(0, 28)}… × {item.quantity}</span>
                <span>₹{(item.product.price * item.quantity).toFixed(0)}</span>
              </li>
            ))}
          </ul>
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
        </aside>
      </div>
    </section>
  );
}
