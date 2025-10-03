"use client";
import React, { useMemo } from "react";

export interface LineChartDataPoint {
  x: number;
  y: number;
  label?: string;
}

export interface LineChartProps {
  title: string;
  data: LineChartDataPoint[];
  className?: string;
  height?: number;
  color?: string;
  formatY?: (value: number) => string;
  yAxisLabel?: string;
}

export function LineChart({
  title,
  data,
  className = "",
  height = 300,
  color = "#3B82F6", // blue-500
  formatY = (value) => value.toLocaleString(),
  yAxisLabel = "Value",
}: LineChartProps) {
  const { points, path, maxY, minY } = useMemo(() => {
    if (!data || data.length < 2) {
      return { points: [], path: "", maxX: 0, maxY: 0, minX: 0, minY: 0 };
    }

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartWidth = 500; // SVG viewbox width
    const chartHeight = height;

    const innerWidth = chartWidth - margin.left - margin.right;
    const innerHeight = chartHeight - margin.top - margin.bottom;

    const minX = Math.min(...data.map((d) => d.x));
    const maxX = Math.max(...data.map((d) => d.x));
    const minY = 0; // Assuming y-axis starts at 0
    const maxY = Math.max(...data.map((d) => d.y));

    const xScale = (x: number) =>
      margin.left + ((x - minX) / (maxX - minX)) * innerWidth;
    const yScale = (y: number) =>
      chartHeight - margin.bottom - (y / maxY) * innerHeight;

    const points = data.map((d) => ({
      x: xScale(d.x),
      y: yScale(d.y),
      original: d,
    }));

    const path = points
      .map((p, i) => (i === 0 ? "M" : "L") + `${p.x},${p.y}`)
      .join(" ");

    return { points, path, maxX, maxY, minX, minY };
  }, [data, height]);

  const yAxisTicks = useMemo(() => {
    const ticks = [];
    const tickCount = 5;
    for (let i = 0; i <= tickCount; i++) {
      const value = minY + (maxY - minY) * (i / tickCount);
      ticks.push(value);
    }
    return ticks;
  }, [minY, maxY]);

  if (!data || data.length < 2) {
    return (
      <div
        className={`bg-gray-800 rounded-lg p-6 border border-gray-700 ${className}`}
      >
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        <div className="flex items-center justify-center h-48 text-gray-400">
          Not enough data to draw a line chart.
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-gray-800 rounded-lg p-6 border border-gray-700 ${className}`}
    >
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="relative">
        <svg
          viewBox={`0 0 500 ${height}`}
          width="100%"
          height={height}
          aria-labelledby="title"
          role="img"
        >
          <title id="title">{title}</title>

          {/* Y-axis with labels */}
          <g className="text-xs text-gray-400">
            {yAxisTicks.map((tick, i) => (
              <g
                key={i}
                transform={`translate(0, ${height - 40 - (i / 5) * (height - 60)})`}
              >
                <line
                  x1="45"
                  x2="500"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1"
                  strokeDasharray="2,3"
                />
                <text x="40" y="4" textAnchor="end" fill="currentColor">
                  {formatY(tick)}
                </text>
              </g>
            ))}
            <text
              transform={`translate(-15, ${height / 2}) rotate(-90)`}
              textAnchor="middle"
              fill="currentColor"
              className="font-medium"
            >
              {yAxisLabel}
            </text>
          </g>

          {/* X-axis with labels */}
          <g className="text-xs text-gray-400">
            {points.map((p, i) => (
              <text
                key={i}
                x={p.x}
                y={height - 20}
                textAnchor="middle"
                fill="currentColor"
              >
                {p.original.label || p.original.x}
              </text>
            ))}
          </g>

          {/* Line */}
          <path d={path} fill="none" stroke={color} strokeWidth="2" />

          {/* Points and Tooltips */}
          {points.map((p, i) => (
            <g key={i} className="group">
              <circle
                cx={p.x}
                cy={p.y}
                r="4"
                fill={color}
                className="cursor-pointer"
              />
              <circle
                cx={p.x}
                cy={p.y}
                r="8"
                fill={color}
                fillOpacity="0.2"
                className="transition-opacity opacity-0 group-hover:opacity-100"
              />
              <g
                transform={`translate(${p.x}, ${p.y - 15})`}
                className="pointer-events-none transition-opacity opacity-0 group-hover:opacity-100"
              >
                <rect
                  x="-40"
                  y="-22"
                  width="80"
                  height="24"
                  rx="4"
                  fill="rgba(0,0,0,0.7)"
                />
                <text
                  x="0"
                  y="-4"
                  textAnchor="middle"
                  fill="white"
                  className="text-xs font-semibold"
                >
                  {formatY(p.original.y)}
                </text>
              </g>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
