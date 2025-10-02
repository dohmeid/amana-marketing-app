"use client";
import { useMarketingData } from "@/src/context/marketing-dataprovider";

//wrapping component
export function AppContent({ children }: { children: React.ReactNode }) {
    const { loading, error } = useMarketingData();

    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded max-w-2xl w-full text-center">
                    <h2 className="font-bold mb-2">Failed to Load Dashboard Data</h2>
                    <p className="text-sm">An error occurred while fetching the necessary data. Please try again later.</p>
                    <p className="text-xs mt-4 text-red-300 bg-red-950/50 p-2 rounded">
                        <code>Error: {error}</code>
                    </p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-white text-lg flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading Dashboard...
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
