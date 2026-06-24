<!-- 队列互动组件：读者驱动的 enqueue/dequeue/peek/重置（横向车道 + 队首/队尾双指针） -->
<script setup lang="ts">
import { ref } from 'vue';
import { useQueue } from './useQueue';

const q = useQueue();
const status = ref('点 enqueue 从队尾加入一个元素试试');

const onEnqueue = () => {
  const v = q.enqueue();
  if (v !== null) status.value = `enqueue：${v} 从队尾入队`;
};
const onDequeue = () => {
  const v = q.dequeue();
  if (v !== null) status.value = `dequeue：队首 ${v} 出队`;
};
const onPeek = () => {
  const v = q.peek();
  if (v !== null) status.value = `peek：队首是 ${v}（只看，不拿走）`;
};
const onReset = () => {
  q.reset();
  status.value = '已重置 · 点 enqueue 从队尾加入一个元素试试';
};
</script>

<template>
  <div class="queue-viz column center">
    <div class="toolbar row-wrap">
      <button class="btn" :disabled="!q.canEnqueue.value" @click="onEnqueue">enqueue 入队</button>
      <button class="btn" :disabled="!q.canDequeue.value" @click="onDequeue">dequeue 出队</button>
      <button class="btn" :disabled="!q.canDequeue.value" @click="onPeek">peek 看队首</button>
      <button class="btn" @click="onReset">重置</button>
    </div>
    <div class="lane-wrap">
      <!-- 车道：队首在左、队尾在右；定宽（空/满一致）、左对齐 -->
      <div class="lane">
        <span v-if="!q.items.value.length" class="empty-hint">队列为空</span>
        <TransitionGroup name="queue" tag="div" class="lane-inner">
          <div
            v-for="(it, i) in q.items.value"
            :key="it[0]"
            class="qitem"
            :class="{ 'is-front': i === 0, 'is-rear': i === q.items.value.length - 1 }"
          >
            <div class="plate">{{ it[1] }}</div>
            <!-- 队首/队尾指针挂在元素上、跟着元素走 -->
            <div class="markers">
              <div class="m m-front">↑ 队首</div>
              <div class="m m-rear">↑ 队尾</div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>
    <p class="status">{{ status }}</p>
  </div>
</template>

<style scoped lang="less">
.queue-viz {
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
  padding: 9px 18px;
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
  justify-content: flex-start;
  gap: 10px;
  min-height: 72px;
}
.qitem {
  position: relative;
  flex: none;
}
.plate {
  width: 60px;
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
.qitem.is-front .plate {
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
.m {
  display: none;
  font-size: 12px;
  font-weight: bold;
  white-space: nowrap;
  line-height: 1.5;
}
.m-front {
  color: #4caf50;
}
.m-rear {
  color: @font-highlight-color;
}
.qitem.is-front .m-front {
  display: block;
}
.qitem.is-rear .m-rear {
  display: block;
}
// 入队从右滑入 / 出队向左滑出 / 其余 FLIP 左移补位（与 List 的 TransitionGroup 范式一致）
.queue-enter-active,
.queue-leave-active {
  transition: all 0.32s cubic-bezier(0.3, 1.3, 0.6, 1);
}
.queue-enter-from {
  opacity: 0;
  transform: translateX(40px) scale(0.7);
}
.queue-leave-to {
  opacity: 0;
  transform: translateX(-40px) scale(0.7);
}
.queue-leave-active {
  position: absolute;
}
.status {
  font-weight: bold;
  font-size: 15px;
  min-height: 22px;
  color: #555555;
}
</style>
