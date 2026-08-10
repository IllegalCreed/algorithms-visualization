<script setup lang="ts">
import { computed } from 'vue';
import { useSiteLocale } from '@/i18n/useSiteLocale';
import { useIconLink } from './hooks';
import IconLinkComp from './IconLink/IconLink.vue';

const emit = defineEmits<{
  navigate: [];
}>();

const { isEnglish, homeRoute, chineseRoute, englishRoute } = useSiteLocale();
const iconLinkData = useIconLink();

const copy = computed(() =>
  isEnglish.value
    ? {
        home: 'Home',
        language: 'Language',
        external: 'More links',
      }
    : {
        home: '首页',
        language: '语言',
        external: '更多链接',
      },
);
</script>

<template>
  <div class="mobile-navigation-actions">
    <RouterLink class="mobile-home-link" :to="homeRoute" @click="emit('navigate')">
      {{ copy.home }}
    </RouterLink>

    <section class="mobile-action-section" :aria-label="copy.language">
      <h3>{{ copy.language }}</h3>
      <nav class="mobile-language-switch" :aria-label="copy.language">
        <RouterLink
          class="locale-option"
          :class="{ active: !isEnglish }"
          :aria-current="!isEnglish ? 'page' : undefined"
          :to="chineseRoute"
          @click="emit('navigate')"
          >ZH</RouterLink
        >
        <RouterLink
          class="locale-option"
          :class="{ active: isEnglish }"
          :aria-current="isEnglish ? 'page' : undefined"
          :to="englishRoute"
          @click="emit('navigate')"
          >EN</RouterLink
        >
      </nav>
    </section>

    <section class="mobile-action-section" :aria-label="copy.external">
      <h3>{{ copy.external }}</h3>
      <div class="mobile-external-links" @click="emit('navigate')">
        <span v-for="item in iconLinkData" :key="item.title">
          <IconLinkComp :data="item" />
        </span>
      </div>
    </section>
  </div>
</template>

<style scoped lang="less">
.mobile-navigation-actions {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 22px 24px 26px;
  border-bottom: 1px solid rgba(107, 125, 114, 0.2);
}

.mobile-home-link {
  align-self: stretch;
  padding: 12px 14px;
  color: #1f5e3a;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  .neumorphism-btn(3px, 10px);
}

.mobile-action-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;

  h3 {
    margin: 0;
    color: #6b7d72;
    font-size: 13px;
    font-weight: bold;
  }
}

.mobile-language-switch {
  display: flex;
  gap: 4px;
  padding: 3px;
  .neumorphism-concave(2px, 8px);

  .locale-option {
    width: 44px;
    height: 44px;
    color: #6b7d72;
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    text-decoration: none;
    .center();
  }

  .locale-option.active {
    color: #1f5e3a;
    .neumorphism-pressed(2px, 6px);
  }
}

.mobile-external-links {
  display: flex;
  gap: 8px;

  :deep(.icon-link) {
    width: 44px;
    height: 44px;
  }
}
</style>
