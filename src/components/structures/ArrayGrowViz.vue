<!-- 动态数组扩容互动组件：定容格阵 + append 满则翻倍扩容（拷贝 O(n）） + 均摊 O(1) 读数 -->
<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import type { SiteLocale } from '@/i18n/catalog';
import { useGrow } from './useGrow';

const props = withDefaults(defineProps<{ locale?: SiteLocale }>(), { locale: 'zh-CN' });
const english = props.locale === 'en';
const g = useGrow();
const status = ref(
  english
    ? 'What happens when capacity is full? Keep pressing append.'
    : '容量满了会怎样？一直点「追加」看看。',
);
const copying = ref(false); // 扩容那一下：旧元素拷贝高亮
let timer: ReturnType<typeof setTimeout> | undefined;

const onAppend = () => {
  const r = g.append(); // 同步改 items/capacity/计数
  if (r.grew) {
    status.value = english
      ? `Capacity was full. Allocate a 2x array with capacity ${r.capacity}, copy ${r.copies} item(s) in O(n), then append ${r.value}. This expensive step is rare.`
      : `容量满了！触发扩容——开一个 2 倍的新数组（容量 ${r.capacity}），把 ${r.copies} 个元素逐个拷过去（O(n)），再放入 ${r.value}。这次贵，但很少发生。`;
    copying.value = true;
    clearTimeout(timer);
    timer = setTimeout(() => (copying.value = false), 700);
  } else {
    status.value = english
      ? `Free capacity remains: append ${r.value} directly in O(1).`
      : `还有空位：直接把 ${r.value} 放到末尾，O(1)。`;
  }
};
const onReset = () => {
  clearTimeout(timer);
  copying.value = false;
  g.reset();
  status.value = english
    ? 'Reset complete. Keep appending to trigger capacity doubling.'
    : '已重置 · 一直点「追加」，看容量满了怎么翻倍。';
};
onUnmounted(() => clearTimeout(timer));
</script>

<template>
  <div class="array-grow-viz column center">
    <div class="toolbar row-wrap">
      <button class="btn" @click="onAppend">{{ english ? 'Append' : '追加 append' }}</button>
      <button class="btn" @click="onReset">{{ english ? 'Reset' : '重置' }}</button>
    </div>
    <div class="lane-wrap">
      <!-- 格阵：容量个格子，前 length 个已用、其余预留；随容量翻倍横向扩展 -->
      <div class="lane">
        <div
          v-for="i in g.capacity.value"
          :key="i - 1"
          class="gcell"
          :class="{ filled: i - 1 < g.length.value, copying: copying && i - 1 < g.length.value }"
        >
          {{ i - 1 < g.length.value ? g.items.value[i - 1][1] : '' }}
        </div>
      </div>
    </div>
    <p class="readout">
      {{ english ? 'Length' : '长度' }} <b>{{ g.length.value }}</b> /
      {{ english ? 'capacity' : '容量' }}
      <b :class="{ full: g.length.value === g.capacity.value }">{{ g.capacity.value }}</b>
    </p>
    <p class="stats">
      append <b>{{ g.appends.value }}</b> {{ english ? 'times' : '次' }} ·
      {{ english ? 'total copies' : '总拷贝' }} <b>{{ g.totalCopies.value }}</b> ·
      {{ english ? 'amortized' : '均摊' }}
      <b class="amort">{{ g.amortized.value.toFixed(1) }}</b>
      {{ english ? 'operations/append (about O(1))' : '次/append（≈ O(1)）' }}
    </p>
    <p class="status">{{ status }}</p>
  </div>
</template>

<style scoped lang="less">
.array-grow-viz {
  width: 100%;
  gap: 12px;
}
.toolbar {
  gap: 10px;
  justify-content: center;
}
.btn {
  border: none;
  font-size: 15px;
  font-weight: bold;
  color: @font-color;
  padding: 9px 18px;
  .neumorphism-btn(4px, 12px);
}
.lane-wrap {
  display: flex;
  justify-content: center;
  width: 100%;
  overflow-x: auto;
}
.lane {
  display: flex;
  flex-direction: row;
  gap: 6px;
  padding: 14px 14px;
  .neumorphism-pressed(4px, 14px);
}
.gcell {
  flex: none;
  width: 42px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  border-radius: 8px;
  color: #b9b9b9;
  // 预留格：虚框、空
  border: 2px dashed #c4c4c4;
  background: transparent;
  transition:
    background-color 0.3s,
    color 0.3s,
    border-color 0.3s;
}
.gcell.filled {
  // 已用格：浅绿、实心
  color: #1f5e3a;
  background: #8bd3a0;
  border: 2px solid transparent;
  box-shadow:
    2px 2px 5px @neumorphis-dark-shadow,
    -2px -2px 5px @neumorphis-light-shadow;
}
.gcell.copying {
  // 扩容拷贝：黄高亮
  background: #ffcf5c;
  color: #6b4e00;
}
.readout {
  font-size: 15px;
  font-weight: bold;
  color: #555;

  b {
    color: @font-highlight-color;
    font-size: 17px;
  }
  b.full {
    color: #ff8a65;
  }
}
.stats {
  font-size: 13px;
  color: #777;

  b {
    color: #555;
  }
  b.amort {
    color: @font-highlight-color;
    font-size: 15px;
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
