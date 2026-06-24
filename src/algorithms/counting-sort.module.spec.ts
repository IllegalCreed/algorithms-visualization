import { describe, it, expect } from 'vitest';
import { countingSortTrace } from './counting-sort';
import { buildCountingSortSteps, countingSortModule } from './counting-sort.module';
import type { CountingExecPoint, Step } from '@/components/player/types';

const EXEC: CountingExecPoint[] = ['count', 'bucketStart', 'writeBack', 'done'];
const BASE = [3, 1, 4, 1, 6, 2, 3, 6, 4, 1];
const val = (s: Step<CountingExecPoint>) => s.array.map((t) => t[1]);

describe('buildCountingSortSteps', () => {
  it('TC-COUNT-MOD-01 空只产 done(sortedUpTo=0)；单元素末步 done 且升序', () => {
    const empty = buildCountingSortSteps([]);
    expect(empty.length).toBe(1);
    expect(empty[0].point).toBe('done');
    expect(empty[0].emphasis.sortedUpTo).toBe(0);
    const one = buildCountingSortSteps([5]);
    expect(one.at(-1)!.point).toBe('done');
    expect(val(one.at(-1)!)).toEqual([5]);
  });
  it('TC-COUNT-MOD-02 末步升序 = oracle result', () => {
    expect(val(buildCountingSortSteps(BASE).at(-1)!)).toEqual(countingSortTrace(BASE).result);
    expect(val(buildCountingSortSteps(BASE).at(-1)!)).toEqual([1, 1, 1, 2, 3, 3, 4, 4, 6, 6]);
  });
  it('TC-COUNT-MOD-03 每步 id 集合恒等于初始（FLIP）', () => {
    const all = buildCountingSortSteps(BASE);
    const init = new Set(all[0].array.map((t) => t[0]));
    for (const s of all) expect(new Set(s.array.map((t) => t[0]))).toEqual(init);
  });
  it('TC-COUNT-MOD-04 不修改入参', () => {
    const input = [3, 1, 2];
    buildCountingSortSteps(input);
    expect(input).toEqual([3, 1, 2]);
  });
  it('TC-COUNT-MOD-05 每步 point 合法、带 count 快照', () => {
    for (const s of buildCountingSortSteps(BASE)) {
      expect(EXEC).toContain(s.point);
      expect(Array.isArray(s.count!.buckets)).toBe(true);
      expect(typeof s.count!.min).toBe('number');
    }
  });
  it('TC-COUNT-MOD-06 计数阶段末步桶快照 = oracle counts', () => {
    const steps = buildCountingSortSteps(BASE);
    const lastCount = steps.filter((s) => s.point === 'count').at(-1)!;
    expect(lastCount.count!.buckets).toEqual(countingSortTrace(BASE).counts);
    expect(lastCount.count!.buckets).toEqual([3, 1, 2, 2, 0, 2]);
  });
  it('TC-COUNT-MOD-07 count 步 activeBucket = a[i]-min（被增桶）', () => {
    const counts = buildCountingSortSteps(BASE).filter((s) => s.point === 'count');
    counts.forEach((s, i) => expect(s.count!.activeBucket).toBe(BASE[i] - 1));
  });
  it('TC-COUNT-MOD-08 回写 sortedUpTo 单调不减、done = n', () => {
    let prev = -1;
    for (const s of buildCountingSortSteps(BASE)) {
      if (s.emphasis.sortedUpTo !== undefined) {
        expect(s.emphasis.sortedUpTo).toBeGreaterThanOrEqual(prev);
        prev = s.emphasis.sortedUpTo;
      }
    }
    expect(buildCountingSortSteps(BASE).at(-1)!.emphasis.sortedUpTo).toBe(BASE.length);
  });
  it('TC-COUNT-MOD-09 每条 writeBack 当前桶余量较上一次递减', () => {
    const lastByBucket = new Map<number, number>();
    for (const s of buildCountingSortSteps(BASE)) {
      if (s.point === 'writeBack') {
        const b = s.count!.activeBucket!;
        const cur = s.count!.buckets[b];
        if (lastByBucket.has(b)) expect(cur).toBeLessThan(lastByBucket.get(b)!);
        lastByBucket.set(b, cur);
      }
    }
  });
  it('TC-COUNT-MOD-10 空桶（值5）有 bucketStart 但其后无 writeBack', () => {
    const steps = buildCountingSortSteps(BASE);
    const idx = steps.findIndex((s) => s.point === 'bucketStart' && s.count!.activeBucket === 4);
    expect(idx).toBeGreaterThan(-1);
    expect(steps[idx + 1].point).not.toBe('writeBack');
  });
  it('TC-COUNT-MOD-11 done 步 sortedUpTo=n、所有桶=0、无游标', () => {
    const d = buildCountingSortSteps(BASE).at(-1)!;
    expect(d.emphasis.sortedUpTo).toBe(BASE.length);
    expect(d.count!.buckets.every((c) => c === 0)).toBe(true);
    expect(d.pointers).toEqual([]);
  });
  it('TC-COUNT-MOD-12 count 蓝读游标(id1)；bucketStart/writeBack 绿写游标(id3)', () => {
    for (const s of buildCountingSortSteps(BASE)) {
      if (s.point === 'count') expect(s.pointers[0]?.id).toBe('1');
      if (s.point === 'bucketStart' || s.point === 'writeBack') expect(s.pointers[0]?.id).toBe('3');
    }
  });
  it('TC-COUNT-MOD-13 writeBack 步 dimFrom=写入位+1、活跃格不提前转绿', () => {
    for (const s of buildCountingSortSteps(BASE).filter((x) => x.point === 'writeBack')) {
      const w = s.pointers[0]!.index; // 刚写的活跃格
      expect(s.emphasis.sortedUpTo).toBe(w);
      expect(s.emphasis.dimFrom).toBe(w + 1);
    }
  });
});

describe('countingSortModule.sources', () => {
  it('TC-COUNT-MOD-14 四门语言齐备', () => {
    expect(countingSortModule.sources.map((s) => s.lang).sort()).toEqual(
      ['go', 'python', 'rust', 'ts'].sort(),
    );
  });
  it('TC-COUNT-MOD-15 每门语言每个 point 行号在源码行范围内', () => {
    for (const src of countingSortModule.sources) {
      const lc = src.code.split('\n').length;
      for (const p of EXEC) {
        expect(src.lineMap[p], `${src.lang}/${p}`).toBeGreaterThanOrEqual(1);
        expect(src.lineMap[p], `${src.lang}/${p}`).toBeLessThanOrEqual(lc);
      }
    }
  });
  it('TC-COUNT-MOD-16 实际出现的 point 都能映射到行', () => {
    const used = new Set(
      buildCountingSortSteps(countingSortModule.initialInput()).map((s) => s.point),
    );
    for (const src of countingSortModule.sources)
      for (const p of used) expect(typeof src.lineMap[p]).toBe('number');
  });
});
