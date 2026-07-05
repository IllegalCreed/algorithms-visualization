<!-- src/components/SearchPalette.vue —— 全站搜索命令面板（C-113，M11-S1）：Cmd+K 呼出、键入过滤、回车即达 -->
<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useSystemStore } from '@/store/modules/system';
import { useCategoryData } from '@/views/Home/Main/hooks';

interface SearchEntry {
  title: string;
  desc: string;
  url: string;
  category: string;
}

const store = useSystemStore();
const router = useRouter();

// 数据源复用首页九大类（title/desc/url 齐全），拍平一次
const entries: SearchEntry[] = useCategoryData().flatMap((cat) =>
  cat.children.map((c) => ({
    title: c.title,
    desc: c.desc ?? '',
    url: c.url,
    category: cat.title,
  })),
);

const query = ref('');
const activeIdx = ref(0);
const inputRef = ref<HTMLInputElement | null>(null);

const results = computed<SearchEntry[]>(() => {
  const q = query.value.trim();
  if (!q) return [];
  const lower = q.toLowerCase();
  return entries
    .filter((e) => e.title.includes(q) || e.desc.includes(q) || e.url.includes(lower))
    .slice(0, 10);
});

watch(
  () => store.isSearchOpen,
  async (open) => {
    if (open) {
      query.value = '';
      activeIdx.value = 0;
      await nextTick();
      inputRef.value?.focus();
    }
  },
);

watch(query, () => {
  activeIdx.value = 0;
});

function go(e: SearchEntry): void {
  store.closeSearch();
  router.push(`/docs/${e.url}`);
}

function goComplexity(): void {
  store.closeSearch();
  router.push('/docs/complexity');
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
    if (hit) go(hit);
  } else if (e.key === 'Escape') {
    store.closeSearch();
  }
}

// 全局 Cmd+K / Ctrl+K 呼出
function onGlobalKeydown(e: KeyboardEvent): void {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    if (store.isSearchOpen) store.closeSearch();
    else store.openSearch();
  }
}
onMounted(() => window.addEventListener('keydown', onGlobalKeydown));
onUnmounted(() => window.removeEventListener('keydown', onGlobalKeydown));
</script>

<template>
  <Teleport to="body">
    <div v-if="store.isSearchOpen" class="search-overlay" @click.self="store.closeSearch()">
      <div class="search-palette column">
        <input
          ref="inputRef"
          v-model="query"
          class="sp-input"
          type="text"
          placeholder="搜索算法：名称 / 关键词 / slug…"
          spellcheck="false"
          @keydown="onInputKeydown"
        />
        <template v-if="!query.trim()">
          <p class="sp-hint">输入算法名或关键词，↑↓ 选择，回车直达</p>
          <button type="button" class="sp-shortcut" @click="goComplexity">
            ⏱ 复杂度速查表——92 个算法一页看完
          </button>
        </template>
        <p v-else-if="results.length === 0" class="sp-empty">没有匹配「{{ query }}」的算法</p>
        <ul v-else class="sp-results">
          <li
            v-for="(r, i) in results"
            :key="r.url"
            class="sp-item"
            :class="{ 'sp-active': i === activeIdx }"
            @click="go(r)"
            @mouseenter="activeIdx = i"
          >
            <span class="sp-title">{{ r.title }}</span>
            <span class="sp-cat">{{ r.category }}</span>
            <span class="sp-desc"
              >{{ r.desc.slice(0, 42) }}{{ r.desc.length > 42 ? '…' : '' }}</span
            >
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
  z-index: 999;
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
.sp-item {
  display: grid;
  grid-template-columns: auto auto 1fr;
  align-items: baseline;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 8px;
  cursor: pointer;
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
</style>
