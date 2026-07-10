import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import List from './List.vue';
import Block from './Block.vue';

describe('List', () => {
  const data: [string, number][] = [
    ['0', 10],
    ['1', 20],
    ['2', 30],
  ];
  it('渲染与数据等量的 Block', () => {
    const w = mount(List, { props: { data } });
    expect(w.findAllComponents(Block)).toHaveLength(3);
  });
  it('最小值 percent=0、最大值 percent=1', () => {
    const w = mount(List, { props: { data } });
    const blocks = w.findAllComponents(Block);
    expect(blocks[0].props('percent')).toBe(0);
    expect(blocks[2].props('percent')).toBe(1);
  });

  it('TC-VIZ-LIST-03: 全部数值相等时 percent 使用中性值而不是 NaN（C-119）', () => {
    const w = mount(List, {
      props: {
        data: [
          ['0', 5],
          ['1', 5],
        ],
      },
    });
    const blocks = w.findAllComponents(Block);
    expect(blocks.map((block) => block.props('percent'))).toEqual([0.5, 0.5]);
  });
});
