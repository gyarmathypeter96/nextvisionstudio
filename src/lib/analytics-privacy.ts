// Self-contained so the same function can run inline before any vendor script.
export function safeAnalyticsUrl(value: string, base: string, keepCampaign = true): string | null {
  try {
    const url = new URL(value, base);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    url.username = ''; url.password = ''; url.hash = '';
    let path = url.pathname;
    try { path = decodeURIComponent(path); } catch { /* Keep a valid URL if its escape sequence is malformed. */ }
    url.pathname = path.replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi, 'redacted').replace(/\+\d[\d ().-]{7,}\d/g, 'redacted');
    const kept = new URLSearchParams();
    if (keepCampaign) for (const [key, raw] of url.searchParams) {
      if (!/^(utm_(source|medium|campaign|content|term)|gclid|gbraid|wbraid|fbclid|msclkid)$/.test(key)) continue;
      const value = raw.slice(0, 255);
      if (/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(value) || /^\+?[\d ().-]{8,}$/.test(value) && !/^\d{4}-\d{2}-\d{2}$/.test(value)) continue;
      if (key.endsWith('clid') || ['gbraid', 'wbraid'].includes(key)) {
        if (!/^[a-zA-Z0-9_.-]+$/.test(value)) continue;
      }
      kept.set(key, value);
    }
    url.search = kept.toString();
    return url.href;
  } catch { return null; }
}

export function safeEventLabel(value: string): string {
  return value.replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi, '[email]')
    .replace(/\+?\d[\d ().-]{7,}\d/g, '[number]').replace(/\s+/g, ' ').trim().slice(0, 100);
}

// Delivery retries must not become new enquiries when GA identity arrives late.
export function enquiryIdentity(payload: Record<string, unknown>): string {
  return JSON.stringify(Object.fromEntries(['name', 'email', 'phone', 'company', 'service', 'message', 'value', 'form_id', 'form_source', 'form_page']
    .map(key => [key, payload[key] ?? ''])));
}
