import type { AlgorithmModule, MergeExecPoint, Step } from '@/components/player/types';
import { mergeSortModule } from '@/algorithms/merge-sort.module';
import { translateSources, valueOf } from '../shared';

function localizeMergeStep(step: Step<MergeExecPoint>): Step<MergeExecPoint> {
  const width = valueOf(step, 'width');
  const lo = valueOf(step, 'lo');
  const mid = valueOf(step, 'mid');
  const hi = valueOf(step, 'hi');
  const k = Number(valueOf(step, 'k'));
  const left = valueOf(step, 'a[i]');
  const right = valueOf(step, 'a[j]');
  const captions: Record<MergeExecPoint, () => string> = {
    widthChange: () => `Set run width to ${width}; merge adjacent sorted runs of this size.`,
    mergeStart: () => `Merge [${lo}, ${mid}) with [${mid}, ${hi}) into the auxiliary array.`,
    compare: () => `Compare left ${left} with right ${right}; write the smaller front value next.`,
    takeLeft: () => `Take ${left} from the left run and write it to temp[${k - 1}].`,
    takeRight: () => `Take ${right} from the right run and write it to temp[${k - 1}].`,
    drainLeft: () => `The right run is empty; copy remaining left value ${left} to temp[${k - 1}].`,
    drainRight: () =>
      `The left run is empty; copy remaining right value ${right} to temp[${k - 1}].`,
    writeBack: () => `Copy temp[${lo}, ${hi}) back into the main array.`,
    done: () => 'All run widths are merged and the array is sorted.',
  };

  return { ...step, caption: captions[step.point]() };
}

export const englishMergeSortModule: AlgorithmModule<MergeExecPoint> = {
  ...mergeSortModule,
  title: 'Merge Sort',
  buildSteps: (input) => mergeSortModule.buildSteps(input).map(localizeMergeStep),
  sources: translateSources(mergeSortModule.sources),
  inputSpec: mergeSortModule.inputSpec
    ? {
        ...mergeSortModule.inputSpec,
        hint: 'Enter 2 to 12 integers from 1 to 99, separated by commas',
      }
    : undefined,
};
