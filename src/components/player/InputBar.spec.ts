// src/components/player/InputBar.spec.ts —— 输入条组件（C-110，M10-P1）
import { describe, it, expect } from 'vitest';
import { defineComponent } from 'vue';
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

  it('TC-VIZ-INPUTBAR-05 输入框与错误提示具备可访问性关联（C-119）', async () => {
    const w = mountIt();
    const label = w.find('label.ib-label');
    const input = w.find('input.ib-text');
    expect(label.attributes('for')).toBe(input.attributes('id'));
    expect(input.attributes('name')).toBe('algorithm-input');

    await input.setValue('9, abc');
    await w.find('button.ib-apply').trigger('click');
    const error = w.find('.ib-error');
    expect(error.attributes('role')).toBe('alert');
    expect(error.attributes('aria-live')).toBe('polite');
    expect(input.attributes('aria-invalid')).toBe('true');
    expect(input.attributes('aria-describedby')).toBe(error.attributes('id'));
  });

  it('TC-VIZ-INPUTBAR-06 多个输入条同屏时 id 不重复（C-119）', () => {
    const DualInputBars = defineComponent({
      components: { InputBar },
      setup: () => ({ SORT_INPUT_SPEC }),
      template: `
        <div>
          <InputBar :spec="SORT_INPUT_SPEC" model-text="1, 2, 3" />
          <InputBar :spec="SORT_INPUT_SPEC" model-text="4, 5, 6" />
        </div>
      `,
    });
    const w = mount(DualInputBars);
    const ids = w.findAll('input.ib-text').map((input) => input.attributes('id'));
    const labelFors = w.findAll('label.ib-label').map((label) => label.attributes('for'));
    expect(new Set(ids).size).toBe(2);
    expect(labelFors).toEqual(ids);
  });
});
