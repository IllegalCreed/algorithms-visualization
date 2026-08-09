<!-- src/components/player/CodePanel.vue -->
<script setup lang="ts">
import { computed, nextTick, ref, shallowRef, watch, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { useSystemStore } from '@/store/modules/system';
import type { Lang, LangSource } from './types';
import { highlightToLines, type HlLines } from './useHighlighter';

const props = defineProps<{ sources: LangSource[]; point: string }>();

const activeLang = ref<Lang>(props.sources[0].lang);
const activeSource = computed(
  () => props.sources.find((s) => s.lang === activeLang.value) ?? props.sources[0],
);
const activeLine = computed(() => activeSource.value.lineMap[props.point]);

const { isDarkMode } = storeToRefs(useSystemStore());
const lines = shallowRef<HlLines | null>(null);
const codeEl = ref<HTMLElement | null>(null);

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
  const line = activeLine.value;
  if (line == null) return;
  const activeEl = codeEl.value?.querySelector<HTMLElement>(`.code-line[data-line="${line}"]`);
  if (typeof activeEl?.scrollIntoView === 'function') {
    activeEl.scrollIntoView({ block: 'nearest' });
  }
});
</script>
<template>
  <div class="code-panel" :class="{ dark: isDarkMode }">
    <div class="tabs row">
      <button
        v-for="s in props.sources"
        :key="s.lang"
        class="tab"
        :class="{ on: s.lang === activeLang }"
        @click="activeLang = s.lang"
      >
        {{ s.label }}
      </button>
    </div>
    <div ref="codeEl" class="code">
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
}
.tab {
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
</style>
