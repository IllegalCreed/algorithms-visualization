import type {
  AlgorithmModule,
  LcpExecPoint,
  Step,
  SuffixArrayTrack,
  VarRow,
} from '@/components/player/types';
import { SA_STR, suffixArray } from './suffixarray';
import { saRank } from './lcparray';
import { lcpArraySources } from './lcparray.sources';

/** 固定 "banana"（复用 C-072 sa）LCP/height 数组 Kasai 逐原始下标重走，产出后缀轨 LCP 模式胖步骤。
 *  按原始下标 i 顺序处理，维护 h（去首字符至多减 1），逐格填 lcp[rank[i]]，LCP 列非顺序填充。 */
export function buildLcpSteps(): Step<LcpExecPoint>[] {
  const s = SA_STR;
  const n = s.length;
  const sa = suffixArray();
  const rank = saRank();
  const lcp: (number | null)[] = new Array<number | null>(n).fill(null);
  lcp[0] = 0; // 排序第 0 的后缀无前驱，LCP 记 0（视图行首显示 '-'）

  const steps: Step<LcpExecPoint>[] = [];
  let done = false;

  const vars = (i: number | null, h: number): VarRow[] => [
    { name: '原串', value: s },
    { name: 'sa', value: `[${sa.join(',')}]` },
    { name: '当前后缀 i', value: i == null ? '-' : `${i}（"${s.slice(i)}"）` },
    { name: 'h', value: `${h}` },
  ];
  const emit = (
    point: LcpExecPoint,
    current: number | null,
    compareRow: number | null,
    i: number | null,
    h: number,
    caption: string,
  ): void => {
    const suffixArray: SuffixArrayTrack = {
      s,
      k: 0,
      order: [...sa],
      rank: [...rank],
      lcp: [...lcp],
      current,
      compareRow,
      done,
    };
    steps.push({
      array: [],
      pointers: [],
      emphasis: {},
      vars: vars(i, h),
      point,
      suffixArray,
      caption,
    });
  };

  emit(
    'init',
    null,
    null,
    null,
    0,
    `后缀已按字典序排好（sa）；现在自上而下算每对相邻后缀的最长公共前缀 LCP，用 Kasai 只需 O(n)`,
  );

  let h = 0;
  for (let i = 0; i < n; i++) {
    if (rank[i] > 0) {
      const j = sa[rank[i] - 1];
      const hBefore = h;
      while (i + h < n && j + h < n && s[i + h] === s[j + h]) h++;
      lcp[rank[i]] = h;
      emit(
        'fill',
        rank[i],
        rank[i] - 1,
        i,
        h,
        `后缀 ${i}（"${s.slice(i)}"）排第 ${rank[i]}：与排序前驱后缀 ${j}（"${s.slice(j)}"）比，h 从上轮的 ${hBefore} 起扩到 ${h} → lcp[${rank[i]}]=${h}（去首字符 h 至多减 1，字符不重复比）`,
      );
      if (h > 0) h--;
    } else {
      h = 0;
      emit(
        'skip',
        0,
        null,
        i,
        0,
        `后缀 ${i}（"${s.slice(i)}"）排第 0（字典序最小），没有排序前驱 → 跳过，h 归 0`,
      );
    }
  }

  done = true;
  const maxLcp = Math.max(...lcp.map((v) => v ?? 0));
  const sumLcp = lcp.reduce<number>((a, v) => a + (v ?? 0), 0);
  const distinct = (n * (n + 1)) / 2 - sumLcp;
  emit(
    'done',
    null,
    null,
    null,
    h,
    `LCP 数组算完：最长重复子串长 = max(lcp) = ${maxLcp}；本质不同子串数 = n(n+1)/2 − Σlcp = ${(n * (n + 1)) / 2} − ${sumLcp} = ${distinct}`,
  );
  return steps;
}

export const lcpArrayModule: AlgorithmModule<LcpExecPoint> = {
  title: 'LCP / height 数组',
  initialInput: () => [],
  buildSteps: () => buildLcpSteps(),
  sources: lcpArraySources,
};
