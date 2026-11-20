import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  if (!user) return null;

  const roleLabels = {
    ADMIN: 'Admin',
    OWNER: 'Store Owner',
    USER: 'User'
  };

  const roleClass = {
    ADMIN: 'role-admin',
    OWNER: 'role-owner',
    USER: 'role-user'
  };

  const homePath = user.role === 'ADMIN' ? '/admin' : user.role === 'OWNER' ? '/owner' : '/stores';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={homePath} className="brand" onClick={() => setMobileMenuOpen(false)}>
          <span>Store Portal</span>
          <span className={`brand-badge ${roleClass[user.role] || ''}`}>
            {roleLabels[user.role] || user.role}
          </span>
        </Link>

        <button
          className="navbar-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? 'Close' : 'Menu'}
        </button>

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
              <NavLink
                to="/profile"
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </NavLink>
            </>
          )}

          {user.role === 'OWNER' && (
            <>
              <NavLink
                to="/owner"
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setMobileMenuOpen(false)}
              >
                Store Analytics
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </NavLink>
            </>
          )}

          {user.role === 'USER' && (
            <>
              <NavLink
                to="/stores"
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setMobileMenuOpen(false)}
              >
                Explore Stores
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setMobileMenuOpen(false)}
              >
                My Profile
              </NavLink>
            </>
          )}

          <button className="logout-btn" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;