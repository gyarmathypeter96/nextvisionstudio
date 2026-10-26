# Website behavior measurement

Updated 26 October 2026. GA4 G-KNFH3LFFLY and Clarity ylqu4w3rot load through GTM-PL34N8WF on the two live hostnames only, after the existing cookie choice. Preview and browser owner opt-out visits remain excluded.

## Event contract

| Event | Meaning | Main parameters |
| --- | --- | --- |
| measurement_ready | Consented page behavior measurement has started; not a page view | measurement_traffic, measurement_version, page_type |
| ui_click | A link, button, summary or ARIA button was clicked | element_name, interaction_type, target_path, section_id |
| scroll_depth | First document-depth threshold visible per page: 25/50/75/90/100 | scroll_percent, section_id |
| scroll_stop | No scroll event for 1.2 seconds while foregrounded; not a proven exit | scroll_percent, max_scroll_percent, section_id, elapsed_seconds |
| section_view | A section occupies at least 35% of the smaller of its height and viewport for one sampled second | section_id |
| page_attention | Non-overlapping foreground time, sent every 15 seconds and on blur/hidden/pagehide | visible_seconds, total_visible_seconds, elapsed_seconds, max_scroll_percent, scroll_percent, seconds_since_scroll, checkpoint_reason, section_id |
| portfolio_video_start/pause/progress/complete | Native controls-enabled portfolio player, excluding autoplay/loop backgrounds | video_title, video_path, video_current_time, video_duration, video_percent |

Existing CTA/contact/form events and CRM-receipt-confirmed generate_lead stay on their existing GTM route. Custom behavior uses the already-loaded Google tag with an explicit GA4 destination, so these events do not fan out to Ads or Meta. It does not add another config, page_view or user_engagement event. Automatic GA4 scroll (90%), click (outbound), form_start/form_submit and YouTube events have different meanings from our events: never sum them together as if they were additional people or additional leads. A native-video milestone indicates a playback position was reached, including seeking; it does not prove every preceding second was watched.

Only `generate_lead` is the website's active enquiry key event. It requires an accepted CRM receipt. Behavior events must not be marked as leads. No real enquiry is necessary for routine behavior QA.

## Reading time correctly

`visible_seconds` is the additive metric: sum it, then divide by matching page views or sessions where appropriate. `total_visible_seconds` is a cumulative per-page diagnostic; never sum it. Foreground means the document is visible AND its window has focus. Reading without a click counts. Merely leaving a background tab open does not. Foreground presence is not proof of attention or reading. Consent starts observation; earlier interactions are not reconstructed.

Depth refers to the furthest bottom edge of the document visible, not percentage of scrollable travel. A short page may be fully visible immediately. `scroll_stop` marks a pause, while the last checkpoint and Clarity exit page identify the last observed state. A sudden process kill, offline connection, blocked scripts or denied consent can prevent delivery of a final event. Checkpoints reduce loss; they cannot eliminate it.

## GA4 reporting fields

Event dimensions registered on 26 October 2026: Page section (`section_id`), Scroll depth reached (`scroll_percent`), Maximum scroll depth (`max_scroll_percent`), Clicked element (`element_name`), Click destination (`target_path`), Attention checkpoint (`checkpoint_reason`), Measurement traffic (`measurement_traffic`). Metric: Foreground time (`visible_seconds`, Seconds). Existing form definitions remain.

Custom definitions are not retroactive and can need 24–48 hours to become available in reports. For analysis, filter by the relevant event name, Page path, date and Measurement traffic = visitor. Custom definitions only describe fields; creating them alone does not prove that events were received. Verify using GA4 DebugView/Realtime and Clarity Recordings.

## Clarity

Existing GTM Clarity consentv2, project cookies, bot detection and GA integration are enabled. Clarity covers pointer movements, scrolling, dead clicks and the full reconstructed page journey. Custom scroll, section, UI, portfolio and form events are also sent to its event timeline. Tags distinguish page_type, measurement_version and traffic_type (visitor/qa). Input values remain masked. Do not unmask forms or introduce name/email/user identifiers.

## Owner exclusion and QA

Use `/tracking-preferences/` to exclude the owner's browser, separately on every device. It is a browser-local flag and is not an IP-based data deletion filter. Do not silently exclude visitors or enable an irreversible GA4 filter without validating the matching rule.

A deliberate test run can use `?nvs_debug=1`. It persists a QA flag for the tab session, adds GA4 debug_mode and measurement_traffic=qa, and adds Clarity traffic_type=qa. The small QA overlay shows queued commands, not server receipt. Use `?nvs_debug=0` to stop the test flag. This never bypasses owner exclusion or consent. Exclude QA from business reporting. QA page views are intentionally real measurement test traffic.

## Verification

`npm run build && npm run check:measurement` exercises the real measurement code with isolated browser fixtures. No fixture sends network requests. Tests cover early GTM loading, consent states and withdrawal, preview and owner exclusion, foreground/background timing, exit deduplication, late consent, scroll depth/stop, section dwell, interactive clicks, URL sanitization, native video and real CRM receipt rules. Verify production separately with a marked test visit and provider-side receipt before declaring end-to-end completion.
