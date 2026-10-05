export type LeadParameters = Record<string, string | number | undefined>;
export interface PendingLead {
  version: 1;
  destination: string;
  expiresAt: number;
  parameters: LeadParameters;
}

export const pendingLeadKey = "nvs-pending-lead";
export const sentLeadKey = "nvs-sent-leads";
export const thankYouPaths = ["/quotesend/", "/website-design-quote/thanks/"];

// A receipt proves that the CRM saved a submission. It does not prove the
// prospect was qualified or that a queued submission has finished processing.
export function acceptedReceipt(body: unknown): { id: string; status: string } | null {
  if (!body || typeof body !== "object") return null;
  const response = body as Record<string, unknown>;
  const id = String(response.submission_id ?? "");
  const status = String(response.status ?? "");
  if (!/^[1-9]\d{0,19}$/.test(id)) return null;
  if (!["received", "verifying", "processing", "processed"].includes(status)) return null;
  return { id: `nvs-form-${id}`, status };
}

export function safeThankYouPath(redirect: string, origin: string): string | null {
  try {
    const url = new URL(redirect, origin);
    return url.origin === origin && thankYouPaths.includes(url.pathname) ? url.pathname : null;
  } catch { return null; }
}

export function readPendingLead(raw: string | null, pathname: string, now = Date.now()): PendingLead | null {
  if (!raw) return null;
  try {
    const lead = JSON.parse(raw) as PendingLead;
    if (lead.version !== 1 || !thankYouPaths.includes(lead.destination)) return null;
    if (lead.destination !== pathname || !Number.isFinite(lead.expiresAt) || lead.expiresAt <= now) return null;
    if (lead.expiresAt > now + 15 * 60 * 1000 || !lead.parameters || typeof lead.parameters !== "object") return null;
    const { lead_id, transaction_id, crm_submission_status } = lead.parameters;
    if (typeof lead_id !== "string" || !/^nvs-form-[1-9]\d{0,19}$/.test(lead_id) || transaction_id !== lead_id) return null;
    if (!["received", "verifying", "processing", "processed"].includes(String(crm_submission_status))) return null;
    // Only explicit non-personal measurement fields may reach the data layer.
    const keys = ["lead_id", "transaction_id", "crm_submission_status", "lead_source", "form_type", "form_id", "form_location", "service_interest", "form_duration_seconds"];
    if (Object.keys(lead.parameters).some((key) => !keys.includes(key))) return null;
    return lead;
  } catch { return null; }
}
