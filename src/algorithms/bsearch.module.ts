import type {
  AlgorithmModule,
  BsExecPoint,
  Pointer,
  Step,
  VarRow,
} from '@/components/player/types';
import { BS_HIT, BS_MISS, BS_ARRAY, bsearchTrace } from './bsearch';
import { bsearchSources } from './bsearch.sources';

const ID_LO = '0'; // 红
const ID_MID = '1'; // 蓝
const ID_HI = '2'; // 黄

const range = (a: number, b: number): number[] => {
  const r: number[] = [];
  for (let i = a; i <= b; i++) r.push(i);
  return r;
};

/** 固定有序数组上的两次二分（命中 17 / 未命中 4）逐探针重走，产出主柱轨胖步骤。
 *  groupMembers=候选区间（区间外淡出）、pivotIndex=mid 探针、sortedIndices=命中。 */
export function buildBsearchSteps(input: number[]): Step<BsExecPoint>[] {
  const arr = [...input];
  const n = arr.length;
  const work: [string, number][] = arr.map((v, i) => [String(i), v]);
  const steps: Step<BsExecPoint>[] = [];

  const emit = (
    point: BsExecPoint,
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
      vars: [{ name: 'n', value: `${n}` }, ...extra],
      point,
      caption,
    });
  };

  const runTrial = (target: number, label: string, opening: string): void => {
    const tr = bsearchTrace(arr, target);
    const vt = (lo: number | string, hi: number | string, mid: number | string): VarRow[] => [
      { name: 'target', value: `${target}` },
      { name: '[lo, hi]', value: `[${lo}, ${hi}]` },
      { name: 'mid', value: `${mid}` },
    ];

    emit(
      'init',
      { lo: 0, hi: n - 1 },
      { groupMembers: range(0, n - 1) },
      opening,
      vt(0, n - 1, '—'),
    );

    tr.probes.forEach((p) => {
      emit(
        'mid',
        { lo: p.lo, mid: p.mid, hi: p.hi },
        { groupMembers: range(p.lo, p.hi), pivotIndex: p.mid },
        `${label}探针：mid = (${p.lo}+${p.hi})>>1 = ${p.mid}，arr[${p.mid}] = ${p.val} ${p.cmp === '=' ? '=' : p.cmp === '<' ? '<' : '>'} ${target}`,
        vt(p.lo, p.hi, p.mid),
      );

      if (p.cmp === '=') {
        emit(
          'found',
          { lo: p.lo, mid: p.mid, hi: p.hi },
          { groupMembers: range(p.lo, p.hi), sortedIndices: [p.mid] },
          `命中！target = ${target} 在下标 ${p.mid}，共 ${tr.probes.length} 次比较——log₂${n} ≈ ${Math.log2(n).toFixed(1)}，每次比较都扔掉一半`,
          vt(p.lo, p.hi, p.mid),
        );
      } else {
        const nlo = p.cmp === '<' ? p.mid + 1 : p.lo;
        const nhi = p.cmp === '<' ? p.hi : p.mid - 1;
        const side = p.cmp === '<' ? '右' : '左';
        const emptied = nlo > nhi;
        emit(
          'cut',
          { lo: nlo, hi: Math.max(nhi, 0) },
          { groupMembers: emptied ? [] : range(nlo, nhi) },
          `${p.val} ${p.cmp} ${target} → 目标只可能在${side}半，${p.cmp === '<' ? `lo = mid+1 = ${nlo}` : `hi = mid−1 = ${nhi}`}${emptied ? `——区间 [${nlo}, ${nhi}] 已清空！` : `，一步扔掉 ${p.cmp === '<' ? p.mid - p.lo + 1 : p.hi - p.mid + 1} 个候选`}`,
          vt(nlo, nhi, '—'),
        );
      }
    });

    if (!tr.found) {
      emit(
        'empty',
        {},
        { groupMembers: [] },
        `lo = ${tr.finalLo} > hi = ${tr.finalHi}，循环条件不再成立：${target} 不存在，返回 -1。整个数组没有一个格子被冤枉——被扔掉的半区都证明过不可能`,
        vt(tr.finalLo, tr.finalHi, '—'),
      );
    }
  };

  runTrial(
    BS_HIT,
    '',
    `前提：数组有序。找 target = ${BS_HIT}：候选区间 [lo, hi] = [0, ${n - 1}]（高亮部分），每次和中点比、扔掉不可能的一半`,
  );
  runTrial(BS_MISS, '', `换个目标 target = ${BS_MISS}——看「不存在」怎么收场：区间会一路收缩到清空`);

  emit(
    'done',
    {},
    {},
    `二分查找 O(log n)：10 亿元素最多 30 次比较。写法上取中点用 lo + ((hi − lo) >> 1) 防溢出；变体才是重头戏——找左右边界（lower/upper bound）、旋转数组、在答案空间上二分，都是本大类后面的故事`,
    [{ name: '复杂度', value: 'O(log n)' }],
  );
  return steps;
}

export const bsearchModule: AlgorithmModule<BsExecPoint> = {
  title: '二分查找',
  initialInput: () => [...BS_ARRAY],
  buildSteps: (input) => buildBsearchSteps(input),
  sources: bsearchSources,
};
