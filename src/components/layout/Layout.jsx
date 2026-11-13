import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import BottomNav from './BottomNav';
import '../../styles/layout.css';

const Layout = ({ user, onLogout }) => {
  // Simple local theme toggle for now
  const [theme, setTheme] = useState('dark');

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="app-wrapper">
      <Sidebar userEmail={user?.email} onLogout={onLogout} />
      
      <main className="main-content">
        <Header theme={theme} toggleTheme={toggleTheme} />
        
        {/* Child routes load inside this container */}
        <div className="page-container">
          <Outlet />
        </div>

        {/* Padding for mobile bottom nav */}
        <div style={{ height: '70px' }} className="mobile-only-spacer" />
      </main>

      <BottomNav />
    </div>
  );
};

export default Layout;
