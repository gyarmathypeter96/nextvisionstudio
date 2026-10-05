export interface VideoSeoPageData {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  lead: string;
  problemTitle: string;
  problemText: string;
  benefits: Array<{ title: string; text: string }>;
  project: {
    title: string;
    text: string;
    image: string;
    alt: string;
    href: string;
  };
  faq: Array<{ question: string; answer: string }>;
  related: Array<{ label: string; href: string }>;
}

export const videoSeoPages: Record<string, VideoSeoPageData> = {
  corporate: {
    slug: "corporate-video-production-dublin",
    metaTitle: "Corporate Video Production Dublin | NextVision Studio",
    metaDescription:
      "Corporate video production in Dublin for service explainers, customer stories, training and business campaigns. Planned, filmed and edited by NextVision Studio.",
    eyebrow: "Corporate video production Dublin",
    title: "Corporate Video Production in Dublin.",
    lead:
      "Turn complex services, internal knowledge and customer proof into clear video your team can use across sales, training and marketing.",
    problemTitle: "Important information is often trapped in calls, documents and presentations.",
    problemText:
      "A planned corporate video gives customers and staff a consistent explanation, delivered by the people who know the business best.",
    benefits: [
      { title: "Explain the service", text: "Show the problem, process and value without relying on a long sales document." },
      { title: "Build customer trust", text: "Use real people, locations and customer stories instead of generic stock footage." },
      { title: "Reuse the production", text: "Create a main film, shorter campaign edits and internal versions from one shoot." },
    ],
    project: {
      title: "VentSolve",
      text: "Ongoing brand, educational and internal video produced for customers, campaigns and staff training.",
      image: "/images/portfolio/SUeoIgRtH0I.webp",
      alt: "Corporate video production for VentSolve in Dublin",
      href: "/case-studies/ventsolve-content-production/",
    },
    faq: [
      { question: "What corporate videos do you produce?", answer: "We produce service explainers, interviews, customer stories, training videos, product demonstrations and campaign edits for Dublin businesses." },
      { question: "Can you help with the script?", answer: "Yes. We shape the message, interview questions, talking points and shot list before filming." },
      { question: "Can one shoot create several videos?", answer: "Yes. Planning every output before the shoot makes it possible to create a main film and multiple shorter edits from the same production." },
      { question: "Do you film outside Dublin?", answer: "Dublin is the main service area, and projects elsewhere in Ireland can be discussed when the brief requires it." },
      { question: "How much does corporate video production cost in Dublin?", answer: "The quote depends on planning, speakers, filming time, crew, locations and the number of final edits. A focused interview has a smaller scope than a multi location film or training series. We confirm deliverables, deadlines and revision rounds in writing before booking." },
    ],
    related: [
      { label: "How much does a videographer cost in Dublin?", href: "/how-much-does-a-videographer-cost-in-dublin/" },
      { label: "How to plan a business video production in Dublin", href: "/blog/business-video-production-planning-dublin/" },
      { label: "Case study: SG Studios Dublin podcast studio content", href: "/case-studies/sg-studios-dublin-podcast-studio-content/" },
      { label: "Event videography Dublin", href: "/event-videographer-dublin/" },
    ],
  },
  event: {
    slug: "event-videographer-dublin",
    metaTitle: "Event Videographer Dublin | Event Video Production",
    metaDescription:
      "Event videographer in Dublin for conferences, launches, live performances and branded events. Highlight films and social edits by NextVision Studio.",
    eyebrow: "Event videographer Dublin",
    title: "Event video that keeps working after the room is empty.",
    lead:
      "Capture the people, atmosphere and key moments, then turn the day into a highlight film and short content for your next campaign.",
    problemTitle: "A good event should create more than a one-day memory.",
    problemText:
      "The right coverage gives sponsors, attendees and future customers a clear reason to engage with the event again.",
    benefits: [
      { title: "Show the atmosphere", text: "Natural crowd moments, speakers, details and movement make the experience feel real." },
      { title: "Protect the key moments", text: "The schedule and must-have shots are agreed before the event begins." },
      { title: "Create campaign assets", text: "Receive a main highlight film and short vertical edits ready for social media." },
    ],
    project: {
      title: "Gut Fest Dublin",
      text: "Event coverage that connected education, food, movement and the energy of the day in one story and several short edits.",
      image: "/images/portfolio/JVA_WxYY3p0.webp",
      alt: "Gut Fest event videography in Dublin",
      href: "/case-studies/gut-fest-event-videography-dublin/",
    },
    faq: [
      { question: "What events do you film?", answer: "We cover conferences, launches, workshops, live performances, branded events and community events in Dublin." },
      { question: "Can you deliver short social clips?", answer: "Yes. Vertical clips can be planned alongside the main highlight film and delivered ready for Reels, TikTok and Shorts." },
      { question: "Do you record speakers and interviews?", answer: "Yes. Speaker coverage and short attendee or organiser interviews can be included when agreed before the event." },
      { question: "How far ahead should I book?", answer: "Booking early gives us time to review the schedule and key moments, but short-notice availability can still be checked." },
      { question: "How much does an event videographer cost in Dublin?", answer: "The quote depends on event length, locations, crew, speaker recordings, highlight films, social edits and delivery urgency. Brief coverage requires less production time than full day coverage with several cameras. The written proposal confirms exactly what is included." },
    ],
    related: [
      { label: "How much does a videographer cost in Dublin?", href: "/how-much-does-a-videographer-cost-in-dublin/" },
      { label: "Case study: Pogány Induló live concert video", href: "/case-studies/pogany-indulo-live-concert-video/" },
      { label: "How to plan a business video production in Dublin", href: "/blog/business-video-production-planning-dublin/" },
      { label: "Corporate video production Dublin", href: "/corporate-video-production-dublin/" },
    ],
  },
};
