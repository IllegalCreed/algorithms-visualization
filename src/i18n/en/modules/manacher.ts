import type { AlgorithmModule, ManacherExecPoint, Step, VarRow } from '@/components/player/types';
import { manacherModule } from '@/algorithms/manacher.module';
import { translateSources, valueOf } from '../shared';

const MANACHER_SOURCE_REPLACEMENTS: ReadonlyArray<readonly [string, string]> = [
  ['最右回文中心 c、右边界 r', 'rightmost palindrome center c and boundary r'],
  ['预处理：插 #', 'preprocess: insert #'],
  ['对称性复用', 'reuse mirror symmetry'],
  ['中心扩展', 'expand around the center'],
];

function localizeManacherValue(value: VarRow['value']): VarRow['value'] {
  if (typeof value !== 'string') return value;
  return value
    .replace(/（'([^']+)'）/, " ('$1')")
    .replace(/（长 ([^)）]+)）/, ' (length $1)')
    .replace(/（中心 ([^)）]+)）/, ' (center $1)');
}

function localizeManacherVars(vars: VarRow[]): VarRow[] {
  const labels: Record<string, string> = {
    原串: 'Original',
    转换串: 'Transformed',
    '当前中心 i': 'Current center i',
    '半径 p[i]': 'Radius p[i]',
    '最右回文 C/R': 'Rightmost palindrome C/R',
    当前最长: 'Current longest',
    最长半径: 'Longest radius',
    最长回文: 'Longest palindrome',
  };
  return vars.map((row) => ({
    name: labels[row.name] ?? row.name,
    value: localizeManacherValue(row.value),
  }));
}

function localizeManacherStep(step: Step<ManacherExecPoint>): Step<ManacherExecPoint> {
  const track = step.manacher!;
  const center = track.center;
  const radius = center === null || center === undefined ? undefined : track.p[center];
  const captions: Record<ManacherExecPoint, () => string> = {
    init: () =>
      `Insert separators to transform "${valueOf(step, '原串')}" into "${valueOf(step, '转换串')}", so every palindrome has one center.`,
    mirror: () =>
      `Center ${center} lies inside [${track.boxL}, ${track.boxR}]; reuse mirror ${track.mirror}, then expand to radius ${radius}.`,
    expand: () =>
      `Center ${center} lies outside the rightmost palindrome, so expand directly to radius ${radius}.`,
    done: () =>
      `The maximum radius identifies longest palindromic substring ${valueOf(step, '最长回文')}.`,
  };

  return {
    ...step,
    manacher: {
      ...track,
      statusLabels: {
        mirror: 'Mirror reuse',
        expand: 'Center expansion',
        done: 'Done',
      },
    },
    vars: localizeManacherVars(step.vars),
    caption: captions[step.point](),
  };
}

export const englishManacherModule: AlgorithmModule<ManacherExecPoint> = {
  ...manacherModule,
  title: "Manacher's Longest Palindromic Substring",
  buildSteps: (input) => manacherModule.buildSteps(input).map(localizeManacherStep),
  sources: translateSources(manacherModule.sources, MANACHER_SOURCE_REPLACEMENTS),
};
