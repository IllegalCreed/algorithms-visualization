import type { AlgorithmModule, RadixExecPoint, Step, VarRow } from '@/components/player/types';
import { radixSortSources } from './radix-sort.sources';

const DASH = '-';
const DIGIT_NAME = ['个', '十', '百', '千', '万'];

export function buildRadixSortSteps(input: number[]): Step<RadixExecPoint>[] {
  const steps: Step<RadixExecPoint>[] = [];
  const work: [string, number][] = input.map((v, i) => [String(i), v]); // 位置键稳定
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

  const maxVal = Math.max(...work.map((t) => t[1]));
  const passes = String(maxVal).length;
  const posName = (d: number) => (DIGIT_NAME[d] ?? `第${d + 1}`) + '位';

  const vars = (d: number, phase: string, i: number | string, w: number | string): VarRow[] => [
    { name: 'n', value: n },
    { name: '轮', value: `${d + 1}/${passes}` },
    { name: '位', value: posName(d) },
    { name: '阶段', value: phase },
    { name: 'i', value: i },
    { name: 'w', value: w },
  ];

  for (let d = 0; d < passes; d++) {
    const div = 10 ** d;
    const buckets: number[][] = Array.from({ length: 10 }, () => []);

    // 本轮开始：宣布按哪一位、10 桶清零
    steps.push({
      array: snap(),
      pointers: [],
      emphasis: {},
      vars: vars(d, '开始', DASH, DASH),
      point: 'passStart',
      count: { min: 0, buckets: buckets.map((b) => b.length) },
      caption: `第 ${d + 1} 轮：按${posName(d)}把 ${n} 个数分配到 0–9 共 10 个桶`,
    });

    // 分配：依序读，按当前位入对应桶（稳定）
    for (let i = 0; i < n; i++) {
      const v = work[i][1];
      const digit = Math.floor(v / div) % 10;
      buckets[digit].push(v);
      steps.push({
        array: snap(),
        pointers: [{ id: '1', index: i }], // 蓝读游标
        emphasis: {},
        vars: vars(d, '分配', i, DASH),
        point: 'distribute',
        count: { min: 0, buckets: buckets.map((b) => b.length), activeBucket: digit },
        caption: `读 a[${i}]=${v}，${posName(d)}=${digit} → 入桶「${digit}」`,
      });
    }

    // 收集：按桶 0→9、桶内顺序倒回主数组
    const remaining = buckets.map((b) => b.length);
    let w = 0;
    for (let b = 0; b < 10; b++) {
      for (const v of buckets[b]) {
        work[w][1] = v;
        remaining[b]--;
        steps.push({
          array: snap(),
          pointers: [{ id: '3', index: w }], // 绿写游标
          emphasis: {},
          vars: vars(d, '收集', DASH, w),
          point: 'collect',
          count: { min: 0, buckets: [...remaining], activeBucket: b },
          caption: `桶「${b}」倒出 ${v} → a[${w}]=${v}`,
        });
        w++;
      }
    }
  }

  steps.push({
    array: snap(),
    pointers: [],
    emphasis: { sortedUpTo: n },
    vars: vars(passes - 1, '完成', DASH, DASH),
    point: 'done',
    count: { min: 0, buckets: new Array<number>(10).fill(0) },
    caption: `${passes} 轮分配收集完毕，全部有序`,
  });
  return steps;
}

export const radixSortModule: AlgorithmModule<RadixExecPoint> = {
  title: '基数排序',
  initialInput: () => [42, 7, 25, 63, 18, 31, 56, 9],
  buildSteps: buildRadixSortSteps,
  sources: radixSortSources,
};
