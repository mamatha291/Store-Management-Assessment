import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  function getInitials(name) {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  // Handle outside click & escape key to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!user) return null;

  const homePath = user.role === 'ADMIN' ? '/admin' : user.role === 'OWNER' ? '/owner' : '/stores';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={homePath} className="brand" onClick={() => { setMobileMenuOpen(false); setDropdownOpen(false); }}>
          <span className="brand-icon">🏬</span>
          <span className="brand-text">Store Portal</span>
        </Link>

        <div className="navbar-right-group">
          <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            {user.role === 'ADMIN' && (
              <>
                <NavLink
                  to="/admin"
                  end
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/admin/users"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Users
                </NavLink>
                <NavLink
                  to="/admin/stores"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Stores
                </NavLink>
              </>
            )}

            {user.role === 'OWNER' && (
              <NavLink
                to="/owner"
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setMobileMenuOpen(false)}
              >
                Store Analytics
              </NavLink>
            )}

            {user.role === 'USER' && (
              <NavLink
                to="/stores"
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setMobileMenuOpen(false)}
              >
                Explore Stores
              </NavLink>
            )}
          </div>

          {/* Unified Profile & Logout Menu Button */}
          <div className="navbar-profile-menu-container" ref={dropdownRef}>
            <button
              type="button"
              className="navbar-profile-trigger"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-expanded={dropdownOpen}
              aria-label="User account options"
            >
              <div className={`navbar-avatar ${user.role === 'ADMIN' ? 'avatar-admin' : user.role === 'OWNER' ? 'avatar-owner' : 'avatar-user'}`}>
                {getInitials(user.name)}
              </div>
              <span className="navbar-profile-name">{user.name ? user.name.split(' ')[0] : 'Account'}</span>
              <svg
                className={`navbar-chevron ${dropdownOpen ? 'open' : ''}`}
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {dropdownOpen && (
              <div className="navbar-profile-dropdown">
                <div className="dropdown-user-header">
                  <div className="dropdown-user-name">{user.name}</div>
                  <div className="dropdown-user-email">{user.email}</div>
                  <div className="dropdown-user-role-text">
                    {user.role === 'ADMIN' ? 'System Administrator' : user.role === 'OWNER' ? 'Store Owner' : 'Normal Customer'}
                  </div>
                </div>

                <div className="dropdown-divider"></div>

                <Link
                  to="/profile"
                  className="dropdown-item"
                  onClick={() => {
                    setDropdownOpen(false);
                    setMobileMenuOpen(false);
                  }}
                >
                  <span className="dropdown-item-icon">👤</span>
                  <span>My Profile</span>
                </Link>

                <button
                  type="button"
                  className="dropdown-item dropdown-item-danger"
                  onClick={() => {
                    setDropdownOpen(false);
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                >
                  <span className="dropdown-item-icon">🚪</span>
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            className="navbar-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
