import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  LineChart,
  ArrowLeftRight,
  Wallet,
  Menu,
} from 'lucide-react';
import '../../styles/layout.css';

const BottomNav = () => {
  const navLinks = [
    { name: 'Home', path: '/', icon: LayoutDashboard },
    { name: 'Markets', path: '/markets', icon: LineChart },
    { name: 'Trade', path: '/trade', icon: ArrowLeftRight },
    { name: 'Portfolio', path: '/portfolio', icon: Wallet },
    { name: 'More', path: '/settings', icon: Menu }, // 'More' points to settings for now
  ];

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-list">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="bottom-nav-icon">
                <Icon size={22} strokeWidth={2.5} />
              </div>
              <span className="bottom-nav-label">{link.name}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
