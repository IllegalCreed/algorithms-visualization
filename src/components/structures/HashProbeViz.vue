<!-- 开放寻址互动组件：7 格扁平表 + 散列 key%7 直达 + 线性探测往后 + 装载因子读数 -->
<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import { useProbe, PROBE_SLOTS } from './useProbe';

const h = useProbe();
const val = ref(9);
const status = ref('输入一个数，点「插入」——撞了就在表内往后探一格。');
const homeMark = ref(-1); // hash 算出的「家」
const probeAt = ref(-1); // 正在探测的格
const landAt = ref(-1); // 落座的格
const hitAt = ref(-1); // 命中的格
const enterAt = ref(-1); // 新入未显值的格（探测走到才显）
const busy = ref(false);
let timers: ReturnType<typeof setTimeout>[] = [];
const sleep = (ms: number) => new Promise<void>((res) => timers.push(setTimeout(res, ms)));
const clearTimers = () => {
  timers.forEach(clearTimeout);
  timers = [];
};
const clearMarks = () => {
  homeMark.value = -1;
  probeAt.value = -1;
  landAt.value = -1;
  hitAt.value = -1;
  enterAt.value = -1;
};
const pct = computed(() => Math.round(h.load.value * 100));
const validVal = (): number | null => {
  if (!Number.isInteger(val.value) || val.value < 1 || val.value > 99) {
    status.value = '请输入 1–99 的整数。';
    return null;
  }
  return val.value;
};

const onInsert = async () => {
  if (busy.value) return;
  const v = validVal();
  if (v === null) return;
  busy.value = true;
  clearMarks();
  const r = h.insert(v); // 同步：查重 / 满 / 探测落座
  homeMark.value = r.home;
  if (!r.ok && r.reason === 'dup') {
    status.value = `查 ${v}：探测命中，${v} 已在表里，不重复插入。`;
  } else if (!r.ok && r.reason === 'full') {
    status.value = '表满了（装载因子 = 7/7 = 1）—— 该扩容 rehash 了。';
  } else {
    enterAt.value = r.slot;
    status.value = r.collision
      ? `hash(${v}) = ${v} % 7 = ${r.home}，被占 → 线性探测往后，第 ${r.slot} 号落座（探测 ${r.path.length} 次）。`
      : `hash(${v}) = ${v} % 7 = ${r.home}，${r.home} 号空 → 直接落座（探测 1 次）。`;
    for (let k = 0; k < r.path.length; k++) {
      const idx = r.path[k];
      if (k < r.path.length - 1) {
        probeAt.value = idx;
        await sleep(560);
        probeAt.value = -1;
      } else {
        enterAt.value = -1;
        landAt.value = idx;
        await sleep(640);
      }
    }
  }
  await sleep(600);
  clearMarks();
  busy.value = false;
};

const onSearch = async () => {
  if (busy.value) return;
  const v = validVal();
  if (v === null) return;
  busy.value = true;
  clearMarks();
  const r = h.search(v); // 同步：found + slot + steps
  homeMark.value = r.home;
  status.value = r.found
    ? `查找 ${v}：从 ${r.home} 号起线性探测 ${r.steps} 次，在 ${r.slot} 号命中！`
    : `查找 ${v}：从 ${r.home} 号起探测 ${r.steps} 次遇到空位 → 不在表中。`;
  for (let k = 0; k < r.path.length; k++) {
    const idx = r.path[k];
    probeAt.value = idx;
    await sleep(540);
    if (r.found && idx === r.slot) {
      probeAt.value = -1;
      hitAt.value = idx;
      break;
    }
    probeAt.value = -1;
  }
  await sleep(720);
  clearMarks();
  busy.value = false;
};

const onReset = () => {
  clearTimers(); // 重置可随时中断探测动画
  busy.value = false;
  clearMarks();
  h.reset();
  status.value = '已重置 · [_,15,8,23,4,_,_]，格 1-2-3 成一簇。输入一个数试试。';
};
onUnmounted(clearTimers);
</script>

