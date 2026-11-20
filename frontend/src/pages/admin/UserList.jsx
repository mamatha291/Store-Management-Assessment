import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sortBy, setSortBy] = useState('created_at');
  const [order, setOrder] = useState('desc');

  // Right-side User Details Drawer state
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedUserId = searchParams.get('userId');
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [filters, sortBy, order]);

  // Fetch full user dossier whenever selectedUserId changes
  useEffect(() => {
    if (!selectedUserId) {
      setSelectedUser(null);
      setDetailError('');
      return;
    }

    async function fetchUserDetail() {
      setLoadingDetail(true);
      setDetailError('');
      try {
        const res = await api.get(`/users/${selectedUserId}`);
        setSelectedUser(res.data);
      } catch (err) {
        console.error('Failed to load user details:', err);
        setDetailError(err.response?.data?.message || 'Failed to load user dossier');
      } finally {
        setLoadingDetail(false);
      }
    }

    fetchUserDetail();
  }, [selectedUserId]);

  // Escape key closes details panel
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && selectedUserId) {
        closeDetails();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedUserId]);

  function openDetails(userId) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('userId', userId);
    setSearchParams(newParams);
  }

  function closeDetails() {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('userId');
    setSearchParams(newParams);
  }

  async function fetchUsers() {
    try {
      const params = { ...filters, sortBy, order };
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });
      const res = await api.get('/users', { params });
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
    setLoading(false);
  }

  function handleFilterChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  function clearFilters() {
    setFilters({ name: '', email: '', address: '', role: '' });
  }

  function handleSort(field) {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('asc');
    }
  }

  function getSortIndicator(field) {
    if (sortBy !== field) return null;
    return <span style={{ marginLeft: '4px', color: 'var(--primary)', fontWeight: '800' }}>{order === 'asc' ? '▲' : '▼'}</span>;
  }

  function renderRoleBadge(role) {
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

  const hasActiveFilters = filters.name || filters.email || filters.address || filters.role;

  const totalCount = users.length;
  const adminCount = users.filter(u => u.role === 'ADMIN').length;
  const ownerCount = users.filter(u => u.role === 'OWNER').length;
  const userCount = users.filter(u => u.role === 'USER').length;

  return (
    <div className="container">
      {/* Ambient Chromatic Backdrop Mesh for Glassmorphic Depth */}
      <div className="dashboard-ambient-mesh">
        <div className="ambient-mesh-orb orb-blue"></div>
        <div className="ambient-mesh-orb orb-emerald"></div>
        <div className="ambient-mesh-orb orb-amber"></div>
      </div>

      {/* Header */}
      <div className="page-header" style={{ position: 'relative', zIndex: 1 }}>
        <div>
          <h1 className="page-title dashboard-title-glow">Users Directory</h1>
          <p className="page-subtitle">Search, filter, sort, and manage all registered user accounts</p>
        </div>
        <Link to="/admin/users/new" className="btn btn-primary btn-apple-glow">
          + Add New User
        </Link>
      </div>

      {/* Quick Summary Pill Bar */}
      <div className="users-stats-bar">
        <div className="stat-pill">
          <span className="stat-pill-label">Total Users</span>
          <span className="stat-pill-val">{loading ? '...' : totalCount}</span>
        </div>
        <div className="stat-pill stat-pill-admin">
          <span className="stat-pill-label">Admins</span>
          <span className="stat-pill-val">{loading ? '...' : adminCount}</span>
        </div>
        <div className="stat-pill stat-pill-owner">
          <span className="stat-pill-label">Store Owners</span>
          <span className="stat-pill-val">{loading ? '...' : ownerCount}</span>
        </div>
        <div className="stat-pill stat-pill-user">
          <span className="stat-pill-label">Normal Users</span>
          <span className="stat-pill-val">{loading ? '...' : userCount}</span>
        </div>
      </div>

      {/* Search & Filters Toolbar */}
      <div className="filters-card">
        <div className="filters-header">
          <span className="filters-title">Filter User Accounts</span>
          {hasActiveFilters && (
            <button type="button" className="btn-clear-filters" onClick={clearFilters}>
              Reset Filters
            </button>
          )}
        </div>
        <div className="filters-grid">
          <input
            name="name"
            placeholder="Search by full name..."
            value={filters.name}
            onChange={handleFilterChange}
          />
          <input
            name="email"
            placeholder="Search by email..."
            value={filters.email}
            onChange={handleFilterChange}
          />
          <input
            name="address"
            placeholder="Search by address / city..."
            value={filters.address}
            onChange={handleFilterChange}
          />
          <select name="role" value={filters.role} onChange={handleFilterChange}>
            <option value="">All Roles (Admin, Owner, User)</option>
            <option value="ADMIN">System Administrator</option>
            <option value="OWNER">Store Owner</option>
            <option value="USER">Normal User</option>
          </select>
        </div>
      </div>

      {/* Split Layout: Table on Left + Details Panel on Right */}
      <div className="users-layout-split">
        {/* Left Column: Users Table */}
        <div className="users-table-column">
          <div className="table-container">
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className={`sortable ${sortBy === 'name' ? 'active-sort' : ''}`} onClick={() => handleSort('name')}>
                      User Profile{getSortIndicator('name')}
                    </th>
                    <th className={`sortable ${sortBy === 'email' ? 'active-sort' : ''}`} onClick={() => handleSort('email')}>
                      Email Address{getSortIndicator('email')}
                    </th>
                    <th className={`sortable ${sortBy === 'address' ? 'active-sort' : ''}`} onClick={() => handleSort('address')}>
                      Address{getSortIndicator('address')}
                    </th>
                    <th className={`sortable ${sortBy === 'role' ? 'active-sort' : ''}`} onClick={() => handleSort('role')}>
                      Role{getSortIndicator('role')}
                    </th>
                    <th style={{ textAlign: 'right', whiteSpace: 'nowrap', width: '140px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="empty-state">
                        Loading users list...
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-state">
                        No users found matching your search criteria
                        {hasActiveFilters && (
                          <div style={{ marginTop: '12px' }}>
                            <button type="button" className="btn btn-secondary btn-small" onClick={clearFilters}>
                              Clear Filters
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ) : (
                    users.map(u => {
                      const isSelected = selectedUserId == u.id;
                      return (
                        <tr
                          key={u.id}
                          className={isSelected ? 'active-selected-row' : ''}
                          onClick={() => openDetails(u.id)}
                          style={{ cursor: 'pointer' }}
                        >
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '50%',
                                background: u.role === 'ADMIN' ? 'rgba(0, 113, 227, 0.10)' : u.role === 'OWNER' ? 'rgba(52, 199, 89, 0.12)' : 'rgba(0, 0, 0, 0.05)',
                                border: u.role === 'ADMIN' ? '1px solid rgba(0, 113, 227, 0.25)' : u.role === 'OWNER' ? '1px solid rgba(52, 199, 89, 0.28)' : '1px solid rgba(0, 0, 0, 0.08)',
                                color: u.role === 'ADMIN' ? '#0071E3' : u.role === 'OWNER' ? '#248A3D' : '#1D1D1F',
                                fontWeight: '800',
                                fontSize: '13px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}>
                                {getInitials(u.name)}
                              </div>
                              <div>
                                <div className="user-display-name">{u.name}</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>ID #{u.id}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="user-email-text">{u.email}</span>
                          </td>
                          <td>
                            <span className="user-address-text" title={u.address}>
                              {u.address || 'N/A'}
                            </span>
                          </td>
                          <td>{renderRoleBadge(u.role)}</td>
                          <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isSelected) {
                                  closeDetails();
                                } else {
                                  openDetails(u.id);
                                }
                              }}
                              className={`btn btn-small ${isSelected ? 'btn-primary btn-apple-glow' : 'btn-secondary'}`}
                            >
                              {isSelected ? 'Viewing ✓' : 'View Details →'}
                            </button>
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

        {/* Right Column: Slide-in Animated User Details Panel */}
        {selectedUserId && (
          <div className="user-detail-panel-wrapper">
            <div className="user-detail-panel">
              {/* Top Bar with Badge and Close Button */}
              <div className="panel-top-bar">
                <div className="panel-badge">
                  <span className="badge-pulse-dot dot-blue"></span>
                  User Dossier • ID #{selectedUser?.id || selectedUserId}
                </div>
                <button
                  type="button"
                  className="btn-panel-close"
                  onClick={closeDetails}
                  title="Close details panel (Esc)"
                  aria-label="Close user details panel"
                >
                  ✕
                </button>
              </div>

              {/* Panel Body Content */}
              {loadingDetail ? (
                <div className="panel-loading-state">
                  <div className="panel-spinner"></div>
                  <span>Loading user profile dossier...</span>
                </div>
              ) : detailError ? (
                <div style={{ padding: '24px' }}>
                  <div className="error-msg">
                    <span>{detailError}</span>
                  </div>
                  <button type="button" className="btn btn-secondary btn-full" onClick={closeDetails}>
                    Close Panel
                  </button>
                </div>
              ) : selectedUser ? (
                <div className="panel-content-scroll">
                  {/* Hero Banner */}
                  <div className="panel-hero-banner">
                    <div className={`profile-avatar-glow ${selectedUser.role === 'ADMIN' ? 'profile-avatar-admin' : selectedUser.role === 'OWNER' ? 'profile-avatar-owner' : 'profile-avatar-user'}`} style={{ width: '60px', height: '60px', fontSize: '20px' }}>
                      {getInitials(selectedUser.name)}
                    </div>
                    <div className="panel-hero-info">
                      <h3 className="panel-user-name" title={selectedUser.name}>{selectedUser.name}</h3>
                      <div className="panel-user-email" title={selectedUser.email}>{selectedUser.email}</div>
                      <div style={{ marginTop: '8px' }}>
                        {renderRoleBadge(selectedUser.role)}
                      </div>
                    </div>
                  </div>

                  {/* Core Account Details */}
                  <div className="panel-section">
                    <div className="panel-section-title">Account Information</div>
                    <div className="panel-info-tile">
                      <span className="panel-info-label">Full Name</span>
                      <span className="panel-info-val">{selectedUser.name}</span>
                    </div>
                    <div className="panel-info-tile">
                      <span className="panel-info-label">Email Address</span>
                      <span className="panel-info-val">{selectedUser.email}</span>
                    </div>
                    <div className="panel-info-tile">
                      <span className="panel-info-label">Physical Address</span>
                      <span className="panel-info-val">{selectedUser.address || 'No physical address on file'}</span>
                    </div>
                    <div className="panel-info-tile">
                      <span className="panel-info-label">Member Since</span>
                      <span className="panel-info-val">
                        {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Role Specific: Store Owner Store Details */}
                  {selectedUser.role === 'OWNER' && (
                    <div className="panel-section">
                      <div className="panel-section-title">Assigned Storefront</div>
                      {selectedUser.store ? (
                        <div className="panel-store-card">
                          <div className="panel-store-header">
                            <div>
                              <div className="panel-store-name">{selectedUser.store.name}</div>
                              <div className="panel-store-email">{selectedUser.store.email}</div>
                            </div>
                            <span className="rating-badge">
                              <span className="rating-badge-star">★</span>
                              {Number(selectedUser.store.averageRating || 0).toFixed(1)} / 5
                            </span>
                          </div>
                          <div className="panel-store-address">{selectedUser.store.address}</div>
                        </div>
                      ) : (
                        <div className="panel-empty-box">No storefront currently assigned to this owner.</div>
                      )}
                    </div>
                  )}

                  {/* Role Specific: Normal User Submitted Ratings */}
                  {selectedUser.role === 'USER' && (
                    <div className="panel-section">
                      <div className="panel-section-title">
                        Submitted Store Ratings ({selectedUser.ratings ? selectedUser.ratings.length : 0})
                      </div>
                      {selectedUser.ratings && selectedUser.ratings.length > 0 ? (
                        <div className="panel-ratings-list">
                          {selectedUser.ratings.map(r => (
                            <div key={r.id} className="panel-rating-item">
                              <span className="panel-rating-store">{r.storeName}</span>
                              <span className="rating-badge">
                                <span className="rating-badge-star">★</span>
                                {r.rating} / 5
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="panel-empty-box">No store ratings submitted yet.</div>
                      )}
                    </div>
                  )}

                  {/* Panel Footer Action */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                    <Link to={`/admin/users/${selectedUser.id}`} className="btn btn-primary btn-apple-glow btn-full text-center">
                      Open Full Dossier Page ↗
                    </Link>
                    <button type="button" className="btn btn-secondary btn-full" onClick={closeDetails}>
                      Done Inspecting
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {/* Backdrop overlay for mobile drawer */}
      {selectedUserId && (
        <div className="user-panel-backdrop" onClick={closeDetails} aria-hidden="true"></div>
      )}
    </div>
  );
}

export default UserList;
