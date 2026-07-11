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
  it('TC-I18N-UI-130-02: Home 十类覆盖 29 个内容入口且 Complexity 渲染 27 个算法', async () => {
    const categories = getEnglishHomeCategories();
    const homeEntries = categories.flatMap((category) => category.children);

    expect(categories).toHaveLength(10);
    expect(homeEntries).toHaveLength(29);
    expect(new Set(homeEntries.map((entry) => entry.url)).size).toBe(29);

    const wrapper = mount(Complexity, { global });
    expect(wrapper.findAll('tbody tr')).toHaveLength(27);
    expect(wrapper.text()).toContain('27 translated algorithms');

    const stringsButton = wrapper
      .findAll('.complexity-tab')
      .find((button) => button.text() === 'Strings');
    expect(stringsButton).toBeDefined();
    await stringsButton!.trigger('click');
    expect(wrapper.findAll('tbody tr')).toHaveLength(3);

    await wrapper.find('.complexity-search').setValue('rabin');
    expect(wrapper.findAll('tbody tr')).toHaveLength(1);
    expect(wrapper.find('tbody').text()).toContain('Rabin-Karp');
  });

  it('TC-I18N-UI-130-03: 八条学习路径无遗漏覆盖 27 个算法', () => {
    const wrapper = mount(Paths, { global });

    expect(wrapper.findAll('.learning-path')).toHaveLength(8);
    expect(wrapper.findAll('.learning-path li')).toHaveLength(27);
    expect(wrapper.text()).toContain('Sorting Systems');
    expect(wrapper.text()).toContain('Backtracking');
    expect(wrapper.text()).toContain('Number Theory');
    expect(wrapper.text()).toContain('Geometry');
  });
});
