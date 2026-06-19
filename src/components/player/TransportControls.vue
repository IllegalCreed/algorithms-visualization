<!-- src/components/player/TransportControls.vue -->
<script setup lang="ts">
defineProps<{
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
.scrub {
  flex: 1;
  min-width: 120px;
}
.counter {
  font-family: Consolas, Monaco, monospace;
  font-size: 13px;
  min-width: 60px;
  text-align: right;
}
</style>
