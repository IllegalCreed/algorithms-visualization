// src/components/PowerView.spec.ts —— 幂块轨（C-080，快速幂，数学与数论第 4 页）
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PowerView from './PowerView.vue';
import type { PowerBlock, PowerTrack } from '@/components/player/types';

// 3^13 幂块：a^1=3(sel), a^2=9, a^4=81(sel), a^8=6561(sel)
const blocks: PowerBlock[] = [
  { k: 0, exp: 1, value: 3, bit: 1, selected: true },
  { k: 1, exp: 2, value: 9, bit: 0, selected: false },
  { k: 2, exp: 4, value: 81, bit: 1, selected: true },
  { k: 3, exp: 8, value: 6561, bit: 1, selected: true },
];
const base: PowerTrack = { a: 3, n: 13, binary: '1101', blocks, result: 1594323 };
const mountIt = (power: PowerTrack) => mount(PowerView, { props: { power } });

describe('PowerView', () => {
  it('TC-VIZ-POWERVIEW-01 幂块行 4 块 + 显示值', () => {
    const w = mountIt(base);
    expect(w.findAll('.power-block')).toHaveLength(4);
    const txt = w.text();
    expect(txt).toContain('3');
    expect(txt).toContain('81');
    expect(txt).toContain('6561');
  });

  it('TC-VIZ-POWERVIEW-02 选中块 + 当前块高亮', () => {
    const w = mountIt({ ...base, current: 0 });
    expect(w.findAll('.power-selected')).toHaveLength(3); // k0,k2,k3
    expect(w.findAll('.power-current')).toHaveLength(1);
    expect(w.findAll('.power-block')[0].classes()).toContain('power-current');
  });

  it('TC-VIZ-POWERVIEW-03 结果 + 二进制串', () => {
    const w = mountIt(base);
    expect(w.find('.power-result').exists()).toBe(true);
    expect(w.find('.power-result').text()).toContain('1594323');
    expect(w.text()).toContain('1101');
  });
});
