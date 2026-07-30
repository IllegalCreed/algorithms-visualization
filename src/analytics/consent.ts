export const ANALYTICS_CONSENT_STORAGE_KEY = 'illegalcreed.analytics-consent.v1';
export const ANALYTICS_CONSENT_EVENT = 'illegalcreed:analytics-consent';

export type AnalyticsConsent = 'unset' | 'granted' | 'denied';

export interface ConsentStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

function isStoredConsent(value: unknown): value is Exclude<AnalyticsConsent, 'unset'> {
  return value === 'granted' || value === 'denied';
}

export function getBrowserConsentStorage(): ConsentStorage | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

export function readAnalyticsConsent(
  storage: Pick<ConsentStorage, 'getItem'> | undefined = getBrowserConsentStorage(),
): AnalyticsConsent {
  if (!storage) return 'unset';
  try {
    const value = storage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
    return isStoredConsent(value) ? value : 'unset';
  } catch {
    return 'unset';
  }
}

export function writeAnalyticsConsent(
  consent: Exclude<AnalyticsConsent, 'unset'>,
  storage: Pick<ConsentStorage, 'setItem'> | undefined = getBrowserConsentStorage(),
  eventTarget: EventTarget | undefined = typeof window === 'undefined' ? undefined : window,
): boolean {
  if (!storage) return false;
  try {
    storage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, consent);
  } catch {
    return false;
  }

  try {
    eventTarget?.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: consent }));
  } catch {
    // The persisted choice remains authoritative if an old browser cannot dispatch CustomEvent.
  }
  return true;
}

export function subscribeAnalyticsConsent(
  listener: (consent: AnalyticsConsent) => void,
  eventTarget: EventTarget | undefined = typeof window === 'undefined' ? undefined : window,
): () => void {
  if (!eventTarget) return () => undefined;

  const handleConsent = (event: Event) => {
    const detail = event instanceof CustomEvent ? event.detail : undefined;
    listener(isStoredConsent(detail) ? detail : 'unset');
  };
  eventTarget.addEventListener(ANALYTICS_CONSENT_EVENT, handleConsent);
  return () => eventTarget.removeEventListener(ANALYTICS_CONSENT_EVENT, handleConsent);
}
