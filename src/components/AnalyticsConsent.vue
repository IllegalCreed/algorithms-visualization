<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import {
  readAnalyticsConsent,
  writeAnalyticsConsent,
  type AnalyticsConsent,
} from '@/analytics/consent';

const route = useRoute();
const consent = ref<AnalyticsConsent>(readAnalyticsConsent());
const isOpen = ref(consent.value === 'unset');
const isEnglish = computed(() => route.path === '/en' || route.path.startsWith('/en/'));

const copy = computed(() =>
  isEnglish.value
    ? {
        title: 'Optional analytics',
        body: 'Allow page views only? We do not send searches, algorithm inputs, playback, quiz, or sharing events.',
        accept: 'Allow',
        reject: 'Decline',
        preferences: 'Privacy settings',
        privacy: 'Privacy policy',
        privacyHref: 'https://illegalscreed.cn/privacy',
      }
    : {
        title: '可选访问统计',
        body: '是否允许仅统计页面浏览？不会发送搜索词、算法输入、播放、测验或分享事件。',
        accept: '允许',
        reject: '拒绝',
        preferences: '隐私设置',
        privacy: '隐私政策',
        privacyHref: 'https://illegalscreed.cn/zh/privacy',
      },
);

function choose(nextConsent: Exclude<AnalyticsConsent, 'unset'>) {
  if (!writeAnalyticsConsent(nextConsent)) return;
  consent.value = nextConsent;
  isOpen.value = false;
}
</script>

<template>
  <aside
    v-if="isOpen"
    class="analytics-consent"
    data-testid="analytics-consent-panel"
    :aria-label="copy.title"
  >
    <div class="analytics-consent__copy">
      <strong>{{ copy.title }}</strong>
      <span>{{ copy.body }}</span>
      <a :href="copy.privacyHref" target="_blank" rel="noopener noreferrer">
        {{ copy.privacy }}
      </a>
    </div>
    <div class="analytics-consent__actions">
      <button type="button" data-choice="denied" @click="choose('denied')">
        {{ copy.reject }}
      </button>
      <button
        type="button"
        class="analytics-consent__primary"
        data-choice="granted"
        @click="choose('granted')"
      >
        {{ copy.accept }}
      </button>
    </div>
  </aside>

  <button
    v-else
    type="button"
    class="analytics-preferences"
    data-testid="analytics-preferences"
    @click="isOpen = true"
  >
    {{ copy.preferences }}
  </button>
</template>

<style scoped lang="less">
.analytics-consent {
  position: fixed;
  z-index: 1200;
  right: 24px;
  bottom: 24px;
  left: 24px;
  display: flex;
  max-width: 760px;
  margin: 0 auto;
  padding: 16px 18px;
  gap: 20px;
  align-items: center;
  justify-content: space-between;
  color: @font-color;
  background: @neumorphis-background;
  border: 1px solid fade(@font-color, 16%);
  border-radius: 12px;
  box-shadow: 0 10px 32px rgb(0 0 0 / 20%);
}

.analytics-consent__copy {
  display: grid;
  gap: 5px;
  font-size: 14px;
  line-height: 1.45;

  a {
    width: fit-content;
    color: inherit;
    text-underline-offset: 3px;
  }
}

.analytics-consent__actions {
  display: flex;
  flex: none;
  gap: 10px;

  button {
    min-height: 44px;
    padding: 0 16px;
    color: inherit;
    background: transparent;
    border: 1px solid fade(@font-color, 25%);
    border-radius: 8px;
    cursor: pointer;
  }
}

.analytics-consent__actions .analytics-consent__primary {
  color: @neumorphis-background;
  background: @font-color;
}

.analytics-preferences {
  position: fixed;
  z-index: 1100;
  right: 14px;
  bottom: 14px;
  min-height: 44px;
  padding: 7px 12px;
  color: @font-color;
  background: fade(@neumorphis-background, 92%);
  border: 1px solid fade(@font-color, 22%);
  border-radius: 999px;
  cursor: pointer;
}

@media (max-width: 720px) {
  .analytics-consent {
    right: 10px;
    bottom: calc(10px + env(safe-area-inset-bottom));
    left: 10px;
    max-height: calc(100dvh - 20px);
    padding: 14px;
    overflow-y: auto;
    align-items: stretch;
    flex-direction: column;
    gap: 12px;
  }

  .analytics-consent__actions {
    justify-content: stretch;

    button {
      flex: 1;
    }
  }
}

@media (max-height: 500px) and (orientation: landscape) {
  .analytics-consent {
    flex-direction: row;
    align-items: center;
    padding: 8px 12px;
    gap: 12px;
  }

  .analytics-consent__copy {
    gap: 2px;
    font-size: 12px;
    line-height: 1.3;
  }

  .analytics-consent__actions {
    flex: 0 0 auto;
  }
}
</style>
