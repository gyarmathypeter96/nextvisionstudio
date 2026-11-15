interface Slot { starts_at: string; ends_at: string; booked: boolean }
interface BookingDay { date: string; slots: Slot[] }

const form = document.querySelector<HTMLFormElement>("#booking-form")!;
const date = document.querySelector<HTMLSelectElement>("#booking-date")!;
const timeSection = document.querySelector<HTMLFieldSetElement>("#time-section")!;
const times = document.querySelector<HTMLDivElement>("#times")!;
const details = document.querySelector<HTMLFieldSetElement>("#details")!;
const statusLine = document.querySelector<HTMLParagraphElement>("#status")!;
const retry = document.querySelector<HTMLButtonElement>("#retry")!;
const confirmation = document.querySelector<HTMLDivElement>("#confirmation")!;
const dateFormat = new Intl.DateTimeFormat("en-IE", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Dublin" });
const timeFormat = new Intl.DateTimeFormat("en-IE", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: "Europe/Dublin" });
let days: BookingDay[] = [];
let loading = false;
let submitting = false;

function dateLabel(day: string) {
  return dateFormat.format(new Date(day + "T12:00:00Z"));
}

function timeLabel(slot: Slot) {
  return timeFormat.format(new Date(slot.starts_at)) + "–" + timeFormat.format(new Date(slot.ends_at));
}

function syncDetails() {
  const selected = times.querySelector<HTMLInputElement>("input:checked");
  details.hidden = !selected;
  details.disabled = !selected;
}

function renderTimes(keep = "") {
  const choice = days.find(day => day.date === date.value);
  timeSection.hidden = !choice;
  times.replaceChildren(...(choice?.slots ?? []).map(slot => {
    const wrapper = document.createElement("label");
    wrapper.className = "option";
    const input = document.createElement("input");
    Object.assign(input, {
      type: "radio", name: "starts_at", value: slot.starts_at, required: true,
      disabled: slot.booked, checked: !slot.booked && slot.starts_at === keep,
    });
    const label = document.createElement("span");
    label.textContent = timeLabel(slot);
    if (slot.booked) {
      const booked = document.createElement("small");
      booked.textContent = "Booked";
      label.append(booked);
    }
    wrapper.append(input, label);
    return wrapper;
  }));
  syncDetails();
}

async function refreshAvailability({ message = "" } = {}) {
  if (loading) return;
  loading = true;
  retry.hidden = true;
  const priorDate = date.value;
  const priorTime = times.querySelector<HTMLInputElement>("input:checked")?.value;
  date.disabled = true;
  times.inert = true;
  const reserve = details.querySelector("button")!;
  reserve.disabled = true;
  statusLine.textContent = "Loading availability…";
  try {
    const response = await fetch("/christmas-booking-api/slots/", { cache: "no-store" });
    if (!response.ok) throw new Error();
    const result = await response.json();
    if (!Array.isArray(result.days)) throw new Error();
    days = result.days;
    date.replaceChildren(new Option("Select a weekday", ""), ...days.map(day => {
      const full = day.slots.every(slot => slot.booked);
      return new Option(dateLabel(day.date) + (full ? " (Booked)" : ""), day.date);
    }));
    if (days.some(day => day.date === priorDate)) date.value = priorDate;
    renderTimes(priorTime);
    date.disabled = !days.length;
    statusLine.textContent = message || (days.length ? "" : "Online bookings have closed. Contact us to ask about another date.");
  } catch {
    if (message) renderTimes();
    statusLine.textContent = "Availability is temporarily unavailable. Try again or contact us on WhatsApp.";
    retry.hidden = false;
  } finally {
    times.inert = false;
    reserve.disabled = date.disabled;
    loading = false;
  }
}

date.addEventListener("change", () => {
  statusLine.textContent = "";
  renderTimes();
});
times.addEventListener("change", () => {
  statusLine.textContent = "";
  syncDetails();
});
retry.addEventListener("click", () => void refreshAvailability());

form.addEventListener("submit", async event => {
  event.preventDefault();
  if (submitting || loading || date.disabled) return;

  const submission = Object.fromEntries(new FormData(form));
  const reserve = details.querySelector("button")!;
  submitting = true;
  reserve.disabled = true;
  date.inert = true;
  times.inert = true;
  statusLine.textContent = "Saving your booking…";
  try {
    const response = await fetch("/christmas-booking-api/reserve/", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(submission),
    });
    const result = await response.json();
    if (response.status === 409) {
      await refreshAvailability({ message: result.message });
      return;
    }
    if (!response.ok) {
      const errors = Object.values(result.errors ?? {}).flat();
      statusLine.textContent = errors[0] as string || (response.status === 429
        ? "Too many attempts. Wait a minute and try again."
        : "We couldn’t save the booking. Try again or contact us on WhatsApp.");
      return;
    }

    document.querySelector("#confirmation-slot")!.textContent = dateLabel(date.value) + ", " + timeLabel(result);
    document.querySelector("#confirmation-reference")!.textContent = "Booking reference " + result.reference;
    document.querySelector<HTMLParagraphElement>("#confirmation-email")!.hidden = !result.confirmation_email_enabled;
    form.reset();
    form.hidden = true;
    confirmation.hidden = false;
    confirmation.querySelector("h3")!.focus();
  } catch {
    statusLine.textContent = "We couldn’t confirm the result. Contact us on WhatsApp before trying again.";
    retry.hidden = false;
  } finally {
    reserve.disabled = date.disabled;
    date.inert = false;
    times.inert = false;
    submitting = false;
  }
});
window.addEventListener("pageshow", event => {
  if (event.persisted && !submitting && !form.hidden) void refreshAvailability();
});
void refreshAvailability();
