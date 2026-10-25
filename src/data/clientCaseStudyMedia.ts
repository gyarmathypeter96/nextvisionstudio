// Populate only with Peter's selected client material. Leave unselected slots empty.
// Width and height must be the actual image dimensions; alt describes the image.
export interface CaseStudyImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

export const clientCaseStudyMedia: Record<
  "amber" | "braces" | "perfectClean",
  Partial<Record<"hero" | "detail" | "work", CaseStudyImage>>
> = {
  amber: {},
  braces: {},
  perfectClean: {},
};
