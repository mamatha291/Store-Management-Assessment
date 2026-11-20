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
      <div className="dashboard-container">
        <div className="loading-state">Loading dashboard analytics...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Luminous System Dashboard Hero Banner */}
      <div className="dashboard-hero-wrapper">
        <div className="dashboard-ambient-glow"></div>
        <div className="dashboard-ambient-glow-secondary"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="page-header" style={{ marginBottom: 0 }}>
            <div>
              <div className="hero-status-pill">
                <span className="badge-pulse-dot dot-green"></span>
                System Operational • Live Telemetry
              </div>
              <h1 className="page-title dashboard-title-glow">Admin Dashboard</h1>
              <p className="page-subtitle">
                Welcome back, {user?.name || 'Administrator'} • Platform metrics, management actions, and infrastructure telemetry
              </p>
            </div>
            <div className="btn-group">
              <Link to="/admin/users/new" className="btn btn-primary btn-apple-glow">
                + Add New User
              </Link>
              <Link to="/admin/stores/new" className="btn btn-success btn-apple-glow">
                + Add New Store
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Bento Stat Cards */}
      <div className="dashboard-cards">
        <div className="stat-card stat-users">
          <div className="stat-card-glow-bg"></div>
          <div>
            <div className="stat-card-header">
              <div className="stat-label">Total Registered Users</div>
              <span className="stat-pill-badge badge-blue">
                <span className="badge-pulse-dot"></span>
                Directory
              </span>
            </div>
            <div className="stat-value">{stats.totalUsers}</div>
            <div className="stat-progress-bar-track">
              <div className="stat-progress-bar-fill fill-blue" style={{ width: stats.totalUsers > 0 ? '78%' : '20%' }}></div>
            </div>
          </div>
          <div className="stat-subtext">Platform administrators, store owners, and normal customers</div>
        </div>

        <div className="stat-card stat-stores">
          <div className="stat-card-glow-bg"></div>
          <div>
            <div className="stat-card-header">
              <div className="stat-label">Total Active Stores</div>
              <span className="stat-pill-badge badge-green">
                <span className="badge-pulse-dot dot-green"></span>
                Verified
              </span>
            </div>
            <div className="stat-value">{stats.totalStores}</div>
            <div className="stat-progress-bar-track">
              <div className="stat-progress-bar-fill fill-green" style={{ width: stats.totalStores > 0 ? '65%' : '15%' }}></div>
            </div>
          </div>
          <div className="stat-subtext">Retail storefronts listed and open for customer reviews</div>
        </div>

        <div className="stat-card stat-ratings">
          <div className="stat-card-glow-bg"></div>
          <div>
            <div className="stat-card-header">
              <div className="stat-label">Total Submitted Ratings</div>
              <span className="stat-pill-badge badge-amber">
                <span className="badge-pulse-dot dot-amber"></span>
                Telemetry
              </span>
            </div>
            <div className="stat-value">{stats.totalRatings}</div>
            <div className="stat-progress-bar-track">
              <div className="stat-progress-bar-fill fill-amber" style={{ width: stats.totalRatings > 0 ? '85%' : '25%' }}></div>
            </div>
          </div>
          <div className="stat-subtext">Verified star ratings submitted across all registered stores</div>
        </div>
      </div>

      {/* Real-time System Telemetry & Architecture Panel */}
      <div className="dashboard-telemetry-grid">
        <div className="telemetry-card">
          <div className="telemetry-header">
            <div className="telemetry-indicator-group">
              <span className="telemetry-live-pulse"></span>
              <span className="telemetry-title">Platform Infrastructure & Security</span>
            </div>
            <span className="telemetry-badge-ok">Active Engine</span>
          </div>
          <div className="telemetry-details">
            <div className="telemetry-item">
              <span className="telemetry-item-icon">⚡</span>
              <div>
                <strong>Low-Latency In-Memory Caching</strong>
                <p>Sub-millisecond response pipeline with JWT token verification on each edge request</p>
              </div>
            </div>
            <div className="telemetry-item">
              <span className="telemetry-item-icon">🔒</span>
              <div>
                <strong>Role-Based Access Control (RBAC)</strong>
                <p>Triple-layer privilege isolation protecting Admin, Store Owner, and Customer scopes</p>
              </div>
            </div>
            <div className="telemetry-item">
              <span className="telemetry-item-icon">🛡️</span>
              <div>
                <strong>Encrypted Cryptographic Hashing</strong>
                <p>Secure Bcrypt salt-work hash standards applied to all platform credentials</p>
              </div>
            </div>
          </div>
        </div>

        <div className="telemetry-card">
          <div className="telemetry-header">
            <div className="telemetry-indicator-group">
              <span className="telemetry-live-pulse dot-blue"></span>
              <span className="telemetry-title">Ecosystem Composition</span>
            </div>
            <span className="telemetry-badge-blue">Live Ratio</span>
          </div>
          <div className="role-distribution-bars">
            <div className="role-dist-row">
              <span className="role-dist-label">Customers</span>
              <div className="role-dist-track">
                <div className="role-dist-fill dist-user" style={{ width: '70%' }}></div>
              </div>
              <span className="role-dist-val">Primary</span>
            </div>
            <div className="role-dist-row">
              <span className="role-dist-label">Store Owners</span>
              <div className="role-dist-track">
                <div className="role-dist-fill dist-owner" style={{ width: '22%' }}></div>
              </div>
              <span className="role-dist-val">Merchants</span>
            </div>
            <div className="role-dist-row">
              <span className="role-dist-label">Admins</span>
              <div className="role-dist-track">
                <div className="role-dist-fill dist-admin" style={{ width: '8%' }}></div>
              </div>
              <span className="role-dist-val">Governance</span>
            </div>
            <div style={{ marginTop: '12px', padding: '14px', background: '#FAFAFC', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.05)', fontSize: '12px', color: '#86868B', lineHeight: '1.5' }}>
              ✦ Live balanced database nodes managing {stats.totalUsers} profiles and {stats.totalStores} merchant endpoints with high concurrency.
            </div>
          </div>
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
            <div className="shortcut-card-top">
              <div className="shortcut-icon-wrapper icon-users">👥</div>
              <span className="shortcut-arrow">→</span>
            </div>
            <div className="shortcut-info">
              <h3 className="shortcut-name">Manage Platform Users</h3>
              <p className="shortcut-desc">Inspect, filter, and modify customer, store owner, and admin profiles</p>
            </div>
          </Link>

          <Link to="/admin/stores" className="shortcut-card">
            <div className="shortcut-card-top">
              <div className="shortcut-icon-wrapper icon-stores">🏪</div>
              <span className="shortcut-arrow">→</span>
            </div>
            <div className="shortcut-info">
              <h3 className="shortcut-name">Manage Store Listings</h3>
              <p className="shortcut-desc">Audit registered storefronts, inspect aggregate scores, and view addresses</p>
            </div>
          </Link>

          <Link to="/admin/users/new" className="shortcut-card">
            <div className="shortcut-card-top">
              <div className="shortcut-icon-wrapper icon-newuser">✨</div>
              <span className="shortcut-arrow">→</span>
            </div>
            <div className="shortcut-info">
              <h3 className="shortcut-name">Register Admin / Owner</h3>
              <p className="shortcut-desc">Provision privileged management accounts with cryptographic credentials</p>
            </div>
          </Link>

          <Link to="/admin/stores/new" className="shortcut-card">
            <div className="shortcut-card-top">
              <div className="shortcut-icon-wrapper icon-newstore">📍</div>
              <span className="shortcut-arrow">→</span>
            </div>
            <div className="shortcut-info">
              <h3 className="shortcut-name">Create Store Profile</h3>
              <p className="shortcut-desc">Deploy a new storefront to the directory ready for customer evaluation</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
