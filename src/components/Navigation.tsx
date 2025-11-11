import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <span className="nav-logo">🌟</span>
        <span className="nav-title">Finley</span>
      </div>
      <div className="nav-links">
        <Link
          to="/"
          className={`nav-link ${isActive('/') ? 'active' : ''}`}
        >
          <span className="nav-icon">💬</span>
          <span>Chat</span>
        </Link>
        <Link
          to="/budget"
          className={`nav-link ${isActive('/budget') ? 'active' : ''}`}
        >
          <span className="nav-icon">💰</span>
          <span>Budget</span>
        </Link>
        <Link
          to="/achievements"
          className={`nav-link ${isActive('/achievements') ? 'active' : ''}`}
        >
          <span className="nav-icon">🏆</span>
          <span>Achievements</span>
        </Link>
      </div>
    </nav>
  );
}
