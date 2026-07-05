// src/components/player/InputBar.spec.ts —— 输入条组件（C-110，M10-P1）
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import InputBar from './InputBar.vue';
import { SORT_INPUT_SPEC } from './inputSpec';

const mountIt = (text = '7, 6, 5') =>
  mount(InputBar, { props: { spec: SORT_INPUT_SPEC, modelText: text } });

describe('InputBar 输入条', () => {
  it('TC-VIZ-INPUTBAR-01 渲染文本框 + hint + 应用/恢复默认按钮', () => {
    const w = mountIt();
    const input = w.find('input.ib-text');
    expect(input.exists()).toBe(true);
    expect(input.attributes('placeholder')).toBe(SORT_INPUT_SPEC.hint);
    expect((input.element as HTMLInputElement).value).toBe('7, 6, 5');
    expect(w.find('button.ib-apply').exists()).toBe(true);
    expect(w.find('button.ib-restore').exists()).toBe(true);
  });

  it('TC-VIZ-INPUTBAR-02 合法输入点应用 → emit apply 带数组', async () => {
    const w = mountIt();
    await w.find('input.ib-text').setValue('9, 2, 8, 1');
    await w.find('button.ib-apply').trigger('click');
    expect(w.emitted('apply')).toEqual([[[9, 2, 8, 1]]]);
    expect(w.find('.ib-error').exists()).toBe(false);
  });

  it('TC-VIZ-INPUTBAR-03 非法输入 → 行内错误、不 emit', async () => {
    const w = mountIt();
    await w.find('input.ib-text').setValue('9, abc');
    await w.find('button.ib-apply').trigger('click');
    expect(w.emitted('apply')).toBeUndefined();
    expect(w.find('.ib-error').text()).toContain('数字');
  });

  it('TC-VIZ-INPUTBAR-04 恢复默认 → emit restore + 清错误', async () => {
    const w = mountIt();
    await w.find('input.ib-text').setValue('bad');
    await w.find('button.ib-apply').trigger('click');
    expect(w.find('.ib-error').exists()).toBe(true);
    await w.find('button.ib-restore').trigger('click');
    expect(w.emitted('restore')).toHaveLength(1);
    expect(w.find('.ib-error').exists()).toBe(false);
  });
});
