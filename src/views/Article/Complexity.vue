<!-- src/views/Article/Complexity.vue —— 复杂度速查页（C-114，M11-S2）：九大类标签筛选 + 关键词过滤 -->
<script setup lang="ts">
import { computed, ref } from 'vue';
import Article from '@/components/article/Article.vue';
import { useCategoryData } from '@/views/Home/Main/hooks';
import { COMPLEXITY } from '@/data/complexity';

const categories = useCategoryData();
const activeTag = ref('全部');
const keyword = ref('');

const tags = computed(() => ['全部', ...categories.map((c) => c.title)]);

interface Row {
  title: string;
  url: string;
  time: string;
  space: string;
  note: string;
}

const groups = computed(() => {
  const kw = keyword.value.trim().toLowerCase();
  return categories
    .filter((c) => activeTag.value === '全部' || c.title === activeTag.value)
    .map((c) => ({
      title: c.title,
      rows: c.children
        .map((i): Row => {
          const cx = COMPLEXITY[i.url];
          return {
            title: i.title,
            url: i.url,
            time: cx?.time ?? '—',
            space: cx?.space ?? '—',
            note: cx?.note ?? '',
          };
        })
        .filter(
          (r) =>
            !kw ||
            r.title.toLowerCase().includes(kw) ||
            r.time.toLowerCase().includes(kw) ||
            r.space.toLowerCase().includes(kw) ||
            r.note.toLowerCase().includes(kw),
        ),
    }))
    .filter((g) => g.rows.length > 0);
});

const total = computed(() => groups.value.reduce((s, g) => s + g.rows.length, 0));
</script>

<template>
  <Article>
    <h1>复杂度速查表</h1>
    <p class="sub">全站 92 个算法的时间/空间复杂度一页看完 · 点名称直达动画页</p>

    <div class="cx-controls">
      <div class="cx-tags">
        <button
          v-for="t in tags"
          :key="t"
          type="button"
          class="cx-tag"
          :class="{ 'cx-tag-on': activeTag === t }"
          @click="activeTag = t"
        >
          {{ t }}
        </button>
      </div>
      <input
        v-model="keyword"
        class="cx-kw"
        type="text"
        placeholder="过滤：名称 / 复杂度（如 log）/ 备注…"
        spellcheck="false"
      />
      <span class="cx-count">{{ total }} 个算法</span>
    </div>

    <section v-for="g in groups" :key="g.title" class="cx-group">
      <h2>{{ g.title }}</h2>
      <div class="cx-table-wrap">
        <table class="cx-table">
          <thead>
            <tr>
              <th>算法</th>
              <th>时间</th>
              <th>空间</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in g.rows" :key="r.url">
              <td>
                <router-link :to="`/docs/${r.url}`">{{ r.title }}</router-link>
              </td>
              <td class="cx-mono">{{ r.time }}</td>
              <td class="cx-mono">{{ r.space }}</td>
              <td class="cx-note">{{ r.note }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    <p v-if="total === 0" class="cx-empty">没有匹配的算法，试试换个关键词</p>
  </Article>
</template>

<style scoped lang="less">
.cx-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin: 14px 0 6px;
}
.cx-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.cx-tag {
  padding: 4px 12px;
  border: none;
  font-size: 13px;
  cursor: pointer;
  color: @font-color;
  .neumorphism-btn(2px, 999px);
}
.cx-tag.cx-tag-on {
  color: #1f5e3a;
  font-weight: bold;
  .neumorphism-pressed(2px, 999px);
}
.cx-kw {
  flex: 1;
  min-width: 180px;
  height: 32px;
  padding: 0 12px;
  border: none;
  font-size: 13px;
  color: @font-color;
  .neumorphism-concave(2px, 8px);
  &:focus {
    outline: 2px solid #8bd3a0;
  }
}
.cx-count {
  font-size: 13px;
  font-weight: bold;
  color: #1f5e3a;
  white-space: nowrap;
}
.cx-group h2 {
  margin-top: 22px;
}
.cx-table-wrap {
  overflow-x: auto;
}
.cx-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  th,
  td {
    text-align: left;
    padding: 7px 12px;
    border-bottom: 1px solid #d7ded9;
    white-space: nowrap;
  }
  .cx-note {
    white-space: normal;
    color: #6b7d72;
    font-size: 13px;
  }
  .cx-mono {
    font-family: 'SF Mono', Menlo, Consolas, monospace;
    font-size: 13px;
  }
  a {
    color: @font-highlight-color;
    font-weight: bold;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}
.cx-empty {
  margin-top: 20px;
  color: #8a978f;
}
</style>
