// src/components/NetworkView.spec.ts —— 比较器网络轨（C-085，双调排序，排序阶段三）
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import NetworkView from './NetworkView.vue';
import type { Comparator, NetworkTrack } from '@/components/player/types';

// n=8 双调网络 6 列 24 比较器（位运算展开）
const comparators: Comparator[] = [];
{
  let col = 0;
  for (let k = 2; k <= 8; k *= 2) {
    for (let j = k >> 1; j >= 1; j >>= 1) {
      for (let i = 0; i < 8; i++) {
        const l = i ^ j;
        if (l > i) comparators.push({ col, a: i, b: l, dir: (i & k) === 0 ? 'asc' : 'desc' });
      }
      col++;
    }
  }
}
const base: NetworkTrack = {
  wires: [5, 2, 7, 1, 8, 3, 6, 4],
  comparators,
  cols: 6,
};
const mountIt = (network: NetworkTrack) => mount(NetworkView, { props: { network } });

describe('NetworkView', () => {
  it('TC-VIZ-NETVIEW-01 8 wire + 值标注 + 24 比较器', () => {
    const w = mountIt(base);
    expect(w.findAll('.net-wire')).toHaveLength(8);
    expect(w.findAll('.net-val')).toHaveLength(8);
    expect(w.findAll('.net-comp')).toHaveLength(24);
    expect(w.text()).toContain('5');
    expect(w.text()).toContain('8');
  });

  it('TC-VIZ-NETVIEW-02 列态分色：current 琥珀、已执行绿', () => {
    const w = mountIt({ ...base, currentCol: 2 });
    expect(w.findAll('.net-comp.net-active')).toHaveLength(4); // 列 2 的 4 个
    expect(w.findAll('.net-comp.net-done')).toHaveLength(8); // 列 0、1 各 4 个
  });

  it('TC-VIZ-NETVIEW-03 无状态默认：无 active/done', () => {
    const w = mountIt(base);
    expect(w.findAll('.net-active')).toHaveLength(0);
    expect(w.findAll('.net-done')).toHaveLength(0);
  });

  it('TC-VIZ-NETVIEW-04 additive：wireLabels 复数线值 + tag ω 标注且无三角（C-107 FFT）', () => {
    const fftComps: Comparator[] = [
      { col: 0, a: 0, b: 1, dir: 'asc', tag: '×1' },
      { col: 0, a: 2, b: 3, dir: 'asc', tag: '×ω²' },
    ];
    const w = mountIt({
      wires: [0, 0, 0, 0],
      wireLabels: ['1', '1-3i', '-2', '1+3i'],
      comparators: fftComps,
      cols: 1,
    });
    expect(w.text()).toContain('1-3i');
    expect(w.text()).toContain('×ω²');
    // 设 tag 的比较器不画大值三角（每个 .net-comp 内无 path）
    expect(w.findAll('.net-comp path')).toHaveLength(0);
  });

  it('TC-VIZ-NETVIEW-05 additive：不设回退数值 + 三角（双调排序零回归）', () => {
    const w = mountIt({ ...base, currentCol: 0 });
    expect(w.text()).toContain('5');
    expect(w.findAll('.net-comp path').length).toBeGreaterThan(0);
  });
});
