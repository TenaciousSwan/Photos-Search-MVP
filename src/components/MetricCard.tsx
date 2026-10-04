import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  id?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  icon: LucideIcon;
  accentColor?: 'pink' | 'blue' | 'amber' | 'emerald' | 'purple';
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  accentColor = 'pink',
  onClick
}) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`group relative p-5 rounded-lg bg-zinc-950 border border-zinc-900 transition-colors ${
        onClick ? 'cursor-pointer hover:border-zinc-700' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-zinc-500 tracking-wide mb-2">
            {title}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold text-zinc-100">
              {value}
            </span>
            {trend && (
              <span className="text-[10px] font-medium text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded">
                {trend}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-[11px] text-zinc-500 mt-1.5">
              {subtitle}
            </p>
          )}
        </div>
        <div className="p-2 rounded-md border border-zinc-800 text-zinc-400 bg-zinc-900">
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
