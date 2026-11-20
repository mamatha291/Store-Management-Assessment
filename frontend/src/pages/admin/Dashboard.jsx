import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const res = await api.get('/dashboard/admin');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading-state">Loading dashboard analytics...</div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Luminous Apple-Style Dashboard Hero Banner */}
      <div className="dashboard-hero-wrapper">
        <div className="dashboard-ambient-glow"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="dashboard-eyebrow">
            <span className="dashboard-live-dot"></span>
            Ecosystem Governance & Real-Time Analytics
          </div>

          <div className="page-header" style={{ marginBottom: 0 }}>
            <div>
              <h1 className="page-title">Admin Dashboard</h1>
              <p className="page-subtitle">
                Welcome back, {user?.name || 'Administrator'} • Platform metrics and administration actions
              </p>
            </div>
            <div className="btn-group">
              <Link to="/admin/users/new" className="btn btn-primary">
                + Add New User
              </Link>
              <Link to="/admin/stores/new" className="btn btn-success">
                + Add New Store
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Bento Stat Cards */}
      <div className="dashboard-cards">
        <div className="stat-card stat-users">
          <div>
            <div className="stat-card-header">
              <div className="stat-label">Total Registered Users</div>
              <span className="stat-pill-badge badge-blue">👥 Directory</span>
            </div>
            <div className="stat-value">{stats.totalUsers}</div>
          </div>
          <div className="stat-subtext">Platform administrators, store owners, and normal customers</div>
        </div>

        <div className="stat-card stat-stores">
          <div>
            <div className="stat-card-header">
              <div className="stat-label">Total Active Stores</div>
              <span className="stat-pill-badge badge-green">🏪 Verified</span>
            </div>
            <div className="stat-value">{stats.totalStores}</div>
          </div>
          <div className="stat-subtext">Retail storefronts listed and open for customer reviews</div>
        </div>

        <div className="stat-card stat-ratings">
          <div>
            <div className="stat-card-header">
              <div className="stat-label">Total Submitted Ratings</div>
              <span className="stat-pill-badge badge-amber">★ Telemetry</span>
            </div>
            <div className="stat-value">{stats.totalRatings}</div>
          </div>
          <div className="stat-subtext">Verified star ratings submitted across all registered stores</div>
        </div>
      </div>

      {/* Interactive Bento Shortcut Actions */}
      <div className="dashboard-shortcuts-section">
        <div className="shortcuts-header">
          <span className="shortcuts-eyebrow">Direct Actions</span>
          <h2 className="shortcuts-title">Management Directory & Operations</h2>
          <p className="shortcuts-subtitle">Instant navigation across platform user records and storefront configurations</p>
        </div>

        <div className="shortcuts-grid">
          <Link to="/admin/users" className="shortcut-card">
            <div className="shortcut-icon-wrapper icon-users">👥</div>
            <div className="shortcut-info">
              <h3 className="shortcut-name">Manage Platform Users</h3>
              <p className="shortcut-desc">Inspect, filter, and modify customer, store owner, and admin profiles</p>
            </div>
            <span className="shortcut-arrow">→</span>
          </Link>

          <Link to="/admin/stores" className="shortcut-card">
            <div className="shortcut-icon-wrapper icon-stores">🏪</div>
            <div className="shortcut-info">
              <h3 className="shortcut-name">Manage Store Listings</h3>
              <p className="shortcut-desc">Audit registered storefronts, inspect aggregate scores, and view addresses</p>
            </div>
            <span className="shortcut-arrow">→</span>
          </Link>

          <Link to="/admin/users/new" className="shortcut-card">
            <div className="shortcut-icon-wrapper icon-newuser">✨</div>
            <div className="shortcut-info">
              <h3 className="shortcut-name">Register Admin / Owner</h3>
              <p className="shortcut-desc">Provision privileged management accounts with cryptographic credentials</p>
            </div>
            <span className="shortcut-arrow">→</span>
          </Link>

          <Link to="/admin/stores/new" className="shortcut-card">
            <div className="shortcut-icon-wrapper icon-newstore">📍</div>
            <div className="shortcut-info">
              <h3 className="shortcut-name">Create Store Profile</h3>
              <p className="shortcut-desc">Deploy a new storefront to the directory ready for customer evaluation</p>
            </div>
            <span className="shortcut-arrow">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
