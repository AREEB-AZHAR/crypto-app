import { usePortfolioStore } from '../stores/portfolioStore';
import { useQueryClient } from '@tanstack/react-query';
import GlassCard from '../components/ui/GlassCard';
import PriceChange from '../components/ui/PriceChange';
import { Wallet, Search, RefreshCw, ArrowRightLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/portfolio.css';

const Portfolio = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const balance = usePortfolioStore((state) => state.balance);
  const holdings = usePortfolioStore((state) => state.holdings);
  const tradeHistory = usePortfolioStore((state) => state.tradeHistory);
  const resetPortfolio = usePortfolioStore((state) => state.resetPortfolio);
  const depositVirtual = usePortfolioStore((state) => state.depositVirtual);

  // In a real app, we would fetch live prices for all holdings here
  // For this simulation, we'll try to find them in the cached marketList
  const calculatePortfolioValue = () => {
    let holdingsValue = 0;
    const cachedMarkets = queryClient.getQueriesData({ queryKey: ['marketList'] });
    
    // Attempt to extract latest prices if cached
    const pricesMap = {};
    if (cachedMarkets.length > 0 && cachedMarkets[0][1]) {
      cachedMarkets[0][1].forEach(coin => {
        pricesMap[coin.id] = coin.current_price;
      });
    }

    const enhancedHoldings = holdings.map(h => {
      const currentPrice = pricesMap[h.coinId] || h.avgBuyPrice; // Fallback to buy price if live not found
      const currentValue = h.amount * currentPrice;
      const totalInvested = h.amount * h.avgBuyPrice;
      const profitLoss = currentValue - totalInvested;
      const profitLossPercent = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

      holdingsValue += currentValue;
      
      return {
        ...h,
        currentPrice,
        currentValue,
        profitLoss,
        profitLossPercent
      };
    }).filter(h => h.amount > 0);

    const totalPortfolioValue = balance + holdingsValue;
    const totalProfitLossDate = totalPortfolioValue - 10000; // 10k is starting balance
    const totalProfitLossPercent = (totalProfitLossDate / 10000) * 100;

    return { totalPortfolioValue, enhancedHoldings, totalProfitLossDate, totalProfitLossPercent };
  };

  const { totalPortfolioValue, enhancedHoldings, totalProfitLossDate, totalProfitLossPercent } = calculatePortfolioValue();

  return (
    <div className="portfolio-page">
      <div className="portfolio-header-section">
        {/* Balance Overview */}
        <GlassCard className="portfolio-overview">
          <span className="overview-label">Total Balance</span>
          <span className="overview-balance">
            ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <PriceChange percent={totalProfitLossPercent} />
            <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', marginLeft: '8px' }}>
              (${Math.abs(totalProfitLossDate).toLocaleString()}) All Time
            </span>
          </div>

          <div className="overview-metrics">
            <div className="metric">
              <span className="metric-value">${balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              <span className="metric-label">Available Cash</span>
            </div>
          </div>
        </GlassCard>

        {/* Action Panel */}
        <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', padding: 'var(--space-6)' }}>
          <h2 style={{ fontSize: 'var(--fs-lg)',fontFamily: 'var(--font-display)' }}>Manage Simulator</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>
            This is a paper trading environment. Test strategies without financial risk.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'auto' }}>
            <button 
              className="btn-primary" 
              onClick={() => depositVirtual(5000)}
            >
              + $5,000 Dummy Cash
            </button>
            <button 
              className="btn-secondary"
              onClick={() => {
                if (window.confirm("Are you sure you want to completely wipe your portfolio history and reset balance to $10,000?")) {
                  resetPortfolio();
                }
              }}
            >
              <RefreshCw size={16} style={{ marginRight: '8px' }}/> 
              Reset Account
            </button>
          </div>
        </GlassCard>
      </div>

      {/* Holdings List */}
      <div className="holdings-section">
        <h2 className="holdings-title">Your Assets</h2>
        
        {enhancedHoldings.length === 0 ? (
          <div className="empty-holdings">
            <Wallet size={48} color="var(--text-tertiary)" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: 'var(--fs-lg)', color: 'var(--text-primary)', fontWeight: 'bold' }}>No assets yet</span>
              <span>Make your first trade to get started.</span>
            </div>
            <button className="btn-primary" style={{ width: 'auto', padding: '12px 24px' }} onClick={() => navigate('/trade')}>
              Go to Trade
            </button>
          </div>
        ) : (
          <div className="markets-table-wrapper">
            <table className="markets-table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Balance</th>
                  <th>Avg. Buy Price</th>
                  <th>Current Price</th>
                  <th>Value</th>
                  <th>P/L</th>
                </tr>
              </thead>
              <tbody>
                {enhancedHoldings.map((h) => (
                  <tr key={h.coinId}>
                    <td>
                      <span className="coin-symbol">{h.symbol}</span>
                    </td>
                    <td>{h.amount.toLocaleString(undefined, { maximumFractionDigits: 4 })}</td>
                    <td>${h.avgBuyPrice.toLocaleString(undefined, { maximumFractionDigits: 4 })}</td>
                    <td>${h.currentPrice.toLocaleString(undefined, { maximumFractionDigits: 4 })}</td>
                    <td style={{ fontWeight: 'bold' }}>${h.currentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    <td>
                      <PriceChange percent={h.profitLossPercent} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* History List */}
      <div className="holdings-section">
        <h2 className="holdings-title">Trade History</h2>
        <GlassCard>
          {tradeHistory.length === 0 ? (
            <div style={{ padding: 'var(--space-6)', color: 'var(--text-tertiary)', textAlign: 'center' }}>
              No recent transactions.
            </div>
          ) : (
            <div className="history-list">
              {tradeHistory.map((trade) => (
                <div key={trade.id} className="history-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <div style={{ padding: '8px', borderRadius: '50%', background: trade.type === 'BUY' ? 'var(--accent-cyan-dim)' : 'var(--accent-red-dim)' }}>
                      <ArrowRightLeft size={16} color={trade.type === 'BUY' ? 'var(--accent-cyan)' : 'var(--accent-red)'} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 'bold' }}>{trade.type} {trade.symbol}</span>
                      <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>{new Date(trade.date).toLocaleString()}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ fontWeight: 'bold' }}>{trade.type === 'BUY' ? '-' : '+'}${trade.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
                      {trade.amount} @ ${trade.price.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default Portfolio;
