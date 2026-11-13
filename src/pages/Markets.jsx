import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarketList } from '../hooks/useMarketData';
import { useWatchlistStore } from '../stores/watchlistStore';
import { LineChart, Star, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import PriceChange from '../components/ui/PriceChange';
import '../styles/markets.css';

const FILTERS = ['All', 'DeFi', 'NFT', 'Layer 1', 'Meme'];

const Markets = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState('All');
  const toggleWatchlist = useWatchlistStore((state) => state.toggleWatchlist);
  const isWatched = useWatchlistStore((state) => state.isWatched);

  const { data: coins, isLoading, isError, isPreviousData } = useMarketList(page, 50);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: price < 1 ? 4 : 2,
    }).format(price);
  };

  const formatCompact = (num) => {
    return new Intl.NumberFormat('en-US', {
      notation: "compact",
      maximumFractionDigits: 1
    }).format(num);
  };

  const handleRowClick = (id) => {
    navigate(`/coin/${id}`);
  };

  const handleStarClick = (e, id) => {
    e.stopPropagation(); // Prevents row click navigation
    toggleWatchlist(id);
  };

  // Very basic render logic for the tiny inline sparkline
  const renderSparkline = (sparklineData, isPositive) => {
    if (!sparklineData || !sparklineData.price) return null;
    const prices = sparklineData.price;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;
    
    // Convert to simple SVG polyline string (width: 150, height: 40)
    const points = prices.map((price, idx) => {
      const x = (idx / (prices.length - 1)) * 150;
      const y = 40 - ((price - min) / range) * 40;
      return `${x},${y}`;
    }).join(' ');

    const color = isPositive ? 'var(--accent-cyan)' : 'var(--accent-red)';

    return (
      <svg width="150" height="40" className="col-chart">
        <polyline 
          points={points} 
          fill="none" 
          stroke={color} 
          strokeWidth="1.5" 
          strokeLinejoin="round" 
          strokeLinecap="round" 
        />
      </svg>
    );
  };

  return (
    <div className="markets-page">
      <div className="markets-header">
        <h1 className="markets-title">
          <LineChart size={28} className="text-cyan" />
          Market Overview
        </h1>
        
        <div className="markets-filters">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="markets-table-wrapper">
        <table className="markets-table">
          <thead>
            <tr>
              <th className="col-rank">#</th>
              <th>Coin</th>
              <th>Price</th>
              <th>24h %</th>
              <th className="col-7d">7d %</th>
              <th className="col-volume">24h Vol</th>
              <th className="col-marketcap">Market Cap</th>
              <th className="col-chart">Last 7 Days</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="8">
                  <div className="markets-loading">
                    <div className="spinner"></div>
                    Loading market data...
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan="8">
                  <div className="markets-error">
                    <AlertCircle size={32} />
                    Failed to load market data. Please try again later.
                  </div>
                </td>
              </tr>
            ) : (
              coins?.map((coin) => (
                <tr key={coin.id} onClick={() => handleRowClick(coin.id)}>
                  <td className="col-rank">
                    <button 
                      onClick={(e) => handleStarClick(e, coin.id)}
                      style={{ cursor: 'pointer', opacity: isWatched(coin.id) ? 1 : 0.4 }}
                    >
                      <Star 
                        size={16} 
                        fill={isWatched(coin.id) ? 'var(--accent-orange)' : 'none'} 
                        color={isWatched(coin.id) ? 'var(--accent-orange)' : 'var(--text-tertiary)'} 
                      />
                    </button>
                    <span style={{ marginLeft: '8px' }}>{coin.market_cap_rank}</span>
                  </td>
                  <td>
                    <div className="col-coin">
                      <div className="coin-icon">
                        <img src={coin.image} alt={coin.name} />
                      </div>
                      <div className="coin-details">
                        <span className="coin-symbol">{coin.symbol}</span>
                        <span className="coin-name">{coin.name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="col-price">{formatPrice(coin.current_price)}</td>
                  <td>
                    <PriceChange percent={coin.price_change_percentage_24h_in_currency} />
                  </td>
                  <td className="col-7d">
                    <PriceChange percent={coin.price_change_percentage_7d_in_currency} />
                  </td>
                  <td className="col-volume">${formatCompact(coin.total_volume)}</td>
                  <td className="col-marketcap">${formatCompact(coin.market_cap)}</td>
                  <td>
                    {renderSparkline(
                      coin.sparkline_in_7d, 
                      coin.price_change_percentage_7d_in_currency >= 0
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button 
          className="page-btn" 
          onClick={() => setPage(old => Math.max(old - 1, 1))}
          disabled={page === 1}
        >
          <ChevronLeft size={20} />
        </button>
        <span className="page-info">Page {page}</span>
        <button 
          className="page-btn"
          onClick={() => {
            if (!isPreviousData && coins?.length === 50) {
              setPage(old => old + 1);
            }
          }}
          // Disable next page if we didn't fetch a full page (end of list)
          disabled={isPreviousData || coins?.length < 50}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Markets;
