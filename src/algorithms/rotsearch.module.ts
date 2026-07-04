import type {
  AlgorithmModule,
  Pointer,
  RsExecPoint,
  Step,
  VarRow,
} from '@/components/player/types';
import { ROT_ARRAY, RS_T1, RS_T2, rotTrace } from './rotsearch';
import { rotSearchSources } from './rotsearch.sources';

const ID_LO = '0'; // 红
const ID_MID = '1'; // 蓝
const ID_HI = '2'; // 黄

const range = (a: number, b: number): number[] => {
  const r: number[] = [];
  for (let i = a; i <= b; i++) r.push(i);
  return r;
};

/** 固定旋转数组上的两次判半二分逐探针重走，产出主柱轨胖步骤（断崖造型天然呈现）。 */
export function buildRotSearchSteps(input: number[]): Step<RsExecPoint>[] {
  const arr = [...input];
  const n = arr.length;
  const work: [string, number][] = arr.map((v, i) => [String(i), v]);
  const steps: Step<RsExecPoint>[] = [];

  const emit = (
    point: RsExecPoint,
    ptr: { lo?: number; mid?: number; hi?: number },
    emphasis: Step['emphasis'],
    caption: string,
    extra: VarRow[] = [],
  ): void => {
    const pointers: Pointer[] = [];
    if (ptr.lo !== undefined) pointers.push({ id: ID_LO, index: ptr.lo });
    if (ptr.mid !== undefined) pointers.push({ id: ID_MID, index: ptr.mid });
    if (ptr.hi !== undefined) pointers.push({ id: ID_HI, index: ptr.hi });
    steps.push({
      array: work.map((t) => [t[0], t[1]] as [string, number]),
      pointers,
      emphasis,
      vars: [{ name: '断崖', value: '17 ↘ 1（idx 2/3 之间）' }, ...extra],
      point,
      caption,
    });
  };

  const runTrial = (target: number, opening: string): void => {
    const tr = rotTrace(arr, target);
    const vt = (lo: number, hi: number, mid: number | string, half: string): VarRow[] => [
      { name: 'target', value: `${target}` },
      { name: '[lo, hi]', value: `[${lo}, ${hi}]` },
      { name: 'mid', value: `${mid}` },
      { name: '判半', value: half },
    ];

    emit(
      'init',
      { lo: 0, hi: n - 1 },
      { groupMembers: range(0, n - 1) },
      opening,
      vt(0, n - 1, '—', '—'),
    );

    for (const p of tr.probes) {
      const goLeft = p.sortedHalf === 'left' ? p.inSorted : !p.inSorted;
      const nlo = goLeft ? p.lo : p.mid + 1;
      const nhi = goLeft ? p.mid - 1 : p.hi;
      const halfTxt = p.sortedHalf === 'left' ? '左半有序' : '右半有序';
      const rangeTxt =
        p.sortedHalf === 'left' ? `[${arr[p.lo]}, ${p.val})` : `(${p.val}, ${arr[p.hi]}]`;
      emit(
        'probe',
        { lo: nlo, mid: p.mid, hi: nhi },
        { groupMembers: range(nlo, nhi), pivotIndex: p.mid },
        `mid=${p.mid}（值 ${p.val}）：${p.sortedHalf === 'left' ? `a[lo]=${arr[p.lo]} ≤ ${p.val} → 左半有序` : `a[lo]=${arr[p.lo]} > ${p.val} → 断崖在左、右半有序`}，其范围 ${rangeTxt}${p.inSorted ? ` 包含 ${target} → 进有序半` : ` 不含 ${target} → 去另一半`}，区间收到 [${nlo}, ${nhi}]`,
        vt(nlo, nhi, p.mid, halfTxt),
      );
    }

    const h = tr.hit!;
    emit(
      'found',
      { lo: h.lo, mid: h.mid, hi: h.hi },
      { groupMembers: range(h.lo, h.hi), sortedIndices: [h.mid] },
      `mid=${h.mid}：arr[${h.mid}] = ${target}——命中！共 ${tr.probes.length + 1} 次探测`,
      vt(h.lo, h.hi, h.mid, '—'),
    );
  };

  runTrial(
    RS_T1,
    `有序数组被旋转过：[1..17] 断成 [13,15,17 | 1,3,5,7,9,11]，柱形里那道「断崖」清晰可见。找 target = ${RS_T1}：关键引理——mid 切开的两半，至少一半完好有序`,
  );
  runTrial(RS_T2, `换 target = ${RS_T2}（在断崖左侧的高段）：这次有序半不含目标，直接整半排除`);

  emit(
    'done',
    {},
    {},
    `判半二分：每探先认出完好有序的一半（比较 a[lo] 与 a[mid]），用它的范围决定去留——每步仍扔一半，O(log n)。注意含重复元素时 a[lo]==a[mid] 无法判半，最坏退化 O(n)`,
    [{ name: '复杂度', value: 'O(log n)（无重复）' }],
  );
  return steps;
}

export const rotSearchModule: AlgorithmModule<RsExecPoint> = {
  title: '旋转数组搜索',
  initialInput: () => [...ROT_ARRAY],
  buildSteps: (input) => buildRotSearchSteps(input),
  sources: rotSearchSources,
};
