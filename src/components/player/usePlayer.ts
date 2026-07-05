// src/components/player/usePlayer.ts
import { ref, computed, onUnmounted, getCurrentInstance, isRef, shallowRef } from 'vue';
import type { Ref } from 'vue';
import type { Step } from './types';

export interface UsePlayerOptions {
  baseDelayMs?: number; // 1× 时每步间隔，默认 800
  initialSpeed?: number; // 默认 1
}

/** steps 兼容静态数组与 Ref（C-110 自定义输入需要运行时重建）；数组签名行为与旧版全等 */
export function usePlayer(stepsIn: Step[] | Ref<Step[]>, opts: UsePlayerOptions = {}) {
  const stepsRef = isRef(stepsIn) ? stepsIn : shallowRef(stepsIn);
  const baseDelayMs = opts.baseDelayMs ?? 800;
  const index = ref(0);
  const isPlaying = ref(false);
  const speed = ref(opts.initialSpeed ?? 1);
  const loop = ref(false); // C-111：播完循环（默认关——旧行为全等）
  let timer: ReturnType<typeof setTimeout> | null = null;

  const total = computed(() => stepsRef.value.length);
  const current = computed(() => stepsRef.value[index.value]);
  const atStart = computed(() => index.value <= 0);
  const atEnd = computed(() => index.value >= stepsRef.value.length - 1);
  const progress = computed(() =>
    stepsRef.value.length <= 1 ? 1 : index.value / (stepsRef.value.length - 1),
  );

  function clearTimer() {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function scheduleNext() {
    clearTimer();
    timer = setTimeout(() => {
      if (index.value >= stepsRef.value.length - 1) {
        if (loop.value) {
          index.value = 0; // 循环：末步展示完回卷续播
          scheduleNext();
          return;
        }
        isPlaying.value = false;
        return;
      }
      index.value++;
      if (index.value >= stepsRef.value.length - 1 && !loop.value) {
        isPlaying.value = false; // 展示完末步即停（循环开则继续调度回卷）
        return;
      }
      scheduleNext();
    }, baseDelayMs / speed.value);
  }

  function play() {
    if (atEnd.value) {
      if (!loop.value) return;
      index.value = 0; // 循环开：末步点播放从头来
    }
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
    if (index.value < stepsRef.value.length - 1) index.value++;
  }
  function stepBackward() {
    pause();
    if (index.value > 0) index.value--;
  }
  function seek(i: number) {
    pause();
    index.value = Math.max(0, Math.min(i, stepsRef.value.length - 1));
  }
  function reset() {
    pause();
    index.value = 0;
  }
  function setSpeed(s: number) {
    speed.value = s;
    if (isPlaying.value) scheduleNext();
  }
  function toggleLoop() {
    loop.value = !loop.value;
  }

  if (getCurrentInstance()) onUnmounted(pause); // 组件内自动清理；纯 L3 调用时跳过

  return {
    index,
    isPlaying,
    speed,
    loop,
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
    toggleLoop,
  };
}
