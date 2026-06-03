import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateName } from '../utils/authValidation';
import { FIELD_LIMITS } from '../utils/fieldLimits';
import { normalizePhoneInput, validatePhone } from '../utils/phoneValidation';
import '../styles/commerce.css';
import './ProfilePage.css';

export function ProfilePage() {
  const { user, isAuthenticated, orders, logout, updateProfile } = useAuth();
  const [tab, setTab] = useState<'profile' | 'orders'>('profile');
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [saved, setSaved] = useState(false);
  const [formError, setFormError] = useState('');

  if (!isAuthenticated || !user) {
    return (
      <section className="commerce-page" aria-labelledby="profile-heading">
        <h1 id="profile-heading">My Profile</h1>
        <p className="commerce-subtitle">
          Login to manage your profile and view order history.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/login" className="btn-primary">
            Login
          </Link>
          <Link to="/register" className="btn-secondary">
            Sign Up
          </Link>
        </div>
      </section>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const nameError = validateName(name);
    const phoneError = validatePhone(phone);
    if (nameError || phoneError) {
      setFormError(nameError ?? phoneError ?? '');
      return;
    }
    setFormError('');
    updateProfile({
      name: name.trim(),
      phone: normalizePhoneInput(phone),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <section className="commerce-page commerce-page--wide profile-page" aria-labelledby="profile-heading">
      <header className="profile-top">
        <div>
          <h1 id="profile-heading">Hello, {user.name.split(' ')[0]}</h1>
          <p className="commerce-subtitle">{user.email}</p>
        </div>
        <button type="button" className="btn-secondary" onClick={logout}>
          Logout
        </button>
      </header>

      <div className="profile-tabs">
        <button
          type="button"
          className={`profile-tab ${tab === 'profile' ? 'active' : ''}`}
          onClick={() => setTab('profile')}
        >
          Profile
        </button>
        <button
          type="button"
          className={`profile-tab ${tab === 'orders' ? 'active' : ''}`}
          onClick={() => setTab('orders')}
        >
          Orders ({orders.length})
        </button>
      </div>

      {tab === 'profile' && (
        <form className="commerce-card form-grid" onSubmit={handleSave}>
          {formError && (
            <p className="form-error" role="alert">
              {formError}
            </p>
          )}
          <div className="form-field">
            <label htmlFor="profile-name">Full name</label>
            <input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={FIELD_LIMITS.name.max}
              minLength={FIELD_LIMITS.name.min}
            />
          </div>
          <div className="form-field">
            <label htmlFor="profile-email">Email</label>
            <input id="profile-email" value={user.email} disabled />
          </div>
          <div className="form-field">
            <label htmlFor="profile-phone">Phone (10 digits)</label>
            <input
              id="profile-phone"
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(normalizePhoneInput(e.target.value))}
              required
              maxLength={FIELD_LIMITS.phone.max}
              minLength={FIELD_LIMITS.phone.min}
            />
          </div>
          <button type="submit" className="btn-primary">
            {saved ? 'Saved ✓' : 'Save changes'}
          </button>
        </form>
      )}

      {tab === 'orders' && (
        <div className="orders-list">
          {orders.length === 0 ? (
            <div className="commerce-card">
              <p>No orders yet.</p>
              <Link to="/" className="btn-primary" style={{ marginTop: '1rem' }}>
                Start shopping
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <article key={order.id} className="commerce-card order-card">
                <div className="order-card-head">
                  <div>
                    <p className="order-id">Order #{order.id.slice(-8).toUpperCase()}</p>
                    <p className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <span className="order-status">{order.status}</span>
                </div>
                <p className="order-items">
                  {order.items.length} item(s) · ₹{order.total.toFixed(0)}
                </p>
                <p className="order-pay">
                  Paid via {order.paymentMethod.toUpperCase()}
                </p>
              </article>
            ))
          )}
        </div>
      )}
    </section>
  );
}
