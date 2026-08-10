<!-- src/components/player/CodePanel.vue -->
<script setup lang="ts">
import { computed, nextTick, ref, shallowRef, useId, watch, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { useSystemStore } from '@/store/modules/system';
import type { Lang, LangSource } from './types';
import { highlightToLines, type HlLines } from './useHighlighter';
import type { SiteLocale } from '@/i18n/catalog';

const props = withDefaults(
  defineProps<{ sources: LangSource[]; point: string; locale?: SiteLocale }>(),
  { locale: 'zh-CN' },
);

const activeLang = ref<Lang>(props.sources[0].lang);
const idSeed = useId().replace(/[^a-zA-Z0-9_-]/g, '');
const tablistLabel = computed(() => (props.locale === 'en' ? 'Code language' : '代码语言'));
const codePanelId = `code-panel-${idSeed}`;
const tabRefs = new Map<Lang, HTMLElement>();
const activeSource = computed(
  () => props.sources.find((s) => s.lang === activeLang.value) ?? props.sources[0],
);
const activeLine = computed(() => activeSource.value.lineMap[props.point]);

const { isDarkMode } = storeToRefs(useSystemStore());
const lines = shallowRef<HlLines | null>(null);
const codeEl = ref<HTMLElement | null>(null);
let hasInitialCodePainted = false;

function tabId(lang: Lang): string {
  return `${codePanelId}-tab-${lang}`;
}

function setTabRef(lang: Lang, element: unknown): void {
  if (element instanceof HTMLElement) tabRefs.set(lang, element);
  else tabRefs.delete(lang);
}

function selectLanguage(lang: Lang, moveFocus = false): void {
  activeLang.value = lang;
  if (moveFocus) {
    void nextTick(() => tabRefs.get(lang)?.focus());
  }
}

function onTabKeydown(event: KeyboardEvent, lang: Lang): void {
  const currentIndex = props.sources.findIndex((source) => source.lang === lang);
  if (currentIndex < 0 || props.sources.length < 2) return;

  let nextIndex = currentIndex;
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    nextIndex = (currentIndex + 1) % props.sources.length;
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    nextIndex = (currentIndex - 1 + props.sources.length) % props.sources.length;
  } else if (event.key === 'Home') {
    nextIndex = 0;
  } else if (event.key === 'End') {
    nextIndex = props.sources.length - 1;
  } else {
    return;
  }

  event.preventDefault();
  selectLanguage(props.sources[nextIndex].lang, true);
}

watch(
  () => props.sources,
  (sources) => {
    if (!sources.some((source) => source.lang === activeLang.value) && sources[0]) {
      activeLang.value = sources[0].lang;
    }
  },
);

watchEffect(async () => {
  const src = activeSource.value;
  const dark = isDarkMode.value;
  const result = await highlightToLines(src.code, src.lang, dark);
  // 仅当输入仍是当前值时才写入，避免快速切换语言/主题时旧结果覆盖新结果
  if (activeSource.value === src && isDarkMode.value === dark) {
    lines.value = result;
  }
});

const plainLines = computed(() => activeSource.value.code.split('\n'));

