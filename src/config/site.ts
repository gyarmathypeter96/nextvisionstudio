export const SITE_NAME = "NextVision Studio";
export const SITE_URL = "https://www.nextvisionstudio.com";
export const CONTACT_EMAIL = "hello@nextvisionstudio.com";
export const CONTACT_PHONE = "+353 89 479 7055";
export const CONTACT_PHONE_E164 = "+353894797055";
export const GTM_CONTAINER_ID = "GTM-PL34N8WF";
export const ANALYTICS_HOSTS = ["www.nextvisionstudio.com", "nextvisionstudio.com"];
// Service coverage is not a claim that the business has an office in each town.
export const SERVICE_AREAS = ["Dublin", "North Dublin", "Balbriggan", "Swords", "Malahide"];
export const SERVICE_AREA_TEXT = "Serving Dublin and North Dublin, including Balbriggan, Swords and Malahide.";
export const AREA_SERVED_SCHEMA = SERVICE_AREAS.map((name) => ({ "@type": "Place", name }));
export const FOUNDER_NAME = "Peter Gyarmathy";
export const BUSINESS_ID = `${SITE_URL}/#business`;
export const FOUNDER_ID = `${SITE_URL}/#peter-gyarmathy`;

// Official profiles of the business, used for schema.org sameAs and footer links.
export const SOCIAL_PROFILES = [
  { label: "Instagram", href: "https://www.instagram.com/nextvisionstudio/" },
  { label: "Facebook", href: "https://www.facebook.com/218946454645781" },
];
