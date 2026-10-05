// One vocabulary for navigation, enquiry forms and structured service data.
export const SERVICE_CATALOG = [
  { key: "shortform", title: "Short Form Video Production", href: "/short-form-video-production-dublin/" },
  { key: "video", title: "Business Video Production", href: "/videography-dublin/" },
  { key: "corporate", title: "Corporate Video Production", href: "/corporate-video-production-dublin/" },
  { key: "event", title: "Event Videography", href: "/event-videographer-dublin/" },
  { key: "social", title: "Monthly Social Media Content", href: "/social-media-content-creation-dublin/" },
  { key: "ads", title: "Google and Meta Ads Management", href: "/google-ads-meta-ads-dublin/" },
  { key: "photography", title: "Commercial Photography", href: "/photography-dublin/" },
  { key: "web", title: "Website Design and Development", href: "/webdesigner-dublin/" },
  { key: "crm", title: "CRM and AI Automation", href: "/crm-lead-automation-dublin/" },
] as const;

export type ServiceKey = typeof SERVICE_CATALOG[number]["key"];
export const getService = (key: ServiceKey) => SERVICE_CATALOG.find((service) => service.key === key)!;
export const serviceForPath = (path: string) => SERVICE_CATALOG.find((service) => service.href === path);
