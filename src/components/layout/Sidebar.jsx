import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  LineChart,
  ArrowLeftRight,
  Wallet,
  Star,
  Newspaper,
  Settings,
  TrendingUp,
  LogOut,
} from 'lucide-react';
import '../../styles/layout.css';

const Sidebar = ({ onLogout, userEmail }) => {
  const navLinks = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Markets', path: '/markets', icon: LineChart },
    { name: 'Trade', path: '/trade', icon: ArrowLeftRight },
    { name: 'Portfolio', path: '/portfolio', icon: Wallet },
    { name: 'Watchlist', path: '/watchlist', icon: Star },
    { name: 'News', path: '/news', icon: Newspaper },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="sidebar">
      {/* Branding */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <TrendingUp size={24} strokeWidth={2.5} />
        </div>
        <span className="sidebar-logo-text">
          <span className="gradient-text">Crypto</span>Trader
        </span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="sidebar-user">
        <div className="user-info">
          <div className="user-avatar">
            {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-details">
            <span className="user-name">Trader</span>
            <span className="user-email" title={userEmail}>
              {userEmail || 'user@example.com'}
            </span>
          </div>
        </div>
        <button className="signout-btn" onClick={onLogout} title="Sign Out">
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
