// NextVision prices supplied by the owner on 18 October 2026; monthly packages updated 24 October 2026.
// Alternative budgets are owner-supplied illustrations, not surveyed averages.
// Editing-only work must never be presented as filming plus account management.
export const nextVisionPrices = [
  {
    id: "monthly-videos",
    title: "Monthly short videos",
    price: "From €350",
    vat: "+ VAT",
    unit: "Per month",
    description: "Content planning and a half day shoot at your business every month. Publishing and account management are separate.",
    tiers: [
      { videos: 4, price: "€350" },
      { videos: 8, price: "€450" },
      { videos: 12, price: "€600" },
    ],
  },
  {
    id: "half-day",
    title: "Half day shooting",
    price: "€250",
    vat: "+ VAT",
    unit: "Per filming session",
    description: "A half day filming session. Edited videos are priced separately.",
  },
  {
    id: "full-day",
    title: "Full day shooting",
    price: "€450",
    vat: "+ VAT",
    unit: "Per filming day",
    description: "A full day filming session. Edited videos are priced separately.",
  },
  {
    id: "ultimate-organic",
    title: "Ultimate Organic Social Content",
    price: "€1,200",
    vat: "+ VAT",
    unit: "Per month",
    description: "Social media content, management and strategy, with 12 short videos and 4 photos each month. Advertising spend and paid campaign management are separate.",
    featured: true,
  },
  {
    id: "ad-creative",
    title: "4 short videos for ads",
    price: "€500",
    vat: "+ VAT",
    unit: "Per video production package",
    description: "4 short videos created for paid social ads. Ad spend and campaign management are separate.",
  },
];

export const marketPricingExamples = [
  {
    item: "Half day shooting",
    price: "Approx. €500 + VAT",
    unit: "Illustrative filming budget",
    nextvisionPrice: "€250 + VAT",
    nextvision: "Half day shooting. Editing is separate.",
  },
  {
    item: "Full day shooting",
    price: "Approx. €900 + VAT",
    unit: "Illustrative filming budget",
    nextvisionPrice: "€450 + VAT",
    nextvision: "Full day shooting. Editing is separate.",
  },
  {
    item: "Monthly content: 8 short videos with basic editing",
    price: "Approx. €1,500 + VAT / month",
    unit: "Illustrative monthly content budget",
    nextvisionPrice: "€450 + VAT / month",
    nextvision: "Full Monthly Content: content planning, a half day shoot and 8 edited short videos. Publishing and account management are separate.",
  },
  {
    item: "Full social media content and management",
    price: "Approx. €2,000 to €3,000 + VAT / month",
    unit: "Illustrative managed content budget",
    nextvisionPrice: "€1,200 + VAT / month",
    nextvision: "Ultimate Organic Social Content: strategy, management, 12 short videos and 4 photos each month.",
  },
];
