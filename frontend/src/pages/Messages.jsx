import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const Messages = () => {
  const [allMessages, setAllMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/messages');
      setAllMessages(res.data.messages || []);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const messagesByLoan = allMessages.reduce((acc, msg) => {
    const loanId = msg.loan;
    if (!acc[loanId]) acc[loanId] = [];
    acc[loanId].push(msg);
    return acc;
  }, {});

  return (
    <div>
      <header className="page-header">
        <div className="container">
          <h1>Messages</h1>
          <p>Communicate with loan officers about your applications</p>
        </div>
      </header>

      <main className="container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-500)' }}>Loading...</div>
        ) : Object.keys(messagesByLoan).length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--gray-500)' }}>No messages yet</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {Object.entries(messagesByLoan).map(([loanId, msgs]) => (
              <div key={loanId} className="card">
                <Link to={`/loans/${loanId}`} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>
                  Loan Application
                </Link>
                <div style={{ 
                  maxHeight: '300px', 
                  overflowY: 'auto', 
                  margin: '1rem 0' 
                }}>
                  {msgs.map(msg => (
                    <div key={msg._id} style={{ 
                      marginBottom: '0.75rem',
                      padding: '0.75rem',
                      background: msg.sender._id !== msg.receiver._id ? 'var(--gray-100)' : 'transparent',
                      borderRadius: '0.375rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <strong>{msg.sender.name}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                          {new Date(msg.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p style={{ margin: 0 }}>{msg.content}</p>
                    </div>
                  ))}
                </div>
                <Link to={`/loans/${loanId}?tab=messages`} className="btn btn-primary btn-sm">
                  View Full Conversation
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Messages;
