import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>DMAT</h1>
          <p>Marketing Automation</p>
        </div>

        <nav className="sidebar-nav">
          <Link
            to="/dashboard"
            className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
          >
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </Link>

          <Link
            to="/landing-pages"
            className={`nav-item ${isActive('/landing-pages') ? 'active' : ''}`}
          >
            <span className="nav-icon">📄</span>
            <span>Landing Pages</span>
          </Link>

          <Link
            to="/leads"
            className={`nav-item ${isActive('/leads') ? 'active' : ''}`}
          >
            <span className="nav-icon">👥</span>
            <span>Leads</span>
          </Link>

          <Link
            to="/users"
            className={`nav-item ${isActive('/users') ? 'active' : ''}`}
          >
            <span className="nav-icon">👤</span>
            <span>Users</span>
          </Link>

          <Link
            to="/google-account"
            className={`nav-item ${isActive('/google-account') ? 'active' : ''}`}
          >
            <span className="nav-icon">🔐</span>
            <span>Google Account</span>
          </Link>

          <Link
            to="/seo-dashboard"
            className={`nav-item ${isActive('/seo-dashboard') ? 'active' : ''}`}
          >
            <span className="nav-icon">🚀</span>
            <span>SEO Insights</span>
          </Link>

          <Link
            to="/linkedin"
            className={`nav-item ${isActive('/linkedin') ? 'active' : ''}`}
          >
            <span className="nav-icon">💼</span>
            <span>LinkedIn</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <div className="user-name">{user?.name || 'User'}</div>
              <div className="user-role">{user?.role || 'User'}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;
