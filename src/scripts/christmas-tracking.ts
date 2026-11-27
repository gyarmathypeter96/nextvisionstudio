// Meta Pixel events for the Christmas landing page. They only fire when the
// visitor accepted optional cookies and is not excluded (owner opt-out, or a
// host outside ANALYTICS_HOSTS), the same rules TagManager.astro uses before
// it loads the pixel at all.

type MetaParams = Record<string, string | number>;

// Only the globals this file touches (TagManager.astro sets them up).
interface TrackingWindow {
  dataLayer?: unknown[];
  nvsTrackingExcluded?: boolean;
  fbq?: (...args: unknown[]) => void;
}

// What a confirmed Christmas session is worth, reported as the Lead value.
export const CHRISTMAS_SESSION_VALUE = 150;

const trackingWindow = window as unknown as TrackingWindow;

function measurementAllowed() {
  try {
    return !trackingWindow.nvsTrackingExcluded && window.localStorage.getItem("nvs-cookie-consent") === "granted";
  } catch {
    // Storage blocked: treat as no consent.
    return false;
  }
}

function sendMetaEvent(event: string, params: MetaParams, eventID?: string) {
  if (typeof trackingWindow.fbq !== "function") return;
  try {
    // The eventID lets Meta drop a duplicate of the same booking.
    if (eventID) trackingWindow.fbq("track", event, params, { eventID });
    else trackingWindow.fbq("track", event, params);
  } catch {
    // Measurement is optional; never let it break the page.
  }
}

function pushDataLayer(payload: Record<string, unknown>) {
  if (Array.isArray(trackingWindow.dataLayer)) trackingWindow.dataLayer.push(payload);
}

// A booking the CRM has saved. `reference` is the NV-CH-… booking number.
export function trackConfirmedBooking(reference: string) {
  if (!measurementAllowed()) return;

  pushDataLayer({
    event: "generate_lead",
    lead_source: "christmas_photoshoot",
    form_type: "booking",
    form_id: "christmas-booking",
    form_location: "christmas-photoshoot",
    service_interest: "christmas_photoshoot",
    value: CHRISTMAS_SESSION_VALUE,
    currency: "EUR",
    booking_reference: reference,
  });

  sendMetaEvent("Lead", {
    value: CHRISTMAS_SESSION_VALUE,
    currency: "EUR",
    content_name: "Christmas photoshoot",
    content_category: "christmas_photoshoot",
  }, reference);
}

// Every WhatsApp link on the page counts as a Contact, wherever it sits.
document.addEventListener("click", event => {
  const link = (event.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href^="https://wa.me/"]');
  if (!link || !measurementAllowed()) return;

  pushDataLayer({ event: "click_whatsapp", contact_method: "whatsapp", form_location: "christmas-photoshoot" });
  sendMetaEvent("Contact", {
    content_name: "Christmas photoshoot WhatsApp",
    content_category: "christmas_photoshoot",
  });
});
