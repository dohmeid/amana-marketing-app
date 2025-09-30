"use client";
import { Navbar } from '../../src/components/ui/navbar';
import { CardMetric } from '../../src/components/ui/card-metric';
import { Footer } from '../../src/components/ui/footer';
import { Users, TrendingUp, Target, DollarSign } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { MarketingData } from '@/src/types/marketing';
import { fetchMarketingData } from '@/src/lib/api';
import { BarChart } from '@/src/components/ui/bar-chart';

export default function DemographicView() {
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

  const demographicStats = useMemo(() => {
    const stats = {
      male: { clicks: 0, spend: 0, revenue: 0 },
      female: { clicks: 0, spend: 0, revenue: 0 },
    };

    if (!marketingData?.campaigns) {
      return stats;
    }

    marketingData.campaigns.forEach(campaign => {
      campaign.demographic_breakdown.forEach(demo => {
        const spend = campaign.spend * (demo.percentage_of_audience / 100);
        const revenue = campaign.revenue * (demo.percentage_of_audience / 100);
        if (demo.gender === 'Male') {
          stats.male.clicks += demo.performance.clicks;
          stats.male.spend += spend;
          stats.male.revenue += revenue;
        }
        else if (demo.gender === 'Female') {
          stats.female.clicks += demo.performance.clicks;
          stats.female.spend += spend;
          stats.female.revenue += revenue;
        }
      })

    })
    return stats;
  }, [marketingData?.campaigns]);

  //Total Spend by Age Group + Total Revenue by Age Group
  const ageGroupPerformance = useMemo(() => {

    const performance: { [key: string]: { spends: number, revenues: number } } = {};

    if (!marketingData?.campaigns) {
      return performance;
    }

    marketingData.campaigns.forEach(campaign => {
      campaign.demographic_breakdown.forEach(demo => {

        if (!performance[demo.age_group]) {
          performance[demo.age_group] = { spends: 0, revenues: 0 };
        }

        const spend = campaign.spend * (demo.percentage_of_audience / 100);
        const revenue = campaign.revenue * (demo.percentage_of_audience / 100);
        performance[demo.age_group].spends += spend;
        performance[demo.age_group].revenues += revenue;
      });
    });

    return performance;
  }, [marketingData?.campaigns]);


  if (loading) {
    return (
      <div className="flex h-screen bg-gray-900">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }


  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900">
      <Navbar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out overflow-hidden">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-800 to-gray-700 text-white py-12">
          <div className="px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-5xl font-bold">
                Demographic View
              </h1>
            </div>
          </div>
        </section>

        {/* Content Area */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto w-full max-w-full">
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-4 max-w-2xl mx-auto">
              Error loading data: {error}
            </div>
          )}
          {marketingData && (
            <>
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Male Audience Performance</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <CardMetric
                    title="Total Clicks by Males"
                    value={demographicStats.male.clicks}
                    icon={<Target className="h-5 w-5" />}
                  />
                  <CardMetric
                    title="Total Spend on Males"
                    value={`$${demographicStats.male.spend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    icon={<DollarSign className="h-5 w-5" />}
                  />
                  <CardMetric
                    title="Total Revenue from Males"
                    value={`$${demographicStats.male.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    icon={<TrendingUp className="h-5 w-5" />}
                  />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Female Audience Performance</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <CardMetric
                    title="Total Clicks by Females"
                    value={demographicStats.female.clicks}
                    icon={<Users className="h-5 w-5" />}
                  />
                  <CardMetric
                    title="Total Spend on Females"
                    value={`$${demographicStats.female.spend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    icon={<DollarSign className="h-5 w-5" />}
                  />
                  <CardMetric
                    title="Total Revenue from Females"
                    value={`$${demographicStats.female.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    icon={<TrendingUp className="h-5 w-5" />}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Campaign Performance Charts */}
        {Object.keys(ageGroupPerformance).length > 0 && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 p-4 lg:p-6">
            {/* Total Spend by Age Group */}
            <BarChart
              title="Total Spend by Age Group"
              data={Object.keys(ageGroupPerformance).map(ageGroup => ({
                label: ageGroup,
                value: ageGroupPerformance[ageGroup].spends,
                color: '#10B981'
              }))}
              formatValue={(value) => `$${value.toLocaleString()}`}
            />

            {/* Total Revenue by Age Group */}
            <BarChart
              title="Total Revenue by Age Group"
              data={Object.keys(ageGroupPerformance).map(ageGroup => ({
                label: ageGroup,
                value: ageGroupPerformance[ageGroup].revenues,
                color: '#3B82F6'
              }))}
              formatValue={(value) => `$${value.toLocaleString()}`}
            />
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}



