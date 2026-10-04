import Papa from 'papaparse';
import {
  RawConversation,
  AnalyzedConversation,
  DatasetStats,
  FrictionTheme,
  SourceType,
  ProductCategory,
  PurchaseIntent,
  ConfidenceLevel,
  FrictionThemeSummary
} from '../types';
import { analyzeConversation as analyzeDemoConversation } from '../data/demoDataset';

export const ALL_THEMES: FrictionTheme[] = [
  'Price Hesitation',
  'Fit & Sizing',
  'Social Validation',
  'Quality & Trust',
  'Comparison & Choice Overload',
  'Timing & Need',
  'Delivery / Returns / Convenience'
];

export const ALL_SOURCES: SourceType[] = [
  'Reddit',
  'YouTube',
  'Google Play',
  'App Store'
];

export const ALL_CATEGORIES: ProductCategory[] = [
  'Ethnic Wear & Kurtas',
  'Western Wear & Dresses',
  'Footwear & Sneakers',
  'Denim & Trousers',
  'Winterwear & Jackets',
  'Athleisure & Activewear',
  'Handbags & Accessories',
  'Formal & Suits'
];


const THEME_RULES: Record<FrictionTheme, { keywords: string[]; phrases: string[] }> = {
  'Price Hesitation': {
    keywords: ['price', 'expensive', 'cost', 'afford', 'discount', 'sale', 'offer', 'coupon', 'deal', 'cheaper', 'cheap', 'drop'],
    phrases: [
      'too expensive',
      'price is too high',
      'price is high',
      'price too high',
      'better price',
      'lower price',
      'waiting for the sale',
      'waiting for a sale',
      'waiting for sale',
      'waiting for discount',
      'waiting for a discount',
      'wait for sale',
      'price drop',
      'wait till sale'
    ]
  },
  'Fit & Sizing': {
    keywords: ['size', 'sizing', 'fit', 'fits', 'measurement', 'measurements', 'body type', 'small', 'large', 'oversized', 'tight', 'loose', 'waist', 'bust', 'length'],
    phrases: [
      'what size',
      'which size',
      'confused about which size',
      'true to size',
      'runs small',
      'runs large',
      'size chart',
      'will it fit',
      'size unavailable',
      'size out of stock',
      'out of stock'
    ]
  },
  'Quality & Trust': {
    keywords: ['quality', 'fabric', 'material', 'durable', 'durability', 'stitching', 'authentic', 'fake', 'original'],
    phrases: [
      'how is the quality',
      'worth the price',
      'looks different',
      'actual product',
      'not sure about the quality',
      'is it original',
      'quality issue',
      'cheap quality'
    ]
  },
  'Social Validation': {
    keywords: ['review', 'reviews', 'recommend', 'recommendation', 'opinion', 'opinions', 'friend', 'friends', 'influencer', 'photos'],
    phrases: [
      'should i buy',
      'has anyone tried',
      'has anyone bought',
      'anyone bought',
      'anyone tried',
      'looking for reviews',
      'what do you think',
      'need opinions',
      'customer photos'
    ]
  },
  'Comparison & Choice Overload': {
    keywords: ['comparing', 'compare', 'comparison', 'alternative', 'alternatives', 'similar', 'versus', 'vs', 'option', 'options', 'choices'],
    phrases: ['which one', 'another option', 'too many choices', "can't decide", 'cant decide', 'too many options', 'compare with']
  },
  'Timing & Need': {
    keywords: ['later', 'occasion', 'wedding', 'vacation', 'trip', 'postpone', 'maybe'],
    phrases: [
      'not right now',
      "don't need",
      'dont need',
      "don't need it right now",
      'maybe later',
      'buy later',
      'for later',
      'waiting until',
      'not now'
    ]
  },
  'Delivery / Returns / Convenience': {
    keywords: ['delivery', 'shipping', 'return', 'returns', 'refund', 'exchange', 'courier', 'pickup'],
    phrases: [
      'return policy',
      'returns are difficult',
      'delivery time',
      'delivery fee',
      'delivery date',
      'refund takes',
      'return charge'
    ]
  }
};

