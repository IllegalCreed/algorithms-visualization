<!-- LRU 缓存互动组件：横向按最近使用排序（左 MRU / 右 LRU）+ get/put + 满了淘汰最久没用 -->
<script setup lang="ts">
import { ref } from 'vue';
import type { SiteLocale } from '@/i18n/catalog';
import { useLRU, LRU_CAP } from './useLRU';

const props = withDefaults(defineProps<{ locale?: SiteLocale }>(), { locale: 'zh-CN' });
const english = props.locale === 'en';
const lru = useLRU();
const keyVal = ref(1);
const valVal = ref(100);
const status = ref(
  english
    ? 'Entries run from most recently used on the left to least recently used on the right.'
    : '缓存按「最近使用」排：左=最近用，右=最久没用。get/put 试试。',
);

const onGet = () => {
  const r = lru.get(keyVal.value);
  status.value = english
    ? r.type === 'hit'
      ? `get(${keyVal.value}) hits value ${r.value} and moves the key to the most-recent end.`
      : `get(${keyVal.value}) misses because the key is not cached.`
    : r.type === 'hit'
      ? `get(${keyVal.value})：找到了，值 ${r.value}，移到最前（最近用）。`
      : `get(${keyVal.value})：缓存里没有 ${keyVal.value}，未命中。`;
};
const onPut = () => {
  const r = lru.put(keyVal.value, valVal.value);
  if (r.type === 'put-update') {
    status.value = english
      ? `put(${keyVal.value}, ${valVal.value}) updates the existing key and marks it most recent.`
      : `put(${keyVal.value},${valVal.value})：${keyVal.value} 已在，更新为 ${valVal.value} 并移到最前。`;
  } else if (r.evicted !== null) {
    status.value = english
      ? `put(${keyVal.value}, ${valVal.value}) evicts least-recent key ${r.evicted} and inserts the new key.`
      : `put(${keyVal.value},${valVal.value})：缓存满了，淘汰最久没用的 ${r.evicted}，新键放最前。`;
  } else {
    status.value = english
      ? `put(${keyVal.value}, ${valVal.value}) inserts the key at the most-recent end.`
      : `put(${keyVal.value},${valVal.value})：新键放到最前（最近用）。`;
  }
};
const onReset = () => {
  lru.reset();
  status.value = english
    ? 'Reset complete. The rightmost entry is least recent and will be evicted next.'
    : '已重置 · 缓存按最近使用排，右端最久没用、下一个被淘汰。';
};
</script>

<template>
  <div class="lru-viz column center">
    <div class="toolbar row-wrap">
      <input class="val-input" v-model.number="keyVal" type="number" min="1" max="99" />
      <input class="val-input" v-model.number="valVal" type="number" min="1" max="999" />
      <button class="btn" @click="onGet">get</button>
      <button class="btn" @click="onPut">put</button>
      <button class="btn" @click="onReset">{{ english ? 'Reset' : '重置' }}</button>
    </div>
    <div class="lane-wrap">
      <!-- 车道：左 MRU、右 LRU（下一个被淘汰）；定宽（空/满一致） -->
      <div class="lane">
        <span v-if="!lru.entries.value.length" class="empty-hint">
          {{ english ? 'Cache is empty' : '缓存为空' }}
        </span>
        <TransitionGroup name="lru" tag="div" class="lane-inner">
          <div
            v-for="(e, i) in lru.entries.value"
            :key="e[0]"
            class="lru-cell"
            :class="{ 'is-mru': i === 0, 'is-lru': i === lru.entries.value.length - 1 }"
          >
            <div class="lru-key">{{ e[1] }}</div>
            <div class="lru-val">val {{ e[2] }}</div>
            <!-- 端标记挂元素、跟着走 -->
            <div class="markers">
              <div class="m m-mru">↑ {{ english ? 'most recent' : '最近用' }}</div>
              <div class="m m-lru">↑ {{ english ? 'least recent' : '最久没用' }}</div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>
    <p class="readout">
      {{ english ? 'Capacity' : '容量' }}
      <b :class="{ full: lru.size.value === lru.capacity }">{{ lru.size.value }}/{{ LRU_CAP }}</b>
    </p>
    <p class="status">{{ status }}</p>
  </div>
</template>

<style scoped lang="less">
.lru-viz {
  width: 100%;
  gap: 18px;
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
  padding: 9px 16px;
  .neumorphism-btn(4px, 12px);
}
.lane-wrap {
  display: flex;
  justify-content: center;
  min-height: 150px;
}
.lane {
  position: relative;
  width: 472px;
  min-height: 96px;
  padding: 12px;
  .neumorphism-pressed(4px, 12px);
}
.empty-hint {
  position: absolute;
  inset: 0;
  margin: auto;
  width: fit-content;
  height: fit-content;
  color: #aaa;
  font-size: 14px;
}
.lane-inner {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 72px;
}
.lru-cell {
  position: relative;
  flex: none;
  width: 66px;
  height: 60px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: #1f5e3a;
  background: #8bd3a0;
  box-shadow:
    3px 3px 6px @neumorphis-dark-shadow,
    -3px -3px 6px @neumorphis-light-shadow;
  transition: background-color 0.3s;
}
.lru-key {
  font-weight: bold;
  font-size: 20px;
}
.lru-val {
  font-size: 11px;
  color: #3a7a55;
}
.lru-cell.is-mru {
  background: #4caf50;
  color: #ffffff;
}
.lru-cell.is-mru .lru-val {
  color: #e8f5e9;
}
.markers {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  padding-top: 6px;
  text-align: center;
}
.m {
  display: none;
  font-size: 12px;
  font-weight: bold;
  white-space: nowrap;
  line-height: 1.5;
}
.m-mru {
  color: #4caf50;
}
.m-lru {
  color: #ff8a65;
}
.lru-cell.is-mru .m-mru {
  display: block;
}
.lru-cell.is-lru .m-lru {
  display: block;
}
// 进入从上落下 / 离开（被淘汰）向上淡出 / 其余 FLIP 重排
.lru-enter-active,
.lru-leave-active {
  transition: all 0.34s cubic-bezier(0.3, 1.2, 0.6, 1);
}
.lru-enter-from {
  opacity: 0;
  transform: translateY(-26px) scale(0.7);
}
.lru-leave-to {
  opacity: 0;
  transform: translateY(-26px) scale(0.6);
}
.lru-leave-active {
  position: absolute;
}
.lru-move {
  transition: transform 0.34s cubic-bezier(0.3, 1.2, 0.6, 1);
}
.readout {
  font-size: 15px;
  font-weight: bold;
  color: #555;

  b {
    color: @font-highlight-color;
    font-size: 18px;
  }
  b.full {
    color: #ff8a65;
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
