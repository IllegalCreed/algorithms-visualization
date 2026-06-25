import { describe, it, expect } from 'vitest';
import { useGraph } from './useGraph';

const order = (steps: { visit: number }[]) => steps.map((s) => s.visit);

describe('useGraph', () => {
  it('TC-GRAPH-LOGIC-01 图结构：6 顶点、7 边、adj', () => {
    const g = useGraph();
    expect(g.vertices).toHaveLength(6);
    expect(g.edges).toHaveLength(7);
    expect(g.adj[0]).toEqual([1, 2]);
    expect(g.adj[3]).toEqual([1, 4, 5]);
  });
  it('TC-GRAPH-LOGIC-02 labelOf + 顶点坐标', () => {
    const g = useGraph();
    expect(g.labelOf(0)).toBe('A');
    expect(g.labelOf(5)).toBe('F');
    expect(g.vertices[0]).toMatchObject({ id: 0, label: 'A' });
    expect(typeof g.vertices[0].x).toBe('number');
  });
  it('TC-GRAPH-LOGIC-03 bfs(0) 顺序 A B C D E F', () => {
    expect(order(useGraph().bfs(0))).toEqual([0, 1, 2, 3, 4, 5]);
  });
  it('TC-GRAPH-LOGIC-04 dfs(0) 顺序 A B D E F C', () => {
    expect(order(useGraph().dfs(0))).toEqual([0, 1, 3, 4, 5, 2]);
  });
  it('TC-GRAPH-LOGIC-05 bfs 与 dfs 顺序不同', () => {
    const g = useGraph();
    expect(order(g.bfs(0))).not.toEqual(order(g.dfs(0)));
  });
  it('TC-GRAPH-LOGIC-06 bfs 访问全部 6 顶点、不重不漏', () => {
    const o = order(useGraph().bfs(0));
    expect(o).toHaveLength(6);
    expect(new Set(o).size).toBe(6);
  });
  it('TC-GRAPH-LOGIC-07 dfs 访问全部 6 顶点、不重不漏', () => {
    const o = order(useGraph().dfs(0));
    expect(o).toHaveLength(6);
    expect(new Set(o).size).toBe(6);
  });
  it('TC-GRAPH-LOGIC-08 bfs 首步 frontier = 队列 [1,2]', () => {
    expect(useGraph().bfs(0)[0].frontier).toEqual([1, 2]);
  });
  it('TC-GRAPH-LOGIC-09 dfs 首步 frontier = 栈 [2,1]', () => {
    expect(useGraph().dfs(0)[0].frontier).toEqual([2, 1]);
  });
  it('TC-GRAPH-LOGIC-10 换起点也访问全部（bfs(3)）', () => {
    const o = order(useGraph().bfs(3));
    expect(o[0]).toBe(3);
    expect(new Set(o).size).toBe(6);
  });
});
