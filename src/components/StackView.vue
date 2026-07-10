<!-- src/components/StackView.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import type { StackTrack } from '@/components/player/types';
import type { SiteLocale } from '@/i18n/pilot';

const props = withDefaults(defineProps<{ stack: StackTrack; locale?: SiteLocale }>(), {
  locale: 'zh-CN',
});

// 逆序：栈顶（frames 末元素）排在最上面、最显眼
const orderedFrames = computed(() => props.stack.frames.slice().reverse());
</script>
<template>
  <div class="stack-view column center">
    <div class="stack-label">
      {{
        props.locale === 'en'
          ? 'Interval stack: each frame is a pending subarray a[lo..hi]'
          : '区间栈 · 每格 = 一段待排序子数组 a[lo..hi]（栈顶先弹出分区）'
      }}
    </div>
    <TransitionGroup name="stack" tag="div" class="stack-frames column center">
      <div
        v-for="(f, idx) in orderedFrames"
        :key="`${f.lo}-${f.hi}`"
        class="frame center"
        :class="{ top: idx === 0 }"
      >
        a[{{ f.lo }}..{{ f.hi }}]
      </div>
      <div v-if="orderedFrames.length === 0" key="__empty__" class="stack-empty center">
        {{ props.locale === 'en' ? 'Stack empty: every position is final' : '栈空 → 全部就位' }}
      </div>
    </TransitionGroup>
  </div>
</template>
<style scoped lang="less">
.stack-view {
  gap: 10px;
  width: 100%;
}
.stack-label {
  font-size: 12px;
  color: fade(@font-color, 55%);
}
.stack-frames {
  position: relative;
  gap: 8px;
  min-height: 38px;
  width: 100%;
}
.frame {
  width: 160px; // 固定等宽
  height: 30px;
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 13px;
  font-weight: bold;
  color: @font-color;
  background-color: fade(@font-color, 8%);
  border: 1px solid fade(@font-color, 18%);
}
.frame.top {
  background-color: fade(#5c6bc0, 28%);
  border-color: #5c6bc0;
}
/* 入栈：从上方滑入；出栈：向右滑出 + 淡出；其余帧 FLIP 平滑移动 */
.stack-enter-active,
.stack-leave-active {
  transition: all 0.35s ease;
}
.stack-enter-from {
  opacity: 0;
  transform: translateY(-26px) scale(0.9);
}
.stack-leave-to {
  opacity: 0;
  transform: translateX(64px) scale(0.9);
}
.stack-leave-active {
  position: absolute; // 出栈帧脱离文档流，其余帧平滑上移
}
.stack-move {
  transition: transform 0.35s ease;
}
.stack-empty {
  height: 30px;
  font-size: 12px;
  color: fade(@font-color, 45%);
}
</style>
