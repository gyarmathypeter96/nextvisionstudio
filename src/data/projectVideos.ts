import { SITE_URL } from "../config/site";

// uploadDate values verified against each public YouTube watch page, 25 Oct 2026.
// Only videos actually playable on the current page may be marked up.
const videos: Record<string, { name: string; description: string; uploadDate: string }> = {
  SUeoIgRtH0I: { name: "VentSolve promotional video", description: "NextVision Studio promotional video explaining an Irish ventilation and mould removal business.", uploadDate: "2026-06-06T07:01:39-07:00" },
  "GTzSrbR4-k4": { name: "The Macaron Boutique product video", description: "A NextVision Studio product film showing food, details and atmosphere at The Macaron Boutique in Alicante.", uploadDate: "2026-06-06T08:52:59-07:00" },
  "53-_kK95Eoc": { name: "Leroy’s Barking World social video", description: "Short-form video produced by NextVision Studio for a dog grooming business in Blessington.", uploadDate: "2026-06-06T08:52:34-07:00" },
  VMcywbhRMCc: { name: "Buga Ramen restaurant video", description: "NextVision Studio restaurant video showing food and atmosphere for social media.", uploadDate: "2026-10-19T04:14:03-07:00" },
  JVA_WxYY3p0: { name: "Gut Fest event film", description: "NextVision Studio film of the Gut Fest event in Dublin, showing the people, food and activities.", uploadDate: "2026-10-19T00:52:36-07:00" },
  fLzjvPVHzAc: { name: "SG Studios Dublin promotional video", description: "NextVision Studio promotional content showing the SG Studios Dublin podcast and video studio.", uploadDate: "2026-06-06T06:59:44-07:00" },
  w2nOFnxvOL8: { name: "Pogány Induló live concert video", description: "NextVision Studio live concert film recorded at The Grand Social in Dublin.", uploadDate: "2026-06-09T11:15:09-07:00" },
};
export const projectVideoSchema = (id: string) => {
  const video = videos[id];
  if (!video) return undefined;
  return { "@context": "https://schema.org", "@type": "VideoObject", "@id": `${SITE_URL}/#video-${id}`,
    ...video, thumbnailUrl: `${SITE_URL}/images/portfolio/${id}.webp`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
    url: `https://www.youtube.com/watch?v=${id}`, creator: { "@id": `${SITE_URL}/#business` } };
};
