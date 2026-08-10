<!-- src/components/SearchPalette.vue —— 全站搜索命令面板（C-113，M11-S1）：Cmd+K 呼出、键入过滤、回车即达 -->
<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { buildSearchTokens, normalizeToken } from './searchIndex';
import { useSystemStore } from '@/store/modules/system';
import { useCategoryData as useMenuCategoryData } from '@/views/Docs/Menu/hooks';
import { ENGLISH_CONTENT_PAGES, getEnglishLearningPages } from '@/i18n/catalog';
import { useSiteLocale } from '@/i18n/useSiteLocale';
import {
  lockAppBackground,
  lockBodyScroll,
  focusVisibleElement,
  unlockAppBackground,
  unlockBodyScroll,
} from '@/hooks/mobileMenu';

interface SearchEntry {
  title: string;
  desc: string;
  url: string;
  category: string;
  path: string;
  tokens: string[];
}

const store = useSystemStore();
const router = useRouter();
const route = useRoute();
const { isEnglish } = useSiteLocale();

// 数据源复用首页九大类（title/desc/url 齐全），拍平一次
const chineseEntries: SearchEntry[] = useMenuCategoryData()
  .slice(1)
  .flatMap((cat) =>
    cat.children.map((c) => {
      const entry = {
        title: c.title,
        desc: `${c.title}的交互式可视化、逐步讲解与代码同步`,
        url: c.url,
        category: cat.title,
        path: `/docs/${c.url}`,
      };
      return {
        ...entry,
        tokens: buildSearchTokens(entry),
      };
    }),
  );

const englishEntries: SearchEntry[] = ENGLISH_CONTENT_PAGES.map((page) => {
  const entry = {
    title: page.en.heading,
    desc: page.en.description,
    url: page.en.name,
    category: page.en.category,
    path: page.en.path,
  };
  return { ...entry, tokens: buildSearchTokens(entry) };
});

const entries = computed(() => (isEnglish.value ? englishEntries : chineseEntries));
const copy = computed(() =>
  isEnglish.value
    ? {
        title: 'Search learning pages',
        placeholder: 'Search data structures and algorithms by name, topic, or slug...',
        hint: 'Type a page name or topic, use Up/Down to choose, then press Enter',
        complexity: `Complexity reference - compare ${getEnglishLearningPages().length} learning pages`,
        paths: 'Learning paths - follow focused routes',
        empty: (value: string) => `No learning page matches "${value}"`,
        results: 'Search results',
        close: 'Close search',
        complexityPath: '/en/docs/complexity',
        pathsPath: '/en/docs/paths',
      }
    : {
        title: '搜索算法',
        placeholder: '搜索算法：名称 / 关键词 / slug…',
        hint: '输入算法名或关键词，↑↓ 选择，回车直达',
        complexity: '⏱ 复杂度速查表——92 个算法一页看完',
        paths: '🗺 学习路径——四条路线按顺序点下去',
        empty: (value: string) => `没有匹配「${value}」的算法`,
        results: '搜索结果',
        close: '关闭搜索',
        complexityPath: '/docs/complexity',
        pathsPath: '/docs/paths',
      },
);

const query = ref('');
const activeIdx = ref(0);
const inputRef = ref<HTMLInputElement | null>(null);
const dialogRef = ref<HTMLElement | null>(null);
const restoreFocusRef = ref<HTMLElement | null>(null);
let ownsBodyLock = false;
let restoreFocusOnClose = true;
let focusHeadingAfterClose = false;

function searchOptionId(url: string): string {
  return `search-option-${url}`;
}

const results = computed<SearchEntry[]>(() => {
  const q = query.value.trim();
  if (!q) return [];
  const lower = normalizeToken(q);
  return entries.value
    .filter((entry) => entry.tokens.some((token) => token.includes(lower)))
    .slice(0, 10);
});

const activeResultId = computed(() => {
  const active = results.value[activeIdx.value];
  return active ? searchOptionId(active.url) : undefined;
});

