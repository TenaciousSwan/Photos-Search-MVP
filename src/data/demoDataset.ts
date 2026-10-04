import { RawConversation, AnalyzedConversation, FrictionTheme, PurchaseIntent, ConfidenceLevel, ProductCategory, SourceType } from '../types';

// Realistic text corpora representing authentic discussions across Reddit, YouTube, Google Play, and App Store
interface SnippetTemplate {
  title: string;
  texts: string[];
  theme: FrictionTheme | null;
  intent: PurchaseIntent;
  category: ProductCategory;
  source: SourceType;
  baseConfidence: ConfidenceLevel;
}

const TEMPLATES: SnippetTemplate[] = [
  // 1. PRICE HESITATION
  {
    title: 'Wishlisted but waiting for EORS or BFF sale',
    theme: 'Price Hesitation',
    intent: 'High',
    category: 'Ethnic Wear & Kurtas',
    source: 'Reddit',
    baseConfidence: 'High',
    texts: [
      'Added this Anouk silk blend kurta set to my wishlist 3 weeks ago at ₹2,499. Looks gorgeous but I know Myntra runs 50-70% off during the End of Reason Sale. Waiting for the price to drop below ₹1,400 before pulling the trigger.',
      'Have 8 ethnic sets saved in my wishlist for Diwali. The prices keep fluctuating by ₹200-300 every weekend. Not buying right now until the Grand Fashion Festival starts.',
      'Love the Libas embroidered anarkali in my bag. But ₹3,200 is steep when similar pieces drop to ₹1,800 during midnight flash sales. Setting a reminder to check price history.',
      'The kurta set is in my wishlist. Total bill with platform fee and taxes comes to ₹2,850. Waiting to see if any 10% HDFC bank offer gets activated next Friday.',
      'Wishlisted this W brand velvet kurta. Stunning color, but waiting to see if they give an extra ₹400 new season coupon.'
    ]
  },
  {
    title: 'Sneakers sitting in cart - too expensive at MRP',
    theme: 'Price Hesitation',
    intent: 'High',
    category: 'Footwear & Sneakers',
    source: 'Reddit',
    baseConfidence: 'High',
    texts: [
      'Have had the Nike Air Max in my wishlist for a month. ₹8,495 is just too much right now. Keeping an eye out for sneaker fest or coupon drop.',
      'The Puma suede classic is in my cart. Waiting for the price to drop back to ₹3,499 like it was during the last festival sale.',
      'Saved these Adidas Court sneakers in my wishlist. Really want them for college but hoping for at least 40% off before I checkout.',
      'Why did the price of these Asics running shoes jump from ₹4,200 to ₹5,999 in my wishlist overnight? Definitely waiting until it comes back down.',
      'Love the retro high-top sneakers on my wishlist. But ₹6,500 without no-cost EMI is making me hesitate.'
    ]
  },
  {
    title: 'YouTube Haul Comment: Dress is cute but overpriced',
    theme: 'Price Hesitation',
    intent: 'Medium',
    category: 'Western Wear & Dresses',
    source: 'YouTube',
    baseConfidence: 'High',
    texts: [
      'Saw this floral midi dress in your haul and instantly wishlisted it on Myntra! But ₹2,199 for polyester is too pricey. Waiting for it to go on 60% discount.',
      'Loved the blazer dress you showed from Mango on Myntra. It is sitting in my cart right now, waiting for the end of month payday discount.',
      'That lavender wrap dress looked so flattering on you! Saved to my Myntra wishlist, but at ₹1,899 I will wait for a weekend flash deal.',
      'Wishlisted the satin slip dress after watching your styling video. Just hoping it goes under ₹1,200 in the upcoming clearance sale.',
      'The trench coat you reviewed is in my saved items. ₹4,999 is out of my monthly clothing budget, fingers crossed for BFF sale.'
    ]
  },
  {
    title: 'Google Play Review: Wishlist price tracker needed',
    theme: 'Price Hesitation',
    intent: 'Medium',
    category: 'Denim & Trousers',
    source: 'Google Play',
    baseConfidence: 'High',
    texts: [
      'App is smooth, but I have 40+ items in wishlist. Prices change randomly without notifying me. I hesitate to buy because I feel like I might miss a lower price tomorrow.',
      'Please bring back genuine price drop alerts for wishlisted jeans. I keep waiting for Pepe Jeans to drop below 2k, but by the time I check, size is gone or price is high again.',
      'I always wishlist items and wait for coupons. But recently coupon discounts have become very deceptive with high minimum cart values, making me abandon my cart.',
      'Great collection of cargo pants, but having to manually check wishlist everyday to catch a 500 Rs discount is tiring. Hence I delay ordering.',
      'Added Levis 511 to wishlist. The price changed 4 times in one week! Makes me feel like I will overpay if I order today.'
    ]
  },

  // 2. FIT & SIZING
  {
    title: 'Confused between Size M and L on Ethnic Wear',
    theme: 'Fit & Sizing',
    intent: 'High',
    category: 'Ethnic Wear & Kurtas',
    source: 'Reddit',
    baseConfidence: 'High',
    texts: [
      'I have this Biba kurta set in my wishlist, but the size chart is confusing. Bust measurement says 38 for M, but customer reviews say it runs very tight on the shoulders. Scared to order M or L.',
      'Wishlisted an Aurelia festive kurti. Some reviews say size up, others say it is true to size. I hate the hassle of exchanging so I am just keeping it saved for now.',
      'Really want this straight kurta, but I am pear shaped (36 bust, 42 hip). The size chart only gives bust measurements. Hesitating to buy without hip circumference details.',
      'Added a Chikankari kurta to wishlist. Will it shrink after first wash? If it shrinks, M will become too tight, but L might look like a sack.',
      'The model is 5ft 8in wearing S, I am 5ft 2in. In the wishlist photo it looks calf length, on me it will probably drag on the floor. Waiting to see if petite sizes arrive.'
    ]
  },
  {
    title: 'Jeans waist vs thigh fit dilemma',
    theme: 'Fit & Sizing',
    intent: 'High',
    category: 'Denim & Trousers',
    source: 'Reddit',
    baseConfidence: 'High',
    texts: [
      'Wishlisted these high-waisted wide leg jeans from Roadster. I have a 28 inch waist and 38 inch hips. Standard size charts never fit my waist without gaping at the back.',
      'Have these Zara dupes in my cart. Reviews mention zero stretch in the denim fabric. Really worried my regular size 30 won’t pull over my thighs.',
      'Added flared trousers to wishlist for office wear. Inseam length is not mentioned anywhere on the product page. At 5ft 3in, will I need to get it tailored immediately?',
      'Saved these mom fit jeans. Size 32 in Levi’s fits me well, but does Roadster run smaller? That’s the only reason I haven’t clicked buy yet.',
      'Love the tailored linen trousers in my wishlist. But without knowing thigh circumference measurements, I am terrified of getting stuck with tight pants.'
    ]
  },
  {
    title: 'Footwear sizing inconsistency between brands',
    theme: 'Fit & Sizing',
    intent: 'High',
    category: 'Footwear & Sneakers',
    source: 'App Store',
    baseConfidence: 'High',
    texts: [
      'I want to order these block heels on my wishlist for a wedding, but UK 6 in Carlton London was huge on me last time, while UK 6 in Metro was tight. Sizing across brands on Myntra is unpredictable.',
      'Saved Puma sneakers in wishlist. UK 8 in Nike fits me, but people in reviews are saying Puma runs half a size smaller. Can Myntra add standard foot length in cm for each shoe?',
      'Have loafers in my cart. I have wide feet and the product description doesn’t state if the toe box is narrow or wide fit. Hesitating to buy.',
      'The strappy flats in my wishlist look so chic, but with flat feet I worry the strap placement will cause blisters. Wish there was better fit feedback.',
      'Wishlisted Chelsea boots. Confused whether to order one size up to accommodate thick winter socks.'
    ]
  },
  {
    title: 'YouTube Review: Top looks loose around armholes',
    theme: 'Fit & Sizing',
    intent: 'Medium',
    category: 'Western Wear & Dresses',
    source: 'YouTube',
    baseConfidence: 'High',
    texts: [
      'I saw that crop top in your video and saved it on Myntra. But like you mentioned, the armholes look gaping and deep. Hesitating whether XS will fix it or be too tight on chest.',
      'Wishlisted the bodycon dress from your haul. You mentioned the fabric has barely 2% elastane. If it doesn’t stretch, sitting down in size S will be painful!',
      'Loved the oversized boyfriend blazer in your Myntra try-on! But on a petite frame, will S look stylish or completely drown me?',
      'The square neck top is in my wishlist. Watching your try-on made me realize the neckline might dip too low for casual wear.',
      'Saved the wrap maxi dress on Myntra. Is the chest overlap stitched or open? Scared of wardrobe malfunction without safety pins.'
    ]
  },

  // 3. QUALITY & TRUST
  {
    title: 'Worried about cheap see-through polyester fabric',
    theme: 'Quality & Trust',
    intent: 'High',
    category: 'Western Wear & Dresses',
    source: 'Reddit',
    baseConfidence: 'High',
    texts: [
      'Found this beautiful white linen-look shirt on Myntra for ₹1,299. It’s in my wishlist, but description says 100% polyester. Terrified it will feel like plastic in humid weather.',
      'Have a printed maxi dress in my cart. The studio photos look luxurious with satin sheen, but one customer uploaded a photo where the print looks faded and cheap.',
      'Wishlisted this pastel co-ord set. I love the cut, but previous items from this private label started pilling after just 2 delicate washes.',
      'The satin shirt in my wishlist looks so classy in catalog photos. But is it breathable or sweat-inducing synthetic? Still hesitating to order.',
      'Saved a blazer dress. Reviews say the inner lining is scratchy and buttons feel loose. Not sure if it justifies ₹3,000.'
    ]
  },
  {
    title: 'Color bleeding and fabric shrinkage doubts',
    theme: 'Quality & Trust',
    intent: 'Medium',
    category: 'Ethnic Wear & Kurtas',
    source: 'Google Play',
    baseConfidence: 'High',
    texts: [
      'Added an indigo block print kurta to wishlist. Many reviews on similar cotton kurtas say the dark dye bleeds terribly and stains other clothes. Reluctant to checkout.',
      'The maroon velvet lehenga choli is saved in my wishlist for my cousin’s sangeet. Is the zari work real embroidery or cheap glitter paste that falls off?',
      'Wishlisted a handloom pure cotton kurta. Description says dry clean only, but reviewer says fabric became rough like jute after first wear.',
      'Love the tie-dye co-ord set in my bag. But with no real user photos on the product page, I have trust issues with the fabric quality.',
      'The raw silk kurta on my wishlist looks vibrant online. But past experience with that seller resulted in receiving a dull, synthetic duplicate.'
    ]
  },
  {
    title: 'Stitching and finish on winter jackets',
    theme: 'Quality & Trust',
    intent: 'High',
    category: 'Winterwear & Jackets',
    source: 'YouTube',
    baseConfidence: 'High',
    texts: [
      'Saw this puffer jacket in your winter haul and immediately wishlisted it on Myntra. But you said the zipper snagged twice. At ₹3,500, broken zippers are a dealbreaker.',
      'Saved the wool-blend overcoat in my cart. The studio images show sharp lapels, but I worry about the stitching quality and shoulder padding collapsing.',
      'Wishlisted the faux leather biker jacket. Will the PU leather peel off after one season? That’s what keeps holding me back from buying.',
      'The fleece hoodie is in my wishlist. Is the inner lining genuine warm sherpa or just thin fuzzy polyester that sheds lint everywhere?',
      'Saved the bomber jacket. Product page has 4.2 stars but 3 recent 1-star reviews complain about loose seams near the pocket.'
    ]
  },

  // 4. SOCIAL VALIDATION
  {
    title: 'Need second opinion on bold color and styling',
    theme: 'Social Validation',
    intent: 'High',
    category: 'Western Wear & Dresses',
    source: 'Reddit',
    baseConfidence: 'High',
    texts: [
      'Saved this neon lime green blazer dress in my wishlist for my 25th birthday dinner. I love it, but sent screenshots to my group chat and two friends said it looks too loud. Still deciding!',
      'Have this metallic silver pleated skirt in my cart. Really want to rock it for New Year’s Eve, but wondering if it is too flashy or if I can pull it off.',
      'Wishlisted an oversized graphic varsity jacket. I’m 31 and work in a semi-corporate agency. Will people at work judge it as trying too hard?',
      'Love this corset top on Myntra, but waiting for my sister to see the link and tell me if it suits my body type before I pay.',
      'The cowl neck emerald dress is sitting in my wishlist. Need fashion subreddit advice on how to accessorize it before buying.'
    ]
  },
  {
    title: 'Is this ethnic outfit appropriate for a formal office Diwali party?',
    theme: 'Social Validation',
    intent: 'Medium',
    category: 'Ethnic Wear & Kurtas',
    source: 'Reddit',
    baseConfidence: 'High',
    texts: [
      'Wishlisted this mirror-work sharara suit for the office ethnic day. It looks stunning, but I am worried it might be too festive/bridal for a corporate workplace.',
      'Have a pastel mint green kurta pajama set in my cart for a college friend’s engagement. Want to make sure it doesn’t look too plain compared to other guests.',
      'Saved this trendy asymmetric Indo-western tunic. Waiting to ask my colleagues what they are planning to wear so I don’t stand out awkwardly.',
      'Wishlisted a bandhani print draped saree gown. Love the concept, but want to check if people think pre-stitched sarees look authentic or tacky.',
      'Added a velvet Nehru jacket to wishlist for winter wedding reception. Seeking Reddit opinion on whether navy or wine red looks more royal.'
    ]
  },
  {
    title: 'YouTube Comment: How would you style these chunky sneakers?',
    theme: 'Social Validation',
    intent: 'Medium',
    category: 'Footwear & Sneakers',
    source: 'YouTube',
    baseConfidence: 'High',
    texts: [
      'I have those exact dad sneakers wishlisted on Myntra right now! But I have no idea how to style them without looking bulky. Waiting for your lookbook video before buying.',
      'Saved the chunky platform loafers in my cart. My mom thinks they look like school shoes lol. Need styling validation!',
      'Wishlisted the metallic boots from your reel. What bags and jackets go with them? Hesitating to buy without an outfit blueprint.',
      'Love the knee-high suede boots in my wishlist, but living in Mumbai, will people think I am crazy wearing them in December?',
      'The neon accent running shoes are in my cart. Want to know if they look cool for casual streetwear or strictly for the gym.'
    ]
  },

  // 5. COMPARISON & CHOICE OVERLOAD
  {
    title: 'Wishlisted 14 similar black dresses and can’t choose',
    theme: 'Comparison & Choice Overload',
    intent: 'High',
    category: 'Western Wear & Dresses',
    source: 'Reddit',
    baseConfidence: 'High',
    texts: [
      'My Myntra wishlist currently has 14 different Little Black Dresses from Mango, Forever New, Vero Moda, and Tokyo Talkies. They all look so similar and I am paralyzed by choice. Haven’t bought any!',
      'Saved 8 different beige trench coats across 4 brands on Myntra. Every time I open the app to buy one, I get overwhelmed comparing fabric blends and close the app.',
      'I have 10 floral summer dresses in my wishlist. Wish there was a side-by-side compare feature in Myntra app to compare length, fabric, and ratings directly.',
      'Wishlisted identical white sneakers from Puma, Red Tape, and HRX. Price difference is only ₹400. Spent 2 hours reading reviews and ended up not ordering anything.',
      'Added 6 olive green utility jackets to my wishlist. Why are there so many duplicate listings with slight shade variations? Total analysis paralysis.'
    ]
  },
  {
    title: 'Comparing price and delivery with Ajio, Zara, and Amazon',
    theme: 'Comparison & Choice Overload',
    intent: 'High',
    category: 'Denim & Trousers',
    source: 'App Store',
    baseConfidence: 'High',
    texts: [
      'Have Levi’s 501 jeans in my Myntra wishlist at ₹3,199. Saw the same pair on Ajio for ₹2,999 with coupon, but Myntra delivery is faster. Still debating where to order from.',
      'Saved a Vero Moda shirt on Myntra. Checking if it is cheaper on Tata Cliq or the official brand website before hitting checkout.',
      'Wishlisted cargo joggers on Myntra, but Amazon has a similar unbranded one for half the price with Prime delivery. Hard to decide if brand quality is worth double.',
      'Have a Tommy Hilfiger polo in wishlist. Comparing if airport duty-free or Myntra sale is a better deal.',
      'I keep wishlisting items on Myntra and then reverse-image searching on Meesho and Ajio to find cheaper dupes.'
    ]
  },
  {
    title: 'Too many brand variants of straight fit kurtas',
    theme: 'Comparison & Choice Overload',
    intent: 'Medium',
    category: 'Ethnic Wear & Kurtas',
    source: 'Google Play',
    baseConfidence: 'High',
    texts: [
      'My wishlist is full of 25 yellow haldi kurtas. When I search for haldi wear, 5,000 results pop up and I just save everything. Now I can’t decide which one to actually buy.',
      'App UI makes it so easy to heart/wishlist 50 items, but gives zero tools to filter or rank my wishlist when I actually have budget to purchase.',
      'Wishlisted 7 Chikankari georgette kurtis from different sellers. Prices range from ₹899 to ₹2,499 with identical catalog photos. How am I supposed to know which one is genuine?',
      'Have 5 similar brown leather belts saved. Ended up abandoning the purchase because picking one felt like homework.',
      'Saved 12 oversized gym tees. So many micro-brands with identical mockup photos that I got tired of comparing.'
    ]
  },

  // 6. TIMING & NEED
  {
    title: 'Event is 6 weeks away - no urgency to buy yet',
    theme: 'Timing & Need',
    intent: 'Medium',
    category: 'Ethnic Wear & Kurtas',
    source: 'Reddit',
    baseConfidence: 'High',
    texts: [
      'Wishlisted a gorgeous pastel lehenga for a wedding happening in late November. It’s only September now, so I have plenty of time. Will buy closer to the date or during Diwali sale.',
      'Have formal blazers saved in my wishlist for campus placement interviews starting next semester. No need to spend money today when interviews are 2 months away.',
      'Saved a cocktail gown in wishlist for New Year’s party. Keeping it on my radar, but might wait to see if newer winter collections launch next month.',
      'Added vacation beachwear to wishlist for a Goa trip planned in February. Just bookmarking ideas for now.',
      'Wishlisted a heavy embroidered sherwani for my brother’s wedding next year. Checking trends first before committing.'
    ]
  },
  {
    title: 'Impulse wishlist addition during late night browsing',
    theme: 'Timing & Need',
    intent: 'Low',
    category: 'Western Wear & Dresses',
    source: 'YouTube',
    baseConfidence: 'Medium',
    texts: [
      'I randomly heart 30 items at 2 AM while scrolling Myntra in bed, including this backless satin dress. Realistically, I have nowhere to wear it, so it just lives in my wishlist forever lol.',
      'Wishlisted these 5-inch stilettos because they look aesthetic, but I work from home in pyjamas 5 days a week. Zero practical need to checkout.',
      'That faux fur coat you showed is so pretty! Added to Myntra wishlist, but living in Bangalore, I might wear it once a year on a weekend trip.',
      'Saved a sequin party jumpsuit. Love the vibe, but with no party on the calendar, can’t justify the purchase right now.',
      'Added hiking boots to my wishlist after watching a trekking vlog, but I don’t even have a trek planned. Will buy if a trip gets finalized.'
    ]
  },
  {
    title: 'Waiting for seasonal weather change',
    theme: 'Timing & Need',
    intent: 'Medium',
    category: 'Winterwear & Jackets',
    source: 'App Store',
    baseConfidence: 'High',
    texts: [
      'Wishlisted high-neck sweaters and thermal jackets in October. Waiting for Delhi winter to actually get chilly before spending ₹4,000 on woolens.',
      'Saved linen resort shirts in my wishlist during winter clearance. Will probably purchase in March when summer approaches.',
      'Have a waterproof rain jacket in wishlist. Will buy once monsoon season actually hits my city.',
      'Saved a trench coat for an upcoming Europe trip in spring. Still waiting for visa approval before buying the travel wardrobe.',
      'Wishlisted velvet festive shawls. Waiting for temperature to drop below 15 degrees.'
    ]
  },

  // 7. DELIVERY / RETURNS / CONVENIENCE
  {
    title: 'Convenience fee and return charges on checkout screen',
    theme: 'Delivery / Returns / Convenience',
    intent: 'High',
    category: 'Western Wear & Dresses',
    source: 'Google Play',
    baseConfidence: 'High',
    texts: [
      'I had 2 tops and a skirt in my cart from wishlist. Reached checkout and saw ₹20 convenience fee + ₹99 delivery fee + ₹49 platform fee. Got annoyed at the hidden charges and closed the app.',
      'Why is Myntra charging ₹50-₹100 return fee now on clearance items? I wishlisted this dress but because size is tricky, I hesitate to buy if returning it costs extra money.',
      'Added shoes to cart. Estimated delivery is showing 8-10 days to my tier-2 city. By that time the event will be over, so I cancelled checkout.',
      'The kurta in my wishlist is marked as "Non-Returnable / Exchange Only". For an unbranded ethnic item, buying without return safety is too risky.',
      'Wishlisted items are from 3 different sellers, so Myntra is splitting into 3 deliveries with separate packaging fees. Makes no sense.'
    ]
  },
  {
    title: 'App Store Review: Delivery date after wedding date',
    theme: 'Delivery / Returns / Convenience',
    intent: 'High',
    category: 'Ethnic Wear & Kurtas',
    source: 'App Store',
    baseConfidence: 'High',
    texts: [
      'Wanted this lehenga choli for Sangeet on Friday. Delivery date promised was Thursday, but at final payment screen it changed to Saturday! Left it in my cart and bought offline from local market instead.',
      'Doorstep try-and-buy used to be Myntra’s best feature for wishlisted clothes. Now that it is discontinued in my area, I hesitate to order multiple sizes.',
      'I wanted to use Cash on Delivery for a high-value silk saree in my wishlist, but COD option was disabled at checkout for my pincode. Reluctant to prepay.',
      'Saved a designer blazer in wishlist. Reviews say return pick-up agent took 12 days to come for inspection. Can’t risk blocking ₹6,000 in return refunds.',
      'Wishlisted formal pants. Delivery requires OTP verification during office hours when I am not at home. Wish they had locker drop-off.'
    ]
  },
  {
    title: 'Reddit: Delivery delays and courier issues on sale orders',
    theme: 'Delivery / Returns / Convenience',
    intent: 'Medium',
    category: 'Footwear & Sneakers',
    source: 'Reddit',
    baseConfidence: 'High',
    texts: [
      'Have sneakers in my wishlist. Last time during Myntra sale, courier partner marked "customer unavailable" without even calling. Hesitating to order online again.',
      'Wishlisted a birthday gift for my partner. Express 1-day delivery is not available for this item even though it’s Myntra Assured. Holding off.',
      'The handbag I saved has a warning: "Delivered in 7-10 business days". Need it for next weekend so might have to look elsewhere.',
      'Saved an athleisure tracksuit in cart. Reluctant to order because previous courier delivery box arrived completely crushed and opened.',
      'Wishlisted gym shoes. Would have bought immediately if store pickup from nearby Myntra partner store was an option.'
    ]
  },

  // 8. NON-RELEVANT / GENERAL / CASUAL (to ensure realistic noise filtering)
  {
    title: 'General app feedback / unrelated discussion',
    theme: null,
    intent: 'None',
    category: 'Western Wear & Dresses',
    source: 'Google Play',
    baseConfidence: 'High',
    texts: [
      'Myntra app crashed when I tried to update my profile picture. Please fix this bug in the next update.',
      'Can you add dark mode to the Android app? The white background hurts my eyes while browsing late at night.',
      'Customer care executive was very polite when I called about an old refund from last month.',
      'Great UI design, the app looks modern and animations are smooth.',
      'Please bring more regional language support in customer support chatbot.'
    ]
  },
  {
    title: 'General fashion chat without purchase intent',
    theme: null,
    intent: 'None',
    category: 'Ethnic Wear & Kurtas',
    source: 'YouTube',
    baseConfidence: 'High',
    texts: [
      'You look so pretty in this video! Love your makeup and hair tutorial as always!',
      'What camera and lens do you use for your fashion haul lighting? The quality is crisp!',
      'Can you do a college budget outfit video under ₹500 next week?',
      'Subscribe to my channel for weekly lifestyle and makeup vlog updates!',
      'Which city are you currently based in? Loved the background aesthetic.'
    ]
  }
];

