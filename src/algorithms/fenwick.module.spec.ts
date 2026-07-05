// src/algorithms/fenwick.module.spec.ts —— 树状数组 module 对拍 oracle（C-102）
import { describe, it, expect } from 'vitest';
import { buildFenwickSteps, fenwickModule } from './fenwick.module';
import { BIT_A, lowbit, buildTree, queryTrace, updateTrace, brutePrefix } from './fenwick';
import { fenwickSources } from './fenwick.sources';

const POINTS = new Set(['init', 'query', 'update', 'done']);

describe('fenwick.module', () => {
  const steps = buildFenwickSteps();
  const last = steps[steps.length - 1];

  it('TC-BIT-MOD-01 建树对拍：tree 与每段管辖暴力和', () => {
    const tree = buildTree();
    expect(tree.slice(1)).toEqual([3, 5, 5, 11, 4, 6, 3, 21]);
    for (let i = 1; i <= 8; i++) {
      let seg = 0;
      for (let k = i - lowbit(i); k < i; k++) seg += BIT_A[k];
      expect(tree[i]).toBe(seg);
    }
  });

  it('TC-BIT-MOD-02 query 对拍：17 = 暴力前缀，跳链 [6,4]', () => {
    const tree = buildTree();
    const q = queryTrace(tree, 6);
    expect(q.sum).toBe(17);
    expect(q.sum).toBe(brutePrefix(BIT_A, 6));
    expect(q.hops.map((h) => h.i)).toEqual([6, 4]);
  });

  it('TC-BIT-MOD-03 update 轨迹：[3,4,8]，after 7/13/23', () => {
    const tree = buildTree();
    const u = updateTrace(tree, 3, 2);
    expect(u.hops.map((h) => [h.i, h.after])).toEqual([
      [3, 7],
      [4, 13],
      [8, 23],
    ]);
  });

  it('TC-BIT-MOD-04 复查对拍：更新后 query(6)=19', () => {
    const tree = buildTree();
    updateTrace(tree, 3, 2);
    const q = queryTrace(tree, 6);
    expect(q.sum).toBe(19);
    const a2 = [...BIT_A];
    a2[2] += 2;
    expect(q.sum).toBe(brutePrefix(a2, 6));
  });

  it('TC-BIT-MOD-05 步合法：point + 8 柱 tree 快照', () => {
    for (const s of steps) {
      expect(POINTS.has(s.point)).toBe(true);
      expect(s.array).toHaveLength(8);
    }
    expect(steps[0].array.map((a) => a[1])).toEqual([3, 5, 5, 11, 4, 6, 3, 21]);
  });

  it('TC-BIT-MOD-06 步数结构：9 步序列全等', () => {
    expect(steps.map((s) => s.point)).toEqual([
      'init',
      'query',
      'query',
      'update',
      'update',
      'update',
      'query',
      'query',
      'done',
    ]);
  });

  it('TC-BIT-MOD-07 query 步：pivotIndex 5,3 + 链累积 + lowbit caption', () => {
    const q1 = steps[1];
    const q2 = steps[2];
    expect(q1.emphasis.pivotIndex).toBe(5);
    expect(q2.emphasis.pivotIndex).toBe(3);
    expect(q1.emphasis.groupMembers).toEqual([5]);
    expect(q2.emphasis.groupMembers).toEqual([5, 3]);
    expect(q1.caption).toContain('lowbit');
  });

  it('TC-BIT-MOD-08 update 步：柱值真实变化 + 通知语义', () => {
    const u2 = steps[4]; // update 第二跳 i=4
    expect(u2.array[3][1]).toBe(13); // tree[4] 11→13
    expect(u2.caption).toContain('管');
  });

  it('TC-BIT-MOD-09 复查步：累计 19 + 验证语义', () => {
    const q4 = steps[7];
    expect(q4.caption).toContain('19');
    expect(q4.caption).toContain('验证');
  });

  it('TC-BIT-MOD-10 done caption 含 O(log n) 与对比', () => {
    expect(last.caption).toContain('O(log n)');
    expect(last.caption).toContain('前缀和');
  });

  it('TC-BIT-MOD-11 四语言 + 行号 + 四执行点', () => {
    expect(fenwickSources.map((s) => s.lang).sort()).toEqual(['go', 'python', 'rust', 'ts']);
    for (const src of fenwickSources) {
      const n = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(n);
      }
      expect(Object.keys(src.lineMap).sort()).toEqual(['done', 'init', 'query', 'update'].sort());
    }
  });

  it('TC-BIT-MOD-12 元信息：title 含树状数组；initialInput=tree 初值', () => {
    expect(fenwickModule.title).toContain('树状数组');
    expect(fenwickModule.initialInput()).toEqual([3, 5, 5, 11, 4, 6, 3, 21]);
  });
});
