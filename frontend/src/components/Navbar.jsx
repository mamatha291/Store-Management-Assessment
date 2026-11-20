import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AppleButton, AppleCard } from './AppleComponents';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  if (!user) return null;

  const roleLabels = {
    ADMIN: 'Administrator',
    OWNER: 'Store Owner',
    USER: 'Customer'
  };

  const roleColors = {
    ADMIN: 'var(--accent)',
    OWNER: 'var(--success)',
    USER: 'var(--text-main)'
  };

  return (
    <nav
      className="navbar"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.7)',
        transition: 'background 200ms ease, box-shadow 200ms ease',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.06)' : '0 1px 2px rgba(0,0,0,0.04)'
      }}
    >
      <div className="navbar-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <NavLink to="/" className="brand" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-main)' }}>
              Store Portal
            </span>
            <span className="brand-badge" style={{
              background: `rgba(${roleColors[user.role] === 'var(--accent)' ? '0, 113, 227' : roleColors[user.role] === 'var(--success)' ? '52, 199, 89' : '0,0,0'}, 0.1)`,
              color: roleColors[user.role],
              fontSize: '10px',
              fontWeight: '700',
              textTransform: 'uppercase',
              padding: '2px 8px',
              borderRadius: '999px'
            }}>
              {roleLabels[user.role]}
            </span>
          </NavLink>
        </div>

        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {user.role === 'ADMIN' && (
            <>
              <NavLink
                to="/admin"
                end
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  position: 'relative',
                  paddingBottom: '4px'
                }}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/admin/users"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  position: 'relative',
                  paddingBottom: '4px'
                }}
              >
                Users
              </NavLink>
              <NavLink
                to="/admin/stores"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  position: 'relative',
                  paddingBottom: '4px'
                }}
              >
                Stores
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  position: 'relative',
                  paddingBottom: '4px'
                }}
              >
                Profile
              </NavLink>
            </>
          )}

          {user.role === 'OWNER' && (
            <>
              <NavLink
                to="/owner"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  position: 'relative',
                  paddingBottom: '4px'
                }}
              >
                Store Analytics
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  position: 'relative',
                  paddingBottom: '4px'
                }}
              >
                Profile
              </NavLink>
            </>
          )}

          {user.role === 'USER' && (
            <>
              <NavLink
                to="/stores"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  position: 'relative',
                  paddingBottom: '4px'
                }}
              >
                Explore Stores
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  position: 'relative',
                  paddingBottom: '4px'
                }}
              >
                My Profile
              </NavLink>
            </>
          )}

          <AppleButton
            variant="outline"
            size="small"
            onClick={handleLogout}
          >
            Sign Out
          </AppleButton>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;