<template>
  <div class="probe-viz column center">
    <div class="toolbar row-wrap">
      <input class="val-input" v-model.number="val" type="number" min="1" max="99" />
      <button class="btn" :disabled="busy" @click="onInsert">插入</button>
      <button class="btn" :disabled="busy" @click="onSearch">查找</button>
      <button class="btn" @click="onReset">重置</button>
    </div>
    <div class="lane-wrap">
      <!-- 画布：7 格扁平表横排 -->
      <div class="lane">
        <div v-for="(s, i) in h.slots.value" :key="i" class="slot">
          <div
            class="cell"
            :class="{
              filled: s !== null,
              home: homeMark === i,
              probe: probeAt === i,
              land: landAt === i,
              hit: hitAt === i,
              enter: enterAt === i,
            }"
          >
            {{ s !== null && enterAt !== i ? s : '' }}
          </div>
          <div class="idx">{{ i }}</div>
        </div>
      </div>
    </div>
    <div class="readout">
      <span class="lf-label">装载因子</span>
      <span class="lf-val" :class="{ full: h.isFull.value }"
        >{{ h.size.value }}/{{ PROBE_SLOTS }}</span
      >
      <span class="lf-pct">≈ {{ pct }}%</span>
      <span class="bar"><i :class="{ full: h.isFull.value }" :style="{ width: pct + '%' }" /></span>
    </div>
    <p class="status">{{ status }}</p>
  </div>
</template>

<style scoped lang="less">
.probe-viz {
  width: 100%;
  gap: 18px;
}
.toolbar {
  gap: 10px;
  justify-content: center;
  align-items: center;
}
.val-input {
  width: 64px;
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
  padding: 9px 16px;
  .neumorphism-btn(4px, 12px);

  &:disabled {
    opacity: 0.4;
    pointer-events: none;
  }
}
.lane-wrap {
  display: flex;
  justify-content: center;
}
.lane {
  // 定宽定高：7 格扁平表，空表与满表同尺寸，不跳版
  display: flex;
  flex-direction: row;
  gap: 10px;
  padding: 18px 18px;
  .neumorphism-pressed(4px, 16px);
}
.slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
}
.cell {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 17px;
  border-radius: 11px;
  color: #1f5e3a;
  // 空格：凹陷
  .neumorphism-pressed(3px, 10px);
  transition:
    background-color 0.25s,
    color 0.25s,
    transform 0.28s,
    box-shadow 0.28s,
    opacity 0.28s;
}
.cell.filled {
  // 落了键：浅绿凸起
  color: #ffffff;
  background: #8bd3a0;
  box-shadow:
    3px 3px 7px @neumorphis-dark-shadow,
    -3px -3px 7px @neumorphis-light-shadow;
}
.cell.home {
  // hash 算出的「家」：高亮绿虚框
  outline: 2px dashed @font-highlight-color;
  outline-offset: 2px;
}
.cell.probe {
  // 探测中：黄 + 上浮
  background: #ffcf5c;
  color: #6b4e00;
  transform: translateY(-6px);
}
.cell.land {
  // 落座：深绿 + 上浮
  background: #4caf50;
  color: #ffffff;
  transform: translateY(-6px);
}
.cell.hit {
  // 命中：更深绿
  background: #2e7d32;
  color: #ffffff;
  transform: scale(1.08);
}
.cell.enter {
  // 新入未显值：渐入
  opacity: 0.35;
}
.idx {
  font-size: 12px;
  color: #999;
}
.readout {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: bold;
  color: #555;
}
.lf-label {
  color: #777;
}
.lf-val {
  font-size: 18px;
  color: @font-highlight-color;
}
.lf-val.full {
  color: #ff8a65;
}
.lf-pct {
  color: #999;
  font-weight: normal;
}
.bar {
  width: 120px;
  height: 9px;
  border-radius: 5px;
  overflow: hidden;
  .neumorphism-pressed(2px, 6px);

  > i {
    display: block;
    height: 100%;
    background: @font-highlight-color;
    transition:
      width 0.3s,
      background-color 0.3s;
  }
  > i.full {
    background: #ff8a65;
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
