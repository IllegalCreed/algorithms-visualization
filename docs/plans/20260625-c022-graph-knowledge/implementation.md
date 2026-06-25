# 实现：图 Graph 知识页（TDD 任务分解 T1–T4）

> Status: verified
> Stable ID: C-20260625-022
> Owner: IllegalCreed
> Created: 2026-06-25
> Last reviewed: 2026-06-25
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 执行顺序（按依赖）

`T1 useGraph` → `T2 GraphViz` → `T3 图页` → `T4 e2e`。每个任务铁律：先写失败测试 → 跑红 → 实现 → 跑绿。骨架复用、零改动。

---

## T1 — `useGraph.ts` 固定无向图 + BFS/DFS（L3，先写测试）

**先写失败测试** `src/components/structures/useGraph.spec.ts`（`TC-GRAPH-LOGIC-*`）：

```ts
import { describe, it, expect } from 'vitest';
import { useGraph } from './useGraph';

const order = (steps: { visit: number }[]) => steps.map((s) => s.visit);

describe('useGraph', () => {
  it('TC-GRAPH-LOGIC-01 图结构：6 顶点、7 边、adj', () => {
    const g = useGraph();
    expect(g.vertices).toHaveLength(6);
    expect(g.edges).toHaveLength(7);
    expect(g.adj[0]).toEqual([1, 2]);
    expect(g.adj[3]).toEqual([1, 4, 5]);
  });
  it('TC-GRAPH-LOGIC-02 labelOf + 顶点坐标', () => {
    const g = useGraph();
    expect(g.labelOf(0)).toBe('A');
    expect(g.labelOf(5)).toBe('F');
    expect(g.vertices[0]).toMatchObject({ id: 0, label: 'A' });
    expect(typeof g.vertices[0].x).toBe('number');
  });
  it('TC-GRAPH-LOGIC-03 bfs(0) 顺序 A B C D E F', () => {
    expect(order(useGraph().bfs(0))).toEqual([0, 1, 2, 3, 4, 5]);
  });
  it('TC-GRAPH-LOGIC-04 dfs(0) 顺序 A B D E F C', () => {
    expect(order(useGraph().dfs(0))).toEqual([0, 1, 3, 4, 5, 2]);
  });
  it('TC-GRAPH-LOGIC-05 bfs 与 dfs 顺序不同', () => {
    const g = useGraph();
    expect(order(g.bfs(0))).not.toEqual(order(g.dfs(0)));
  });
  it('TC-GRAPH-LOGIC-06 bfs 访问全部 6 顶点、不重不漏', () => {
    const o = order(useGraph().bfs(0));
    expect(o).toHaveLength(6);
    expect(new Set(o).size).toBe(6);
  });
  it('TC-GRAPH-LOGIC-07 dfs 访问全部 6 顶点、不重不漏', () => {
    const o = order(useGraph().dfs(0));
    expect(o).toHaveLength(6);
    expect(new Set(o).size).toBe(6);
  });
  it('TC-GRAPH-LOGIC-08 bfs 首步 frontier = 队列 [1,2]', () => {
    expect(useGraph().bfs(0)[0].frontier).toEqual([1, 2]);
  });
  it('TC-GRAPH-LOGIC-09 dfs 首步 frontier = 栈 [2,1]', () => {
    expect(useGraph().dfs(0)[0].frontier).toEqual([2, 1]);
  });
  it('TC-GRAPH-LOGIC-10 换起点也访问全部（bfs(3)）', () => {
    const o = order(useGraph().bfs(3));
    expect(o[0]).toBe(3);
    expect(new Set(o).size).toBe(6);
  });
});
```

**实现** `src/components/structures/useGraph.ts`（见 design §2）：

```ts
export interface Vertex {
  id: number;
  label: string;
  x: number;
  y: number;
}
export interface TraverseStep {
  visit: number;
  frontier: number[];
}
export interface UseGraph {
  vertices: Vertex[];
  edges: [number, number][];
  adj: number[][];
  labelOf: (i: number) => string;
  bfs: (start: number) => TraverseStep[];
  dfs: (start: number) => TraverseStep[];
}

const LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];
const POS: [number, number][] = [
  [230, 42],
  [108, 118],
  [352, 118],
  [108, 244],
  [352, 244],
  [230, 300],
];
const ADJ: number[][] = [
  [1, 2],
  [0, 3],
  [0, 4],
  [1, 4, 5],
  [2, 3, 5],
  [3, 4],
];
const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 4],
  [3, 4],
  [3, 5],
  [4, 5],
];

export function useGraph(): UseGraph {
  const vertices: Vertex[] = LABELS.map((label, id) => ({
    id,
    label,
    x: POS[id][0],
    y: POS[id][1],
  }));
  const labelOf = (i: number): string => LABELS[i];
  const bfs = (start: number): TraverseStep[] => {
    const visited = new Set([start]);
    const q = [start];
    const steps: TraverseStep[] = [];
    while (q.length) {
      const u = q.shift()!;
      for (const v of ADJ[u])
        if (!visited.has(v)) {
          visited.add(v);
          q.push(v);
        }
      steps.push({ visit: u, frontier: [...q] });
    }
    return steps;
  };
  const dfs = (start: number): TraverseStep[] => {
    const visited = new Set([start]);
    const st = [start];
    const steps: TraverseStep[] = [];
    while (st.length) {
      const u = st.pop()!;
      for (const v of [...ADJ[u]].reverse())
        if (!visited.has(v)) {
          visited.add(v);
          st.push(v);
        }
      steps.push({ visit: u, frontier: [...st] });
    }
    return steps;
  };
  return { vertices, edges: EDGES, adj: ADJ, labelOf, bfs, dfs };
}
```