const focusableSelector = [
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'a[href]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function getFocusableElements(): HTMLElement[] {
  const dialog = dialogRef.value;
  if (!dialog) return [];
  return Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector)).filter((element) => {
    if (element.hidden || element.getAttribute('aria-hidden') === 'true') return false;
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden';
  });
}

function rememberFocusTarget(): void {
  const active = document.activeElement;
  restoreFocusRef.value = active instanceof HTMLElement ? active : null;
}

function lockBackground(): void {
  if (typeof document === 'undefined' || !document.body || ownsBodyLock) return;
  lockBodyScroll();
  lockAppBackground();
  ownsBodyLock = true;
}

function unlockBackground(): void {
  if (typeof document === 'undefined' || !document.body) return;
  unlockAppBackground();
  if (ownsBodyLock) {
    unlockBodyScroll();
    ownsBodyLock = false;
  }
}

function restoreFocusTarget(): void {
  const target = restoreFocusRef.value;
  restoreFocusRef.value = null;
  if (focusVisibleElement(target)) {
    return;
  }

  // A result button is removed together with the dialog. Keep focus in the
  // destination page for same-route searches instead of dropping it on body.
  const fallback =
    document.querySelector<HTMLElement>('#right .article h1, main .article h1') ??
    document.getElementById('mobile-menu-trigger') ??
    document.querySelector<HTMLElement>('.search-btn');
  focusVisibleElement(fallback);
}

function focusArticleHeading(): void {
  const heading = document.querySelector<HTMLElement>('#right .article h1, main .article h1');
  if (!heading) return;
  heading.setAttribute('tabindex', '-1');
  heading.focus({ preventScroll: true });
}

function normalizedPath(path: string): string {
  const withoutTrailingSlash = path.replace(/\/+$/, '');
  return withoutTrailingSlash || '/';
}

function onDocumentFocusIn(event: FocusEvent): void {
  const dialog = dialogRef.value;
  if (!store.isSearchOpen || !dialog?.isConnected) return;
  const target = event.target;
  if (target instanceof Node && dialog.contains(target)) return;
  event.preventDefault();
  inputRef.value?.focus();
}

function onDialogKeydown(e: KeyboardEvent): void {
  if (!store.isSearchOpen) return;
  if (e.key === 'Escape') {
    e.preventDefault();
    e.stopPropagation();
    store.closeSearch();
    return;
  }
  if (e.key !== 'Tab') return;

  const dialog = dialogRef.value;
  const focusable = getFocusableElements();
  if (!dialog || focusable.length === 0) {
    e.preventDefault();
    dialog?.focus();
    return;
  }

  const active = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && (active === first || !active || !dialog.contains(active))) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && (active === last || !active || !dialog.contains(active))) {
    e.preventDefault();
    first.focus();
  }
}

watch(
  () => store.isSearchOpen,
  async (open, wasOpen) => {
    if (open && !wasOpen) {
      if (!restoreFocusRef.value) rememberFocusTarget();
      query.value = '';
      activeIdx.value = 0;
      await nextTick();
      inputRef.value?.focus();
      if (dialogRef.value?.isConnected) {
        lockBackground();
        document.addEventListener('focusin', onDocumentFocusIn, true);
      }
    } else if (!open && wasOpen) {
      const shouldRestoreFocus = restoreFocusOnClose;
      const shouldFocusHeading = focusHeadingAfterClose;
      document.removeEventListener('focusin', onDocumentFocusIn, true);
      unlockBackground();
      await nextTick();
      if (shouldRestoreFocus) {
        restoreFocusTarget();
      } else {
        restoreFocusRef.value = null;
        // Same-route search results do not trigger a router update.  Focus the
        // current article heading only after the dialog and its focus guard
        // have both been removed, otherwise the guard pulls focus back into
        // the soon-to-be-unmounted input and the browser falls back to body.
        if (shouldFocusHeading) {
          await nextTick();
          focusArticleHeading();
        }
      }
      restoreFocusOnClose = true;
      focusHeadingAfterClose = false;
    }
  },
  { flush: 'post', immediate: true },
);

