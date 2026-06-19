// src/components/player/usePlayer.ts
import { ref, computed, onUnmounted, getCurrentInstance } from 'vue';
import type { Step } from './types';

export interface UsePlayerOptions {
  baseDelayMs?: number; // 1× 时每步间隔，默认 800
  initialSpeed?: number; // 默认 1
}

export function usePlayer(steps: Step[], opts: UsePlayerOptions = {}) {
  const baseDelayMs = opts.baseDelayMs ?? 800;
  const index = ref(0);
  const isPlaying = ref(false);
  const speed = ref(opts.initialSpeed ?? 1);
  let timer: ReturnType<typeof setTimeout> | null = null;

  const total = computed(() => steps.length);
  const current = computed(() => steps[index.value]);
  const atStart = computed(() => index.value <= 0);
  const atEnd = computed(() => index.value >= steps.length - 1);
  const progress = computed(() => (steps.length <= 1 ? 1 : index.value / (steps.length - 1)));

  function clearTimer() {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function scheduleNext() {
    clearTimer();
    timer = setTimeout(() => {
      if (index.value >= steps.length - 1) {
        isPlaying.value = false;
        return;
      }
      index.value++;
      if (index.value >= steps.length - 1) {
        isPlaying.value = false; // 展示完末步即停
        return;
      }
      scheduleNext();
    }, baseDelayMs / speed.value);
  }

  function play() {
    if (atEnd.value) return;
    isPlaying.value = true;
    scheduleNext();
  }
  function pause() {
    isPlaying.value = false;
    clearTimer();
  }
  function toggle() {
    if (isPlaying.value) {
      pause();
    } else {
      play();
    }
  }
  function stepForward() {
    pause();
    if (index.value < steps.length - 1) index.value++;
  }
  function stepBackward() {
    pause();
    if (index.value > 0) index.value--;
  }
  function seek(i: number) {
    pause();
    index.value = Math.max(0, Math.min(i, steps.length - 1));
  }
  function reset() {
    pause();
    index.value = 0;
  }
  function setSpeed(s: number) {
    speed.value = s;
    if (isPlaying.value) scheduleNext();
  }

  if (getCurrentInstance()) onUnmounted(pause); // 组件内自动清理；纯 L3 调用时跳过

  return {
    index,
    isPlaying,
    speed,
    total,
    current,
    atStart,
    atEnd,
    progress,
    play,
    pause,
    toggle,
    stepForward,
    stepBackward,
    seek,
    reset,
    setSpeed,
  };
}
