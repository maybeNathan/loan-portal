import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../utils/api';

const Profile = () => {
  const { user, updateUserProfile, logout } = useAuth();
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTFA, setShowTFA] = useState(false);

  useEffect(() => {
    setFormData({ name: user?.name || '', phone: user?.phone || '' });
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    const result = await updateUserProfile(formData);
    
    if (result.success) {
      setMessage('Profile updated successfully!');
      setShowTFA(false);
    } else {
      setMessage(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div>
      <header className="page-header">
        <div className="container">
          <h1>Profile Settings</h1>
          <p>Update your account information</p>
        </div>
      </header>

      <main className="container">
        <div style={{ maxWidth: '600px' }}>
          {message && (
            <div className={message.includes('success') ? 'alert alert-success' : 'alert alert-error'}>
              {message}
            </div>
          )}

          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3>Account Information</h3>
            <div style={{ marginTop: '1rem', display: 'grid', gap: '1rem' }}>
              <div>
                <strong>Email:</strong> {user?.email}
              </div>
              <div>
                <strong>State:</strong> {user?.state}
              </div>
              <div>
                <strong>Role:</strong> {user?.role.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </div>
              <div>
                <strong>Two-Factor Auth:</strong> {user?.tfaEnabled ? '✓ Enabled' : '◯ Disabled'}
              </div>
            </div>
          </div>

          <div className="card">
            <h3>Update Information</h3>
            <form onSubmit={handleUpdate} style={{ marginTop: '1rem' }}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Update Profile'}
              </button>
            </form>
          </div>

          <div className="card" style={{ marginTop: '1.5rem' }}>
            <h3>Security</h3>
            <p style={{ color: 'var(--gray-600)', marginTop: '0.5rem' }}>
              Enable two-factor authentication for additional security on your account.
            </p>
            <button
              className="btn btn-outline"
              style={{ marginTop: '1rem' }}
              onClick={() => setShowTFA(!showTFA)}
            >
              {showTFA ? 'Hide TFA Setup' : 'Setup Two-Factor Authentication'}
            </button>
          </div>

          <div className="card" style={{ marginTop: '1.5rem', backgroundColor: '#fee2e2' }}>
            <h3 style={{ color: '#991b1b' }}>Danger Zone</h3>
            <p style={{ color: '#7f1d1d', marginTop: '0.5rem' }}>
              Logout from your account
            </p>
            <button
              className="btn btn-danger"
              style={{ marginTop: '1rem' }}
              onClick={() => {
                if (confirm('Are you sure you want to logout?')) {
                  logout();
                }
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
