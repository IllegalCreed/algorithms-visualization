<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useIconLink } from './hooks';
import { useSystemStore } from '@/store/modules/system';
import IconLinkComp from './IconLink/IconLink.vue';
import MobileNavigationActions from './MobileNavigationActions.vue';
import { useSiteLocale } from '@/i18n/useSiteLocale';
import {
  focusableElements,
  focusVisibleElement,
  lockAppBackground,
  lockBodyScroll,
  unlockAppBackground,
  unlockBodyScroll,
} from '@/hooks/mobileMenu';

const systemStore = useSystemStore();
const route = useRoute();
const iconLinkData = useIconLink();
const { isEnglish, homeRoute, chineseRoute, englishRoute } = useSiteLocale();

const isDocsRoute = computed(() => {
  const path = route.path ?? '';
  return (
    path === '/docs' ||
    path.startsWith('/docs/') ||
    path === '/en/docs' ||
    path.startsWith('/en/docs/')
  );
});

const copy = computed(() =>
  isEnglish.value
    ? {
        siteName: 'Algorithm Visualizer',
        home: 'Home',
        search: 'Search algorithms (Cmd+K / Ctrl+K)',
        language: 'Choose language',
        menu: isDocsRoute.value ? 'Open table of contents' : 'Open menu',
        closeMenu: 'Close menu',
        mobileNavigation: 'Mobile navigation',
      }
    : {
        siteName: '算法可视化',
        home: '首页',
        search: '搜索算法（⌘K / Ctrl+K）',
        language: '选择语言',
        menu: isDocsRoute.value ? '打开目录' : '打开菜单',
        closeMenu: '关闭菜单',
        mobileNavigation: '移动导航',
      },
);

const menuTriggerRef = ref<HTMLButtonElement | null>(null);
const mobileSheetRef = ref<HTMLElement | null>(null);
let ownsBodyLock = false;
let ownsAppBackground = false;
let mobileMediaQuery: MediaQueryList | null = null;

function closeMobileMenu(): void {
  systemStore.closeMobileMenu();
}

function onSheetKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    event.preventDefault();
    closeMobileMenu();
    return;
  }
  if (event.key !== 'Tab') return;

  const focusables = focusableElements(mobileSheetRef.value);
  if (focusables.length === 0) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function onSheetFocusIn(event: FocusEvent): void {
  if (!systemStore.isMobileMenuOpen || isDocsRoute.value) return;
  const sheet = mobileSheetRef.value;
  const target = event.target;
  if (sheet && target instanceof Node && sheet.contains(target)) return;
  event.preventDefault();
  focusableElements(sheet)[0]?.focus();
}

watch([() => systemStore.isMobileMenuOpen, isDocsRoute], async ([open, docs], previous) => {
  const wasOpen = Boolean(previous?.[0]);
  const wasDocs = Boolean(previous?.[1]);
  if (open && !ownsBodyLock) {
    lockBodyScroll();
    ownsBodyLock = true;
  }
  if (open && !ownsAppBackground) {
    lockAppBackground();
    ownsAppBackground = true;
  }
  if (!open && ownsBodyLock) {
    unlockBodyScroll();
    ownsBodyLock = false;
  }
  if (!open && ownsAppBackground) {
    unlockAppBackground();
    ownsAppBackground = false;
  }

  // Docs owns its drawer focus. Header only moves focus into the home sheet.
  if (open && !docs) {
    await nextTick();
    document.addEventListener('focusin', onSheetFocusIn, true);
    focusableElements(mobileSheetRef.value)[0]?.focus();
  } else if (open && docs) {
    document.removeEventListener('focusin', onSheetFocusIn, true);
  } else if (!open && wasOpen && !wasDocs) {
    document.removeEventListener('focusin', onSheetFocusIn, true);
    await nextTick();
    if (!focusVisibleElement(menuTriggerRef.value)) {
      focusVisibleElement(document.querySelector<HTMLElement>('.search-btn'));
    }
  }
});

function onMobileMediaChange(event: MediaQueryListEvent): void {
  if (!event.matches && systemStore.isMobileMenuOpen) closeMobileMenu();
}

onMounted(() => {
  if (typeof window.matchMedia !== 'function') return;
  mobileMediaQuery = window.matchMedia('(max-width: 899px)');
  mobileMediaQuery.addEventListener('change', onMobileMediaChange);
});

watch(
  () => route.fullPath,
  () => {
    // A route change should never leave a stale mobile surface over the new page.
    if (systemStore.isMobileMenuOpen && !isDocsRoute.value) closeMobileMenu();
  },
);

onBeforeUnmount(() => {
  document.removeEventListener('focusin', onSheetFocusIn, true);
  mobileMediaQuery?.removeEventListener('change', onMobileMediaChange);
  if (ownsBodyLock) unlockBodyScroll();
  if (ownsAppBackground) unlockAppBackground();
});
</script>

