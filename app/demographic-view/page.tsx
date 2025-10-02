"use client";
import { CardMetric } from '../../src/components/card-metric';
import { TrendingUp, Target, DollarSign } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { MarketingData } from '@/src/types/marketing';
import { fetchMarketingData } from '@/src/lib/api';
import { BarChart } from '@/src/components/bar-chart';
import { Table } from '@/src/components/table';

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

  const ageGenderPerformance = useMemo(() => {
    const performance: {
      [gender: string]: {
        [age_group: string]: {
          impressions: number;
          clicks: number;
          conversions: number;
        }
      }
    } = { Male: {}, Female: {} };

    if (!marketingData?.campaigns) {
      return { maleData: [], femaleData: [] };
    }

    marketingData.campaigns.forEach(campaign => {
      campaign.demographic_breakdown.forEach(demo => {
        if (!performance[demo.gender]) {
          performance[demo.gender] = {};
        }
        if (!performance[demo.gender][demo.age_group]) {
          performance[demo.gender][demo.age_group] = { impressions: 0, clicks: 0, conversions: 0 };
        }

        performance[demo.gender][demo.age_group].impressions += demo.performance.impressions;
        performance[demo.gender][demo.age_group].clicks += demo.performance.clicks;
        performance[demo.gender][demo.age_group].conversions += demo.performance.conversions;
      });
    });

    const processData = (gender: 'Male' | 'Female') => {
      return Object.entries(performance[gender]).map(([age_group, stats]) => ({
        age_group,
        impressions: stats.impressions,
        clicks: stats.clicks,
        conversions: stats.conversions,
        ctr: stats.impressions > 0 ? (stats.clicks / stats.impressions) * 100 : 0,
        conversion_rate: stats.clicks > 0 ? (stats.conversions / stats.clicks) * 100 : 0,
      }));
    };

    return {
      maleData: processData('Male'),
      femaleData: processData('Female'),
    };
  }, [marketingData?.campaigns]);


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
              Demographic View
            </h1>
          </div>
        </div>
      </section>

      {/* Content Area */}
      <div className="flex-1 p-4 lg:p-6 h-full w-full max-w-full">
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
                  icon={<Target className="h-5 w-5" />}
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

      {/* Age Group Performance Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 p-4 lg:p-6">
        {/* Male Age Group Performance */}
        <Table
          title="Campaign Performance by Male Age Groups"
          showIndex={true}
          maxHeight="400px"
          columns={[
            { key: 'age_group', header: 'Age Group', sortable: true, sortType: 'string', },
            { key: 'impressions', header: 'Impressions', sortable: true, sortType: 'number', render: (v) => v.toLocaleString() },
            { key: 'clicks', header: 'Clicks', sortable: true, sortType: 'number', render: (v) => v.toLocaleString() },
            { key: 'conversions', header: 'Conversions', sortable: true, sortType: 'number', render: (v) => v.toLocaleString() },
            { key: 'ctr', header: 'CTR', sortable: true, sortType: 'number', render: (v) => `${v.toFixed(2)}%` },
            { key: 'conversion_rate', header: 'Conv. Rate', sortable: true, sortType: 'number', render: (v) => `${v.toFixed(2)}%` }
          ]}
          defaultSort={{ key: 'impressions', direction: 'desc' }}
          data={ageGenderPerformance.maleData}
          emptyMessage="No data available for male age groups."
        />

        {/* Female Age Group Performance */}
        <Table
          title="Campaign Performance by Female Age Groups"
          columns={[
            { key: 'age_group', header: 'Age Group', sortable: true, sortType: 'string' },
            { key: 'impressions', header: 'Impressions', sortable: true, sortType: 'number', render: (v) => v.toLocaleString() },
            { key: 'clicks', header: 'Clicks', sortable: true, sortType: 'number', render: (v) => v.toLocaleString() },
            { key: 'conversions', header: 'Conversions', sortable: true, sortType: 'number', render: (v) => v.toLocaleString() },
            { key: 'ctr', header: 'CTR', sortable: true, sortType: 'number', render: (v) => `${v.toFixed(2)}%` },
            { key: 'conversion_rate', header: 'Conv. Rate', sortable: true, sortType: 'number', render: (v) => `${v.toFixed(2)}%` },
          ]}
          data={ageGenderPerformance.femaleData}
          defaultSort={{ key: 'impressions', direction: 'desc' }}
          emptyMessage="No data available for female age groups."
        />

      </div>

    </>
  );
}