**验证**：`pnpm test:unit run src/components/structures/useGraph.spec.ts`。

---

## T2 — `GraphViz.vue` 图互动组件（L4，先写测试）

**先写失败测试** `src/components/structures/GraphViz.spec.ts`（`TC-VIZ-GRAPHVIZ-*`）：

```ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import GraphViz from './GraphViz.vue';

const mountIt = () => mount(GraphViz);
const btn = (w: ReturnType<typeof mountIt>, label: string) =>
  w.findAll('.btn').find((b) => b.text().includes(label))!;

describe('GraphViz', () => {
  it('TC-VIZ-GRAPHVIZ-01 初始 6 顶点 + 7 边 + 3 按钮 + 默认起点高亮', () => {
    const w = mountIt();
    expect(w.findAll('.vertex')).toHaveLength(6);
    expect(w.findAll('.edge')).toHaveLength(7);
    expect(btn(w, 'BFS')).toBeTruthy();
    expect(btn(w, 'DFS')).toBeTruthy();
    expect(btn(w, '重置')).toBeTruthy();
    expect(w.findAll('.vertex.is-start')).toHaveLength(1);
  });
  it('TC-VIZ-GRAPHVIZ-02 顶点标签 A–F', () => {
    const w = mountIt();
    expect(w.findAll('.vertex text').map((t) => t.text())).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
  });
  it('TC-VIZ-GRAPHVIZ-03 点顶点换起点（唯一 is-start）', async () => {
    const w = mountIt();
    await w.findAll('.vertex')[2].trigger('click');
    expect(w.findAll('.vertex')[2].classes()).toContain('is-start');
    expect(w.findAll('.vertex.is-start')).toHaveLength(1);
  });
  it('TC-VIZ-GRAPHVIZ-04 BFS status 含「队列」+ 顺序 A B C D E F', async () => {
    const w = mountIt();
    await btn(w, 'BFS').trigger('click');
    const s = w.find('.status').text();
    expect(s).toContain('队列');
    expect(s).toContain('A B C D E F');
  });
  it('TC-VIZ-GRAPHVIZ-05 DFS status 含「栈」+ 顺序 A B D E F C', async () => {
    const w = mountIt();
    await btn(w, 'DFS').trigger('click');
    const s = w.find('.status').text();
    expect(s).toContain('栈');
    expect(s).toContain('A B D E F C');
  });
  it('TC-VIZ-GRAPHVIZ-06 BFS helper-label 含「队列」', async () => {
    const w = mountIt();
    await btn(w, 'BFS').trigger('click');
    expect(w.find('.helper-label').text()).toContain('队列');
  });
  it('TC-VIZ-GRAPHVIZ-07 DFS helper-label 含「栈」', async () => {
    const w = mountIt();
    await btn(w, 'DFS').trigger('click');
    expect(w.find('.helper-label').text()).toContain('栈');
  });
  it('TC-VIZ-GRAPHVIZ-08 重置复位（无 current、status 含起点）', async () => {
    const w = mountIt();
    await btn(w, 'BFS').trigger('click');
    await btn(w, '重置').trigger('click');
    expect(w.findAll('.vertex.current')).toHaveLength(0);
    expect(w.find('.status').text()).toContain('起点');
  });
  it('TC-VIZ-GRAPHVIZ-09 换起点后 BFS 从该点出发', async () => {
    const w = mountIt();
    await w.findAll('.vertex')[5].trigger('click'); // F
    await btn(w, 'BFS').trigger('click');
    expect(w.find('.status').text()).toContain('从 F');
  });
  it('TC-VIZ-GRAPHVIZ-10 BFS 与 DFS 顺序不同', async () => {
    const w = mountIt();
    await btn(w, 'BFS').trigger('click');
    const sb = w.find('.status').text();
    await btn(w, '重置').trigger('click');
    await btn(w, 'DFS').trigger('click');
    const sd = w.find('.status').text();
    expect(sb).not.toBe(sd);
  });
});
```

**实现** `src/components/structures/GraphViz.vue`（见 design §3；用 `useGraph` + SVG）。骨架：

