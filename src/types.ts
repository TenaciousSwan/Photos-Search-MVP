export type SourceType = 'Reddit' | 'YouTube' | 'Google Play' | 'App Store';

export type FrictionTheme =
  | 'Price Hesitation'
  | 'Fit & Sizing'
  | 'Quality & Trust'
  | 'Social Validation'
  | 'Comparison & Choice Overload'
  | 'Timing & Need'
  | 'Delivery / Returns / Convenience';

export type PurchaseIntent = 'High' | 'Medium' | 'Low' | 'None';

export type ConfidenceLevel = 'High' | 'Medium' | 'Low';

export type ProductCategory =
  | 'Ethnic Wear & Kurtas'
  | 'Western Wear & Dresses'
  | 'Footwear & Sneakers'
  | 'Denim & Trousers'
  | 'Winterwear & Jackets'
  | 'Athleisure & Activewear'
  | 'Handbags & Accessories'
  | 'Formal & Suits';

export interface RawConversation {
  id: string;
  source: SourceType;
  date: string;
  rating?: number;
  title: string;
  text: string;
  productCategory: ProductCategory;
  _templateIndex?: number; // Added to map back to template directly
}

export interface AnalyzedConversation extends RawConversation {
  isRelevant: boolean;
  purchaseIntent: PurchaseIntent;
  frictionTheme: FrictionTheme | null;
  confidence: ConfidenceLevel;
  confidenceScore: number;
  detectedSignal: string;
  aiReasoning: string;
  extractedQuote: string;
  aiInterpretation: string;
  productHypothesisPreview: string;
  keywords: string[];
}

export interface FrictionThemeSummary {
  theme: FrictionTheme;
  count: number;
  percentage: number;
  avgConfidence: number;
  whyThisMatters?: {
    observedEvidence: string;
    aiInterpretation: string;
  } | string;
  topQuotes?: string[];
  observedEvidenceSummary: string;
  aiInterpretation: string;
  productHypothesis: string;
  intentDistribution: {
    high: number;
    medium: number;
    low: number;
  };
  confidenceDistribution: {
    high: number;
    medium: number;
    low: number;
  };
  sampleQuotes: {
    id: string;
    quote: string;
    fullText: string;
    source: SourceType;
    intent: PurchaseIntent;
    confidence: ConfidenceLevel;
    confidenceScore: number;
    detectedSignal: string;
    aiReasoning: string;
    date: string;
    category: ProductCategory;
    interpretation: string;
  }[];
  sourceBreakdown: Record<SourceType, number>;
  categoryBreakdown: Record<ProductCategory, number>;
}

export interface DetectiveFinding {
  headline: string;
  subheadline: string;
  keyVerdict: string;
  // 4 Structured Sections:
  observedFacts: string; // 01 — WHAT WE OBSERVED
  verbatimQuotes: {
    quote: string;
    source: SourceType;
    category: string;
    intent: PurchaseIntent;
    date: string;
    confidenceScore: number;
  }[]; // 02 — WHAT USERS ARE SAYING (3 representative verbatim snippets)
  whatItCouldMean: string; // 03 — WHAT IT COULD MEAN (AI-generated behavioural interpretation)
  whatWeCouldTest: string; // 04 — WHAT WE COULD TEST (Product/growth hypothesis)
  // Structured verdict components:
  strongestSignals: {
    theme: FrictionTheme;
    rank: number;
    percentage: number;
    mentions: number;
    topQuote: string;
    source: SourceType;
  }[];
  evidenceSummary: string;
  behavioralInsight: string;
  cautionStatement: string;
  researchLimitations: string[] | string;
  coreRootCauses: {
    title: string;
    description: string;
    metric: string;
    quote: string;
    source: SourceType;
  }[];
  recommendedActions: {
    friction: FrictionTheme;
    action: string;
    expectedOutcome: string;
  }[];
  executiveSummary?: {
    primaryFriction: string;
    secondaryFriction: string;
    coreBehavioralDriver: string;
    recommendedGrowthDirection: string;
  };
}

export interface ProductOpportunity {
  id: string;
  friction: FrictionTheme;
  title: string;
  userEvidenceSummary: string;
  userEvidenceQuotes: string[];
  behaviouralInsight: string;
  productHypothesis: string;
  experiment: {
    title: string;
    description: string;
    variantA: string;
    variantB: string;
    targetAudience: string;
    primaryMetric?: string;
  };
  successMetric: string;
  secondaryMetrics: string[];
  impact: 'High' | 'Medium' | 'Low';
  confidence: 'High' | 'Medium' | 'Low';
  effort: 'High' | 'Medium' | 'Low';
  primaryKpi: string;
  iceScore: number;
  status: 'Proposed' | 'In Prioritization' | 'Experiment Ready' | 'Active Test';
}

export interface DatasetStats {
  totalConversations: number;
  purchaseRelevant: number;
  purchaseRelevantPercent: number;
  sourceCounts: Record<SourceType, number>;
  themeCounts: Record<FrictionTheme, number>;
  themePercentages: Record<FrictionTheme, number>;
  categoryCounts: Record<ProductCategory, number>;
  intentCounts: Record<PurchaseIntent, number>;
  dateRange: {
    start: string;
    end: string;
  };
}

