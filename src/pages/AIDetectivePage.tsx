import React from 'react';
import { useIntelligence } from '../context/IntelligenceContext';
import {
  Sparkles,
  Play,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingDown,
  ShieldAlert,
  Lightbulb,
  FileSearch,
  Quote,
  Flame,
  Layers,
  ChevronRight,
  RefreshCw,
  Search,
  AlertTriangle,
  Info,
  ShieldCheck,
  Target
} from 'lucide-react';
import { FrictionTheme } from '../types';

interface AIDetectivePageProps {
  onNavigateToOpportunities: () => void;
  onNavigateToEvidence: (theme?: FrictionTheme) => void;
}

export const AIDetectivePage: React.FC<AIDetectivePageProps> = ({
  onNavigateToOpportunities,
  onNavigateToEvidence
}) => {
  const {
    stats,
    detectiveFinding,
    isInvestigating,
    investigationProgress,
    investigationSteps,
    hasInvestigated,
    runInvestigation
  } = useIntelligence();

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Ready / In-Flight Investigation Hero */}
      <div className="rounded-xl bg-zinc-950 border border-zinc-900 p-6 sm:p-8 overflow-hidden relative">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[11px] font-medium tracking-wider text-zinc-500 uppercase">
              <span>Cognitive Diagnostic Engine</span>
              <span className="w-1 h-1 rounded-full bg-zinc-700" />
              <span>{stats.totalConversations} Records</span>
            </div>

            <h2 className="text-3xl font-medium text-zinc-100 tracking-tight">
              {isInvestigating
                ? 'Investigating Purchase Friction Signals...'
                : hasInvestigated
                ? 'Investigation Complete'
                : 'Ready to Investigate'}
            </h2>

            <p className="text-sm text-zinc-400 max-w-2xl">
              {isInvestigating
                ? 'Clustering semantic purchase intent vectors and diagnosing wishlist dropoff patterns across 4 public feedback channels...'
                : `${stats.totalConversations.toLocaleString()} consumer conversations available for multi-stage purchase friction analysis.`}
            </p>
          </div>

          <div className="shrink-0">
            <button
              id="ai-detective-run-btn"
              onClick={runInvestigation}
              disabled={isInvestigating}
              className="flex items-center gap-2.5 px-6 py-3 rounded-md font-medium text-sm bg-zinc-100 hover:bg-zinc-200 text-black transition-colors cursor-pointer disabled:opacity-50"
            >
              {isInvestigating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Running ({investigationProgress}%)...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>
                    {hasInvestigated ? 'RERUN INVESTIGATION' : 'RUN INVESTIGATION'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {(isInvestigating || hasInvestigated) && (
          <div className="mt-8 pt-6 border-t border-zinc-900">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-zinc-500 font-medium">
                Investigation Pipeline
              </span>
              <span className="font-mono text-zinc-400">
                {investigationProgress}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-zinc-400 transition-all duration-300 rounded-full"
                style={{ width: `${investigationProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 8-Stage Investigation Workflow Progress Grid */}
      <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-900">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-zinc-400" />
            <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-300">
              Diagnostic Execution Steps
            </h3>
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">
            Deterministic Classification
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {investigationSteps.map(step => {
            const isDone = step.status === 'completed';
            const isActive = step.status === 'active';

            return (
              <div
                key={step.id}
                className={`p-3.5 rounded-md border transition-all ${
                  isActive
                    ? 'bg-zinc-900 border-zinc-700'
                    : isDone
                    ? 'bg-zinc-900/50 border-zinc-800'
                    : 'bg-zinc-950 border-zinc-900 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-zinc-500">
                    STEP 0{step.id}
                  </span>
                  {isDone ? (
                     <CheckCircle2 className="w-4 h-4 text-zinc-400" />
                  ) : isActive ? (
                    <RefreshCw className="w-4 h-4 text-zinc-300 animate-spin" />
                  ) : (
                    <Clock className="w-4 h-4 text-zinc-700" />
                  )}
                </div>

                <p
                  className={`text-xs font-medium ${
                    isActive
                      ? 'text-zinc-100'
                      : isDone
                      ? 'text-zinc-300'
                      : 'text-zinc-500'
                  }`}
                >
                  {step.label}
                </p>

                <span className="text-[10px] text-zinc-500 mt-1 block">
                  {step.metric}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* DETECTIVE FINDINGS & EVIDENCE SYNTHESIS (Displayed when investigation completes) */}
      {hasInvestigated && !isInvestigating && (
        <div className="space-y-8">
          {/* =====================================================================
              1. EXECUTIVE SUMMARY & VERDICT FORMAT
             ===================================================================== */}
          <div className="p-6 sm:p-8 rounded-xl bg-zinc-950 border border-zinc-900 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-900">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-medium text-zinc-500 tracking-wider uppercase block">
                    INVESTIGATION VERDICT
                  </span>
                  <h3 className="text-xl font-medium text-zinc-100 tracking-tight">
                    {detectiveFinding.keyVerdict}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigateToEvidence('Price Hesitation')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Trace to Evidence</span>
                </button>

                <button
                  onClick={onNavigateToOpportunities}
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium bg-zinc-100 hover:bg-zinc-200 text-black transition-colors cursor-pointer"
                >
                  <span>Opportunity Lab A/B Tests</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Formatted 4-Bullet Executive Verdict Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-md bg-zinc-900 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider block">
                  Primary Friction
                </span>
                <p className="text-sm font-medium text-zinc-100">
                  {detectiveFinding.executiveSummary?.primaryFriction ||
                    'Price Hesitation (31.4% of purchase-relevant signals)'}
                </p>
                <p className="text-xs text-zinc-400">
                  Users wait for sales or price drops before completing the transaction.
                </p>
              </div>

              <div className="p-4 rounded-md bg-zinc-900 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider block">
                  Secondary Friction
                </span>
                <p className="text-sm font-medium text-zinc-100">
                  {detectiveFinding.executiveSummary?.secondaryFriction ||
                    'Fit & Sizing (24.2% of purchase-relevant signals)'}
                </p>
                <p className="text-xs text-zinc-400">
                  Sizing chart ambiguity and return friction trigger purchase postponement.
                </p>
              </div>

              <div className="p-4 rounded-md bg-zinc-900 border border-zinc-800 space-y-1 md:col-span-2">
                <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider block">
                  Core Behavioral Driver
                </span>
                <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                  {detectiveFinding.executiveSummary?.coreBehavioralDriver ||
                    'The wishlist functions as a "Decision Sandbox"—shoppers hedge against losing the product while awaiting external certainty (price drops, size reassurance, or peer consensus).'}
                </p>
              </div>

              <div className="p-4 rounded-md bg-zinc-900 border border-zinc-800 space-y-1 md:col-span-2">
                <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider block">
                  Recommended Growth Direction
                </span>
                <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                  {detectiveFinding.executiveSummary?.recommendedGrowthDirection ||
                    'Transform the wishlist from a passive holding container into an active, high-confidence conversion vehicle with target-price alerts, community fit intelligence, and social co-shopping links.'}
                </p>
              </div>
            </div>
          </div>

          {/* =====================================================================
              2. OBSERVED EVIDENCE VS. AI INTERPRETATION (Strict Comparison Grid)
             ===================================================================== */}
          <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-900 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-medium text-zinc-100 flex items-center gap-2">
                  <Target className="w-4 h-4 text-zinc-400" />
                  <span>Audit Framework: Observed Evidence vs. AI Interpretation</span>
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  PM rigor requirement: strictly distinguish factual dataset patterns from cognitive AI inferences.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded bg-zinc-900 text-zinc-400 text-[11px] border border-zinc-800">
                Audit Status: Verified
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-md bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-1.5 text-zinc-400 font-medium uppercase tracking-wider text-[10px]">
                  <span>1. Observed Evidence (Fact)</span>
                </div>
                <p className="text-zinc-300 leading-relaxed italic">
                  “{detectiveFinding.evidenceSummary}”
                </p>
                <div className="pt-2 border-t border-zinc-800 text-[10px] text-zinc-500">
                  Ground Truth: 1,248 tagged consumer signals
                </div>
              </div>

              <div className="p-4 rounded-md bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-1.5 text-zinc-400 font-medium uppercase tracking-wider text-[10px]">
                  <span>2. AI Interpretation (Inference)</span>
                </div>
                <p className="text-zinc-300 leading-relaxed">
                  {detectiveFinding.behavioralInsight}
                </p>
                <div className="pt-2 border-t border-zinc-800 text-[10px] text-zinc-500">
                  Cognitive diagnosis of hesitation mechanisms
                </div>
              </div>

              <div className="p-4 rounded-md bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-1.5 text-zinc-400 font-medium uppercase tracking-wider text-[10px]">
                  <span>3. Product Hypothesis (Action)</span>
                </div>
                <p className="text-zinc-300 leading-relaxed">
                  Proactive resolution of sizing uncertainty and price regret will lift checkout completion rate by +14.8%.
                </p>
                <div className="pt-2 border-t border-zinc-800 text-[10px] text-zinc-500">
                  Validated via 7 Opportunity Lab A/B tests
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================================
              3. 3 CORE ROOT CAUSE DEEP-DIVES (Verbatim Dataset Signals)
             ===================================================================== */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-medium text-zinc-100 flex items-center gap-2">
                  <Quote className="w-4 h-4 text-zinc-400" />
                  <span>Core Postponement Drivers (Verbatim Evidence)</span>
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Direct quotations and metrics extracted from the consumer discussion corpus.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {detectiveFinding.coreRootCauses.map((rc, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-md bg-zinc-950 border border-zinc-900 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-medium text-zinc-400">
                        {rc.metric}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 text-zinc-500 border border-zinc-800">
                        {rc.source}
                      </span>
                    </div>

                    <h4 className="text-sm font-medium text-zinc-100 mb-1.5">
                      {rc.title}
                    </h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      {rc.description}
                    </p>
                  </div>

                  <div className="p-3 rounded-md bg-zinc-900 border border-zinc-800 space-y-2">
                    <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider block">
                      Verbatim Public Quote
                    </span>
                    <p className="text-xs text-zinc-300 italic leading-relaxed">
                      "{rc.quote}"
                    </p>
                    <button
                      onClick={() => onNavigateToEvidence()}
                      className="text-[11px] text-zinc-400 hover:text-zinc-200 font-medium flex items-center gap-1 cursor-pointer pt-1"
                    >
                      <span>Inspect Evidence</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* =====================================================================
              4. RECOMMENDED NEXT ACTIONS & RESEARCH LIMITATIONS
             ===================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recommended Next Actions (2 cols) */}
            <div className="lg:col-span-2 p-6 rounded-xl bg-zinc-950 border border-zinc-900 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-zinc-400" />
                  <h3 className="text-sm font-medium text-zinc-100 uppercase tracking-wider">
                    Recommended Growth Interventions
                  </h3>
                </div>
                <button
                  onClick={onNavigateToOpportunities}
                  className="text-xs text-zinc-400 hover:text-zinc-200 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <span>Opportunity Lab</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {detectiveFinding.recommendedActions.map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-md bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-medium text-zinc-400 block mb-1">
                        {rec.friction}
                      </span>
                      <p className="text-zinc-100">{rec.action}</p>
                    </div>

                    <div className="px-3 py-1.5 rounded bg-zinc-950 text-zinc-300 border border-zinc-800 text-right font-mono text-[10px] shrink-0">
                      {rec.expectedOutcome}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Research Limitations & Data Integrity (1 col) */}
            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-900 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-zinc-500 font-medium text-xs uppercase tracking-wider mb-3">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Research Limitations</span>
                </div>
                <h4 className="text-sm font-medium text-zinc-100 mb-2">
                  Data Governance & Boundary
                </h4>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  {detectiveFinding.researchLimitations ||
                    'Findings are derived exclusively from public consumer feedback channels. Telemetry clickstream data and logged purchase rates must be paired with A/B experiments before full rollout.'}
                </p>
              </div>

              <div className="p-3 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400">
                &bull; Public feedback over-indexes on vocal friction points.
                <br />
                &bull; A/B testing in Opportunity Lab validates real lift.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
