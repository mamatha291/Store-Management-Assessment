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

      {/* Perfectly Centered Hero Content (No Card) */}
      <div className="landing-center-hero">
        <h1 className="landing-simple-title">
          Discover Stores & Share <br />
          <span className="landing-title-gradient">Verified Customer Reviews</span>
        </h1>

        <p className="landing-simple-subtitle">
          A simple and transparent platform connecting community shoppers with local store owners through genuine 1-to-5 star ratings.
        </p>

        <div className="landing-hero-actions">
          {user ? (
            <Link to={getDashboardLink()} className="btn btn-primary btn-apple-glow">
              Go to Dashboard →
            </Link>
          ) : (
            <>
              <Link to="/signup" className="btn btn-primary btn-apple-glow">
                Create Free Account →
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Sign In
              </Link>
            </>
          )}
        </div>

        <div className="landing-footer-text">
          © {new Date().getFullYear()} Store Portal Platform. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default Landing;
