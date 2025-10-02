"use client";
import { useState, useEffect, useMemo } from 'react';
import { fetchMarketingData } from '../../src/lib/api';
import { MarketingData } from '../../src/types/marketing';
import { BarChart } from '../../src/components/ui/bar-chart';
import { LineChart } from '../../src/components/ui/line-chart';


export default function WeeklyView() {

  const [marketingData, setMarketingData] = useState<MarketingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load data on component mount
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


  /* display revenue by week and spend by week.  */
  const weeklyPerformance = useMemo(() => {
    const weeklyData: { [week: number]: { revenue: number, spend: number } } = {};
    if (marketingData?.campaigns) {
      marketingData?.campaigns.forEach(campaign => {
        campaign.weekly_performance.forEach((week, index) => {
          const weekNumber = index + 1;
          if (!weeklyData[weekNumber]) {
            weeklyData[weekNumber] = { revenue: 0, spend: 0 };
          }
          weeklyData[weekNumber].revenue += week.revenue;
          weeklyData[weekNumber].spend += week.revenue;
        });
      });
    }
    return weeklyData;
  }, [marketingData?.campaigns]);

  const weeklyRevenueData = useMemo(() => {
    return Object.entries(weeklyPerformance).map(([week, data]) => ({
      x: parseInt(week),
      y: data.revenue,
      label: `W${week}`
    }));
  }, [weeklyPerformance]);

  const weeklySpendData = useMemo(() => {
    return Object.entries(weeklyPerformance).map(([week, data]) => ({
      x: parseInt(week),
      y: data.spend,
      label: `W${week}`
    }));
  }, [weeklyPerformance]);

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
              Weekly View
            </h1>
          </div>
        </div>
      </section>

      {/* display revenue by week and spend by week.  */}
      <div className="p-6 lg:p-6 overflow-y-auto grid grid-cols-1 xl:grid-cols-2 gap-6">
        {marketingData && (
          <>
            <LineChart
              title="Weekly Revenue"
              data={weeklyRevenueData}
              color="#10B981"
              yAxisLabel="Revenue (USD)"
              formatY={(v) => `$${(v / 1000).toFixed(0)}k`} />

            <LineChart
              title="Weekly Spend"
              data={weeklySpendData}
              color="#3B82F6"
              yAxisLabel="Spend (USD)"
              formatY={(v) => `$${(v / 1000).toFixed(0)}k`} />
          </>
        )}
      </div>
    </>
  );
}