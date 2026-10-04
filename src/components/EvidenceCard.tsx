import React, { useState } from 'react';
import { AnalyzedConversation, FrictionTheme } from '../types';
import {
  Quote,
  Sparkles,
  Lightbulb,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Calendar,
  Layers
} from 'lucide-react';

interface EvidenceCardProps {
  item: AnalyzedConversation;
  onExploreTheme?: (theme: FrictionTheme) => void;
  onOpenDrawer?: (item: AnalyzedConversation) => void;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({
  item,
  onExploreTheme,
  onOpenDrawer
}) => {
  const [expanded, setExpanded] = useState(false);

  const sourceStyles = {
    Reddit: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    YouTube: 'bg-red-500/10 text-red-400 border-red-500/30',
    'Google Play': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    'App Store': 'bg-blue-500/10 text-blue-400 border-blue-500/30'
  };

  const intentStyles = {
    High: 'bg-emerald-950/90 text-emerald-300 border-emerald-700/60',
    Medium: 'bg-amber-950/90 text-amber-300 border-amber-700/60',
    Low: 'bg-zinc-800 text-zinc-400 border-zinc-700',
    None: 'bg-zinc-800 text-zinc-500 border-zinc-700'
  };

  return (
    <div
      id={`evidence-card-${item.id}`}
      onClick={() => onOpenDrawer && onOpenDrawer(item)}
      className="group p-5 rounded-md bg-zinc-950 border border-zinc-900 hover:border-zinc-700 transition-all duration-200 shadow-sm flex flex-col justify-between cursor-pointer relative"
    >
      <div>
        {/* Top Badges Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-zinc-900 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                sourceStyles[item.source] || 'bg-zinc-900 text-zinc-300 border-zinc-800'
              }`}
            >
              Source: {item.source}
            </span>

            {item.frictionTheme && (
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  if (onExploreTheme) onExploreTheme(item.frictionTheme!);
                }}
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200 hover:border-zinc-700 transition-colors cursor-pointer"
              >
                {item.frictionTheme}
              </button>
            )}

            <span className="text-[11px] text-zinc-500 font-mono">
              {item.productCategory}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider border ${
                intentStyles[item.purchaseIntent]
              }`}
            >
              Intent: {item.purchaseIntent}
            </span>
            <span className="text-[11px] text-zinc-500 font-mono flex items-center gap-1">
              <Calendar className="w-3 h-3 text-zinc-600" />
              {item.date}
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <h4 className="text-sm font-medium text-zinc-100 group-hover:text-white leading-snug">
            {item.title}
          </h4>
          <span className="text-zinc-500 group-hover:text-zinc-300 transition-colors shrink-0 pt-0.5">
            <Maximize2 className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* 1. USER EVIDENCE (Highlighted Verbatim) */}
        <div className="p-3 rounded-md bg-zinc-900 border border-zinc-800 mb-3 relative">
          <div className="flex items-center justify-between gap-1 text-[10px] font-medium tracking-wider text-zinc-400 uppercase mb-1">
            <div className="flex items-center gap-1.5">
              <Quote className="w-3 h-3" />
              <span>User Evidence</span>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono lowercase">demo excerpt</span>
          </div>
          <p className="text-sm text-zinc-100 italic leading-relaxed">
            "{item.extractedQuote || item.text}"
          </p>
        </div>

        {/* Expandable full text if long */}
        {item.text.length > (item.extractedQuote || '').length + 25 && (
          <div className="mb-3" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[11px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-3 h-3" /> Hide context
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3" /> View context
                </>
              )}
            </button>
            {expanded && (
              <p className="mt-2 p-2.5 rounded-md bg-zinc-950 border border-zinc-900 text-xs text-zinc-400 leading-relaxed">
                {item.text}
              </p>
            )}
          </div>
        )}

        {/* 2. AI INTERPRETATION */}
        <div className="p-3 rounded-md bg-zinc-950 border border-zinc-900 mb-2">
          <div className="flex items-center gap-1.5 text-[10px] font-medium tracking-wider text-zinc-400 uppercase mb-1">
            <Sparkles className="w-3 h-3 text-zinc-500" />
            <span>AI Interpretation</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            {item.aiInterpretation}
          </p>
        </div>

        {/* 3. PRODUCT HYPOTHESIS PREVIEW */}
        <div className="p-3 rounded-md bg-zinc-900 border border-zinc-800">
          <div className="flex items-center gap-1.5 text-[10px] font-medium tracking-wider text-zinc-400 uppercase mb-1">
            <Lightbulb className="w-3 h-3 text-zinc-500" />
            <span>Product Hypothesis</span>
          </div>
          <p className="text-xs text-zinc-200 leading-relaxed">
            {item.productHypothesisPreview}
          </p>
        </div>
      </div>

      {/* Footer Tags & Confidence */}
      <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="font-mono text-zinc-600">{item.id}</span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 uppercase">Demo Record</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-zinc-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
            <span>Confidence: {item.confidence}</span>
          </div>
          <span className="text-[10px] text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
            Inspect →
          </span>
        </div>
      </div>
    </div>
  );
};

