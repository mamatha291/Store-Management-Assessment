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
    <div className="container" style={{ maxWidth: '640px' }}>
      <div className="page-header" style={{ textAlign: 'center', justifyContent: 'center' }}>
        <div>
          <h1 className="page-title">Account Profile</h1>
          <p className="page-subtitle">Manage your personal credentials, address, and account security</p>
        </div>
      </div>

      {/* User Details Card */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{
          padding: '28px 24px',
          background: '#FAFAFC',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '18px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: currentUser.role === 'ADMIN' ? 'linear-gradient(135deg, #0071E3, #47A3FF)' : currentUser.role === 'OWNER' ? 'linear-gradient(135deg, #34C759, #30D158)' : 'linear-gradient(135deg, #1D1D1F, #424245)',
            color: '#FFFFFF',
            fontWeight: '700',
            fontSize: '22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(0,0,0,0.08)'
          }}>
            {getInitials(currentUser.name)}
          </div>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              {currentUser.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{currentUser.email}</span>
              <span>•</span>
              <span className={`user-role-text ${currentUser.role === 'ADMIN' ? 'user-role-admin' : currentUser.role === 'OWNER' ? 'user-role-owner' : 'user-role-user'}`}>
                {currentUser.role === 'ADMIN' ? 'Administrator' : currentUser.role === 'OWNER' ? 'Store Owner' : 'Normal Customer'}
              </span>
            </div>
          </div>
        </div>

        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                Full Legal Name
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)', marginTop: '4px' }}>
                {currentUser.name}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                Email Address
              </div>
              <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-main)', marginTop: '4px' }}>
                {currentUser.email}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                System Role
              </div>
              <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-main)', marginTop: '4px' }}>
                {currentUser.role === 'ADMIN' ? 'System Administrator' : currentUser.role === 'OWNER' ? 'Store Owner' : 'Normal Customer'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                Delivery / Registered Address
              </div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-main)', marginTop: '4px', lineHeight: '1.5' }}>
                {currentUser.address || 'No address specified'}
              </div>
            </div>
          </div>

          {/* Action Button: Reset Password */}
          <button 
            type="button" 
            className="btn btn-primary btn-full"
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

      {/* Reset Password Modal */}
      {showResetModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.55)',
          backdropFilter: 'blur(6px)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            maxWidth: '460px',
            width: '100%',
            padding: '28px',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                Change Password
              </h3>
              <button 
                type="button" 
                onClick={() => setShowResetModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: 'var(--text-muted)' }}
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

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
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
                  className="btn btn-primary"
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
