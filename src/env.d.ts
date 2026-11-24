/// <reference types="astro/client" />

// Shared browser measurement API. Tags themselves still require host and consent checks.
interface Window {
  nvsTrackingExcluded?: boolean;
  nvsLoadTagManager?: () => void;
  nvsSafeAnalyticsUrl?: (value: string, base: string, keepCampaign?: boolean) => string | null;
  dataLayer?: Array<Record<string, unknown> | IArguments>;
  gtag?: (...args: any[]) => void;
  clarity?: (...args: any[]) => void;
}
