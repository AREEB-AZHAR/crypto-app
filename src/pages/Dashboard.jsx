import MarketOverviewCards from '../components/dashboard/MarketOverviewCards';
import TrendingCoins from '../components/dashboard/TrendingCoins';
import TopMovers from '../components/dashboard/TopMovers';
import PortfolioSummary from '../components/dashboard/PortfolioSummary';

const Dashboard = () => {
  return (
    <div className="dashboard-grid">
      {/* Top Overview Cards */}
      <MarketOverviewCards />

      {/* Main Content Area */}
      <div className="dashboard-row-main">
        {/* Left Column (Wider on Desktop) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <PortfolioSummary />
          <TopMovers />
        </div>

        {/* Right Column (Sidebar-width on Desktop) */}
        <div>
          <TrendingCoins />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
