import { Activity, LayoutGrid, BarChart3, PieChart } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import PriceChange from '../ui/PriceChange';

// Static placeholder data for now (will be replaced by React Query + CoinGecko)
const OVERVIEW_DATA = [
  {
    id: 'market-cap',
    title: 'Total Market Cap',
    value: '$2.42T',
    change: 1.25,
    icon: PieChart,
    color: 'var(--accent-purple)'
  },
  {
    id: 'volume',
    title: '24h Volume',
    value: '$84.5B',
    change: -5.4,
    icon: BarChart3,
    color: 'var(--accent-cyan)'
  },
  {
    id: 'btc-dom',
    title: 'BTC Dominance',
    value: '52.4%',
    change: 0.1,
    icon: Activity,
    color: 'var(--accent-orange)'
  },
];

const MarketOverviewCards = () => {
  return (
    <div className="dashboard-row-top">
      {OVERVIEW_DATA.map((item) => {
        const Icon = item.icon;
        return (
          <GlassCard key={item.id}>
            <div className="widget-header">
              <span className="widget-title">
                <Icon size={18} style={{ color: item.color }} />
                {item.title}
              </span>
            </div>
            <div className="overview-value">{item.value}</div>
            <div className="overview-sub">
              vs last 24h
              <PriceChange percent={item.change} />
            </div>
          </GlassCard>
        );
      })}

      {/* Fear & Greed Index Placeholder */}
      <GlassCard glow>
        <div className="widget-header">
          <span className="widget-title">
            <LayoutGrid size={18} style={{ color: 'var(--accent-red)' }} />
            Market Sentiment
          </span>
        </div>
        <div className="overview-value" style={{ color: 'var(--accent-cyan)' }}>74</div>
        <div className="overview-sub">Greed (Fear & Greed Index)</div>
      </GlassCard>
    </div>
  );
};

export default MarketOverviewCards;
