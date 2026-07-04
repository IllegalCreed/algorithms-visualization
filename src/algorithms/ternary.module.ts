import type {
  AlgorithmModule,
  Pointer,
  Step,
  TerExecPoint,
  VarRow,
} from '@/components/player/types';
import { TER_ARRAY, terTrace } from './ternary';
import { ternarySources } from './ternary.sources';

const ID_LO = '0'; // 红
const ID_M1 = '1'; // 蓝
const ID_M2 = '2'; // 黄
const ID_HI = '3'; // 绿

const range = (a: number, b: number): number[] => {
  const r: number[] = [];
  for (let i = a; i <= b; i++) r.push(i);
  return r;
};

/** 固定单峰数组三分查找逐探针重走，产出主柱轨胖步骤——
 *  双探针 m1/m2 对决（comparing 高亮），谁小丢谁外侧 1/3。 */
export function buildTernarySteps(input: number[]): Step<TerExecPoint>[] {
  const arr = [...input];
  const n = arr.length;
  const work: [string, number][] = arr.map((v, i) => [String(i), v]);
  const steps: Step<TerExecPoint>[] = [];

  const emit = (
    point: TerExecPoint,
    ptr: { lo?: number; m1?: number; m2?: number; hi?: number },
    emphasis: Step['emphasis'],
    caption: string,
    extra: VarRow[] = [],
  ): void => {
    const pointers: Pointer[] = [];
    if (ptr.lo !== undefined) pointers.push({ id: ID_LO, index: ptr.lo });
    if (ptr.m1 !== undefined) pointers.push({ id: ID_M1, index: ptr.m1 });
    if (ptr.m2 !== undefined) pointers.push({ id: ID_M2, index: ptr.m2 });
    if (ptr.hi !== undefined) pointers.push({ id: ID_HI, index: ptr.hi });
    steps.push({
      array: work.map((t) => [t[0], t[1]] as [string, number]),
      pointers,
      emphasis,
      vars: [{ name: '形状', value: '单峰（先升后降）' }, ...extra],
      point,
      caption,
    });
  };

  const tr = terTrace(arr);
  const vt = (lo: number, hi: number, m1: number | string, m2: number | string): VarRow[] => [
    { name: '[lo, hi]', value: `[${lo}, ${hi}]` },
    { name: 'm1 / m2', value: `${m1} / ${m2}` },
    {
      name: '候选数',
      value: `${typeof lo === 'number' && typeof hi === 'number' ? hi - lo + 1 : '—'}`,
    },
  ];

  emit(
    'init',
    { lo: 0, hi: n - 1 },
    { groupMembers: range(0, n - 1) },
    `单峰数组：一路爬升到峰顶再一路下降。二分在这儿失灵——只看 a[mid] 不知道自己在上坡还是下坡。三分的答案：放两个探针制造方向感`,
    vt(0, n - 1, '—', '—'),
  );

  for (const p of tr.probes) {
    const nlo = p.dropRight ? p.lo : p.m1 + 1;
    const nhi = p.dropRight ? p.m2 - 1 : p.hi;
    emit(
      'probe',
      { lo: nlo, m1: p.m1, m2: p.m2, hi: nhi },
      { groupMembers: range(nlo, nhi), comparing: [p.m1, p.m2] },
      `双探针对决：a[${p.m1}]=${p.v1} vs a[${p.m2}]=${p.v2}——${p.dropRight ? `左边不小于右边，峰不可能在 m2 右侧，丢掉右侧 1/3（hi = ${nhi}）` : `右边更大，峰不可能在 m1 左侧，丢掉左侧 1/3（lo = ${nlo}）`}`,
      vt(nlo, nhi, p.m1, p.m2),
    );
  }

  emit(
    'peak',
    { lo: tr.result, hi: tr.result },
    { sortedIndices: [tr.result] },
    `lo 与 hi 相遇——峰顶在下标 ${tr.result}，值 ${arr[tr.result]}（12）。每轮丢 1/3、区间变 2/3，四轮登顶`,
    vt(tr.result, tr.result, '—', '—'),
  );

  emit(
    'done',
    {},
    {},
    `三分查找 O(log₍₃⁄₂₎ n)。同族变体：坡度二分（比较 a[mid] 与 a[mid+1]，上坡去右、下坡去左，回到 log₂ n）；实数域三分求凸函数极值（固定轮数收敛到 ε）。查找大类五页齐：找值、找边界、断崖找值、找答案、找峰`,
    [{ name: '复杂度', value: 'O(log n)' }],
  );
  return steps;
}

export const ternaryModule: AlgorithmModule<TerExecPoint> = {
  title: '三分查找（单峰极值）',
  initialInput: () => [...TER_ARRAY],
  buildSteps: (input) => buildTernarySteps(input),
  sources: ternarySources,
};
