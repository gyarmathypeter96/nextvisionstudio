# Client case studies — local drafts, 25 October 2026

Peter requested construction only. Do not push, create a hosted preview, merge or deploy this branch without new publication approval.

The new pages are Amber Oxygen Therapy, Balbriggan Braces and Perfect Clean under `/case-studies/`. Peter's later request prioritised concise copy and a cleaner visual presentation. The pages now use `ClientCaseStudyPage.astro`, with short project sections, photographs, video frames and two related projects. Incoming links from relevant services, five articles and the Balbriggan area page remain. Event videography retains its event-specific examples.

## Adding Peter's images

Use `src/data/clientCaseStudyMedia.ts`. Each project has optional `hero`, `detail` and `work` entries. An entry contains a local public `src`, accurate `alt`, actual `width` and `height`, and optional `caption`. Add the selected image files under `public/images/case-studies/`.

The hero feeds the case-study opening, social metadata, Article image and the collection card. The other entries fill the two-image gallery. Nine WebP assets are installed, about 630 KiB in total: three original Amber photographs and six frames from the clients' existing video edits. Captions identify video frames. Original downloads and extraction records remain outside the public repository in the private project handover folder.

No client video player or VideoObject is created without a selected public video and verified metadata. No customer quote, campaign return, lead count, project fee or medical outcome has been invented.

## Before any separately approved release

1. Review the selected images and copy. Confirm permitted media use and select public video examples if a player is to be added.
2. Obtain Peter's approval to publish the completed version.
3. Change `previewOnly` on the three pages, remove their exclusions from `src/pages/sitemap.xml.ts`, and add accurate content-update dates. The existing full-site check catches mismatched sitemap/robots settings.
4. Build and run the repository's indexability, SEO, service-content and other required CI checks. Review the layouts at desktop and mobile widths.

The temporary `noindex, follow` and sitemap exclusion protect the draft state. They are not access control; the current local-only branch is what keeps these drafts unpublished.
