import React, { useState } from 'react';
import { useIntelligence } from '../context/IntelligenceContext';
import { EvidenceCard } from '../components/EvidenceCard';
import { EvidenceDrawer } from '../components/EvidenceDrawer';
import { ALL_THEMES, ALL_SOURCES, ALL_CATEGORIES } from '../lib/dataEngine';
import {
  FrictionTheme,
  SourceType,
  PurchaseIntent,
  ConfidenceLevel,
  ProductCategory,
  AnalyzedConversation
} from '../types';
import {
  Search,
  Filter,
  RefreshCcw,
  Quote,
  Layers,
  Sparkles,
  TrendingUp,
  FileText,
  SlidersHorizontal,
  ChevronDown,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Info
} from 'lucide-react';

interface EvidenceExplorerPageProps {
  onNavigateToOpportunities?: () => void;
}

export const EvidenceExplorerPage: React.FC<EvidenceExplorerPageProps> = ({
  onNavigateToOpportunities
}) => {
  const {
    filteredConversations,
    stats,
    themeSummaries,
    filters,
    setFilters,
    resetFilters
  } = useIntelligence();

  const [activeTabTheme, setActiveTabTheme] = useState<FrictionTheme | 'ALL'>(
    filters.selectedTheme
  );
  const [selectedDrawerItem, setSelectedDrawerItem] = useState<AnalyzedConversation | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleThemeChipClick = (theme: FrictionTheme | 'ALL') => {
    setActiveTabTheme(theme);
    setFilters(prev => ({ ...prev, selectedTheme: theme }));
  };

  const handleOpenDrawer = (item: AnalyzedConversation) => {
    setSelectedDrawerItem(item);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedDrawerItem(null);
  };

  const selectedThemeSummary =
    activeTabTheme !== 'ALL' ? themeSummaries[activeTabTheme] : null;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-900">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-medium text-zinc-100 tracking-tight">
              Evidence Explorer
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-900 text-zinc-400 border border-zinc-800">
              Verbatim Intelligence & Audit
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Every product insight in AI Detective is 100% traceable to underlying public consumer discussions. Click any card to inspect full audit details.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-zinc-500">
            Showing <strong className="text-zinc-300">{filteredConversations.length}</strong> of{' '}
            {stats.purchaseRelevant} signals
          </span>
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
          >
            <RefreshCcw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Friction Theme Filter Tabs */}
      <div className="space-y-2">
        <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider block">
          Select Purchase Friction Theme:
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleThemeChipClick('ALL')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
              filters.selectedTheme === 'ALL'
                ? 'bg-zinc-100 text-zinc-900'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            All Themes ({stats.purchaseRelevant})
          </button>

          {ALL_THEMES.map(theme => {
            const count = stats.themeCounts[theme] || 0;
            const pct = stats.themePercentages[theme] || 0;
            const isSelected = filters.selectedTheme === theme;
            return (
              <button
                key={theme}
                onClick={() => handleThemeChipClick(theme)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-100 text-zinc-900'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                <span>{theme}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isSelected
                      ? 'bg-zinc-200 text-zinc-900'
                      : 'bg-zinc-800 text-zinc-500'
                  }`}
                >
                  {pct.toFixed(0)}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Theme Spotlight Card (When a specific theme is selected) */}
      {selectedThemeSummary && (
        <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-900 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-900">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider block">
                  THEME EVIDENCE REPORT
                </span>
                <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 text-[10px] font-mono border border-zinc-800">
                  Audit Verified
                </span>
              </div>
              <h3 className="text-xl font-medium text-zinc-100 tracking-tight mt-0.5">
                {selectedThemeSummary.theme}
              </h3>
            </div>

            {/* Metrics */}
            <div className="flex items-center gap-3 text-xs font-mono">
              <div className="px-3.5 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-center">
                <span className="text-zinc-500 text-[10px] uppercase block">Total Conversations</span>
                <strong className="text-zinc-100 text-sm">
                  {selectedThemeSummary.count}
                </strong>
              </div>
              <div className="px-3.5 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-center">
                <span className="text-zinc-500 text-[10px] uppercase block">Share of Hesitation</span>
                <strong className="text-zinc-100 text-sm">
                  {selectedThemeSummary.percentage.toFixed(1)}%
                </strong>
              </div>
              <div className="px-3.5 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-center">
                <span className="text-zinc-500 text-[10px] uppercase block">Avg Confidence</span>
                <strong className="text-zinc-100 text-sm">High</strong>
              </div>
            </div>
          </div>

          {/* Source Distribution Breakdown */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-zinc-400 block">
              Breakdown Across Public Discussion Channels:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {Object.entries(selectedThemeSummary.sourceBreakdown).map(([src, count]) => {
                const numCount = Number(count) || 0;
                const pct = ((numCount / (selectedThemeSummary.count || 1)) * 100).toFixed(0);
                return (
                  <div
                    key={src}
                    className="p-2.5 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-between"
                  >
                    <span className="text-zinc-400">{src}:</span>
                    <span className="font-mono text-zinc-200">
                      <strong>{numCount}</strong> ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* "Why This Matters" Panel - Strict Separation of Observed Evidence & AI Interpretation */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-zinc-500" />
                "Why This Matters" Diagnostic Breakdown
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">Strict Separation of Fact vs Model Interpretation</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-md bg-zinc-900 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider block">
                  Observed Evidence (Factual Data Pattern)
                </span>
                <p className="text-zinc-300 leading-relaxed">
                  {typeof selectedThemeSummary.whyThisMatters === 'object'
                    ? selectedThemeSummary.whyThisMatters?.observedEvidence
                    : `${selectedThemeSummary.percentage.toFixed(1)}% of consumers in the dataset explicitly express hesitation around ${selectedThemeSummary.theme.toLowerCase()} before finalizing checkout.`}
                </p>
              </div>

              <div className="p-3 rounded-md bg-zinc-900 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider block">
                  AI Interpretation (Behavioral Inference)
                </span>
                <p className="text-zinc-300 leading-relaxed">
                  {typeof selectedThemeSummary.whyThisMatters === 'object'
                    ? selectedThemeSummary.whyThisMatters?.aiInterpretation
                    : selectedThemeSummary.aiInterpretation ||
                      'Shoppers require actionable reassurance to bridge the cognitive gap between interest and transaction.'}
                </p>
              </div>
            </div>

            {/* Direct Link to Opportunity Lab */}
            {onNavigateToOpportunities && (
              <div className="pt-2 flex items-center justify-between border-t border-zinc-900">
                <span className="text-[11px] text-zinc-500">
                  Ready to review the corresponding A/B product experiment?
                </span>
                <button
                  onClick={onNavigateToOpportunities}
                  className="text-xs font-medium text-zinc-100 hover:text-white flex items-center gap-1.5 cursor-pointer bg-zinc-900 px-3 py-1.5 rounded-md border border-zinc-800 hover:bg-zinc-800 transition-colors"
                >
                  <span>View A/B Experiment in Opportunity Lab</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Multi-Filter Bar */}
      <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-3">
        <div className="flex items-center justify-between text-xs font-medium text-zinc-400 uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Refine Evidence Signals</span>
          </div>
          <span className="text-zinc-500 font-normal">Instant Search & Channel Faceting</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Keyword Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search verbatim quotes (e.g. 'sale', 'tight', 'polyester', 'group chat')..."
              value={filters.searchQuery}
              onChange={e =>
                setFilters(prev => ({ ...prev, searchQuery: e.target.value }))
              }
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-pink-500/60 transition-colors"
            />
          </div>

          {/* Source Filter */}
          <div>
            <select
              value={filters.selectedSource}
              onChange={e =>
                setFilters(prev => ({
                  ...prev,
                  selectedSource: e.target.value as SourceType | 'ALL'
                }))
              }
              className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-pink-500/60 cursor-pointer"
            >
              <option value="ALL">All Sources (4 Channels)</option>
              {ALL_SOURCES.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Purchase Intent Filter */}
          <div>
            <select
              value={filters.selectedIntent}
              onChange={e =>
                setFilters(prev => ({
                  ...prev,
                  selectedIntent: e.target.value as PurchaseIntent | 'ALL'
                }))
              }
              className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-pink-500/60 cursor-pointer"
            >
              <option value="ALL">All Intent Levels</option>
              <option value="High">High Purchase Intent</option>
              <option value="Medium">Medium Intent</option>
              <option value="Low">Low / Browsing</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filters.selectedCategory}
              onChange={e =>
                setFilters(prev => ({
                  ...prev,
                  selectedCategory: e.target.value as ProductCategory | 'ALL'
                }))
              }
              className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-pink-500/60 cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              {ALL_CATEGORIES.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Verbatim Evidence Cards Grid */}
      {filteredConversations.length === 0 ? (
        <div className="p-12 rounded-xl bg-zinc-900/40 border border-zinc-800 text-center space-y-3">
          <Quote className="w-8 h-8 text-zinc-600 mx-auto" />
          <h4 className="text-base font-semibold text-zinc-300">
            No matching conversations found
          </h4>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            Try loosening your filters or search keywords to view other consumer purchase friction signals.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredConversations.slice(0, 50).map(item => (
            <EvidenceCard
              key={item.id}
              item={item}
              onExploreTheme={theme =>
                handleThemeChipClick(theme as FrictionTheme)
              }
              onOpenDrawer={handleOpenDrawer}
            />
          ))}
        </div>
      )}

      {filteredConversations.length > 50 && (
        <p className="text-center text-xs text-zinc-500 py-4 font-mono">
          Showing first 50 of {filteredConversations.length} records. Use the search bar or filters to isolate specific signals.
        </p>
      )}

      {/* Slide-over Evidence Drawer */}
      <EvidenceDrawer
        item={selectedDrawerItem}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onFilterTheme={theme => {
          handleThemeChipClick(theme);
        }}
        onNavigateToOpportunities={() => {
          onNavigateToOpportunities?.();
        }}
      />
    </div>
  );
};

