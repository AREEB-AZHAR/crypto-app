import { Zap } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import PriceChange from '../ui/PriceChange';

const MOCK_MOVERS = [
  { id: 'wif', symbol: 'WIF', price: '$3.45', change: 65.4, up: true },
  { id: 'floki', symbol: 'FLOKI', price: '$0.00021', change: 42.1, up: true },
  { id: 'ondo', symbol: 'ONDO', price: '$1.05', change: 24.5, up: true },
  { id: 'jup', symbol: 'JUP', price: '$1.20', change: 18.2, up: true },
  { id: 'bome', symbol: 'BOME', price: '$0.012', change: -22.4, up: false },
  { id: 'slerf', symbol: 'SLERF', price: '$0.45', change: -15.8, up: false },
];

const TopMovers = () => {
  return (
    <GlassCard>
      <div className="widget-header">
        <span className="widget-title">
          <Zap size={18} style={{ color: 'var(--accent-cyan)' }} />
          Top Movers (24h)
        </span>
      </div>
      
      <div className="movers-grid">
        {MOCK_MOVERS.map((coin) => (
          <div key={coin.id} className="mover-card">
            <div className="mover-top">
              <span className="coin-symbol">{coin.symbol}</span>
              <PriceChange percent={coin.change} showArrow={false} />
            </div>
            <div className="mover-bottom">
              <span className="coin-price" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-sm)' }}>
                {coin.price}
              </span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default TopMovers;
