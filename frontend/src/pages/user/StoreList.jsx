import { useState, useEffect } from 'react';
import api from '../../api/axios';
import StarRating from '../../components/StarRating';

function UserStoreList() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  useEffect(() => {
    fetchStores();
  }, [searchName, searchAddress, sortBy, order]);

  async function fetchStores() {
    try {
      const params = { sortBy, order };
      if (searchName) params.name = searchName;
      if (searchAddress) params.address = searchAddress;
      const res = await api.get('/stores', { params });
      setStores(res.data);
    } catch (err) {
      console.error('Failed to fetch stores:', err);
    }
    setLoading(false);
  }

  function showMessage(text, type) {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3500);
  }

  async function handleRatingSubmit(storeId, rating) {
    try {
      await api.post('/ratings', { storeId, rating });
      showMessage('Your rating has been submitted successfully.', 'success');
      fetchStores();
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to submit rating', 'error');
    }
  }

  async function handleRatingModify(ratingId, rating) {
    try {
      await api.put(`/ratings/${ratingId}`, { rating });
      showMessage('Your rating has been updated successfully.', 'success');
      fetchStores();
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to update rating', 'error');
    }
  }

  const ratedCount = stores.filter(s => s.userRating).length;
  const avgOverallRating = stores.length > 0
    ? (stores.reduce((acc, curr) => acc + curr.overallRating, 0) / stores.length).toFixed(1)
    : '0.0';

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Explore & Review Stores</h1>
          <p className="page-subtitle">Browse community stores, see overall ratings, and submit your personal rating</p>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="dashboard-stats-grid">
        <div className="stat-card square-card">
          <div className="stat-label">
            Available Stores
          </div>
          <div className="stat-value">{stores.length}</div>
          <div className="stat-subtext">Active store locations</div>
        </div>

        <div className="stat-card square-card stat-stores">
          <div className="stat-label">
            Stores You've Rated
          </div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>{ratedCount}</div>
          <div className="stat-subtext">
            {stores.length > 0 ? `${Math.round((ratedCount / stores.length) * 100)}% of stores reviewed by you` : '0% reviewed'}
          </div>
        </div>

        <div className="stat-card square-card stat-ratings">
          <div className="stat-label">
            Platform Score
          </div>
          <div className="stat-value" style={{ color: 'var(--warning)' }}>★ {avgOverallRating}</div>
          <div className="stat-subtext">Overall community rating</div>
        </div>
      </div>

      {message && (
        <div className={messageType === 'success' ? 'success-msg' : 'error-msg'}>
          <span>{message}</span>
        </div>
      )}

      {/* Search & Sort Filters */}
      <div className="filters-card">
        <div className="filters-grid">
          <input
            placeholder="Search stores by name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <input
            placeholder="Filter by city or address..."
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
          />
          <select
            value={`${sortBy}-${order}`}
            onChange={(e) => {
              const [f, o] = e.target.value.split('-');
              setSortBy(f);
              setOrder(o);
            }}
          >
            <option value="name-asc">Sort: Name (A to Z)</option>
            <option value="name-desc">Sort: Name (Z to A)</option>
            <option value="rating-desc">Sort: Highest Rated First</option>
            <option value="rating-asc">Sort: Lowest Rated First</option>
          </select>
        </div>
      </div>

      {/* Visual Store Cards Grid */}
      {loading ? (
        <div className="loading-state">Loading store directory...</div>
      ) : stores.length === 0 ? (
        <div className="card text-center" style={{ padding: '60px 20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
            No stores found matching your criteria
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '440px', margin: '0 auto' }}>
            Try clearing your search terms or adjusting filters to discover all available community stores.
          </p>
        </div>
      ) : (
        <div className="store-cards-grid">
          {stores.map(store => (
            <VisualStoreCard
              key={store.id}
              store={store}
              onSubmit={handleRatingSubmit}
              onModify={handleRatingModify}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function VisualStoreCard({ store, onSubmit, onModify }) {
  const [selectedRating, setSelectedRating] = useState(store.userRating || 0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setSelectedRating(store.userRating || 0);
  }, [store.userRating]);

  async function handleActionClick() {
    if (selectedRating < 1 || selectedRating > 5) return;

    setSubmitting(true);
    try {
      if (store.userRatingId) {
        await onModify(store.userRatingId, selectedRating);
      } else {
        await onSubmit(store.id, selectedRating);
      }
    } finally {
      setSubmitting(false);
    }
  }

  const hasRated = !!store.userRating;

  return (
    <div className="visual-store-card">
      <div>
        <div className="visual-card-header">
          <div className="visual-card-title">{store.name}</div>
          <span className="rating-badge" style={{ flexShrink: 0 }}>
            <span className="rating-badge-star">★</span>
            {store.overallRating.toFixed(1)}
          </span>
        </div>

        <div className="visual-card-address">
          <span>{store.address}</span>
        </div>

        <div style={{ fontSize: '12px', color: 'var(--text-subtle)', marginBottom: '12px' }}>
          {store.email}
        </div>
      </div>

      {/* Rating & Review Section inside Card */}
      <div className="user-rating-section">
        <div className="user-rating-header">
          <span className="user-rating-status">
            {hasRated ? 'Your Current Rating:' : 'Rate this store:'}
          </span>
          {hasRated && (
            <span style={{ color: 'var(--warning-text)', fontWeight: '800' }}>
              ★ {store.userRating} / 5
            </span>
          )}
        </div>

        <div className="user-rating-actions">
          <StarRating
            value={selectedRating}
            onChange={(val) => setSelectedRating(val)}
          />
          <button
            className={`btn btn-small ${hasRated ? 'btn-secondary' : 'btn-primary'}`}
            onClick={handleActionClick}
            disabled={submitting || selectedRating === 0}
          >
            {submitting ? 'Saving...' : hasRated ? 'Update Rating' : 'Submit Rating'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserStoreList;
