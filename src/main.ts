import { createApp, nextTick } from 'vue';
import App from './App.vue';
import { readAnalyticsConsent, subscribeAnalyticsConsent } from './analytics/consent';
import { startGoogleAnalytics } from './analytics/googleAnalytics';
import router from './router';
import pinia from './store';

const app = createApp(App);

app.use(router);
app.use(pinia);

app.mount('#app');

void router.isReady().then(async () => {
  await nextTick();

  startGoogleAnalytics({
    enabled: import.meta.env.PROD,
    measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID,
    window,
    document,
    readConsent: readAnalyticsConsent,
    subscribeConsent: subscribeAnalyticsConsent,
    readPage: () => ({
      path: router.currentRoute.value.fullPath,
      title: document.title,
    }),
    subscribePage: (listener) =>
      router.afterEach(async (to) => {
        await nextTick();
        listener({
          path: to.fullPath,
          title: document.title,
        });
      }),
  });
});
