import { createAttributionTracker } from './attribution';
import type {
  AnalyticsConfig,
  AnalyticsDeployment,
  AnalyticsEventName,
  AnalyticsEventPayloads,
  AnalyticsProperties,
  AnalyticsProperty,
  AttributionState,
} from './types';

const SCRIPT_ID = 'analytics-umami-script';
const MAX_QUEUE_SIZE = 50;
const MAX_STRING_LENGTH = 100;
const MAX_PATH_LENGTH = 256;
const UMAMI_WEBSITE_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const EVENT_KEYS: Record<AnalyticsEventName, readonly string[]> = {
  page_view: ['path', 'page_name', 'page_type'],
  search: ['action', 'query_length', 'result_count', 'selected_slug'],
  play: ['algorithm', 'trigger', 'step_index'],
  input_apply: ['algorithm', 'item_count'],
  quiz_complete: ['algorithm', 'correct', 'total'],
  share: ['channel', 'path'],
  language_switch: ['from', 'to', 'path'],
};

export type UmamiTrack = (
  eventOrBuilder: string | ((properties: Record<string, unknown>) => Record<string, unknown>),
  data?: AnalyticsProperties,
) => void;

export interface UmamiTracker {
  track: UmamiTrack;
}

export interface AnalyticsRuntime {
  document: Document;
  location: { href: string; hostname: string };
  referrer: string;
  storage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
  getUmami: () => UmamiTracker | undefined;
}

interface QueuedEvent {
  name: AnalyticsEventName;
  properties: AnalyticsProperties;
  attribution: AttributionState;
  path: string;
  title: string;
}

type ClientState = 'idle' | 'loading' | 'ready' | 'disabled';

function resolveDeployment(mode: string, baseUrl: string): AnalyticsDeployment {
  if (mode === 'development' || mode === 'test') return 'development';
  return baseUrl.startsWith('/algorithms-visualization') ? 'pages' : 'selfhost';
}

function readAnalyticsConfig(): AnalyticsConfig {
  const deployment = resolveDeployment(import.meta.env.MODE, import.meta.env.BASE_URL);
  if (import.meta.env.VITE_ANALYTICS_PROVIDER !== 'umami') {
    return { provider: 'none', deployment };
  }
  return {
    provider: 'umami',
    deployment,
    scriptUrl: import.meta.env.VITE_UMAMI_SCRIPT_URL ?? '',
    websiteId: import.meta.env.VITE_UMAMI_WEBSITE_ID ?? '',
  };
}

function validConfig(
  config: AnalyticsConfig,
): config is Extract<AnalyticsConfig, { provider: 'umami' }> {
  if (config.provider !== 'umami' || !UMAMI_WEBSITE_ID_PATTERN.test(config.websiteId)) {
    return false;
  }
  try {
    return new URL(config.scriptUrl).protocol === 'https:';
  } catch {
    return false;
  }
}

function sanitizePath(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  try {
    const path = new URL(value, 'https://analytics.invalid').pathname;
    if (!path.startsWith('/') || path.length > MAX_PATH_LENGTH) return undefined;
    return path;
  } catch {
    return undefined;
  }
}

function sanitizeProperty(key: string, value: unknown): AnalyticsProperty | undefined {
  if (key === 'path') return sanitizePath(value);
  if (typeof value === 'string') {
    const normalized = value.trim();
    return normalized && normalized.length <= MAX_STRING_LENGTH ? normalized : undefined;
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.min(1_000_000, Math.max(0, Math.trunc(value)));
  }
  if (typeof value === 'boolean') return value;
  return undefined;
}

function sanitizePayload(
  name: AnalyticsEventName,
  payload: AnalyticsEventPayloads[AnalyticsEventName],
): AnalyticsProperties {
  const source = payload as unknown as Record<string, unknown>;
  const result: AnalyticsProperties = {};
  for (const key of EVENT_KEYS[name]) {
    const value = sanitizeProperty(key, source[key]);
    if (value !== undefined) result[key] = value;
  }
  return result;
}

function pageViewUrl(path: string, state: AttributionState): string {
  const url = new URL(path, 'https://analytics.invalid');
  const touch = state.current;
  if (touch.source !== 'direct' || touch.medium !== 'none') {
    url.searchParams.set('utm_source', touch.source);
    url.searchParams.set('utm_medium', touch.medium);
    if (touch.campaign) url.searchParams.set('utm_campaign', touch.campaign);
    if (touch.content) url.searchParams.set('utm_content', touch.content);
  }
  return `${url.pathname}${url.search}`;
}

function pageViewReferrer(state: AttributionState): string {
  const touch = state.current;
  return touch.medium === 'referral' ? `https://${touch.source}/` : '';
}

