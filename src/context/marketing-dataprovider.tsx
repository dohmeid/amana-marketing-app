"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MarketingData } from '@/src/types/marketing';
import { fetchMarketingData } from '@/src/lib/api';

interface MarketingDataContextType {
  marketingData: MarketingData | null;
  loading: boolean;
  error: string | null;
}

const MarketingDataContext = createContext<MarketingDataContextType | undefined>(undefined);

export function MarketingDataProvider({ children }: { children: ReactNode }) {
  const [marketingData, setMarketingData] = useState<MarketingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchMarketingData();
        setMarketingData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('Error loading marketing data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const value = { marketingData, loading, error };

  return (
    <MarketingDataContext.Provider value={value}>
      {children}
    </MarketingDataContext.Provider>
  );
}

export function useMarketingData() {
  const context = useContext(MarketingDataContext);
  if (context === undefined) {
    throw new Error('useMarketingData must be used within a MarketingDataProvider');
  }
  return context;
}
