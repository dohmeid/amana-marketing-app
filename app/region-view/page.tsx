"use client";
import { useState, useEffect, useMemo, Suspense } from 'react';
import { MarketingData, RegionalPerformance } from '@/src/types/marketing';
import { fetchMarketingData } from '@/src/lib/api';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/src/components/map'), {
  ssr: false,
  loading: () => <div className="text-white text-center h-full flex items-center justify-center">Loading map...</div>,
});

import { LatLngExpression } from 'leaflet';

const regionCoordinates: { [key: string]: LatLngExpression } = {
  "Abu Dhabi": [24.4539, 54.3773],
  "Dubai": [25.2048, 55.2708],
  "Sharjah": [25.3463, 55.4209],
  "Riyadh": [24.7136, 46.6753],
  "Jeddah": [21.4858, 39.1925],
  "Doha": [25.2854, 51.5310],
  "Kuwait City": [29.3759, 47.9774],
  "Manama": [26.2285, 50.5860],
  "Muscat": [23.5880, 58.3829],
  "Cairo": [30.0444, 31.2357],
};


export default function RegionView() {
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

  const regionalPerformance = useMemo(() => {
    if (!marketingData?.campaigns) return [];
    const performance: { [key: string]: RegionalPerformance } = {};

    marketingData.campaigns.forEach(campaign => {
      campaign.regional_performance.forEach(regionPerf => {
        if (!performance[regionPerf.region]) {
          performance[regionPerf.region] = { ...regionPerf, spend: 0, revenue: 0, conversions: 0, impressions: 0, clicks: 0 };
        }
        performance[regionPerf.region].spend += regionPerf.spend;
        performance[regionPerf.region].revenue += regionPerf.revenue;
        performance[regionPerf.region].conversions += regionPerf.conversions;
        performance[regionPerf.region].impressions += regionPerf.impressions;
        performance[regionPerf.region].clicks += regionPerf.clicks;
      });
    });

    return Object.values(performance).map(p => ({
      ...p,
      roas: p.spend > 0 ? p.revenue / p.spend : 0,
    }));
  }, [marketingData?.campaigns]);

  const mapData = useMemo(() => {
    return regionalPerformance
      .map(region => {
        const coordinates = regionCoordinates[region.region];
        if (!coordinates) return null;
        return { name: region.region, coordinates, revenue: region.revenue, spend: region.spend };
      })
      .filter((item): item is { name: string; coordinates: LatLngExpression; revenue: number; spend: number } => item !== null);
  }, [regionalPerformance]);



  if (loading) {
    return (
      <div className="flex h-screen bg-gray-900 items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-700 text-white py-12">
        <div className="px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold">
              Region Performance
            </h1>
          </div>
        </div>
      </section>

      {/* Content Area */}
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
        {/* Page content will go here */}
        <div className="flex-1 p-4 lg:p-6 h-[60vh] md:h-[70vh]">
          {loading ? <div className="text-white text-center">Loading data...</div> :
            error ? <div className="text-red-400 text-center">Error: {error}</div> :
              (
                <Suspense fallback={<div className="text-white text-center">Loading map...</div>}>
                  <Map data={mapData} />
                </Suspense>
              )}
        </div>

      </div>

    </>
  );
}