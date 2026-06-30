import { describe, it, expect } from 'vitest';
import { useDijkstra } from './useDijkstra';

describe('useDijkstra 单源最短路（固定带权有向图，源 A）', () => {
  it('TC-DIJKSTRA-01 图规模与标签', () => {
    const d = useDijkstra();
    expect(d.vertices).toHaveLength(6);
    expect(d.vertices.map((v) => v.label)).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
    expect(d.edges).toHaveLength(9);
    expect(d.source).toBe(0);
  });

  it('TC-DIJKSTRA-02 出边邻接', () => {
    const d = useDijkstra();
    expect(d.adj[0].map((e) => [e.to, e.w])).toEqual([
      [1, 4],
      [2, 1],
    ]);
    expect(d.adj[4].map((e) => [e.to, e.w])).toEqual([[5, 2]]);
    expect(d.adj[5]).toEqual([]);
  });

  it('TC-DIJKSTRA-03 确定顺序 A→C→B→D→E→F', () => {
    expect(useDijkstra().run().order).toEqual([0, 2, 1, 3, 4, 5]);
  });

  it('TC-DIJKSTRA-04 最终距离 [0,3,1,4,7,9]', () => {
    expect(useDijkstra().run().dist).toEqual([0, 3, 1, 4, 7, 9]);
  });

  it('TC-DIJKSTRA-05 前驱表 [null,2,0,1,3,4]', () => {
    expect(useDijkstra().run().prev).toEqual([null, 2, 0, 1, 3, 4]);
  });

  it('TC-DIJKSTRA-06 最短路还原 F = [0,2,1,3,4,5]', () => {
    expect(useDijkstra().pathTo(5)).toEqual([0, 2, 1, 3, 4, 5]);
  });

  it('TC-DIJKSTRA-07 最短路还原 E = [0,2,1,3,4]', () => {
    expect(useDijkstra().pathTo(4)).toEqual([0, 2, 1, 3, 4]);
  });

  it('TC-DIJKSTRA-08 steps 长度 7', () => {
    expect(useDijkstra().run().steps).toHaveLength(7);
  });

  it('TC-DIJKSTRA-09 初始步：settled 空、dist[0]=0 余 ∞', () => {
    const s0 = useDijkstra().run().steps[0];
    expect(s0.settled).toEqual([]);
    expect(s0.dist).toEqual([0, Infinity, Infinity, Infinity, Infinity, Infinity]);
  });

  it('TC-DIJKSTRA-10 确定 C 后 steps[2]', () => {
    const s2 = useDijkstra().run().steps[2];
    expect(s2.justSettled).toBe(2);
    expect(s2.settled).toEqual([0, 2]);
    expect(s2.dist).toEqual([0, 3, 1, 6, Infinity, Infinity]);
  });

  it('TC-DIJKSTRA-11 松弛更新 D：steps[3] 把 dist[3] 降到 4', () => {
    expect(useDijkstra().run().steps[3].dist[3]).toBe(4);
  });

  it('TC-DIJKSTRA-12 终步 steps[6]：6 点全确定、dist [0,3,1,4,7,9]', () => {
    const s6 = useDijkstra().run().steps[6];
    expect(s6.settled).toHaveLength(6);
    expect(s6.dist).toEqual([0, 3, 1, 4, 7, 9]);
  });
});
