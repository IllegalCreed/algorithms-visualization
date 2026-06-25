<!-- 哈希表互动组件：拉链法 7 桶阵列 + 散列直达 key%7 + 冲突追加 + 扫链查找 -->
<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { useHash } from './useHash';

const h = useHash();
const val = ref(11);
const status = ref('输入一个数，点「插入」——看它被算进哪个桶。');
const lit = ref(-1); // 命中桶
const cmpAt = ref<[number, number] | null>(null); // 扫链比较中 [桶, 链下标]
const hotAt = ref<[number, number] | null>(null); // 命中 [桶, 链下标]
const enterId = ref<string | null>(null);
const busy = ref(false);
let timers: ReturnType<typeof setTimeout>[] = [];
const sleep = (ms: number) => new Promise<void>((res) => timers.push(setTimeout(res, ms)));
const clearTimers = () => {
  timers.forEach(clearTimeout);
  timers = [];
};
const clearMarks = () => {
  lit.value = -1;
  cmpAt.value = null;
  hotAt.value = null;
};
const isCmp = (b: number, j: number) =>
  !!cmpAt.value && cmpAt.value[0] === b && cmpAt.value[1] === j;
const isHot = (b: number, j: number) =>
  !!hotAt.value && hotAt.value[0] === b && hotAt.value[1] === j;
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
  const r = h.insert(v); // 同步：查重 / 满 / 入桶
  lit.value = r.bucket;
  if (!r.ok && r.reason === 'dup') {
    status.value = `hash(${v}) = ${v} % 7 = ${r.bucket}；${v} 已经在 ${r.bucket} 号桶里了。`;
  } else if (!r.ok && r.reason === 'full') {
    status.value = '演示容量到上限（16 个），先重置。';
  } else {
    const chain = h.buckets.value[r.bucket];
    enterId.value = chain[chain.length - 1][0];
    status.value = r.collision
      ? `hash(${v}) = ${v} % 7 = ${r.bucket}，${r.bucket} 号桶已有元素 → 冲突！追加到链尾，O(1)。`
      : `hash(${v}) = ${v} % 7 = ${r.bucket}，${r.bucket} 号桶是空的，直接放入，O(1)。`;
  }
  await sleep(900);
  enterId.value = null;
  clearMarks();
  busy.value = false;
};
const onSearch = async () => {
  if (busy.value) return;
  const v = validVal();
  if (v === null) return;
  busy.value = true;
  clearMarks();
  const r = h.search(v); // 同步：found + bucket + steps
  lit.value = r.bucket;
  status.value = r.found
    ? `hash(${v}) = ${v} % 7 = ${r.bucket} → 在 ${r.bucket} 号桶第 ${r.steps} 个找到 ${v}！（扫链 ${r.steps} 次）`
    : `hash(${v}) = ${v} % 7 = ${r.bucket} → ${r.bucket} 号桶里没有 ${v}（找了 ${r.steps} 个），不存在。`;
  for (let j = 0; j < r.steps; j++) {
    cmpAt.value = [r.bucket, j];
    await sleep(560);
  }
  cmpAt.value = null;
  if (r.found) hotAt.value = [r.bucket, r.steps - 1];
  await sleep(720);
  clearMarks();
  busy.value = false;
};
const onReset = () => {
  clearTimers(); // 重置可随时中断进行中的扫链动画
  busy.value = false;
  clearMarks();
  enterId.value = null;
  h.reset();
  status.value = '已重置 · 1 号桶里 15、8 已经冲突了。输入一个数试试。';
};
onUnmounted(clearTimers);
</script>

<template>
  <div class="hash-viz column center">
    <div class="toolbar row-wrap">
      <input class="val-input" v-model.number="val" type="number" min="1" max="99" />
      <button class="btn" :disabled="busy" @click="onInsert">插入</button>
      <button class="btn" :disabled="busy" @click="onSearch">查找</button>
      <button class="btn" @click="onReset">重置</button>
    </div>
    <div class="lane-wrap">
      <!-- 画布：7 桶竖排，每桶一条横向链 -->
      <div class="lane">
        <div
          v-for="(chain, b) in h.buckets.value"
          :key="b"
          class="bucket"
          :class="{ lit: lit === b }"
          :data-b="b"
        >
          <div class="bindex">{{ b }}</div>
          <div class="barrow">→</div>
          <div class="chain">
            <span v-if="!chain.length" class="empty-slot">空</span>
            <div
              v-for="(e, j) in chain"
              :key="e[0]"
              class="entry"
              :class="{ cmp: isCmp(b, j), hot: isHot(b, j), enter: e[0] === enterId }"
            >
              {{ e[1] }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <p class="status">{{ status }}</p>
  </div>
</template>

<style scoped lang="less">
.hash-viz {
  width: 100%;
  gap: 16px;
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
  width: 520px;
  padding: 14px 16px;
  .neumorphism-pressed(4px, 14px);
}
.bucket {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 40px;
  gap: 6px;
}
.bindex {
  flex: none;
  width: 34px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 13px;
  color: #777;
  border-radius: 7px;
  box-shadow:
    2px 2px 4px @neumorphis-dark-shadow,
    -2px -2px 4px @neumorphis-light-shadow;
  transition:
    background-color 0.25s,
    color 0.25s;
}
.bucket.lit .bindex {
  background: @font-highlight-color;
  color: #ffffff;
}
.barrow {
  flex: none;
  width: 16px;
  text-align: center;
  color: #b3b3b3;
  font-weight: bold;
}
.chain {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  min-height: 32px;
}
.entry {
  flex: none;
  width: 34px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  color: #1f5e3a;
  background: #8bd3a0;
  border-radius: 7px;
  box-shadow:
    2px 2px 4px @neumorphis-dark-shadow,
    -2px -2px 4px @neumorphis-light-shadow;
  transition:
    background-color 0.25s,
    color 0.25s,
    transform 0.3s,
    opacity 0.3s;
}
.entry.enter {
  opacity: 0;
  transform: translateX(20px) scale(0.6);
}
.entry.cmp {
  background: #ffcf5c;
  color: #6b4e00;
}
.entry.hot {
  background: #4caf50;
  color: #ffffff;
  transform: scale(1.1);
}
.empty-slot {
  font-size: 12px;
  color: #bbb;
}
.status {
  font-weight: bold;
  font-size: 15px;
  min-height: 44px;
  max-width: 500px;
  text-align: center;
  color: #555555;
}
</style>
