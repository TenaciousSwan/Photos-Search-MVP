import { ProductOpportunity, DetectiveFinding } from '../types';

export const INITIAL_OPPORTUNITIES: ProductOpportunity[] = [
  {
    id: 'OPP-001',
    friction: 'Price Hesitation',
    title: 'Wishlist Price-Drop Lock & Target Alert',
    userEvidenceSummary: 'Over 31% of analyzed conversations reveal users wishlisting items immediately upon high intent, but systematically pausing checkout to wait for EORS/BFF discount cycles or unpredictable weekend flash sales.',
    userEvidenceQuotes: [
      '“Added it to my wishlist but waiting for the sale.”',
      '“The kurta set is in my wishlist. Total bill comes to ₹2,850. Waiting to see if any 10% HDFC bank offer gets activated.”',
      '“Added Levis 511 to wishlist. The price changed 4 times in one week! Makes me feel like I will overpay if I order today.”'
    ],
    behaviouralInsight: 'Shoppers possess active purchase desire but experience "Price Regret Anxiety"—the fear of paying full price today only to see a 40% markdown within 10 days. The friction is loss aversion, not zero willingness to pay.',
    productHypothesis: 'If Myntra makes expected price changes more visible inside the wishlist experience, users who are already interested may have a stronger reason to return and purchase.',
    experiment: {
      title: 'Wishlist "Smart Price Target" vs Static Wishlist',
      description: 'A/B test enhanced wishlist price-drop notifications and target price threshold locks against the existing static wishlist experience.',
      variantA: 'Control: Standard static wishlist with generic fluctuating prices.',
      variantB: 'Variant: Wishlist card with "Set Price Target" + 14-Day Price Drop Guarantee badge.',
      targetAudience: 'Users with ≥3 items saved in wishlist for >7 days'
    },
    successMetric: 'Wishlist → Purchase Conversion Rate (+14% target)',
    secondaryMetrics: [
      'Notification click-through rate (+22%)',
      'Wishlist return rate (+18%)',
      'Purchase completion rate (+12%)'
    ],
    impact: 'High',
    confidence: 'High',
    effort: 'Medium',
    primaryKpi: 'Wishlist → Purchase Conversion Rate',
    iceScore: 8.7,
    status: 'Experiment Ready'
  },
  {
    id: 'OPP-002',
    friction: 'Fit & Sizing',
    title: 'Crowdsourced Sizing Accuracy & Multi-Body Model Matcher',
    userEvidenceSummary: '24% of shoppers express acute anxiety over brand sizing discrepancies (e.g. Roadster running small vs Zara running large) and unstandardized garment dimensions (bust-only charts with no hip or inseam specs).',
    userEvidenceQuotes: [
      '“Bust measurement says 38 for M, but customer reviews say it runs very tight on shoulders. Scared to order M or L.”',
      '“I have a 28 inch waist and 38 inch hips. Standard size charts never fit my waist without gaping at the back.”',
      '“Doorstep try-and-buy used to be best. Now that it is discontinued, I hesitate to order multiple sizes.”'
    ],
    behaviouralInsight: 'Users mentally calculate the friction cost of ordering the wrong size: return wait times, courier pickup delays, and blocked refund balances outweigh the emotional payoff of fast delivery.',
    productHypothesis: 'If Myntra provides a crowd-verified "Find Your Twin" body-silhouette matcher and verified measurement data on PDP & wishlist, sizing uncertainty will decrease significantly.',
    experiment: {
      title: 'FitMatch Verified Buyer Silhouette Slider on PDP',
      description: 'Test an interactive body-match profile comparing verified buyer reviews against standard tabular size charts.',
      variantA: 'Control: Standard tabular size chart with bust/waist inches.',
      variantB: 'Variant: Interactive 1-click Body Silhouette Matcher with "92% of buyers with your measurements chose Size M".',
      targetAudience: 'Top 50 high-return apparel categories (Kurtas, Denims, Dresses)'
    },
    successMetric: 'PDP → Checkout Completion Rate (+18% target)',
    secondaryMetrics: [
      'Size-related return rate (-22% reduction)',
      'PDP dwell time on size chart (+15%)',
      'Multi-size carting frequency (-30%)'
    ],
    impact: 'High',
    confidence: 'High',
    effort: 'Medium',
    primaryKpi: 'PDP → Checkout Completion Rate',
    iceScore: 8.5,
    status: 'In Prioritization'
  },
  {
    id: 'OPP-003',
    friction: 'Comparison & Choice Overload',
    title: 'Wishlist Side-by-Side Spec & Differentiator Matrix',
    userEvidenceSummary: 'Shoppers routinely hoard 10–20 nearly identical items (e.g. 14 black dresses, 8 beige trench coats) within their wishlist, suffering from choice paralysis and exiting the app without choosing one.',
    userEvidenceQuotes: [
      '“My Myntra wishlist currently has 14 different Little Black Dresses... paralyzed by choice. Haven’t bought any!”',
      '“Saved 8 different beige trench coats across 4 brands. Every time I open the app to buy, I get overwhelmed comparing fabric blends.”',
      '“Wishlisted identical white sneakers from Puma, Red Tape, and HRX. Spent 2 hours reading reviews and ended up not ordering anything.”'
    ],
    behaviouralInsight: 'Having too many indistinguishable good choices raises the cognitive load of decision-making (Hick’s Law). Users postpone the purchase to avoid making a sub-optimal choice.',
    productHypothesis: 'If Myntra introduces an automated "Compare Top 3" matrix highlighting key trade-offs in fabric, review ratings, and price-per-wear, users will overcome decision paralysis.',
    experiment: {
      title: 'Wishlist "Compare Top 3" Decision Engine',
      description: 'A/B test an in-wishlist comparison tool against an unorganized infinite scroll list.',
      variantA: 'Control: Infinite vertical scroll list of saved items.',
      variantB: 'Variant: Smart grouping pill ("You have 5 saved blazers — Compare Specs & Pick Best").',
      targetAudience: 'Shoppers with ≥4 items saved in identical sub-category'
    },
    successMetric: 'Single-Session Category Conversion (+11% target)',
    secondaryMetrics: [
      'Time to purchase decision (-40%)',
      'Wishlist purge / cleanup engagement (+25%)',
      'Cart add rate from comparison tool (+19%)'
    ],
    impact: 'High',
    confidence: 'Medium',
    effort: 'Low',
    primaryKpi: 'Single-Session Category Conversion',
    iceScore: 7.9,
    status: 'Proposed'
  },
  {
    id: 'OPP-004',
    friction: 'Social Validation',
    title: 'Wishlist "Ask Friends" Shared Polling Capsule',
    userEvidenceSummary: '18% of hesitation stems from shoppers needing external reassurance on bold colors, festive appropriateness, or styling versatility before committing.',
    userEvidenceQuotes: [
      '“Saved neon lime green blazer dress for my 25th birthday... sent screenshots to group chat and two friends said it looks too loud. Still deciding!”',
      '“Wishlisted mirror-work sharara suit... worried it might be too festive/bridal for a corporate workplace.”',
      '“I have those exact dad sneakers wishlisted... have no idea how to style them without looking bulky.”'
    ],
    behaviouralInsight: 'Fashion is an identity-driven purchase carrying social risk. Shoppers export screenshots to WhatsApp/Instagram to seek peer approval, breaking the checkout funnel.',
    productHypothesis: 'If Myntra creates an easy, private 1-tap WhatsApp voting card for wishlisted items, peer consensus will be reached faster and accelerate purchase completion.',
    experiment: {
      title: '1-Tap "Ask Friends" WhatsApp Wishlist Poll Card',
      description: 'A/B test collaborative voting cards against standard generic product link sharing.',
      variantA: 'Control: Standard generic product link share sheet.',
      variantB: 'Variant: "Get Friend Opinions" button creating an aesthetic voting card with live feedback tally.',
      targetAudience: 'Occasion & Party wear shoppers (Ethnic, Party Dresses, Footwear)'
    },
    successMetric: '48-Hour Wishlist Checkout Rate (+16% target)',
    secondaryMetrics: [
      'Poll generation rate per wishlist session (+14%)',
      'Referral viral visitor sessions (+8%)',
      'Repeat wishlist checkout velocity (+11%)'
    ],
    impact: 'Medium',
    confidence: 'High',
    effort: 'Medium',
    primaryKpi: '48-Hour Wishlist Checkout Rate',
    iceScore: 7.6,
    status: 'In Prioritization'
  },
  {
    id: 'OPP-005',
    friction: 'Quality & Trust',
    title: 'Fabric Hand-Feel Radar & 4K Macro Video Proofs',
    userEvidenceSummary: '15% of discussions express deep skepticism regarding synthetic fabric blends (polyester vs breathable cotton), color bleeding in wash, and discrepancy between studio lights and reality.',
    userEvidenceQuotes: [
      '“Found this beautiful white linen-look shirt for ₹1,299... description says 100% polyester. Terrified it will feel like plastic in humid weather.”',
      '“Studio photos look luxurious with satin sheen, but customer photo looks faded and cheap.”',
      '“Added an indigo block print kurta. Reviews on similar kurtas say dark dye bleeds terribly and stains other clothes.”'
    ],
    behaviouralInsight: 'Digital photos mask tactile sensory attributes. Shoppers project negative past experiences onto current items and delay buying when fabric composition is vague or deceptive.',
    productHypothesis: 'If Myntra replaces vague bullet points with an authenticated "Fabric Transparency Score" and short customer video clips, shopper trust and purchase readiness will rise.',
    experiment: {
      title: 'Tactile Fabric Quality Score & 10-Second Unfiltered Clip',
      description: 'Display an interactive Fabric Spec Badge on PDP & Wishlist preview with verified scores for Breathability, Texture Softness, and Stretchability.',
      variantA: 'Control: Traditional text specs list (Material: Cotton Blend).',
      variantB: 'Variant: Visual Fabric Radar chart + Customer Video Review Carousel.',
      targetAudience: 'Apparel with synthetic / blended fabric tags'
    },
    successMetric: 'PDP-to-Checkout Conversion Rate (+9% target)',
    secondaryMetrics: [
      'Fabric-related return rate (-15% reduction)',
      'Customer review rating score (+0.3 stars)',
      'Time spent reviewing garment details (+20%)'
    ],
    impact: 'Medium',
    confidence: 'High',
    effort: 'High',
    primaryKpi: 'PDP-to-Checkout Conversion Rate',
    iceScore: 7.2,
    status: 'Proposed'
  },
  {
    id: 'OPP-006',
    friction: 'Delivery / Returns / Convenience',
    title: 'Guaranteed Event-Date Delivery & Transparent Fee Breakdown',
    userEvidenceSummary: 'Late-funnel dropoffs spike when users encounter unexpected platform fees, high return fees on clearance items, or delivery dates falling after an upcoming festive/wedding event.',
    userEvidenceQuotes: [
      '“Reached checkout and saw ₹20 convenience fee + ₹99 delivery fee + ₹49 platform fee. Got annoyed and closed app.”',
      '“Wanted this lehenga for Sangeet on Friday. Delivery changed to Saturday at payment screen! Left it in cart.”',
      '“Why is Myntra charging ₹50-₹100 return fee now on clearance items? Because size is tricky, I hesitate to buy.”'
    ],
    behaviouralInsight: 'Unexpected micro-fees introduced at the final payment step trigger cognitive reactance ("drip pricing penalty"), inducing abrupt abandonment even among high-intent shoppers.',
    productHypothesis: 'If Myntra displays 100% all-inclusive pricing throughout the wishlist and offers an "Event Date Delivery Guarantee" badge, cart dropoffs will decrease.',
    experiment: {
      title: '"Event-Safe" Delivery Guarantee & Fee Transparency in Cart',
      description: 'Surface guaranteed delivery date countdown on the Wishlist card and bundle convenience fees upfront.',
      variantA: 'Control: Estimated delivery window with fees appended at payment step.',
      variantB: 'Variant: Upfront total price + "Guaranteed by [Date]" badge.',
      targetAudience: 'Tier 1 & Tier 2 shoppers ordering time-sensitive fashion'
    },
    successMetric: 'Cart-to-Payment Completion (+12% target)',
    secondaryMetrics: [
      'Payment step abandonment rate (-28%)',
      'Event-critical order volume (+15%)',
      'Customer support delivery escalation tickets (-18%)'
    ],
    impact: 'High',
    confidence: 'High',
    effort: 'High',
    primaryKpi: 'Cart-to-Payment Completion',
    iceScore: 8.1,
    status: 'Active Test'
  },
  {
    id: 'OPP-007',
    friction: 'Timing & Need',
    title: 'Occasion Calendar Sync & Automated Milestone Nudges',
    userEvidenceSummary: 'Users bookmark outfits for events 4–8 weeks in the future (weddings, vacations, seasonal weather changes) without immediate urgency to finalize the purchase.',
    userEvidenceQuotes: [
      '“Wishlisted a gorgeous pastel lehenga for a wedding happening in late November. It’s only September now... will buy closer to date.”',
      '“Wishlisted high-neck sweaters in October. Waiting for Delhi winter to actually get chilly before spending ₹4,000 on woolens.”',
      '“I randomly heart 30 items at 2 AM... realistically have nowhere to wear it, so it just lives in my wishlist forever.”'
    ],
    behaviouralInsight: 'Aspirational wishlisting acts as visual moodboarding. Intent is dormant until an external trigger (calendar date, weather drop, paycheck) activates situational urgency.',
    productHypothesis: 'If Myntra allows users to tag wishlisted items with an "Occasion Date" and delivers automated milestone reminders, dormant wishlists will reactivate.',
    experiment: {
      title: 'Wishlist "Occasion Planner" & 14-Day Delivery Reminder',
      description: 'Provide an option to tag wishlisted items: "Vacation", "Diwali / Wedding", or "Work". Trigger automated non-spammy stock alerts.',
      variantA: 'Control: Standard unorganized wishlist repository.',
      variantB: 'Variant: Occasion folders with smart milestone countdowns.',
      targetAudience: 'Users with wishlisted items untouched for >14 days'
    },
    successMetric: 'Reactivation Conversion on Saved Items (+15% target)',
    secondaryMetrics: [
      'Push notification open rate (+32%)',
      'Wishlist folder creation engagement (+24%)',
      'Occasion-tagged item checkout rate (+18%)'
    ],
    impact: 'Medium',
    confidence: 'Medium',
    effort: 'Low',
    primaryKpi: 'Reactivation Conversion on Saved Items',
    iceScore: 6.8,
    status: 'Proposed'
  }
];

