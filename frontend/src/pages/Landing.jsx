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

      <div className="container" style={{ position: 'relative', zIndex: 1, padding: '72px 24px 96px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 120px)' }}>
        {/* Clean Central Hero */}
        <div className="landing-simple-hero" style={{ margin: 'auto 0' }}>
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

        {/* Minimal Footer */}
        <div className="landing-simple-footer" style={{ width: '100%', maxWidth: '600px', borderTop: 'none', marginTop: 'auto' }}>
          <p style={{ fontSize: '12.5px', color: 'var(--text-subtle)' }}>
            © {new Date().getFullYear()} Store Portal Platform. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Landing;
