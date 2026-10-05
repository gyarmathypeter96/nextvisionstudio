export interface ServiceScope {
  title: string;
  answer: string;
  items: Array<{ title: string; text: string }>;
  cost: string;
  proof: { title: string; text: string; href: string; image?: string; alt?: string };
}

export const serviceScopes: Record<string, ServiceScope> = {
  "videography-dublin": {
    title: "A clear plan. A useful set of videos.",
    answer: "NextVision Studio plans, films and edits business videos for service companies, local brands and teams in Dublin. Use them to explain your offer, introduce your people and help customers take the next step on your website, social pages or ads.",
    items: [
      { title: "Before filming", text: "Agree the audience, message, script or interview questions, locations and shot list. Decide which videos and formats you need before the camera comes out." },
      { title: "The filming day", text: "Plan a focused day at your business to capture interviews, your work and supporting footage. The quote confirms filming time, locations and any extra crew or days." },
      { title: "What you receive", text: "Choose a main business film, shorter social edits or both. The proposal lists the number of videos, lengths, screen shapes and any captions, voiceover or photography." },
      { title: "Delivery and changes", text: "Agree the first edit date, final delivery date and included revision rounds before booking. One contact gathers feedback so changes stay clear and manageable." },
      { title: "Ready to use", text: "Receive edited files for the agreed website, social or advertising channels. Posting, campaign management and raw footage are separate unless listed in your proposal." },
      { title: "A clear next step", text: "Choose what viewers should do next, such as enquire, request a quote or learn about a service. Reach alone is not evidence of new customers." },
    ],
    cost: "A focused shoot with a few edits needs less production time than a film with several locations, people and versions. Planning, filming time, crew, edit count, captions, usage and delivery urgency shape the quote. We agree the scope and price in writing, rather than publishing a one size fits all rate.",
    proof: { title: "VentSolve: help customers understand the service", text: "VentSolve needed promotional videos, customer education and internal training. We planned content around real ventilation and mould removal questions, then adapted the message for public marketing and team learning. See the public work and how each video was used.", href: "/case-studies/ventsolve-content-production/", image: "/images/portfolio/SUeoIgRtH0I.webp", alt: "VentSolve business video project by NextVision Studio" },
  },
  "photography-dublin": {
    title: "Photography planned for where you will use it.",
    answer: "NextVision Studio creates commercial product, brand, corporate and event photography for Dublin businesses. We plan the image list around your website, social content or campaign, photograph the agreed subjects and deliver a selected set of edited images.",
    items: [
      { title: "A practical image list", text: "Agree the products, people, locations and key images. Include the website spaces or campaigns the photos need to fit, rather than shooting without a purpose." },
      { title: "A planned photo session", text: "Confirm the location, session length, styling and access before booking. Studio space, specialist equipment or extra preparation are included only when agreed." },
      { title: "Edited images and usage", text: "The proposal confirms image quantity, selection, editing, file formats, delivery date and revisions. Website, social, advertising and print usage rights are agreed for the project; see our image licensing guide." },
    ],
    cost: "A straightforward session has a different scope from a large product range, several locations or detailed retouching. The subject list, shooting time, edited image count, preparation and usage determine your tailored quote.",
    proof: { title: "Commercial photography at SG Studios Dublin", text: "At SG Studios in Ballycoolin, Dublin 15, we created photography for VentSolve website content alongside video production. The linked project explains the collaboration. The portfolio below shows more product, people, food and event photography, so you can judge the style before planning your own session.", href: "/case-studies/sg-studios-dublin-podcast-studio-content/", image: "/images/portfolio/fLzjvPVHzAc.webp", alt: "VentSolve content filmed at SG Studios Dublin" },
  },
  "short-form-video-production-dublin": {
    title: "Know what your content day includes.",
    answer: "NextVision Studio plans, films and edits short videos for Instagram Reels, TikTok and YouTube Shorts. A planned filming session can create several clips around your business, products and customer questions. Each proposal confirms the actual number and type of videos.",
    items: [
      { title: "Ideas before filming", text: "Agree topics, opening lines, talking points and a filming plan based on what you sell and what customers ask. You do not need a finished script to start." },
      { title: "Film once, edit for each channel", text: "Capture your team, work or products in a focused session. Agree the video count, lengths, vertical formats, subtitles and cover images in the proposal." },
      { title: "A clear handover", text: "Confirm delivery dates and revision rounds before booking. You receive the agreed edited files; monthly planning, publishing, account management and paid promotion must be explicitly included or quoted separately." },
    ],
    cost: "A single content day and a monthly production plan involve different amounts of planning and editing. Filming time, video count, subtitles, locations and ongoing support determine the scope. We recommend a practical setup and quote it before you commit.",
    proof: { title: "Leroy’s Barking World: planned content with a real personality", text: "For this Blessington dog grooming business, scripts and a shot plan helped turn everyday routines into funny, useful videos. Professional edits worked alongside the client’s own phone content, rather than replacing the personality customers recognised.", href: "/case-studies/leroys-barking-world-social-content/" },
  },
  "corporate-video-production-dublin": {
    title: "Make the important explanation repeatable.",
    answer: "NextVision Studio produces corporate service explainers, interviews, customer stories and training videos for Dublin businesses. These films help customers understand an offer or help staff learn a process. The audience and purpose are agreed before filming.",
    items: [
      { title: "A clear brief", text: "Decide whether the film is for sales, customer education or internal training. Prepare interview questions, talking points and a shot list with the people who know the subject." },
      { title: "The agreed production", text: "Confirm speakers, locations, filming time and any screen recordings or demonstrations. The proposal lists the main film, shorter versions, captions and formats required." },
      { title: "Review and delivery", text: "Nominate a reviewer for factual accuracy and feedback. Agree edit dates, revision rounds and usage before booking. Sensitive internal material is not treated as a public portfolio item without permission." },
    ],
    cost: "A single interview needs a different production plan from a multi location training series. Preparation, people, locations, filming time, editing, versions and delivery urgency shape the quote. The written scope confirms what is included.",
    proof: { title: "VentSolve: promotion, education and team training", text: "The VentSolve partnership combines promotional content with customer education and internal learning. The case study separates those uses and links public work, without exposing private training material or inventing a sales result.", href: "/case-studies/ventsolve-content-production/" },
  },
};
