<!-- 并查集互动组件：固定 8 节点 + 父指针箭头 + 合并 union / 查根 find(路径压缩) / 连通? -->
<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import type { SiteLocale } from '@/i18n/catalog';
import { useUnionFind, UF_SIZE } from './useUnionFind';

const props = withDefaults(defineProps<{ locale?: SiteLocale }>(), { locale: 'zh-CN' });
const english = props.locale === 'en';
const uf = useUnionFind();
// 每个非根节点一根指向 parent 的边（避免 v-for + v-if 同元素）
const edges = computed(() => uf.parent.value.map((p, i) => ({ i, p })).filter((e) => e.p !== e.i));
const valA = ref(0);
const valB = ref(1);
const status = ref(
  english
    ? 'Choose two elements to unite, find a root, or test connectivity. Each starts alone.'
    : '选两个元素「合并」，或「查根 / 连通?」试试。一开始 8 个元素各自成组。',
);
const litPath = ref<number[]>([]);
const litRoot = ref(-1);
let timers: ReturnType<typeof setTimeout>[] = [];
const clearTimers = () => {
  timers.forEach(clearTimeout);
  timers = [];
};
const flash = (path: number[], root: number) => {
  litPath.value = path;
  litRoot.value = root;
  timers.push(
    setTimeout(() => {
      litPath.value = [];
      litRoot.value = -1;
    }, 1000),
  );
};
const posX = (i: number) => 35 + i * 50;
const posY = 175;
const arc = (i: number, j: number) => {
  const x1 = posX(i);
  const x2 = posX(j);
  const mx = (x1 + x2) / 2;
  const my = posY - 55 - Math.abs(i - j) * 9;
  return `M ${x1} ${posY - 16} Q ${mx} ${my} ${x2} ${posY - 16}`;
};
const ok = (v: number) => Number.isInteger(v) && v >= 0 && v < UF_SIZE;

const onUnion = () => {
  if (!ok(valA.value) || !ok(valB.value)) {
    status.value = english
      ? `Enter elements from 0 through ${UF_SIZE - 1}.`
      : `请输入 0–${UF_SIZE - 1} 的元素。`;
    return;
  }
  const r = uf.union(valA.value, valB.value);
  status.value = english
    ? r.merged
      ? `Unite ${valA.value} and ${valB.value}: root ${r.child} now points to root ${r.root}.`
      : `${valA.value} and ${valB.value} already belong to the same set.`
    : r.merged
      ? `合并 ${valA.value} 和 ${valB.value}：把根 ${r.child} 指向根 ${r.root}，两组并成一组。`
      : `${valA.value} 和 ${valB.value} 已经在同一组，无需合并。`;
  flash([], r.root);
};
const onFind = () => {
  if (!ok(valA.value)) return;
  const fr = uf.find(valA.value);
  if (fr.root === valA.value) {
    status.value = english
      ? `${valA.value} is already a root; the path has zero edges.`
      : `查根 ${valA.value}：它本身就是根（走 0 步）。`;
  } else {
    uf.compress(valA.value); // 同步路径压缩
    status.value = english
      ? `Find ${valA.value}: reach root ${fr.root} in ${fr.path.length - 1} steps, then compress the path directly to it.`
      : `查根 ${valA.value}：走 ${fr.path.length - 1} 步到根 ${fr.root}；路径压缩——把沿途节点直接指向根 ${fr.root}，下次一步到位。`;
  }
  flash(fr.path, fr.root);
};
const onConnected = () => {
  if (!ok(valA.value) || !ok(valB.value)) return;
  const c = uf.connected(valA.value, valB.value);
  status.value = english
    ? c
      ? `${valA.value} and ${valB.value} have the same root, so they are connected.`
      : `${valA.value} and ${valB.value} have different roots, so they are disconnected.`
    : c
      ? `连通？${valA.value} 和 ${valB.value} 同根，在同一组——连通。`
      : `连通？${valA.value} 和 ${valB.value} 根不同，不在同一组——不连通。`;
  flash([...uf.find(valA.value).path, ...uf.find(valB.value).path], -1);
};
const onReset = () => {
  clearTimers();
  litPath.value = [];
  litRoot.value = -1;
  uf.reset();
  status.value = english
    ? 'Reset complete. All eight elements are separate.'
    : '已重置 · 8 个元素各自成组。';
};
onUnmounted(clearTimers);
</script>

