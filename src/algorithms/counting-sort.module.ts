import type { AlgorithmModule, CountingExecPoint, Step, VarRow } from '@/components/player/types';
import { countingSortSources } from './counting-sort.sources';

const DASH = '-';

export function buildCountingSortSteps(input: number[]): Step<CountingExecPoint>[] {
  const steps: Step<CountingExecPoint>[] = [];
  const work: [string, number][] = input.map((v, i) => [String(i), v]);
  const n = work.length;
  const snap = () => work.map((t) => [t[0], t[1]] as [string, number]);

  if (n === 0) {
    steps.push({
      array: [],
      pointers: [],
      emphasis: { sortedUpTo: 0 },
      vars: [
        { name: 'n', value: 0 },
        { name: '阶段', value: '完成' },
      ],
      point: 'done',
      count: { min: 0, buckets: [] },
      caption: '空数组，已完成',
    });
    return steps;
  }

  const min = Math.min(...work.map((t) => t[1]));
  const max = Math.max(...work.map((t) => t[1]));
  const k = max - min + 1;
  const buckets = new Array<number>(k).fill(0);

  const vars = (
    phase: string,
    i: number | string,
    v: number | string,
    w: number | string,
  ): VarRow[] => [
    { name: 'n', value: n },
    { name: 'min', value: min },
    { name: 'max', value: max },
    { name: 'k', value: k },
    { name: '阶段', value: phase },
    { name: 'i', value: i },
    { name: 'v', value: v },
    { name: 'w', value: w },
  ];

  // 计数阶段：读 a[i]，对应桶 +1（主轨柱不动、零比较）
  for (let i = 0; i < n; i++) {
    const b = work[i][1] - min;
    buckets[b]++;
    steps.push({
      array: snap(),
      pointers: [{ id: '1', index: i }], // 蓝读游标
      emphasis: {},
      vars: vars('计数', i, DASH, DASH),
      point: 'count',
      count: { min, buckets: [...buckets], activeBucket: b },
      caption: `读 a[${i}]=${work[i][1]} → 桶「${work[i][1]}」+1（现 ${buckets[b]} 颗）`,
    });
  }

  // 回写阶段：按值域走桶，倒出写回主数组
  let w = 0;
  for (let b = 0; b < k; b++) {
    steps.push({
      array: snap(),
      pointers: [{ id: '3', index: w }], // 绿写游标停在下一写入位
      emphasis: { sortedUpTo: w, dimFrom: w },
      vars: vars('回写', DASH, b + min, w),
      point: 'bucketStart',
      count: { min, buckets: [...buckets], activeBucket: b },
      caption:
        buckets[b] > 0
          ? `走到桶「${b + min}」，里面有 ${buckets[b]} 颗 → 依次倒回数组`
          : `走到桶「${b + min}」，空桶（0 颗）→ 跳过`,
    });
    while (buckets[b] > 0) {
      work[w][1] = b + min;
      buckets[b]--;
      w++;
      steps.push({
        array: snap(),
        pointers: [{ id: '3', index: w - 1 }], // 写游标落在刚写的活跃格
        emphasis: { sortedUpTo: w - 1, dimFrom: w }, // 活跃格 w-1 不提前转绿
        vars: vars('回写', DASH, b + min, w),
        point: 'writeBack',
        count: { min, buckets: [...buckets], activeBucket: b },
        caption: `桶「${b + min}」倒出一颗 → a[${w - 1}]=${b + min}；桶「${b + min}」剩 ${buckets[b]} 颗`,
      });
    }
  }

  steps.push({
    array: snap(),
    pointers: [],
    emphasis: { sortedUpTo: n },
    vars: vars('完成', DASH, DASH, DASH),
    point: 'done',
    count: { min, buckets: [...buckets], activeBucket: undefined },
    caption: '回写完毕，全部有序',
  });
  return steps;
}

export const countingSortModule: AlgorithmModule<CountingExecPoint> = {
  title: '计数排序',
  initialInput: () => [3, 1, 4, 1, 6, 2, 3, 6, 4, 1],
  buildSteps: buildCountingSortSteps,
  sources: countingSortSources,
};
