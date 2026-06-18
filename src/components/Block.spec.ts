import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Block from './Block.vue';

describe('Block', () => {
  it('渲染数值', () => {
    const w = mount(Block, { props: { data: ['0', 42], percent: 0.5 } });
    expect(w.text()).toContain('42');
  });
  it('背景透明度随 percent', () => {
    const w = mount(Block, { props: { data: ['0', 1], percent: 0.3 } });
    expect(w.find('.block').attributes('style')).toContain('rgba(0, 200, 50, 0.3)');
  });
  it('percent<0.5 文字色 black，否则 white', () => {
    const low = mount(Block, { props: { data: ['0', 1], percent: 0.2 } });
    const high = mount(Block, { props: { data: ['0', 1], percent: 0.8 } });
    const lowStyle = low.find('span').attributes('style') ?? '';
    const highStyle = high.find('span').attributes('style') ?? '';
    expect(lowStyle).toContain('black');
    expect(lowStyle).not.toContain('white');
    expect(highStyle).toContain('white');
    expect(highStyle).not.toContain('black');
  });
});