<template>
  <div class="union-find-viz column center">
    <div class="toolbar row-wrap">
      <input class="val-input" v-model.number="valA" type="number" min="0" :max="UF_SIZE - 1" />
      <input class="val-input" v-model.number="valB" type="number" min="0" :max="UF_SIZE - 1" />
      <button class="btn" @click="onUnion">{{ english ? 'Union' : '合并' }}</button>
      <button class="btn" @click="onFind">{{ english ? 'Find root' : '查根' }}</button>
      <button class="btn" @click="onConnected">{{ english ? 'Connected?' : '连通?' }}</button>
      <button class="btn" @click="onReset">{{ english ? 'Reset' : '重置' }}</button>
    </div>
    <div class="lane-wrap">
      <div class="lane">
        <svg width="430" height="220">
          <defs>
            <marker id="uf-arrow" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
              <path d="M0,0 L7,3 L0,6 z" fill="#9aa8a0" />
            </marker>
          </defs>
          <g class="edges">
            <path
              v-for="e in edges"
              :key="'e' + e.i"
              class="uf-edge"
              :d="arc(e.i, e.p)"
              marker-end="url(#uf-arrow)"
            />
          </g>
          <g class="verts">
            <g
              v-for="(p, i) in uf.parent.value"
              :key="i"
              class="ufnode"
              :class="{ path: litPath.includes(i), root: litRoot === i }"
              :transform="`translate(${posX(i)},${posY})`"
            >
              <circle r="16" />
              <text>{{ i }}</text>
            </g>
          </g>
        </svg>
      </div>
    </div>
    <p class="readout">
      {{ english ? 'Current components:' : '当前' }} <b>{{ uf.groupCount.value }}</b>
      {{ english ? '' : '个组（连通分量）' }}
    </p>
    <p class="status">{{ status }}</p>
  </div>
</template>

<style scoped lang="less">
.union-find-viz {
  width: 100%;
  gap: 16px;
}
.toolbar {
  gap: 10px;
  justify-content: center;
  align-items: center;
}
.val-input {
  width: 56px;
  padding: 8px 10px;
  font-size: 15px;
  font-weight: bold;
  text-align: center;
  color: @font-color;
  border: none;
  .neumorphism-pressed(3px, 10px);
}
.btn {
  border: none;
  font-size: 15px;
  font-weight: bold;
  color: @font-color;
  padding: 9px 14px;
  .neumorphism-btn(4px, 12px);
}
.lane-wrap {
  display: flex;
  justify-content: center;
}
.lane {
  width: 460px;
  padding: 10px;
  .neumorphism-pressed(4px, 14px);
}
.uf-edge {
  fill: none;
  stroke: #9aa8a0;
  stroke-width: 2.5;
}
.ufnode {
  circle {
    fill: #8bd3a0;
    stroke: transparent;
    stroke-width: 3;
    transition:
      fill 0.25s,
      stroke 0.25s;
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
.ufnode.path circle {
  fill: #ffcf5c;
}
.ufnode.path text {
  fill: #6b4e00;
}
.ufnode.root circle {
  fill: #4caf50;
  stroke: #2e7d32;
}
.ufnode.root text {
  fill: #ffffff;
}
.readout {
  font-size: 15px;
  font-weight: bold;
  color: #555;

  b {
    color: @font-highlight-color;
    font-size: 18px;
  }
}
.status {
  font-weight: bold;
  font-size: 15px;
  min-height: 44px;
  max-width: 520px;
  text-align: center;
  color: #555555;
}
</style>
