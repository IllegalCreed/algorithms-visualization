import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Complexity from './Complexity.vue';
import Paths from './Paths.vue';
import { getEnglishHomeCategories } from './homeCatalog';

const global = {
  stubs: {
    RouterLink: {
      template: '<a><slot /></a>',
    },
  },
};

describe('English catalog views', () => {
  it('TC-I18N-UI-131-01: Home 十类覆盖 94 个内容入口且 Complexity 渲染 92 个学习页', async () => {
    const categories = getEnglishHomeCategories();
    const homeEntries = categories.flatMap((category) => category.children);

    expect(categories).toHaveLength(10);
    expect(homeEntries).toHaveLength(94);
    expect(new Set(homeEntries.map((entry) => entry.url)).size).toBe(94);

    const wrapper = mount(Complexity, { global });
    expect(wrapper.findAll('tbody tr')).toHaveLength(92);
    expect(wrapper.text()).toContain('92 translated learning pages');

    const stringsButton = wrapper
      .findAll('.complexity-tab')
      .find((button) => button.text() === 'Strings');
    expect(stringsButton).toBeDefined();
    await stringsButton!.trigger('click');
    expect(wrapper.findAll('tbody tr')).toHaveLength(8);

    await wrapper.find('.complexity-search').setValue('rabin');
    expect(wrapper.findAll('tbody tr')).toHaveLength(1);
    expect(wrapper.find('tbody').text()).toContain('Rabin-Karp');
  });

  it('TC-I18N-UI-131-02: 八条学习路径无遗漏覆盖 92 个学习页', () => {
    const wrapper = mount(Paths, { global });

    expect(wrapper.findAll('.learning-path')).toHaveLength(8);
    expect(wrapper.findAll('.learning-path li')).toHaveLength(92);
    expect(wrapper.text()).toContain('Sorting Systems');
    expect(wrapper.text()).toContain('Backtracking');
    expect(wrapper.text()).toContain('Number Theory');
    expect(wrapper.text()).toContain('Geometry');
  });
});
