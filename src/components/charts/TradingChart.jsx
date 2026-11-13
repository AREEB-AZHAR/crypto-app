import { useEffect, useRef } from 'react';

// Map CoinGecko names/IDs to TradingView universal symbols
const mapToTVSymbol = (coinSymbol) => {
  if (!coinSymbol) return 'CRYPTO:BTCUSD';
  const clean = coinSymbol.toUpperCase();
  
  // Stablecoins map best as they are on TV
  if (['USDT', 'USDC', 'DAI'].includes(clean)) return `CRYPTO:${clean}USD`;

  return `CRYPTO:${clean}USD`; 
};

const TradingChart = ({ symbol, theme = 'dark' }) => {
  const container = useRef(null);
  const widgetId = useRef(`tv_chart_${Math.random().toString(36).substring(7)}`);

  useEffect(() => {
    if (!container.current) return;
    container.current.innerHTML = '';
    
    // Create the target div perfectly sized
    const div = document.createElement('div');
    div.id = widgetId.current;
    div.style.width = '100%';
    div.style.height = '100%';
    container.current.appendChild(div);

    const tvSymbol = mapToTVSymbol(symbol);

    const initWidget = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          autosize: true,
          symbol: tvSymbol,
          interval: "D",
          timezone: "Etc/UTC",
          theme: theme || "dark",
          style: "1", // Candlestick standard
          locale: "en",
          enable_publishing: false,
          backgroundColor: "#0a0e27", // Match var(--bg-primary)
          gridColor: "rgba(255, 255, 255, 0.05)",
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          container_id: widgetId.current,
        });
      }
    };

    if (typeof window.TradingView === 'undefined') {
      const script = document.createElement('script');
      script.id = 'tradingview-widget-script';
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = initWidget;
      document.head.appendChild(script);
    } else {
      initWidget();
    }
    
    // Cleanup isn't strict for TV iframes as emptying the container div kills it
  }, [symbol, theme]);

  return <div ref={container} style={{ height: "100%", width: "100%", borderRadius: 'var(--radius-md)', overflow: 'hidden' }} />;
};

export default TradingChart;
