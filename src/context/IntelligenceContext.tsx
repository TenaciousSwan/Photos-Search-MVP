import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import {
  RawConversation,
  AnalyzedConversation,
  DatasetStats,
  FrictionThemeSummary,
  FrictionTheme,
  ProductOpportunity,
  DetectiveFinding,
  SourceType,
  ProductCategory,
  PurchaseIntent,
  ConfidenceLevel
} from '../types';
import { generateDemoDataset } from '../data/demoDataset';
import { computeDatasetStats, computeThemeSummaries, ALL_THEMES, analyzeDatasetConversation } from '../lib/dataEngine';
import { INITIAL_OPPORTUNITIES, PRIMARY_DETECTIVE_FINDING } from '../data/opportunities';

interface InvestigationStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed';
  metric: string;
}

interface FilterState {
  searchQuery: string;
  selectedTheme: FrictionTheme | 'ALL';
  selectedSource: SourceType | 'ALL';
  selectedIntent: PurchaseIntent | 'ALL';
  selectedConfidence: ConfidenceLevel | 'ALL';
  selectedCategory: ProductCategory | 'ALL';
}

interface IntelligenceContextType {
  // Data
  rawDataset: RawConversation[];
  analyzedDataset: AnalyzedConversation[];
  stats: DatasetStats;
  themeSummaries: Record<FrictionTheme, FrictionThemeSummary>;
  opportunities: ProductOpportunity[];
  detectiveFinding: DetectiveFinding;
  isCustomDataset: boolean;
  datasetName: string;

  // Filters for Evidence Explorer
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  filteredConversations: AnalyzedConversation[];

  // Investigation Engine State
  isInvestigating: boolean;
  investigationProgress: number; // 0 - 100
  investigationSteps: InvestigationStep[];
  hasInvestigated: boolean;
  runInvestigation: () => Promise<void>;
  resetInvestigation: () => void;

  // Actions
  loadCustomDataset: (records: RawConversation[], name: string) => void;
  resetToDemoDataset: () => void;
  updateOpportunityStatus: (id: string, status: ProductOpportunity['status']) => void;
  addOpportunity: (opportunity: ProductOpportunity) => void;
  generateAIOpportunity: (theme: FrictionTheme) => Promise<ProductOpportunity>;
}

const IntelligenceContext = createContext<IntelligenceContextType | null>(null);

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  selectedTheme: 'ALL',
  selectedSource: 'ALL',
  selectedIntent: 'ALL',
  selectedConfidence: 'ALL',
  selectedCategory: 'ALL'
};

