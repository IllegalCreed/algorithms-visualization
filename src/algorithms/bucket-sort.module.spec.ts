// src/algorithms/bucket-sort.module.spec.ts
import { describe, it, expect } from 'vitest';
import { buildBucketSortSteps, bucketSortModule } from './bucket-sort.module';
import { bucketSortTrace } from './bucket-sort';
import type { BucketExecPoint } from '@/components/player/types';

const BASE = [29, 25, 3, 49, 9, 37, 21, 43];
const vals = (s: { array: [string, number][] }) => s.array.map((t) => t[1]);
const keys = (s: { array: [string, number][] }) => s.array.map((t) => t[0]);

describe('bucket-sort.module', () => {
  it('TC-BUCKET-MOD-01 末步 done 且值序列 = oracle 结果（有序）', () => {
    const steps = buildBucketSortSteps(BASE);
    const last = steps[steps.length - 1];
    expect(last.point).toBe('done');
    expect(vals(last)).toEqual(bucketSortTrace(BASE).result);
    expect(vals(last)).toEqual([3, 9, 21, 25, 29, 37, 43, 49]);
  });

  it('TC-BUCKET-MOD-02 不改入参', () => {
    buildBucketSortSteps(BASE);
    expect(BASE).toEqual([29, 25, 3, 49, 9, 37, 21, 43]);
  });

  it('TC-BUCKET-MOD-03 每步 array 位置键集合恒为 0..7', () => {
    const steps = buildBucketSortSteps(BASE);
    for (const s of steps) {
      expect([...keys(s)].sort()).toEqual(['0', '1', '2', '3', '4', '5', '6', '7']);
    }
  });

  it('TC-BUCKET-MOD-04 每步执行点合法且携带 bucket 桶轨', () => {
    const ok = new Set<BucketExecPoint>(['distribute', 'sortBucket', 'concat', 'done']);
    for (const s of buildBucketSortSteps(BASE)) {
      expect(ok.has(s.point)).toBe(true);
      expect(s.bucket).toBeDefined();
    }
  });

  it('TC-BUCKET-MOD-05 步数结构 distribute8/sortBucket5/concat8/done1（共 22）', () => {
    const steps = buildBucketSortSteps(BASE);
    const cnt = (p: BucketExecPoint) => steps.filter((s) => s.point === p).length;
    expect(cnt('distribute')).toBe(8);
    expect(cnt('sortBucket')).toBe(5);
    expect(cnt('concat')).toBe(8);
    expect(cnt('done')).toBe(1);
    expect(steps).toHaveLength(22);
  });

  it('TC-BUCKET-MOD-06 分配完成（末个 distribute 步）桶状态正确', () => {
    const steps = buildBucketSortSteps(BASE);
    const dist = steps.filter((s) => s.point === 'distribute');
    const lastDist = dist[dist.length - 1];
    expect(lastDist.bucket!.buckets[0]).toEqual([3, 9]);
    expect(lastDist.bucket!.buckets[1]).toEqual([]);
    expect(lastDist.bucket!.buckets[2]).toEqual([29, 25, 21]);
    expect(lastDist.bucket!.buckets[3]).toEqual([37]);
    expect(lastDist.bucket!.buckets[4]).toEqual([49, 43]);
  });

  it('TC-BUCKET-MOD-07 首个 distribute（29→桶2）活跃桶 2 + 蓝读游标', () => {
    const first = buildBucketSortSteps(BASE).find((s) => s.point === 'distribute')!;
    expect(first.bucket!.activeBucket).toBe(2);
    expect(first.pointers.some((p) => p.id === '1')).toBe(true);
  });

  it('TC-BUCKET-MOD-08 桶内排序：桶2 步 buckets[2] 已升序', () => {
    const steps = buildBucketSortSteps(BASE);
    const sb2 = steps.find((s) => s.point === 'sortBucket' && s.bucket!.activeBucket === 2)!;
    expect(sb2.bucket!.buckets[2]).toEqual([21, 25, 29]);
  });

  it('TC-BUCKET-MOD-09 合并：末个 concat 步整体有序 + 绿写游标', () => {
    const steps = buildBucketSortSteps(BASE);
    const con = steps.filter((s) => s.point === 'concat');
    const lastCon = con[con.length - 1];
    expect(vals(lastCon)).toEqual([3, 9, 21, 25, 29, 37, 43, 49]);
    expect(con.every((s) => s.pointers.some((p) => p.id === '3'))).toBe(true);
  });

  it('TC-BUCKET-MOD-10 done 步 sortedUpTo=n 且无指针', () => {
    const steps = buildBucketSortSteps(BASE);
    const done = steps[steps.length - 1];
    expect(done.emphasis.sortedUpTo).toBe(BASE.length);
    expect(done.pointers).toEqual([]);
  });

  it('TC-BUCKET-MOD-11 桶值域 ranges 固定为 5 桶宽 10', () => {
    const first = buildBucketSortSteps(BASE)[0];
    expect(first.bucket!.ranges).toEqual([
      [0, 9],
      [10, 19],
      [20, 29],
      [30, 39],
      [40, 49],
    ]);
  });

  it('TC-BUCKET-MOD-12 四语言 sources 且行号在源码行数内', () => {
    const langs = bucketSortModule.sources.map((s) => s.lang);
    expect(langs).toEqual(['ts', 'python', 'go', 'rust']);
    for (const src of bucketSortModule.sources) {
      const lines = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(lines);
      }
    }
  });

  it('TC-BUCKET-MOD-13 module 元信息', () => {
    expect(bucketSortModule.title).toBe('桶排序');
    expect(bucketSortModule.initialInput()).toEqual(BASE);
  });
});
