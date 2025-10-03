"use client";
import { useMarketingData } from "../src/context/marketing-dataprovider";
import { CardMetric } from "../src/components/common/card-metric";
import {
  Target,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  Clock,
  ShoppingBag,
  MapPin,
} from "lucide-react";

export default function Home() {
  const { marketingData } = useMarketingData();

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-700 text-white py-6">
        <div className="px-6 lg:px-8  text-center">
          {marketingData ? (
            <>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                {marketingData.company_info.name}
              </h1>
              <p className="text-lg md:text-xl mb-4 opacity-90">
                {marketingData.company_info.industry} • Founded{" "}
                {marketingData.company_info.founded}
              </p>
              <p className="text-base max-w-3xl mx-auto leading-relaxed opacity-80">
                {marketingData.company_info.description}
              </p>
            </>
          ) : null}
        </div>
      </section>

      {/* Dashboard Content */}
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
        {marketingData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Key Metrics Cards */}
            <CardMetric
              title="Total Campaigns"
              value={marketingData.marketing_stats.total_campaigns}
              icon={<Target className="h-5 w-5" />}
            />

            <CardMetric
              title="Total Revenue"
              value={`$${marketingData.marketing_stats.total_revenue.toLocaleString()}`}
              icon={<DollarSign className="h-5 w-5" />}
              className="text-green-400"
            />

            <CardMetric
              title="Average ROAS"
              value={`${marketingData.marketing_stats.average_roas}x`}
              icon={<TrendingUp className="h-5 w-5" />}
              className="text-blue-400"
            />

            <CardMetric
              title="Total Conversions"
              value={marketingData.marketing_stats.total_conversions}
              icon={<Users className="h-5 w-5" />}
              className="text-purple-400"
            />
          </div>
        )}

        {/* Performance Highlights */}
        {marketingData && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Performance Highlights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <CardMetric
                title="Top Performing Medium"
                value={marketingData.marketing_stats.top_performing_medium}
                icon={<Target className="h-5 w-5" />}
              />

              <CardMetric
                title="Top Performing Region"
                value={marketingData.marketing_stats.top_performing_region}
                icon={<MapPin className="h-5 w-5" />}
              />
            </div>
          </div>
        )}

        {/* Market Insights */}
        {marketingData && marketingData.market_insights && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Market Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <CardMetric
                title="Peak Performance Day"
                value={marketingData.market_insights.peak_performance_day}
                icon={<Calendar className="h-5 w-5" />}
              />

              <CardMetric
                title="Peak Performance Time"
                value={marketingData.market_insights.peak_performance_time}
                icon={<Clock className="h-5 w-5" />}
              />

              <CardMetric
                title="Top Converting Product"
                value={marketingData.market_insights.top_converting_product}
                icon={<ShoppingBag className="h-5 w-5" />}
              />

              <CardMetric
                title="Fastest Growing Region"
                value={marketingData.market_insights.fastest_growing_region}
                icon={<MapPin className="h-5 w-5" />}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
