import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { useIntelligence } from '../context/IntelligenceContext';
import { FrictionTheme } from '../types';

const THEME_COLORS: Record<FrictionTheme, string> = {
  'Price Hesitation': '#f43f5e', // rose-500
  'Fit & Sizing': '#3b82f6', // blue-500
  'Social Validation': '#a855f7', // purple-500
  'Quality & Trust': '#10b981', // emerald-500
  'Comparison & Choice Overload': '#f59e0b', // amber-500
  'Timing & Need': '#06b6d4', // cyan-500
  'Delivery / Returns / Convenience': '#ec4899' // pink-500
};

interface FrictionChartProps {
  onSelectTheme?: (theme: FrictionTheme) => void;
  selectedTheme?: FrictionTheme | 'ALL';
}

export const FrictionChart: React.FC<FrictionChartProps> = ({ onSelectTheme, selectedTheme }) => {
  const { stats, themeSummaries } = useIntelligence();

  // Format data for Recharts Bar
  const chartData = Object.entries(stats.themePercentages)
    .map(([theme, percentage]) => ({
      theme: theme as FrictionTheme,
      name: theme,
      shortName: theme.length > 16 ? theme.slice(0, 14) + '…' : theme,
      percentage,
      count: stats.themeCounts[theme as FrictionTheme] || 0,
      color: THEME_COLORS[theme as FrictionTheme] || '#94a3b8'
    }))
    .sort((a, b) => b.percentage - a.percentage);

  const totalRelevant = stats.purchaseRelevant || 1;
  const topTheme = chartData[0];

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight font-serif">
              Purchase Friction Distribution
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20">
              Dynamic Dataset Analysis
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Calculated across {totalRelevant.toLocaleString()} verified high/medium purchase-intent conversations
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="inline-block w-2 h-2 rounded-full bg-rose-500"></span>
          <span>Click any bar to filter evidence</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Horizontal Bars for Precision */}
        <div className="lg:col-span-2 space-y-3">
          {chartData.map(item => {
            const isSelected = selectedTheme === item.theme;
            return (
              <div
                key={item.theme}
                onClick={() => onSelectTheme && onSelectTheme(item.theme)}
                className={`group p-2.5 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-800/90 border-pink-500/60 ring-1 ring-pink-500/30'
                    : 'bg-zinc-900/50 border-zinc-800/80 hover:bg-zinc-800/60 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-semibold text-zinc-200 group-hover:text-white transition-colors">
                      {item.theme}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 font-mono text-[11px]">
                    <span className="text-zinc-400">{item.count} mentions</span>
                    <span className="font-bold text-white px-1.5 py-0.2 rounded bg-zinc-800 border border-zinc-700">
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/80">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Donut Chart Summary */}
        <div className="h-64 flex flex-col items-center justify-center relative p-3 bg-zinc-950/40 rounded-xl border border-zinc-800/60">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={3}
                dataKey="count"
              >
                {chartData.map(entry => (
                  <Cell
                    key={`cell-${entry.theme}`}
                    fill={entry.color}
                    opacity={selectedTheme === 'ALL' || selectedTheme === entry.theme ? 1 : 0.4}
                    stroke="#18181b"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-zinc-900 border border-zinc-700 p-2.5 rounded-lg shadow-xl text-xs">
                        <p className="font-bold text-white">{data.name}</p>
                        <p className="text-zinc-400">
                          {data.count} signals ({data.percentage}%)
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs text-zinc-500 font-medium">Top Vector</span>
            <span className="text-lg font-bold text-rose-400 font-serif">
              {topTheme ? topTheme.shortName.replace('…', '') : '—'}
            </span>
            <span className="text-[11px] text-zinc-400 font-mono">
              {topTheme ? `${topTheme.percentage.toFixed(1)}%` : '0%'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
