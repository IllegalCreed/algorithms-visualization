import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import MatrixView from './MatrixView.vue';
import type { MatrixTrack } from '@/components/player/types';

const base: MatrixTrack = {
  labels: ['A', 'B', 'C', 'D'],
  cells: [
    [0, 3, 6, null],
    [null, 0, 2, 4],
    [null, null, 0, 1],
    [5, null, null, 0],
  ],
};

const mountIt = (m: Partial<MatrixTrack> = {}) =>
  mount(MatrixView, { props: { matrix: { ...base, ...m } } });

describe('MatrixView 矩阵轨', () => {
  it('TC-VIZ-MATRIXVIEW-01 渲染 4×4 数据单元 + 行列标签 A/B/C/D', () => {
    const w = mountIt();
    expect(w.findAll('.matrix-cell')).toHaveLength(16);
    const text = w.text();
    for (const l of ['A', 'B', 'C', 'D']) expect(text).toContain(l);
  });

  it('TC-VIZ-MATRIXVIEW-02 null 单元显示「∞」', () => {
    const w = mountIt();
    const infCells = w.findAll('.matrix-cell').filter((c) => c.text() === '∞');
    // 初始邻接矩阵有 6 个不可达单元
    expect(infCells.length).toBe(6);
  });

  it('TC-VIZ-MATRIXVIEW-03 pivot=1 → 第 1 行与第 1 列单元带 .mx-pivot', () => {
    const w = mountIt({ pivot: 1 });
    // 第 1 行 4 个 + 第 1 列 4 个 - 交叉 1 个 = 7 个不同单元
    const pivotCells = w.findAll('.matrix-cell.mx-pivot');
    expect(pivotCells.length).toBe(7);
  });

  it('TC-VIZ-MATRIXVIEW-04 active=(0,2) 带 .mx-active；sources 两单元带 .mx-source', () => {
    const w = mountIt({
      active: [0, 2],
      sources: [
        [0, 1],
        [1, 2],
      ],
    });
    expect(w.findAll('.matrix-cell.mx-active')).toHaveLength(1);
    expect(w.findAll('.matrix-cell.mx-source')).toHaveLength(2);
  });

  it('TC-VIZ-MATRIXVIEW-05 行列异标签：rowLabels/colLabels 各自渲染（DP 表）', () => {
    const w = mountIt({ rowLabels: ['∅', 'S', 'A', 'T'], colLabels: ['∅', 'S', 'U', 'N'] });
    const heads = w.findAll('.mx-head').map((h) => h.text());
    // 列头（首行）含目标串 S/U/N；行头（每行首列）含源串 A/T
    expect(heads).toContain('U'); // 仅列标签有 U
    expect(heads).toContain('A'); // 仅行标签有 A
    expect(heads).toContain('N'); // 仅列标签有 N
    expect(heads).toContain('T'); // 仅行标签有 T
  });

  it('TC-VIZ-MATRIXVIEW-06 emptyText="" → null 单元显示空白（非 ∞）', () => {
    const w = mountIt({ emptyText: '' });
    const infCells = w.findAll('.matrix-cell').filter((c) => c.text() === '∞');
    expect(infCells.length).toBe(0); // 不再显示 ∞
    const blankCells = w.findAll('.matrix-cell').filter((c) => c.text() === '');
    expect(blankCells.length).toBe(6); // 原 6 个 null 单元显示空白
  });
});