const HIGH_INTENT_PHRASES = [
  'wishlist',
  'wishlisted',
  'saved to wishlist',
  'added to my wishlist',
  'added to wishlist',
  'thinking of buying',
  'thinking about buying',
  'considering buying',
  'consider buying',
  'should i buy',
  'waiting to buy',
  'wait to buy',
  'planning to order',
  'plan to order',
  'planning to buy',
  'interested in purchasing',
  'interested in buying',
  'waiting for the sale',
  'waiting for a sale',
  'waiting for sale',
  'waiting for discount',
  'waiting for a discount',
  "love it but haven't bought",
  "love it but havent bought",
  'before ordering',
  'going to buy',
  'want to buy',
  'want to order',
  'has anyone bought',
  'has anyone actually bought',
  'anyone actually bought'
];

const HIGH_INTENT_PATTERNS = [
  /love .+ but (?:the )?(?:price|cost)/,
  /like .+ but/,
  /really like .+ but/,
  /added to .+ wishlist/,
  /waiting for (?:the )?(?:sale|discount)/
];

const MEDIUM_INTENT_SIGNALS = [
  'like',
  'love',
  'looks good',
  'looks great',
  'interested',
  'nice',
  'beautiful',
  'want this',
  'need this',
  'comparing',
  'compare',
  'deciding',
  'ordering',
  'wait'
];

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function matchTerm(text: string, term: string): boolean {
  if (term.includes(' ')) {
    return text.includes(term);
  }
  if (term.length <= 4) {
    return new RegExp(`\\b${escapeRegex(term)}\\b`, 'i').test(text);
  }
  return text.includes(term);
}

function countHits(text: string, terms: string[]): number {
  return terms.reduce((score, term) => score + (matchTerm(text, term) ? 1 : 0), 0);
}

function scoreTheme(text: string, theme: FrictionTheme): { score: number; phraseMatches: number } {
  const rule = THEME_RULES[theme];
  const phraseMatches = rule.phrases.filter(phrase => text.includes(phrase)).length;
  const keywordHits = countHits(text, rule.keywords);
  return {
    score: keywordHits + phraseMatches * 3,
    phraseMatches
  };
}

function detectPurchaseIntent(combined: string): PurchaseIntent {
  if (
    HIGH_INTENT_PHRASES.some(phrase => combined.includes(phrase)) ||
    HIGH_INTENT_PATTERNS.some(pattern => pattern.test(combined))
  ) {
    return 'High';
  }

  if (MEDIUM_INTENT_SIGNALS.some(signal => matchTerm(combined, signal))) {
    return 'Medium';
  }

  if (countHits(combined, ['buy', 'buying', 'purchase', 'order', 'ordering', 'cart', 'checkout']) > 0) {
    return 'Medium';
  }

  if (countHits(combined, ['bad', 'terrible', 'worst', 'hate', 'disappointed', 'poor']) > 0) {
    return 'Low';
  }

  return 'None';
}

function deriveConfidence(
  themeScore: number,
  phraseMatches: number,
  purchaseIntent: PurchaseIntent
): { confidence: ConfidenceLevel; confidenceScore: number } {
  if (phraseMatches >= 1 || themeScore >= 4 || (themeScore >= 2 && purchaseIntent === 'High')) {
    return { confidence: 'High', confidenceScore: 90 };
  }
  if (themeScore >= 2 || purchaseIntent === 'High' || purchaseIntent === 'Medium') {
    return { confidence: 'Medium', confidenceScore: 75 };
  }
  return { confidence: 'Low', confidenceScore: 60 };
}

function cleanPII(text: string): string {
  return text
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[email removed]')
    .replace(/(?:\+?91[-\s]?)?[6-9]\d{9}\b/g, '[phone removed]')
    .replace(/https?:\/\/\S+/gi, '[link removed]')
    .trim();
}

