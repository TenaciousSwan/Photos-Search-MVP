import React from 'react';
import { Sparkles, Database, Search, FlaskConical, LayoutDashboard, ShieldAlert, Play, RefreshCw, Upload } from 'lucide-react';
import { useIntelligence } from '../context/IntelligenceContext';

export type ActiveTab = 'overview' | 'evidence' | 'detective' | 'opportunities' | 'dataset';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenUpload: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenUpload }) => {
  const { stats, isCustomDataset, runInvestigation, isInvestigating } = useIntelligence();

  return (
    <header className="border-b border-zinc-900 bg-black sticky top-0 z-40">
      {/* Top Meta Disclaimer & Brand Pill */}
      <div className="border-b border-zinc-900 bg-black px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-medium text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
            MYNTRA GROWTH INTELLIGENCE
          </span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-500 hidden sm:inline">
            {isCustomDataset ? 'Active Dataset: Uploaded CSV' : 'DEMO DATA — Not real Myntra customer data'}
          </span>
        </div>

        <div className="flex items-center gap-4 text-zinc-500">
          <span className="hidden md:inline">
            <strong className="text-zinc-300 font-medium">{stats.totalConversations.toLocaleString()}</strong> Records Ingested
          </span>
          <span className="hidden md:inline">
            <strong className="text-zinc-300 font-medium">{stats.purchaseRelevant.toLocaleString()}</strong> Shopping Signals
          </span>
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <Upload className="w-3 h-3" />
            <span>Upload Dataset</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3.5">
          <div className="w-8 h-8 rounded-md bg-zinc-900 flex items-center justify-center border border-zinc-800">
            <Sparkles className="w-4 h-4 text-zinc-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-medium tracking-tight text-zinc-100">
                AI DETECTIVE
              </h1>
              <span className="text-[10px] text-zinc-500">
                v1.0-PROTOTYPE
              </span>
            </div>
            <p className="text-xs text-zinc-500 tracking-tight mt-0.5">
              Consumer Purchase Friction Intelligence &bull; Myntra Growth Team
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-4 text-sm font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 pb-1 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-zinc-200 text-zinc-100'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('evidence')}
            className={`flex items-center gap-2 pb-1 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'evidence'
                ? 'border-zinc-200 text-zinc-100'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Evidence</span>
            <span className="text-[10px] text-zinc-500 ml-0.5">
              ({stats.purchaseRelevant})
            </span>
          </button>

          <button
            onClick={() => setActiveTab('detective')}
            className={`flex items-center gap-2 pb-1 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'detective'
                ? 'border-zinc-200 text-zinc-100'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Detective</span>
          </button>

          <button
            onClick={() => setActiveTab('opportunities')}
            className={`flex items-center gap-2 pb-1 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'opportunities'
                ? 'border-zinc-200 text-zinc-100'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>Opportunity Lab</span>
          </button>

          <button
            onClick={() => setActiveTab('dataset')}
            className={`flex items-center gap-2 pb-1 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'dataset'
                ? 'border-zinc-200 text-zinc-100'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Dataset</span>
          </button>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <button
            id="run-investigation-top-btn"
            onClick={() => {
              setActiveTab('detective');
              runInvestigation();
            }}
            disabled={isInvestigating}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium bg-zinc-100 hover:bg-zinc-200 text-black transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isInvestigating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Investigating...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>RUN INVESTIGATION</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
