// Content Sprint landing page (/content-sprint/). Everything the owner may need
// to change week to week lives here: price, deposit, shoot mornings and which
// of them are taken. Mark a morning `booked: true` the day its deposit lands.
// When every morning is booked the page switches to "fully booked" and the
// form collects requests for the next month instead.

export const sprint = {
  price: 690,
  deposit: 200,
  month: "January",
  monthYear: "January 2027",
  nextMonth: "February",
  videos: 8,
  photos: 8,
  // Early booking bonus, shown until the end of this date (Dublin time).
  bonus: {
    until: "2026-12-12T23:59:59Z",
    untilLabel: "12 December",
    text: "4 extra videos, 12 in total",
  },
};

export interface ShootMorning {
  date: string; // YYYY-MM-DD
  booked: boolean;
}

export const shootMornings: ShootMorning[] = [
  { date: "2027-01-07", booked: false },
  { date: "2027-01-08", booked: false },
  { date: "2027-01-14", booked: false },
  { date: "2027-01-15", booked: false },
  { date: "2027-01-21", booked: false },
  { date: "2027-01-22", booked: false },
];

// The eight videos, in the order they are filmed and posted. Each one is a
// real NextVision edit, so the page never shows invented work.
export const sprintVideos = [
  { id: "01", title: "Meet the business", why: "Who you are and what you do, in your own words.", client: "VentSolve, Donabate", full: "/videos/portfolio-2026/ventsolve-installation.mp4" },
  { id: "02", title: "Your best-known service", why: "The thing people already come to you for.", client: "Perfect Clean", full: "/videos/portfolio-2026/perfect-clean-sink.mp4" },
  { id: "03", title: "Behind the scenes", why: "The work customers never get to see.", client: "VentSolve", full: "/videos/portfolio-2026/ventsolve-on-site.mp4" },
  { id: "04", title: "Step inside", why: "What it feels like to walk through your door.", client: "Amber Oxygen Therapy", full: "/videos/case-studies/amber-look-inside.mp4" },
  { id: "05", title: "The details", why: "Close-ups that show the care in your work.", client: "Amber Oxygen Therapy", full: "/videos/case-studies/amber-little-details.mp4" },
  { id: "06", title: "A customer question", why: "The question you answer every week, answered once on camera.", client: "Balbriggan Braces", full: "/videos/portfolio-2026/braces-hot-drinks.mp4" },
  { id: "07", title: "The person behind it", why: "Why people trust you, not just what you sell.", client: "Perfect Clean", full: "/videos/case-studies/perfect-clean.mp4" },
  { id: "08", title: "An invitation", why: "A clear reason to visit, call or book this month.", client: "SG Studios Dublin", full: "/videos/portfolio-2026/sg-studios-short.mp4" },
];

// The eight photos from the same morning. Images are NextVision photography.
export const sprintPhotos = [
  { title: "Your products", why: "Clean product shots for your website and posts.", image: "/images/photography/thumbs/product-photography-dublin.jpg" },
  { title: "Food and drink", why: "What you serve, shot to make people hungry.", image: "/images/photography/thumbs/food-drink-photography-dublin.jpg" },
  { title: "The team at work", why: "Real people doing the real job.", image: "/images/photography/thumbs/brand-photography-social-content-dublin.jpg" },
  { title: "Your space", why: "The room your customers walk into.", image: "/images/photography/thumbs/hospitality-brand-photography-dublin.jpg" },
  { title: "Owner portrait", why: "A face for your About page and profile.", image: "/images/photography/thumbs/creative-portrait-photography-dublin.jpg" },
  { title: "Close-up detail", why: "The finish and care, up close.", image: "/images/photography/thumbs/automotive-detail-photography-dublin.jpg" },
  { title: "Team portrait", why: "For LinkedIn, Google and your website.", image: "/images/photography/thumbs/corporate-photography-dublin.jpg" },
  { title: "A busy moment", why: "Proof that people choose you.", image: "/images/photography/thumbs/event-photography-dublin.jpg" },
];

// The shoot morning. Minutes are counted from 09:00 and drive the clock.
export const shootSteps = [
  { at: 0, time: "09:00", title: "Set-up", text: "Light, camera and the running order. Your doors stay open." },
  { at: 30, time: "09:30", title: "You on camera", text: "30 to 60 minutes with the lines we planned together. We prompt you, so nothing needs learning." },
  { at: 90, time: "10:30", title: "Your work", text: "Your service, products and process, filmed while you get on with the day." },
  { at: 150, time: "11:30", title: "Details and space", text: "Close-ups, the room and the 8 photos." },
  { at: 210, time: "12:30", title: "Customers and wrap", text: "Atmosphere where it suits. The first edited video reaches you within 48 hours." },
];

// Shown under the four "What €690 covers" tiles (videos, photos, plan, morning).
export const extras = [
  "One round of changes on the whole set",
  "Travel anywhere in Dublin and North Dublin",
  "Yours to post and to use in ads",
];

// Owner confirms these before the page goes live.
export const promises = [
  "Approve the plan before we film, or get the deposit back",
  "Free re-edit if a video misses the agreed plan",
];

export const faq = [
  { q: "Do I have to be on camera?", a: "No. Some businesses use one person on camera, others only show hands, products and the team. We plan it around what you're comfortable with." },
  { q: "Do I need the whole morning free?", a: "No. We need you for 30 to 60 minutes. The rest of the time we film while your business runs as normal." },
  { q: "When do I get the videos?", a: "The first edited video within 48 hours of the shoot, and the full set of 8 videos and 8 photos within 7 days." },
  { q: "Can I use the videos in ads?", a: "Yes. They are yours to post and to use in Facebook, Instagram, TikTok and Google ads." },
  { q: "How do I pay?", a: "€200 holds your morning once you've approved the plan. The other €490 is due after you've watched your videos." },
  { q: "What if I want this every month?", a: "Ask on the call. We'll quote a monthly plan with the same shoot-and-plan approach." },
];

export const proof = [
  { value: "816,122+", label: "views on videos we've made for clients" },
  { value: "816+", label: "pieces of content published" },
];

// Same Irish client set and assets as the home page logo rail.
export const clientLogos = [
  { src: "/images/clients/collen-optimized.svg", alt: "Collen Construction", width: 483, height: 107, light: true },
  { src: "/orbit/assets/ventsolve.webp", alt: "VentSolve", width: 200, height: 100 },
  { src: "/orbit/assets/perfect-clean.png", alt: "Perfect Clean", width: 200, height: 100 },
  { src: "/orbit/assets/gut-fest-340.webp", alt: "Gut Fest", width: 200, height: 100 },
  { src: "/orbit/assets/leroys-340.webp", alt: "Leroy's Barking World", width: 200, height: 100 },
  { src: "/images/clients/amber-oxygen.svg", alt: "Amber Oxygen Therapy", width: 200, height: 100 },
  { src: "/orbit/assets/balbriggan-braces.png", alt: "Balbriggan Braces", width: 200, height: 100 },
  { src: "/orbit/assets/sg-studios-logo.png", alt: "SG Studios Dublin", width: 240, height: 80 },
];
