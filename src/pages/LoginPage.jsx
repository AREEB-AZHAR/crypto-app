import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);
import '../styles/login.css';

const LoginPage = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    if (isSignUp && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setLoading(false);

    // For now, just call onLogin (no real auth)
    if (onLogin) {
      onLogin({ email: formData.email });
    }
  };

  const toggleMode = () => {
    setIsSignUp((prev) => !prev);
    setError('');
    setFormData({ email: '', password: '', confirmPassword: '', remember: false });
  };

  return (
    <div className="login-page">
      {/* Animated background */}
      <div className="login-bg">
        <div className="login-bg-orb login-bg-orb--cyan" />
        <div className="login-bg-orb login-bg-orb--purple" />
        <div className="login-bg-orb login-bg-orb--blue" />
        <div className="login-bg-grid" />
        <div className="login-particles">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="login-particle" />
          ))}
        </div>
      </div>

      {/* Main card */}
      <motion.div
        className="login-container"
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Left — branding panel */}
        <div className="login-branding">
          <div className="login-logo">
            <div className="login-logo-icon">
              <TrendingUp size={28} strokeWidth={2.5} />
            </div>
            <span className="login-logo-text">
              <span className="gradient-text">Crypto</span>Trader
            </span>
          </div>

          <motion.h1
            className="login-branding-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Trade Smarter.
            <br />
            <span className="gradient-text">Grow Faster.</span>
          </motion.h1>

          <motion.p
            className="login-branding-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Access real-time market data, advanced charts, and paper trading —
            all in one premium experience. No real money required.
          </motion.p>

          <motion.div
            className="login-stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="login-stat">
              <div className="login-stat-value">18K+</div>
              <div className="login-stat-label">Coins</div>
            </div>
            <div className="login-stat">
              <div className="login-stat-value">$10K</div>
              <div className="login-stat-label">Start Balance</div>
            </div>
            <div className="login-stat">
              <div className="login-stat-value">24/7</div>
              <div className="login-stat-label">Live Data</div>
            </div>
          </motion.div>
        </div>

        {/* Right — form panel */}
        <div className="login-form-panel">
          <motion.div
            className="login-form-header"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <h2 className="login-form-title">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="login-form-desc">
              {isSignUp
                ? 'Start your trading journey today'
                : 'Sign in to your trading account'}
            </p>
          </motion.div>

          {/* Social logins */}
          <motion.div
            className="login-socials"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            <button className="login-social-btn" type="button" id="login-google-btn">
              <GoogleIcon />
              Google
            </button>
            <button className="login-social-btn" type="button" id="login-github-btn">
              <GithubIcon />
              GitHub
            </button>
          </motion.div>

          <motion.div
            className="login-divider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="login-divider-line" />
            <span className="login-divider-text">or</span>
            <div className="login-divider-line" />
          </motion.div>

          {/* Form */}
          <motion.form
            className="login-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            {error && (
              <motion.div
                className="login-error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            <div className="login-field">
              <label className="login-label" htmlFor="login-email">
                Email Address
              </label>
              <div className="login-input-wrapper">
                <Mail size={18} className="login-input-icon" />
                <input
                  id="login-email"
                  className="login-input"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="login-field">
              <label className="login-label" htmlFor="login-password">
                Password
              </label>
              <div className="login-input-wrapper">
                <Lock size={18} className="login-input-icon" />
                <input
                  id="login-password"
                  className="login-input"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  className="login-input-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  id="login-toggle-password"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <motion.div
                className="login-field"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="login-label" htmlFor="login-confirm-password">
                  Confirm Password
                </label>
                <div className="login-input-wrapper">
                  <Lock size={18} className="login-input-icon" />
                  <input
                    id="login-confirm-password"
                    className="login-input"
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                </div>
              </motion.div>
            )}

            {!isSignUp && (
              <div className="login-options">
                <label className="login-remember" htmlFor="login-remember-checkbox">
                  <input
                    id="login-remember-checkbox"
                    className="login-checkbox"
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                  />
                  Remember me
                </label>
                <button type="button" className="login-forgot" id="login-forgot-btn">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
              id="login-submit-btn"
            >
              <span className="login-submit-content">
                {loading ? (
                  <div className="login-spinner" />
                ) : (
                  <>
                    {isSignUp ? 'Create Account' : 'Sign In'}
                    <ArrowRight size={18} />
                  </>
                )}
              </span>
            </button>
          </motion.form>

          <motion.div
            className="login-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <button
                  className="login-footer-link"
                  onClick={toggleMode}
                  type="button"
                  id="login-toggle-mode"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{' '}
                <button
                  className="login-footer-link"
                  onClick={toggleMode}
                  type="button"
                  id="login-toggle-mode"
                >
                  Create one
                </button>
              </>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
