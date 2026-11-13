import { useQuery } from '@tanstack/react-query';
import { coingeckoApi } from '../api/coingecko';

const STALE_TIME_FAST = 30 * 1000; // 30 seconds
const STALE_TIME_SLOW = 5 * 60 * 1000; // 5 minutes

export const useGlobalData = () => {
  return useQuery({
    queryKey: ['globalData'],
    queryFn: coingeckoApi.getGlobalData,
    staleTime: STALE_TIME_SLOW, // Global data doesn't change rapidly
    retry: 2,
  });
};

export const useTrending = () => {
  return useQuery({
    queryKey: ['trendingCoins'],
    queryFn: coingeckoApi.getTrending,
    staleTime: STALE_TIME_SLOW,
    retry: 2,
  });
};

export const useMarketList = (page = 1, perPage = 50, currency = 'usd') => {
  return useQuery({
    queryKey: ['marketList', page, perPage, currency],
    queryFn: () => coingeckoApi.getMarketList(page, perPage, currency),
    staleTime: STALE_TIME_FAST,
    retry: 2,
    keepPreviousData: true, // Smooth pagination
  });
};

export const useCoinDetail = (id) => {
  return useQuery({
    queryKey: ['coinDetail', id],
    queryFn: () => coingeckoApi.getCoinDetail(id),
    enabled: !!id,
    staleTime: STALE_TIME_FAST,
    retry: 2,
  });
};

export const useCoinMarketChart = (id, days) => {
  return useQuery({
    queryKey: ['coinMarketChart', id, days],
    queryFn: () => coingeckoApi.getCoinMarketChart(id, days),
    enabled: !!id,
    staleTime: STALE_TIME_FAST,
    retry: 2,
  });
};
