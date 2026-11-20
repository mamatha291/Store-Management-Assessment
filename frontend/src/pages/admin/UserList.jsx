import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../context/AuthContext';
import { AppleButton, useAppleEntrance, AppleCard } from '../../components/AppleComponents';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sortBy, setSortBy] = useState('created_at');
  const [order, setOrder] = useState('desc');
  const { user } = useAuth();

  useEffect(() => {
    fetchUsers();
    useAppleEntrance({ selector: '.user-row', delayPerItem: 30 });
  }, [filters, sortBy, order, user]);

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
    return <span style={{ marginLeft: '4px', color: 'var(--apple-text-tertiary)', fontWeight: '800' }}>{order === 'asc' ? '▲' : '▼'}</span>;
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
          <h1 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--apple-text-primary)', margin: 0 }}>Users Directory</h1>
          <AppleButton variant="primary" size="small" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>Add User</AppleButton>
        </div>
      </header>

      <main style={{ padding: 'var(--space-6) var(--space-8)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <h1 className="page-title" style={{ fontSize: '24px', fontWeight: '800', color: 'var(--apple-text-primary)', margin: 0 }}>Users Directory</h1>
            <p className="page-subtitle" style={{ fontSize: '13px', color: 'var(--apple-text-secondary)' }}>Search, filter, sort, and manage all registered user accounts</p>
          </div>

          {/* Quick Summary Pill Bar */}
          <div style={{ background: 'var(--apple-bg-secondary)', borderRadius: 'var(--radius-full)', padding: 'var(--space-3) var(--space-4)', marginBottom: 'var(--space-4)' }}>
            <div style={{ display: 'inline-flex', gap: '16px', fontSize: '13px', fontWeight: '600', color: 'var(--apple-text-primary)' }}>
              <span style={{ color: 'var(--apple-text-tertiary)' }}>Total Users</span>
              <span style={{ color: 'var(--apple-text-primary)' }}>{loading ? '...' : totalCount}</span>
            </div>
            <div style={{ display: 'inline-flex', gap: '16px', fontSize: '13px', fontWeight: '600', color: 'var(--apple-blue)' }}>
              <span style={{ color: 'var(--apple-text-tertiary)' }}>Admins</span>
              <span style={{ color: 'var(--apple-text-primary)' }}>{loading ? '...' : adminCount}</span>
            </div>
            <div style={{ display: 'inline-flex', gap: '16px', fontSize: '13px', fontWeight: '600', color: 'var(--apple-green)' }}>
              <span style={{ color: 'var(--apple-text-tertiary)' }}>Owners</span>
              <span style={{ color: 'var(--apple-text-primary)' }}>{loading ? '...' : ownerCount}</span>
            </div>
            <div style={{ display: 'inline-flex', gap: '16px', fontSize: '13px', fontWeight: '600', color: 'var(--apple-text-secondary)' }}>
              <span style={{ color: 'var(--apple-text-tertiary)' }}>Users</span>
              <span style={{ color: 'var(--apple-text-primary)' }}>{loading ? '...' : userCount}</span>
            </div>
          </div>

          {/* Search & Filters Toolbar */}
          <div style={{ background: 'var(--apple-bg-secondary)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', border: '1px solid var(--apple-divider)', marginBottom: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
              <span className="filters-title" style={{ fontSize: '14px', fontWeight: '600', color: 'var(--apple-text-primary)' }}>Filter User Accounts</span>
              {hasActiveFilters && (
                <button style={{
                  background: 'none', border: 'none', color: 'var(--apple-blue)', fontSize: '13px', cursor: 'pointer', padding: 'var(--space-1) var(--space-2)', borderRadius: 'var(--radius-sm)', fontWeight: '500'
                }}>Reset Filters</button>
              )}
            </div>
            <div className="filters-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-3)' }}>
              <input
                name="name"
                placeholder="Search by full name..."
                value={filters.name}
                onChange={handleFilterChange}
                style={{
                  padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--apple-divider)', fontSize: '13px', width: '100%', background: 'var(--apple-bg-primary)', color: 'var(--apple-text-primary)'
                }}
              />
              <input
                name="email"
                placeholder="Search by email..."
                value={filters.email}
                onChange={handleFilterChange}
                style={{
                  padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--apple-divider)', fontSize: '13px', width: '100%', background: 'var(--apple-bg-primary)', color: 'var(--apple-text-primary)'
                }}
              />
              <input
                name="address"
                placeholder="Search by address / city..."
                value={filters.address}
                onChange={handleFilterChange}
                style={{
                  padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--apple-divider)', fontSize: '13px', width: '100%', background: 'var(--apple-bg-primary)', color: 'var(--apple-text-primary)'
                }}
              />
              <select name="role" value={filters.role} onChange={handleFilterChange}
                style={{
                  padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--apple-divider)', fontSize: '13px', width: '100%', background: 'var(--apple-bg-primary)', color: 'var(--apple-text-primary)', cursor: 'pointer'
                }}>
                <option value="">All Roles (Admin, Owner, User)</option>
                <option value="ADMIN">System Administrator</option>
                <option value="OWNER">Store Owner</option>
                <option value="USER">Normal User</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div style={{ overflowX: 'auto', '-webkitOverflowScrolling': 'touch' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: '13px' }}>
              <thead>
                <tr>
                  <th className={`sortable ${sortBy === 'name' ? 'active-sort' : ''}`} style={{ padding: 'var(--space-4)', color: 'var(--apple-text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '11px', borderBottom: '2px solid var(--apple-divider)' }} onClick={() => handleSort('name')}>
                    User Profile{getSortIndicator('name')}
                  </th>
                  <th className={`sortable ${sortBy === 'email' ? 'active-sort' : ''}`} style={{ padding: 'var(--space-4)', color: 'var(--apple-text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '11px', borderBottom: '2px solid var(--apple-divider)' }} onClick={() => handleSort('email')}>
                    Email Address{getSortIndicator('email')}
                  </th>
                  <th className={`sortable ${sortBy === 'address' ? 'active-sort' : ''}`} style={{ padding: 'var(--space-4)', color: 'var(--apple-text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '11px', borderBottom: '2px solid var(--apple-divider)' }} onClick={() => handleSort('address')}>
                    Address{getSortIndicator('address')}
                  </th>
                  <th className={`sortable ${sortBy === 'role' ? 'active-sort' : ''}`} style={{ padding: 'var(--space-4)', color: 'var(--apple-text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '11px', borderBottom: '2px solid var(--apple-divider)' }} onClick={() => handleSort('role')}>
                    Role{getSortIndicator('role')}
                  </th>
                  <th style={{ textAlign: 'right', whiteSpace: 'nowrap', width: '130px', padding: 'var(--space-4)', color: 'var(--apple-text-secondary)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>Loading users list...</td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--apple-text-secondary)' }}>No users found matching your search criteria</td>
                  </tr>
                ) : (
                  users.map(u => (
                    <tr key={u.id} style={{ transition: 'background 200ms ease' }}>
                      <td style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-4)' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          background: u.role === 'ADMIN' ? 'rgba(0, 113, 227, 0.08)' : u.role === 'OWNER' ? 'rgba(52, 199, 89, 0.10)' : 'rgba(0, 0, 0, 0.05)',
                          border: u.role === 'ADMIN' ? '1px solid rgba(0, 113, 227, 0.2)' : u.role === 'OWNER' ? '1px solid rgba(52, 199, 89, 0.25)' : '1px solid rgba(0, 0, 0, 0.08)',
                          color: u.role === 'ADMIN' ? '#0071E3' : u.role === 'OWNER' ? '#248A3D' : '#1D1D1F',
                          fontWeight: '800', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                          {getInitials(u.name)}
                        </div>
                        <div>
                          <div className="user-display-name" style={{ fontWeight: '700', color: 'var(--apple-text-primary)', fontSize: '14px' }}>{u.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--apple-text-tertiary)' }}>ID #{u.id}</div>
                        </div>
                      </div>
                      <td style={{ padding: 'var(--space-4)', color: 'var(--apple-text-primary)' }}>
                        <span className="user-email-text" style={{ color: 'var(--apple-text-secondary)', fontSize: '13px' }}>{u.email}</span>
                      </td>
                      <td style={{ padding: 'var(--space-4)', color: 'var(--apple-text-secondary)' }}>
                        <span className="user-address-text" style={{ color: 'var(--apple-text-secondary)', fontSize: '13px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={u.address}>{u.address || 'N/A'}</span>
                      </td>
                      <td style={{ padding: 'var(--space-4)', color: 'var(--apple-text-secondary)' }}>
                        {renderRoleBadge(u.role)}
                      </td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap', padding: 'var(--space-4)' }}>
                        <AppleButton variant="outline" size="small" style={{ padding: 'var(--space-2) var(--space-3)' }}>
                          View Details
                        </AppleButton>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default UserList;