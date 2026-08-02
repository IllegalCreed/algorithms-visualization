import type { AnalyticsConsent } from './consent';
import { normalizeCampaignToken } from './utm';

const GA_MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]{6,20}$/;
const UTM_FIELDS = ['source', 'medium', 'campaign', 'content'] as const;

export interface AnalyticsPage {
  path: string;
  title: string;
}

export interface GoogleAnalyticsOptions {
  enabled: boolean;
  measurementId: string | undefined;
  window: Window;
  document: Document;
  readConsent: () => AnalyticsConsent;
  subscribeConsent: (listener: (consent: AnalyticsConsent) => void) => () => void;
  readPage: () => AnalyticsPage;
  subscribePage: (listener: (page: AnalyticsPage) => void) => () => void;
}

type AnalyticsWindow = Window & {
  dataLayer?: Array<IArguments | unknown[]>;
  gtag?: (...args: unknown[]) => void;
};

function normalizedMeasurementId(value: string | undefined): string | undefined {
  const normalized = value?.trim().toUpperCase();
  return normalized && GA_MEASUREMENT_ID_PATTERN.test(normalized) ? normalized : undefined;
}

export function sanitizePageViewUrl(path: string, origin: string): string {
  const base = new URL(origin);
  const source = new URL(path, base);
  const sanitized = new URL(source.pathname, base.origin);

  for (const field of UTM_FIELDS) {
    const value = normalizeCampaignToken(source.searchParams.get(`utm_${field}`));
    if (value) sanitized.searchParams.set(`utm_${field}`, value);
  }
  return sanitized.toString();
}

export function startGoogleAnalytics(options: GoogleAnalyticsOptions): () => void {
  const measurementId = normalizedMeasurementId(options.measurementId);
  if (!options.enabled || !measurementId) return () => undefined;

  const analyticsWindow = options.window as AnalyticsWindow;
  const disableKey = `ga-disable-${measurementId}`;
  let consent = options.readConsent();
  let initialized = false;
  let lastPath: string | undefined;

  const initialize = () => {
    analyticsWindow.dataLayer ??= [];
    analyticsWindow.gtag ??= function () {
      analyticsWindow.dataLayer ??= [];
      // Google 的官方 gtag snippet 要求把本次调用的 arguments 对象原样入队。
      // eslint-disable-next-line prefer-rest-params
      analyticsWindow.dataLayer.push(arguments);
    };

    if (!initialized) {
      initialized = true;
      analyticsWindow.gtag('js', new Date());
      analyticsWindow.gtag('config', measurementId, {
        send_page_view: false,
        anonymize_ip: true,
      });
    }

    if (!options.document.querySelector('script[data-ga4-measurement-id]')) {
      const script = options.document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
        measurementId,
      )}`;
      script.dataset.ga4MeasurementId = measurementId;
      script.onerror = () => {
        script.remove();
      };
      options.document.head.append(script);
    }
  };

  const sendPageView = (page: AnalyticsPage) => {
    if (consent !== 'granted') return;
    try {
      const pageLocation = sanitizePageViewUrl(page.path, options.window.location.origin);
      const pagePath = new URL(pageLocation).pathname;
      if (pagePath === lastPath) return;

      initialize();
      analyticsWindow.gtag?.('event', 'page_view', {
        page_title: page.title,
        page_location: pageLocation,
        page_path: pagePath,
      });
      lastPath = pagePath;
    } catch {
      // Analytics is optional and must never affect navigation or rendering.
    }
  };

  const applyConsent = (nextConsent: AnalyticsConsent) => {
    consent = nextConsent;
    (analyticsWindow as unknown as Record<string, unknown>)[disableKey] = nextConsent !== 'granted';

    if (nextConsent === 'granted') {
      initialize();
      sendPageView(options.readPage());
      return;
    }
    lastPath = undefined;
  };

  const unsubscribeConsent = options.subscribeConsent(applyConsent);
  const unsubscribePage = options.subscribePage(sendPageView);
  applyConsent(consent);

  return () => {
    unsubscribeConsent();
    unsubscribePage();
  };
}
