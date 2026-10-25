# Client case studies — approved release, 25 October 2026

Peter initially requested construction only, then explicitly approved publication of the completed image-backed version on 25 October 2026. The release removes the preview status and sitemap exclusions for all three pages. The earlier draft commits remain in history.

The new pages are Amber Oxygen Therapy, Balbriggan Braces and Perfect Clean under `/case-studies/`. Peter's later request prioritised concise copy and a cleaner visual presentation. The pages now use `ClientCaseStudyPage.astro`, with short project sections, photographs, video frames and two related projects. Incoming links from relevant services, five articles and the Balbriggan area page remain. Event videography retains its event-specific examples.

## Adding Peter's images

Use `src/data/clientCaseStudyMedia.ts`. Each project has optional `hero`, `detail` and `work` entries. An entry contains a local public `src`, accurate `alt`, actual `width` and `height`, and optional `caption`. Add the selected image files under `public/images/case-studies/`.

The hero feeds the case-study opening, social metadata, Article image and the collection card. The other entries fill the two-image gallery. Nine WebP assets are installed, about 630 KiB in total: three original Amber photographs and six frames from the clients' existing video edits. Captions identify video frames. Original downloads and extraction records remain outside the public repository in the private project handover folder.

No client video player or VideoObject is created without a selected public video and verified metadata. No customer quote, campaign return, lead count, project fee or medical outcome has been invented.

## Release validation

1. Review the selected images and copy. Confirm permitted media use and select public video examples if a player is to be added.
2. Peter's publication approval has been received for these three case studies. It does not authorise unseen Google Business Profile posts or other outgoing messages.
3. `previewOnly` is disabled on the three pages, their exclusions are removed from `src/pages/sitemap.xml.ts`, and accurate publication/update dates are set. The existing full-site check catches mismatched sitemap/robots settings.
4. Build and run the repository's indexability, SEO, service-content and other required CI checks. Review the layouts at desktop and mobile widths.

The earlier temporary `noindex, follow` and sitemap exclusions were draft safeguards. The approved release is indexable and linked from the existing service and article pages.