// Helper to deterministically generate realistic variations to reach ~1,248 dataset records
export function generateDemoDataset(targetCount: number = 1248): RawConversation[] {
  const records: RawConversation[] = [];
  const startTimestamp = new Date('2026-05-01T08:00:00Z').getTime();
  const endTimestamp = new Date('2026-08-14T20:00:00Z').getTime();
  const timeSpan = endTimestamp - startTimestamp;

  const brands = [
    'Anouk', 'Libas', 'Roadster', 'HRX', 'Mango', 'Vero Moda', 'H&M', 'Zara',
    'Levis', 'Puma', 'Nike', 'Adidas', 'Carlton London', 'Metro', 'W for Woman',
    'Biba', 'Forever New', 'Mast & Harbour', 'DressBerry', 'FabIndia', 'Taavi'
  ];

  const subreddits = [
    'r/IndianFashionAddicts', 'r/TwoXIndia', 'r/DealsIndia', 'r/streetwearstartup',
    'r/IndianSkincareAddicts', 'r/Bangalore', 'r/delhi', 'r/Mumbai'
  ];

  let idCounter = 1001;

  // Generate records based on realistic proportion distribution
  // We want Price (31%), Fit & Sizing (24%), Social Validation (17%), Quality & Trust (15%), Comparison (12%), Delivery (10%), Timing (9%), Irrelevant (~12%)
  
  while (records.length < targetCount) {
    for (let tplIdx = 0; tplIdx < TEMPLATES.length; tplIdx++) {
      const tpl = TEMPLATES[tplIdx];
      if (records.length >= targetCount) break;

      for (let textIdx = 0; textIdx < tpl.texts.length; textIdx++) {
        if (records.length >= targetCount) break;

        const baseText = tpl.texts[textIdx];
        const randomTime = new Date(startTimestamp + Math.floor((idCounter * 739391) % timeSpan));
        const dateStr = randomTime.toISOString().split('T')[0];

        // Add subtle natural variation if duplicating across loop cycles
        const cycle = Math.floor(records.length / 100);
        let finalTitle = tpl.title;
        let finalText = baseText;
        let rating = tpl.source.includes('Play') || tpl.source.includes('App') 
          ? (tpl.theme === 'Price Hesitation' ? 3 : tpl.theme === 'Delivery / Returns / Convenience' ? 2 : 3)
          : undefined;

        if (cycle > 0) {
          const brand = brands[(idCounter + cycle) % brands.length];
          finalText = baseText.replace(/Anouk|Libas|Roadster|Mango|Puma|Nike|Biba|Zara|Vero Moda|Aurelia|Carlton London/g, brand);
          if (tpl.source === 'Reddit') {
            finalTitle = `[${subreddits[idCounter % subreddits.length]}] ${tpl.title}`;
          }
        } else if (tpl.source === 'Reddit') {
          finalTitle = `[${subreddits[idCounter % subreddits.length]}] ${tpl.title}`;
        }

        records.push({
          id: `MYN-INTEL-${idCounter}`,
          source: tpl.source,
          date: dateStr,
          rating,
          title: finalTitle,
          text: finalText,
          productCategory: tpl.category,
          _templateIndex: tplIdx
        });

        idCounter++;
      }
    }
  }

  return records;
}

