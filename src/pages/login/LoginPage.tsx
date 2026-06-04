import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { AuthField, AuthFieldErrors } from '../../utils/authValidation';
import {
  hasAuthErrors,
  validateAuthField,
  validateLoginForm,
  validateSignupForm,
} from '../../utils/authValidation';
import { FIELD_LIMITS } from '../../utils/fieldLimits';
import './LoginPage.css';

const AUTH_VIDEO =
  'https://image.hm.com/content/dam/global_campaigns/season_02/kids/start-page-assets/w29/KS32O-9x16-video-kids-start-page-prio-week-29.mp4';

type AuthMode = 'login' | 'signup';

interface LoginPageProps {
  initialMode?: AuthMode;
}

interface AuthFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  error?: string;
  autoComplete: string;
  maxLength: number;
  minLength?: number;
  onChange: (value: string) => void;
  onBlur: () => void;
}

function AuthVideo() {
  return (
    <video
      src={AUTH_VIDEO}
      autoPlay
      loop
      muted
      playsInline
      className="zara-auth-video"
    />
  );
}

function AuthFieldInput({
  id,
  label,
  type,
  value,
  error,
  autoComplete,
  maxLength,
  minLength,
  onChange,
  onBlur,
}: AuthFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className={`zara-auth-field ${error ? 'zara-auth-field--invalid' : ''}`}>
      <label htmlFor={id} className="zara-auth-label">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        autoComplete={autoComplete}
        maxLength={maxLength}
        minLength={minLength}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={error ? 'zara-auth-input-invalid' : undefined}
      />
      {error && (
        <p id={errorId} className="zara-auth-field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function LoginPage({ initialMode = 'login' }: LoginPageProps) {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [errors, setErrors] = useState<AuthFieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<AuthField, boolean>>>({});

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    if (location.pathname === '/register') {
      setMode('signup');
    } else if (location.pathname === '/login') {
      setMode('login');
    }
  }, [location.pathname]);

  const clearValidation = () => {
    setErrors({});
    setTouched({});
  };

  const goLogin = () => {
    setMode('login');
    clearValidation();
    if (location.pathname !== '/login') navigate('/login');
  };

  const goSignup = () => {
    setMode('signup');
    clearValidation();
    if (location.pathname !== '/register') navigate('/register');
  };

  const showToast = (message: string, isError = false) => {
    setToast(isError ? `error:${message}` : message);
    window.setTimeout(() => setToast(''), 2000);
  };

  const formValues = { name, email, password };

  const setFieldValue = (field: AuthField, value: string) => {
    if (field === 'name') setName(value);
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);

    if (touched[field]) {
      const next = {
        name: field === 'name' ? value : name,
        email: field === 'email' ? value : email,
        password: field === 'password' ? value : password,
      };
      const message = validateAuthField(field, next);
      setErrors((prev) => {
        const updated = { ...prev };
        if (message) updated[field] = message;
        else delete updated[field];
        return updated;
      });
    }
  };

  const markTouched = (field: AuthField) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const message = validateAuthField(field, formValues);
    setErrors((prev) => {
      const updated = { ...prev };
      if (message) updated[field] = message;
      else delete updated[field];
      return updated;
    });
  };

  const runValidation = (authMode: AuthMode): AuthFieldErrors => {
    if (authMode === 'login') {
      return validateLoginForm({ email, password });
    }
    return validateSignupForm({ name, email, password });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = runValidation('login');
    setErrors(validationErrors);
    setTouched({ email: true, password: true });
    if (hasAuthErrors(validationErrors)) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const ok = login(email.trim(), password);
    if (!ok) {
      showToast('Invalid email or password', true);
      setLoading(false);
      return;
    }

    showToast('Login successful!');
    setLoading(false);
    window.setTimeout(() => navigate('/profile'), 1200);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = runValidation('signup');
    setErrors(validationErrors);
    setTouched({ name: true, email: true, password: true });
    if (hasAuthErrors(validationErrors)) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const ok = register({
      name: name.trim(),
      email: email.trim(),
      phone: '',
      password,
    });

    if (!ok) {
      showToast('Email already registered', true);
      setLoading(false);
      return;
    }

    showToast('Signup successful!');
    setLoading(false);
    window.setTimeout(() => navigate('/profile'), 1200);
  };

  const toastMessage = toast.startsWith('error:') ? toast.slice(6) : toast;
  const toastIsError = toast.startsWith('error:');

  return (
    <div className={`zara-auth-root ${mode}`}>
      <div className="zara-auth-container">
        <div className="zara-auth-side zara-auth-image-side">
          <AuthVideo />
        </div>
        <div className="zara-auth-side zara-auth-form-side">
          {mode === 'login' ? (
            <form
              className="zara-auth-form"
              onSubmit={handleLogin}
              noValidate
            >
              <h1>Login</h1>
              <AuthFieldInput
                id="login-email"
                label="Email address"
                type="email"
                value={email}
                error={touched.email ? errors.email : undefined}
                autoComplete="email"
                maxLength={FIELD_LIMITS.email.max}
                onChange={(v) => setFieldValue('email', v)}
                onBlur={() => markTouched('email')}
              />
              <AuthFieldInput
                id="login-password"
                label="Password"
                type="password"
                value={password}
                error={touched.password ? errors.password : undefined}
                autoComplete="current-password"
                maxLength={FIELD_LIMITS.password.max}
                minLength={FIELD_LIMITS.password.min}
                onChange={(v) => setFieldValue('password', v)}
                onBlur={() => markTouched('password')}
              />
              <button type="submit" disabled={loading}>
                {loading ? (
                  <span className="zara-auth-spinner" aria-hidden />
                ) : (
                  'Login'
                )}
              </button>
              <div className="zara-auth-switch">
                Don&apos;t have an account?{' '}
                <button type="button" onClick={goSignup}>
                  Sign Up
                </button>
              </div>
              <p className="zara-auth-guest">
                <Link to="/">Continue as guest</Link>
              </p>
            </form>
          ) : (
            <form
              className="zara-auth-form"
              onSubmit={handleSignup}
              noValidate
            >
              <h1>Sign Up</h1>
              <AuthFieldInput
                id="signup-name"
                label="Your name"
                type="text"
                value={name}
                error={touched.name ? errors.name : undefined}
                autoComplete="name"
                maxLength={FIELD_LIMITS.name.max}
                minLength={FIELD_LIMITS.name.min}
                onChange={(v) => setFieldValue('name', v)}
                onBlur={() => markTouched('name')}
              />
              <AuthFieldInput
                id="signup-email"
                label="Email address"
                type="email"
                value={email}
                error={touched.email ? errors.email : undefined}
                autoComplete="email"
                maxLength={FIELD_LIMITS.email.max}
                onChange={(v) => setFieldValue('email', v)}
                onBlur={() => markTouched('email')}
              />
              <AuthFieldInput
                id="signup-password"
                label="Password"
                type="password"
                value={password}
                error={touched.password ? errors.password : undefined}
                autoComplete="new-password"
                maxLength={FIELD_LIMITS.password.max}
                minLength={FIELD_LIMITS.password.min}
                onChange={(v) => setFieldValue('password', v)}
                onBlur={() => markTouched('password')}
              />
              <p className="zara-auth-hint">
                {FIELD_LIMITS.password.min}–{FIELD_LIMITS.password.max} characters, no spaces.
              </p>
              <button type="submit" disabled={loading}>
                {loading ? (
                  <span className="zara-auth-spinner" aria-hidden />
                ) : (
                  'Sign Up'
                )}
              </button>
              <div className="zara-auth-switch">
                Already have an account?{' '}
                <button type="button" onClick={goLogin}>
                  Login
                </button>
              </div>
              <p className="zara-auth-guest">
                <Link to="/">Continue as guest</Link>
              </p>
            </form>
          )}
        </div>
      </div>

      {toastMessage && (
        <div
          className={`zara-auth-toast ${toastIsError ? 'error' : ''}`}
          role="status"
          aria-live="polite"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export function RegisterPage() {
  return <LoginPage initialMode="signup" />;
}
