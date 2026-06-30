import { describe, it, expect } from 'vitest';
import { useKruskal } from './useKruskal';

describe('useKruskal 最小生成树（固定无向带权图，并查集判环）', () => {
  it('TC-KRUSKAL-01 图规模与标签', () => {
    const k = useKruskal();
    expect(k.vertices).toHaveLength(6);
    expect(k.vertices.map((v) => v.label)).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
    expect(k.edges).toHaveLength(9);
  });

  it('TC-KRUSKAL-02 边已按权升序', () => {
    const k = useKruskal();
    expect(k.edges.map((e) => e.w)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(k.edges[0].id).toBe('AC');
  });

  it('TC-KRUSKAL-03 MST 边集 [AC,BC,DE,BD,DF]', () => {
    expect(useKruskal().run().mstEdges).toEqual(['AC', 'BC', 'DE', 'BD', 'DF']);
  });

  it('TC-KRUSKAL-04 MST 总权重 18', () => {
    expect(useKruskal().run().totalWeight).toBe(18);
  });

  it('TC-KRUSKAL-05 steps 长度 10', () => {
    expect(useKruskal().run().steps).toHaveLength(10);
  });

  it('TC-KRUSKAL-06 初始步 mst 空、current null、weight 0', () => {
    const s0 = useKruskal().run().steps[0];
    expect(s0.mst).toEqual([]);
    expect(s0.current).toBeNull();
    expect(s0.weight).toBe(0);
  });

  it('TC-KRUSKAL-07 加入 B-C：steps[2]', () => {
    const s2 = useKruskal().run().steps[2];
    expect(s2.current?.id).toBe('BC');
    expect(s2.accepted).toBe(true);
    expect(s2.mst).toEqual(['AC', 'BC']);
  });

  it('TC-KRUSKAL-08 成环跳过 A-B：steps[4]', () => {
    const s4 = useKruskal().run().steps[4];
    expect(s4.current?.id).toBe('AB');
    expect(s4.accepted).toBe(false);
    expect(s4.mst).toHaveLength(3);
  });

  it('TC-KRUSKAL-09 加入 B-D：steps[5] 含 BD、weight 11', () => {
    const s5 = useKruskal().run().steps[5];
    expect(s5.accepted).toBe(true);
    expect(s5.mst).toContain('BD');
    expect(s5.weight).toBe(11);
  });

  it('TC-KRUSKAL-10 完成步 D-F：steps[7] mst 5 条、weight 18', () => {
    const s7 = useKruskal().run().steps[7];
    expect(s7.accepted).toBe(true);
    expect(s7.mst).toHaveLength(5);
    expect(s7.weight).toBe(18);
  });

  it('TC-KRUSKAL-11 成环边集 [AB,CE,EF,CD]', () => {
    expect(useKruskal().run().steps[9].rejected).toEqual(['AB', 'CE', 'EF', 'CD']);
  });

  it('TC-KRUSKAL-12 末步权重稳定：steps[9] mst 5、weight 18', () => {
    const s9 = useKruskal().run().steps[9];
    expect(s9.mst).toHaveLength(5);
    expect(s9.weight).toBe(18);
  });
});
