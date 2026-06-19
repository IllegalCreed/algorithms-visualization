<!-- src/components/player/CodePanel.vue -->
<script setup lang="ts">
import { ref, computed, shallowRef, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { useSystemStore } from '@/store/modules/system';
import type { ExecPoint, Lang, LangSource } from './types';
import { highlightToLines, type HlLines } from './useHighlighter';

const props = defineProps<{ sources: LangSource[]; point: ExecPoint }>();

const activeLang = ref<Lang>(props.sources[0].lang);
const activeSource = computed(
  () => props.sources.find((s) => s.lang === activeLang.value) ?? props.sources[0],
);
const activeLine = computed(() => activeSource.value.lineMap[props.point]);

const { isDarkMode } = storeToRefs(useSystemStore());
const lines = shallowRef<HlLines | null>(null);

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
    <div class="code">
      <template v-if="lines">
        <div
          v-for="(line, i) in lines"
          :key="i"
          class="code-line"
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
}
.code-line {
  display: block;
  white-space: pre;
  padding: 0 12px;
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
