import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Starting local balance for simulator
const INITIAL_BALANCE = 10000;

export const usePortfolioStore = create(
  persist(
    (set, get) => ({
      balance: INITIAL_BALANCE,
      holdings: [], // Array of { coinId, symbol, amount, avgBuyPrice }
      tradeHistory: [], // Array of { id, type, coinId, amount, price, total, date }

      // Execute a Buy Order
      executeBuy: (coinId, symbol, amount, price) => {
        const totalCost = amount * price;
        const currentBalance = get().balance;

        if (currentBalance < totalCost) {
          throw new Error('Insufficient balance');
        }

        set((state) => {
          // Check if already holding this coin
          const existingHoldingIndex = state.holdings.findIndex(h => h.coinId === coinId);
          let newHoldings = [...state.holdings];

          if (existingHoldingIndex >= 0) {
            // Update existing holding (calculate new average price)
            const holding = newHoldings[existingHoldingIndex];
            const newTotalAmount = holding.amount + amount;
            const newAvgPrice = ((holding.amount * holding.avgBuyPrice) + totalCost) / newTotalAmount;
            
            newHoldings[existingHoldingIndex] = {
              ...holding,
              amount: newTotalAmount,
              avgBuyPrice: newAvgPrice,
            };
          } else {
            // Add new holding
            newHoldings.push({
              coinId,
              symbol,
              amount,
              avgBuyPrice: price,
            });
          }

          const tradeRecord = {
            id: Date.now().toString(),
            type: 'BUY',
            coinId,
            symbol,
            amount,
            price,
            total: totalCost,
            date: new Date().toISOString()
          };

          return {
            balance: state.balance - totalCost,
            holdings: newHoldings,
            tradeHistory: [tradeRecord, ...state.tradeHistory],
          };
        });
      },

      // Execute a Sell Order
      executeSell: (coinId, symbol, amount, price) => {
        set((state) => {
          const existingHoldingIndex = state.holdings.findIndex(h => h.coinId === coinId);
          
          if (existingHoldingIndex < 0 || state.holdings[existingHoldingIndex].amount < amount) {
            throw new Error('Insufficient coin balance to sell');
          }

          let newHoldings = [...state.holdings];
          const holding = newHoldings[existingHoldingIndex];
          const totalRevenue = amount * price;

          if (holding.amount === amount) {
            // Sell all
            newHoldings.splice(existingHoldingIndex, 1);
          } else {
            // Partial sell
            newHoldings[existingHoldingIndex] = {
              ...holding,
              amount: holding.amount - amount,
            };
          }

          const tradeRecord = {
            id: Date.now().toString(),
            type: 'SELL',
            coinId,
            symbol,
            amount,
            price,
            total: totalRevenue,
            date: new Date().toISOString()
          };

          return {
            balance: state.balance + totalRevenue,
            holdings: newHoldings,
            tradeHistory: [tradeRecord, ...state.tradeHistory],
          };
        });
      },

      // Reset Account
      resetPortfolio: () => {
        set({ balance: INITIAL_BALANCE, holdings: [], tradeHistory: [] });
      },
      
      // Top up dummy funds
      depositVirtual: (amount) => {
        set((state) => ({ balance: state.balance + amount }));
      }
    }),
    {
      name: 'cryptotrader-portfolio', // key in local storage
    }
  )
);
