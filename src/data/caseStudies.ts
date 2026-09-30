export interface CaseStudySummary {
  client: string;
  title: string;
  location: string;
  href: string;
  image: string;
  alt: string;
}

// Shared by the case study index and the "more case studies" links on each project.
export const caseStudies: CaseStudySummary[] = [
  { client: "Gut Fest", title: "Gut Fest Event Videography Dublin", location: "Grand Canal Dock, Dublin", href: "/case-studies/gut-fest-event-videography-dublin/", image: "/images/portfolio/JVA_WxYY3p0.webp", alt: "Gut Fest event videography in Dublin" },
  { client: "The Macaron Boutique", title: "The Macaron Boutique Product Video", location: "Alicante, Spain", href: "/case-studies/macaron-boutique-product-video/", image: "/images/portfolio/GTzSrbR4-k4.webp", alt: "The Macaron Boutique product video" },
  { client: "Leroy's Barking World", title: "Leroy's Barking World Social Content", location: "Blessington, County Wicklow", href: "/case-studies/leroys-barking-world-social-content/", image: "/images/portfolio/53-_kK95Eoc.webp", alt: "Leroy's Barking World social media content" },
  { client: "VentSolve", title: "VentSolve Content Production", location: "Dublin 15 and Ireland", href: "/case-studies/ventsolve-content-production/", image: "/images/portfolio/SUeoIgRtH0I.webp", alt: "VentSolve brand video production" },
  { client: "SG Studios Dublin", title: "SG Studios Dublin Podcast Studio Content", location: "Ballycoolin, Dublin 15", href: "/case-studies/sg-studios-dublin-podcast-studio-content/", image: "/images/portfolio/fLzjvPVHzAc.webp", alt: "Podcast video content produced at SG Studios Dublin" },
  { client: "Pogány Induló", title: "Pogány Induló Live Concert Video", location: "The Grand Social, Dublin 1", href: "/case-studies/pogany-indulo-live-concert-video/", image: "/images/portfolio/w2nOFnxvOL8.webp", alt: "Pogány Induló live concert video in Dublin" },
];
