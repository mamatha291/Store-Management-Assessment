import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function Profile() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(user);

  const [showResetModal, setShowResetModal] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch full fresh user details on mount
  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await api.get('/auth/me');
        if (res.data) {
          setProfileData(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        }
      } catch (err) {
        console.error('Failed to fetch user profile details:', err);
      }
    }
    fetchMe();
  }, []);

  function validatePassword(pwd) {
    if (pwd.length < 8 || pwd.length > 16) {
      return 'New password must be between 8 and 16 characters';
    }
    if (!/[A-Z]/.test(pwd)) {
      return 'New password must contain at least one uppercase letter (A-Z)';
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) {
      return 'New password must contain at least one special character (!@#$...)';
    }
    return null;
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword) {
      setError('Please enter your current password');
      return;
    }

    const pwdError = validatePassword(newPassword);
    if (pwdError) {
      setError(pwdError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.put('/auth/password', { currentPassword, newPassword });
      setSuccess(res.data.message || 'Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowResetModal(false);
        setSuccess('');
      }, 1800);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password. Please check your current password.');
    } finally {
      setSubmitting(false);
    }
  }

  function getInitials(name) {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  const currentUser = profileData || user;
  if (!currentUser) return null;

  return (
    <div className="container">
      {/* Ambient Chromatic Backdrop Mesh for Glassmorphic Depth */}
      <div className="dashboard-ambient-mesh">
        <div className="ambient-mesh-orb orb-blue"></div>
        <div className="ambient-mesh-orb orb-emerald"></div>
        <div className="ambient-mesh-orb orb-amber"></div>
      </div>

      <div className="page-header" style={{ position: 'relative', zIndex: 1, textAlign: 'center', justifyContent: 'center' }}>
        <div>
          <h1 className="page-title dashboard-title-glow">Account Profile & Security</h1>
          <p className="page-subtitle">Manage personal credentials, registered address, and cryptographic security settings</p>
        </div>
      </div>

      {/* User Details Glassmorphic Bento Card */}
      <div className="profile-card-glass">
        {/* Profile Hero Header Banner */}
        <div className="profile-hero-banner">
          <div className={`profile-avatar-glow ${currentUser.role === 'ADMIN' ? 'profile-avatar-admin' : currentUser.role === 'OWNER' ? 'profile-avatar-owner' : 'profile-avatar-user'}`}>
            {getInitials(currentUser.name)}
          </div>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
              {currentUser.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>{currentUser.email}</span>
              <span style={{ color: 'var(--text-subtle)' }}>•</span>
              {currentUser.role === 'ADMIN' ? (
                <span className="user-role-plain-text">System Administrator</span>
              ) : (
                <span className={`user-role-text ${currentUser.role === 'OWNER' ? 'user-role-owner' : 'user-role-user'}`}>
                  {currentUser.role === 'OWNER' ? 'Store Owner' : 'Normal Customer'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bento Information Grid */}
        <div className="profile-bento-grid">
          <div className="profile-bento-tile">
            <div className="profile-bento-label">Full Legal Name</div>
            <div className="profile-bento-value">{currentUser.name}</div>
          </div>

          <div className="profile-bento-tile">
            <div className="profile-bento-label">Primary Email Address</div>
            <div className="profile-bento-value">{currentUser.email}</div>
          </div>

          <div className="profile-bento-tile">
            <div className="profile-bento-label">Platform Role & Privileges</div>
            <div className="profile-bento-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{currentUser.role === 'ADMIN' ? 'System Administrator' : currentUser.role === 'OWNER' ? 'Store Owner' : 'Normal Customer'}</span>
            </div>
          </div>

          <div className="profile-bento-tile">
            <div className="profile-bento-label">Registered / Delivery Address</div>
            <div className="profile-bento-value" style={{ fontSize: '14px', lineHeight: '1.45' }}>
              {currentUser.address || 'No physical address specified'}
            </div>
          </div>
        </div>

        {/* Security & Password Action Bar */}
        <div className="profile-security-card">
          <div>
            <div style={{ fontSize: '15px', fontWeight: '750', color: 'var(--text-main)' }}>
              Account Credentials & Security
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '3px' }}>
              Bcrypt cryptographic salted hash protects your access credentials
            </div>
          </div>

          <button 
            type="button" 
            className="btn btn-primary btn-apple-glow"
            onClick={() => {
              setError('');
              setSuccess('');
              setShowResetModal(true);
            }}
          >
            Change Account Password
          </button>
        </div>
      </div>

      {/* Reset Password Glassmorphic Modal */}
      {showResetModal && (
        <div className="profile-modal-overlay">
          <div className="profile-modal-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
                Change Password
              </h3>
              <button 
                type="button" 
                onClick={() => setShowResetModal(false)}
                style={{
                  background: 'rgba(0, 0, 0, 0.05)',
                  border: 'none',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  fontSize: '15px',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s ease'
                }}
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="error-msg">
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="success-msg">
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <div className="password-input-wrapper">
                  <input
                    id="currentPassword"
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowCurrent(!showCurrent)}
                    aria-label={showCurrent ? 'Hide password' : 'Show password'}
                  >
                    {showCurrent ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">
                  New Password
                  <span className="label-hint">(8-16 chars, 1 uppercase, 1 special)</span>
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="newPassword"
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowNew(!showNew)}
                    aria-label={showNew ? 'Hide password' : 'Show password'}
                  >
                    {showNew ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <div className="password-input-wrapper">
                  <input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowResetModal(false)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-apple-glow"
                  disabled={submitting}
                  style={{ flex: 1 }}
                >
                  {submitting ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
