const BASE_URL = import.meta.env.MODE === 'development' 
  ? '/api/coingecko' 
  : 'https://api.coingecko.com/api/v3';

// Helper to handle rate limits and generic fetch logic
const fetchFromCoinGecko = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) {
      if (response.status === 429) {
        console.warn('CoinGecko rate limit exceeded.');
        throw new Error('API Rate Limit Exceeded: CoinGecko only allows ~15 requests per minute randomly. Please wait 60 seconds and refresh.');
      }
      throw new Error(`CoinGecko HTTP Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('CoinGecko API Error:', error);
    throw error; // Let ReactQuery handle the error state UI
  }
};

export const coingeckoApi = {
  // Global Market Data
  getGlobalData: async () => {
    const data = await fetchFromCoinGecko('/global');
    return data?.data;
  },

  // Trending Coins
  getTrending: async () => {
    const data = await fetchFromCoinGecko('/search/trending');
    return data?.coins?.map((c) => c.item) || [];
  },

  // Market List (for Markets Page)
  getMarketList: async (page = 1, perPage = 20, currency = 'usd') => {
    return fetchFromCoinGecko(
      `/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=1h,24h,7d`
    );
  },

  // Single Coin Detail
  getCoinDetail: async (id) => {
    return fetchFromCoinGecko(
      `/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
    );
  },

  // Coin Chart Data (OHLC)
  getCoinOHLC: async (id, days = 1, currency = 'usd') => {
    return fetchFromCoinGecko(`/coins/${id}/ohlc?vs_currency=${currency}&days=${days}`);
  },

  // Coin Market Chart (Prices, Market Caps, Volumes)
  getCoinMarketChart: async (id, days = 1, currency = 'usd') => {
    return fetchFromCoinGecko(
      `/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`
    );
  },
};
