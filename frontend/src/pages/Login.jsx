import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [requiresTFA, setRequiresTFA] = useState(false);
  const [tfaToken, setTfaToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password, tfaToken);

    if (result.success) {
      navigate('/dashboard');
    } else if (result.requiresTFA) {
      setRequiresTFA(true);
      setPendingEmail(formData.email);
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  const handleTFAVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(pendingEmail, formData.password, tfaToken);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Invalid TFA token');
    }

    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--gray-100)'
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--primary)' }}>
          {requiresTFA ? 'Two-Factor Authentication' : 'Login'}
        </h2>

        {error && <div className="alert alert-error">{error}</div>}

        {requiresTFA ? (
          <form onSubmit={handleTFAVerify}>
            <p style={{ textAlign: 'center', color: 'var(--gray-600)', marginBottom: '1.5rem' }}>
              Enter the 6-digit code from your authenticator app
            </p>
            <div className="form-group">
              <input
                type="text"
                value={tfaToken}
                onChange={(e) => setTfaToken(e.target.value)}
                placeholder="123456"
                maxLength="6"
                pattern="\d{6}"
                required
                autoFocus
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        )}

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--gray-600)', marginBottom: '0.5rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
