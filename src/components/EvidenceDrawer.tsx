import React, { useEffect } from 'react';
import { AnalyzedConversation, FrictionTheme } from '../types';
import {
  X,
  Quote,
  Sparkles,
  ShieldCheck,
  Tag,
  Calendar,
  Layers,
  ExternalLink,
  Lightbulb,
  Radio,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface EvidenceDrawerProps {
  item: AnalyzedConversation | null;
  isOpen: boolean;
  onClose: () => void;
  onFilterTheme?: (theme: FrictionTheme) => void;
  onNavigateToOpportunities?: () => void;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({
  item,
  isOpen,
  onClose,
  onFilterTheme,
  onNavigateToOpportunities
}) => {
  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const sourceStyles = {
    Reddit: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    YouTube: 'bg-red-500/10 text-red-400 border-red-500/30',
    'Google Play': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    'App Store': 'bg-blue-500/10 text-blue-400 border-blue-500/30'
  };

  const intentStyles = {
    High: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60',
    Medium: 'bg-amber-950/80 text-amber-300 border-amber-700/60',
    Low: 'bg-zinc-800 text-zinc-400 border-zinc-700',
    None: 'bg-zinc-800 text-zinc-500 border-zinc-700'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="p-6 border-b border-zinc-900 bg-zinc-950">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                  Evidence Audit
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800">
                  {item.id}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono text-zinc-400 bg-zinc-800 border border-zinc-700 uppercase">
                  Demo Record
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-md text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
                title="Close Drawer (ESC)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-base font-medium text-zinc-100 mt-3 leading-snug">
              {item.title}
            </h3>
          </div>

          {/* Drawer Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 text-sm">
            {/* Metadata Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-md bg-zinc-900 border border-zinc-800 text-xs">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block font-medium">Source</span>
                <span className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-medium border mt-0.5 ${sourceStyles[item.source] || 'bg-zinc-800 text-zinc-300 border-zinc-700'}`}>
                  {item.source}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block font-medium">Date</span>
                <span className="text-zinc-300 font-mono text-[11px] mt-0.5 block">{item.date}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block font-medium">Intent</span>
                <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium uppercase border mt-0.5 ${intentStyles[item.purchaseIntent]}`}>
                  {item.purchaseIntent}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block font-medium">Confidence</span>
                <span className="text-zinc-300 font-mono text-[11px] mt-0.5 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-zinc-500" />
                  {item.confidence}
                </span>
              </div>
            </div>

            {/* 1. ORIGINAL EVIDENCE (Complete verbatim context) */}
            <div className="p-4 rounded-md bg-zinc-900 border border-zinc-800 space-y-2">
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
                <Quote className="w-3.5 h-3.5" />
                <span>Original Evidence (Complete Text)</span>
              </div>
              <blockquote className="text-zinc-200 italic leading-relaxed text-sm bg-zinc-950 p-3 rounded-md border border-zinc-900">
                "{item.text}"
              </blockquote>
              <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                <span>Category: <strong className="text-zinc-300">{item.productCategory}</strong></span>
                {item.rating !== undefined && (
                  <span>User Rating: <strong className="text-zinc-400">{item.rating} / 5.0</strong></span>
                )}
              </div>
            </div>

            {/* 2. DETECTED SIGNAL */}
            <div className="p-4 rounded-md bg-zinc-900 border border-zinc-800 space-y-2">
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
                <Radio className="w-3.5 h-3.5" />
                <span>Detected Purchase Signal</span>
              </div>
              <div className="p-3 rounded-md bg-zinc-950 border border-zinc-900 text-zinc-300 text-xs leading-relaxed font-sans">
                {item.detectedSignal || 'High purchase intent: Wishlist item stalled waiting for sale discount'}
              </div>
            </div>

            {/* 3. DETECTED FRICTION THEME */}
            <div className="p-4 rounded-md bg-zinc-900 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Detected Friction Theme</span>
                </div>
                {item.frictionTheme && onFilterTheme && (
                  <button
                    onClick={() => {
                      onFilterTheme(item.frictionTheme!);
                      onClose();
                    }}
                    className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 font-medium cursor-pointer"
                  >
                    Filter Theme <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="p-3 rounded-md bg-zinc-950 border border-zinc-900 flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-zinc-200 block">{item.frictionTheme || 'Unclassified'}</span>
                  <span className="text-[11px] text-zinc-500">Primary decision blocker</span>
                </div>
                <span className="px-2 py-1 rounded bg-zinc-900 text-zinc-400 font-mono text-xs font-medium border border-zinc-800">
                  {item.confidence} Confidence
                </span>
              </div>
            </div>

            {/* 4. AI REASONING (Explainability & Audit) */}
            <div className="p-4 rounded-md bg-zinc-900 border border-zinc-800 space-y-2">
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Reasoning</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {item.aiReasoning || 'Explicit mention of product affinity and wishlist bookmarking paired with systemic hesitation barrier.'}
              </p>
              <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-500">
                <strong className="text-zinc-400">Extracted Interpretation:</strong> {item.aiInterpretation}
              </div>
            </div>

            {/* 5. PRODUCT HYPOTHESIS PREVIEW */}
            <div className="p-4 rounded-md bg-zinc-900 border border-zinc-800 space-y-2">
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Product Hypothesis Link</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {item.productHypothesisPreview}
              </p>
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-4 border-t border-zinc-900 bg-zinc-950 flex items-center justify-between gap-3">
            {item.frictionTheme && onFilterTheme ? (
              <button
                onClick={() => {
                  onFilterTheme(item.frictionTheme!);
                  onClose();
                }}
                className="flex-1 px-3 py-2 rounded-md text-xs font-medium text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors cursor-pointer text-center"
              >
                View all in "{item.frictionTheme}"
              </button>
            ) : null}

            {onNavigateToOpportunities && (
              <button
                onClick={() => {
                  onNavigateToOpportunities();
                  onClose();
                }}
                className="flex-1 px-3 py-2 rounded-md text-xs font-medium text-black bg-zinc-100 hover:bg-zinc-200 transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
              >
                <span>View A/B Test</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
