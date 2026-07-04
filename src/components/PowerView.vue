<!-- src/components/PowerView.vue —— 幂块轨（快速幂；数学与数论第 4 页，第 18 轨 C-080） -->
<script setup lang="ts">
import { computed } from 'vue';
import type { PowerTrack } from '@/components/player/types';

const props = defineProps<{ power: PowerTrack }>();

const cells = computed(() =>
  props.power.blocks.map((b, i) => ({
    i,
    label: `${props.power.a}^${b.exp}`,
    value: b.value,
    bit: b.bit,
    selected: b.selected,
    current: props.power.current === i,
  })),
);

// 选中幂块的连乘式，如 3 × 81 × 6561
const product = computed(() => {
  const sel = props.power.blocks.filter((b) => b.selected).map((b) => b.value);
  return sel.length ? sel.join(' × ') : '1';
});
</script>

<template>
  <div class="power-view center">
    <!-- 顶部：n 及其二进制 -->
    <div class="power-head">
      求
      <b
        >{{ power.a }}<sup>{{ power.n }}</sup></b
      >，指数 {{ power.n }} = <span class="power-bin">{{ power.binary }}</span
      ><sub>2</sub>
    </div>

    <!-- 幂块行 -->
    <div class="power-blocks">
      <div
        v-for="c in cells"
        :key="c.i"
        class="power-block center"
        :class="{
          'power-selected': c.selected,
          'power-current': c.current,
          'power-skip': !c.selected,
        }"
      >
        <div class="pb-exp">{{ c.label }}</div>
        <div class="pb-val">{{ c.value }}</div>
        <div class="pb-bit">位={{ c.bit }}{{ c.selected ? ' ✓' : '' }}</div>
      </div>
    </div>

    <!-- 结果 -->
    <div class="power-result">
      结果 = {{ product }} = <b>{{ power.result }}</b>
    </div>
  </div>
</template>

<style scoped lang="less">
.power-view {
  width: 100%;
  padding: 14px;
  flex-direction: column;
  gap: 16px;
}
.power-head {
  font-size: 16px;
  color: @font-color;
  sup {
    font-size: 11px;
  }
  sub {
    font-size: 11px;
  }
}
.power-bin {
  font-family: monospace;
  font-weight: bold;
  font-size: 18px;
  color: #1f5e3a;
  letter-spacing: 3px;
}
.power-blocks {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}
.power-block {
  flex-direction: column;
  width: 84px;
  padding: 10px 6px;
  border-radius: 10px;
  background-color: #eef3ef;
  transition:
    background-color 0.25s,
    box-shadow 0.25s;
  .pb-exp {
    font-size: 13px;
    color: #6b7d72;
    font-weight: bold;
  }
  .pb-val {
    font-size: 20px;
    font-weight: bold;
    color: @font-color;
    margin: 4px 0;
  }
  .pb-bit {
    font-size: 12px;
    color: #9aa8a0;
  }
}
/* 选中（位=1，乘入结果）：绿 */
.power-block.power-selected {
  background-color: #8bd3a0;
  .pb-exp,
  .pb-val {
    color: #1f5e3a;
  }
  .pb-bit {
    color: #2e7d32;
  }
}
/* 跳过（位=0）：灰暗 */
.power-block.power-skip {
  opacity: 0.7;
}
/* 当前块：琥珀环 */
.power-block.power-current {
  box-shadow:
    0 0 0 3px #f0a000,
    inset 2px 2px 5px @neumorphis-dark-shadow;
}
.power-result {
  font-size: 17px;
  color: @font-color;
  b {
    color: #1f5e3a;
    font-size: 19px;
  }
}
</style>
