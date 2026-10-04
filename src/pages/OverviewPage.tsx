import React, { useMemo } from 'react';
import { useIntelligence } from '../context/IntelligenceContext';
import { MetricCard } from '../components/MetricCard';
import { FrictionChart } from '../components/FrictionChart';
import { EvidenceCard } from '../components/EvidenceCard';
import { OpportunityCard } from '../components/OpportunityCard';
import {
  MessageSquare,
  CheckCircle2,
  Share2,
  Calendar,
  Play,
  ArrowRight,
  Sparkles,
  TrendingUp,
  HelpCircle,
  Layers,
  Search,
  Quote,
  ShieldCheck,
  Tag,
  Lightbulb,
  ExternalLink,
  Target,
  AlertTriangle,
  Info
} from 'lucide-react';
import { FrictionTheme } from '../types';

interface OverviewPageProps {
  onNavigateTab: (
    tab: 'overview' | 'evidence' | 'detective' | 'opportunities' | 'dataset'
  ) => void;
  onFilterTheme: (theme: FrictionTheme) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  onNavigateTab,
  onFilterTheme
}) => {
  const {
    stats,
    themeSummaries,
    filteredConversations,
    opportunities,
    detectiveFinding,
    runInvestigation,
    isInvestigating
  } = useIntelligence();

  const handleSelectTheme = (theme: FrictionTheme) => {
    onFilterTheme(theme);
    onNavigateTab('evidence');
  };

  const top3Themes = useMemo(() => {
    return (Object.entries(stats.themeCounts) as [FrictionTheme, number][])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([theme]) => theme);
  }, [stats.themeCounts]);

  const top3Share = useMemo(() => {
    return top3Themes.reduce((sum, theme) => sum + (stats.themePercentages[theme] || 0), 0);
  }, [top3Themes, stats.themePercentages]);

  return (
    <div className="space-y-12 animate-fade-in pb-12">
      {/* =========================================================================
          SECTION 1: WHY SHOPPERS HESITATE (Summary Stats & Core Product Question)
         ========================================================================= */}
      <div className="space-y-6">
        <div className="relative rounded-xl bg-zinc-950 border border-zinc-900 p-6 sm:p-8 overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 mb-4 text-[11px] uppercase tracking-wider font-medium text-zinc-500">
                <span>AI Detective Growth Diagnostic</span>
                <span className="w-1 h-1 rounded-full bg-zinc-700" />
                <span>Wishlist-to-Cart Funnel</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-zinc-100 leading-tight">
                Why do interested shoppers hesitate before checkout?
              </h1>

              {/* Core Product Question Callout */}
              <div className="mt-6 border-l-2 border-zinc-800 pl-4 text-zinc-400 text-sm max-w-2xl">
                <p className="leading-relaxed">
                  “A user liked the product enough to wishlist it. What happened between{' '}
                  <span className="text-zinc-200">‘I want this’</span> and{' '}
                  <span className="text-zinc-200">‘I’ll buy this’</span>?”
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-3 shrink-0">
              <button
                id="overview-run-investigation-btn"
                onClick={() => {
                  onNavigateTab('detective');
                  runInvestigation();
                }}
                disabled={isInvestigating}
                className="flex items-center justify-center gap-2.5 px-6 py-3 rounded-md font-medium text-sm bg-zinc-100 hover:bg-zinc-200 text-black transition-colors cursor-pointer disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>RUN INVESTIGATION</span>
              </button>

              <button
                onClick={() => onNavigateTab('evidence')}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-md font-medium text-sm bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4 text-zinc-400" />
                <span>Explore Evidence Signals</span>
              </button>
            </div>
          </div>
        </div>


        {/* Intelligence Key Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            id="metric-total-conversations"
            title="Conversations Analysed"
            value={stats.totalConversations.toLocaleString()}
            subtitle="Anonymized public consumer records"
            trend="+100% Ingress"
            icon={MessageSquare}
            accentColor="pink"
            onClick={() => onNavigateTab('dataset')}
          />

          <MetricCard
            id="metric-purchase-relevant"
            title="Purchase-Relevant Signals"
            value={`${stats.purchaseRelevant.toLocaleString()}`}
            subtitle={`${stats.purchaseRelevantPercent}% high/medium shopping intent`}
            trend={`${stats.purchaseRelevantPercent}% Intent`}
            icon={CheckCircle2}
            accentColor="emerald"
            onClick={() => onNavigateTab('evidence')}
          />

          <MetricCard
            id="metric-sources"
            title="Public Sources"
            value="4 Channels"
            subtitle="Reddit, YouTube, Play Store, App Store"
            icon={Share2}
            accentColor="blue"
            onClick={() => onNavigateTab('dataset')}
          />

          <MetricCard
            id="metric-analysis-period"
            title="Analysis Period"
            value="May – Aug 2026"
            subtitle={`${stats.dateRange.start} to ${stats.dateRange.end}`}
            icon={Calendar}
            accentColor="purple"
          />
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: THE TOP 3 FRICTIONS & INTERACTIVE DISTRIBUTION CHART
         ========================================================================= */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-zinc-900">
          <div>
            <h2 className="text-xl font-medium text-zinc-100 tracking-tight">
              Top 3 Purchase Frictions
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Ranked purchase-blocker themes accounting for {top3Share.toFixed(1)}% of all wishlist dropoffs.
            </p>
          </div>
          <span className="text-[10px] text-zinc-600 uppercase tracking-wider font-medium">
            Strict separation of Observed Evidence vs AI Interpretation
          </span>
        </div>

        {/* 3 Ranked Insight Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {top3Themes.map((themeName, idx) => {
            const summary = themeSummaries[themeName];
            if (!summary) return null;

            return (
              <div
                key={themeName}
                className="p-5 rounded-xl bg-zinc-950 border border-zinc-900 hover:border-zinc-700 transition-colors flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top Bar: Rank + Share */}
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-zinc-900">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500 font-mono text-sm">
                        0{idx + 1}
                      </span>
                      <h3 className="text-base font-medium text-zinc-100">
                        {themeName}
                      </h3>
                    </div>
                    <span className="text-zinc-500 text-xs">
                      {summary.percentage.toFixed(1)}%
                    </span>
                  </div>

                  {/* Representative Verbatim Quote */}
                  <div className="mt-4 p-3 rounded-md bg-zinc-900 border border-zinc-800">
                    <p className="text-xs text-zinc-300 italic leading-relaxed">
                      "{summary.topQuotes?.[0] || summary.sampleQuotes?.[0]?.quote || 'User saved item waiting for next steps.'}"
                    </p>
                  </div>

                  {/* "Why This Matters" Insight Box (Strictly Separated) */}
                  <div className="mt-4 space-y-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider block">
                        Observed Evidence
                      </span>
                      <p className="text-zinc-400 leading-relaxed">
                        {typeof summary.whyThisMatters === 'object'
                          ? summary.whyThisMatters?.observedEvidence
                          : `${summary.percentage.toFixed(1)}% of analyzed users explicitly pause checkout for ${themeName.toLowerCase()}.`}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider block">
                        AI Interpretation
                      </span>
                      <p className="text-zinc-400 leading-relaxed">
                        {typeof summary.whyThisMatters === 'object'
                          ? summary.whyThisMatters?.aiInterpretation
                          : summary.aiInterpretation ||
                            'Shoppers experience decision friction that requires proactive product reassurance.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <button
                  onClick={() => handleSelectTheme(themeName)}
                  className="w-full py-2.5 px-3 rounded-md text-xs font-medium text-zinc-400 hover:text-zinc-100 bg-zinc-900 hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1.5 mt-2"
                >
                  <span>Explore Signals</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Interactive Friction Distribution Chart */}
        <FrictionChart onSelectTheme={handleSelectTheme} />
      </div>

      {/* =========================================================================
          SECTION 3: VERBATIM EVIDENCE PREVIEW (High-Intent Snippets)
         ========================================================================= */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-zinc-900">
          <div>
            <h2 className="text-xl font-medium text-zinc-100 tracking-tight">
              Consumer Evidence Signals — Demo Dataset
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              High-intent comments and reviews categorized by friction theme with full AI reasoning audits. <br/>
              <span className="text-zinc-600 font-mono mt-1 block text-[10px]">Demo records are illustrative and do not represent actual Myntra customer data.</span>
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('evidence')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium text-zinc-300 bg-zinc-900 hover:bg-zinc-800 transition-colors cursor-pointer border border-zinc-800"
          >
            <span>View All {filteredConversations.length} Evidence Records</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Sample Evidence Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredConversations.slice(0, 4).map(item => (
            <EvidenceCard
              key={item.id}
              item={item}
              onExploreTheme={handleSelectTheme}
              onOpenDrawer={() => onNavigateTab('evidence')}
            />
          ))}
        </div>
      </div>

      {/* =========================================================================
          SECTION 4: TOP PRODUCT OPPORTUNITIES & A/B EXPERIMENTS
         ========================================================================= */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-zinc-900">
          <div>
            <h2 className="text-xl font-medium text-zinc-100 tracking-tight">
              Prioritized Growth Opportunities
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Evidence-based hypotheses converted into actionable A/B experiments with ICE prioritization scores.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('opportunities')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium text-black bg-zinc-100 hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            <span>Open Opportunity Lab ({opportunities.length} Experiments)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Top 2 Opportunities preview */}
        <div className="space-y-4">
          {opportunities.slice(0, 2).map(opp => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onExploreTheme={handleSelectTheme}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

