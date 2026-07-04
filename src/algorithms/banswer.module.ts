import type {
  AlgorithmModule,
  BaExecPoint,
  Pointer,
  Step,
  VarRow,
} from '@/components/player/types';
import { BA_PILES, BA_H, BA_MAX, baTrace } from './banswer';
import { banswerSources } from './banswer.sources';

const ID_LO = '0'; // 红
const ID_MID = '1'; // 蓝
const ID_HI = '2'; // 黄

const range = (a: number, b: number): number[] => {
  const r: number[] = [];
  for (let i = a; i <= b; i++) r.push(i);
  return r;
};

/** 固定「珂珂吃香蕉」答案空间二分逐探针重走，产出主柱轨胖步骤——
 *  柱子的语义反转：11 根柱 = 候选速度 1..11，而不是被查数组。 */
export function buildBanswerSteps(input: number[]): Step<BaExecPoint>[] {
  const speeds = [...input]; // 1..11 答案空间
  const work: [string, number][] = speeds.map((v, i) => [String(i), v]);
  const steps: Step<BaExecPoint>[] = [];
  const idx = (speed: number): number => speed - 1; // 速度 → 柱下标

  const emit = (
    point: BaExecPoint,
    ptr: { lo?: number; mid?: number; hi?: number }, // 速度值
    emphasis: Step['emphasis'],
    caption: string,
    extra: VarRow[] = [],
  ): void => {
    const pointers: Pointer[] = [];
    if (ptr.lo !== undefined) pointers.push({ id: ID_LO, index: idx(ptr.lo) });
    if (ptr.mid !== undefined) pointers.push({ id: ID_MID, index: idx(ptr.mid) });
    if (ptr.hi !== undefined) pointers.push({ id: ID_HI, index: idx(ptr.hi) });
    steps.push({
      array: work.map((t) => [t[0], t[1]] as [string, number]),
      pointers,
      emphasis,
      vars: [
        { name: '香蕉堆', value: `[${BA_PILES.join(', ')}]` },
        { name: '限时 h', value: `${BA_H} 小时` },
        ...extra,
      ],
      point,
      caption,
    });
  };

  const tr = baTrace();
  const vt = (lo: number, hi: number, mid: number | string, hrs?: number): VarRow[] => {
    const rows: VarRow[] = [
      { name: '候选速度 [lo, hi]', value: `[${lo}, ${hi}]` },
      { name: 'mid', value: `${mid}` },
    ];
    if (hrs !== undefined) rows.push({ name: '本次耗时', value: `${hrs} 小时` });
    return rows;
  };

  emit(
    'init',
    { lo: 1, hi: BA_MAX },
    { groupMembers: range(0, BA_MAX - 1) },
    `数组没了也能二分！4 堆香蕉 [${BA_PILES.join(', ')}]，${BA_H} 小时内吃完的最小时速是多少？把候选答案排成一排——这 11 根柱子就是速度 1..${BA_MAX}。速度越快越可行（单调 ✗✗✗✓✓…），找「第一个可行」即可`,
    vt(1, BA_MAX, '—'),
  );

  for (const p of tr.probes) {
    const nlo = p.ok ? p.lo : p.mid + 1;
    const nhi = p.ok ? p.mid : p.hi;
    const detail = BA_PILES.map((pile) => `⌈${pile}/${p.mid}⌉=${Math.ceil(pile / p.mid)}`).join(
      ' + ',
    );
    emit(
      'probe',
      { lo: nlo, mid: p.mid, hi: nhi },
      { groupMembers: range(idx(nlo), idx(nhi)), pivotIndex: idx(p.mid) },
      `试速度 k=${p.mid}：${detail} = ${p.hours} 小时，${p.ok ? `≤ ${BA_H} 可行——但答案还能更小？收 hi = ${nhi}` : `> ${BA_H} 不可行——只能加速，lo = ${nlo}`}`,
      vt(nlo, nhi, p.mid, p.hours),
    );
  }

  emit(
    'settle',
    { lo: tr.result, hi: tr.result },
    { sortedIndices: [idx(tr.result)] },
    `lo 与 hi 在速度 ${tr.result} 相遇——最小可行时速 = ${tr.result}（恰好 ${BA_H} 小时吃完，再慢一档就是 10 小时超时）`,
    vt(tr.result, tr.result, '—'),
  );

  emit(
    'done',
    {},
    {},
    `二分答案三要素：答案空间有界（1..max）、可行性关于答案单调（快必更可行）、单点可行性可验（O(n) 算耗时）。分割数组最大值最小化、运载能力、木材切割……「最小化最大值/最大化最小值」一族全是它。查找大类四页收官：找值 → 找边界 → 断崖找值 → 找答案`,
    [{ name: '复杂度', value: 'O(n · log(答案空间))' }],
  );
  return steps;
}

export const banswerModule: AlgorithmModule<BaExecPoint> = {
  title: '二分答案（最小可行速度）',
  initialInput: () => range(1, BA_MAX),
  buildSteps: (input) => buildBanswerSteps(input),
  sources: banswerSources,
};
