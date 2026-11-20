import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Landing() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('user');
  const [demoStars, setDemoStars] = useState(5);
  const [hoverStar, setHoverStar] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // Auto-cycle stars every 3 seconds if not interacted
  useEffect(() => {
    if (ratingSubmitted) return;
    const interval = setInterval(() => {
      setDemoStars(prev => (prev === 5 ? 4 : 5));
    }, 3500);
    return () => clearInterval(interval);
  }, [ratingSubmitted]);

  function handleDemoRate(val) {
    setDemoStars(val);
    setRatingSubmitted(true);
    setTimeout(() => setRatingSubmitted(false), 2400);
  }

  function getDashboardLink() {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'OWNER') return '/owner';
    return '/stores';
  }

  const roleInfo = {
    user: {
      badge: 'Normal Customer',
      title: 'Transparent store exploration with verified star ratings.',
      desc: 'Browse hundreds of verified local stores, inspect aggregate customer satisfaction scores, and submit your personal 1-to-5 star evaluation with instant recalculation.',
      highlights: [
        'Real-time overall rating calculation',
        'Intuitive 1–5 star interactive submission',
        'Modify past ratings at any time',
        'Location & name instant keyword search'
      ],
      ctaText: 'Explore as Customer',
      demoCred: 'vikram@gmail.com / Vikram@123'
    },
    owner: {
      badge: 'Store Owner',
      title: 'Precision analytics and customer sentiment telemetry.',
      desc: 'Deep-dive into customer feedback trends, view full 5-star to 1-star sentiment distributions, and inspect individual rater profiles to elevate service quality.',
      highlights: [
        'Real-time customer feedback breakdown',
        'Rater history with verified customer dossiers',
        'Store address and contact management',
        'Sentiment percentage distribution histograms'
      ],
      ctaText: 'Access Store Analytics',
      demoCred: 'rajesh@techworld.com / Rajesh@123'
    },
    admin: {
      badge: 'System Administrator',
      title: 'Total ecosystem governance with granular controls.',
      desc: 'Complete directory authority. Add and monitor administrators, store owners, and shoppers. Audit stores, register new locations, and inspect platform health.',
      highlights: [
        'Complete user & store CRUD directories',
        'Multi-column sorting and complex filters',
        'System-wide metrics and rating counts',
        'Role promotion and password policies'
      ],
      ctaText: 'Enter Admin Console',
      demoCred: 'admin@storeportal.com / Admin@1234'
    }
  };

  return (
    <div className="apple-landing">
      {/* Apple-style Frosted Subnav */}
      <header className="apple-subnav">
        <div className="apple-subnav-container">
          <Link to="/" className="apple-subnav-brand">
            <span className="apple-subnav-logo">Store Portal</span>
            <span className="apple-subnav-badge">Pro</span>
          </Link>

          <nav className="apple-subnav-links">
            <a href="#overview">Overview</a>
            <a href="#bento">Features</a>
            <a href="#roles">Roles</a>
            <a href="#security">Architecture</a>
          </nav>

          <div className="apple-subnav-actions">
            {user ? (
              <Link to={getDashboardLink()} className="apple-btn apple-btn-primary apple-btn-sm">
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/login" className="apple-btn apple-btn-ghost apple-btn-sm">
                  Sign In
                </Link>
                <Link to="/signup" className="apple-btn apple-btn-primary apple-btn-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="overview" className="apple-hero-section">
        <div className="apple-hero-glow"></div>
        <div className="apple-container apple-hero-content">
          <div className="apple-eyebrow">
            <span className="apple-eyebrow-dot"></span>
            Next-Generation Store Governance & Rating Platform
          </div>

          <h1 className="apple-hero-title">
            Pro intelligence.<br />
            <span className="apple-gradient-text">Engineered for trust.</span>
          </h1>

          <p className="apple-hero-subtitle">
            An ultra-refined evaluation platform connecting customers, business owners, 
            and platform administrators through real-time telemetry and fluid micro-interactions.
          </p>

          <div className="apple-hero-ctas">
            {user ? (
              <Link to={getDashboardLink()} className="apple-btn apple-btn-primary apple-btn-lg">
                Enter Your Dashboard
                <span className="apple-arrow">→</span>
              </Link>
            ) : (
              <>
                <Link to="/login" className="apple-btn apple-btn-primary apple-btn-lg">
                  Sign In to Portal
                  <span className="apple-arrow">→</span>
                </Link>
                <a href="#roles" className="apple-btn apple-btn-secondary apple-btn-lg">
                  Explore Roles
                </a>
              </>
            )}
          </div>

          <div className="apple-hero-stats">
            <div className="apple-stat-item">
              <span className="apple-stat-num">100%</span>
              <span className="apple-stat-desc">Verified Customer Reviews</span>
            </div>
            <div className="apple-stat-divider"></div>
            <div className="apple-stat-item">
              <span className="apple-stat-num">3-Tier</span>
              <span className="apple-stat-desc">Granular RBAC Security</span>
            </div>
            <div className="apple-stat-divider"></div>
            <div className="apple-stat-item">
              <span className="apple-stat-num">&lt; 15ms</span>
              <span className="apple-stat-desc">Real-Time Score Synthesis</span>
            </div>
          </div>
        </div>

        {/* Floating 3D Showcase Card */}
        <div className="apple-container">
          <div className="apple-showcase-wrapper">
            <div className="apple-showcase-card">
              <div className="apple-showcase-header">
                <div className="apple-window-dots">
                  <span className="apple-dot dot-red"></span>
                  <span className="apple-dot dot-yellow"></span>
                  <span className="apple-dot dot-green"></span>
                </div>
                <div className="apple-showcase-title">Live Rating Synthesis Engine • Store Portal</div>
                <div className="apple-showcase-status">
                  <span className="apple-live-pulse"></span>
                  Connected
                </div>
              </div>

              <div className="apple-showcase-grid">
                <div className="apple-showcase-main">
                  <div className="apple-store-preview-header">
                    <div>
                      <div className="apple-tag">Featured Store</div>
                      <h3 className="apple-preview-name">TechWorld Electronics</h3>
                      <p className="apple-preview-addr">452 Silicon Boulevard, Tech District • Verified Partner</p>
                    </div>
                    <div className="apple-score-capsule">
                      <span className="apple-star-icon">★</span>
                      <span className="apple-score-val">4.8</span>
                      <span className="apple-score-total">/ 5.0</span>
                    </div>
                  </div>

                  <div className="apple-interactive-rating-box">
                    <div className="apple-rating-box-label">
                      <span>Try Interactive Rating:</span>
                      {ratingSubmitted && (
                        <span className="apple-submitted-badge">✓ Rating Updated Live!</span>
                      )}
                    </div>
                    <div className="apple-interactive-stars">
                      {[1, 2, 3, 4, 5].map(star => {
                        const isFilled = (hoverStar || demoStars) >= star;
                        return (
                          <button
                            key={star}
                            type="button"
                            className={`apple-star-btn ${isFilled ? 'filled' : ''}`}
                            onMouseEnter={() => setHoverStar(star)}
                            onMouseLeave={() => setHoverStar(0)}
                            onClick={() => handleDemoRate(star)}
                            aria-label={`Rate ${star} stars`}
                          >
                            ★
                          </button>
                        );
                      })}
                      <span className="apple-star-count-label">
                        {hoverStar || demoStars}.0 Stars
                      </span>
                    </div>
                    <p className="apple-rating-hint">
                      Click any star to experience the instant spring recoil and algorithmic score recalculation.
                    </p>
                  </div>
                </div>

                <div className="apple-showcase-side">
                  <div className="apple-side-metric">
                    <div className="apple-metric-top">
                      <span className="apple-metric-label">Customer Satisfaction</span>
                      <span className="apple-metric-badge">96.4%</span>
                    </div>
                    <div className="apple-progress-track">
                      <div className="apple-progress-bar" style={{ width: '96.4%' }}></div>
                    </div>
                  </div>

                  <div className="apple-side-breakdown">
                    <div className="apple-breakdown-row">
                      <span>5 Stars</span>
                      <div className="apple-mini-bar"><div style={{ width: '82%', background: '#FF9F0A' }}></div></div>
                      <span>82%</span>
                    </div>
                    <div className="apple-breakdown-row">
                      <span>4 Stars</span>
                      <div className="apple-mini-bar"><div style={{ width: '14%', background: '#FF9F0A' }}></div></div>
                      <span>14%</span>
                    </div>
                    <div className="apple-breakdown-row">
                      <span>3 Stars</span>
                      <div className="apple-mini-bar"><div style={{ width: '4%', background: '#FFB340' }}></div></div>
                      <span>4%</span>
                    </div>
                  </div>

                  <div className="apple-verified-badge">
                    <div className="apple-shield-icon">🛡️</div>
                    <div>
                      <div className="apple-badge-title">Zero Duplicate Protection</div>
                      <div className="apple-badge-sub">Single rating enforced per registered user per store</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Feature Section */}
      <section id="bento" className="apple-section apple-bento-section">
        <div className="apple-container">
          <div className="apple-section-header">
            <span className="apple-section-eyebrow">Architecture & Design</span>
            <h2 className="apple-section-title">
              Power that speaks for itself.
            </h2>
            <p className="apple-section-subtitle">
              Every detail engineered with deliberate clarity, silky responsiveness, and rock-solid integrity.
            </p>
          </div>

          <div className="apple-bento-grid">
            {/* Bento Card 1: Precision Star Engine */}
            <div className="apple-bento-card bento-card-large">
              <div className="apple-bento-content">
                <span className="apple-card-tag">Calculated Precision</span>
                <h3 className="apple-card-title">Real-Time Score Synthesis</h3>
                <p className="apple-card-desc">
                  Algorithmic weighted averages dynamically recalculate down to the decimal the moment a user submits or updates feedback.
                </p>
              </div>
              <div className="apple-bento-visual visual-rating">
                <div className="apple-floating-stars-preview">
                  <div className="apple-preview-star-row">
                    <span className="star-glow">★</span>
                    <span className="star-glow">★</span>
                    <span className="star-glow">★</span>
                    <span className="star-glow">★</span>
                    <span className="star-glow">★</span>
                  </div>
                  <div className="apple-preview-score-text">4.9 Overall Store Average</div>
                </div>
              </div>
            </div>

            {/* Bento Card 2: Tri-Role Architecture */}
            <div className="apple-bento-card">
              <div className="apple-bento-content">
                <span className="apple-card-tag">Role Isolation</span>
                <h3 className="apple-card-title">Tri-Role Governance</h3>
                <p className="apple-card-desc">
                  Separate views and granular permission gates for System Admins, Store Owners, and Shoppers.
                </p>
              </div>
              <div className="apple-bento-visual visual-roles">
                <div className="apple-role-tags-preview">
                  <span className="role-tag-preview tag-admin">Admin</span>
                  <span className="role-tag-preview tag-owner">Store Owner</span>
                  <span className="role-tag-preview tag-user">Customer</span>
                </div>
              </div>
            </div>

            {/* Bento Card 3: Enterprise Security */}
            <div className="apple-bento-card">
              <div className="apple-bento-content">
                <span className="apple-card-tag">Defensive Cryptography</span>
                <h3 className="apple-card-title">Stateless JWT & Salted Bcrypt</h3>
                <p className="apple-card-desc">
                  Passwords salted and hashed with bcryptjs. Protected routes gated with tamper-proof cryptographic tokens.
                </p>
              </div>
              <div className="apple-bento-visual visual-security">
                <div className="apple-lock-visual">
                  <span className="apple-lock-glyph">🔒</span>
                  <span className="apple-lock-label">256-Bit Signed Tokens</span>
                </div>
              </div>
            </div>

            {/* Bento Card 4: Store Intelligence */}
            <div className="apple-bento-card bento-card-wide">
              <div className="apple-bento-content">
                <span className="apple-card-tag">Actionable Telemetry</span>
                <h3 className="apple-card-title">Owner Feedback Dashboard</h3>
                <p className="apple-card-desc">
                  Store owners receive instantaneous visibility into customer sentiment distributions, average score shifts, and individual rater histories.
                </p>
              </div>
              <div className="apple-bento-visual visual-chart">
                <div className="apple-chart-bars">
                  <div className="chart-bar-col"><div className="chart-fill" style={{ height: '35%' }}></div><span>1★</span></div>
                  <div className="chart-bar-col"><div className="chart-fill" style={{ height: '45%' }}></div><span>2★</span></div>
                  <div className="chart-bar-col"><div className="chart-fill" style={{ height: '60%' }}></div><span>3★</span></div>
                  <div className="chart-bar-col"><div className="chart-fill" style={{ height: '85%' }}></div><span>4★</span></div>
                  <div className="chart-bar-col"><div className="chart-fill fill-peak" style={{ height: '100%' }}></div><span>5★</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Demonstration Interactive Section */}
      <section id="roles" className="apple-section apple-roles-section">
        <div className="apple-container">
          <div className="apple-section-header">
            <span className="apple-section-eyebrow">Tailored Experiences</span>
            <h2 className="apple-section-title">
              Three personas. One cohesive system.
            </h2>
            <p className="apple-section-subtitle">
              Explore how each role interacts with the platform with dedicated tools and views.
            </p>
          </div>

          {/* Segmented Pill Tab Switcher */}
          <div className="apple-tabs-wrapper">
            <div className="apple-segmented-tabs">
              <button
                type="button"
                className={`apple-tab-btn ${activeTab === 'user' ? 'active' : ''}`}
                onClick={() => setActiveTab('user')}
              >
                Normal Customer
              </button>
              <button
                type="button"
                className={`apple-tab-btn ${activeTab === 'owner' ? 'active' : ''}`}
                onClick={() => setActiveTab('owner')}
              >
                Store Owner
              </button>
              <button
                type="button"
                className={`apple-tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
                onClick={() => setActiveTab('admin')}
              >
                Administrator
              </button>
            </div>
          </div>

          {/* Dynamic Role Showcase Panel */}
          <div className="apple-role-panel">
            <div key={activeTab} className="apple-role-panel-info">
              <span className={`apple-role-pill role-pill-${activeTab}`}>
                {roleInfo[activeTab].badge}
              </span>
              <h3 className="apple-role-headline">
                {roleInfo[activeTab].title}
              </h3>
              <p className="apple-role-paragraph">
                {roleInfo[activeTab].desc}
              </p>

              <div className="apple-role-checklist">
                {roleInfo[activeTab].highlights.map((item, idx) => (
                  <div key={idx} className="apple-checklist-item">
                    <span className="apple-check-glyph">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="apple-role-credential-box">
                <span className="apple-cred-label">Demo Credentials:</span>
                <code className="apple-cred-code">{roleInfo[activeTab].demoCred}</code>
              </div>

              <div className="apple-role-panel-actions">
                <Link to="/login" className="apple-btn apple-btn-primary">
                  {roleInfo[activeTab].ctaText} →
                </Link>
              </div>
            </div>

            <div className="apple-role-panel-mock">
              <div key={activeTab} className="apple-mock-card">
                <div className="apple-mock-header">
                  <span className="apple-mock-dot red"></span>
                  <span className="apple-mock-dot yellow"></span>
                  <span className="apple-mock-dot green"></span>
                  <span className="apple-mock-route">
                    {activeTab === 'user' ? '/stores' : activeTab === 'owner' ? '/owner' : '/admin'}
                  </span>
                </div>
                <div className="apple-mock-body">
                  {activeTab === 'user' && (
                    <div className="apple-mock-content">
                      <div className="mock-title">Explore & Review Stores</div>
                      <div className="mock-search-bar">🔍 Search store by name or address...</div>
                      <div className="mock-store-item">
                        <div className="mock-item-top">
                          <strong>TechWorld Electronics</strong>
                          <span className="mock-star-badge">★ 4.8</span>
                        </div>
                        <div className="mock-item-sub">452 Silicon Boulevard, Tech District</div>
                        <div className="mock-rating-row">
                          <span>Your Rating:</span>
                          <span className="mock-gold-stars">★★★★★</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'owner' && (
                    <div className="apple-mock-content">
                      <div className="mock-title">TechWorld Electronics Analytics</div>
                      <div className="mock-stat-grid">
                        <div className="mock-stat-box">
                          <span className="lbl">Average Rating</span>
                          <span className="val">4.8 ★</span>
                        </div>
                        <div className="mock-stat-box">
                          <span className="lbl">Total Reviews</span>
                          <span className="val">42 Reviews</span>
                        </div>
                      </div>
                      <div className="mock-recent-header">Recent Feedback Feed:</div>
                      <div className="mock-review-item">
                        <div className="mock-review-author">Vikram Singh • 5★</div>
                        <div className="mock-review-text">Prompt customer service and transparent pricing!</div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'admin' && (
                    <div className="apple-mock-content">
                      <div className="mock-title">Platform Administration Dashboard</div>
                      <div className="mock-stat-grid three-col">
                        <div className="mock-stat-box"><span className="lbl">Users</span><span className="val">18</span></div>
                        <div className="mock-stat-box"><span className="lbl">Stores</span><span className="val">6</span></div>
                        <div className="mock-stat-box"><span className="lbl">Ratings</span><span className="val">124</span></div>
                      </div>
                      <div className="mock-action-bar">
                        <span className="mock-btn-mini">+ Add User</span>
                        <span className="mock-btn-mini success">+ Add Store</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Architecture Highlights */}
      <section id="security" className="apple-section apple-security-section">
        <div className="apple-container">
          <div className="apple-security-card">
            <div className="apple-security-glow"></div>
            <div className="apple-security-content">
              <span className="apple-card-tag light">Security by Design</span>
              <h2 className="apple-security-title">
                Fortified from the ground up.
              </h2>
              <p className="apple-security-subtitle">
                Engineered with strict relational constraints in MySQL, sanitized API parameters,
                and zero-trust role guards on every endpoint.
              </p>

              <div className="apple-security-points">
                <div className="security-point">
                  <div className="point-icon">⚡</div>
                  <div className="point-text">
                    <strong>Relational Integrity</strong>
                    <span>Foreign key cascades and unique constraints on `(user_id, store_id)` enforce single-rating invariants.</span>
                  </div>
                </div>

                <div className="security-point">
                  <div className="point-icon">🔐</div>
                  <div className="point-text">
                    <strong>Bcrypt Salt Rounds</strong>
                    <span>All passwords hashed with high-cost salt vectors preventing rainbow table vulnerabilities.</span>
                  </div>
                </div>

                <div className="security-point">
                  <div className="point-icon">🛡️</div>
                  <div className="point-text">
                    <strong>JWT Token Verification</strong>
                    <span>Stateless authorization with signature verification on all mutating requests.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="apple-cta-section">
        <div className="apple-container">
          <div className="apple-cta-box">
            <h2 className="apple-cta-title">
              Ready to experience the platform?
            </h2>
            <p className="apple-cta-subtitle">
              Join thousands of community shoppers and retailers. Sign in now to get started.
            </p>
            <div className="apple-cta-buttons">
              <Link to="/login" className="apple-btn apple-btn-primary apple-btn-lg">
                Sign In to Your Account →
              </Link>
              <Link to="/signup" className="apple-btn apple-btn-secondary apple-btn-lg">
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Apple Minimalist Footer */}
      <footer className="apple-footer">
        <div className="apple-container apple-footer-container">
          <div className="apple-footer-note">
            <p>1. Ratings are computed dynamically based on validated user submissions in the MySQL assessment database.</p>
            <p>2. Multi-role access control adheres strictly to authenticated JWT claims verified on port 5000.</p>
          </div>
          <div className="apple-footer-divider"></div>
          <div className="apple-footer-bottom">
            <div className="apple-footer-copy">
              Copyright © {new Date().getFullYear()} Store Portal Platform. All rights reserved.
            </div>
            <div className="apple-footer-links">
              <Link to="/login">Sign In</Link>
              <Link to="/signup">Register</Link>
              <a href="#overview">Back to Top ↑</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