watch(query, () => {
  activeIdx.value = 0;
});

watch(activeIdx, async () => {
  await nextTick();
  const activeId = activeResultId.value;
  if (!activeId) return;
  const activeOption = document.getElementById(activeId);
  if (typeof activeOption?.scrollIntoView === 'function') {
    activeOption.scrollIntoView({ block: 'nearest' });
  }
});

function go(e: SearchEntry): void {
  // Vue Router's route.path is base-independent; window.location.pathname is
  // not (it includes /algorithms-visualization/ on GitHub Pages).
  const samePath = normalizedPath(route.path) === normalizedPath(e.path);
  restoreFocusOnClose = !samePath;
  focusHeadingAfterClose = samePath;
  if (samePath) {
    restoreFocusRef.value = null;
    store.closeSearch();
    return;
  }
  store.closeSearch();
  router.push(e.path);
}

function goTo(path: string): void {
  const samePath = normalizedPath(route.path) === normalizedPath(path);
  restoreFocusOnClose = !samePath;
  focusHeadingAfterClose = samePath;
  if (samePath) {
    restoreFocusRef.value = null;
    store.closeSearch();
    return;
  }
  store.closeSearch();
  router.push(path);
}

function onInputKeydown(e: KeyboardEvent): void {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (results.value.length) activeIdx.value = (activeIdx.value + 1) % results.value.length;
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (results.value.length)
      activeIdx.value = (activeIdx.value - 1 + results.value.length) % results.value.length;
  } else if (e.key === 'Enter') {
    const hit = results.value[activeIdx.value];
    if (hit) {
      // Closing the dialog restores focus to the search trigger. Without
      // cancelling the native Enter default, that newly focused button can
      // receive a synthetic click and immediately reopen the dialog.
      e.preventDefault();
      e.stopPropagation();
      go(hit);
    }
  }
}

// 全局 Cmd+K / Ctrl+K 呼出
function onGlobalKeydown(e: KeyboardEvent): void {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    if (store.isSearchOpen) {
      store.closeSearch();
    } else {
      // 目录关闭会卸载当前焦点元素；此时搜索关闭后应回到目录触发按钮。
      if (store.isMobileMenuOpen) {
        restoreFocusRef.value = document.getElementById('mobile-menu-trigger');
      } else {
        rememberFocusTarget();
      }
      store.openSearch();
    }
  }
}
onMounted(() => window.addEventListener('keydown', onGlobalKeydown));
onUnmounted(() => {
  window.removeEventListener('keydown', onGlobalKeydown);
  document.removeEventListener('focusin', onDocumentFocusIn, true);
  if (store.isSearchOpen) {
    unlockBackground();
    restoreFocusTarget();
  }
});
</script>

