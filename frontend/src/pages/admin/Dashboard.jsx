import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { AppleCard, AppleStat, FloatingParticles } from '../../components/AppleComponents';

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

  return (
    <div className="app-wrapper">
      <header style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(12px)',
        '-webkitBackdropFilter': 'blur(12px)',
        borderBottom: '1px solid var(--apple-divider)',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
        padding: 'var(--space-4) var(--space-6)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--apple-text-primary)', margin: 0 }}>
            Admin Dashboard
          </h1>
          <div>
            <AppleButton variant="outline" size="small" style={{ marginRight: '12px' }}>
              Refresh
            </AppleButton>
            <AppleButton variant="primary" size="small">
              + Add New User
            </AppleButton>
          </div>
        </div>
      </header>

      <main style={{ padding: 'var(--space-6) var(--space-8)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="dashboard-cards">
            <AppleStat label="Total Users" value={stats.totalUsers} subtext="Platform administrators, store owners, and normal customers" />
            <AppleStat label="Total Stores" value={stats.totalStores} subtext="Retail storefronts listed and open for customer reviews" />
            <AppleStat label="Total Ratings" value={stats.totalRatings} subtext="Verified star ratings submitted across all registered stores" />
          </div>

          <FloatingParticles />
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;