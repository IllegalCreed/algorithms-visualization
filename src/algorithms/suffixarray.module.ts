import type {
  AlgorithmModule,
  Step,
  SuffixArrayExecPoint,
  SuffixArrayTrack,
  VarRow,
} from '@/components/player/types';
import { SA_STR, charRanks } from './suffixarray';
import { suffixArraySources } from './suffixarray.sources';

/** 固定 "banana" 后缀数组倍增法逐轮重走，产出后缀轨胖步骤（新建 SuffixArrayView，第 15 轨）。
 *  init 按首字符定 rank + 排序；每轮 sort（按 (rank[i],rank[i+k]) 重排）+ rank（重编 0 基 rank、k 翻倍），rank 全不同即收敛。 */
export function buildSuffixArraySteps(): Step<SuffixArrayExecPoint>[] {
  const s = SA_STR;
  const n = s.length;
  let rank = charRanks(); // 0 基首字符 rank
  let order = [...Array(n).keys()];

  const steps: Step<SuffixArrayExecPoint>[] = [];
  const key = (i: number, k: number): [number, number] => [rank[i], i + k < n ? rank[i + k] : -1];
  const vars = (k: number): VarRow[] => [
    { name: '原串', value: s },
    { name: '倍增长度 k', value: `${k}` },
    { name: 'sa', value: `[${order.join(',')}]` },
  ];
  const emit = (
    point: SuffixArrayExecPoint,
    k: number,
    phase: SuffixArrayTrack['phase'],
    done: boolean,
    caption: string,
  ): void => {
    const suffixArray: SuffixArrayTrack = {
      s,
      k,
      order: [...order],
      rank: [...rank],
      phase,
      done,
    };
    steps.push({
      array: [],
      pointers: [],
      emphasis: {},
      vars: vars(k),
      point,
      suffixArray,
      caption,
    });
  };

  order.sort((a, b) => rank[a] - rank[b]); // 先按首字符
  emit(
    'init',
    1,
    null,
    false,
    `列出所有后缀，按首字符给每个后缀定初始 rank（a=0,b=1,n=2），据此排出初步顺序`,
  );

  let k = 1;
  for (;;) {
    order = [...order].sort((a, b) => {
      const ka = key(a, k);
      const kb = key(b, k);
      return ka[0] - kb[0] || ka[1] - kb[1];
    });
    emit(
      'sort',
      k,
      'sort',
      false,
      `倍增到长度 ${2 * k}：按关键字 (rank[i], rank[i+${k}]) 稳定重排后缀（越界记 ∞）`,
    );

    const nr = new Array<number>(n).fill(0);
    for (let x = 1; x < n; x++) {
      const kp = key(order[x - 1], k);
      const kq = key(order[x], k);
      nr[order[x]] = nr[order[x - 1]] + (kp[0] !== kq[0] || kp[1] !== kq[1] ? 1 : 0);
    }
    rank = nr;
    emit('rank', k, 'rank', false, `按相邻关键字是否相等，重编 0 基 rank；比较长度已达 ${2 * k}`);

    if (rank[order[n - 1]] === n - 1) break; // rank 全不同 → 收敛
    k *= 2;
  }

  emit('done', k, null, true, `所有后缀 rank 互不相同 → 后缀数组定型：sa = [${order.join(',')}]`);
  return steps;
}

export const suffixArrayModule: AlgorithmModule<SuffixArrayExecPoint> = {
  title: '后缀数组',
  initialInput: () => [],
  buildSteps: () => buildSuffixArraySteps(),
  sources: suffixArraySources,
};
