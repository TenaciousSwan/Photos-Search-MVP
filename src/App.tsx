import React, { useState } from 'react';
import { IntelligenceProvider, useIntelligence } from './context/IntelligenceContext';
import { Header, ActiveTab } from './components/Header';
import { OverviewPage } from './pages/OverviewPage';
import { EvidenceExplorerPage } from './pages/EvidenceExplorerPage';
import { AIDetectivePage } from './pages/AIDetectivePage';
import { OpportunityLabPage } from './pages/OpportunityLabPage';
import { DatasetManagerPage } from './pages/DatasetManagerPage';
import { UploadModal } from './components/UploadModal';
import { FrictionTheme } from './types';
import { Sparkles, Shield, GraduationCap, Github } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { setFilters } = useIntelligence();

  const handleFilterThemeFromOverview = (theme: FrictionTheme) => {
    setFilters(prev => ({ ...prev, selectedTheme: theme }));
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col selection:bg-zinc-800 selection:text-zinc-200">
      {/* Top Global Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={() => setIsUploadOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'overview' && (
          <OverviewPage
            onNavigateTab={tab => setActiveTab(tab)}
            onFilterTheme={handleFilterThemeFromOverview}
          />
        )}

        {activeTab === 'evidence' && (
          <EvidenceExplorerPage
            onNavigateToOpportunities={() => setActiveTab('opportunities')}
          />
        )}

        {activeTab === 'detective' && (
          <AIDetectivePage
            onNavigateToOpportunities={() => setActiveTab('opportunities')}
            onNavigateToEvidence={theme => {
              if (theme) {
                setFilters(prev => ({ ...prev, selectedTheme: theme as FrictionTheme }));
              }
              setActiveTab('evidence');
            }}
          />
        )}

        {activeTab === 'opportunities' && <OpportunityLabPage />}

        {activeTab === 'dataset' && (
          <DatasetManagerPage
            onOpenUpload={() => setIsUploadOpen(true)}
            onNavigateToOverview={() => setActiveTab('overview')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950/60 py-6 px-4 sm:px-6 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-400 font-serif">AI DETECTIVE</span>
            <span>&bull;</span>
            <span>Consumer Purchase Friction Intelligence Platform</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-zinc-500 text-[11px]">
            <span className="inline-flex items-center gap-1 text-zinc-400">
              <GraduationCap className="w-3.5 h-3.5 text-zinc-400" />
              <span>PM Graduation Project Prototype &bull; Myntra Growth Case Study</span>
            </span>
            <span>&bull;</span>
            <span className="text-amber-400/90 font-mono">
              DEMO DATA — Not real Myntra customer data
            </span>
          </div>
        </div>
      </footer>

      {/* Upload Dataset Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={() => {
          setActiveTab('overview');
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <IntelligenceProvider>
      <MainAppContent />
    </IntelligenceProvider>
  );
}