watch([activeLine, lines], async () => {
  await nextTick();
  // Do not scroll the article on first highlight.  On mobile the code panel is
  // below the heading; an initial scrollIntoView would move the page before the
  // reader sees the article title. Subsequent step/language changes still track
  // the active line inside the code container.
  if (!hasInitialCodePainted) {
    hasInitialCodePainted = true;
    return;
  }
  const line = activeLine.value;
  if (line == null) return;
  const container = codeEl.value;
  const activeEl = container?.querySelector<HTMLElement>(`.code-line[data-line="${line}"]`);
  if (!container || !activeEl) return;

  // Do not call Element.scrollIntoView here.  The code panel lives inside a
  // long article, so browsers are allowed to scroll the article (and on
  // mobile even the whole page) when that API is used.  Adjust only the code
  // pane's own scroll offsets; the reader stays at the current explanation.
  const containerRect = container.getBoundingClientRect();
  const lineRect = activeEl.getBoundingClientRect();
  const top = containerRect.top + 4;
  const bottom = containerRect.bottom - 4;
  if (lineRect.top < top) {
    container.scrollTop -= top - lineRect.top;
  } else if (lineRect.bottom > bottom) {
    container.scrollTop += lineRect.bottom - bottom;
  }
});
</script>
<template>
  <div class="code-panel" :class="{ dark: isDarkMode }">
    <div class="tabs row" role="tablist" aria-orientation="horizontal" :aria-label="tablistLabel">
      <button
        v-for="s in props.sources"
        :key="s.lang"
        :ref="(element) => setTabRef(s.lang, element)"
        type="button"
        class="tab"
        :class="{ on: s.lang === activeLang }"
        role="tab"
        :id="tabId(s.lang)"
        :aria-selected="s.lang === activeLang"
        :aria-controls="codePanelId"
        :tabindex="s.lang === activeLang ? 0 : -1"
        @click="selectLanguage(s.lang)"
        @keydown="onTabKeydown($event, s.lang)"
      >
        {{ s.label }}
      </button>
    </div>
    <div
      :id="codePanelId"
      ref="codeEl"
      class="code"
      role="tabpanel"
      tabindex="0"
      :aria-labelledby="tabId(activeLang)"
    >
      <template v-if="lines">
        <div
          v-for="(line, i) in lines"
          :key="i"
          class="code-line"
          :data-line="i + 1"
          :class="{ 'is-active': i + 1 === activeLine }"
        >
          <span class="ln">{{ i + 1 }}</span
          ><span class="tok" v-for="(t, ti) in line" :key="ti" :style="{ color: t.color }">{{
            t.content
          }}</span>
        </div>
      </template>
      <template v-else>
        <div
          v-for="(line, i) in plainLines"
          :key="i"
          class="code-line"
          :data-line="i + 1"
          :class="{ 'is-active': i + 1 === activeLine }"
        >
          <span class="ln">{{ i + 1 }}</span
          ><span class="tok">{{ line }}</span>
        </div>
      </template>
    </div>
  </div>
</template>
<style scoped lang="less">
.code-panel {
  font-family: 'Fira Code', Consolas, Monaco, monospace;
  border-radius: 12px;
  overflow: hidden;
  .neumorphism-flat(4px, 12px);
}
.tabs {
  gap: 4px;
  padding: 6px;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
}
.tab {
  flex: 0 0 auto;
  min-height: 36px;
  border: none;
  background: transparent;
  padding: 4px 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
}

.tab.on {
  .neumorphism-pressed(2px, 8px);
}
.code {
  padding: 8px 0;
  font-size: 13px;
  line-height: 1.6;
  max-height: 48vh;
  overflow: auto; /* 长行横向滚动，不被外层圆角裁掉（C-042 真机自检发现的缺陷修复） */
}
.code-line {
  display: block;
  white-space: pre;
  padding: 0 12px;
  width: max-content; /* 行盒撑到内容宽：高亮行背景随滚动铺满整行 */
  min-width: 100%; /* 短行仍占满可视宽，高亮不缺口 */
}
.code-line.is-active {
  background: rgba(255, 207, 92, 0.28);
}
.ln {
  display: inline-block;
  width: 2em;
  margin-right: 12px;
  text-align: right;
  opacity: 0.4;
  user-select: none;
}

@media (max-width: @mobile-max-width) {
  .tabs {
    padding: 6px 4px;
  }

  .tab {
    min-height: 44px;
    padding: 6px 12px;
  }

  .code {
    max-height: 52vh;
    font-size: 12px;
  }

  .code-line {
    padding: 0 8px;
  }

  .ln {
    margin-right: 8px;
  }
}
</style>
