import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import ArrowTrack from './ArrowTrack.vue';
import Arrow from './Arrow.vue';

describe('ArrowTrack', () => {
  it('每个 Pointer 渲染一个 Arrow 并按 index 定位', () => {
    const w = mount(ArrowTrack, {
      props: {
        data: [
          { id: '0', index: 2 },
          { id: '1', index: 3 },
        ],
      },
      global: { plugins: [createPinia()] },
    });
    const arrows = w.findAllComponents(Arrow);
    expect(arrows).toHaveLength(2);
    expect(arrows[0].attributes('style')).toContain('translateX(120px)');
  });
});