// Classifier & Extractor - Deterministic Analysis Layer (V1)
export function analyzeConversation(raw: RawConversation): AnalyzedConversation {
  // Use exact template mapping to guarantee 100% internal consistency across the evidence chain
  if (raw._templateIndex !== undefined && TEMPLATES[raw._templateIndex]) {
    const tpl = TEMPLATES[raw._templateIndex];
    
    if (tpl.theme === null) {
      return {
        ...raw,
        isRelevant: false,
        purchaseIntent: 'None',
        frictionTheme: null,
        confidence: 'High',
        confidenceScore: 92,
        detectedSignal: 'Non-purchase or operational feedback',
        aiReasoning: 'Signal does not contain fashion purchasing or wishlist hesitation intent.',
        extractedQuote: raw.text.slice(0, 100) + '...',
        aiInterpretation: 'General app support or casual chatter without active purchase evaluation.',
        productHypothesisPreview: 'Filter out from shopping friction analysis.',
        keywords: ['general-feedback', 'unrelated']
      };
    }

    let interpretation = '';
    let hypothesis = '';
    let keywords: string[] = [];
    let aiReasoning = '';
    let detectedSignal = 'Active Wishlist Intent (Item intentionally saved for deferred evaluation)';

    if (tpl.theme === 'Price Hesitation') {
      keywords = ['price-sensitivity', 'sale-waiting', 'deal-anchor'];
      interpretation = 'The shopper possesses clear product affinity (wishlisted/carted) but perceives the current price as temporary or uncompetitive, choosing to delay purchase until an anticipated promotional event.';
      hypothesis = 'Introducing transparent price-floor assurances, smart price-drop triggers, and personalized milestone coupons inside the wishlist could accelerate checkout velocity.';
      aiReasoning = 'Customer explicitly articulates purchase desire ("wishlisted", "in cart") paired with an explicit delay condition based on price, impending sale (EORS/BFF), or discount expectation.';
    } else if (tpl.theme === 'Fit & Sizing') {
      keywords = ['size-anxiety', 'dimension-uncertainty', 'fit-inconsistency'];
      interpretation = 'Customer wants the silhouette but suffers from sizing anxiety across diverse brand cut standards. The friction is fear of incorrect fit leading to return logistics.';
      hypothesis = 'Implementing multi-body model views, customer body-metric matching, and crowd-sourced sizing accuracy gauges on PDP & wishlist will alleviate fit ambiguity.';
      aiReasoning = 'Customer mentions body measurements, sizing chart ambiguity, or anxiety over incorrect garment dimensions across different brand cuts.';
    } else if (tpl.theme === 'Quality & Trust') {
      keywords = ['fabric-skepticism', 'material-transparency', 'durability-fear'];
      interpretation = 'Shopper is drawn to catalog photography but lacks confidence that physical material quality, fabric hand-feel, and durability match the visual presentation.';
      hypothesis = 'Adding verified video fabric close-ups, wash-durability ratings, and direct fiber transparency breakdown will convert material skeptics.';
      aiReasoning = 'Shopper highlights discrepancy between photographic presentation and physical material expectation (composition, wash durability, color bleed).';
    } else if (tpl.theme === 'Social Validation') {
      keywords = ['peer-approval', 'style-confidence', 'context-appropriateness'];
      interpretation = 'The user desires the garment but hesitates due to social risk or self-consciousness regarding how it will be perceived in specific social contexts.';
      hypothesis = 'Offering 1-click curated outfit pairings, community lookbook styling grids, and private "Ask Friends" collaborative wishlist polling can eliminate social hesitation.';
      aiReasoning = 'Customer seeks external reassurance regarding outfit styling appropriateness, peer validation, or occasion fit before committing.';
    } else if (tpl.theme === 'Comparison & Choice Overload') {
      keywords = ['choice-paralysis', 'multi-tab-comparing', 'feature-clutter'];
      interpretation = 'Excessive catalog variety and micro-variations without structured differentiators cause cognitive fatigue, stalling the decision into inactive wishlist hoarding.';
      hypothesis = 'Providing an in-wishlist side-by-side comparison matrix highlighting key trade-offs (fabric, rating, fit rating, price-per-wear) will resolve paralysis.';
      aiReasoning = 'Shopper expresses cognitive fatigue from hoarding multiple indistinguishable items in wishlist without clear differentiator attributes.';
    } else if (tpl.theme === 'Delivery / Returns / Convenience') {
      keywords = ['checkout-fee-shock', 'shipping-friction', 'return-policy-risk'];
      interpretation = 'Shopper experiences cart abandonment at the final mile due to unexpected micro-fees or restrictive post-purchase return/exchange friction.';
      hypothesis = 'Eliminating surprise fees via transparent all-inclusive pricing tiers and guaranteed 48-hour return concierge will prevent late-funnel dropoffs.';
      aiReasoning = 'Dropoff triggered by last-mile friction such as unexpected convenience fees, restrictive return terms, or event delivery timing misses.';
    } else {
      keywords = ['no-immediate-urgency', 'seasonal-waiting', 'event-anticipation'];
      interpretation = 'Wishlist item was added as aspirational intent or seasonal bookmarking, lacking immediate calendar urgency to compel immediate transaction.';
      hypothesis = 'Enabling calendar-linked "Occasion Reminders" and countdown reservation holds will trigger conversion when the target event approaches.';
      aiReasoning = 'Aspirational bookmarking or seasonal timing gap where transaction is postponed until situational need or calendar milestone arrives.';
    }

    // Extract cleanest punchy verbatim quote
    const sentences = raw.text.split(/(?<=[.?!])\s+/);
    const quote = sentences[0] || raw.text;

    return {
      ...raw,
      isRelevant: true,
      purchaseIntent: tpl.intent,
      frictionTheme: tpl.theme,
      confidence: tpl.baseConfidence,
      confidenceScore: 92, // Static mock for now
      detectedSignal,
      aiReasoning,
      extractedQuote: quote.trim(),
      aiInterpretation: interpretation,
      productHypothesisPreview: hypothesis,
      keywords
    };
  }

  // Fallback (should not be reached in demo)
  return {
    ...raw,
    isRelevant: false,
    purchaseIntent: 'None',
    frictionTheme: null,
    confidence: 'High',
    confidenceScore: 92,
    detectedSignal: 'Non-purchase or operational feedback',
    aiReasoning: 'Fallback',
    extractedQuote: raw.text,
    aiInterpretation: 'Fallback',
    productHypothesisPreview: 'Fallback',
    keywords: []
  };
}
