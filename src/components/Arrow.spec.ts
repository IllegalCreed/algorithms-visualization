import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Arrow from './Arrow.vue';

describe('Arrow', () => {
  it('按 color 着色 svg', () => {
    const w = mount(Arrow, { props: { color: 'red' } });
    expect(w.find('svg').attributes('fill')).toBe('red');
  });
});
