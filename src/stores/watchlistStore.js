import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWatchlistStore = create(
  persist(
    (set, get) => ({
      watchlist: [], // Array of coin ids ['bitcoin', 'ethereum']

      toggleWatchlist: (coinId) => {
        set((state) => {
          const isWatched = state.watchlist.includes(coinId);
          if (isWatched) {
            return { watchlist: state.watchlist.filter(id => id !== coinId) };
          } else {
            return { watchlist: [...state.watchlist, coinId] };
          }
        });
      },

      isWatched: (coinId) => {
        return get().watchlist.includes(coinId);
      }
    }),
    {
      name: 'cryptotrader-watchlist',
    }
  )
);
