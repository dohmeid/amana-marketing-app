import { memo } from 'react';

interface CardMetricProps {
  title: string;
  value: string | number;
  className?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const CardMetric = memo(function CardMetric({ 
  title, 
  value, 
  className = "", 
  icon,
  trend 
}: CardMetricProps) {
  const formattedValue = typeof value === 'number' ? value.toLocaleString() : value;
  
  return (
    <div className={`bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
          {title}
        </h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      
      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold text-white">{formattedValue}</div>
        
        {trend && (
          <div className={`flex items-center text-sm font-medium ${
            trend.isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            <span className="mr-1">
              {trend.isPositive ? '↗' : '↘'}
            </span>
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
    </div>
  );
});