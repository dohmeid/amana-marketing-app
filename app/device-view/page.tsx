"use client";
import { useState, useEffect, useMemo } from 'react';
import { MarketingData } from '@/src/types/marketing';
import { fetchMarketingData } from '@/src/lib/api';
import { CardMetric } from '@/src/components/card-metric';
import { BarChart } from '@/src/components/bar-chart';
import { DollarSign, Smartphone, Monitor } from 'lucide-react';

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


    const devicePerformance = useMemo(() => {
        if (!marketingData?.campaigns) return null;

        const performance = {
            Desktop: { spend: 0, revenue: 0, conversions: 0 },
            Mobile: { spend: 0, revenue: 0, conversions: 0 },
        };

        marketingData.campaigns.forEach(campaign => {
            campaign.device_performance.forEach(devicePerf => {
                if (devicePerf.device === 'Desktop' || devicePerf.device === 'Mobile') {
                    performance[devicePerf.device].spend += devicePerf.spend;
                    performance[devicePerf.device].revenue += devicePerf.revenue;
                    performance[devicePerf.device].conversions += devicePerf.conversions;
                }
            });
        });

        return {
            desktop: performance.Desktop,
            mobile: performance.Mobile,
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
                            Device Performance
                        </h1>
                    </div>
                </div>
            </section>

            {/* Content Area */}
            <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
                {devicePerformance && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">Desktop vs. Mobile Performance</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <CardMetric
                                title="Desktop Revenue"
                                value={`$${devicePerformance.desktop.revenue.toLocaleString()}`}
                                icon={<Monitor className="h-5 w-5" />}
                                className="text-blue-400"
                            />
                            <CardMetric
                                title="Desktop Spend"
                                value={`$${devicePerformance.desktop.spend.toLocaleString()}`}
                                icon={<DollarSign className="h-5 w-5" />}
                            />
                            <CardMetric
                                title="Mobile Revenue"
                                value={`$${devicePerformance.mobile.revenue.toLocaleString()}`}
                                icon={<Smartphone className="h-5 w-5" />}
                                className="text-green-400"
                            />
                            <CardMetric
                                title="Mobile Spend"
                                value={`$${devicePerformance.mobile.spend.toLocaleString()}`}
                                icon={<DollarSign className="h-5 w-5" />}
                            />
                        </div>
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            <BarChart
                                title="Revenue by Device"
                                data={[
                                    { label: 'Desktop', value: devicePerformance.desktop.revenue, color: '#3B82F6' },
                                    { label: 'Mobile', value: devicePerformance.mobile.revenue, color: '#10B981' },
                                ]}
                                formatValue={(v) => `$${v.toLocaleString()}`}
                            />
                            <BarChart
                                title="Conversions by Device"
                                data={[
                                    { label: 'Desktop', value: devicePerformance.desktop.conversions, color: '#3B82F6' },
                                    { label: 'Mobile', value: devicePerformance.mobile.conversions, color: '#10B981' },
                                ]}
                            />
                        </div>
                    </div>
                )}

            </div>
        </ >
    );
}