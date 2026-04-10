import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{
      backgroundColor: 'white',
      borderBottom: '1px solid var(--gray-200)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 1.5rem'
      }}>
        <Link to="/dashboard" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)', textDecoration: 'none' }}>
          Fix & Flip Portal
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <NavLink to="/dashboard" style={({ isActive }) => ({
            textDecoration: 'none',
            color: isActive ? 'var(--primary)' : 'var(--gray-700)',
            fontWeight: isActive ? '600' : '400'
          })}>Dashboard</NavLink>
          <NavLink to="/loans/new" style={({ isActive }) => ({
            textDecoration: 'none',
            color: isActive ? 'var(--primary)' : 'var(--gray-700)',
            fontWeight: isActive ? '600' : '400'
          })}>New Application</NavLink>
          <NavLink to="/calculators" style={({ isActive }) => ({
            textDecoration: 'none',
            color: isActive ? 'var(--primary)' : 'var(--gray-700)',
            fontWeight: isActive ? '600' : '400'
          })}>Calculators</NavLink>
          
          <NavLink to="/messages" style={({ isActive }) => ({
            position: 'relative',
            textDecoration: 'none',
            color: isActive ? 'var(--primary)' : 'var(--gray-700)',
            fontWeight: isActive ? '600' : '400'
          })}>
            Messages
          </NavLink>

          <div className="dropdown" style={{ position: 'relative' }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                backgroundColor: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {user?.name}
            </button>
            
            {menuOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '0.5rem',
                backgroundColor: 'white',
                border: '1px solid var(--gray-200)',
                borderRadius: '0.375rem',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                minWidth: '180px',
                zIndex: 10
              }}>
                <Link
                  to="/profile"
                  className="dropdown-item"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'block',
                    padding: '0.75rem 1rem',
                    color: 'var(--gray-700)',
                    textDecoration: 'none',
                    borderBottom: '1px solid var(--gray-100)'
                  }}
                >
                  Profile
                </Link>
                <button
                  onClick={() => { setMenuOpen(false); logout(); }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: 'var(--danger)',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
