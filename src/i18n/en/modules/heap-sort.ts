import type { AlgorithmModule, HeapExecPoint, Step } from '@/components/player/types';
import { heapSortModule } from '@/algorithms/heap-sort.module';
import { translateSources, valueOf } from '../shared';

const phaseNames: Record<string, string> = {
  建堆: 'Build heap',
  排序: 'Sort',
  完成: 'Done',
};

function localizeHeapStep(step: Step<HeapExecPoint>): Step<HeapExecPoint> {
  const i = valueOf(step, 'i');
  const left = valueOf(step, 'left');
  const right = valueOf(step, 'right');
  const largest = valueOf(step, 'largest');
  const captions: Record<HeapExecPoint, () => string> = {
    heapify: () => `Run sift-down from node ${i} while building the max heap.`,
    compare: () =>
      `Compare node ${i} with children ${left} and ${right}; the largest index is ${largest}.`,
    settle: () => `Node ${i} is already the largest in its local subtree, so sift-down stops.`,
    swap: () => `Swap node ${i} with larger child ${largest} and continue downward.`,
    extract: () => 'Move the maximum root to the sorted suffix and shrink the heap.',
    done: () => 'The heap is empty and every array position is sorted.',
  };

  return {
    ...step,
    vars: step.vars.map((row) =>
      row.name === '阶段'
        ? { name: 'Phase', value: phaseNames[String(row.value)] ?? row.value }
        : { ...row },
    ),
    caption: captions[step.point](),
  };
}

export const englishHeapSortModule: AlgorithmModule<HeapExecPoint> = {
  ...heapSortModule,
  title: 'Heap Sort',
  buildSteps: (input) => heapSortModule.buildSteps(input).map(localizeHeapStep),
  sources: translateSources(heapSortModule.sources),
  inputSpec: heapSortModule.inputSpec
    ? {
        ...heapSortModule.inputSpec,
        hint: 'Enter 2 to 12 integers from 1 to 99, separated by commas',
      }
    : undefined,
};
