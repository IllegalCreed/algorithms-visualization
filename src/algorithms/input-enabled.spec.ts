// src/algorithms/input-enabled.spec.ts —— 第一批开放自定义输入的排序模块聚合断言（C-110，M10-P1）
import { describe, it, expect } from 'vitest';
import { SORT_INPUT_SPEC } from '@/components/player/inputSpec';
import { bubbleSortModule } from './bubble-sort.module';
import { cocktailSortModule } from './cocktail.module';
import { insertionSortModule } from './insertion-sort.module';
import { binaryInsertionSortModule } from './binary-insertion.module';
import { selectionSortModule } from './selection-sort.module';
import { shellSortModule } from './shell-sort.module';
import { mergeSortModule } from './merge-sort.module';
import { topDownMergeSortModule } from './top-down-merge.module';
import { quickSortModule } from './quick-sort.module';
import { dualPivotQuickSortModule } from './dual-pivot-quick.module';
import { threeWayQuickSortModule } from './three-way-quick.module';
import { heapSortModule } from './heap-sort.module';

const FIRST_BATCH = [
  bubbleSortModule,
  cocktailSortModule,
  insertionSortModule,
  binaryInsertionSortModule,
  selectionSortModule,
  shellSortModule,
  mergeSortModule,
  topDownMergeSortModule,
  quickSortModule,
  dualPivotQuickSortModule,
  threeWayQuickSortModule,
  heapSortModule,
];

describe('自定义输入第一批（C-110）', () => {
  it('TC-MOD-INPUTSPEC-01 常规排序 12 模块 inputSpec 齐且 = SORT_INPUT_SPEC', () => {
    expect(FIRST_BATCH).toHaveLength(12);
    for (const m of FIRST_BATCH) {
      expect(m.inputSpec, m.title).toBe(SORT_INPUT_SPEC);
    }
    // 每个模块的默认输入自身要过校验（否则输入条初值即报错）
    for (const m of FIRST_BATCH) {
      const arr = m.initialInput();
      expect(arr.length, m.title).toBeGreaterThanOrEqual(SORT_INPUT_SPEC.lenMin);
      expect(arr.length, m.title).toBeLessThanOrEqual(SORT_INPUT_SPEC.lenMax);
      for (const v of arr) {
        expect(v, m.title).toBeGreaterThanOrEqual(SORT_INPUT_SPEC.valMin);
        expect(v, m.title).toBeLessThanOrEqual(SORT_INPUT_SPEC.valMax);
      }
    }
  });
});
