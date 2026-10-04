import React, { useState } from 'react';
import { useIntelligence } from '../context/IntelligenceContext';
import { OpportunityCard } from '../components/OpportunityCard';
import { ALL_THEMES } from '../lib/dataEngine';
import { FrictionTheme, ProductOpportunity } from '../types';
import {
  FlaskConical,
  Filter,
  Sparkles,
  Plus,
  ArrowUpDown,
  Download,
  Copy,
  Check,
  Zap,
  Target
} from 'lucide-react';

export const OpportunityLabPage: React.FC = () => {
  const {
    opportunities,
    stats,
    addOpportunity,
    generateAIOpportunity
  } = useIntelligence();

  const [selectedTheme, setSelectedTheme] = useState<FrictionTheme | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'ice' | 'impact' | 'effort'>('ice');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Filter & Sort
  const filteredOpportunities = opportunities
    .filter(opp => {
      if (selectedTheme !== 'ALL' && opp.friction !== selectedTheme) return false;
      if (selectedStatus !== 'ALL' && opp.status !== selectedStatus) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'ice') return b.iceScore - a.iceScore;
      if (sortBy === 'impact') {
        const order = { High: 3, Medium: 2, Low: 1 };
        return order[b.impact] - order[a.impact];
      }
      if (sortBy === 'effort') {
        const order = { Low: 3, Medium: 2, High: 1 }; // Low effort is preferred
        return order[b.effort] - order[a.effort];
      }
      return 0;
    });

  const handleCopyRoadmap = () => {
    const roadmapText = opportunities
      .map(
        (o, i) =>
          `${i + 1}. [${o.friction}] ${o.title} (ICE: ${o.iceScore})\n   - Hypothesis: ${o.productHypothesis}\n   - Experiment: ${o.experiment.title}\n   - Primary Metric: ${o.primaryKpi || o.successMetric}\n`
      )
      .join('\n');

    navigator.clipboard.writeText(roadmapText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickAdd = async (theme: FrictionTheme) => {
    setIsGenerating(true);
    try {
      const newOpp = await generateAIOpportunity(theme);
      addOpportunity(newOpp);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white font-serif tracking-tight">
              Opportunity Lab
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              A/B Experiment Prioritization
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Translating purchase friction diagnoses and user evidence into rigorous, testable Myntra Growth hypotheses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyRoadmap}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Roadmap Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>Copy PM Brief</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Control Bar: Theme Filter, Status Filter, Sort By, Quick Generator */}
      <div className="p-4 rounded-md bg-zinc-900 border border-zinc-800 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Theme Filter */}
            <select
              value={selectedTheme}
              onChange={e => setSelectedTheme(e.target.value as FrictionTheme | 'ALL')}
              className="px-3 py-1.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-zinc-700 cursor-pointer"
            >
              <option value="ALL">All Friction Themes (7)</option>
              {ALL_THEMES.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-zinc-700 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active Test">Active Test</option>
              <option value="Experiment Ready">Experiment Ready</option>
              <option value="In Prioritization">In Prioritization</option>
              <option value="Proposed">Proposed</option>
            </select>

            {/* Sort */}
            <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-md border border-zinc-800">
              <span className="text-[10px] text-zinc-500 font-medium px-1 uppercase">Sort:</span>
              <button
                onClick={() => setSortBy('ice')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  sortBy === 'ice' ? 'bg-zinc-800 text-zinc-200' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                ICE Score
              </button>
              <button
                onClick={() => setSortBy('impact')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  sortBy === 'impact' ? 'bg-zinc-800 text-zinc-200' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Impact
              </button>
              <button
                onClick={() => setSortBy('effort')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  sortBy === 'effort' ? 'bg-zinc-800 text-zinc-200' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Quick Wins
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-500">
              <strong className="text-zinc-300">{filteredOpportunities.length}</strong> Experiments Mapped
            </span>
          </div>
        </div>
      </div>

      {/* Opportunity Cards List */}
      <div className="space-y-6">
        {filteredOpportunities.map(opp => (
          <OpportunityCard key={opp.id} opportunity={opp} />
        ))}
      </div>
    </div>
  );
};
