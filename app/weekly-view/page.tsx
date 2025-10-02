"use client";
import { useMemo } from 'react';
import { LineChart } from '../../src/components/line-chart';
import { useMarketingData } from '@/src/context/marketing-dataprovider';
import { HeroSection } from '../../src/components/hero-section';

export default function WeeklyView() {

  const { marketingData } = useMarketingData();

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

  return (
    <>
      <HeroSection title="Weekly View" />
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