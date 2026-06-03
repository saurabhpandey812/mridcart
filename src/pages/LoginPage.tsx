import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

const AUTH_VIDEO =
  'https://image.hm.com/content/dam/global_campaigns/season_02/kids/start-page-assets/w29/KS32O-9x16-video-kids-start-page-prio-week-29.mp4';

type AuthMode = 'login' | 'signup';

interface LoginPageProps {
  initialMode?: AuthMode;
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

export function LoginPage({ initialMode = 'login' }: LoginPageProps) {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

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

  const goLogin = () => {
    setMode('login');
    if (location.pathname !== '/login') navigate('/login');
  };

  const goSignup = () => {
    setMode('signup');
    if (location.pathname !== '/register') navigate('/register');
  };

  const showToast = (message: string, isError = false) => {
    setToast(isError ? `error:${message}` : message);
    window.setTimeout(() => setToast(''), 2000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const ok = login(email, password);
    if (!ok) {
      showToast('Invalid credentials', true);
      setLoading(false);
      return;
    }

    showToast('Login successful!');
    setLoading(false);
    window.setTimeout(() => navigate('/profile'), 1200);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', true);
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const ok = register({
      name,
      email,
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
            <form className="zara-auth-form" onSubmit={handleLogin}>
              <h1>Login</h1>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
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
            <form className="zara-auth-form" onSubmit={handleSignup}>
              <h1>Sign Up</h1>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
              />
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