<template>
  <Teleport to="body">
    <div v-if="store.isSearchOpen" class="search-overlay" @click.self="store.closeSearch()">
      <div
        ref="dialogRef"
        class="search-palette column"
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-palette-title"
        tabindex="-1"
        @keydown="onDialogKeydown"
      >
        <div class="sp-header">
          <h2 id="search-palette-title">{{ copy.title }}</h2>
          <button
            type="button"
            class="sp-close"
            :aria-label="copy.close"
            @click="store.closeSearch()"
          >
            ×
          </button>
        </div>
        <input
          ref="inputRef"
          v-model="query"
          class="sp-input"
          type="text"
          name="algorithm-search"
          role="combobox"
          :placeholder="copy.placeholder"
          :aria-label="copy.title"
          aria-autocomplete="list"
          :aria-expanded="results.length ? 'true' : 'false'"
          :aria-describedby="!query.trim() ? 'search-palette-hint' : undefined"
          :aria-controls="results.length ? 'search-results' : undefined"
          :aria-activedescendant="activeResultId"
          autocomplete="off"
          spellcheck="false"
          @keydown="onInputKeydown"
        />
        <template v-if="!query.trim()">
          <p id="search-palette-hint" class="sp-hint">{{ copy.hint }}</p>
          <button type="button" class="sp-shortcut" @click="goTo(copy.complexityPath)">
            {{ copy.complexity }}
          </button>
          <button type="button" class="sp-shortcut" @click="goTo(copy.pathsPath)">
            {{ copy.paths }}
          </button>
        </template>
        <p v-else-if="results.length === 0" class="sp-empty" role="status" aria-live="polite">
          {{ copy.empty(query) }}
        </p>
        <ul v-else id="search-results" class="sp-results" role="listbox" :aria-label="copy.results">
          <li v-for="(r, i) in results" :key="r.url" class="sp-result" role="presentation">
            <button
              :id="searchOptionId(r.url)"
              type="button"
              class="sp-item"
              role="option"
              :aria-selected="i === activeIdx"
              :class="{ 'sp-active': i === activeIdx }"
              @click="go(r)"
              @mouseenter="activeIdx = i"
            >
              <span class="sp-title">{{ r.title }}</span>
              <span class="sp-cat">{{ r.category }}</span>
              <span class="sp-desc"
                >{{ r.desc.slice(0, 42) }}{{ r.desc.length > 42 ? '…' : '' }}</span
              >
            </button>
          </li>
        </ul>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="less">
.search-overlay {
  position: fixed;
  inset: 0;
  z-index: 1400;
  background: rgba(60, 66, 62, 0.35);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 14vh;
}
.search-palette {
  width: min(620px, 92vw);
  max-height: 60vh;
  padding: 14px;
  gap: 10px;
  background-color: @neumorphis-background;
  border-radius: 14px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}
.sp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  h2 {
    margin: 0;
    font-size: 18px;
  }
}
.sp-close {
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  color: @font-color;
  font-size: 26px;
  line-height: 1;
  cursor: pointer;
  .neumorphism-btn(2px, 50%);
}
.sp-input {
  width: 100%;
  height: 42px;
  padding: 0 14px;
  border: none;
  font-size: 16px;
  color: @font-color;
  .neumorphism-concave(2px, 10px);
  &:focus {
    outline: 2px solid #8bd3a0;
  }
}
.sp-hint,
.sp-empty {
  font-size: 13px;
  color: #8a978f;
  padding: 4px 6px;
}
.sp-shortcut {
  align-self: flex-start;
  padding: 7px 14px;
  border: none;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  color: #1f5e3a;
  .neumorphism-btn(2px, 8px);
}
.sp-results {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-y: auto;
}
.sp-result {
  margin: 0;
}
.sp-item {
  display: grid;
  width: 100%;
  grid-template-columns: auto auto 1fr;
  align-items: baseline;
  gap: 10px;
  padding: 9px 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  font: inherit;
  color: inherit;
  text-align: left;
  .sp-title {
    font-weight: bold;
    font-size: 14px;
    color: @font-color;
    white-space: nowrap;
  }
  .sp-cat {
    font-size: 11px;
    color: #1f5e3a;
    background: #dcebe0;
    padding: 1px 8px;
    border-radius: 999px;
    white-space: nowrap;
  }
  .sp-desc {
    font-size: 12px;
    color: #8a978f;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.sp-item.sp-active {
  background: #dfe9e2;
  outline: 2px solid #8bd3a0;
}

@media (max-width: @mobile-max-width) {
  .search-overlay {
    align-items: stretch;
    padding: env(safe-area-inset-top) 0 env(safe-area-inset-bottom);
  }

  .search-palette {
    width: 100%;
    max-height: none;
    min-height: 100dvh;
    padding: 14px 12px;
    border-radius: 0;
  }

  .sp-input,
  .sp-shortcut,
  .sp-item {
    min-height: 44px;
  }

  .sp-item {
    grid-template-columns: 1fr auto;

    .sp-desc {
      grid-column: 1 / -1;
    }
  }
}
</style>
