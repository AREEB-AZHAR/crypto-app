import { useState, useMemo } from 'react';
import { usePortfolioStore } from '../stores/portfolioStore';
import { useCoinDetail } from '../hooks/useMarketData';
import GlassCard from '../components/ui/GlassCard';
import { ChevronDown, AlertCircle } from 'lucide-react';
import '../styles/trade.css';

const Trade = () => {
  const [side, setSide] = useState('buy'); // 'buy' or 'sell'
  const [amount, setAmount] = useState('');
  const [coinId, setCoinId] = useState('bitcoin'); // Hardcoded default for simulator

  // Stores
  const balance = usePortfolioStore((state) => state.balance);
  const executeBuy = usePortfolioStore((state) => state.executeBuy);
  const executeSell = usePortfolioStore((state) => state.executeSell);
  const holdings = usePortfolioStore((state) => state.holdings);
  
  // Data
  const { data: coin, isLoading } = useCoinDetail(coinId);
  
  const currentPrice = coin?.market_data?.current_price?.usd || 0;
  const coinSymbol = coin?.symbol?.toUpperCase() || '';
  
  const currentHolding = holdings.find(h => h.coinId === coinId)?.amount || 0;
  const totalValue = parseFloat(amount || 0) * currentPrice;

  // Validation
  const canSubmit = useMemo(() => {
    if (!amount || isNaN(amount) || amount <= 0) return false;
    if (side === 'buy') {
      return totalValue <= balance;
    } else {
      return parseFloat(amount) <= currentHolding;
    }
  }, [amount, side, totalValue, balance, currentHolding]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      if (side === 'buy') {
        executeBuy(coinId, coinSymbol, parseFloat(amount), currentPrice);
      } else {
        executeSell(coinId, coinSymbol, parseFloat(amount), currentPrice);
      }
      setAmount(''); // Reset
      alert(`Successfully ${side === 'buy' ? 'bought' : 'sold'} ${amount} ${coinSymbol}`);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="trade-page">
      {/* Left: Chart & Info */}
      <div className="trade-chart-panel">
        <GlassCard>
          <div className="trade-header">
            <div className="trade-pair-selector">
              <div className="pair-icons">
                <img src={coin?.image?.small} alt="" className="pair-icon" />
              </div>
              <span className="pair-name">{coinSymbol}/USD</span>
              <ChevronDown size={16} color="var(--text-tertiary)" />
            </div>
            
            <div className="trade-price-info">
              <span className="trade-current-price">
                ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          
          <div className="trade-chart-container">
            {/* Real implementation would embed TradingChart here fetching OHLC */}
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              Select a coin from Markets to load live chart.
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Right: Order Entry Panel */}
      <GlassCard className="order-entry-panel">
        <div className="order-tabs">
          <button 
            className={`order-tab buy ${side === 'buy' ? 'active' : ''}`}
            onClick={() => setSide('buy')}
          >
            Buy
          </button>
          <button 
            className={`order-tab sell ${side === 'sell' ? 'active' : ''}`}
            onClick={() => setSide('sell')}
          >
            Sell
          </button>
        </div>

        <div className="order-type-selector">
          <button className="type-btn active">Market</button>
          <button className="type-btn">Limit</button>
          <button className="type-btn">Stop Limit</button>
        </div>

        <form className="order-form" onSubmit={handleSubmit}>
          
          {/* Amount Input */}
          <div className="order-input-group" style={{ marginTop: 'var(--space-4)' }}>
            <div className="order-label">
              <span>Amount</span>
              <span>Available: {side === 'buy' ? `$${balance.toLocaleString()}` : `${currentHolding} ${coinSymbol}`}</span>
            </div>
            <div className="order-input-wrapper">
              <input 
                type="number" 
                className="order-input" 
                placeholder="0.00" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="any"
                min="0"
              />
              <span className="order-currency">{coinSymbol}</span>
            </div>
          </div>

          {/* Quick Percentages */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            {[25, 50, 75, 100].map(pct => (
              <button 
                key={pct}
                type="button"
                className="filter-btn" 
                style={{ flex: 1, padding: '4px 0' }}
                onClick={() => {
                  if (side === 'buy') {
                    setAmount(((balance * (pct/100)) / currentPrice).toFixed(6));
                  } else {
                    setAmount((currentHolding * (pct/100)).toFixed(6));
                  }
                }}
              >
                {pct}%
              </button>
            ))}
          </div>

          {/* Warnings */}
          {amount && !canSubmit && (
            <div style={{ color: 'var(--accent-red)', fontSize: 'var(--fs-xs)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: 'var(--space-2)' }}>
              <AlertCircle size={14} /> Insufficient {side === 'buy' ? 'balance' : 'holdings'}
            </div>
          )}

          <div className="order-summary">
            <div className="summary-row">
              <span>Price</span>
              <span>${currentPrice.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Fee (0.1%)</span>
              <span>${(totalValue * 0.001).toLocaleString()}</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>

          <button 
            type="submit" 
            className={`submit-order-btn ${side}`}
            disabled={!canSubmit || isLoading}
          >
            {side} {coinSymbol}
          </button>
        </form>
      </GlassCard>
    </div>
  );
};

export default Trade;
