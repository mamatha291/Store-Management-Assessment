import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { AppleButton, AppleCard } from '../../components/AppleComponents';

function StoreListAdmin() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');

  useEffect(() => {
    fetchStores();
  }, [filters, sortBy, order]);

  async function fetchStores() {
    try {
      const params = { ...filters, sortBy, order };
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });
      const res = await api.get('/stores/admin', { params });
      setStores(res.data);
    } catch (err) {
      console.error('Failed to fetch stores:', err);
    }
    setLoading(false);
  }

  function handleFilterChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  function clearFilters() {
    setFilters({ name: '', email: '', address: '' });
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

  const hasActiveFilters = filters.name || filters.email || filters.address;

  const totalStores = stores.length;
  const topRatedCount = stores.filter(s => s.rating >= 4.0).length;
  const avgPlatformRating = totalStores > 0
    ? (stores.reduce((acc, curr) => acc + curr.rating, 0) / totalStores).toFixed(1)
    : '0.0';

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
          <h1 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--apple-text-primary)', margin: 0 }}>Store Directory</h1>
          <AppleButton variant="success" size="small">Add Store</AppleButton>
        </div>
      </header>

      <main style={{ padding: 'var(--space-6) var(--space-8)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Page Header */}
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <h1 className="page-title" style={{ fontSize: '24px', fontWeight: '800', color: 'var(--apple-text-primary)', margin: 0 }}>Store Directory</h1>
            <p className="page-subtitle" style={{ fontSize: '13px', color: 'var(--apple-text-secondary)' }}>Search, filter, and inspect registered stores, locations, and average ratings</p>
          </div>

          {/* Summary Stat Pills */}
          <div style={{ background: 'var(--apple-bg-secondary)', borderRadius: 'var(--radius-full)', padding: 'var(--space-3) var(--space-4)', marginBottom: 'var(--space-4)' }}>
            <div style={{ display: 'inline-flex', gap: '16px', fontSize: '13px', fontWeight: '600', color: 'var(--apple-text-primary)' }}>
              <span style={{ color: 'var(--apple-text-tertiary)' }}>Total Stores</span>
              <span style={{ color: 'var(--apple-text-primary)' }}>{loading ? '...' : totalStores}</span>
            </div>
            <div style={{ display: 'inline-flex', gap: '16px', fontSize: '13px', fontWeight: '600', color: 'var(--apple-green)' }}>
              <span style={{ color: 'var(--apple-text-tertiary)' }}>Top Rated (≥4.0★)</span>
              <span style={{ color: 'var(--apple-text-primary)' }}>{loading ? '...' : topRatedCount}</span>
            </div>
            <div style={{ display: 'inline-flex', gap: '16px', fontSize: '13px', fontWeight: '600', color: 'var(--apple-yellow)' }}>
              <span style={{ color: 'var(--apple-text-tertiary)' }}>Platform Avg Rating</span>
              <span style={{ color: 'var(--apple-text-primary)' }}>{loading ? '...' : `${avgPlatformRating} / 5`}</span>
            </div>
          </div>

          {/* Filters Toolbar */}
          <div style={{ background: 'var(--apple-bg-secondary)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', border: '1px solid var(--apple-divider)', marginBottom: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--apple-text-primary)' }}>Filter Store Listings</span>
              {hasActiveFilters && (
                <button style={{
                  background: 'none', border: 'none', color: 'var(--apple-blue)', fontSize: '13px', cursor: 'pointer', padding: 'var(--space-1) var(--space-2)', borderRadius: 'var(--radius-sm)', fontWeight: '500'
                }}>Reset Filters</button>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-3)' }}>
              <input
                name="name"
                placeholder="Search by store name..."
                value={filters.name}
                onChange={handleFilterChange}
                style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--apple-divider)', fontSize: '13px', width: '100%', background: 'var(--apple-bg-primary)', color: 'var(--apple-text-primary)' }}
              />
              <input
                name="email"
                placeholder="Search by store email..."
                value={filters.email}
                onChange={handleFilterChange}
                style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--apple-divider)', fontSize: '13px', width: '100%', background: 'var(--apple-bg-primary)', color: 'var(--apple-text-primary)' }}
              />
              <input
                name="address"
                placeholder="Search by store address / city..."
                value={filters.address}
                onChange={handleFilterChange}
                style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--apple-divider)', fontSize: '13px', width: '100%', background: 'var(--apple-bg-primary)', color: 'var(--apple-text-primary)' }}
              />
            </div>
          </div>

          {/* Stores Table */}
          <div style={{ overflowX: 'auto', '-webkitOverflowScrolling': 'touch' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: '13px' }}>
              <thead>
                <tr>
                  <th className={`sortable ${sortBy === 'name' ? 'active-sort' : ''}`} style={{ padding: 'var(--space-4)', color: 'var(--apple-text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '11px', borderBottom: '2px solid var(--apple-divider)' }} onClick={() => handleSort('name')}>
                    Store Name{getSortIndicator('name')}
                  </th>
                  <th className={`sortable ${sortBy === 'email' ? 'active-sort' : ''}`} style={{ padding: 'var(--space-4)', color: 'var(--apple-text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '11px', borderBottom: '2px solid var(--apple-divider)' }} onClick={() => handleSort('email')}>
                    Store Email{getSortIndicator('email')}
                  </th>
                  <th className={`sortable ${sortBy === 'address' ? 'active-sort' : ''}`} style={{ padding: 'var(--space-4)', color: 'var(--apple-text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '11px', borderBottom: '2px solid var(--apple-divider)' }} onClick={() => handleSort('address')}>
                    Physical Address{getSortIndicator('address')}
                  </th>
                  <th className={`sortable ${sortBy === 'rating' ? 'active-sort' : ''}`} style={{ padding: 'var(--space-4)', color: 'var(--apple-text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '11px', borderBottom: '2px solid var(--apple-divider)' }} onClick={() => handleSort('rating')}>
                    Average Rating{getSortIndicator('rating')}
                  </th>
                  <th style={{ textAlign: 'right', whiteSpace: 'nowrap', width: '130px', padding: 'var(--space-4)', color: 'var(--apple-text-secondary)' }}>Owner Profile</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>Loading store directory...</td>
                  </tr>
                ) : stores.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--apple-text-secondary)' }}>No stores found matching your search criteria</td>
                  </tr>
                ) : (
                  stores.map(store => (
                    <tr key={store.id} style={{ transition: 'background 200ms ease' }}>
                      <td style={{ padding: 'var(--space-4)' }}>
                        <div>
                          <div style={{ fontWeight: '700', color: 'var(--apple-text-primary)', fontSize: '14px' }}>{store.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--apple-text-tertiary)' }}>Store #{store.id}</div>
                        </div>
                      </td>
                      <td style={{ padding: 'var(--space-4)', color: 'var(--apple-text-secondary)' }}>
                        <span className="user-email-text" style={{ color: 'var(--apple-text-secondary)', fontSize: '13px' }}>{store.email}</span>
                      </td>
                      <td style={{ padding: 'var(--space-4)', color: 'var(--apple-text-secondary)' }}>
                        <span className="user-address-text" style={{ color: 'var(--apple-text-secondary)', fontSize: '13px', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={store.address}>{store.address || 'N/A'}</span>
                      </td>
                      <td style={{ padding: 'var(--space-4)' }}>
                        <span className="rating-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '600', color: 'var(--apple-text-primary)', background: 'var(--apple-bg-secondary)', borderRadius: 'var(--radius-sm)', padding: '4px 10px' }}>
                          <span style={{ color: '#FFD700', fontSize: '14px' }}>★</span>
                          {store.rating.toFixed(1)} / 5
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap', padding: 'var(--space-4)' }}>
                        <Link to={store.owner_id ? `/admin/users/${store.owner_id}` : '/admin/users'}>
                          <AppleButton variant="outline" size="small" style={{ padding: 'var(--space-2) var(--space-3)' }}>
                            Owner Details
                          </AppleButton>
                        </Link>
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

export default StoreListAdmin;