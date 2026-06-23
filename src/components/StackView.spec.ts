// src/components/StackView.spec.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import StackView from './StackView.vue';
import type { StackTrack } from '@/components/player/types';

const mountIt = (stack: StackTrack) => mount(StackView, { props: { stack } });

describe('StackView', () => {
  it('TC-VIZ-STACKVIEW-01 渲染与 frames 等量的栈帧', () => {
    const w = mountIt({
      frames: [
        { lo: 0, hi: 9 },
        { lo: 1, hi: 5 },
      ],
    });
    expect(w.findAll('.frame')).toHaveLength(2);
  });

  it('TC-VIZ-STACKVIEW-02 栈顶（frames 末元素）渲染在最上面、内容为 [lo, hi]', () => {
    const w = mountIt({
      frames: [
        { lo: 0, hi: 9 },
        { lo: 1, hi: 5 },
      ],
    });
    const frames = w.findAll('.frame');
    expect(frames[0].text()).toBe('a[1..5]'); // 逆序后第一个 = 栈顶
    expect(frames[1].text()).toBe('a[0..9]'); // 栈底
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

  it('TC-VIZ-STACKVIEW-04 栈帧固定等宽居中：不再按区间下标 inline 定位（无 left/width）', () => {
    const w = mountIt({
      frames: [
        { lo: 0, hi: 9 },
        { lo: 1, hi: 5 },
      ],
    });
    for (const f of w.findAll('.frame')) {
      const s = f.attributes('style') || '';
      expect(s).not.toContain('width'); // 宽度由 CSS 固定，非按区间长度的可变 inline 宽
      expect(s).not.toContain('left'); // 居中堆叠，非缩进定位
    }
  });

  it('TC-VIZ-STACKVIEW-05 空栈渲染占位、无栈帧', () => {
    const w = mountIt({ frames: [] });
    expect(w.findAll('.frame')).toHaveLength(0);
    expect(w.find('.stack-empty').exists()).toBe(true);
  });

  it('TC-VIZ-STACKVIEW-06 稳定 key 渲染：push（setProps 增帧）后旧帧保留、新帧追加（支撑入栈动画）', async () => {
    const w = mountIt({ frames: [{ lo: 0, hi: 9 }] });
    expect(w.findAll('.frame')).toHaveLength(1);
    await w.setProps({
      stack: {
        frames: [
          { lo: 0, hi: 9 },
          { lo: 1, hi: 5 },
        ],
      },
    });
    const frames = w.findAll('.frame');
    expect(frames).toHaveLength(2);
    expect(frames[0].text()).toBe('a[1..5]'); // 新栈顶在上
    expect(frames[1].text()).toBe('a[0..9]'); // 原帧仍在
  });
});