function inferCategory(text: string, fallback: ProductCategory): ProductCategory {
  const t = text.toLowerCase();
  const checks: Array<[ProductCategory, string[]]> = [
    ['Ethnic Wear & Kurtas', ['kurta', 'kurti', 'lehenga', 'saree', 'anarkali', 'salwar', 'ethnic']],
    ['Western Wear & Dresses', ['dress', 'top', 'shirt', 'skirt', 'jumpsuit', 'gown', 'western']],
    ['Footwear & Sneakers', ['shoe', 'shoes', 'sneaker', 'heels', 'heel', 'sandals', 'boots', 'loafer']],
    ['Denim & Trousers', ['jeans', 'denim', 'trouser', 'cargo', 'pants', 'jogger']],
    ['Winterwear & Jackets', ['jacket', 'coat', 'sweater', 'hoodie', 'thermal', 'winterwear', 'trench']],
    ['Athleisure & Activewear', ['gym', 'activewear', 'sports', 'yoga', 'running', 'athleisure', 'leggings']],
    ['Handbags & Accessories', ['bag', 'handbag', 'watch', 'belt', 'wallet', 'accessory', 'accessories']],
    ['Formal & Suits', ['suit', 'blazer', 'formal', 'workwear', 'office wear']]
  ];
  for (const [category, terms] of checks) {
    if (countHits(t, terms) > 0) return category;
  }
  return fallback;
}

function heuristicAnalyzeConversation(raw: RawConversation): AnalyzedConversation {
  const safeText = cleanPII(raw.text);
  const combined = `${raw.title} ${safeText}`.toLowerCase();

  const rankedThemes = ALL_THEMES.map(theme => {
    const { score, phraseMatches } = scoreTheme(combined, theme);
    return { theme, score, phraseMatches };
  }).sort((a, b) => b.score - a.score || b.phraseMatches - a.phraseMatches);

  const top = rankedThemes[0];
  const hasFrictionEvidence = top.score >= 1;
  let purchaseIntent = detectPurchaseIntent(combined);
  if (purchaseIntent === 'None' && hasFrictionEvidence) {
    purchaseIntent = 'Medium';
  }
  const isRelevant = hasFrictionEvidence && purchaseIntent !== 'None';

  if (!isRelevant) {
    return {
      ...raw,
      text: safeText,
      productCategory: inferCategory(safeText, raw.productCategory),
      isRelevant: false,
      purchaseIntent: hasFrictionEvidence ? purchaseIntent : purchaseIntent === 'None' ? 'None' : purchaseIntent,
      frictionTheme: null,
      confidence: purchaseIntent === 'High' ? 'Medium' : 'Low',
      confidenceScore: purchaseIntent === 'High' ? 75 : 60,
      detectedSignal: purchaseIntent !== 'None'
        ? `${purchaseIntent} purchase intent without a clear friction theme`
        : 'No strong purchase-friction signal detected',
      aiReasoning: purchaseIntent !== 'None'
        ? 'Purchase intent was detected, but the record lacks enough friction language to assign a primary theme.'
        : 'The record does not contain enough shopping-intent and friction language to classify it as a purchase hesitation signal.',
      extractedQuote: safeText.slice(0, 180),
      aiInterpretation: 'Filtered from purchase-friction analysis because purchase intent or friction evidence was insufficient.',
      productHypothesisPreview: 'No product hypothesis generated for this record.',
      keywords: []
    };
  }

  const { confidence, confidenceScore } = deriveConfidence(top.score, top.phraseMatches, purchaseIntent);
  const theme = top.theme;
  const keywords = [
    ...THEME_RULES[theme].phrases.filter(p => combined.includes(p)),
    ...THEME_RULES[theme].keywords.filter(k => matchTerm(combined, k))
  ].slice(0, 5);
  const firstSentence = safeText.split(/(?<=[.!?])\s+/)[0]?.trim() || safeText;
  const themeInsight = THEME_INSIGHTS[theme];

  return {
    ...raw,
    text: safeText,
    productCategory: inferCategory(safeText, raw.productCategory),
    isRelevant: true,
    purchaseIntent,
    frictionTheme: theme,
    confidence,
    confidenceScore,
    detectedSignal: `${purchaseIntent} purchase intent with ${theme.toLowerCase()} signals`,
    aiReasoning: `Classified from ${purchaseIntent.toLowerCase()} purchase-intent signals and ${top.score} ${theme.toLowerCase()} language matches in the record.`,
    extractedQuote: firstSentence,
    aiInterpretation: themeInsight.aiInterpretation,
    productHypothesisPreview: themeInsight.productHypothesis,
    keywords
  };
}

