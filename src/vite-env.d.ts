/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ANALYTICS_PROVIDER?: 'none' | 'umami';
  readonly VITE_UMAMI_SCRIPT_URL?: string;
  readonly VITE_UMAMI_WEBSITE_ID?: string;
}
