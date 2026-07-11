<!-- 双端队列互动组件：横向车道 + 头/尾双标记 + 四向进出（pushFront/pushBack/popFront/popBack） -->
<script setup lang="ts">
import { ref } from 'vue';
import type { SiteLocale } from '@/i18n/catalog';
import { useDeque } from './useDeque';

const props = withDefaults(defineProps<{ locale?: SiteLocale }>(), { locale: 'zh-CN' });
const english = props.locale === 'en';
const d = useDeque();
const status = ref(
  english
    ? 'A deque accepts insertions and removals at both ends. Try all four operations.'
    : '双端队列：头、尾两端都能进出。点四个方向试试。',
);

const onPushFront = () => {
  const v = d.pushFront();
  if (v !== null)
    status.value = english ? `push front: add ${v} at the front.` : `头部入：${v} 加到队头`;
};
const onPushBack = () => {
  const v = d.pushBack();
  if (v !== null)
    status.value = english ? `push back: add ${v} at the back.` : `尾部入：${v} 加到队尾`;
};
const onPopFront = () => {
  const v = d.popFront();
  if (v !== null)
    status.value = english ? `pop front: remove ${v} from the front.` : `头部出：队头 ${v} 离开`;
};
const onPopBack = () => {
  const v = d.popBack();
  if (v !== null)
    status.value = english ? `pop back: remove ${v} from the back.` : `尾部出：队尾 ${v} 离开`;
};
const onReset = () => {
  d.reset();
  status.value = english
    ? 'Reset complete. Both ends accept insertions and removals.'
    : '已重置 · 头、尾两端都能进出。点四个方向试试。';
};
</script>

<template>
  <div class="deque-viz column center">
    <div class="toolbar row-wrap">
      <button class="btn" :disabled="d.isFull.value" @click="onPushFront">
        {{ english ? 'Push front' : '头部入' }}
      </button>
      <button class="btn" :disabled="d.isFull.value" @click="onPushBack">
        {{ english ? 'Push back' : '尾部入' }}
      </button>
      <button class="btn" :disabled="d.isEmpty.value" @click="onPopFront">
        {{ english ? 'Pop front' : '头部出' }}
      </button>
      <button class="btn" :disabled="d.isEmpty.value" @click="onPopBack">
        {{ english ? 'Pop back' : '尾部出' }}
      </button>
      <button class="btn" @click="onReset">{{ english ? 'Reset' : '重置' }}</button>
    </div>
    <div class="lane-wrap">
      <!-- 车道：队头在左、队尾在右；定宽（空/满一致） -->
      <div class="lane">
        <span v-if="!d.items.value.length" class="empty-hint">
          {{ english ? 'Deque is empty' : '双端队列为空' }}
        </span>
        <TransitionGroup name="deque" tag="div" class="lane-inner">
          <div
            v-for="(it, i) in d.items.value"
            :key="it[0]"
            class="dqitem"
            :class="{ 'is-front': i === 0, 'is-back': i === d.items.value.length - 1 }"
          >
            <div class="plate">{{ it[1] }}</div>
            <!-- 头/尾标记挂元素、跟着元素走 -->
            <div class="markers">
              <div class="dm dm-front">↑ {{ english ? 'front' : '队头' }}</div>
              <div class="dm dm-back">↑ {{ english ? 'back' : '队尾' }}</div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>
    <p class="status">{{ status }}</p>
  </div>
</template>

<style scoped lang="less">
.deque-viz {
  width: 100%;
  gap: 18px;
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
  min-height: 132px;
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
  gap: 10px;
  min-height: 72px;
}
.dqitem {
  position: relative;
  flex: none;
}
.plate {
  width: 58px;
  height: 56px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
  color: #1f5e3a;
  background: #8bd3a0;
  box-shadow:
    3px 3px 6px @neumorphis-dark-shadow,
    -3px -3px 6px @neumorphis-light-shadow;
  transition:
    background-color 0.3s,
    color 0.3s;
}
.dqitem.is-front .plate {
  background: #4caf50;
  color: #ffffff;
}
.markers {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  padding-top: 6px;
  text-align: center;
}
.dm {
  display: none;
  font-size: 12px;
  font-weight: bold;
  white-space: nowrap;
  line-height: 1.5;
}
.dm-front {
  color: #4caf50;
}
.dm-back {
  color: @font-highlight-color;
}
.dqitem.is-front .dm-front {
  display: block;
}
.dqitem.is-back .dm-back {
  display: block;
}
// 中性纵向进出（两端皆宜）：落入从上、离开向上；其余 FLIP 水平补位
.deque-enter-active,
.deque-leave-active {
  transition: all 0.32s cubic-bezier(0.3, 1.3, 0.6, 1);
}
.deque-enter-from {
  opacity: 0;
  transform: translateY(-24px) scale(0.7);
}
.deque-leave-to {
  opacity: 0;
  transform: translateY(-24px) scale(0.7);
}
.deque-leave-active {
  position: absolute;
}
.deque-move {
  transition: transform 0.32s cubic-bezier(0.3, 1.3, 0.6, 1);
}
.status {
  font-weight: bold;
  font-size: 15px;
  min-height: 22px;
  color: #555555;
}
</style>
