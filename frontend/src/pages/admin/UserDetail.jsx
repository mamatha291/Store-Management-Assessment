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

  function renderRole(role) {
    if (role === 'ADMIN') return <span className="user-role-text user-role-admin">Administrator</span>;
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
        <div className="loading-state">Loading user profile dossier...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container">
        <div className="error-msg">
          <span>{error || 'User not found'}</span>
        </div>
        <Link to="/admin/users" className="btn btn-outline">Back to Users Directory</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div className="page-header">
        <div>
          <Link to="/admin/users" style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-block', marginBottom: '8px' }}>
            ← Back to Users Directory
          </Link>
          <h1 className="page-title">User Account Dossier</h1>
          <p className="page-subtitle">Detailed account profile and associated activity for User #{user.id}</p>
        </div>
        <Link to="/admin/users" className="btn btn-outline">
          Back to Directory
        </Link>
      </div>

      {/* Main Profile Dossier Card */}
      <div className="detail-card">
        {/* Profile Card Header Banner */}
        <div style={{ padding: '24px', background: '#F8FAFC', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: user.role === 'ADMIN' ? 'rgba(0, 113, 227, 0.08)' : user.role === 'OWNER' ? 'rgba(52, 199, 89, 0.10)' : 'rgba(0, 0, 0, 0.05)',
            border: user.role === 'ADMIN' ? '1px solid rgba(0, 113, 227, 0.25)' : user.role === 'OWNER' ? '1px solid rgba(52, 199, 89, 0.28)' : '1px solid rgba(0, 0, 0, 0.10)',
            color: user.role === 'ADMIN' ? '#0071E3' : user.role === 'OWNER' ? '#248A3D' : '#1D1D1F',
            fontWeight: '900',
            fontSize: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {getInitials(user.name)}
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              {user.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{user.email}</span>
              <span>•</span>
              {renderRole(user.role)}
            </div>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Full Name</div>
          <div className="detail-value" style={{ fontWeight: '700' }}>{user.name}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Email Address</div>
          <div className="detail-value">{user.email}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Account Role</div>
          <div className="detail-value">{renderRole(user.role)}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Registered Address</div>
          <div className="detail-value">{user.address || 'No address registered'}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Member Since</div>
          <div className="detail-value">
            {user.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
          </div>
        </div>

        {/* Store Owner specific info */}
        {user.role === 'OWNER' && (
          <>
            <div className="detail-row" style={{ backgroundColor: 'var(--bg-surface-subtle)' }}>
              <div className="detail-label" style={{ fontWeight: '800', color: 'var(--text-main)' }}>
                Assigned Store
              </div>
              <div className="detail-value" style={{ fontWeight: '800', color: 'var(--primary)' }}>
                {user.store ? user.store.name : 'No store assigned yet'}
              </div>
            </div>

            {user.store && (
              <>
                <div className="detail-row">
                  <div className="detail-label">Store Email</div>
                  <div className="detail-value">{user.store.email}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Store Location</div>
                  <div className="detail-value">{user.store.address}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Store Rating</div>
                  <div className="detail-value">
                    <span className="rating-badge">
                      <span className="rating-badge-star">★</span>
                      {Number(user.store.averageRating).toFixed(1)} / 5
                    </span>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* Normal user submitted ratings info */}
        {user.role === 'USER' && user.ratings && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '12px', color: 'var(--text-main)' }}>
              Submitted Store Ratings ({user.ratings.length})
            </h3>
            {user.ratings.length === 0 ? (
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>This user has not submitted any store ratings yet.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {user.ratings.map(r => (
                  <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-main)' }}>{r.storeName}</span>
                    <span className="rating-badge">
                      <span className="rating-badge-star">★</span>
                      {r.rating} / 5
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDetail;
