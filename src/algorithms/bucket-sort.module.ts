import type { AlgorithmModule, BucketExecPoint, Step, VarRow } from '@/components/player/types';
import { bucketSortSources } from './bucket-sort.sources';

const BUCKET_COUNT = 5;
const BUCKET_WIDTH = 10;
const RANGES: [number, number][] = [
  [0, 9],
  [10, 19],
  [20, 29],
  [30, 39],
  [40, 49],
];
// 按值域分桶：值 v → 桶 ⌊v/10⌋（封顶第 4 桶，吸收 ≥40）
const bucketOf = (v: number) => Math.min(Math.floor(v / BUCKET_WIDTH), BUCKET_COUNT - 1);
const label = (b: number) => `${RANGES[b][0]}–${RANGES[b][1]}`;

export function buildBucketSortSteps(input: number[]): Step<BucketExecPoint>[] {
  const steps: Step<BucketExecPoint>[] = [];
  const work: [string, number][] = input.map((v, i) => [String(i), v]); // 位置键稳定
  const n = work.length;
  const buckets: number[][] = Array.from({ length: BUCKET_COUNT }, () => []);

  const snap = () => work.map((t) => [t[0], t[1]] as [string, number]);
  const bsnap = () => buckets.map((b) => [...b]); // 桶轨深快照
  const vars = (phase: string, extra: VarRow[]): VarRow[] => [
    { name: 'n', value: n },
    { name: '阶段', value: phase },
    ...extra,
  ];

  // ① 分配：依序读 work[i]，按值域入对应桶（每元素一步）
  for (let i = 0; i < n; i++) {
    const v = work[i][1];
    const b = bucketOf(v);
    buckets[b].push(v);
    steps.push({
      array: snap(),
      pointers: [{ id: '1', index: i }], // 蓝读游标
      emphasis: {},
      vars: vars('分配', [
        { name: 'i', value: i },
        { name: 'v', value: v },
        { name: '桶', value: label(b) },
      ]),
      point: 'distribute',
      bucket: { buckets: bsnap(), ranges: RANGES, activeBucket: b },
      caption: `读 a[${i}]=${v}，⌊${v}/10⌋=${b} → 入桶「${label(b)}」`,
    });
  }

  // ② 桶内排序：每桶各自升序（每桶一步）
  for (let b = 0; b < BUCKET_COUNT; b++) {
    buckets[b].sort((x, y) => x - y);
    steps.push({
      array: snap(),
      pointers: [],
      emphasis: {},
      vars: vars('桶内排序', [
        { name: '桶', value: label(b) },
        { name: '元素数', value: buckets[b].length },
      ]),
      point: 'sortBucket',
      bucket: { buckets: bsnap(), ranges: RANGES, activeBucket: b },
      caption: buckets[b].length
        ? `桶「${label(b)}」桶内排序 → [${buckets[b].join(', ')}]`
        : `桶「${label(b)}」为空，跳过`,
    });
  }

  // ③ 合并：按桶 0→4、桶内顺序取出回写主数组（每元素一步）
  let w = 0;
  for (let b = 0; b < BUCKET_COUNT; b++) {
    while (buckets[b].length) {
      const v = buckets[b].shift()!;
      work[w][1] = v;
      steps.push({
        array: snap(),
        pointers: [{ id: '3', index: w }], // 绿写游标
        emphasis: { sortedUpTo: w + 1 },
        vars: vars('合并', [
          { name: 'w', value: w },
          { name: '桶', value: label(b) },
        ]),
        point: 'concat',
        bucket: { buckets: bsnap(), ranges: RANGES, activeBucket: b },
        caption: `桶「${label(b)}」取出 ${v} → a[${w}]=${v}`,
      });
      w++;
    }
  }

  // ④ 完成
  steps.push({
    array: snap(),
    pointers: [],
    emphasis: { sortedUpTo: n },
    vars: vars('完成', []),
    point: 'done',
    bucket: { buckets: bsnap(), ranges: RANGES },
    caption: `分配 → 桶内排序 → 合并完毕，全部有序`,
  });
  return steps;
}

export const bucketSortModule: AlgorithmModule<BucketExecPoint> = {
  title: '桶排序',
  initialInput: () => [29, 25, 3, 49, 9, 37, 21, 43],
  buildSteps: buildBucketSortSteps,
  sources: bucketSortSources,
};
