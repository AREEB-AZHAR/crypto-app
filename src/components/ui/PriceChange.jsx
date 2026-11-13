import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const PriceChange = ({ percent, className = '', showArrow = true }) => {
  const isPositive = percent >= 0;
  const formattedPercent = Math.abs(percent).toFixed(2);
  
  return (
    <span 
      className={`price-change ${isPositive ? 'price-change-up' : 'price-change-down'} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontWeight: 600,
        color: isPositive ? 'var(--accent-cyan)' : 'var(--accent-red)',
        fontSize: 'var(--fs-sm)',
      }}
    >
      {showArrow && (
        isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />
      )}
      {formattedPercent}%
    </span>
  );
};

export default PriceChange;