function runtimePath(url: URL, deployment: AnalyticsDeployment): string {
  let path = url.pathname;
  const pagesBase = '/algorithms-visualization';
  if (deployment === 'pages' && (path === pagesBase || path.startsWith(`${pagesBase}/`))) {
    path = path.slice(pagesBase.length) || '/';
  }
  return sanitizePath(path) ?? '/';
}

export function createAnalyticsClient(config: AnalyticsConfig, runtime: AnalyticsRuntime) {
  let state: ClientState = 'idle';
  const queue: QueuedEvent[] = [];
  const attribution = createAttributionTracker(runtime.storage);

  function disable(): void {
    state = 'disabled';
    queue.length = 0;
  }

  function send(event: QueuedEvent): void {
    const umami = runtime.getUmami();
    if (!umami) {
      disable();
      return;
    }
    try {
      const url = pageViewUrl(event.path, event.attribution);
      const context = {
        url,
        title: event.title,
        referrer: pageViewReferrer(event.attribution),
      };
      if (event.name === 'page_view') {
        umami.track((defaults) => ({
          ...defaults,
          ...context,
        }));
        return;
      }
      umami.track((defaults) => ({
        ...defaults,
        ...context,
        name: event.name,
        data: event.properties,
      }));
    } catch {
      disable();
    }
  }

  function flush(): void {
    if (!runtime.getUmami()) {
      disable();
      return;
    }
    state = 'ready';
    const pending = queue.splice(0);
    for (const event of pending) {
      if (state !== 'ready') break;
      send(event);
    }
  }

  function bindScript(script: HTMLScriptElement): void {
    script.addEventListener('load', flush, { once: true });
    script.addEventListener('error', disable, { once: true });
  }

  function initialize(): boolean {
    if (state === 'ready' || state === 'loading') return true;
    if (state === 'disabled' || !validConfig(config)) {
      disable();
      return false;
    }

    const existing = runtime.document.querySelector<HTMLScriptElement>(`#${SCRIPT_ID}`);
    if (existing) {
      if (runtime.getUmami()) state = 'ready';
      else {
        state = 'loading';
        bindScript(existing);
      }
      return true;
    }

    const script = runtime.document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = config.scriptUrl;
    script.defer = true;
    script.dataset.websiteId = config.websiteId;
    script.dataset.autoTrack = 'false';
    script.dataset.doNotTrack = 'true';
    script.dataset.domains = 'algo.illegalscreed.cn,illegalcreed.github.io';
    bindScript(script);
    state = 'loading';
    runtime.document.head.append(script);
    return true;
  }

  function track<Name extends AnalyticsEventName>(
    name: Name,
    payload: AnalyticsEventPayloads[Name],
  ): void {
    if (state === 'idle' && !initialize()) return;
    if (state === 'disabled') return;

    let currentUrl: URL;
    try {
      currentUrl = new URL(runtime.location.href);
    } catch {
      return;
    }
    const attributionState = attribution.capture(
      currentUrl,
      runtime.referrer,
      runtime.location.hostname,
    );
    const properties: AnalyticsProperties = {
      ...sanitizePayload(name, payload),
      deployment: config.deployment,
    };
    const event: QueuedEvent = {
      name,
      properties,
      attribution: attributionState,
      path:
        name === 'page_view' && typeof properties['path'] === 'string'
          ? properties['path']
          : runtimePath(currentUrl, config.deployment),
      title: runtime.document.title,
    };

    if (state === 'ready') {
      send(event);
      return;
    }
    queue.push(event);
    if (queue.length > MAX_QUEUE_SIZE) queue.shift();
  }

  return { initialize, track };
}

let defaultClient: ReturnType<typeof createAnalyticsClient> | undefined;

function getDefaultClient(): ReturnType<typeof createAnalyticsClient> | undefined {
  if (defaultClient) return defaultClient;
  if (typeof window === 'undefined' || typeof document === 'undefined') return undefined;

  let storage: Storage | undefined;
  try {
    storage = window.sessionStorage;
  } catch {
    storage = undefined;
  }
  defaultClient = createAnalyticsClient(readAnalyticsConfig(), {
    document,
    location: window.location,
    referrer: document.referrer,
    storage,
    getUmami: () => (window as typeof window & { umami?: UmamiTracker }).umami,
  });
  return defaultClient;
}

export function initializeAnalytics(): boolean {
  return getDefaultClient()?.initialize() ?? false;
}

export function trackEvent<Name extends AnalyticsEventName>(
  name: Name,
  payload: AnalyticsEventPayloads[Name],
): void {
  getDefaultClient()?.track(name, payload);
}