export function analyzeDatasetConversation(raw: RawConversation): AnalyzedConversation {
  // Preserve the deterministic template mapping for the curated demo dataset;
  // uploaded datasets go through the general-purpose heuristic analyser.
  return raw._templateIndex !== undefined ? analyzeDemoConversation(raw) : heuristicAnalyzeConversation(raw);
}

export const THEME_INSIGHTS: Record<
  FrictionTheme,
  {
    whyThisMatters: string;
    observedEvidenceSummary: string;
    aiInterpretation: string;
    productHypothesis: string;
  }
> = {
  'Price Hesitation': {
    whyThisMatters: 'Users are expressing high product interest but delaying purchase because they expect an impending sale or price drop.',
    observedEvidenceSummary: 'Customers repeatedly state they have wishlisted or carted garments but are waiting for major promotional events (EORS, Big Fashion Festival, bank discount cards, or clearance sales) before transacting.',
    aiInterpretation: 'The wishlist functions as a "price monitoring vault" rather than an immediate conversion step. Regular deep discounting has trained users to anchor on sale prices, causing high friction during full-price periods.',
    productHypothesis: 'If Myntra provides a transparent "Price Drop Guarantee" and "Smart Target Price" alert inside the wishlist, high-intent shoppers will convert earlier without waiting indefinitely for seasonal sales.'
  },
  'Fit & Sizing': {
    whyThisMatters: 'Users hesitate to pull the trigger because sizing charts differ unpredictably across brands and return overhead is feared.',
    observedEvidenceSummary: 'Shoppers report uncertainty around shoulder widths, bust fit, waist-to-hip ratios, and trouser inseams. Many wishlisted items are stalled because reviews conflict on whether the item runs large or small.',
    aiInterpretation: 'Fit ambiguity creates acute cognitive friction. Even with free returns, the logistics of repackaging, waiting for courier pickups, and delayed refunds dissuade purchase completion.',
    productHypothesis: 'If Myntra introduces a "Find Your Twin" body silhouette matcher and crowd-verified fit accuracy gauge on PDP & wishlist, sizing uncertainty will drop by over 20%.'
  },
  'Social Validation': {
    whyThisMatters: 'Shoppers desire statement or ethnic fashion pieces but hesitate due to social risk or self-consciousness about style appropriateness.',
    observedEvidenceSummary: 'Users share links to friends, Reddit threads, and family WhatsApp groups asking "is this too loud?", "can I wear this to an office party?", or "how do I style this lehenga?".',
    aiInterpretation: 'Fashion purchases carry high interpersonal evaluation risk. When shoppers lack quick peer consensus, the garment sits in the wishlist until the social occasion passes.',
    productHypothesis: 'If Myntra offers a 1-tap "Ask Friends / WhatsApp Poll" voting card with instant peer tallying, social hesitation will convert into communal purchasing momentum.'
  },
  'Quality & Trust': {
    whyThisMatters: 'Shoppers are drawn to studio catalog photos but doubt the tactile material quality, synthetic blend ratio, or wash durability.',
    observedEvidenceSummary: 'Reviews and discussions frequently mention fear of 100% polyester masquerading as breathable fabric, loose stitching, color bleeding during washing, or cheap plastic buttons.',
    aiInterpretation: 'Digital photography masks tactile sensory attributes. Shoppers project negative historical experiences onto current wishlist items when fabric specs are opaque.',
    productHypothesis: 'If Myntra displays a verified "Tactile Fabric Quality Score" (breathability index, wrinkle score, wash-tested color retention) alongside customer video close-ups, fabric skepticism will decline.'
  },
  'Comparison & Choice Overload': {
    whyThisMatters: 'Users hoard 10+ similar items in their wishlist, creating cognitive fatigue and decision paralysis.',
    observedEvidenceSummary: 'Shoppers save multiple nearly identical floral dresses, white sneakers, or black kurtas across brands and end up buying none because distinguishing key trade-offs is tedious.',
    aiInterpretation: 'Choice overload turns the wishlist into a graveyard. Without structured side-by-side differentiators, cognitive fatigue leads to cart abandonment.',
    productHypothesis: 'If Myntra provides an automated "Compare Top 3" matrix highlighting price-per-wear, fabric composition, and review ratings, choice paralysis will turn into decisive checkouts.'
  },
  'Timing & Need': {
    whyThisMatters: 'Users bookmark aspirational outfits for future events (weddings, vacations, winter) without immediate urgency to buy today.',
    observedEvidenceSummary: 'Discussions show shoppers saving heavy woolens in early autumn or bridal lehengas 3 months before an event, stalling purchase until external triggers arrive.',
    aiInterpretation: 'Aspirational wishlisting acts as visual moodboarding. Purchase intent remains dormant until calendar milestones or seasonal temperature drops force action.',
    productHypothesis: 'If Myntra introduces "Occasion Date Tagging" with automated 14-day milestone reminders and stock reservation holds, dormant interest will reactivate on schedule.'
  },
  'Delivery / Returns / Convenience': {
    whyThisMatters: 'Late-funnel dropoffs spike when users encounter unexpected convenience fees or delivery dates after their target event.',
    observedEvidenceSummary: 'Users express intense frustration with ₹20 convenience fees, ₹50-₹100 return pickup fees on clearance items, or unexpected delivery date pushes at payment screens.',
    aiInterpretation: 'Unexpected micro-fees introduced at the final payment step trigger cognitive reactance ("drip pricing penalty"), inducing abrupt abandonment even among high-intent shoppers.',
    productHypothesis: 'If Myntra enforces 100% upfront fee transparency and adds an "Event Delivery Guarantee" badge, last-mile transaction abandonment will drop significantly.'
  }
};

