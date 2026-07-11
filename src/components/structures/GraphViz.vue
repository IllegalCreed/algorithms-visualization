<!-- 图互动组件：无向图 BFS(队列)/DFS(栈) 遍历，SVG 二维 + 辅助结构面板（M3 数据结构收官回扣栈/队列） -->
<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import type { SiteLocale } from '@/i18n/catalog';
import { useGraph } from './useGraph';

const props = withDefaults(defineProps<{ locale?: SiteLocale }>(), { locale: 'zh-CN' });
const english = props.locale === 'en';
const g = useGraph();
const start = ref(0);
const visited = ref<number[]>([]);
const current = ref(-1);
const frontier = ref<number[]>([]);
const mode = ref<'' | 'bfs' | 'dfs'>('');
const busy = ref(false);
const status = ref(
  english
    ? 'Choose a start vertex, then run BFS or DFS. The current start is A.'
    : '点一个顶点设为起点，再点 BFS 或 DFS。当前起点：A。',
);
let timers: ReturnType<typeof setTimeout>[] = [];
const sleep = (ms: number) => new Promise<void>((res) => timers.push(setTimeout(res, ms)));
const clearTimers = () => {
  timers.forEach(clearTimeout);
  timers = [];
};
const clearMarks = () => {
  visited.value = [];
  current.value = -1;
  frontier.value = [];
  mode.value = '';
};
const helperLabel = computed(() =>
  mode.value === 'bfs'
    ? english
      ? 'Queue →'
      : '队列 →'
    : mode.value === 'dfs'
      ? english
        ? 'Stack ↑'
        : '栈 ↑'
      : '　',
);

const onPick = (i: number) => {
  if (busy.value) return;
  start.value = i;
  clearMarks();
  status.value = english
    ? `Start vertex: ${g.labelOf(i)}. Run BFS or DFS to traverse the graph.`
    : `当前起点：${g.labelOf(i)}。点 BFS 或 DFS 看遍历。`;
};
const onRun = async (kind: 'bfs' | 'dfs') => {
  if (busy.value) return;
  busy.value = true;
  clearMarks();
  mode.value = kind;
  const steps = kind === 'bfs' ? g.bfs(start.value) : g.dfs(start.value);
  const ord = steps.map((s) => g.labelOf(s.visit)).join(' ');
  status.value = english
    ? kind === 'bfs'
      ? `BFS uses a queue to visit the graph level by level from ${g.labelOf(start.value)}: ${ord}`
      : `DFS uses a stack to follow one branch at a time from ${g.labelOf(start.value)}: ${ord}`
    : kind === 'bfs'
      ? `BFS 广度优先（用队列）：从 ${g.labelOf(start.value)} 出发，一层层访问 → ${ord}`
      : `DFS 深度优先（用栈）：从 ${g.labelOf(start.value)} 出发，一条道走到底 → ${ord}`;
  for (const s of steps) {
    current.value = s.visit;
    if (!visited.value.includes(s.visit)) visited.value = [...visited.value, s.visit];
    frontier.value = s.frontier;
    await sleep(820);
    current.value = -1;
  }
  busy.value = false;
};
const onReset = () => {
  clearTimers(); // 重置可随时中断进行中的遍历动画
  busy.value = false;
  start.value = 0;
  clearMarks();
  status.value = english
    ? 'Reset complete. Choose a start vertex, then run BFS or DFS. The start is A.'
    : '已重置 · 点一个顶点设为起点，再点 BFS 或 DFS。当前起点：A。';
};
onUnmounted(clearTimers);
</script>

