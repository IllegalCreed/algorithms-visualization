<!-- src/components/StackView.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import type { StackTrack } from '@/components/player/types';

const props = withDefaults(
  defineProps<{
    stack: StackTrack;
    length: number; // 主轨长度，决定坐标系总宽
    slotWidth?: number;
  }>(),
  { slotWidth: 60 },
);

const vizWidth = computed(() => props.length * props.slotWidth);

// 逆序渲染：栈顶（frames 末元素）排在最上面、最显眼
const orderedFrames = computed(() =>
  props.stack.frames
    .map((f, idx) => ({ ...f, isTop: idx === props.stack.frames.length - 1 }))
    .reverse(),
);

const frameStyle = (lo: number, hi: number) => ({
  left: lo * props.slotWidth + 'px',
  width: (hi - lo + 1) * props.slotWidth + 'px',
});
</script>
<template>
  <div class="stack-view column center">
    <div class="stack-label">区间栈（待处理子问题，栈顶在上）</div>
    <div class="stack-rows" :style="{ width: vizWidth + 'px' }">
      <div
        v-if="props.stack.popped"
        class="row-line popped"
        :style="frameStyle(props.stack.popped.lo, props.stack.popped.hi)"
      >
        [{{ props.stack.popped.lo }},{{ props.stack.popped.hi }}]
      </div>
      <div
        v-for="(f, idx) in orderedFrames"
        :key="idx"
        class="row-line frame"
        :class="{ top: f.isTop }"
        :style="frameStyle(f.lo, f.hi)"
      >
        [{{ f.lo }},{{ f.hi }}]
      </div>
      <div v-if="props.stack.frames.length === 0 && !props.stack.popped" class="stack-empty">
        栈空 → 全部就位
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
.stack-view {
  gap: 8px;
  width: 100%;
}
.stack-label {
  font-size: 12px;
  color: fade(@font-color, 55%);
}
.stack-rows {
  position: relative;
  min-height: 32px;
}
.row-line {
  position: relative;
  height: 26px;
  line-height: 24px;
  margin-bottom: 6px;
  border-radius: 6px;
  box-sizing: border-box;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  color: @font-color;
  overflow: hidden;
  white-space: nowrap;
  transition:
    left 0.3s ease,
    width 0.3s ease;
}
.row-line.frame {
  background-color: fade(@font-color, 8%);
  border: 1px solid fade(@font-color, 18%);
}
.row-line.frame.top {
  background-color: fade(#5c6bc0, 28%);
  border-color: #5c6bc0;
}
.row-line.popped {
  background-color: transparent;
  border: 1px dashed fade(@font-color, 40%);
  opacity: 0.65;
}
.stack-empty {
  height: 26px;
  line-height: 26px;
  font-size: 12px;
  color: fade(@font-color, 45%);
}
</style>
