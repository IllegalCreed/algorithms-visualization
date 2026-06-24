import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Playground from './Playground.vue';

describe('Playground', () => {
  it('TC-VIZ-PLAYGROUND-01 默认角标「亲手试试」+ slot 内容', () => {
    const w = mount(Playground, { slots: { default: '<div class="widget">x</div>' } });
    expect(w.find('.playground').exists()).toBe(true);
    expect(w.find('.tag').text()).toBe('亲手试试');
    expect(w.find('.widget').exists()).toBe(true);
  });
  it('TC-VIZ-PLAYGROUND-02 自定义 title 角标', () => {
    const w = mount(Playground, { props: { title: '试一试' } });
    expect(w.find('.tag').text()).toBe('试一试');
  });
});
