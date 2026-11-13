import { Flame, ChevronRight } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import PriceChange from '../ui/PriceChange';

const MOCK_TRENDING = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: '$64,230.00', change: 2.4, url: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', price: '$145.20', change: 12.5, url: 'https://assets.coingecko.com/coins/images/4128/small/solana.png' },
  { id: 'pepe', symbol: 'PEPE', name: 'Pepe', price: '$0.0000084', change: 45.2, url: 'https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg' },
  { id: 'render', symbol: 'RNDR', name: 'Render', price: '$10.45', change: 8.7, url: 'https://assets.coingecko.com/coins/images/11636/small/rndr.png' },
];

const TrendingCoins = () => {
  return (
    <GlassCard>
      <div className="widget-header">
        <span className="widget-title">
          <Flame size={18} style={{ color: 'var(--accent-orange)' }} />
          Trending Now
        </span>
        <button className="widget-action">View All</button>
      </div>
      
      <div className="trending-list">
        {MOCK_TRENDING.map((coin) => (
          <div key={coin.id} className="trending-item">
            <div className="trending-coin-info">
              <div className="coin-icon">
                <img src={coin.url} alt={coin.name} />
              </div>
              <div className="coin-details">
                <span className="coin-symbol">{coin.symbol}</span>
                <span className="coin-name">{coin.name}</span>
              </div>
            </div>
            
            <div className="trending-price-info">
              <span className="coin-price">{coin.price}</span>
              <PriceChange percent={coin.change} />
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default TrendingCoins;
