// Owner-approved monthly production packages (prices updated 24 October 2026). These are not editing-only rates
// or the separate managed-social package. All three include a half day shoot.
export const monthlyContentPackages = [
  {
    id: "starter",
    name: "Starter Video",
    price: 350,
    videos: 4,
    description: "A focused start for your business on social media.",
    cta: "Choose Starter",
    featured: false,
  },
  {
    id: "monthly",
    name: "Full Monthly Content",
    price: 550,
    salePrice: 450,
    videos: 8,
    description: "A steady flow of content, without planning every post yourself.",
    cta: "Choose Monthly Content",
    featured: true,
  },
  {
    id: "growth",
    name: "Growth Video",
    price: 750,
    videos: 12,
    description: "More videos to share more of what your business does.",
    cta: "Choose Growth",
    featured: false,
  },
] as const;