export const IntelligenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with 1,248 realistic demo conversations
  const [rawDataset, setRawDataset] = useState<RawConversation[]>(() => generateDemoDataset(1248));
  const [isCustomDataset, setIsCustomDataset] = useState<boolean>(false);
  const [datasetName, setDatasetName] = useState<string>('Myntra Q2 Wishlist Friction Corpus (Demo)');

  const [opportunities, setOpportunities] = useState<ProductOpportunity[]>(INITIAL_OPPORTUNITIES);
  const [detectiveFinding, setDetectiveFinding] = useState<DetectiveFinding>(PRIMARY_DETECTIVE_FINDING);

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Investigation state
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [investigationProgress, setInvestigationProgress] = useState(0);
  const [hasInvestigated, setHasInvestigated] = useState(true); // Default ready to view or rerun

  const INITIAL_STEPS: InvestigationStep[] = [
    { id: '1', label: 'Collecting conversations', status: 'completed', metric: '1,248 ingressed' },
    { id: '2', label: 'Filtering irrelevant content', status: 'completed', metric: '162 discarded' },
    { id: '3', label: 'Detecting purchase intent', status: 'completed', metric: '1,086 high/med intent' },
    { id: '4', label: 'Identifying purchase friction', status: 'completed', metric: '7 core vectors' },
    { id: '5', label: 'Clustering themes', status: 'completed', metric: '94% cluster cohesion' },
    { id: '6', label: 'Extracting evidence', status: 'completed', metric: '340+ verbatim signals' },
    { id: '7', label: 'Generating behavioural insights', status: 'completed', metric: 'Root causes synthesized' },
    { id: '8', label: 'Generating product opportunities', status: 'completed', metric: '7 prioritized experiments' }
  ];

  const [investigationSteps, setInvestigationSteps] = useState<InvestigationStep[]>(INITIAL_STEPS);

  // Analyze raw conversations
  const analyzedDataset = useMemo(() => {
    return rawDataset.map(analyzeDatasetConversation);
  }, [rawDataset]);

  // Compute live dataset stats
  const stats = useMemo(() => {
    return computeDatasetStats(analyzedDataset);
  }, [analyzedDataset]);

  // Compute theme summaries
  const themeSummaries = useMemo(() => {
    return computeThemeSummaries(analyzedDataset);
  }, [analyzedDataset]);

  // Filtered conversations
  const filteredConversations = useMemo(() => {
    return analyzedDataset.filter(item => {
      if (!item.isRelevant) return false;

      if (filters.selectedTheme !== 'ALL' && item.frictionTheme !== filters.selectedTheme) {
        return false;
      }
      if (filters.selectedSource !== 'ALL' && item.source !== filters.selectedSource) {
        return false;
      }
      if (filters.selectedIntent !== 'ALL' && item.purchaseIntent !== filters.selectedIntent) {
        return false;
      }
      if (filters.selectedConfidence !== 'ALL' && item.confidence !== filters.selectedConfidence) {
        return false;
      }
      if (filters.selectedCategory !== 'ALL' && item.productCategory !== filters.selectedCategory) {
        return false;
      }
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const textMatch = item.text.toLowerCase().includes(q);
        const titleMatch = item.title.toLowerCase().includes(q);
        const quoteMatch = item.extractedQuote.toLowerCase().includes(q);
        const categoryMatch = item.productCategory.toLowerCase().includes(q);
        return textMatch || titleMatch || quoteMatch || categoryMatch;
      }
      return true;
    });
  }, [analyzedDataset, filters]);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // Investigation Runner
  const runInvestigation = useCallback(async () => {
    setIsInvestigating(true);
    setInvestigationProgress(0);
    setHasInvestigated(false);

    const stepsTemplate: { label: string; metric: string }[] = [
      { label: 'Collecting conversations', metric: `${rawDataset.length} ingressed` },
      { label: 'Filtering irrelevant content', metric: `${stats.totalConversations - stats.purchaseRelevant} discarded` },
      { label: 'Detecting purchase intent', metric: `${stats.purchaseRelevant} verified shopping intent` },
      { label: 'Identifying purchase friction', metric: `${ALL_THEMES.length} distinct friction vectors` },
      { label: 'Clustering themes', metric: '94.2% semantic clustering confidence' },
      { label: 'Extracting evidence', metric: `${Math.round(stats.purchaseRelevant * 0.45)}+ verbatim quotes tagged` },
      { label: 'Generating insights', metric: 'Behavioral dropoff diagnosis completed' },
      { label: 'Generating opportunities', metric: `${opportunities.length} A/B experiments mapped` }
    ];

    const currentSteps: InvestigationStep[] = stepsTemplate.map((s, idx) => ({
      id: String(idx + 1),
      label: s.label,
      status: 'pending',
      metric: s.metric
    }));

    setInvestigationSteps(currentSteps);

    // Sequential animation with delays
    for (let i = 0; i < currentSteps.length; i++) {
      // Set current to active
      setInvestigationSteps(prev =>
        prev.map((step, idx) => ({
          ...step,
          status: idx < i ? 'completed' : idx === i ? 'active' : 'pending'
        }))
      );

      const progressVal = Math.round(((i + 0.5) / currentSteps.length) * 100);
      setInvestigationProgress(progressVal);

      // Simulation delay for smooth UX
      await new Promise(resolve => setTimeout(resolve, 450));

      // Mark current completed
      setInvestigationSteps(prev =>
        prev.map((step, idx) => ({
          ...step,
          status: idx <= i ? 'completed' : 'pending'
        }))
      );
      setInvestigationProgress(Math.round(((i + 1) / currentSteps.length) * 100));
    }

    setIsInvestigating(false);
    setHasInvestigated(true);
  }, [rawDataset.length, stats, opportunities.length]);

  const resetInvestigation = useCallback(() => {
    setHasInvestigated(false);
    setInvestigationProgress(0);
    setInvestigationSteps(prev => prev.map(s => ({ ...s, status: 'pending' })));
  }, []);

  const loadCustomDataset = useCallback((records: RawConversation[], name: string) => {
    setRawDataset(records);
    setIsCustomDataset(true);
    setDatasetName(name);
    setHasInvestigated(true);
    setFilters(DEFAULT_FILTERS);
  }, []);

  const resetToDemoDataset = useCallback(() => {
    const demo = generateDemoDataset(1248);
    setRawDataset(demo);
    setIsCustomDataset(false);
    setDatasetName('Myntra Q2 Wishlist Friction Corpus (Demo)');
    setHasInvestigated(true);
    setFilters(DEFAULT_FILTERS);
  }, []);

  const updateOpportunityStatus = useCallback((id: string, status: ProductOpportunity['status']) => {
    setOpportunities(prev =>
      prev.map(opp => (opp.id === id ? { ...opp, status } : opp))
    );
  }, []);

  const addOpportunity = useCallback((opportunity: ProductOpportunity) => {
    setOpportunities(prev => [opportunity, ...prev]);
  }, []);

  const generateAIOpportunity = useCallback(async (theme: FrictionTheme): Promise<ProductOpportunity> => {
    // Generate an actionable experiment either via server Gemini or high-level heuristic
    const existing = opportunities.find(o => o.friction === theme);
    const id = `OPP-GEN-${Date.now().toString().slice(-4)}`;
    
    if (existing) {
      return {
        ...existing,
        id,
        title: `${theme}: Rapid Intervention Test`,
        status: 'Proposed'
      };
    }

    return {
      id,
      friction: theme,
      title: `${theme} Friction Resolver`,
      userEvidenceSummary: `Multiple user discussions express friction regarding ${theme}.`,
      userEvidenceQuotes: ['“Added to wishlist but holding off for more clarity.”'],
      behaviouralInsight: `Users exhibit purchase interest but stall due to uncertainty related to ${theme.toLowerCase()}.`,
      productHypothesis: `Clearer UI feedback and contextual guidance around ${theme.toLowerCase()} will reduce hesitation.`,
      experiment: {
        title: `${theme} In-Wishlist Context Card`,
        description: `Test real-time assurances for ${theme} on PDP and Wishlist.`,
        variantA: 'Control: Standard product details.',
        variantB: 'Variant: Enhanced contextual guarantee module.',
        targetAudience: 'Active wishlisters',
        primaryMetric: 'Wishlist-to-Cart Conversion (+10%)'
      },
      successMetric: 'Wishlist-to-Cart Conversion (+10%)',
      secondaryMetrics: ['PDP-to-Wishlist Rate', 'Return / Cancellation Rate'],
      primaryKpi: 'Wishlist-to-Cart (+10%)',
      impact: 'High',
      confidence: 'Medium',
      effort: 'Medium',
      iceScore: 7.5,
      status: 'Proposed'
    };
  }, [opportunities]);

  return (
    <IntelligenceContext.Provider
      value={{
        rawDataset,
        analyzedDataset,
        stats,
        themeSummaries,
        opportunities,
        detectiveFinding,
        isCustomDataset,
        datasetName,
        filters,
        setFilters,
        resetFilters,
        filteredConversations,
        isInvestigating,
        investigationProgress,
        investigationSteps,
        hasInvestigated,
        runInvestigation,
        resetInvestigation,
        loadCustomDataset,
        resetToDemoDataset,
        updateOpportunityStatus,
        addOpportunity,
        generateAIOpportunity
      }}
    >
      {children}
    </IntelligenceContext.Provider>
  );
};

export function useIntelligence(): IntelligenceContextType {
  const context = useContext(IntelligenceContext);
  if (!context) {
    throw new Error('useIntelligence must be used within an IntelligenceProvider');
  }
  return context;
}
