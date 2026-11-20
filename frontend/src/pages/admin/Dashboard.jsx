import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

function AdminDashboard() {
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
      {/* Ambient Chromatic Backdrop Mesh for Glassmorphic Depth */}
      <div className="dashboard-ambient-mesh">
        <div className="ambient-mesh-orb orb-blue"></div>
        <div className="ambient-mesh-orb orb-emerald"></div>
        <div className="ambient-mesh-orb orb-amber"></div>
      </div>

      {/* Dynamic Bento Glassmorphic Stat Cards */}
      <div className="dashboard-cards">
        <div className="stat-card stat-users">
          <div className="stat-card-glow-bg"></div>
          <div>
            <div className="stat-card-header">
              <div className="stat-label">Total Registered Users</div>
            </div>
            <div className="stat-value">{stats.totalUsers}</div>
          </div>
          <div className="stat-subtext">Platform administrators, store owners, and normal customers</div>
        </div>

        <div className="stat-card stat-stores">
          <div className="stat-card-glow-bg"></div>
          <div>
            <div className="stat-card-header">
              <div className="stat-label">Total Active Stores</div>
            </div>
            <div className="stat-value">{stats.totalStores}</div>
          </div>
          <div className="stat-subtext">Retail storefronts listed and open for customer reviews</div>
        </div>

        <div className="stat-card stat-ratings">
          <div className="stat-card-glow-bg"></div>
          <div>
            <div className="stat-card-header">
              <div className="stat-label">Total Submitted Ratings</div>
            </div>
            <div className="stat-value">{stats.totalRatings}</div>
          </div>
          <div className="stat-subtext">Verified star ratings submitted across all registered stores</div>
        </div>
      </div>

      {/* Interactive Bento Shortcut Actions */}
      <div className="dashboard-shortcuts-section">
        <div className="shortcuts-header">
          <h2 className="shortcuts-title">Management Directory & Operations</h2>
          <p className="shortcuts-subtitle">Instant navigation across platform user records and storefront configurations</p>
        </div>

        <div className="shortcuts-grid">
          <Link to="/admin/users" className="shortcut-card">
            <div className="shortcut-card-top">
              <span className="shortcut-arrow">→</span>
            </div>
            <div className="shortcut-info">
              <h3 className="shortcut-name">Manage Platform Users</h3>
              <p className="shortcut-desc">Inspect, filter, and modify customer, store owner, and admin profiles</p>
            </div>
          </Link>

          <Link to="/admin/stores" className="shortcut-card">
            <div className="shortcut-card-top">
              <span className="shortcut-arrow">→</span>
            </div>
            <div className="shortcut-info">
              <h3 className="shortcut-name">Manage Store Listings</h3>
              <p className="shortcut-desc">Audit registered storefronts, inspect aggregate scores, and view addresses</p>
            </div>
          </Link>

          <Link to="/admin/users/new" className="shortcut-card">
            <div className="shortcut-card-top">
              <span className="shortcut-arrow">→</span>
            </div>
            <div className="shortcut-info">
              <h3 className="shortcut-name">Register Admin / Owner</h3>
              <p className="shortcut-desc">Provision privileged management accounts with cryptographic credentials</p>
            </div>
          </Link>

          <Link to="/admin/stores/new" className="shortcut-card">
            <div className="shortcut-card-top">
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
