import type { AlgorithmModule, GcdExecPoint, Step, VarRow } from '@/components/player/types';
import { gcdModule } from '@/algorithms/gcd.module';
import { translateSources, valueOf } from '../shared';

const GCD_SOURCE_REPLACEMENTS: ReadonlyArray<readonly [string, string]> = [
  ['b=0 时 a 就是最大公约数（最小正方形边长）', 'when b=0, a is the GCD (smallest square side)'],
  ['a 除以 b 的余数（= 切完正方形后剩下的边）', 'remainder of a / b, the leftover rectangle side'],
  ['a 除以 b 的余数', 'remainder of a / b'],
  ['除数变被除数、余数变除数', 'divisor becomes dividend; remainder becomes divisor'],
  ['余数不为 0 就继续切', 'continue while the remainder is nonzero'],
  ['除数变被除数', 'divisor becomes dividend'],
  ['余数变除数', 'remainder becomes divisor'],
  ['b=0 时 a 就是最大公约数', 'when b=0, a is the GCD'],
];

function localizeGcdVars(vars: VarRow[]): VarRow[] {
  const labels: Record<string, string> = {
    矩形: 'Rectangle',
    递推: 'Recurrence',
    当前: 'Current',
  };
  return vars.map((row) => ({ name: labels[row.name] ?? row.name, value: row.value }));
}

function localizeGcdStep(step: Step<GcdExecPoint>): Step<GcdExecPoint> {
  const track = step.gcd!;
  const currentSquares = (track.current ?? []).map((index) => track.squares[index]);
  const squareSize = currentSquares[0]?.size;
  const remaining = track.remaining
    ? `${track.remaining.w} x ${track.remaining.h} remains`
    : 'the rectangle is filled exactly';
  const captions: Record<GcdExecPoint, () => string> = {
    init: () =>
      `Find gcd(${track.a}, ${track.b}) by repeatedly cutting the largest possible squares from a ${track.a} x ${track.b} rectangle.`,
    cut: () =>
      `${valueOf(step, '当前')}: cut ${currentSquares.length} square(s) of side ${squareSize}; ${remaining}.`,
    done: () =>
      `The tiling is complete and the smallest square side is ${valueOf(step, 'gcd')}, so gcd(${track.a}, ${track.b}) = ${valueOf(step, 'gcd')}.`,
  };

  return {
    ...step,
    vars: localizeGcdVars(step.vars),
    caption: captions[step.point](),
  };
}

export const englishGcdModule: AlgorithmModule<GcdExecPoint> = {
  ...gcdModule,
  title: 'Euclidean Algorithm',
  buildSteps: (input) => gcdModule.buildSteps(input).map(localizeGcdStep),
  sources: translateSources(gcdModule.sources, GCD_SOURCE_REPLACEMENTS),
};
