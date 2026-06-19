// src/components/player/usePlayer.spec.ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Step } from './types';
import { usePlayer } from './usePlayer';

// 造 N 个最简步骤
function steps(n: number): Step[] {
  return Array.from({ length: n }, (_, k) => ({
    array: [],
    pointers: [],
    emphasis: {},
    vars: [{ name: 'k', value: k }],
    point: 'compare' as const,
  }));
}

describe('usePlayer', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('初始停在第 0 步且未播放', () => {
    const p = usePlayer(steps(5));
    expect(p.index.value).toBe(0);
    expect(p.isPlaying.value).toBe(false);
    expect(p.atStart.value).toBe(true);
    expect(p.atEnd.value).toBe(false);
  });

  it('stepForward 前进且不越过末步', () => {
    const p = usePlayer(steps(2));
    p.stepForward();
    expect(p.index.value).toBe(1);
    expect(p.atEnd.value).toBe(true);
    p.stepForward(); // 已在末步，不动
    expect(p.index.value).toBe(1);
  });

  it('stepBackward 后退且不越过首步', () => {
    const p = usePlayer(steps(3));
    p.seek(2);
    p.stepBackward();
    expect(p.index.value).toBe(1);
    p.seek(0);
    p.stepBackward();
    expect(p.index.value).toBe(0);
  });

  it('seek 越界夹紧到合法范围', () => {
    const p = usePlayer(steps(4));
    p.seek(99);
    expect(p.index.value).toBe(3);
    p.seek(-5);
    expect(p.index.value).toBe(0);
  });

  it('reset 回到第 0 步并停止', () => {
    const p = usePlayer(steps(4));
    p.seek(3);
    p.reset();
    expect(p.index.value).toBe(0);
    expect(p.isPlaying.value).toBe(false);
  });

  it('play 按基准间隔逐步推进，到末步自动暂停', () => {
    const p = usePlayer(steps(3), { baseDelayMs: 100 });
    p.play();
    expect(p.isPlaying.value).toBe(true);
    vi.advanceTimersByTime(100);
    expect(p.index.value).toBe(1);
    vi.advanceTimersByTime(100);
    expect(p.index.value).toBe(2);
    expect(p.isPlaying.value).toBe(false); // 到末步自停
    vi.advanceTimersByTime(1000);
    expect(p.index.value).toBe(2); // 不再前进
  });

  it('pause 停止自动推进', () => {
    const p = usePlayer(steps(5), { baseDelayMs: 100 });
    p.play();
    vi.advanceTimersByTime(100);
    p.pause();
    expect(p.isPlaying.value).toBe(false);
    vi.advanceTimersByTime(1000);
    expect(p.index.value).toBe(1);
  });

  it('setSpeed 加速后按新速率推进', () => {
    const p = usePlayer(steps(5), { baseDelayMs: 100 });
    p.setSpeed(2); // 间隔变 50ms
    p.play();
    vi.advanceTimersByTime(50);
    expect(p.index.value).toBe(1);
  });

  it('current 跟随 index', () => {
    const p = usePlayer(steps(3));
    expect(p.current.value.vars[0].value).toBe(0);
    p.stepForward();
    expect(p.current.value.vars[0].value).toBe(1);
  });

  it('progress 从 0 到 1', () => {
    const p = usePlayer(steps(5));
    expect(p.progress.value).toBe(0);
    p.seek(4);
    expect(p.progress.value).toBe(1);
  });
});
