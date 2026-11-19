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
      <div className="page-header">
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

      <div className="dashboard-cards">
        <div className="stat-card stat-users">
          <div>
            <div className="stat-label">
              Total Registered Users
            </div>
            <div className="stat-value">{stats.totalUsers}</div>
          </div>
          <div className="stat-subtext">Platform administrators, store owners, and normal customers</div>
        </div>

        <div className="stat-card stat-stores">
          <div>
            <div className="stat-label">
              Total Active Stores
            </div>
            <div className="stat-value">{stats.totalStores}</div>
          </div>
          <div className="stat-subtext">Retail storefronts listed and open for customer reviews</div>
        </div>

        <div className="stat-card stat-ratings">
          <div>
            <div className="stat-label">
              Total Submitted Ratings
            </div>
            <div className="stat-value">{stats.totalRatings}</div>
          </div>
          <div className="stat-subtext">Verified star ratings submitted across all registered stores</div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              Quick Management Shortcuts
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px', margin: 0 }}>
              Direct access to system directories, account listings, and records
            </p>
          </div>
        </div>
        <div className="btn-group">
          <Link to="/admin/users" className="btn btn-secondary">
            Manage Platform Users
          </Link>
          <Link to="/admin/stores" className="btn btn-secondary">
            Manage Store Listings
          </Link>
          <Link to="/admin/users/new" className="btn btn-outline">
            Register Admin / Owner
          </Link>
          <Link to="/admin/stores/new" className="btn btn-outline">
            Create Store Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
