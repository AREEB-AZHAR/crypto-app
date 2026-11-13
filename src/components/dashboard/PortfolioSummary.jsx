import { Wallet, Plus, ArrowRightLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../ui/GlassCard';

const PortfolioSummary = () => {
  const navigate = useNavigate();

  return (
    <GlassCard glow>
      <div className="widget-header">
        <span className="widget-title">
          <Wallet size={18} style={{ color: 'var(--accent-purple)' }} />
          Paper Portfolio
        </span>
      </div>

      <div className="portfolio-hero">
        <div className="portfolio-balance">$10,450.25</div>
        <div className="portfolio-pl positive">
          +$450.25 (4.5%)
        </div>
      </div>

      <div className="portfolio-quick-actions">
        <button 
          className="btn-primary"
          onClick={() => navigate('/portfolio')}
        >
          <Plus size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
          Deposit Virtual
        </button>
        <button 
          className="btn-secondary"
          onClick={() => navigate('/trade')}
        >
          <ArrowRightLeft size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
          Trade Now
        </button>
      </div>
    </GlassCard>
  );
};

export default PortfolioSummary;
