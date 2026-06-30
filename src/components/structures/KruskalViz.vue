<!-- Kruskal 最小生成树互动：SVG 无向带权图 + 边排序列表 + 「下一步」单步演示（按权从小到大、并查集判环：不成环则加入） -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useKruskal } from './useKruskal';

const kr = useKruskal();
const result = kr.run();
const steps = result.steps;
const lastIndex = steps.length - 1;

const stepIndex = ref(0);
const cur = computed(() => steps[stepIndex.value]);
const mstSet = computed(() => new Set(cur.value.mst));
const rejectedSet = computed(() => new Set(cur.value.rejected));
const currentId = computed(() => cur.value.current?.id ?? '');
const labelOf = (i: number) => kr.vertices[i].label;

// 边视图（无向）：两端坐标 + 权重中点
const edgeViews = computed(() =>
  kr.edges.map((e) => {
    const a = kr.vertices[e.u];
    const b = kr.vertices[e.v];
    return {
      ...e,
      x1: a.x,
      y1: a.y,
      x2: b.x,
      y2: b.y,
      wx: (a.x + b.x) / 2,
      wy: (a.y + b.y) / 2,
      pair: `${a.label}–${b.label}`,
    };
  }),
);

const klass = (id: string) => ({
  mst: mstSet.value.has(id),
  cycle: rejectedSet.value.has(id),
  current: id === currentId.value,
});

const statusText = computed(() => {
  const s = cur.value;
  const tail = `｜已选 ${s.mst.length} 条，权重和 ${s.weight}`;
  if (stepIndex.value === 0)
    return `把所有边按权重从小到大排好，点「下一步」依次考虑——两端不连通就加入、否则成环跳过。${tail}`;
  const e = s.current!;
  const pair = `${labelOf(e.u)}-${labelOf(e.v)}`;
  if (s.accepted) {
    const done = s.mst.length === 5 ? ' ✓ 最小生成树完成！' : '';
    return `考虑 ${pair}（权 ${e.w}）：两端不连通 → 加入生成树。${done}${tail}`;
  }
  return `考虑 ${pair}（权 ${e.w}）：两端已连通 → 加入会成环，跳过。${tail}`;
});

const onNext = () => {
  if (stepIndex.value < lastIndex) stepIndex.value++;
};
const onReset = () => {
  stepIndex.value = 0;
};
</script>

<template>
  <div class="kruskal-viz column center">
    <div class="toolbar row-wrap">
      <button class="btn" :disabled="stepIndex >= lastIndex" @click="onNext">下一步</button>
      <button class="btn" @click="onReset">重置</button>
      <span class="hint"
        >第 {{ stepIndex }}/{{ lastIndex }} 步 · 已选 {{ cur.mst.length }} 条·权重
        {{ cur.weight }}</span
      >
    </div>
    <div class="board row-wrap">
      <div class="lane">
        <svg width="500" height="300">
          <g class="edges">
            <g v-for="e in edgeViews" :key="e.id" class="kedge" :class="klass(e.id)">
              <line :x1="e.x1" :y1="e.y1" :x2="e.x2" :y2="e.y2" />
              <text :x="e.wx" :y="e.wy">{{ e.w }}</text>
            </g>
          </g>
          <g class="verts">
            <g
              v-for="v in kr.vertices"
              :key="v.id"
              class="kvert"
              :transform="`translate(${v.x},${v.y})`"
            >
              <circle r="18" />
              <text>{{ v.label }}</text>
            </g>
          </g>
        </svg>
      </div>
      <div class="edge-list">
        <div class="el-title">边（按权重排序）</div>
        <div v-for="e in edgeViews" :key="e.id" class="ke-row" :class="klass(e.id)">
          <span class="ke-pair">{{ e.pair }}</span>
          <span class="ke-w">{{ e.w }}</span>
        </div>
      </div>
    </div>
    <p class="status">{{ statusText }}</p>
  </div>
</template>

<style scoped lang="less">
.kruskal-viz {
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
.hint {
  font-size: 13px;
  color: #888888;
}
.board {
  gap: 16px;
  justify-content: center;
  align-items: flex-start;
}
.lane {
  padding: 10px;
  .neumorphism-pressed(4px, 14px);
}
.kedge {
  line {
    stroke: #c2cdc6;
    stroke-width: 2.5;
    transition: stroke 0.25s;
  }
  text {
    fill: #6b7d72;
    font-size: 13px;
    font-weight: bold;
    text-anchor: middle;
    dominant-baseline: central;
    user-select: none;
    paint-order: stroke;
    stroke: #e0e0e0;
    stroke-width: 4;
  }
}
.kedge.current line {
  stroke: #f0a000;
  stroke-width: 4;
}
.kedge.mst line {
  stroke: #2e7d32;
  stroke-width: 5;
}
.kedge.cycle line {
  stroke: #e0631b;
  stroke-width: 3;
  stroke-dasharray: 6 5;
}
.kvert {
  circle {
    fill: #8bd3a0;
    stroke: transparent;
    stroke-width: 3;
  }
  text {
    fill: #1f5e3a;
    font-size: 14px;
    font-weight: bold;
    text-anchor: middle;
    dominant-baseline: central;
    user-select: none;
  }
}
.edge-list {
  min-width: 150px;
  padding: 10px 12px;
  .neumorphism-flat(4px, 12px);
  .el-title {
    font-size: 13px;
    color: #888888;
    margin-bottom: 6px;
  }
}
.ke-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  color: #555555;
  transition: background 0.2s;
}
.ke-row.current {
  background: #fff2cc;
  color: #6b4e00;
}
.ke-row.mst {
  color: #2e7d32;
}
.ke-row.cycle {
  color: #c0c0c0;
  text-decoration: line-through;
}
.status {
  font-weight: bold;
  font-size: 15px;
  min-height: 44px;
  max-width: 540px;
  text-align: center;
  color: #555555;
}
</style>
