<script setup lang="ts">
import { computed, ref } from 'vue';
import Article from '@/components/article/Article.vue';
import { ENGLISH_PILOT_PAGES } from '@/i18n/pilot';

interface ComplexityRow {
  name: string;
  title: string;
  category: string;
  time: string;
  space: string;
  note: string;
}

const metrics: Record<string, Pick<ComplexityRow, 'time' | 'space' | 'note'>> = {
  'en-quick-sort': {
    time: 'Average O(n log n)',
    space: 'O(log n)',
    note: 'In-place; worst case O(n^2) with consistently poor pivots.',
  },
  'en-binary-search': {
    time: 'O(log n)',
    space: 'O(1)',
    note: 'Requires sorted data and discards half of the candidate range per probe.',
  },
  'en-dijkstra': {
    time: 'O((V+E) log V)',
    space: 'O(V)',
    note: 'Heap-based implementation for graphs with non-negative edge weights.',
  },
  'en-knapsack': {
    time: 'O(nW)',
    space: 'O(nW)',
    note: 'Pseudo-polynomial in capacity W; space can be reduced to O(W).',
  },
  'en-kmp': {
    time: 'O(n+m)',
    space: 'O(m)',
    note: 'The text pointer never moves backward; preprocessing builds the LPS table.',
  },
  'en-fenwick': {
    time: 'O(log n)',
    space: 'O(n)',
    note: 'Both point updates and prefix queries follow a lowbit chain.',
  },
  'en-convex-hull': {
    time: 'O(n log n)',
    space: 'O(n)',
    note: "Andrew's monotone chain is dominated by sorting the points.",
  },
};

const rows: ComplexityRow[] = ENGLISH_PILOT_PAGES.filter((page) => metrics[page.name]).map(
  (page) => ({
    name: page.name,
    title: page.heading,
    category: page.category ?? 'Other',
    ...metrics[page.name],
  }),
);
const categories = ['All', ...new Set(rows.map((row) => row.category))];
const activeCategory = ref('All');
const keyword = ref('');
const filteredRows = computed(() => {
  const query = keyword.value.trim().toLowerCase();
  return rows.filter(
    (row) =>
      (activeCategory.value === 'All' || row.category === activeCategory.value) &&
      (!query || Object.values(row).some((value) => value.toLowerCase().includes(query))),
  );
});
</script>

<template>
  <Article>
    <h1>Algorithm Complexity Reference</h1>
    <p class="sub">Time and space costs for all seven algorithms in the English pilot</p>

    <p>
      Complexity describes how resource use grows with the input. Use this table for comparison,
      then open an algorithm to see what each operation actually means in motion.
    </p>

    <div class="complexity-controls">
      <div class="complexity-tabs" aria-label="Filter by category">
        <button
          v-for="category in categories"
          :key="category"
          type="button"
          class="complexity-tab"
          :class="{ active: activeCategory === category }"
          @click="activeCategory = category"
        >
          {{ category }}
        </button>
      </div>
      <input
        v-model="keyword"
        class="complexity-search"
        type="text"
        placeholder="Filter by name, complexity, or note..."
        aria-label="Filter complexity table"
        spellcheck="false"
      />
      <span class="complexity-count">{{ filteredRows.length }} algorithms</span>
    </div>

    <div class="table-wrap">
      <table class="complexity-table">
        <thead>
          <tr>
            <th>Algorithm</th>
            <th>Time</th>
            <th>Space</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in filteredRows" :key="row.name">
            <td>
              <RouterLink :to="{ name: row.name }">{{ row.title }}</RouterLink>
            </td>
            <td class="mono">{{ row.time }}</td>
            <td class="mono">{{ row.space }}</td>
            <td class="note">{{ row.note }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-if="filteredRows.length === 0" class="empty">No algorithm matches this filter.</p>
  </Article>
</template>

<style scoped lang="less">
.complexity-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin: 20px 0;
}

.complexity-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.complexity-tab {
  padding: 5px 12px;
  border: none;
  color: @font-color;
  font-size: 12px;
  cursor: pointer;
  .neumorphism-btn(2px, 8px);
}

.complexity-tab.active {
  color: #1f5e3a;
  font-weight: bold;
  .neumorphism-pressed(2px, 8px);
}

.complexity-search {
  flex: 1;
  min-width: 210px;
  height: 34px;
  padding: 0 12px;
  border: none;
  color: @font-color;
  font-size: 13px;
  .neumorphism-concave(2px, 8px);

  &:focus {
    outline: 2px solid #8bd3a0;
  }
}

.complexity-count {
  color: #1f5e3a;
  font-size: 13px;
  font-weight: bold;
  white-space: nowrap;
}

.table-wrap {
  overflow-x: auto;
}

.complexity-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  th,
  td {
    padding: 9px 12px;
    border-bottom: 1px solid #d7ded9;
    text-align: left;
    white-space: nowrap;
  }

  .note {
    color: #6b7d72;
    font-size: 13px;
    white-space: normal;
  }

  .mono {
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

.empty {
  color: #8a978f;
}
</style>
