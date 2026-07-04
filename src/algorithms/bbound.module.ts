import type {
  AlgorithmModule,
  BbExecPoint,
  Pointer,
  Step,
  VarRow,
} from '@/components/player/types';
import { BB_ARRAY, BB_T, boundTrace } from './bbound';
import { bboundSources } from './bbound.sources';

const ID_LO = '0'; // 红
const ID_MID = '1'; // 蓝
const ID_HI = '2'; // 黄

const range = (a: number, b: number): number[] => {
  const r: number[] = [];
  for (let i = a; i < b; i++) r.push(i); // 半开 [a, b)
  return r;
};

/** 固定含重复数组上的 lower/upper bound 两阶段逐探针重走，产出主柱轨胖步骤。
 *  groupMembers=[lo,hi) 半开候选、pivotIndex=探针、settle/range 用 sortedIndices。 */
export function buildBboundSteps(input: number[]): Step<BbExecPoint>[] {
  const arr = [...input];
  const n = arr.length;
  const work: [string, number][] = arr.map((v, i) => [String(i), v]);
  const steps: Step<BbExecPoint>[] = [];

  const emit = (
    point: BbExecPoint,
    ptr: { lo?: number; mid?: number; hi?: number },
    emphasis: Step['emphasis'],
    caption: string,
    extra: VarRow[] = [],
  ): void => {
    const pointers: Pointer[] = [];
    if (ptr.lo !== undefined && ptr.lo < n) pointers.push({ id: ID_LO, index: ptr.lo });
    if (ptr.mid !== undefined) pointers.push({ id: ID_MID, index: ptr.mid });
    if (ptr.hi !== undefined && ptr.hi < n) pointers.push({ id: ID_HI, index: ptr.hi }); // hi=n 哨兵位不画
    steps.push({
      array: work.map((t) => [t[0], t[1]] as [string, number]),
      pointers,
      emphasis,
      vars: [{ name: 'target', value: `${BB_T}` }, ...extra],
      point,
      caption,
    });
  };

  const runPhase = (kind: 'lower' | 'upper', opening: string): number => {
    const tr = boundTrace(arr, BB_T, kind);
    const label = kind === 'lower' ? 'lower_bound' : 'upper_bound';
    const rel = kind === 'lower' ? '≥' : '>';
    const vt = (lo: number, hi: number, mid: number | string): VarRow[] => [
      { name: '阶段', value: label },
      { name: '[lo, hi)', value: `[${lo}, ${hi})${hi === n ? '（hi=n 哨兵）' : ''}` },
      { name: 'mid', value: `${mid}` },
    ];

    emit('init', { lo: 0, hi: n }, { groupMembers: range(0, n) }, opening, vt(0, n, '—'));

    tr.probes.forEach((p) => {
      const nlo = p.goRight ? p.mid + 1 : p.lo;
      const nhi = p.goRight ? p.hi : p.mid;
      const cmpTxt =
        kind === 'lower'
          ? p.goRight
            ? `${p.val} < ${BB_T}`
            : `${p.val} ≥ ${BB_T}`
          : p.goRight
            ? `${p.val} ≤ ${BB_T}`
            : `${p.val} > ${BB_T}`;
      emit(
        'probe',
        { lo: nlo, mid: p.mid, hi: nhi },
        { groupMembers: range(nlo, nhi), pivotIndex: p.mid },
        `${label} 探针 mid=${p.mid}：${cmpTxt} → ${p.goRight ? `答案在右，lo = mid+1 = ${nlo}` : `mid 可能就是答案（只收 hi），hi = mid = ${nhi}`}`,
        vt(nlo, nhi, p.mid),
      );
    });

    emit(
      'settle',
      { lo: tr.result, hi: tr.result },
      { sortedIndices: [tr.result] },
      `lo 与 hi 在 ${tr.result} 相遇——${label} = ${tr.result}：第一个 ${rel} ${BB_T} 的位置${kind === 'lower' ? `（arr[1]=2 正是首个 2）` : `（arr[4]=3 是第一个越过 2 的）`}`,
      vt(tr.result, tr.result, '—'),
    );
    return tr.result;
  };

  const lb = runPhase(
    'lower',
    `含重复的有序数组里找 target = ${BB_T} 的「地盘」。先求 lower_bound：第一个 ≥ ${BB_T} 的位置。半开区间 [lo, hi) 起手 [0, ${n})——hi 是数组外的哨兵位，黄箭头暂不出场`,
  );
  const ub = runPhase(
    'upper',
    `再求 upper_bound：第一个 > ${BB_T} 的位置。同一模板只把比较从 < 换成 ≤——mid 等于 target 时也往右走`,
  );

  emit(
    'range',
    { lo: lb, hi: ub - 1 },
    { sortedIndices: range(lb, ub) },
    `两界合拢：等值区间 [${lb}, ${ub})——三个 ${BB_T} 全部点亮，个数 = ub − lb = ${ub - lb}`,
    [
      { name: 'lower', value: `${lb}` },
      { name: 'upper', value: `${ub}` },
      { name: 'count', value: `${ub - lb}` },
    ],
  );

  emit(
    'done',
    {},
    {},
    `边界模板 while (lo < hi) 只有两分支、无 found/−1 特判：不存在时 lb == ub、count = 0，优雅退化。个数 = ub − lb，两次 O(log n)。C++ 的 lower_bound/equal_range、各语言 bisect 都是它`,
    [{ name: '复杂度', value: '2 × O(log n)' }],
  );
  return steps;
}

export const bboundModule: AlgorithmModule<BbExecPoint> = {
  title: '二分边界（lower / upper bound）',
  initialInput: () => [...BB_ARRAY],
  buildSteps: (input) => buildBboundSteps(input),
  sources: bboundSources,
};
