import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

function AddStore() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: ''
  });
  const [owners, setOwners] = useState([]);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOwners();
  }, []);

  async function fetchOwners() {
    try {
      const res = await api.get('/users', { params: { role: 'OWNER' } });
      setOwners(res.data);
    } catch (err) {
      console.error('Failed to fetch owners:', err);
    }
  }

  function validate() {
    const newErrors = {};

    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      newErrors.name = 'Store name is required';
    } else if (trimmedName.length > 120) {
      newErrors.name = 'Store name must not exceed 120 characters';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid store email address';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Store physical address is required';
    } else if (formData.address.trim().length > 400) {
      newErrors.address = 'Address must not exceed 400 characters';
    }

    if (!formData.ownerId) {
      newErrors.ownerId = 'Please select an owner account to assign to this store';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    setSuccess('');

    if (!validate()) return;

    setSubmitting(true);
    try {
      await api.post('/stores', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        ownerId: parseInt(formData.ownerId, 10)
      });
      setSuccess('Store created successfully! Redirecting to stores list...');
      setTimeout(() => navigate('/admin/stores'), 1400);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to create store listing');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: '1200px' }}>
      {/* Ambient Chromatic Backdrop Mesh for Glassmorphic Depth */}
      <div className="dashboard-ambient-mesh">
        <div className="ambient-mesh-orb orb-blue"></div>
        <div className="ambient-mesh-orb orb-emerald"></div>
        <div className="ambient-mesh-orb orb-amber"></div>
      </div>

      {/* Standalone Breadcrumb Pill */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <Link to="/admin/stores" className="page-breadcrumb">
          ← Back to Store Directory
        </Link>
      </div>

      <div className="page-header" style={{ position: 'relative', zIndex: 1, marginTop: '4px' }}>
        <div>
          <h1 className="page-title dashboard-title-glow">Register New Store</h1>
          <p className="page-subtitle">Create a verified store profile and assign an existing Store Owner</p>
        </div>
      </div>

      <div className="form-container form-wide">
        {serverError && (
          <div className="error-msg">
            <span>{serverError}</span>
          </div>
        )}

        {success && (
          <div className="success-msg">
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">
              Store Name
              <span className="label-hint">(max 120 characters)</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Apex Electronics & Gadgets"
              className={errors.name ? 'has-error' : ''}
              required
            />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Store Official Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="contact@storename.com"
              className={errors.email ? 'has-error' : ''}
              required
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="address">
              Store Physical Location
              <span className="label-hint">(max 400 characters)</span>
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              placeholder="Enter full physical address, street, city, postal code"
              className={errors.address ? 'has-error' : ''}
              required
            />
            {errors.address && <div className="field-error">{errors.address}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="ownerId">Assign Store Owner</label>
            <select
              id="ownerId"
              name="ownerId"
              value={formData.ownerId}
              onChange={handleChange}
              className={errors.ownerId ? 'has-error' : ''}
              required
            >
              <option value="">-- Choose an Owner Account --</option>
              {owners.map(owner => (
                <option key={owner.id} value={owner.id}>
                  {owner.name} ({owner.email})
                </option>
              ))}
            </select>
            {errors.ownerId && <div className="field-error">{errors.ownerId}</div>}
            {owners.length === 0 && (
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                No Store Owner accounts available. Please create a user with the "Store Owner" role first in the Users menu.
              </p>
            )}
          </div>

          <div className="btn-group mt-20">
            <button 
              type="submit" 
              className="btn btn-primary btn-apple-glow"
              style={{ flex: 1 }}
              disabled={submitting}
            >
              {submitting ? 'Registering Store...' : 'Register Store'}
            </button>
            <Link to="/admin/stores" className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStore;
