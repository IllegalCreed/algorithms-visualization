import type { AlgorithmModule, CountingExecPoint, Step } from '@/components/player/types';
import { countingSortModule } from '@/algorithms/counting-sort.module';
import { translateSources, valueOf } from '../shared';

const phaseNames: Record<string, string> = {
  计数: 'Count',
  回写: 'Write back',
  完成: 'Done',
};

function localizeCountingStep(step: Step<CountingExecPoint>): Step<CountingExecPoint> {
  const activeBucket = step.count?.activeBucket;
  const value = activeBucket === undefined ? undefined : (step.count?.min ?? 0) + activeBucket;
  const bucketCount = activeBucket === undefined ? 0 : (step.count?.buckets[activeBucket] ?? 0);
  const writeIndex = Number(valueOf(step, 'w'));
  const captions: Record<CountingExecPoint, () => string> = {
    count: () => `Read the next value ${value} and increment its bucket to ${bucketCount}.`,
    bucketStart: () =>
      bucketCount > 0
        ? `Bucket ${value} contains ${bucketCount} value(s); write them back in order.`
        : `Bucket ${value} is empty, so continue to the next value.`,
    writeBack: () =>
      `Write value ${value} at index ${writeIndex - 1}; ${bucketCount} remain in this bucket.`,
    done: () => 'Every bucket is empty and the array has been reconstructed in sorted order.',
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

export const englishCountingSortModule: AlgorithmModule<CountingExecPoint> = {
  ...countingSortModule,
  title: 'Counting Sort',
  buildSteps: (input) => countingSortModule.buildSteps(input).map(localizeCountingStep),
  sources: translateSources(countingSortModule.sources),
};
