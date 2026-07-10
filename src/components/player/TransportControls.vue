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
  loop?: boolean; // C-111：循环开关（可选——旧用法零破坏）
}>();

const emit = defineEmits<{
  play: [];
  pause: [];
  stepBack: [];
  stepForward: [];
  reset: [];
  seek: [value: number];
  setSpeed: [value: number];
  toggleLoop: [];
}>();

const SPEEDS = [0.5, 1, 2, 3];

// 进度填充百分比（驱动滑块轨道的已播放着色）
const fillPercent = computed(() => (props.total > 1 ? (props.index / (props.total - 1)) * 100 : 0));
const progressLabel = computed(() => `${props.index + 1} / ${props.total}`);

function onSeek(e: Event) {
  emit('seek', Number((e.target as HTMLInputElement).value));
}
function onSpeed(e: Event) {
  emit('setSpeed', Number((e.target as HTMLSelectElement).value));
}
</script>
<template>
  <div class="transport row center">
    <button type="button" class="ctl" title="重置" aria-label="重置" @click="emit('reset')">
      <svg
        class="icon"
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </svg>
    </button>
    <button
      type="button"
      class="ctl"
      title="上一步"
      aria-label="上一步"
      :disabled="atStart"
      @click="emit('stepBack')"
    >
      <svg
        class="icon"
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <rect x="5.5" y="5" width="2.6" height="14" rx="1.3" />
        <polygon points="19 5 10 12 19 19" />
      </svg>
    </button>
    <button
      type="button"
      class="ctl play"
      :aria-label="isPlaying ? '暂停' : '播放'"
      @click="isPlaying ? emit('pause') : emit('play')"
    >
      <svg
        v-if="isPlaying"
        class="icon"
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <rect x="6.5" y="4.5" width="3.6" height="15" rx="1.4" />
        <rect x="13.9" y="4.5" width="3.6" height="15" rx="1.4" />
      </svg>
      <svg
        v-else
        class="icon"
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <polygon points="8 5 19 12 8 19" />
      </svg>
    </button>
    <button
      type="button"
      class="ctl"
      title="下一步"
      aria-label="下一步"
      :disabled="atEnd"
      @click="emit('stepForward')"
    >
      <svg
        class="icon"
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <polygon points="5 5 14 12 5 19" />
        <rect x="16.4" y="5" width="2.6" height="14" rx="1.3" />
      </svg>
    </button>
    <select class="speed" aria-label="播放速度" :value="speed" @change="onSpeed">
      <option v-for="s in SPEEDS" :key="s" :value="s">{{ s }}×</option>
    </select>
    <button
      type="button"
      class="ctl ctl-loop"
      :class="{ 'ctl-active': props.loop }"
      :title="props.loop ? '关闭循环' : '播完循环'"
      :aria-label="props.loop ? '关闭循环播放' : '开启循环播放'"
      :aria-pressed="props.loop ? 'true' : 'false'"
      @click="emit('toggleLoop')"
    >
      <svg
        class="icon"
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M17 2l4 4-4 4" />
        <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
        <path d="M7 22l-4-4 4-4" />
        <path d="M21 13v1a4 4 0 0 1-4 4H3" />
      </svg>
    </button>
    <input
      class="scrub"
      type="range"
      min="0"
      :max="Math.max(0, total - 1)"
      :value="index"
      aria-label="播放进度"
      :aria-valuetext="progressLabel"
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
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: @font-color;
  .neumorphism-btn(3px, 50%);
}
.ctl .icon {
  display: block;
  width: 18px;
  height: 18px;
}
.ctl:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.ctl:focus-visible {
  outline: 2px solid #8bd3a0;
  outline-offset: 3px;
}
/* 循环开关激活态：绿色高亮（C-111） */
.ctl-loop.ctl-active {
  color: #1f5e3a;
  .neumorphism-pressed(3px, 50%);
}

/* ---------- 速度选择：凸起圆角小控件 + 自定义柔和下拉箭头 ---------- */
.speed {
  appearance: none;
  -webkit-appearance: none;
  height: 32px;
  padding: 0 28px 0 12px;
  border: none;
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
  outline: 2px solid #8bd3a0;
  outline-offset: 2px;
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
.scrub:focus-visible {
  outline: 2px solid #8bd3a0;
  outline-offset: 3px;
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
