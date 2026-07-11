import type { AlgorithmModule, KmpExecPoint, Step } from '@/components/player/types';
import { kmpModule } from '@/algorithms/kmp.module';
import { translateSources } from '../shared';

function localizeKmpStep(step: Step<KmpExecPoint>): Step<KmpExecPoint> {
  const track = step.kmp!;
  const i = track.compareText ?? track.text.length;
  const j = track.comparePat ?? 0;
  const textChar = track.text[i];
  const patternChar = track.pattern[j];
  const captions: Record<KmpExecPoint, () => string> = {
    start: () => 'Align the pattern with the start of the text; both pointers begin at 0.',
    match: () => `T[${i}] = P[${j}] = '${patternChar}', so advance both pointers.`,
    jump: () =>
      `T[${i}] = '${textChar}' differs from P[${j}] = '${patternChar}'; jump j to lps[${j - 1}] = ${track.lps[j - 1]} without rewinding i.`,
    advance: () =>
      `T[${i}] = '${textChar}' differs from P[0] = '${patternChar}' at j = 0, so advance the text pointer.`,
    found: () =>
      `The complete pattern matches at text index ${i - (track.pattern.length - 1)}; continue with the LPS fallback.`,
    done: () =>
      track.found.length
        ? `The scan is complete with ${track.found.length} match(es) at index ${track.found.join(', ')}.`
        : 'The scan is complete and the pattern was not found.',
  };

  return {
    ...step,
    vars: [
      { name: 'Text T', value: track.text },
      { name: 'Pattern P', value: track.pattern },
      { name: 'i (text)', value: `${i}` },
      { name: 'j (pattern)', value: `${j}` },
      { name: 'Matches', value: track.found.length ? track.found.join(', ') : 'None' },
    ],
    caption: captions[step.point](),
  };
}

export const englishKmpModule: AlgorithmModule<KmpExecPoint> = {
  ...kmpModule,
  title: 'KMP String Matching',
  buildSteps: (input) => kmpModule.buildSteps(input).map(localizeKmpStep),
  sources: translateSources(kmpModule.sources),
};
