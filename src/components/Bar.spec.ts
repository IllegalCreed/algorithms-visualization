// src/components/Bar.spec.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Bar from './Bar.vue';

describe('Bar', () => {
  it('渲染数值', () => {
    const w = mount(Bar, { props: { value: 7, percent: 0.5, state: 'idle' } });
    expect(w.text()).toContain('7');
  });

  it('高度随 percent 增大', () => {
    const low = mount(Bar, { props: { value: 1, percent: 0, state: 'idle' } });
    const high = mount(Bar, { props: { value: 9, percent: 1, state: 'idle' } });
    const h = (w: typeof low) =>
      parseFloat((w.find('.bar').attributes('style') || '').match(/height:\s*([\d.]+)px/)![1]);
    expect(h(high)).toBeGreaterThan(h(low));
  });

  it('state 决定柱体 class', () => {
    const w = mount(Bar, { props: { value: 7, percent: 0.5, state: 'comparing' } });
    expect(w.find('.bar').classes()).toContain('comparing');
  });

  it('TC-VIZ-BAR-04 state=min 时柱体加 min class', () => {
    const w = mount(Bar, { props: { value: 7, percent: 0.5, state: 'min' } });
    expect(w.find('.bar').classes()).toContain('min');
  });

  it('TC-VIZ-BAR-05 state=key 时柱体加 key class', () => {
    const w = mount(Bar, { props: { value: 7, percent: 0.5, state: 'key' } });
    expect(w.find('.bar').classes()).toContain('key');
  });

  it('TC-VIZ-BAR-06 state=dimmed 时柱体加 dimmed class', () => {
    const w = mount(Bar, { props: { value: 7, percent: 0.5, state: 'dimmed' } });
    expect(w.find('.bar').classes()).toContain('dimmed');
  });
});
