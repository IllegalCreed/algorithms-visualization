// src/components/player/TransportControls.spec.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TransportControls from './TransportControls.vue';

const base = { isPlaying: false, atStart: false, atEnd: false, index: 3, total: 10, speed: 1 };
const mountIt = (over = {}) => mount(TransportControls, { props: { ...base, ...over } });

describe('TransportControls', () => {
  it('未播放时主按钮点了 emit play', async () => {
    const w = mountIt({ isPlaying: false });
    await w.find('.play').trigger('click');
    expect(w.emitted('play')).toHaveLength(1);
  });

  it('播放中主按钮点了 emit pause', async () => {
    const w = mountIt({ isPlaying: true });
    await w.find('.play').trigger('click');
    expect(w.emitted('pause')).toHaveLength(1);
  });

  it('atStart 时上一步禁用', () => {
    const w = mountIt({ atStart: true });
    expect(w.find('.ctl[title="上一步"]').attributes('disabled')).toBeDefined();
  });

  it('atEnd 时下一步禁用', () => {
    const w = mountIt({ atEnd: true });
    expect(w.find('.ctl[title="下一步"]').attributes('disabled')).toBeDefined();
  });

  it('下一步 emit stepForward', async () => {
    const w = mountIt();
    await w.find('.ctl[title="下一步"]').trigger('click');
    expect(w.emitted('stepForward')).toHaveLength(1);
  });

  it('重置 emit reset', async () => {
    const w = mountIt();
    await w.find('.ctl[title="重置"]').trigger('click');
    expect(w.emitted('reset')).toHaveLength(1);
  });

  it('计数器显示 index+1 / total', () => {
    const w = mountIt({ index: 3, total: 10 });
    expect(w.find('.counter').text()).toBe('4 / 10');
  });

  it('拖动进度条 emit seek(值)', async () => {
    const w = mountIt();
    const scrub = w.find('.scrub');
    (scrub.element as HTMLInputElement).value = '7';
    await scrub.trigger('input');
    expect(w.emitted('seek')![0]).toEqual([7]);
  });

  it('改速 emit setSpeed(值)', async () => {
    const w = mountIt();
    const sel = w.find('.speed');
    (sel.element as HTMLSelectElement).value = '2';
    await sel.trigger('change');
    expect(w.emitted('setSpeed')![0]).toEqual([2]);
  });

  // ===== C-111 M10-P2 =====
  it('TC-CTRL-UI-01 倍速下拉含 3× 且可选中', async () => {
    const w = mountIt();
    const opts = w.findAll('.speed option').map((o) => o.text());
    expect(opts).toContain('3×');
    const sel = w.find('.speed');
    (sel.element as HTMLSelectElement).value = '3';
    await sel.trigger('change');
    expect(w.emitted('setSpeed')![0]).toEqual([3]);
  });

  it('TC-CTRL-UI-02 循环按钮：点击 emit toggleLoop；loop=true 带激活类', async () => {
    const w = mountIt({ loop: false });
    const btn = w.find('.ctl-loop');
    expect(btn.exists()).toBe(true);
    expect(btn.classes()).not.toContain('ctl-active');
    await btn.trigger('click');
    expect(w.emitted('toggleLoop')).toHaveLength(1);
    const w2 = mountIt({ loop: true });
    expect(w2.find('.ctl-loop').classes()).toContain('ctl-active');
  });
});