export const PRIMARY_DETECTIVE_FINDING: DetectiveFinding = {
  headline: 'DETECTIVE FINDING',
  subheadline: 'Wishlist-to-Checkout Dropoff Diagnostic',
  keyVerdict: "Users aren't necessarily rejecting products. They're delaying the decision.",
  observedFacts: 'Analysis of 1,248 public-style consumer discussions reveals that 87% of shoppers who save or cart fashion items retain high to medium affinity for the garment. Inactivity between wishlisting and purchasing is concentrated in three primary hesitation themes: Price Hesitation (31.4%), Fit & Sizing (24.2%), and Social Validation (18.1%).',
  verbatimQuotes: [
    {
      quote: '“Added it to my wishlist but waiting for the sale.”',
      source: 'Reddit',
      category: 'Ethnic Wear & Kurtas',
      intent: 'High',
      date: '2026-06-18',
      confidenceScore: 95
    },
    {
      quote: '“Bust measurement says 38 for M, but customer reviews say it runs very tight on shoulders. Scared to order M or L.”',
      source: 'Reddit',
      category: 'Western Wear & Dresses',
      intent: 'High',
      date: '2026-07-02',
      confidenceScore: 94
    },
    {
      quote: '“Saved neon lime green blazer dress for my 25th birthday... sent screenshots to group chat and two friends said it looks too loud. Still deciding!”',
      source: 'YouTube',
      category: 'Western Wear & Dresses',
      intent: 'High',
      date: '2026-07-14',
      confidenceScore: 92
    }
  ],
  whatItCouldMean: 'In fashion e-commerce, the wishlist has evolved from a simple bookmarking bucket into a "Stalling Sandbox". Users stash items to hedge against loss while waiting for external clarity: an anticipated discount drop, crowd-reassurance on brand-specific fit metrics, or peer consensus from WhatsApp circles.',
  whatWeCouldTest: 'Deploying in-wishlist price drop assurances, crowd-verified body-silhouette matchers ("Find Your Twin"), and 1-tap WhatsApp friend poll cards will directly eliminate the three largest hesitation barriers and shorten the wishlist-to-checkout cycle.',
  strongestSignals: [
    {
      theme: 'Price Hesitation',
      rank: 1,
      percentage: 31.4,
      mentions: 386,
      topQuote: '“Added it to my wishlist but waiting for the sale.”',
      source: 'Reddit'
    },
    {
      theme: 'Fit & Sizing',
      rank: 2,
      percentage: 24.2,
      mentions: 298,
      topQuote: '“Bust measurement says 38 for M, but reviews say it runs tight on shoulders. Scared to order.”',
      source: 'Reddit'
    },
    {
      theme: 'Social Validation',
      rank: 3,
      percentage: 18.1,
      mentions: 223,
      topQuote: '“Sent screenshots to group chat and two friends said it looks too loud. Still deciding!”',
      source: 'YouTube'
    }
  ],
  evidenceSummary: '87% of customers retain high to medium affinity for the garment. Dropoff is rarely driven by product dislike; instead, it is driven by three distinct systemic friction barriers that incentivize postponement.',
  behavioralInsight: 'Shoppers hoard items in wishlists as a psychological buffer against decision regret, waiting for price drops or social validation.',
  cautionStatement: 'This is an observed correlation in public-style conversation data, not proof of causation.',
  researchLimitations: [
    'Current dataset is demo data created for product demonstration purposes.',
    'Public conversations on Reddit, YouTube, Google Play, and App Store may over-represent vocal or dissatisfied shoppers and may not reflect all Myntra user segments.',
    'Frequency of discussion does not automatically equal business impact or revenue loss.',
    'AI classification and sentiment extraction can contain errors or misattribute contextual nuance.',
    'Observed patterns represent correlations, not validated causal mechanics.',
    'Real product analytics (session funnels, transaction logs, live A/B testing) are required before making production investments.'
  ],
  coreRootCauses: [
    {
      title: '1. The Sale Anchor Dilemma (31.4% of dropoffs)',
      description: 'Shoppers are conditioned by seasonal mega-sales (EORS/BFF). The subjective value of buying immediately at MRP is overshadowed by the expected regret of missing an impending discount.',
      metric: '31.4% of total friction',
      quote: '“Added it to my wishlist but waiting for the sale.”',
      source: 'Reddit'
    },
    {
      title: '2. The Sizing Anxiety Paradox (24.2% of dropoffs)',
      description: 'Inconsistent brand sizing and inadequate measurement data (lack of hip, shoulder, and inseam depth) lead customers to fear the logistics overhead of returns more than they desire the garment.',
      metric: '24.2% of total friction',
      quote: '“Bust measurement says 38 for M, but reviews say it runs tight on shoulders. Scared to order.”',
      source: 'Reddit'
    },
    {
      title: '3. The Social Validation Gate (18.1% of dropoffs)',
      description: 'Shoppers export screenshots to WhatsApp/Instagram seeking peer approval on styling versatility and occasion appropriateness, creating cognitive latency in checkout.',
      metric: '18.1% of total friction',
      quote: '“Sent screenshots to group chat... still deciding if it looks too loud!”',
      source: 'YouTube'
    }
  ],
  recommendedActions: [
    {
      friction: 'Price Hesitation',
      action: 'Deploy "Smart Price Target" inside Wishlist with 14-Day Price Drop Guarantee.',
      expectedOutcome: '+14% Wishlist-to-Cart Conversion within 7 days.'
    },
    {
      friction: 'Fit & Sizing',
      action: 'Launch "Find Your Twin" crowdsourced body-measurement silhouette module.',
      expectedOutcome: '-22% size-driven returns and +18% PDP checkout confidence.'
    },
    {
      friction: 'Social Validation',
      action: 'Introduce 1-tap "Ask Friends" WhatsApp voting poll card.',
      expectedOutcome: '+16% 48-hour checkout velocity on occasion wear.'
    },
    {
      friction: 'Comparison & Choice Overload',
      action: 'Implement Wishlist "Compare Top 3" spec differentiator matrix.',
      expectedOutcome: '+11% single-session conversion on multi-item category folders.'
    }
  ]
};

