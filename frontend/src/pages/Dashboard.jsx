import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext.jsx';

const Dashboard = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchLoans();
    fetchUnreadCount();
  }, []);

  const fetchLoans = async () => {
    try {
      const res = await api.get('/loans/my-loans');
      setLoans(res.data.loans);
    } catch (err) {
      console.error('Failed to fetch loans:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get('/messages/unread-count');
      setUnreadCount(res.data.count);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      draft: 'badge-draft',
      submitted: 'badge-submitted',
      under_review: 'badge-review',
      approved: 'badge-approved',
      declined: 'badge-declined',
      funded: 'badge-funded'
    };
    return map[status] || 'badge-draft';
  };

  const formatStatus = (status) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const stats = [
    { label: 'Total Applications', value: loans.length },
    { label: 'Approved', value: loans.filter(l => l.status === 'approved').length },
    { label: 'Under Review', value: loans.filter(l => l.status === 'under_review').length },
    { label: 'Funded', value: loans.filter(l => l.status === 'funded').length }
  ];

  return (
    <div>
      <header className="page-header">
        <div className="container">
          <h1>Welcome, {user?.name}</h1>
          <p>State: {user?.state} | Track your fix & flip loan applications</p>
        </div>
      </header>

      <main className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {stats.map((stat, idx) => (
            <div key={idx} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{stat.value}</div>
              <div style={{ color: 'var(--gray-600)' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>Your Loan Applications</h2>
          <Link to="/loans/new" className="btn btn-primary">+ New Application</Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-500)' }}>Loading...</div>
        ) : loans.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--gray-500)', marginBottom: '1rem' }}>No loan applications found</p>
            <Link to="/loans/new" className="btn btn-primary">Create Your First Application</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {loans.map(loan => (
              <div key={loan._id} className="card" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ margin: 0 }}>{formatStatus(loan.status)}</h3>
                      <span className={`badge ${getStatusBadge(loan.status)}`}>{formatStatus(loan.status)}</span>
                    </div>
                    <p style={{ margin: '0.25rem 0', color: 'var(--gray-600)' }}>
                      {loan.propertyAddress?.city}, {loan.propertyAddress?.state}
                    </p>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                      Property Type: {loan.propertyType.replace('_', ' ')} | Exp: {loan.experienceLevel.replace('_', ' ')}
                    </p>
                    <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1.5rem', fontSize: '0.875rem', color: 'var(--gray-700)' }}>
                      <span>Purchase: ${loan.purchasePrice?.toLocaleString()}</span>
                      <span>Repairs: ${loan.estimatedRepairCosts?.toLocaleString()}</span>
                      <span>ARV: ${loan.estimatedARV?.toLocaleString()}</span>
                    </div>
                  </div>
                  <Link to={`/loans/${loan._id}`} className="btn btn-outline btn-sm">View Details</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