export function computeDatasetStats(analyzed: AnalyzedConversation[]): DatasetStats {
  const totalConversations = analyzed.length;
  const relevantList = analyzed.filter(c => c.isRelevant && c.frictionTheme !== null);
  const purchaseRelevant = relevantList.length;
  const purchaseRelevantPercent = totalConversations > 0
    ? Math.round((purchaseRelevant / totalConversations) * 1000) / 10
    : 0;

  const sourceCounts: Record<SourceType, number> = {
    Reddit: 0,
    YouTube: 0,
    'Google Play': 0,
    'App Store': 0
  };

  const themeCounts: Record<FrictionTheme, number> = {
    'Price Hesitation': 0,
    'Fit & Sizing': 0,
    'Quality & Trust': 0,
    'Social Validation': 0,
    'Comparison & Choice Overload': 0,
    'Timing & Need': 0,
    'Delivery / Returns / Convenience': 0
  };

  const categoryCounts: Record<ProductCategory, number> = {
    'Ethnic Wear & Kurtas': 0,
    'Western Wear & Dresses': 0,
    'Footwear & Sneakers': 0,
    'Denim & Trousers': 0,
    'Winterwear & Jackets': 0,
    'Athleisure & Activewear': 0,
    'Handbags & Accessories': 0,
    'Formal & Suits': 0
  };

  const intentCounts: Record<PurchaseIntent, number> = {
    High: 0,
    Medium: 0,
    Low: 0,
    None: 0
  };

  let earliestDate = '9999-99-99';
  let latestDate = '0000-00-00';

  for (const item of analyzed) {
    if (item.source && sourceCounts[item.source] !== undefined) {
      sourceCounts[item.source]++;
    }
    if (item.productCategory && categoryCounts[item.productCategory] !== undefined) {
      categoryCounts[item.productCategory]++;
    }
    if (item.purchaseIntent && intentCounts[item.purchaseIntent] !== undefined) {
      intentCounts[item.purchaseIntent]++;
    }
    if (item.frictionTheme && themeCounts[item.frictionTheme] !== undefined) {
      themeCounts[item.frictionTheme]++;
    }
    if (item.date) {
      if (item.date < earliestDate) earliestDate = item.date;
      if (item.date > latestDate) latestDate = item.date;
    }
  }

  const themePercentages: Record<FrictionTheme, number> = {
    'Price Hesitation': 0,
    'Fit & Sizing': 0,
    'Quality & Trust': 0,
    'Social Validation': 0,
    'Comparison & Choice Overload': 0,
    'Timing & Need': 0,
    'Delivery / Returns / Convenience': 0
  };

  for (const t of ALL_THEMES) {
    themePercentages[t] = purchaseRelevant > 0
      ? Math.round((themeCounts[t] / purchaseRelevant) * 1000) / 10
      : 0;
  }

  return {
    totalConversations,
    purchaseRelevant,
    purchaseRelevantPercent,
    sourceCounts,
    themeCounts,
    themePercentages,
    categoryCounts,
    intentCounts,
    dateRange: {
      start: earliestDate === '9999-99-99' ? '2026-05-01' : earliestDate,
      end: latestDate === '0000-00-00' ? '2026-08-14' : latestDate
    }
  };
}

