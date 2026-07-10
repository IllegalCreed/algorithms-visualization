import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { getLanguageSwitchRoute, siteLocaleFromPath } from './pilot';

export function useSiteLocale() {
  const route = useRoute();
  const locale = computed(() => siteLocaleFromPath(route.path));
  const isEnglish = computed(() => locale.value === 'en');
  const homeRoute = computed(() => ({ name: isEnglish.value ? 'en-home' : 'home' }));
  const chineseRoute = computed(() => getLanguageSwitchRoute(route.name, 'zh-CN', route.query));
  const englishRoute = computed(() => getLanguageSwitchRoute(route.name, 'en', route.query));

  return { locale, isEnglish, homeRoute, chineseRoute, englishRoute };
}
