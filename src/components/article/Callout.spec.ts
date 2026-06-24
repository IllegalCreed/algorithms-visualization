import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Callout from './Callout.vue';

describe('Callout', () => {
  it('TC-VIZ-CALLOUT-01 渲染 .callout 且 slot 内容出现', () => {
    const w = mount(Callout, { slots: { default: '函数调用栈' } });
    expect(w.find('.callout').exists()).toBe(true);
    expect(w.text()).toContain('函数调用栈');
  });
});
