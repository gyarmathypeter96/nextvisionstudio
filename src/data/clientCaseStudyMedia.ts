// Original Amber photographs and frames extracted from the clients' finished videos.
// Source records and frame selections are kept in the private project handover notes.
export interface CaseStudyImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

export const clientCaseStudyMedia: Record<
  "amber" | "braces" | "perfectClean",
  { hero: CaseStudyImage; detail?: CaseStudyImage; work?: CaseStudyImage }
> = {
  amber: {
    hero: { src: "/images/case-studies/amber-oxygen-chamber.webp", alt: "Seats and breathing equipment inside the orange-padded Amber Oxygen chamber", width: 1067, height: 1600 },
    detail: { src: "/images/case-studies/amber-oxygen-chamber-detail.webp", alt: "View through the blue-lit entrance of an Amber Oxygen chamber", width: 1067, height: 1600 },
    work: { src: "/images/case-studies/amber-oxygen-room-detail.webp", alt: "A turquoise bottle and an open magazine on a grey seat at Amber Oxygen", width: 1067, height: 1600 },
  },
  braces: {
    hero: { src: "/images/case-studies/balbriggan-braces-rebecca.webp", alt: "Rebecca explaining a dental model in a Balbriggan Braces video", width: 562, height: 1000, caption: "Frame from the Balbriggan Braces video series." },
    detail: { src: "/images/case-studies/balbriggan-braces-aligner-video.webp", alt: "James presenting an aligner model with a timing graphic in the finished video", width: 720, height: 1280, caption: "An aligner explanation with an on-screen graphic." },
    work: { src: "/images/case-studies/balbriggan-braces-crossbite-video.webp", alt: "Jenny demonstrating a dental model above a crossbite illustration in the finished video", width: 720, height: 1280, caption: "A demonstration paired with a dental illustration." },
  },
  perfectClean: {
    hero: { src: "/images/case-studies/perfect-clean-owner.webp", alt: "The Perfect Clean owner speaking to camera in an office", width: 562, height: 1000, caption: "Frame from the Perfect Clean advertising creative." },
    detail: { src: "/images/case-studies/perfect-clean-office-advert.webp", alt: "Office desks shown in a Perfect Clean advertising video", width: 720, height: 1280, caption: "An office scene from a finished advert." },
    work: { src: "/images/case-studies/perfect-clean-advertising-video.webp", alt: "The Perfect Clean owner speaking in the office during an advertising video", width: 720, height: 1280, caption: "The owner delivering the customer-focused message." },
  },
};
