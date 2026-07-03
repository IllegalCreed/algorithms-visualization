import type {
  AlgorithmModule,
  BoyerMooreExecPoint,
  KmpTrack,
  Step,
  VarRow,
} from '@/components/player/types';
import { BM_TEXT, BM_PATTERN, bmLast } from './boyermoore';
import { boyerMooreSources } from './boyermoore.sources';

/** 固定 T=abcabxabc / P=abc，Boyer-Moore 坏字符规则细粒度重走（右往左 + 大步跳，复用 KmpView 轨），产出字符串匹配轨胖步骤 */
export function buildBoyerMooreSteps(): Step<BoyerMooreExecPoint>[] {
  const t = BM_TEXT;
  const p = BM_PATTERN;
  const n = t.length;
  const m = p.length;
  const last = bmLast();
  const lastStr = Object.entries(last)
    .map(([c, i]) => `${c}:${i}`)
    .join(' ');

  const steps: Step<BoyerMooreExecPoint>[] = [];
  const found: number[] = [];

  const vars = (s: number, j: number): VarRow[] => [
    { name: '文本 T', value: t },
    { name: '模式 P', value: p },
    { name: '坏字符表', value: lastStr },
    { name: '对齐 s', value: `${s}` },
    { name: 'j（从右往左）', value: `${j}` },
    { name: '已找到', value: found.length ? found.join(', ') : '—' },
  ];
  const track = (
    s: number,
    opts: {
      compareText?: number | null;
      comparePat?: number | null;
      matchedFrom?: number | null;
      status?: KmpTrack['status'];
    },
  ): KmpTrack => ({
    text: t,
    pattern: p,
    lps: [],
    offset: s,
    windowStart: s,
    matchedLen: 0,
    matchedFrom: opts.matchedFrom ?? null,
    compareText: opts.compareText ?? null,
    comparePat: opts.comparePat ?? null,
    lpsActive: null,
    status: opts.status ?? null,
    found: [...found],
  });
  const emit = (
    point: BoyerMooreExecPoint,
    s: number,
    j: number,
    opts: Parameters<typeof track>[1],
    caption: string,
  ): void => {
    steps.push({
      array: [],
      pointers: [],
      emphasis: {},
      vars: vars(s, j),
      point,
      kmp: track(s, opts),
      caption,
    });
  };

  emit(
    'start',
    0,
    m - 1,
    { compareText: m - 1, comparePat: m - 1, matchedFrom: m },
    `模式对齐到文本开头；Boyer-Moore 从模式末尾（右端）开始，从右往左比`,
  );

  let s = 0;
  while (s <= n - m) {
    let j = m - 1;
    while (j >= 0 && p[j] === t[s + j]) {
      emit(
        'match',
        s,
        j,
        { compareText: s + j, comparePat: j, matchedFrom: j, status: 'match' },
        `P[${j}]=T[${s + j}]='${p[j]}'：相等，继续往左比（已匹配后缀 "${p.slice(j)}"）`,
      );
      j--;
    }
    if (j < 0) {
      found.push(s);
      emit(
        'found',
        s,
        -1,
        { compareText: null, comparePat: null, matchedFrom: 0, status: 'found' },
        `整段从右到左全部匹配 → 命中于文本下标 ${s}`,
      );
      s += 1;
    } else {
      const bc = t[s + j];
      const lp = last[bc] ?? -1;
      const shift = Math.max(1, j - lp);
      emit(
        'badChar',
        s,
        j,
        { compareText: s + j, comparePat: j, matchedFrom: j + 1, status: 'mismatch' },
        lp >= 0
          ? `P[${j}]='${p[j]}' ≠ T[${s + j}]='${bc}'：坏字符 '${bc}' 在模式最右于 ${lp}，模式右移 ${j}−${lp} = ${shift} 格`
          : `P[${j}]='${p[j]}' ≠ T[${s + j}]='${bc}'：坏字符 '${bc}' 不在模式中，模式右移 ${shift} 格（跳过整段）`,
      );
      s += shift;
    }
  }

  emit(
    'done',
    Math.min(s, n - m),
    m - 1,
    { compareText: null, comparePat: null },
    found.length
      ? `文本扫描完毕：共命中 ${found.length} 处（下标 ${found.join(', ')}）`
      : `文本扫描完毕：未找到模式`,
  );
  return steps;
}

export const boyerMooreModule: AlgorithmModule<BoyerMooreExecPoint> = {
  title: 'Boyer-Moore 字符串匹配',
  initialInput: () => [],
  buildSteps: () => buildBoyerMooreSteps(),
  sources: boyerMooreSources,
};
