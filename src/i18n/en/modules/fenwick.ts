import type { AlgorithmModule, FenwickExecPoint, Step, VarRow } from '@/components/player/types';
import { fenwickModule } from '@/algorithms/fenwick.module';
import { BIT_N, lowbit } from '@/algorithms/fenwick';
import { translateSources, valueOf } from '../shared';

function localizeFenwickSteps(steps: Step<FenwickExecPoint>[]): Step<FenwickExecPoint>[] {
  let updateStarted = false;
  return steps.map((step) => {
    const current = step.pointers[0] ? step.pointers[0].index + 1 : undefined;
    const treeValue = current ? step.array[current - 1]?.[1] : undefined;
    const sourceArray: VarRow = { name: 'Source array a', value: '[3, 2, 5, 1, 4, 2, 3, 1]' };

    if (step.point === 'init') {
      return {
        ...step,
        vars: [sourceArray, { name: 'Rule', value: 'tree[i] covers lowbit(i) values' }],
        caption:
          'Each bar is tree[1..8]. Prefix queries jump backward with i -= lowbit(i), while point updates jump forward with i += lowbit(i).',
      };
    }

    if (step.point === 'update') updateStarted = true;

    if (step.point === 'query' && current !== undefined) {
      const accumulated = valueOf(step, '累计');
      const next = current - lowbit(current);
      return {
        ...step,
        vars: [
          sourceArray,
          { name: 'Operation', value: updateStarted ? 'query(6), verify update' : 'query(6)' },
          { name: 'Accumulated', value: accumulated },
        ],
        caption: `At i=${current}, add tree[${current}]=${treeValue}; total=${accumulated}. Then jump to ${next}.`,
      };
    }

    if (step.point === 'update' && current !== undefined) {
      const next = current + lowbit(current);
      return {
        ...step,
        vars: [
          sourceArray,
          { name: 'Operation', value: 'update(3, +2)' },
          { name: 'tree[i]', value: treeValue ?? '-' },
        ],
        caption: `Add 2 to covering node tree[${current}], now ${treeValue}; jump forward to ${next > BIT_N ? 'done' : next}.`,
      };
    }

    return {
      ...step,
      vars: [sourceArray, { name: 'Complexity', value: 'query and update are both O(log n)' }],
      caption:
        'Both operations follow a lowbit chain, giving O(log n) updates and prefix queries in a compact structure.',
    };
  });
}

export const englishFenwickModule: AlgorithmModule<FenwickExecPoint> = {
  ...fenwickModule,
  title: 'Fenwick Tree (Binary Indexed Tree)',
  buildSteps: (input) => localizeFenwickSteps(fenwickModule.buildSteps(input)),
  sources: translateSources(fenwickModule.sources),
};
