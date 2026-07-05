// src/algorithms/reroot.module.spec.ts —— 换根 DP module 对拍 oracle（C-103）
import { describe, it, expect } from 'vitest';
import { buildRerootSteps, rerootModule } from './reroot.module';
import { rerootTrace, bruteDist } from './reroot';
import { rerootSources } from './reroot.sources';

const POINTS = new Set(['init', 'down', 'root', 'reroot', 'done']);

describe('reroot.module', () => {
  const steps = buildRerootSteps();
  const last = steps[steps.length - 1];
  const tr = rerootTrace();

  it('TC-RR-MOD-01 对拍：ans=[6,5,9,8,8]=逐点 BFS', () => {
    expect(tr.ans).toEqual([6, 5, 9, 8, 8]);
    expect(tr.ans).toEqual(bruteDist());
  });

  it('TC-RR-MOD-02 第一趟：后序与 size/down', () => {
    expect(tr.postOrder).toEqual([3, 4, 1, 2, 0]);
    expect(tr.downFills.map((f) => [f.u, f.size, f.down])).toEqual([
      [3, 1, 0],
      [4, 1, 0],
      [1, 3, 2],
      [2, 1, 0],
      [0, 5, 6],
    ]);
  });

  it('TC-RR-MOD-03 换根序（DFS 序）与公式结果', () => {
    expect(tr.reroots.map((r) => [r.v, r.parent, r.ansV])).toEqual([
      [1, 0, 5],
      [3, 1, 8],
      [4, 1, 8],
      [2, 0, 9],
    ]);
  });

  it('TC-RR-MOD-04 步合法：point + matrix + array 空', () => {
    for (const s of steps) {
      expect(POINTS.has(s.point)).toBe(true);
      expect(s.matrix).toBeTruthy();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-RR-MOD-05 步数结构：12 步序列全等', () => {
    expect(steps.map((s) => s.point)).toEqual([
      'init',
      'down',
      'down',
      'down',
      'down',
      'down',
      'root',
      'reroot',
      'reroot',
      'reroot',
      'reroot',
      'done',
    ]);
  });

  it('TC-RR-MOD-06 init 表：5×3 全 null + 标签', () => {
    const init = steps[0];
    expect(init.matrix!.cells).toHaveLength(5);
    for (const row of init.matrix!.cells) {
      expect(row).toHaveLength(3);
      for (const c of row) expect(c).toBeNull();
    }
    expect(init.matrix!.rowLabels).toEqual(['0·根', '1·L', '2·R', '3·LL', '4·LR']);
    expect(init.matrix!.colLabels).toEqual(['size', 'down', 'ans']);
  });

  it('TC-RR-MOD-07 down 步：双格填 + 内部节点孩子四格 sources', () => {
    const downs = steps.filter((s) => s.point === 'down');
    expect(downs[0].matrix!.cells[3]).toEqual([1, 0, null]); // 叶 3
    const d1 = downs[2]; // 节点 1
    expect(d1.matrix!.cells[1]).toEqual([3, 2, null]);
    expect(d1.matrix!.sources).toEqual([
      [3, 0],
      [3, 1],
      [4, 0],
      [4, 1],
    ]);
    const d0 = downs[4]; // 根
    expect(d0.matrix!.sources).toEqual([
      [1, 0],
      [1, 1],
      [2, 0],
      [2, 1],
    ]);
  });

  it('TC-RR-MOD-08 root 步：ans[0]=6 + sources down 格', () => {
    const r = steps.find((s) => s.point === 'root')!;
    expect(r.matrix!.cells[0][2]).toBe(6);
    expect(r.matrix!.sources).toEqual([[0, 1]]);
    expect(r.caption).toContain('第一趟');
  });

  it('TC-RR-MOD-09 reroot 步：sources=[父 ans, 自 size] + 公式代入', () => {
    const rr = steps.filter((s) => s.point === 'reroot');
    expect(rr[0].matrix!.sources).toEqual([
      [0, 2],
      [1, 0],
    ]);
    expect(rr[0].caption).toContain('近');
    expect(rr[3].matrix!.cells[2][2]).toBe(9);
  });

  it('TC-RR-MOD-10 done caption 含 O(n) 与二次扫描', () => {
    expect(last.caption).toContain('O(n)');
    expect(last.caption).toContain('二次扫描');
  });

  it('TC-RR-MOD-11 四语言 + 行号 + 五执行点', () => {
    expect(rerootSources.map((s) => s.lang).sort()).toEqual(['go', 'python', 'rust', 'ts']);
    for (const src of rerootSources) {
      const n = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(n);
      }
      expect(Object.keys(src.lineMap).sort()).toEqual(
        ['done', 'down', 'init', 'reroot', 'root'].sort(),
      );
    }
  });

  it('TC-RR-MOD-12 元信息：title 含换根；initialInput=[]', () => {
    expect(rerootModule.title).toContain('换根');
    expect(rerootModule.initialInput()).toEqual([]);
  });
});
