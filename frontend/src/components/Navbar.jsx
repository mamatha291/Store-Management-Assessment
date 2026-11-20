import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  function handleLogout() {
    logout();
    navigate('/login');
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

  const homePath = !user ? '/' : user.role === 'ADMIN' ? '/admin' : user.role === 'OWNER' ? '/owner' : '/stores';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={homePath} className="brand" onClick={() => { setMobileMenuOpen(false); setDropdownOpen(false); }}>
          <span className="brand-icon">🏬</span>
          <span className="brand-text">Store Portal</span>
        </Link>

        <div className="navbar-right-group">
          {/* Nav Links */}
          <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            {user ? (
              <>
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
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/signup"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>

          {/* Animated Dark / Light Mode Toggle Button */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <div className={`theme-toggle-icon-wrap ${theme === 'dark' ? 'is-dark' : 'is-light'}`}>
              {/* Sun Icon */}
              <svg
                className="theme-icon sun-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="m4.93 4.93 1.41 1.41"></path>
                <path d="m17.66 17.66 1.41 1.41"></path>
                <path d="M2 12h2"></path>
                <path d="M20 12h2"></path>
                <path d="m6.34 17.66-1.41 1.41"></path>
                <path d="m19.07 4.93-1.41 1.41"></path>
              </svg>

              {/* Moon Icon */}
              <svg
                className="theme-icon moon-icon"
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
              </svg>
            </div>
          </button>

          {/* Unified Profile & Logout Menu Button for authenticated users */}
          {user && (
            <div className="navbar-profile-menu-container" ref={dropdownRef}>
              <button
                type="button"
                className="navbar-profile-trigger"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
                aria-label="User account options"
                title={`${user.name} - Profile & Logout`}
              >
                <div className={`navbar-avatar-icon ${user.role === 'ADMIN' ? 'avatar-admin' : user.role === 'OWNER' ? 'avatar-owner' : 'avatar-user'}`}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <svg
                  className={`navbar-chevron ${dropdownOpen ? 'open' : ''}`}
                  width="11"
                  height="11"
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
                    <div className="dropdown-item-icon-box icon-box-blue">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
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
                    <div className="dropdown-item-icon-box icon-box-red">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                    </div>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          )}

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
