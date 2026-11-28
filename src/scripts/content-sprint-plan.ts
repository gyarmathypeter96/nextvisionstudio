// Example posting plan for the month after "now": 8 videos and 8 photos on
// varied days. Used at build time and again in the browser, so the calendar
// always shows next month (in December it shows January, and so on).
import { sprintVideos, sprintPhotos } from "../data/contentSprint";

export interface PlanItem {
  kind: "video" | "photo";
  title: string;
  why: string;
  image: string;
}

export interface PlanDay {
  day: number;
  weekday: string;
  item?: PlanItem;
}

export interface PostingPlan {
  monthName: string;
  label: string;
  leadingBlanks: number;
  days: PlanDay[];
}

// Day of month and which item goes out. Spread over the month so the posts
// land on different weekdays, and never past the 28th.
const schedule: [number, "video" | "photo", number][] = [
  [2, "video", 0], [3, "photo", 0], [5, "video", 1], [7, "photo", 1],
  [9, "video", 2], [10, "photo", 2], [12, "video", 3], [14, "photo", 3],
  [16, "video", 4], [17, "photo", 4], [19, "video", 5], [21, "photo", 5],
  [23, "video", 6], [24, "photo", 6], [26, "video", 7], [28, "photo", 7],
];

export function buildPlan(now = new Date()): PostingPlan {
  const dublin = new Intl.DateTimeFormat("en-IE", { year: "numeric", month: "numeric", timeZone: "Europe/Dublin" })
    .formatToParts(now);
  const year = Number(dublin.find((part) => part.type === "year")?.value);
  const month = Number(dublin.find((part) => part.type === "month")?.value); // 1-12, current
  const first = new Date(Date.UTC(month === 12 ? year + 1 : year, month % 12, 1, 12));
  const daysInMonth = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0, 12)).getUTCDate();
  const monthName = new Intl.DateTimeFormat("en-IE", { month: "long", timeZone: "UTC" }).format(first);
  const weekdayName = new Intl.DateTimeFormat("en-IE", { weekday: "long", timeZone: "UTC" });
  const items = new Map<number, PlanItem>();
  for (const [day, kind, index] of schedule) {
    const source = kind === "video" ? sprintVideos[index] : sprintPhotos[index];
    items.set(day, {
      kind,
      title: source.title,
      why: source.why,
      image: kind === "video" ? `/images/content-sprint/poster-${sprintVideos[index].id}.webp` : (source as (typeof sprintPhotos)[number]).image,
    });
  }
  return {
    monthName,
    label: `${monthName} ${first.getUTCFullYear()}`,
    leadingBlanks: (first.getUTCDay() + 6) % 7,
    days: Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), i + 1, 12));
      return { day: i + 1, weekday: weekdayName.format(date), item: items.get(i + 1) };
    }),
  };
}
