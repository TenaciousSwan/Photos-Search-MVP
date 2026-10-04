import React, { useState } from 'react';
import { useIntelligence } from '../context/IntelligenceContext';
import { exportDatasetToCSV, ALL_SOURCES, ALL_CATEGORIES } from '../lib/dataEngine';
import {
  Database,
  Upload,
  Download,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
  ArrowRight
} from 'lucide-react';

interface DatasetManagerPageProps {
  onOpenUpload: () => void;
  onNavigateToOverview: () => void;
}

export const DatasetManagerPage: React.FC<DatasetManagerPageProps> = ({
  onOpenUpload,
  onNavigateToOverview
}) => {
  const {
    rawDataset,
    analyzedDataset,
    stats,
    isCustomDataset,
    datasetName,
    resetToDemoDataset
  } = useIntelligence();

  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');

  const filteredRaw = analyzedDataset.filter(item => {
    if (sourceFilter !== 'ALL' && item.source !== sourceFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.text.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.productCategory.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportCSV = () => {
    const csvContent = exportDatasetToCSV(analyzedDataset);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ai_detective_dataset_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white font-serif tracking-tight">
              Dataset Management & Architecture
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Data Ingress Layer
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Manage conversation corpora, upload custom CSV feedback datasets, or export processed records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-pink-600 hover:bg-pink-500 text-white shadow-md shadow-pink-900/30 transition-all cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload New CSV</span>
          </button>
        </div>
      </div>

      {/* Dataset Status Banner */}
      <div className="p-6 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isCustomDataset ? 'bg-blue-400' : 'bg-emerald-400'
              }`}
            />
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Active Corpus:
            </span>
            <strong className="text-sm text-white font-sans">{datasetName}</strong>
          </div>
          <p className="text-xs text-zinc-400">
            {isCustomDataset
              ? 'Custom uploaded consumer dataset currently being processed.'
              : 'DEMO DATA — 1,248 realistic, anonymized conversations spanning Reddit, YouTube, Google Play, and Apple App Store.'}
          </p>
        </div>

        {isCustomDataset && (
          <button
            onClick={resetToDemoDataset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors cursor-pointer self-start md:self-center"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset to Standard Demo Corpus</span>
          </button>
        )}
      </div>

      {/* Channel Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ALL_SOURCES.map(source => {
          const count = stats.sourceCounts[source] || 0;
          const pct = Math.round((count / (stats.totalConversations || 1)) * 100);

          return (
            <div
              key={source}
              className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-850 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                  {source}
                </span>
                <span className="text-xl font-bold text-white font-serif">{count}</span>
              </div>
              <span className="text-[11px] text-zinc-400 font-mono mt-2 block">
                {pct}% of dataset
              </span>
            </div>
          );
        })}
      </div>

      {/* Raw Data Inspector Table */}
      <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 overflow-hidden shadow-lg">
        {/* Table Controls */}
        <div className="p-4 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Ingested Records Inspector
            </h3>
            <span className="text-xs font-mono text-zinc-500">
              ({filteredRaw.length} matches)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter by ID, brand, text..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-pink-500/60"
              />
            </div>

            <select
              value={sourceFilter}
              onChange={e => setSourceFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Sources</option>
              {ALL_SOURCES.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Scrollable Table */}
        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-zinc-950 text-zinc-400 font-mono text-[10px] uppercase tracking-wider border-b border-zinc-800 z-10">
              <tr>
                <th className="py-2.5 px-3">ID</th>
                <th className="py-2.5 px-3">Source</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Classification</th>
                <th className="py-2.5 px-3">Verbatim Text</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {filteredRaw.slice(0, 40).map(row => (
                <tr key={row.id} className="hover:bg-zinc-850/50 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-zinc-400 whitespace-nowrap">
                    {row.id}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-zinc-800 border border-zinc-700 text-zinc-300">
                      {row.source}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-zinc-500 whitespace-nowrap">
                    {row.date}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-zinc-400">
                    {row.productCategory}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    {row.frictionTheme ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-pink-500/10 text-pink-400 border border-pink-500/20">
                        {row.frictionTheme}
                      </span>
                    ) : (
                      <span className="text-[10px] text-zinc-500 font-mono">Irrelevant</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 max-w-md truncate text-zinc-300">
                    {row.text}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
