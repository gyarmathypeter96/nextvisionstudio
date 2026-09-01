export interface LandingCard {
  title: string;
  text: string;
}

export interface LandingProofItem extends LandingCard {
  tag: string;
  image?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface LandingFaqItem {
  question: string;
  answer: string;
}

export interface LandingPageData {
  slug: string;
  kind: "video" | "photo" | "web" | "social" | "ads";
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  headlineStart: string;
  headlineAccent: string;
  headlineEnd?: string;
  lead: string;
  heroImage?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  heroPoints: string[];
  ctaLabel: string;
  trustLine: string;
  problemKicker: string;
  problemTitle: string;
  problemText: string;
  outcomes: LandingCard[];
  deliverablesKicker: string;
  deliverablesTitle: string;
  deliverablesText: string;
  deliverables: LandingCard[];
  proofKicker: string;
  proofTitle: string;
  proofText: string;
  proofItems: LandingProofItem[];
  processTitle: string;
  processText: string;
  process: LandingCard[];
  decisionTitle: string;
  decisionText: string;
  relatedLinks: Array<{ label: string; href: string }>;
  formTitle: string;
  formText: string;
  formSubject: string;
  serviceType: string;
  schemaDescription: string;
  faq: LandingFaqItem[];
}

export const landingPages: Record<string, LandingPageData> = {
  videography: {
    slug: "videography-dublin",
    kind: "video",
    metaTitle: "Video Production Dublin for Businesses | NextVision Studio",
    metaDescription:
      "Video production in Dublin that helps businesses earn attention, explain their offer and create content that keeps working after the shoot.",
    eyebrow: "Video production Dublin",
    headlineStart: "Video production for",
    headlineAccent: "Dublin businesses",
    headlineEnd: "",
    lead:
      "One video is not a growth plan. We plan, film and edit content that helps people trust you, understand your offer and take the next step.",
    heroImage: {
      src: "/images/portfolio/JVA_WxYY3p0.webp",
      alt: "Professional event videography in Dublin by NextVision Studio",
      width: 640,
      height: 360,
    },
    heroPoints: ["One clear business goal", "A shoot with a plan", "Content built to keep working"],
    ctaLabel: "Get my video plan",
    trustLine: "One production plan for your website, social media and campaigns",
    problemKicker: "The gap between being seen and being chosen",
    problemTitle: "Good footage is not the fix if the customer still does not understand you.",
    problemText:
      "A polished video can look great and still sit unused. We fix the full journey: the message, the opening hook, the proof, the format, the distribution and the next action. That is how video keeps working after filming day.",
    outcomes: [
      {
        title: "Show the problem",
        text: "Open with the moment your customer needs to recognise.",
      },
      {
        title: "Make the offer clear",
        text: "Explain what you do, who it helps and why you are worth choosing.",
      },
      {
        title: "Build a content library",
        text: "Create connected assets for your website, social channels, campaigns and sales follow-up.",
      },
    ],
    deliverablesKicker: "Video production services",
    deliverablesTitle: "One production plan. The right format for the job.",
    deliverablesText:
      "We choose the format around the business problem, the audience and the action the video needs to earn.",
    deliverables: [
      { title: "Brand & promotional video", text: "Make the business easier to trust before the first conversation." },
      { title: "Short-form social video", text: "Turn one strong idea into hooks, cuts and platform-ready assets." },
      { title: "Event videography", text: "Capture the people, energy and proof that make the event worth remembering." },
      { title: "Product video", text: "Show the details and use cases that make a product easier to choose." },
      { title: "Corporate & talking-head video", text: "Make expertise clear without making the viewer work for it." },
      { title: "Drone & aerial footage", text: "Give locations, property and large-scale work the context they deserve." },
    ],
    proofKicker: "Selected video work",
    proofTitle: "Real work, built around a job to do.",
    proofText:
      "Gut Fest, Macaron Boutique and Eco Vent Turbo needed more than attractive footage. Each project used planning, visual direction and editing to make the message easier to feel and understand.",
    proofItems: [
      {
        tag: "Event film",
        title: "Gut Fest Promo",
        text: "Connected short edits and a longer film that carried the event from professional learning into energetic movement.",
        image: "/images/portfolio/JVA_WxYY3p0.webp",
        alt: "Gut Fest event promo video produced by NextVision Studio",
        width: 640,
        height: 360,
      },
      {
        tag: "Product video",
        title: "Macaron Boutique",
        text: "A location-built product short using colour, rhythm and detail to make the boutique memorable.",
        image: "/images/portfolio/GTzSrbR4-k4.webp",
        alt: "Product videography for Macaron Boutique",
        width: 640,
        height: 360,
      },
      {
        tag: "Corporate video",
        title: "Eco Vent Turbo",
        text: "A clearer technical story that helped a complex service feel easier to understand.",
        image: "/images/portfolio/LqePwDWaP8Y.webp",
        alt: "Corporate video production for Eco Vent Turbo",
        width: 640,
        height: 360,
      },
    ],
    processTitle: "A video system that keeps working after the shoot.",
    processText:
      "The shoot is one part of the job. The real value is having the right message, formats and next actions ready to use.",
    process: [
      { title: "Discover", text: "Find the business problem, audience and action the content needs to support." },
      { title: "Plan", text: "Build the concept, hooks, shot list, schedule and delivery plan before filming." },
      { title: "Create", text: "Film with purpose, then edit for attention, clarity and the way people actually watch." },
      { title: "Deliver", text: "Receive the right cuts and formats for your website, social media, campaigns and follow-up." },
    ],
    decisionTitle: "Need video that does more than sit in your portfolio?",
    decisionText:
      "Tell us where the customer journey is stuck. We will recommend the smallest connected production plan that can improve it, then build from what works.",
    relatedLinks: [
      { label: "View the full video portfolio", href: "/#portfolio" },
      { label: "Explore social media content", href: "/social-media-content-creation-dublin/" },
      { label: "See photography services", href: "/photography-dublin/" },
    ],
    formTitle: "Tell us where the business is stuck.",
    formText:
      "No finished brief needed. Tell us what you sell, who you want to reach and what you want video to change.",
    formSubject: "New Videography Dublin landing page enquiry",
    serviceType: "Videography and video production in Dublin",
    schemaDescription:
      "Commercial video production in Dublin for brand stories, product films, events, corporate video and short-form campaigns built around a clear business goal.",
    faq: [
      {
        question: "How is a video project scoped?",
        answer:
          "We look at the goal, audience, filming requirements, number of deliverables and where the content will be used. You receive a clear scope before production begins.",
      },
      {
        question: "What videography services do you provide in Dublin?",
        answer:
          "NextVision Studio creates brand videos, promotional films, event coverage, product videos, corporate interviews, drone footage and short-form social media content for Dublin businesses.",
      },
      {
        question: "How much does videography in Dublin cost?",
        answer:
          "Pricing depends on the production time, locations, crew requirements, editing and number of final formats. After a short project discussion, you receive a clear scope and quote before filming begins.",
      },
      {
        question: "Can one filming day create several social media videos?",
        answer:
          "Yes. When the concepts are planned in advance, one production session can create multiple short-form videos, supporting clips and still frames for a wider content campaign.",
      },
      {
        question: "Do you help with video ideas and scripts?",
        answer:
          "Yes. We can help clarify the message, choose the right format, develop concepts and prepare talking points or a simple script before production.",
      },
      {
        question: "Can you film events outside Dublin?",
        answer:
          "Dublin is our main service area, but projects elsewhere in Ireland can be discussed. Travel and production requirements are confirmed in the quote.",
      },
      {
        question: "How do I start a video project?",
        answer:
          "Send your goal, preferred timing and any examples you like through the enquiry form. We will recommend the next step and arrange a short call when useful.",
      },
    ],
  },

  photography: {
    slug: "photography-dublin",
    kind: "photo",
    metaTitle: "Commercial Photographer Dublin | Product & Brand Photography",
    metaDescription:
      "Commercial photographer in Dublin for product, brand, corporate and event photography. Original images built for websites, campaigns and social media.",
    eyebrow: "Photography Dublin",
    headlineStart: "Commercial photography for",
    headlineAccent: "Dublin businesses",
    lead:
      "Professional photography for Dublin businesses that need credible images for websites, campaigns, product launches, social media and sales material.",
    heroImage: {
      src: "/images/photography/event-photography-dublin.webp",
      alt: "Professional event photographer in Dublin by NextVision Studio",
      width: 1440,
      height: 1800,
    },
    heroPoints: ["Brand-focused planning", "Professional editing", "Web and social formats"],
    ctaLabel: "Get a photography quote",
    trustLine: "Commercial photography shaped around how your images will be used",
    problemKicker: "Make the first impression count",
    problemTitle: "People judge the quality of a business before they read the details.",
    problemText:
      "Inconsistent or generic images make a strong offer harder to trust. A planned photography session gives your website, social channels and campaigns a recognisable visual standard — so the whole business feels more credible.",
    outcomes: [
      {
        title: "Build immediate trust",
        text: "Clean, professional images make your products, people and service feel established.",
      },
      {
        title: "Create visual consistency",
        text: "A connected image library keeps your website, social media and ads on-brand.",
      },
      {
        title: "Show real detail",
        text: "Original photography gives customers information stock images cannot provide.",
      },
    ],
    deliverablesKicker: "Photography services",
    deliverablesTitle: "Professional images for every important customer touchpoint.",
    deliverablesText:
      "The shot list is planned around where the photographs need to work, from a website hero to a social campaign.",
    deliverables: [
      { title: "Product photography", text: "Clean studio-style and lifestyle images that highlight detail." },
      { title: "Brand photography", text: "Original visuals that give your business a recognisable look." },
      { title: "Corporate photography", text: "Professional people, teams, workplaces and business moments." },
      { title: "Event photography", text: "Atmosphere, speakers, guests and key moments captured naturally." },
      { title: "Food & hospitality", text: "Menu, venue and campaign imagery designed to create appetite." },
      { title: "Automotive photography", text: "Sharp exterior, interior, detail and lifestyle photographs." },
    ],
    proofKicker: "Photography portfolio",
    proofTitle: "Real images made for brands, products and events.",
    proofText:
      "Selected professional photography created across Dublin and beyond. Every image includes descriptive, search-friendly context without keyword stuffing.",
    proofItems: [
      {
        tag: "Product",
        title: "Product Photography",
        text: "Clean commercial imagery for websites, catalogues and social campaigns.",
        image: "/images/photography/product-photography-dublin.webp",
        alt: "Professional product photography in Dublin by NextVision Studio",
        width: 1013,
        height: 1800,
      },
      {
        tag: "Corporate",
        title: "Business & People",
        text: "Credible, natural photography for teams and customer-facing brands.",
        image: "/images/photography/corporate-photography-dublin.webp",
        alt: "Corporate and business photography in Dublin",
        width: 1200,
        height: 1800,
      },
      {
        tag: "Hospitality",
        title: "Food & Drink",
        text: "Restaurant and hospitality content created to feel polished and inviting.",
        image: "/images/photography/food-drink-photography-dublin.webp",
        alt: "Food and drink photographer for Dublin hospitality businesses",
        width: 1200,
        height: 1800,
      },
    ],
    processTitle: "A photography process designed around the final use.",
    processText:
      "Planning the purpose of each image first means less wasted time and a stronger, more useful final library.",
    process: [
      { title: "Brief", text: "We define the audience, visual style, locations and required images." },
      { title: "Shot plan", text: "A focused list keeps the session efficient and covers every priority." },
      { title: "Photography", text: "The shoot is directed with attention to light, composition and brand detail." },
      { title: "Edit & deliver", text: "Selected images are professionally edited and supplied in useful formats." },
    ],
    decisionTitle: "Need images for more than one channel?",
    decisionText:
      "Tell us where the photographs will appear. We can plan a versatile image library for your website, Google profile, social media, ads and print without repeating the same setup.",
    relatedLinks: [
      { label: "View the full photography portfolio", href: "/#photography-portfolio" },
      { label: "Combine photography with video", href: "/videography-dublin/" },
      { label: "Explore website design", href: "/webdesigner-dublin/" },
    ],
    formTitle: "Tell us what you need photographed.",
    formText:
      "Share the subject, intended use, preferred date and location if known. We will help turn that into a practical shot plan.",
    formSubject: "New Photography Dublin landing page enquiry",
    serviceType: "Professional photography in Dublin",
    schemaDescription:
      "Professional product, brand, corporate, event, hospitality and automotive photography for businesses in Dublin.",
    faq: [
      {
        question: "What photography services do you offer in Dublin?",
        answer:
          "NextVision Studio provides product, brand, corporate, event, hospitality, food, automotive, portrait and social media photography for Dublin businesses.",
      },
      {
        question: "How much does a professional photographer in Dublin cost?",
        answer:
          "The cost depends on the session length, location, number of setups, production requirements and final image quantity. You receive a clear quote based on the agreed shot list.",
      },
      {
        question: "Do you help create a photography shot list?",
        answer:
          "Yes. We plan the required images around your website, campaign, products or event so the photography session stays focused and useful.",
      },
      {
        question: "Can you photograph products and people in the same session?",
        answer:
          "Often, yes. A combined session can be efficient when the location, lighting and schedule allow it. We confirm the best structure during planning.",
      },
      {
        question: "Will I receive photographs for web and social media?",
        answer:
          "The delivery formats are agreed before the shoot. Images can be prepared for websites, social media, digital advertising and high-resolution uses where required.",
      },
      {
        question: "How do I book a photography project?",
        answer:
          "Send the subject, location, intended use and preferred timing through the form. We will reply with any essential questions and a recommended next step.",
      },
    ],
  },

  webdesign: {
    slug: "webdesigner-dublin",
    kind: "web",
    metaTitle: "Web Designer Dublin | Websites That Generate Enquiries",
    metaDescription:
      "Web designer in Dublin building fast, SEO-ready business websites with clear offers, proof and an easy path to enquiry.",
    eyebrow: "Web Designer Dublin",
    headlineStart: "Websites that turn visits into",
    headlineAccent: "enquiries",
    lead:
      "NextVision Studio designs and develops premium websites for Dublin businesses that need to look credible, explain their value clearly and make contacting them feel easy.",
    heroPoints: ["Mobile-first design", "SEO-friendly structure", "Clear conversion paths"],
    ctaLabel: "Plan your new website",
    trustLine: "Strategy, design, development and launch in one connected process",
    problemKicker: "Your website has one important job",
    problemTitle: "Make the right customer understand and trust your business quickly.",
    problemText:
      "A beautiful website is not enough if visitors cannot find the answer they need. We combine clear content hierarchy, premium design and fast development so your site guides people naturally from interest to enquiry.",
    outcomes: [
      {
        title: "Look credible immediately",
        text: "A clean visual system gives customers confidence before the first conversation.",
      },
      {
        title: "Explain your offer clearly",
        text: "Simple page structure helps people understand what you do and who it is for.",
      },
      {
        title: "Create an easy next step",
        text: "Focused calls to action turn attention into forms, calls and qualified enquiries.",
      },
    ],
    deliverablesKicker: "Website design & development",
    deliverablesTitle: "Everything needed for a fast, focused business website.",
    deliverablesText:
      "The exact scope depends on your business, but every website is built around clarity, mobile performance and a useful customer journey.",
    deliverables: [
      { title: "Strategy & page structure", text: "A sitemap and page purpose built around customer questions." },
      { title: "Custom visual design", text: "Premium layouts shaped around your brand rather than a generic template." },
      { title: "Responsive development", text: "Fast pages designed to work naturally across phones, tablets and desktops." },
      { title: "SEO foundations", text: "Semantic content, metadata, structured data and clean technical structure." },
      { title: "Conversion-focused content", text: "Headings and calls to action arranged to make decisions easier." },
      { title: "Launch-ready setup", text: "Forms, analytics-ready success pages and essential technical checks." },
    ],
    proofKicker: "Designed around decisions",
    proofTitle: "Speed, clarity and conversion belong in the same design.",
    proofText:
      "A strong website should feel simple to the visitor, even when a lot of thinking sits behind it. These are the three principles guiding every build.",
    proofItems: [
      {
        tag: "01 · Speed",
        title: "Fast by design",
        text: "Lean pages, local media and focused development reduce unnecessary loading and friction.",
      },
      {
        tag: "02 · Clarity",
        title: "Easy to understand",
        text: "Every section answers a customer question and moves the story forward.",
      },
      {
        tag: "03 · Conversion",
        title: "Easy to act on",
        text: "Contact points appear when the visitor has enough context to make a decision.",
      },
    ],
    processTitle: "From business goals to a website ready to grow.",
    processText:
      "The project is broken into clear decisions, so you always know what is being built and why it matters.",
    process: [
      { title: "Discover", text: "We clarify your audience, services, goals and current website problems." },
      { title: "Structure", text: "The sitemap, page journey and content priorities are agreed first." },
      { title: "Design & build", text: "The visual system and responsive pages are created and refined." },
      { title: "Launch", text: "Forms, metadata, mobile layouts and essential technical details are checked." },
    ],
    decisionTitle: "Not sure whether you need a rebuild or a focused landing page?",
    decisionText:
      "Share your current website and business goal. We will recommend the smallest useful scope — a landing page, a focused service site or a complete rebuild.",
    relatedLinks: [
      { label: "Explore all digital services", href: "/services/" },
      { label: "Add professional photography", href: "/photography-dublin/" },
      { label: "Plan social media content", href: "/social-media-content-creation-dublin/" },
    ],
    formTitle: "Tell us what your website needs to achieve.",
    formText:
      "Include your current website if you have one, the services you want to promote and the main action a visitor should take.",
    formSubject: "New Web Designer Dublin landing page enquiry",
    serviceType: "Website design and development in Dublin",
    schemaDescription:
      "Premium, responsive and SEO-friendly website design and development for Dublin businesses, including landing pages and conversion-focused service websites.",
    faq: [
      {
        question: "What kind of websites do you design for Dublin businesses?",
        answer:
          "NextVision Studio designs service websites, small business sites, focused landing pages and portfolio-led websites that prioritise clarity, mobile usability and enquiries.",
      },
      {
        question: "How much does a business website cost in Dublin?",
        answer:
          "The right scope depends on your goals, pages, content and the conversion work your business needs. Send us your current site and goal and we will recommend the clearest next step before preparing a tailored quote.",
      },
      {
        question: "Will my new website be SEO-friendly?",
        answer:
          "Yes. Pages are built with semantic headings, useful visible content, metadata, canonical URLs, structured data, responsive layouts and performance-conscious media. Rankings still depend on competition, authority and ongoing content.",
      },
      {
        question: "Can you redesign my existing WordPress website?",
        answer:
          "Yes. Existing content and URLs can be reviewed and rebuilt in a faster, cleaner system while preserving important page paths and planning redirects where a URL genuinely needs to change.",
      },
      {
        question: "Can you build landing pages for Google Ads or Meta Ads?",
        answer:
          "Yes. Campaign landing pages can focus on one service, one audience and one conversion action, with a dedicated success URL for measurement.",
      },
      {
        question: "How do I start a website project?",
        answer:
          "Send your current website, business goal, required pages and preferred timing. We will recommend a suitable scope and the clearest next step.",
      },
    ],
  },

  ads: {
    slug: "google-ads-meta-ads-dublin",
    kind: "ads",
    metaTitle: "Google Ads & Meta Ads Management Dublin | NextVision Studio",
    metaDescription:
      "Google Ads and Meta Ads managed for Dublin businesses. Campaigns, creative and reporting built around one number: enquiries.",
    eyebrow: "Google Ads & Meta Ads Dublin",
    headlineStart: "Google Ads and Meta Ads, managed around one",
    headlineAccent: "number",
    lead:
      "Most agencies report on reach. We report on how many people contacted you.",
    heroImage: {
      src: "/images/portfolio/SUeoIgRtH0I.webp",
      alt: "Campaign-ready video creative produced by NextVision Studio",
      width: 640,
      height: 360,
    },
    heroPoints: ["Campaigns built for enquiries", "Creative produced in house", "Clear monthly reporting"],
    ctaLabel: "Plan your paid campaign",
    trustLine: "Paid advertising for Dublin businesses that need enquiries, not vanity metrics",
    problemKicker: "A campaign should lead somewhere useful",
    problemTitle: "More visibility only matters when the right people get in touch.",
    problemText:
      "Paid advertising works best when the campaign, creative and landing page all point to one clear action. We manage the full path, so the money you spend is measured against enquiries rather than surface-level reach.",
    outcomes: [
      {
        title: "Reach active demand",
        text: "Google Search campaigns put your service in front of people already looking for it.",
      },
      {
        title: "Create local demand",
        text: "Meta campaigns on Facebook and Instagram make a clear offer visible to the right local audience.",
      },
      {
        title: "Track the useful number",
        text: "Reporting stays focused on enquiries, cost per lead and the next improvement to make.",
      },
    ],
    deliverablesKicker: "What we manage",
    deliverablesTitle: "The campaign, creative and conversion path in one place.",
    deliverablesText:
      "Every part of the campaign is built around making it easier for a potential customer to contact you.",
    deliverables: [
      { title: "Google Search campaigns", text: "For people actively looking for your service." },
      { title: "Meta campaigns", text: "Facebook and Instagram campaigns that build local demand." },
      { title: "Ad creative", text: "Video and static creative produced in house for your campaign." },
      { title: "Landing pages", text: "Focused pages built to convert the traffic you are paying for." },
      { title: "Monthly reporting", text: "Plain-English reporting, not a dashboard you never open." },
    ],
    proofKicker: "Results from campaigns we run",
    proofTitle: "Measured by the enquiries that matter to your business.",
    proofText:
      "We focus campaign decisions on lead volume, cost and the quality of the conversations they create.",
    proofItems: [
      { tag: "Lead volume", title: "500+ leads generated", text: "Leads generated for clients through managed campaigns." },
      { tag: "Cost efficiency", title: "Efficient cost per lead", text: "Campaign costs are monitored against lead quality and enquiry volume." },
      { tag: "Customer growth", title: "100+ customers acquired", text: "Customer acquisition is tracked from campaign to enquiry and follow-up." },
    ],
    processTitle: "A paid campaign built around how customers actually enquire.",
    processText:
      "We start with the offer and the action you want, then make the campaign simple enough to measure and improve.",
    process: [
      { title: "Set the goal", text: "We define the service, audience, offer and one conversion action." },
      { title: "Build the campaign", text: "Campaign structure, tracking, creative and landing page are prepared together." },
      { title: "Launch and learn", text: "Live data shows what earns attention and what turns it into enquiries." },
      { title: "Improve", text: "Budget, creative and targeting are refined around the strongest signals." },
    ],
    decisionTitle: "Need more enquiries without guessing where your budget is going?",
    decisionText:
      "Tell us what you sell, where you work and what a new customer is worth. We will recommend a practical first campaign and the budget it needs.",
    relatedLinks: [
      { label: "Explore all digital services", href: "/services/" },
      { label: "Build a conversion-focused website", href: "/webdesigner-dublin/" },
      { label: "Create campaign-ready content", href: "/social-media-content-creation-dublin/" },
    ],
    formTitle: "Tell us what a new enquiry is worth to your business.",
    formText:
      "Share the service you want to promote, the areas you cover and whether you already run ads. We will recommend a practical next step.",
    formSubject: "New Google Ads and Meta Ads Dublin landing page enquiry",
    serviceType: "Google Ads and Meta Ads management in Dublin",
    schemaDescription:
      "Google Ads and Meta Ads campaign management, creative production, landing pages and plain-English reporting for Dublin businesses.",
    faq: [
      {
        question: "How much ad spend do I need?",
        answer:
          "The right ad budget depends on your service, location, competition and how many enquiries you need. We will recommend a sensible starting point and keep management separate from the media budget.",
      },
      {
        question: "How soon will I see enquiries?",
        answer:
          "Google Search campaigns can begin reaching people as soon as they are approved. We normally use the first few weeks to check search terms, creative and conversion data, then improve the campaign around the strongest signals.",
      },
      {
        question: "Do you make the creative?",
        answer:
          "Yes. We can produce campaign-ready video, static creative and ad copy in house, then match it to the platform, offer and landing page.",
      },
      {
        question: "Can I stop anytime?",
        answer:
          "There is no long contract. You can cancel management with 30 days notice, and your ad spend remains separate and under your control.",
      },
    ],
  },

  social: {
    slug: "social-media-content-creation-dublin",
    kind: "social",
    metaTitle: "Social Media Content Creation Dublin | Reels, Video & Photography",
    metaDescription:
      "Social media content creation in Dublin: Reels, TikToks, Shorts and photography planned around the offers your business needs to sell.",
    eyebrow: "Social Media Content Creation Dublin",
    headlineStart: "A Content System That Keeps Your Brand",
    headlineAccent: "Visible",
    lead:
      "NextVision Studio helps Dublin businesses plan and produce short-form videos, photography and branded social content without starting from zero every week.",
    heroImage: {
      src: "/images/content/social-platform-guide.webp",
      alt: "Short-form social media content creation by NextVision Studio in Dublin",
      width: 1080,
      height: 1920,
    },
    heroPoints: ["Ideas matched to your audience", "Batch filming", "Platform-ready edits"],
    ctaLabel: "Build your content plan",
    trustLine: "Short-form content for Reels, TikTok, YouTube Shorts and paid social",
    problemKicker: "Consistency without the weekly scramble",
    problemTitle: "Your business should not disappear because you ran out of content ideas.",
    problemText:
      "Random posts make it difficult to build recognition or learn what works. A simple content system connects your business goals, recurring topics and production schedule — giving you a useful bank of videos and photos instead of one isolated post.",
    outcomes: [
      {
        title: "Stay recognisable",
        text: "Consistent formats and visuals help people remember who you are and what you offer.",
      },
      {
        title: "Reduce content pressure",
        text: "Batch planning and production replace the weekly search for something to publish.",
      },
      {
        title: "Learn what earns attention",
        text: "A repeatable structure makes it easier to compare topics, hooks and formats over time.",
      },
    ],
    deliverablesKicker: "Full-service content creation",
    deliverablesTitle: "From the first idea to content ready for your calendar.",
    deliverablesText:
      "Choose a focused campaign or build an ongoing content library. The mix is planned around your audience and capacity.",
    deliverables: [
      { title: "Content planning", text: "Topics, hooks and formats connected to your services and customer questions." },
      { title: "Short-form video", text: "Reels, TikToks and YouTube Shorts created for vertical viewing." },
      { title: "Social photography", text: "Brand, product and behind-the-scenes images for a varied feed." },
      { title: "Batch production", text: "Multiple content pieces created efficiently in one planned session." },
      { title: "Editing & captions", text: "Platform-ready cuts, subtitles, music and clean visual pacing." },
      { title: "Campaign creative", text: "Organic and paid-social assets designed around one clear message." },
    ],
    proofKicker: "Short-form portfolio",
    proofTitle: "Content designed for the way people scroll now.",
    proofText:
      "Short-form work across products, hospitality and professional services, created to communicate quickly without losing brand quality.",
    proofItems: [
      {
        tag: "Product content",
        title: "Leroy's Barking World",
        text: "Product-led social video with a clear demonstration and human delivery.",
        image: "/images/portfolio/53-_kK95Eoc.webp",
        alt: "Social media product video created for Leroy's Barking World",
        width: 640,
        height: 360,
      },
      {
        tag: "Restaurant content",
        title: "Buga Ramen",
        text: "Hospitality video designed around appetite, atmosphere and quick visual detail.",
        image: "/images/portfolio/VMcywbhRMCc.webp",
        alt: "Restaurant social media content video for Buga Ramen",
        width: 640,
        height: 360,
      },
      {
        tag: "Business content",
        title: "VentSolve",
        text: "A short-form promotional concept that makes a business message easier to notice.",
        image: "/images/portfolio/SUeoIgRtH0I.webp",
        alt: "Short-form business content created for VentSolve",
        width: 640,
        height: 360,
      },
    ],
    processTitle: "A repeatable path from ideas to a usable content bank.",
    processText:
      "The system stays simple enough to maintain and flexible enough to respond to what your audience actually engages with.",
    process: [
      { title: "Focus", text: "We choose the audience, offers and recurring content themes." },
      { title: "Plan", text: "Hooks, talking points, shots and formats are prepared before production." },
      { title: "Batch create", text: "Multiple videos and photographs are captured in a focused session." },
      { title: "Deliver & learn", text: "Content arrives ready to publish, with future ideas shaped by real response." },
    ],
    decisionTitle: "Do you need content creation or full social media support?",
    decisionText:
      "We can create the assets for your team to publish, or discuss a broader system including planning, posting support and paid campaigns. The right scope depends on what you can manage internally.",
    relatedLinks: [
      { label: "View the short-form video portfolio", href: "/#portfolio-row-social" },
      { label: "Explore Dublin videography", href: "/videography-dublin/" },
      { label: "See Meta & Google Ads support", href: "/services/#advertising" },
    ],
    formTitle: "Tell us what makes content difficult right now.",
    formText:
      "Share your business, preferred platforms and whether you need a one-off campaign or an ongoing content system.",
    formSubject: "New Social Media Content Creation Dublin landing page enquiry",
    serviceType: "Social media content creation in Dublin",
    schemaDescription:
      "Short-form video, Reels, TikTok, YouTube Shorts, social photography and campaign content creation for Dublin businesses.",
    faq: [
      {
        question: "What is included in social media content creation?",
        answer:
          "Depending on the project, it can include content planning, hooks, filming, photography, editing, subtitles and delivery in platform-ready formats for Reels, TikTok, YouTube Shorts and paid social.",
      },
      {
        question: "Do you create content for Dublin businesses on location?",
        answer:
          "Yes. We can film and photograph at your business, venue, event or another suitable Dublin location agreed during planning.",
      },
      {
        question: "Can you create several videos in one session?",
        answer:
          "Yes. Batch production is often the most efficient approach. The number of useful videos depends on their complexity, locations, setups and how well the ideas are prepared.",
      },
      {
        question: "Do you manage social media accounts too?",
        answer:
          "Content creation can be delivered as a standalone service. Broader planning, posting support, Meta Ads and Google Ads can also be discussed when your business needs a more connected system.",
      },
      {
        question: "Can the same content be used for ads?",
        answer:
          "Some assets can support both organic and paid campaigns, but advertising creative often benefits from a more direct hook, offer and call to action. We plan these differences before filming.",
      },
      {
        question: "How do I start a social media content project?",
        answer:
          "Send your business type, platforms, current challenge and preferred timing. We will suggest a focused first content plan or production session.",
      },
    ],
  },
};
