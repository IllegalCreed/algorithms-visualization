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
});
