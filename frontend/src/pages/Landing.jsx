import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Landing() {
  const { user } = useAuth();

  function getDashboardLink() {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'OWNER') return '/owner';
    return '/stores';
  }

  return (
    <div className="landing-simple-wrapper">
      {/* Ambient Chromatic Backdrop Mesh */}
      <div className="dashboard-ambient-mesh">
        <div className="ambient-mesh-orb orb-blue"></div>
        <div className="ambient-mesh-orb orb-emerald"></div>
        <div className="ambient-mesh-orb orb-amber"></div>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1, padding: '48px 24px 80px' }}>
        {/* Hero Section */}
        <div className="landing-simple-hero">
          <div className="landing-badge-pill">
            <span className="badge-pulse-dot dot-green"></span>
            Store Rating & Directory Portal
          </div>

          <h1 className="landing-simple-title">
            Discover Stores & Share <br />
            <span className="landing-title-gradient">Verified Customer Reviews</span>
          </h1>

          <p className="landing-simple-subtitle">
            A simple and transparent platform connecting community shoppers with local store owners through genuine 1-to-5 star ratings.
          </p>

          <div className="landing-hero-actions">
            {user ? (
              <Link to={getDashboardLink()} className="btn btn-primary btn-apple-glow" style={{ padding: '12px 28px', fontSize: '15px' }}>
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn btn-primary btn-apple-glow" style={{ padding: '12px 28px', fontSize: '15px' }}>
                  Create Free Account →
                </Link>
                <Link to="/login" className="btn btn-secondary" style={{ padding: '12px 24px', fontSize: '15px' }}>
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        {/* 3 Simple Value Cards */}
        <div className="landing-simple-cards">
          <div className="landing-card-glass">
            <div className="landing-card-icon" style={{ background: 'rgba(0, 113, 227, 0.1)', color: '#0071E3' }}>
              🛍️
            </div>
            <h3 className="landing-card-title">Explore & Review Stores</h3>
            <p className="landing-card-desc">
              Browse registered storefronts by name or address. Submit your personal 1-to-5 star rating and see instant overall score updates.
            </p>
          </div>

          <div className="landing-card-glass">
            <div className="landing-card-icon" style={{ background: 'rgba(52, 199, 89, 0.12)', color: '#248A3D' }}>
              📊
            </div>
            <h3 className="landing-card-title">Store Owner Analytics</h3>
            <p className="landing-card-desc">
              Store owners get direct access to customer ratings, average satisfaction scores, and feedback feeds to understand and serve shoppers better.
            </p>
          </div>

          <div className="landing-card-glass">
            <div className="landing-card-icon" style={{ background: 'rgba(88, 86, 214, 0.1)', color: '#5856D6' }}>
              🛡️
            </div>
            <h3 className="landing-card-title">Secure & Transparent</h3>
            <p className="landing-card-desc">
              Clear role-based permissions ensure authentic reviews. Single rating per store per user prevents duplicates and protects rating integrity.
            </p>
          </div>
        </div>

        {/* Simple CTA Box */}
        <div className="landing-simple-cta">
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
            Ready to get started?
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '480px', margin: '0 auto 24px' }}>
            Join local shoppers and store owners today. It only takes a minute to set up your account.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {user ? (
              <Link to={getDashboardLink()} className="btn btn-primary btn-apple-glow" style={{ padding: '10px 24px' }}>
                Open Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn btn-primary btn-apple-glow" style={{ padding: '10px 24px' }}>
                  Register as User
                </Link>
                <Link to="/login" className="btn btn-secondary" style={{ padding: '10px 20px' }}>
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Minimal Footer */}
        <div className="landing-simple-footer">
          <p>Store Portal • Simple & Transparent Retail Reviews</p>
          <p style={{ marginTop: '4px', fontSize: '12px', color: 'var(--text-subtle)' }}>
            © {new Date().getFullYear()} Store Portal Platform. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Landing;
