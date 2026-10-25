# Client case studies — local drafts, 25 October 2026

Peter requested construction only. Do not push, create a hosted preview, merge or deploy this branch without new publication approval.

The new pages are Amber Oxygen Therapy, Balbriggan Braces and Perfect Clean under `/case-studies/`. They have distinct long-form copy, contextual links, collection cards and incoming links from relevant services, five articles and the Balbriggan area page. Event videography retains its event-specific examples.

## Adding Peter's images

Use `src/data/clientCaseStudyMedia.ts`. Each project has optional `hero`, `detail` and `work` entries. An entry contains a local public `src`, accurate `alt`, actual `width` and `height`, and optional `caption`. Add the selected image files under `public/images/case-studies/`.

The hero feeds the case-study opening, social metadata, Article image and the collection card. The other entries replace the two labelled image slots. Until then the slots are text panels, without broken image URLs or another client's photographs.

No client video player or VideoObject is created without a selected public video and verified metadata. No customer quote, campaign return, lead count, project fee or medical outcome has been invented.

## Before any separately approved release

1. Select the actual client images and public video examples; confirm factual copy and permitted media use.
2. Obtain Peter's approval to publish the completed version.
3. Change `previewOnly` on the three pages, remove their exclusions from `src/pages/sitemap.xml.ts`, and add accurate content-update dates. The existing full-site check catches mismatched sitemap/robots settings.
4. Build and run the repository's indexability, SEO, service-content and other required CI checks. Review the layouts at desktop and mobile widths.

The temporary `noindex, follow` and sitemap exclusion protect the draft state. They are not access control; the current local-only branch is what keeps these drafts unpublished.