<template>
  <div id="header" :class="[systemStore.isShowHeaderShadow ? 'neumorphism-bottom-shadow' : null]">
    <div id="main">
      <RouterLink id="logo" :title="copy.home" :aria-label="copy.home" :to="homeRoute">
        <span>V</span>
      </RouterLink>
      <span class="site-title">{{ copy.siteName }}</span>
      <button
        type="button"
        class="search-btn"
        :title="copy.search"
        :aria-label="copy.search"
        @click="systemStore.openSearch()"
      >
        <svg
          class="sb-icon"
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.4"
          stroke-linecap="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <span class="sb-kbd">⌘K</span>
      </button>
      <div class="blank"></div>

      <button
        id="mobile-menu-trigger"
        ref="menuTriggerRef"
        type="button"
        class="mobile-menu-btn"
        :title="copy.menu"
        :aria-label="copy.menu"
        :aria-controls="isDocsRoute ? 'docs-menu-drawer' : 'mobile-nav-sheet'"
        :aria-expanded="systemStore.isMobileMenuOpen ? 'true' : 'false'"
        @click="systemStore.toggleMobileMenu()"
      >
        <svg
          class="menu-icon"
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
        >
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </svg>
      </button>

      <nav class="language-switch" :aria-label="copy.language">
        <RouterLink
          class="locale-option"
          :class="{ active: !isEnglish }"
          :aria-current="!isEnglish ? 'page' : undefined"
          :to="chineseRoute"
          >ZH</RouterLink
        >
        <RouterLink
          class="locale-option"
          :class="{ active: isEnglish }"
          :aria-current="isEnglish ? 'page' : undefined"
          :to="englishRoute"
          >EN</RouterLink
        >
      </nav>

      <IconLinkComp v-for="item in iconLinkData" :key="item.title" :data="item" />
    </div>
  </div>

  <Teleport to="body">
    <div
      v-if="systemStore.isMobileMenuOpen && !isDocsRoute"
      class="mobile-nav-overlay"
      @click.self="closeMobileMenu"
    >
      <aside
        id="mobile-nav-sheet"
        ref="mobileSheetRef"
        class="mobile-nav-sheet"
        role="dialog"
        aria-modal="true"
        :aria-label="copy.mobileNavigation"
        @keydown="onSheetKeydown"
      >
        <div class="mobile-nav-sheet-header">
          <h2>{{ copy.mobileNavigation }}</h2>
          <button
            type="button"
            class="mobile-nav-close"
            :aria-label="copy.closeMenu"
            @click="closeMobileMenu"
          >
            ×
          </button>
        </div>
        <MobileNavigationActions @navigate="closeMobileMenu" />
      </aside>
    </div>
  </Teleport>
</template>

<style scoped lang="less">
#header {
  width: 100vw;
  height: 100px;
  min-width: @screen-min-width;
  background-color: @neumorphis-background;
  .fixed-top();
  .center();
  transition: box-shadow 0.2s ease-in;

  #main {
    width: 100vw;
    max-width: @screen-max-width;
    min-width: @screen-min-width;
    padding: 10px 30px;
    .row-center();

    #logo {
      width: 50px;
      height: 50px;
      color: inherit;
      text-decoration: none;
      .center();
      .neumorphism-btn(5px, 10px);

      span {
        font-size: 35px;
        font-weight: bold;
      }
    }

    .site-title {
      min-width: 0;
      margin-left: 40px;
      overflow: hidden;
      font-size: 30px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .icon-link:not(:last-child) {
      margin-right: 30px;
    }

    .search-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      height: 40px;
      padding: 0 14px;
      margin-left: 24px;
      border: none;
      cursor: pointer;
      color: @font-color;
      .neumorphism-btn(3px, 10px);

      .sb-icon {
        width: 18px;
        height: 18px;
      }

      .sb-kbd {
        color: #8a978f;
        font-size: 12px;
        font-weight: bold;
      }
    }

    .mobile-menu-btn {
      display: none;
    }

    .language-switch {
      display: flex;
      align-items: center;
      height: 36px;
      margin-right: 24px;
      padding: 3px;
      .neumorphism-concave(2px, 8px);

      .locale-option {
        width: 38px;
        height: 30px;
        color: #6b7d72;
        font-size: 12px;
        font-weight: bold;
        text-decoration: none;
        .center();
      }

      .locale-option.active {
        color: #1f5e3a;
        .neumorphism-pressed(2px, 6px);
      }
    }
  }
}

.mobile-nav-overlay {
  position: fixed;
  inset: 0;
  z-index: 1301;
  display: flex;
  justify-content: flex-end;
  background: rgba(60, 66, 62, 0.38);
  padding: env(safe-area-inset-top) 0 env(safe-area-inset-bottom);
}

.mobile-nav-sheet {
  width: min(360px, calc(100vw - 20px));
  max-height: 100%;
  overflow-y: auto;
  overscroll-behavior: contain;
  background-color: @neumorphis-background;
  box-shadow: -18px 0 45px rgba(0, 0, 0, 0.2);
}

.mobile-nav-sheet-header {
  .row-between();
  align-items: center;
  gap: 12px;
  padding: 18px 20px 8px;

  h2 {
    margin: 0;
    font-size: 20px;
  }
}

.mobile-nav-close {
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  color: @font-color;
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
  .neumorphism-btn(3px, 50%);
}

.mobile-menu-btn,
.mobile-nav-close {
  touch-action: manipulation;
}

@media (max-width: @mobile-max-width) {
  #header {
    width: 100%;
    min-width: 0;
    height: 64px;

    #main {
      width: 100%;
      max-width: none;
      min-width: 0;
      gap: 8px;
      padding: 8px 12px;

      #logo {
        flex: 0 0 40px;
        width: 40px;
        height: 40px;

        span {
          font-size: 28px;
        }
      }

      .site-title {
        margin-left: 4px;
        font-size: clamp(16px, 5vw, 22px);
      }

      .search-btn {
        flex: 0 0 40px;
        width: 40px;
        height: 40px;
        justify-content: center;
        padding: 0;
        margin-left: auto;

        .sb-kbd {
          display: none;
        }
      }

      .blank,
      .language-switch,
      .icon-link {
        display: none;
      }

      .mobile-menu-btn {
        display: flex;
        flex: 0 0 40px;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        padding: 0;
        border: none;
        color: @font-color;
        cursor: pointer;
        .neumorphism-btn(3px, 10px);

        .menu-icon {
          width: 22px;
          height: 22px;
        }
      }
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  #header,
  .mobile-nav-sheet,
  .mobile-nav-close,
  .mobile-menu-btn {
    transition: none;
  }
}
</style>
