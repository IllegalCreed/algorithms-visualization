import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Arrow from './Arrow.vue';

describe('Arrow', () => {
  it('语义色映射为柔和展示色，描在雪佛龙上', () => {
    const w = mount(Arrow, { props: { color: 'red' } });
    expect(w.find('path').attributes('stroke')).toBe('#e5686b'); // red → 柔红
  });

  it('非预设色按原值透传', () => {
    const w = mount(Arrow, { props: { color: '#123456' } });
    expect(w.find('path').attributes('stroke')).toBe('#123456');
  });
});