export function computeThemeSummaries(analyzed: AnalyzedConversation[]): Record<FrictionTheme, FrictionThemeSummary> {
  const relevantList = analyzed.filter(c => c.isRelevant && c.frictionTheme !== null);
  const totalRelevant = relevantList.length || 1;

  const summaries = {} as Record<FrictionTheme, FrictionThemeSummary>;

  for (const theme of ALL_THEMES) {
    const items = relevantList.filter(c => c.frictionTheme === theme);
    const count = items.length;
    const percentage = Math.round((count / totalRelevant) * 1000) / 10;

    const sourceBreakdown: Record<SourceType, number> = {
      Reddit: 0,
      YouTube: 0,
      'Google Play': 0,
      'App Store': 0
    };

    const categoryBreakdown: Record<ProductCategory, number> = {
      'Ethnic Wear & Kurtas': 0,
      'Western Wear & Dresses': 0,
      'Footwear & Sneakers': 0,
      'Denim & Trousers': 0,
      'Winterwear & Jackets': 0,
      'Athleisure & Activewear': 0,
      'Handbags & Accessories': 0,
      'Formal & Suits': 0
    };

    let highCount = 0;
    let medCount = 0;
    let lowCount = 0;
    let confHighCount = 0;
    let confMedCount = 0;
    let confLowCount = 0;
    let totalConfScore = 0;

    for (const it of items) {
      if (sourceBreakdown[it.source] !== undefined) sourceBreakdown[it.source]++;
      if (categoryBreakdown[it.productCategory] !== undefined) categoryBreakdown[it.productCategory]++;
      if (it.purchaseIntent === 'High') highCount++;
      else if (it.purchaseIntent === 'Medium') medCount++;
      else lowCount++;

      if (it.confidence === 'High') confHighCount++;
      else if (it.confidence === 'Medium') confMedCount++;
      else confLowCount++;

      totalConfScore += it.confidenceScore || 92;
    }

    const avgConfidence = items.length > 0 ? Math.round(totalConfScore / items.length) : 92;

    const sampleQuotes = items.slice(0, 10).map(it => ({
      id: it.id,
      quote: it.extractedQuote || it.text,
      fullText: it.text,
      source: it.source,
      intent: it.purchaseIntent,
      confidence: it.confidence,
      confidenceScore: it.confidenceScore || 91,
      detectedSignal: it.detectedSignal || 'High purchase intent with delayed checkout',
      aiReasoning: it.aiReasoning || 'Explicit mention of interest paired with systemic hesitation barrier.',
      date: it.date,
      category: it.productCategory,
      interpretation: it.aiInterpretation
    }));

    const insights = THEME_INSIGHTS[theme] || {
      whyThisMatters: 'Users are expressing interest but delaying purchase due to frictional barriers.',
      observedEvidenceSummary: 'Conversations show high intent with recurring hesitation drivers.',
      aiInterpretation: 'Systemic friction prevents immediate checkout completion.',
      productHypothesis: 'Targeted product experiments can accelerate conversion velocity.'
    };

    summaries[theme] = {
      theme,
      count,
      percentage,
      avgConfidence,
      whyThisMatters: insights.whyThisMatters,
      observedEvidenceSummary: insights.observedEvidenceSummary,
      aiInterpretation: insights.aiInterpretation,
      productHypothesis: insights.productHypothesis,
      intentDistribution: {
        high: highCount,
        medium: medCount,
        low: lowCount
      },
      confidenceDistribution: {
        high: confHighCount,
        medium: confMedCount,
        low: confLowCount
      },
      sampleQuotes,
      sourceBreakdown,
      categoryBreakdown
    };
  }

  return summaries;
}

export interface CSVValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  parsedData: RawConversation[];
}

