import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sortBy, setSortBy] = useState('created_at');
  const [order, setOrder] = useState('desc');

  useEffect(() => {
    fetchUsers();
  }, [filters, sortBy, order]);

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
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Users Directory</h1>
          <p className="page-subtitle">Search, filter, sort, and manage all registered user accounts</p>
        </div>
        <Link to="/admin/users/new" className="btn btn-primary">
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

      {/* Users Table */}
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
                <th style={{ textAlign: 'right', whiteSpace: 'nowrap', width: '130px' }}>Actions</th>
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
                users.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: u.role === 'ADMIN' ? 'rgba(0, 113, 227, 0.08)' : u.role === 'OWNER' ? 'rgba(52, 199, 89, 0.10)' : 'rgba(0, 0, 0, 0.05)',
                          border: u.role === 'ADMIN' ? '1px solid rgba(0, 113, 227, 0.2)' : u.role === 'OWNER' ? '1px solid rgba(52, 199, 89, 0.25)' : '1px solid rgba(0, 0, 0, 0.08)',
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
                      <Link to={`/admin/users/${u.id}`} className="btn btn-secondary btn-small">
                        View Details →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserList;
