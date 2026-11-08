export type LeadParameters = Record<string, string | number | undefined>;
export interface PendingLead {
  version: 2;
  destination: string;
  expiresAt: number;
  parameters: LeadParameters;
  statusUrl: string | null;
  confirmed: boolean;
}
export const pendingLeadKey = "nvs-pending-lead";
export const sentLeadKey = "nvs-sent-leads";
export const thankYouPaths = ["/quotesend/", "/website-design-quote/thanks/"];

export function safeStatusUrl(value: unknown, id: string): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    if (url.origin !== "https://crm.nextvisionstudio.com" || url.username || url.password || url.hash) return null;
    if (url.pathname !== `/api/forms/submissions/${id.replace("nvs-form-", "")}/status`) return null;
    if (!/^\d+$/.test(url.searchParams.get("expires") || "") || !/^[a-f0-9]{64}$/.test(url.searchParams.get("signature") || "")) return null;
    return url.href;
  } catch { return null; }
}

// Acceptance is not conversion: the CRM may still reject a saved submission.
export function acceptedReceipt(body: unknown): { id: string; status: string; leadCreated: boolean; statusUrl: string | null } | null {
  if (!body || typeof body !== "object") return null;
  const response = body as Record<string, unknown>;
  const id = String(response.submission_id ?? "");
  const status = String(response.status ?? "");
  if (!/^[1-9]\d{0,19}$/.test(id) || !["received", "verifying", "processing", "processed"].includes(status)) return null;
  const receiptId = `nvs-form-${id}`;
  return { id: receiptId, status, leadCreated: status === "processed" && response.lead_created === true, statusUrl: safeStatusUrl(response.status_url, receiptId) };
}
export function safeThankYouPath(redirect: string, origin: string): string | null {
  try { const url = new URL(redirect, origin); return url.origin === origin && thankYouPaths.includes(url.pathname) ? url.pathname : null; }
  catch { return null; }
}
export function readPendingLead(raw: string | null, pathname: string, now = Date.now()): PendingLead | null {
  if (!raw) return null;
  try {
    const lead = JSON.parse(raw) as PendingLead;
    if (lead.version !== 2 || !thankYouPaths.includes(lead.destination) || lead.destination !== pathname) return null;
    if (!Number.isFinite(lead.expiresAt) || lead.expiresAt <= now || lead.expiresAt > now + 15 * 60 * 1000 || !lead.parameters || typeof lead.parameters !== "object") return null;
    const { lead_id, transaction_id, crm_submission_status } = lead.parameters;
    if (typeof lead_id !== "string" || !/^nvs-form-[1-9]\d{0,19}$/.test(lead_id) || transaction_id !== lead_id) return null;
    if (!["received", "verifying", "processing", "processed"].includes(String(crm_submission_status))) return null;
    if (typeof lead.confirmed !== "boolean" || (lead.confirmed && crm_submission_status !== "processed")) return null;
    if (!lead.confirmed && !safeStatusUrl(lead.statusUrl, lead_id)) return null;
    const keys = ["lead_id", "transaction_id", "crm_submission_status", "lead_source", "form_type", "form_id", "form_location", "service_interest", "form_duration_seconds"];
    if (Object.keys(lead.parameters).some(key => !keys.includes(key))) return null;
    return lead;
  } catch { return null; }
}
