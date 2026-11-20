import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { motion, AppleButton, AppleCard, AppleField, AppleModal, ToastProvider, useToast } from '../components/AppleComponents';

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
  const { showToast } = useToast();

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
      showToast('Password updated successfully', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowResetModal(false);
        setSuccess('');
      }, 1800);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password. Please check your current password.');
      showToast('Failed to update password', 'error');
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
    <ToastProvider>
      <div className="container" style={{ maxWidth: '640px', padding: '40px 20px' }}>
        <motion.revealFrom direction="down" duration={500}>
          <div className="page-header" style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 className="page-title">Account Profile</h1>
            <p className="page-subtitle">Manage your personal credentials, address, and security</p>
          </div>
        </motion.revealFrom>

        <motion.revealFrom direction="up" duration={500} delay={100}>
          <AppleCard glass={true} style={{ padding: '0', overflow: 'hidden' }}>
            {/* Header with gradient avatar */}
            <div style={{
              padding: '32px 24px',
              background: 'linear-gradient(135deg, #F5F5F7 0%, #FFFFFF 100%)',
              borderBottom: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              gap: '20px'
            }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: currentUser.role === 'ADMIN' ? 'linear-gradient(135deg, #0071E3, #47A3FF)' : currentUser.role === 'OWNER' ? 'linear-gradient(135deg, #34C759, #30D158)' : 'linear-gradient(135deg, #1D1D1F, #424245)',
                color: '#FFFFFF',
                fontWeight: '700',
                fontSize: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
              }}>
                {getInitials(currentUser.name)}
              </div>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 4px' }}>
                  {currentUser.name}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{currentUser.email}</span>
                  <span style={{ color: 'var(--text-muted)' }}>•</span>
                  <span className="badge badge-accent">
                    {currentUser.role === 'ADMIN' ? 'Administrator' : currentUser.role === 'OWNER' ? 'Store Owner' : 'Customer'}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile fields list */}
            <div style={{ padding: '28px 24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                    Full Name
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-main)', marginTop: '4px' }}>
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
                    Role
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-main)', marginTop: '4px' }}>
                    {currentUser.role === 'ADMIN' ? 'System Administrator' : currentUser.role === 'OWNER' ? 'Store Owner' : 'Customer'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                    Address
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-main)', marginTop: '4px', lineHeight: '1.5' }}>
                    {currentUser.address || 'No address specified'}
                  </div>
                </div>
              </div>

              <AppleButton
                fullWidth={true}
                onClick={() => {
                  setError('');
                  setSuccess('');
                  setShowResetModal(true);
                }}
              >
                Change Account Password
              </AppleButton>
            </div>
          </AppleCard>
        </motion.revealFrom>

        {/* Apple Password Modal */}
        <AppleModal
          isOpen={showResetModal}
          onClose={() => setShowResetModal(false)}
          title="Change Password"
        >
          {error && (
            <div style={{
              background: 'rgba(255, 59, 48, 0.1)',
              border: '1px solid rgba(255, 59, 48, 0.3)',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '16px',
              fontSize: '13px',
              color: 'var(--danger)'
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              background: 'rgba(52, 199, 89, 0.1)',
              border: '1px solid rgba(52, 199, 89, 0.3)',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '16px',
              fontSize: '13px',
              color: 'var(--success)'
            }}>
              {success}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <AppleField
              label="Current Password"
              id="currentPassword"
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              required
            />

            <AppleField
              label="New Password"
              id="newPassword"
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              hint="(8-16 chars, 1 uppercase, 1 special)"
              required
            />

            <AppleField
              label="Confirm New Password"
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              required
            />

            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <AppleButton
                variant="secondary"
                onClick={() => setShowResetModal(false)}
                style={{ flex: 1 }}
              >
                Cancel
              </AppleButton>
              <AppleButton
                type="submit"
                disabled={submitting}
                style={{ flex: 1 }}
              >
                {submitting ? 'Updating...' : 'Update Password'}
              </AppleButton>
            </div>
          </form>
        </AppleModal>
      </div>
    </ToastProvider>
  );
}

export default Profile;