<!-- 栈互动组件：读者驱动的 push/pop/peek/重置 -->
<script setup lang="ts">
import { ref } from 'vue';
import type { SiteLocale } from '@/i18n/catalog';
import { useStack } from './useStack';

const props = withDefaults(defineProps<{ locale?: SiteLocale }>(), { locale: 'zh-CN' });
const english = props.locale === 'en';
const s = useStack();
const status = ref(english ? 'Press push to add an item.' : '点 push 压入一个元素试试');

const onPush = () => {
  const v = s.push();
  if (v !== null) status.value = english ? `push: place ${v} on top.` : `push：把 ${v} 压到栈顶`;
};
const onPop = () => {
  const v = s.pop();
  if (v !== null) status.value = english ? `pop: remove top value ${v}.` : `pop：弹出栈顶 ${v}`;
};
const onPeek = () => {
  const v = s.peek();
  if (v !== null)
    status.value = english
      ? `peek: the top is ${v}; the stack is unchanged.`
      : `peek：栈顶是 ${v}（只看，不取走）`;
};
const onReset = () => {
  s.reset();
  status.value = english
    ? 'Reset complete. Press push to add an item.'
    : '已重置 · 点 push 压入一个元素试试';
};
</script>

<template>
  <div class="stack-viz column center">
    <div class="toolbar row-wrap">
      <button class="btn" :disabled="!s.canPush.value" @click="onPush">
        {{ english ? 'push' : 'push 压入' }}
      </button>
      <button class="btn" :disabled="!s.canPop.value" @click="onPop">
        {{ english ? 'pop' : 'pop 弹出' }}
      </button>
      <button class="btn" :disabled="!s.canPop.value" @click="onPeek">
        {{ english ? 'peek' : 'peek 看栈顶' }}
      </button>
      <button class="btn" @click="onReset">{{ english ? 'Reset' : '重置' }}</button>
    </div>
    <div class="stack-area">
      <!-- 坑：定宽（空/满一致）、底部锚定向上长 -->
      <div class="stack-col">
        <span v-if="!s.items.value.length" class="empty-hint">
          {{ english ? 'Stack is empty' : '栈为空' }}
        </span>
        <TransitionGroup name="stack" tag="div" class="col-inner">
          <div
            v-for="(it, i) in s.items.value"
            :key="it[0]"
            class="item"
            :class="{ 'is-top': i === s.items.value.length - 1 }"
          >
            <div class="plate">{{ it[1] }}</div>
            <!-- 「栈顶」指针挂在栈顶那一行上、漂在坑外，永远跟着真正的栈顶 -->
            <span class="arrow">← {{ english ? 'top' : '栈顶' }}</span>
          </div>
        </TransitionGroup>
      </div>
    </div>
    <p class="status">{{ status }}</p>
  </div>
</template>

<style scoped lang="less">
.stack-viz {
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
.stack-area {
  display: flex;
  justify-content: center;
  min-height: 296px;
}
.stack-col {
  position: relative;
  width: 134px;
  min-height: 280px;
  padding: 12px;
  .neumorphism-pressed(4px, 14px);
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
.col-inner {
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  min-height: 256px;
}
.item {
  position: relative;
}
.plate {
  width: 110px;
  height: 42px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 17px;
  color: #1f5e3a;
  background: #8bd3a0;
  box-shadow:
    3px 3px 6px @neumorphis-dark-shadow,
    -3px -3px 6px @neumorphis-light-shadow;
  transition:
    background-color 0.3s,
    color 0.3s;
}
.item.is-top .plate {
  background: #4caf50;
  color: #ffffff;
}
.arrow {
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 14px;
  font-size: 14px;
  font-weight: bold;
  color: @font-highlight-color;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.25s;
}
.item.is-top .arrow {
  opacity: 1;
}
// 压入 / 弹出进出场（与 List 的 TransitionGroup 范式一致）
.stack-enter-active,
.stack-leave-active {
  transition: all 0.32s cubic-bezier(0.3, 1.3, 0.6, 1);
}
.stack-enter-from,
.stack-leave-to {
  opacity: 0;
  transform: translateY(-34px) scale(0.7);
}
.status {
  font-weight: bold;
  font-size: 15px;
  min-height: 22px;
  color: #555555;
}
</style>