export function validateAndParseCSV(csvText: string): CSVValidationResult {
  const result: CSVValidationResult = {
    valid: false,
    errors: [],
    warnings: [],
    parsedData: []
  };

  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false
  });

  if (parsed.errors && parsed.errors.length > 0) {
    result.errors.push(...parsed.errors.map(e => `Row ${e.row}: ${e.message}`));
  }

  const fields = (parsed.meta.fields || []).map(f => f.trim().toLowerCase());
  const required = ['id', 'source', 'date', 'rating', 'title', 'text'];
  const missing = required.filter(r => !fields.includes(r));

  if (missing.length > 0) {
    result.errors.push(`Missing required columns: ${missing.join(', ')}. Found columns: ${(parsed.meta.fields || []).join(', ')}`);
    return result;
  }

  const rows = parsed.data as Record<string, string>[];
  if (rows.length === 0) {
    result.errors.push('CSV contains no data rows.');
    return result;
  }

  const validSources: Record<string, SourceType> = {
    reddit: 'Reddit',
    youtube: 'YouTube',
    'google play': 'Google Play',
    googleplay: 'Google Play',
    playstore: 'Google Play',
    'app store': 'App Store',
    appstore: 'App Store',
    apple: 'App Store'
  };

  const validCategories: Record<string, ProductCategory> = {
    ethnic: 'Ethnic Wear & Kurtas',
    kurtas: 'Ethnic Wear & Kurtas',
    western: 'Western Wear & Dresses',
    dresses: 'Western Wear & Dresses',
    footwear: 'Footwear & Sneakers',
    sneakers: 'Footwear & Sneakers',
    shoes: 'Footwear & Sneakers',
    denim: 'Denim & Trousers',
    jeans: 'Denim & Trousers',
    winterwear: 'Winterwear & Jackets',
    jackets: 'Winterwear & Jackets',
    athleisure: 'Athleisure & Activewear',
    activewear: 'Athleisure & Activewear',
    handbags: 'Handbags & Accessories',
    accessories: 'Handbags & Accessories',
    formal: 'Formal & Suits',
    suits: 'Formal & Suits'
  };

  const cleanRecords: RawConversation[] = [];

  rows.forEach((row, index) => {
    const rawId = row.id || row.ID || `CUSTOM-${index + 1}`;
    const rawSource = (row.source || row.Source || 'Reddit').trim().toLowerCase();
    const matchedSource: SourceType = validSources[rawSource] || 'Reddit';

    const rawDate = row.date || row.Date || '2026-08-01';
    const rawRating = row.rating ? parseFloat(row.rating) : undefined;
    const rawTitle = row.title || row.Title || 'Consumer discussion';
    const rawText = row.text || row.Text || row.comment || '';

    if (!rawText.trim()) {
      result.warnings.push(`Row ${index + 1}: empty text field skipped.`);
      return;
    }

    const rawCategory = (row.productcategory || row.category || row.ProductCategory || '').trim().toLowerCase();
    let matchedCategory: ProductCategory = 'Ethnic Wear & Kurtas';
    for (const [key, val] of Object.entries(validCategories)) {
      if (rawCategory.includes(key)) {
        matchedCategory = val;
        break;
      }
    }

    cleanRecords.push({
      id: rawId,
      source: matchedSource,
      date: rawDate,
      rating: isNaN(rawRating as number) ? undefined : rawRating,
      title: rawTitle,
      text: rawText,
      productCategory: matchedCategory
    });
  });

  if (cleanRecords.length === 0) {
    result.errors.push('No valid conversation records could be processed from this file.');
    return result;
  }

  result.valid = true;
  result.parsedData = cleanRecords;
  return result;
}

export function exportDatasetToCSV(dataset: AnalyzedConversation[]): string {
  const exportData = dataset.map(d => ({
    id: d.id,
    source: d.source,
    date: d.date,
    rating: d.rating ?? '',
    title: d.title,
    text: d.text,
    productCategory: d.productCategory,
    isRelevant: d.isRelevant ? 'Yes' : 'No',
    purchaseIntent: d.purchaseIntent,
    frictionTheme: d.frictionTheme || 'N/A',
    confidence: d.confidence,
    extractedQuote: d.extractedQuote,
    aiInterpretation: d.aiInterpretation
  }));

  return Papa.unparse(exportData);
}