```vue
<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import { useGraph } from './useGraph';

const g = useGraph();
const start = ref(0);
const visited = ref<number[]>([]);
const current = ref(-1);
const frontier = ref<number[]>([]);
const mode = ref<'' | 'bfs' | 'dfs'>('');
const busy = ref(false);
const status = ref('点一个顶点设为起点，再点 BFS 或 DFS。当前起点：A。');
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
  mode.value === 'bfs' ? '队列 →' : mode.value === 'dfs' ? '栈 ↑' : '　',
);

const onPick = (i: number) => {
  if (busy.value) return;
  start.value = i;
  clearMarks();
  status.value = `当前起点：${g.labelOf(i)}。点 BFS 或 DFS 看遍历。`;
};
const onRun = async (kind: 'bfs' | 'dfs') => {
  if (busy.value) return;
  busy.value = true;
  clearMarks();
  mode.value = kind;
  const steps = kind === 'bfs' ? g.bfs(start.value) : g.dfs(start.value);
  const ord = steps.map((s) => g.labelOf(s.visit)).join(' ');
  status.value =
    kind === 'bfs'
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
  status.value = '已重置 · 点一个顶点设为起点，再点 BFS 或 DFS。当前起点：A。';
};
onUnmounted(clearTimers);
</script>

<template>
  <div class="graph-viz column center">
    <div class="toolbar row-wrap">
      <button class="btn bfs" :disabled="busy" @click="onRun('bfs')">BFS 广度优先</button>
      <button class="btn dfs" :disabled="busy" @click="onRun('dfs')">DFS 深度优先</button>
      <button class="btn" @click="onReset">重置</button>
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
    <div class="helper">
      <span class="helper-label">{{ helperLabel }}</span>
      <div class="slots">
        <span v-if="!frontier.length" class="hint">{{
          mode ? '（空）' : '点 BFS 或 DFS 开始'
        }}</span>
        <span v-for="(i, k) in frontier" :key="k" class="slot">{{ g.labelOf(i) }}</span>
      </div>
    </div>
    <p class="status">{{ status }}</p>
  </div>
</template>

<style scoped lang="less">
/* SVG 顶点圆(idle 浅绿/visited 深绿/current 更深+白环/is-start 主题绿描边) + 边线；辅助面板 helper-label + slots；画布定宽；取原型样式 */
</style>
```

注：`bfs/dfs` 同步返回步序、status/mode 同步置（L4 可断言），遍历点亮为延时动画（卸载清理、busy 防重入、重置可中断）。**验证**：`pnpm test:unit run src/components/structures/GraphViz.spec.ts`。

---

## T3 — `Graph.vue` 图页（L4，先写测试）

**先写失败测试** `src/views/Article/DataStructure/Graph.spec.ts`（`TC-VIEW-GRAPH-*`）：

- `-01` 挂载渲染 `Article` + `GraphViz`（`findComponent` 存在）。
- `-02` 含「图」标题与 `Playground`（`.playground` 存在）。

**实现**：填充 `Graph.vue`（见 design §4 大纲），正文以原型文案为基础。**验证**：`pnpm test:unit run src/views/Article/DataStructure/Graph.spec.ts`。

---

## T4 — e2e（L5，Playwright）

`e2e/graph.e2e.ts`（`TC-E2E-GRAPH-01`）：导航 `/docs/graph`、见标题「图」与 `.playground`；限定 `.graph-viz` 内：初始 6 顶点 + 7 边；点 BFS 见 status 含「队列」+ 顺序「A B C D E F」；重置后 status 含「起点」。（菜单也用 `.btn`，全部限定 `.graph-viz`/`.article`。）**验证**：`pnpm exec playwright test e2e/graph.e2e.ts`。

---

## 全门禁

`pnpm type-check` / `pnpm lint:check` / `pnpm format:check` / `pnpm test:unit run` / `pnpm exec playwright test`，全绿后回写三索引 + roadmap，提交 main。

## 自测报告（实现期回填）

- [x] T1 useGraph 全绿（10 Case）— TDD：先红（模块缺失）→ 实现 → 绿；bfs(队列)/dfs(栈) 顺序（A B C D E F / A B D E F C）、frontier、不重不漏一次通过
- [x] T2 GraphViz 全绿（10 Case）— 一次通过；bfs/dfs 同步返回步序 + status/mode 同步置（L4 同步断言顺序/队列栈标签）、遍历点亮延时动画、重置可中断
- [x] T3 图页全绿（2 Case）
- [x] T4 e2e 全绿（TC-E2E-GRAPH-01）— 真机另验（dev server 截图）：六边形 6 顶点 SVG 图（A 起点环、7 边无交叉）；BFS→队列+顺序、DFS→栈+不同顺序、重置复位
- [x] 全门禁达标：type-check ✓ / lint:check ✓ / format:check ✓（useGraph/Graph 经 prettier --write）/ coverage All files 92.60%/89.83%/92.72%/93.54%（聚合过门槛；GraphViz 96.82% 行，动画循环由 e2e 覆盖）
- [x] 单测 528 passed（81 文件，含新增 22 单测 Case）+ e2e 18 passed（含新增 1）；8 排序 + 栈 + 队列 + 数组 + 链表 + 树 + 堆 + 哈希 + 播放器 全部现有 Case 零回归；**骨架零改动**；**M3 数据结构 8/8 收官、M3 菜单全部落地**
