import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { initializeAnalytics, trackEvent } from './client';
import type { AnalyticsPageType } from './types';

function pageType(path: string, name: string): AnalyticsPageType {
  if (name === 'home') return 'home';
  if (name === 'complexity' || name === 'paths') return 'guide';
  if (path.startsWith('/docs/') && name !== 'docs') return 'algorithm';
  return 'other';
}

export function useRouteAnalytics(): void {
  const route = useRoute();
  if (!initializeAnalytics()) return;

  watch(
    () => `${String(route.name ?? '')}|${route.path}`,
    () => {
      if (route.name == null) return;
      const name = String(route.name);
      trackEvent('page_view', {
        path: route.path,
        page_name: name,
        page_type: pageType(route.path, name),
      });
    },
    { immediate: true },
  );
}
