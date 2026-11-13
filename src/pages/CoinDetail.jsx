import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCoinDetail, useCoinMarketChart } from '../hooks/useMarketData';
import { useWatchlistStore } from '../stores/watchlistStore';
import TradingChart from '../components/charts/TradingChart';
import GlassCard from '../components/ui/GlassCard';
import PriceChange from '../components/ui/PriceChange';
import { Star, ArrowRightLeft, ArrowLeft, ExternalLink } from 'lucide-react';
import '../styles/coin-detail.css';

const TIME_RANGES = [
  { label: '1D', value: '1' },
  { label: '7D', value: '7' },
  { label: '1M', value: '30' },
  { label: '1Y', value: '365' },
  { label: 'ALL', value: 'max' }
];

const CoinDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const toggleWatchlist = useWatchlistStore((state) => state.toggleWatchlist);
  const isWatched = useWatchlistStore((state) => state.isWatched(id));

  // Data fetching - Notice we dropped the heavy historical chart data hook entirely!
  const { data: coin, isLoading: loadingCoin } = useCoinDetail(id);

  if (loadingCoin) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!coin) {
    return <div style={{ color: 'var(--accent-red)' }}>Error: Coin not found.</div>;
  }

  const currentPrice = coin?.market_data?.current_price?.usd || 0;
  const priceChange24h = coin?.market_data?.price_change_percentage_24h || 0;

  return (
    <div className="coin-detail-page">
      <button 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}
        onClick={() => navigate('/markets')}
      >
        <ArrowLeft size={16} /> Back to Markets
      </button>

      {/* Header Card */}
      <div className="coin-header-card">
        <div className="coin-hero">
          <div className="coin-title-row">
            <img src={coin?.image?.large} alt={coin?.name} className="coin-hero-logo" />
            <h1 className="coin-hero-name">{coin?.name}</h1>
            <span className="coin-hero-symbol">{coin?.symbol}</span>
            <span className="coin-rank-badge">Rank #{coin?.market_cap_rank}</span>
          </div>

          <div className="coin-price-block">
            <span className="coin-huge-price">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(currentPrice)}
            </span>
            <PriceChange percent={priceChange24h} style={{ fontSize: 'var(--fs-lg)' }} />
          </div>
        </div>

        <div className="coin-header-actions">
          <button 
            className={`btn-icon ${isWatched ? 'active' : ''}`}
            onClick={() => toggleWatchlist(id)}
            title={isWatched ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            <Star 
              size={20} 
              fill={isWatched ? 'var(--accent-orange)' : 'none'} 
              color={isWatched ? 'var(--accent-orange)' : 'currentColor'}
            />
          </button>
          {coin?.links?.homepage?.[0] && (
            <a href={coin.links.homepage[0]} target="_blank" rel="noreferrer" className="btn-icon">
              <ExternalLink size={20} />
            </a>
          )}
          <button 
            className="btn-primary" 
            style={{ padding: '0 var(--space-6)', display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={() => navigate('/trade')} // Will pre-fill pair in final iteration
          >
            <ArrowRightLeft size={18} /> Trade Now
          </button>
        </div>
      </div>

      <div className="coin-chart-section">
        {/* Main Chart */}
        <GlassCard className="chart-card" style={{ padding: 0 }}>
          <div className="chart-container-wrapper" style={{ height: '500px' }}>
             <TradingChart symbol={coin.symbol} theme="dark" />
          </div>
        </GlassCard>

        {/* Side Stats Panel */}
        <div className="coin-side-panel">
          <GlassCard>
            <div className="widget-header" style={{ padding: 'var(--space-6) var(--space-6) 0' }}>
              <span className="widget-title">Market Stats</span>
            </div>
            <div className="stats-grid">
              <div className="stat-row">
                <span className="stat-label">Market Cap</span>
                <span className="stat-value">
                  ${coin?.market_data?.market_cap?.usd 
                    ? new Intl.NumberFormat('en-US', { notation: 'compact' }).format(coin.market_data.market_cap.usd)
                    : 'N/A'}
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-label">24h Volume</span>
                <span className="stat-value">
                  ${coin?.market_data?.total_volume?.usd
                    ? new Intl.NumberFormat('en-US', { notation: 'compact' }).format(coin.market_data.total_volume.usd)
                    : 'N/A'}
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Circulating Supply</span>
                <span className="stat-value">
                  {coin?.market_data?.circulating_supply
                    ? `${new Intl.NumberFormat('en-US', { notation: 'compact' }).format(coin.market_data.circulating_supply)} ${coin?.symbol?.toUpperCase()}`
                    : 'N/A'}
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Max Supply</span>
                <span className="stat-value">
                  {coin?.market_data?.max_supply ? new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(coin.market_data.max_supply) : '∞'}
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-label">All Time High</span>
                <span className="stat-value">
                  ${coin?.market_data?.ath?.usd ? coin.market_data.ath.usd.toLocaleString() : 'N/A'}
                </span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <GlassCard className="coin-about-section">
        <h2>About {coin?.name}</h2>
        <div 
          dangerouslySetInnerHTML={{ __html: coin?.description?.en || 'No description available for this coin.' }} 
        />
      </GlassCard>
    </div>
  );
};

export default CoinDetail;