<template>
  <div class="graph-viz column center">
    <div class="toolbar row-wrap">
      <button class="btn bfs" :disabled="busy" @click="onRun('bfs')">
        {{ english ? 'Breadth-first search' : 'BFS 广度优先' }}
      </button>
      <button class="btn dfs" :disabled="busy" @click="onRun('dfs')">
        {{ english ? 'Depth-first search' : 'DFS 深度优先' }}
      </button>
      <button class="btn" @click="onReset">{{ english ? 'Reset' : '重置' }}</button>
    </div>
    <div class="lane-wrap">
      <div class="lane">
        <svg class="graph" width="460" height="320">
          <g class="edges">
            <line
              v-for="(e, i) in g.edges"
              :key="i"
              class="edge"
              :x1="g.vertices[e[0]].x"
              :y1="g.vertices[e[0]].y"
              :x2="g.vertices[e[1]].x"
              :y2="g.vertices[e[1]].y"
            />
          </g>
          <g class="verts">
            <!-- 顶点：可点换起点；访问/当前/起点态切换 -->
            <g
              v-for="v in g.vertices"
              :key="v.id"
              class="vertex"
              :class="{
                'is-start': start === v.id,
                visited: visited.includes(v.id),
                current: current === v.id,
              }"
              :transform="`translate(${v.x},${v.y})`"
              @click="onPick(v.id)"
            >
              <circle r="20" />
              <text>{{ v.label }}</text>
            </g>
          </g>
        </svg>
      </div>
    </div>
    <!-- 辅助结构面板：BFS 队列 / DFS 栈 的当前前沿 -->
    <div class="helper">
      <span class="helper-label">{{ helperLabel }}</span>
      <div class="slots">
        <span v-if="!frontier.length" class="hint">
          {{
            mode
              ? english
                ? '(empty)'
                : '（空）'
              : english
                ? 'Run BFS or DFS'
                : '点 BFS 或 DFS 开始'
          }}
        </span>
        <span v-for="(i, k) in frontier" :key="k" class="slot">{{ g.labelOf(i) }}</span>
      </div>
    </div>
    <p class="status">{{ status }}</p>
  </div>
</template>

<style scoped lang="less">
.graph-viz {
  width: 100%;
  gap: 14px;
}
.toolbar {
  gap: 10px;
  justify-content: center;
  align-items: center;
}
.btn {
  border: none;
  font-size: 15px;
  font-weight: bold;
  color: @font-color;
  padding: 9px 16px;
  .neumorphism-btn(4px, 12px);

  &:disabled {
    opacity: 0.4;
    pointer-events: none;
  }
}
.btn.bfs {
  color: #1f7a44;
}
.btn.dfs {
  color: #1f5e7a;
}
.lane-wrap {
  display: flex;
  justify-content: center;
}
.lane {
  width: 480px;
  padding: 8px;
  .neumorphism-pressed(4px, 14px);
}
.graph {
  display: block;
}
.edge {
  stroke: rgba(51, 51, 51, 0.25);
  stroke-width: 3;
  transition: stroke 0.3s;
}
.vertex circle {
  fill: #8bd3a0;
  stroke: transparent;
  stroke-width: 3;
  cursor: pointer;
  transition:
    fill 0.3s,
    stroke 0.3s;
}
.vertex text {
  fill: #1f5e3a;
  font-weight: bold;
  font-size: 16px;
  text-anchor: middle;
  dominant-baseline: central;
  pointer-events: none;
  transition: fill 0.3s;
}
.vertex.visited circle {
  fill: #4caf50;
}
.vertex.visited text {
  fill: #ffffff;
}
.vertex.current circle {
  fill: #2e7d32;
  stroke: #ffffff;
}
.vertex.current text {
  fill: #ffffff;
}
.vertex.is-start circle {
  stroke: @font-highlight-color;
}
.helper {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
}
.helper-label {
  font-size: 13px;
  font-weight: bold;
  color: @font-highlight-color;
  width: 64px;
  text-align: right;
}
.slots {
  display: flex;
  gap: 6px;
  min-height: 34px;
  align-items: center;
}
.slot {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 13px;
  color: #1f5e3a;
  background: #8bd3a0;
  border-radius: 6px;
  box-shadow:
    2px 2px 4px @neumorphis-dark-shadow,
    -2px -2px 4px @neumorphis-light-shadow;
}
.slots .hint {
  color: #aaa;
  font-size: 13px;
}
.status {
  font-weight: bold;
  font-size: 15px;
  min-height: 44px;
  max-width: 480px;
  text-align: center;
  color: #555555;
}
</style>
