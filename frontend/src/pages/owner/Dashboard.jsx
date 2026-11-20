import { useState, useEffect, useMemo } from 'react';
import api from '../../api/axios';

function OwnerDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    setLoading(true);
    try {
      const res = await api.get('/dashboard/owner');
      setDashboard(res.data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  }

  // Calculate Star Rating Breakdown Distribution
  const ratingBreakdown = useMemo(() => {
    if (!dashboard || !dashboard.raters) return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    dashboard.raters.forEach(r => {
      const rounded = Math.round(Number(r.rating));
      if (counts[rounded] !== undefined) {
        counts[rounded] += 1;
      }
    });
    return counts;
  }, [dashboard]);

  // Filter and Sort Customer Ratings
  const filteredRaters = useMemo(() => {
    if (!dashboard || !dashboard.raters) return [];
    
    let result = dashboard.raters.filter(r => {
      const name = (r.name || '').toLowerCase();
      const email = (r.email || '').toLowerCase();
      const term = searchTerm.toLowerCase();
      return name.includes(term) || email.includes(term);
    });

    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === 'highest') return Number(b.rating) - Number(a.rating);
      if (sortBy === 'lowest') return Number(a.rating) - Number(b.rating);
      return 0;
    });

    return result;
  }, [dashboard, searchTerm, sortBy]);

  function getRatingSentiment(rating) {
    const val = Number(rating);
    if (val >= 4.5) return { text: 'Excellent', bg: 'var(--success-subtle)', color: 'var(--success-text)', border: 'var(--success-border)' };
    if (val >= 3.5) return { text: 'Very Good', bg: 'var(--warning-subtle)', color: 'var(--warning-text)', border: 'var(--warning-border)' };
    if (val >= 2.8) return { text: 'Good', bg: 'var(--warning-subtle)', color: 'var(--warning-text)', border: 'var(--warning-border)' };
    if (val >= 2.0) return { text: 'Fair', bg: '#FFF7ED', color: '#C2410C', border: '#FED7AA' };
    return { text: 'Needs Attention', bg: 'var(--danger-subtle)', color: 'var(--danger-text)', border: 'var(--danger-border)' };
  }

  function getInitials(name) {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  if (loading) {
    return (
      <div className="dashboard-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div className="loading-state">
          Loading store owner performance analytics...
        </div>
      </div>
    );
  }

  if (!dashboard || !dashboard.storeName) {
    return (
      <div className="dashboard-container">
        <div className="page-header">
          <div>
            <h1 className="page-title dashboard-title-glow">Store Owner Dashboard</h1>
            <p className="page-subtitle">Manage and track customer feedback for your store</p>
          </div>
        </div>
        <div className="card text-center" style={{ padding: '60px 20px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
            No Store Assigned
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '480px', margin: '0 auto 20px auto' }}>
            No store profile has been linked to your owner account yet. Please contact the platform administrator to associate your store listing.
          </p>
        </div>
      </div>
    );
  }

  const totalReviews = dashboard.raters.length;

  return (
    <div className="dashboard-container">
      {/* Luminous System Store Owner Hero Banner */}
      <div className="dashboard-hero-wrapper">
        <div className="dashboard-ambient-glow dashboard-ambient-glow-amber"></div>
        <div className="dashboard-ambient-glow-secondary"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-status-pill">
            <span className="badge-pulse-dot dot-amber"></span>
            Live Store Analytics & Customer Feedback
          </div>

          <div className="page-header" style={{ marginBottom: 0 }}>
            <div>
              <h1 className="page-title dashboard-title-glow">
                {dashboard.storeName}
              </h1>
              <p className="page-subtitle">
                Customer rating analytics, sentiment distribution, and review history
              </p>
            </div>

            <button 
              type="button" 
              className="btn btn-secondary btn-apple-glow" 
              onClick={fetchDashboard}
            >
              ↻ Refresh Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="dashboard-cards">
        {/* Card 1: Store Profile */}
        <div className="stat-card stat-stores">
          <div className="stat-card-glow-bg"></div>
          <div>
            <div className="stat-card-header">
              <div className="stat-label">Store Profile</div>
            </div>
            <div className="stat-value" style={{ fontSize: '26px', lineHeight: 1.2 }}>
              {dashboard.storeName}
            </div>
          </div>
          <div className="stat-subtext" style={{ color: 'var(--success-text)', fontWeight: '600' }}>
            Active storefront • {dashboard.storeAddress || 'Address on file'}
          </div>
        </div>

        {/* Card 2: Average Rating */}
        <div className="stat-card stat-ratings">
          <div className="stat-card-glow-bg"></div>
          <div>
            <div className="stat-card-header">
              <div className="stat-label">Average Score</div>
            </div>
            <div className="stat-value" style={{ color: 'var(--warning-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--star-gold)', filter: 'drop-shadow(0 2px 8px rgba(255, 159, 10, 0.45))' }}>★</span>
              {dashboard.averageRating.toFixed(1)}
              <span style={{ fontSize: '18px', color: 'var(--text-muted)', fontWeight: '600' }}>/ 5.0</span>
            </div>
          </div>
          <div className="stat-subtext">
            Based on {totalReviews} customer {totalReviews === 1 ? 'review' : 'reviews'}
          </div>
        </div>

        {/* Card 3: Total Reviews */}
        <div className="stat-card stat-users">
          <div className="stat-card-glow-bg"></div>
          <div>
            <div className="stat-card-header">
              <div className="stat-label">Total Reviews</div>
            </div>
            <div className="stat-value">
              {totalReviews}
            </div>
          </div>
          <div className="stat-subtext">
            Unique verified user ratings received
          </div>
        </div>
      </div>

      {/* Rating Breakdown Distribution Bar Chart */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>★</span> Rating Distribution Breakdown
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = ratingBreakdown[stars] || 0;
            const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
            return (
              <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '13px' }}>
                <span style={{ width: '48px', fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {stars} <span style={{ color: 'var(--star-gold)' }}>★</span>
                </span>
                <div style={{ flex: 1, height: '10px', background: 'var(--bg-surface-subtle)', borderRadius: '999px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <div style={{
                    width: `${pct}%`,
                    height: '100%',
                    background: stars >= 4 ? 'linear-gradient(90deg, #FF9F0A, #FFB340)' : stars === 3 ? '#FFB340' : '#FF453A',
                    borderRadius: '999px',
                    transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: stars >= 4 ? '0 1px 6px rgba(255, 159, 10, 0.35)' : 'none'
                  }} />
                </div>
                <span style={{ width: '85px', textAlign: 'right', fontWeight: '600', color: 'var(--text-muted)' }}>
                  {count} ({pct}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Customer Rating History Table Section */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '22px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              Customer Feedback & Reviews
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '3px', margin: 0 }}>
              All reviews and star ratings submitted by registered customers
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', width: '100%', maxWidth: '520px' }}>
            <input
              type="text"
              placeholder="Search customer name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                height: '40px',
                padding: '0 16px',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                fontSize: '13px',
                outline: 'none',
                background: '#FFFFFF',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)'
              }}
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                height: '40px',
                padding: '0 14px',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                fontSize: '13px',
                background: '#FFFFFF',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="highest">Sort: Highest Rating</option>
              <option value="lowest">Sort: Lowest Rating</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Submitted Rating</th>
                <th>Sentiment</th>
                <th style={{ textAlign: 'right' }}>Review Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredRaters.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-state">
                    {searchTerm ? 'No customer reviews match your search query.' : 'No customer ratings submitted for your store yet.'}
                  </td>
                </tr>
              ) : (
                filteredRaters.map((rater, index) => {
                  const sentiment = getRatingSentiment(rater.rating);
                  return (
                    <tr key={index}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            background: 'rgba(0, 113, 227, 0.08)',
                            border: '1px solid rgba(0, 113, 227, 0.22)',
                            color: '#0071E3',
                            fontWeight: '800',
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            {getInitials(rater.name)}
                          </div>
                          <div>
                            <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-main)' }}>
                              {rater.name}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                              {rater.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="rating-badge">
                          <span className="rating-badge-star">★</span>
                          {rater.rating} / 5
                        </span>
                      </td>

                      <td>
                        <span style={{
                          backgroundColor: sentiment.bg,
                          color: sentiment.color,
                          border: `1px solid ${sentiment.border}`,
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '700',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          {sentiment.text}
                        </span>
                      </td>

                      <td style={{ textAlign: 'right', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '500' }}>
                        {new Date(rater.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboard;
