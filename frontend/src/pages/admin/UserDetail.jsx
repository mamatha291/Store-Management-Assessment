import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';

function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUser();
  }, [id]);

  async function fetchUser() {
    try {
      const res = await api.get(`/users/${id}`);
      setUser(res.data);
    } catch (err) {
      setError('Failed to load user profile details');
    }
    setLoading(false);
  }

  function renderRoleBadge(role) {
    if (role === 'ADMIN') return <span className="user-role-text user-role-admin">System Administrator</span>;
    if (role === 'OWNER') return <span className="user-role-text user-role-owner">Store Owner</span>;
    return <span className="user-role-text user-role-user">Normal User</span>;
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
      <div className="container">
        <div className="dashboard-ambient-mesh">
          <div className="ambient-mesh-orb orb-blue"></div>
          <div className="ambient-mesh-orb orb-emerald"></div>
          <div className="ambient-mesh-orb orb-amber"></div>
        </div>
        <div className="loading-state">Loading user profile dossier...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container">
        <div className="dashboard-ambient-mesh">
          <div className="ambient-mesh-orb orb-blue"></div>
          <div className="ambient-mesh-orb orb-emerald"></div>
          <div className="ambient-mesh-orb orb-amber"></div>
        </div>
        <Link to="/admin/users" className="page-breadcrumb">
          ← Back to Users Directory
        </Link>
        <div className="error-msg">
          <span>{error || 'User not found in system directory'}</span>
        </div>
        <Link to="/admin/users" className="btn btn-secondary btn-apple-glow">
          Return to Users Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Ambient Chromatic Backdrop Mesh for Glassmorphic Depth */}
      <div className="dashboard-ambient-mesh">
        <div className="ambient-mesh-orb orb-blue"></div>
        <div className="ambient-mesh-orb orb-emerald"></div>
        <div className="ambient-mesh-orb orb-amber"></div>
      </div>

      {/* Standalone Breadcrumb Pill - completely separated to prevent any overlap */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <Link to="/admin/users" className="page-breadcrumb">
          ← Back to Users Directory
        </Link>
      </div>

      {/* Page Header */}
      <div className="page-header" style={{ position: 'relative', zIndex: 1, marginTop: '4px' }}>
        <div>
          <h1 className="page-title dashboard-title-glow">User Account Dossier</h1>
          <p className="page-subtitle">Detailed account profile, verified credentials, and associated storefront telemetry</p>
        </div>
        <Link to="/admin/users" className="btn btn-secondary btn-apple-glow">
          Back to Directory
        </Link>
      </div>

      {/* Glassmorphic User Dossier Master Card */}
      <div className="profile-card-glass">
        {/* Profile Hero Header Banner */}
        <div className="profile-hero-banner">
          <div className={`profile-avatar-glow ${user.role === 'ADMIN' ? 'profile-avatar-admin' : user.role === 'OWNER' ? 'profile-avatar-owner' : 'profile-avatar-user'}`}>
            {getInitials(user.name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.024em' }}>
                {user.name}
              </h2>
              <span className="rating-badge" style={{ background: 'rgba(0, 113, 227, 0.1)', color: '#0071E3', borderColor: 'rgba(0, 113, 227, 0.25)' }}>
                User #{user.id}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>{user.email}</span>
              <span style={{ color: 'var(--text-subtle)' }}>•</span>
              {renderRoleBadge(user.role)}
              <span style={{ color: 'var(--text-subtle)' }}>•</span>
              <span className="registration-date-badge">
                <span style={{ fontSize: '12px' }}>📅</span>
                Registered: {user.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Bento Information Grid */}
        <div className="profile-bento-grid">
          <div className="profile-bento-tile">
            <div className="profile-bento-label">Full Legal Name</div>
            <div className="profile-bento-value">{user.name}</div>
          </div>

          <div className="profile-bento-tile">
            <div className="profile-bento-label">Official Email Address</div>
            <div className="profile-bento-value">{user.email}</div>
          </div>

          <div className="profile-bento-tile">
            <div className="profile-bento-label">Platform Role & Privileges</div>
            <div className="profile-bento-value">
              {user.role === 'ADMIN' ? 'System Administrator' : user.role === 'OWNER' ? 'Store Owner' : 'Normal Customer'}
            </div>
          </div>

          <div className="profile-bento-tile">
            <div className="profile-bento-label">Registered / Delivery Address</div>
            <div className="profile-bento-value" style={{ fontSize: '14px', lineHeight: '1.45' }}>
              {user.address || 'No physical address specified'}
            </div>
          </div>

          <div className="profile-bento-tile">
            <div className="profile-bento-label">Account Registration Date</div>
            <div className="profile-bento-value">
              {user.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
            </div>
          </div>
        </div>

        {/* Role Specific: Store Owner Store Details */}
        {user.role === 'OWNER' && (
          <div style={{ padding: '0 30px 30px 30px' }}>
            <div style={{ fontSize: '12.5px', fontWeight: '750', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Assigned Storefront Information
            </div>
            {user.store ? (
              <div className="panel-store-card" style={{ padding: '22px 24px', borderRadius: '22px' }}>
                <div className="panel-store-header">
                  <div>
                    <div style={{ fontSize: '19px', fontWeight: '800', color: 'var(--text-main)' }}>
                      {user.store.name}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {user.store.email}
                    </div>
                  </div>
                  <span className="rating-badge" style={{ padding: '6px 14px', fontSize: '14px' }}>
                    <span className="rating-badge-star" style={{ fontSize: '15px' }}>★</span>
                    {Number(user.store.averageRating || 0).toFixed(1)} / 5.0
                  </span>
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-main)', marginTop: '8px' }}>
                  {user.store.address}
                </div>
                <div style={{ marginTop: '16px' }}>
                  <Link to="/admin/stores" className="btn btn-secondary btn-small">
                    View in Store Directory →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="panel-empty-box" style={{ padding: '24px' }}>
                No storefront currently linked to this owner account.
              </div>
            )}
          </div>
        )}

        {/* Role Specific: Normal User Submitted Ratings */}
        {user.role === 'USER' && (
          <div style={{ padding: '0 30px 30px 30px' }}>
            <div style={{ fontSize: '12.5px', fontWeight: '750', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Submitted Store Ratings ({user.ratings ? user.ratings.length : 0})
            </div>
            {user.ratings && user.ratings.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                {user.ratings.map(r => (
                  <div key={r.id} className="panel-rating-item" style={{ padding: '14px 18px', borderRadius: '16px' }}>
                    <span className="panel-rating-store">{r.storeName}</span>
                    <span className="rating-badge">
                      <span className="rating-badge-star">★</span>
                      {r.rating} / 5
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="panel-empty-box" style={{ padding: '24px' }}>
                This user has not submitted any store reviews yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDetail;
