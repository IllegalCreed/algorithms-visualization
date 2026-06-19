<!-- src/components/player/TransportControls.vue -->
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  isPlaying: boolean;
  atStart: boolean;
  atEnd: boolean;
  index: number;
  total: number;
  speed: number;
}>();

const emit = defineEmits<{
  play: [];
  pause: [];
  stepBack: [];
  stepForward: [];
  reset: [];
  seek: [value: number];
  setSpeed: [value: number];
}>();

const SPEEDS = [0.5, 1, 2];

// 进度填充百分比（驱动滑块轨道的已播放着色）
const fillPercent = computed(() => (props.total > 1 ? (props.index / (props.total - 1)) * 100 : 0));

function onSeek(e: Event) {
  emit('seek', Number((e.target as HTMLInputElement).value));
}
function onSpeed(e: Event) {
  emit('setSpeed', Number((e.target as HTMLSelectElement).value));
}
</script>
<template>
  <div class="transport row center">
    <button class="ctl" title="重置" @click="emit('reset')">↺</button>
    <button class="ctl" title="上一步" :disabled="atStart" @click="emit('stepBack')">⏮</button>
    <button class="ctl play" @click="isPlaying ? emit('pause') : emit('play')">
      {{ isPlaying ? '⏸' : '▶' }}
    </button>
    <button class="ctl" title="下一步" :disabled="atEnd" @click="emit('stepForward')">⏭</button>
    <select class="speed" :value="speed" @change="onSpeed">
      <option v-for="s in SPEEDS" :key="s" :value="s">{{ s }}×</option>
    </select>
    <input
      class="scrub"
      type="range"
      min="0"
      :max="Math.max(0, total - 1)"
      :value="index"
      :style="{ '--fill': fillPercent + '%' }"
      @input="onSeek"
    />
    <span class="counter">{{ index + 1 }} / {{ total }}</span>
  </div>
</template>
<style scoped lang="less">
.transport {
  gap: 10px;
  padding: 10px 16px;
  border-radius: 12px;
  .neumorphism-flat(4px, 12px);
}
.ctl {
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 15px;
  .neumorphism-btn(3px, 50%);
}
.ctl:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ---------- 速度选择：凸起圆角小控件 + 自定义柔和下拉箭头 ---------- */
.speed {
  appearance: none;
  -webkit-appearance: none;
  height: 32px;
  padding: 0 28px 0 12px;
  border: none;
  outline: none;
  border-radius: 9px;
  font-size: 13px;
  color: @font-color;
  background-color: @neumorphis-background;
  background-image: ~"url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 viewBox=%220 0 12 8%22%3E%3Cpath d=%22M1 1.5 L6 6.5 L11 1.5%22 fill=%22none%22 stroke=%22%23999%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/%3E%3C/svg%3E')";
  background-repeat: no-repeat;
  background-position: right 10px center;
  box-shadow:
    3px 3px 6px darken(@neumorphis-background, 15%),
    -3px -3px 6px lighten(@neumorphis-background, 15%);
  cursor: pointer;
}
.speed:active,
.speed:focus-visible {
  box-shadow:
    inset 2px 2px 4px darken(@neumorphis-background, 15%),
    inset -2px -2px 4px lighten(@neumorphis-background, 15%);
}

/* ---------- 进度条：凹槽轨道 + 已播放柔绿填充 + 凸起圆珠滑块 ---------- */
.scrub {
  flex: 1;
  min-width: 120px;
  height: 18px;
  appearance: none;
  -webkit-appearance: none;
  background: transparent;
  cursor: pointer;
}
// 轨道（WebKit）：凹槽 + 左侧已播放柔绿填充
.scrub::-webkit-slider-runnable-track {
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(
    to right,
    fade(@font-highlight-color, 70%) 0 var(--fill, 0%),
    @neumorphis-background var(--fill, 0%) 100%
  );
  box-shadow:
    inset 2px 2px 4px darken(@neumorphis-background, 15%),
    inset -2px -2px 4px lighten(@neumorphis-background, 15%);
}
// 滑块圆珠（WebKit）：凸起
.scrub::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  margin-top: -4px;
  border-radius: 50%;
  background: linear-gradient(
    145deg,
    lighten(@neumorphis-background, 7%),
    darken(@neumorphis-background, 10%)
  );
  box-shadow:
    2px 2px 4px darken(@neumorphis-background, 15%),
    -2px -2px 4px lighten(@neumorphis-background, 15%);
  cursor: pointer;
}
// Firefox
.scrub::-moz-range-track {
  height: 8px;
  border-radius: 4px;
  background: @neumorphis-background;
  box-shadow:
    inset 2px 2px 4px darken(@neumorphis-background, 15%),
    inset -2px -2px 4px lighten(@neumorphis-background, 15%);
}
.scrub::-moz-range-progress {
  height: 8px;
  border-radius: 4px;
  background: fade(@font-highlight-color, 70%);
}
.scrub::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(
    145deg,
    lighten(@neumorphis-background, 7%),
    darken(@neumorphis-background, 10%)
  );
  box-shadow:
    2px 2px 4px darken(@neumorphis-background, 15%),
    -2px -2px 4px lighten(@neumorphis-background, 15%);
  cursor: pointer;
}
.counter {
  font-family: Consolas, Monaco, monospace;
  font-size: 13px;
  min-width: 60px;
  text-align: right;
}
</style>
