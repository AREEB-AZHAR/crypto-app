import '../../styles/dashboard.css';

const GlassCard = ({ children, className = '', padded = true, glow = false }) => {
  return (
    <div 
      className={`glass-card ${padded ? 'glass-card-padded' : ''} ${glow ? 'glass-card-glow' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassCard;
