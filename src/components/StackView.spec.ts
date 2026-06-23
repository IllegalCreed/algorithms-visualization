// src/components/StackView.spec.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import StackView from './StackView.vue';
import type { StackTrack } from '@/components/player/types';

const mountIt = (stack: StackTrack, length = 10, slotWidth = 60) =>
  mount(StackView, { props: { stack, length, slotWidth } });

describe('StackView', () => {
  it('TC-VIZ-STACKVIEW-01 渲染与 frames 等量的区间条', () => {
    const w = mountIt({
      frames: [
        { lo: 0, hi: 9 },
        { lo: 1, hi: 5 },
      ],
    });
    expect(w.findAll('.frame')).toHaveLength(2);
  });

  it('TC-VIZ-STACKVIEW-02 区间条 left/width 对齐主轨下标坐标系', () => {
    const w = mountIt({
      frames: [
        { lo: 0, hi: 9 },
        { lo: 1, hi: 5 },
      ],
    });
    const frames = w.findAll('.frame');
    // 逆序渲染：第一个 DOM 节点 = 栈顶 [1,5]
    const top = frames[0].attributes('style') || '';
    expect(top).toContain('left: 60px'); // 1 * 60
    expect(top).toContain('width: 300px'); // (5 - 1 + 1) * 60
    const bottom = frames[1].attributes('style') || '';
    expect(bottom).toContain('left: 0px'); // 0 * 60
    expect(bottom).toContain('width: 600px'); // (9 - 0 + 1) * 60
  });

  it('TC-VIZ-STACKVIEW-03 栈顶帧高亮（.top）', () => {
    const w = mountIt({
      frames: [
        { lo: 0, hi: 9 },
        { lo: 1, hi: 5 },
      ],
    });
    const frames = w.findAll('.frame');
    expect(frames[0].classes()).toContain('top'); // 逆序后第一个 = 栈顶
    expect(frames[1].classes()).not.toContain('top');
  });

  it('TC-VIZ-STACKVIEW-04 popped 区间单独标记（.popped）', () => {
    const w = mountIt({ frames: [{ lo: 0, hi: 9 }], popped: { lo: 7, hi: 9 } });
    expect(w.find('.popped').exists()).toBe(true);
  });

  it('TC-VIZ-STACKVIEW-05 空栈渲染占位、无区间条', () => {
    const w = mountIt({ frames: [] });
    expect(w.findAll('.frame')).toHaveLength(0);
    expect(w.find('.stack-empty').exists()).toBe(true);
  });
});
