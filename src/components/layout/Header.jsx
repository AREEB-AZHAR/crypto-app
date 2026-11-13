import { Search, Bell, Moon, Sun } from 'lucide-react';
import '../../styles/layout.css';

const Header = ({ theme, toggleTheme }) => {
  return (
    <header className="top-header">
      {/* Search Input */}
      <div className="search-container">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          className="search-input"
          placeholder="Search coins, pairs..."
        />
      </div>

      {/* Global Market Ticker (Desktop Only) */}
      <div className="global-ticker">
        <div className="ticker-item">
          <span className="ticker-label">Market Cap</span>
          <div>
            <span className="ticker-value">$2.4T</span>
            <span className="ticker-change text-green">+1.2%</span>
          </div>
        </div>
        <div className="ticker-item">
          <span className="ticker-label">24h Vol</span>
          <div>
            <span className="ticker-value">$84.2B</span>
            <span className="ticker-change text-red">-5.4%</span>
          </div>
        </div>
        <div className="ticker-item">
          <span className="ticker-label">BTC Dom</span>
          <div>
            <span className="ticker-value">52.4%</span>
            <span className="ticker-change text-green">+0.1%</span>
          </div>
        </div>
      </div>

      {/* Right Utilities */}
      <div className="header-utils">
        <button
          className="icon-btn"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="icon-btn" aria-label="Notifications" title="Notifications">
          <Bell size={20} />
          <span className="notification-badge" />
        </button>
      </div>
    </header>
  );
};

export default Header;
