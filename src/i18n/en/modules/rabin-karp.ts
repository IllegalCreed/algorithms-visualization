import type { AlgorithmModule, RabinKarpExecPoint, Step, VarRow } from '@/components/player/types';
import { rabinKarpModule } from '@/algorithms/rabinkarp.module';
import { translateSources, valueOf } from '../shared';

const RABIN_KARP_SOURCE_REPLACEMENTS: ReadonlyArray<readonly [string, string]> = [
  ['首窗口哈希', 'first window hash'],
  ['逐字符验证', 'verify characters'],
  ['滚动更新 O(1)', 'rolling update O(1)'],
  ['模式哈希', 'pattern hash'],
  ['哈希命中', 'hash match'],
];

function localizeRabinKarpVars(vars: VarRow[]): VarRow[] {
  const labels: Record<string, string> = {
    '文本 T': 'Text T',
    '模式 P': 'Pattern P',
    模式哈希: 'Pattern hash',
    窗口哈希: 'Window hash',
    已找到: 'Matches',
  };
  return vars.map((row) => ({ name: labels[row.name] ?? row.name, value: row.value }));
}

function localizeRabinKarpStep(step: Step<RabinKarpExecPoint>): Step<RabinKarpExecPoint> {
  const track = step.kmp!;
  const start = track.windowStart ?? track.offset;
  const end = start + track.pattern.length;
  const window = track.text.slice(start, end);
  const windowHash = valueOf(step, '窗口哈希');
  const patternHash = valueOf(step, '模式哈希');
  const captions: Record<RabinKarpExecPoint, () => string> = {
    start: () =>
      `Hash pattern "${track.pattern}" to ${patternHash}, then begin with the first text window.`,
    skip: () =>
      `Window [${start}, ${end}) has hash ${windowHash}, not ${patternHash}; slide without comparing characters.`,
    hashHit: () =>
      `Window [${start}, ${end}) has the pattern hash ${patternHash}; verify characters to rule out a collision.`,
    verify: () =>
      `Compare window "${window}" with pattern "${track.pattern}" character by character.`,
    found: () => `Verification succeeds, so record a match at text index ${start}.`,
    done: () =>
      track.found?.length
        ? `The scan is complete with matches at indices ${track.found.join(', ')}.`
        : 'The scan is complete with no match.',
  };

  return {
    ...step,
    vars: localizeRabinKarpVars(step.vars),
    caption: captions[step.point](),
  };
}

export const englishRabinKarpModule: AlgorithmModule<RabinKarpExecPoint> = {
  ...rabinKarpModule,
  title: 'Rabin-Karp String Matching',
  buildSteps: (input) => rabinKarpModule.buildSteps(input).map(localizeRabinKarpStep),
  sources: translateSources(rabinKarpModule.sources, RABIN_KARP_SOURCE_REPLACEMENTS),
};
