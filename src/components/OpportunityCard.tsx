import React, { useState } from 'react';
import { ProductOpportunity } from '../types';
import {
  FlaskConical,
  Quote,
  Sparkles,
  Lightbulb,
  Target,
  Shield,
  CheckCircle2,
  ArrowRight,
  Activity,
  Layers,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { useIntelligence } from '../context/IntelligenceContext';

interface OpportunityCardProps {
  opportunity: ProductOpportunity;
  onExploreTheme?: (theme: string) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onExploreTheme
}) => {
  const { updateOpportunityStatus } = useIntelligence();
  const [showFullExperiment, setShowFullExperiment] = useState(false);

  const ratingBadge = (
    val: 'High' | 'Medium' | 'Low',
    type: 'impact' | 'confidence' | 'effort'
  ) => {
    if (type === 'effort') {
      const color =
        val === 'Low'
          ? 'bg-emerald-950 text-emerald-300 border-emerald-800/60'
          : val === 'Medium'
          ? 'bg-blue-950 text-blue-300 border-blue-800/60'
          : 'bg-amber-950 text-amber-300 border-amber-800/60';
      return (
        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${color}`}>
          {val}
        </span>
      );
    }

    const color =
      val === 'High'
        ? 'bg-emerald-950 text-emerald-300 border-emerald-800/60'
        : val === 'Medium'
        ? 'bg-blue-950 text-blue-300 border-blue-800/60'
        : 'bg-zinc-800 text-zinc-400 border-zinc-700';
    return (
      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${color}`}>
        {val}
      </span>
    );
  };

  const statusStyles: Record<ProductOpportunity['status'], string> = {
    Proposed: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    'In Prioritization': 'bg-amber-950 text-amber-300 border-amber-800',
    'Experiment Ready': 'bg-blue-950 text-blue-300 border-blue-800',
    'Active Test': 'bg-emerald-950 text-emerald-300 border-emerald-800 ring-1 ring-emerald-500/40'
  };

  return (
    <div
      id={`opportunity-card-${opportunity.id}`}
      className="p-6 rounded-md bg-zinc-950 border border-zinc-900 transition-all duration-200 shadow-sm space-y-5"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-zinc-900">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <button
              onClick={() => onExploreTheme && onExploreTheme(opportunity.friction)}
              className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              Friction: {opportunity.friction}
            </button>
            <span className="text-xs font-mono text-zinc-500">{opportunity.id}</span>
          </div>
          <h3 className="text-lg font-medium text-zinc-100 tracking-tight">
            {opportunity.title}
          </h3>
        </div>

        {/* Priority & Status Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* ICE Score Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800">
            <span className="text-[10px] uppercase font-medium text-zinc-500">ICE Score</span>
            <span className="text-sm font-medium text-zinc-200 font-mono">
              {opportunity.iceScore.toFixed(1)}
            </span>
          </div>

          {/* Status Dropdown */}
          <select
            value={opportunity.status}
            onChange={e =>
              updateOpportunityStatus(
                opportunity.id,
                e.target.value as ProductOpportunity['status']
              )
            }
            className={`text-xs font-medium px-2.5 py-1.5 rounded-md border cursor-pointer bg-zinc-900 ${
              statusStyles[opportunity.status]
            }`}
          >
            <option value="Proposed">Proposed</option>
            <option value="In Prioritization">In Prioritization</option>
            <option value="Experiment Ready">Experiment Ready</option>
            <option value="Active Test">Active Test</option>
          </select>
        </div>
      </div>

      {/* PM Metrics Bar: Impact / Confidence / Effort / Primary KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 p-3 rounded-md bg-zinc-900 border border-zinc-800 text-xs">
        <div className="flex items-center justify-between px-2">
          <span className="text-zinc-500 font-medium">Impact:</span>
          {ratingBadge(opportunity.impact, 'impact')}
        </div>
        <div className="flex items-center justify-between px-2 sm:border-l border-zinc-800">
          <span className="text-zinc-500 font-medium">Confidence:</span>
          {ratingBadge(opportunity.confidence, 'confidence')}
        </div>
        <div className="flex items-center justify-between px-2 sm:border-l border-zinc-800">
          <span className="text-zinc-500 font-medium">Effort:</span>
          {ratingBadge(opportunity.effort, 'effort')}
        </div>
        <div className="flex items-center justify-between px-2 sm:border-l border-zinc-800">
          <span className="text-zinc-500 font-medium">Primary KPI:</span>
          <span className="text-zinc-300 font-medium font-mono text-[11px] truncate max-w-[120px]" title={opportunity.primaryKpi || opportunity.successMetric}>
            {opportunity.primaryKpi || 'Conversion'}
          </span>
        </div>
      </div>

      {/* 6-Stage Traceable Evidence-to-Hypothesis Flow */}
      <div className="space-y-4">
        {/* 1. USER EVIDENCE (What users repeatedly say with verbatim snippets) */}
        <div className="p-4 rounded-md bg-zinc-900 border border-zinc-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
              <Quote className="w-3.5 h-3.5" />
              <span>1. User Evidence</span>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">3 snippets</span>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            {opportunity.userEvidenceSummary}
          </p>

          {opportunity.userEvidenceQuotes && opportunity.userEvidenceQuotes.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              {opportunity.userEvidenceQuotes.map((q, idx) => (
                <div key={idx} className="p-2 rounded bg-zinc-950 border border-zinc-900 text-xs text-zinc-400 italic">
                  {q}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. BEHAVIOURAL INSIGHT (Psychological decision barrier) */}
        <div className="p-4 rounded-md bg-zinc-900 border border-zinc-800 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>2. Behavioural Insight</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            {opportunity.behaviouralInsight}
          </p>
        </div>

        {/* 3. PRODUCT HYPOTHESIS (What Myntra can test) */}
        <div className="p-4 rounded-md bg-zinc-900 border border-zinc-800 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>3. Product Hypothesis</span>
          </div>
          <p className="text-xs text-zinc-200 leading-relaxed font-sans font-medium">
            {opportunity.productHypothesis}
          </p>
        </div>

        {/* 4. EXPERIMENT SPECIFICATION */}
        <div className="p-4 rounded-md bg-zinc-900 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>4. A/B Experiment: {opportunity.experiment.title}</span>
            </div>
            <button
              onClick={() => setShowFullExperiment(!showFullExperiment)}
              className="text-[11px] text-zinc-400 hover:text-zinc-200 font-medium cursor-pointer"
            >
              {showFullExperiment ? 'Collapse Variants' : 'Expand Variants'}
            </button>
          </div>

          <p className="text-xs text-zinc-300">
            {opportunity.experiment.description}
          </p>

          {showFullExperiment && (
            <div className="space-y-3 pt-3 border-t border-zinc-800 text-xs animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-md bg-zinc-950 border border-zinc-900">
                  <span className="text-[10px] font-medium text-zinc-500 uppercase block mb-1">
                    Control (Variant A)
                  </span>
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    {opportunity.experiment.variantA}
                  </p>
                </div>
                <div className="p-3 rounded-md bg-zinc-950 border border-zinc-900">
                  <span className="text-[10px] font-medium text-zinc-500 uppercase block mb-1">
                    Treatment (Variant B)
                  </span>
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    {opportunity.experiment.variantB}
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded bg-zinc-950 border border-zinc-900">
                <span className="text-[10px] text-zinc-500 uppercase font-medium block">Target Audience</span>
                <span className="text-zinc-300 font-medium text-xs">
                  {opportunity.experiment.targetAudience}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 5. SUCCESS METRICS & SECONDARY KPIS */}
        <div className="p-4 rounded-md bg-zinc-900 border border-zinc-800 space-y-2.5">
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
            <Target className="w-3.5 h-3.5" />
            <span>5. Primary KPI</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-md bg-zinc-950 border border-zinc-900 text-xs">
            <span className="font-medium text-zinc-200">
              {opportunity.successMetric}
            </span>
            <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 text-[11px] font-mono font-medium border border-zinc-800">
              Target Win Metric
            </span>
          </div>

          {opportunity.secondaryMetrics && opportunity.secondaryMetrics.length > 0 && (
            <div className="pt-2">
              <span className="text-[10px] font-medium text-zinc-500 uppercase block mb-1.5">
                Secondary Metrics:
              </span>
              <div className="flex flex-wrap gap-2">
                {opportunity.secondaryMetrics.map((sm, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-zinc-950 text-zinc-400 border border-zinc-900 text-[11px] font-mono"
                  >
                    • {sm}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

