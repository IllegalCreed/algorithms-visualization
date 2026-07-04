// src/components/GraphView.spec.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import GraphView from './GraphView.vue';
import type { GraphTrack } from '@/components/player/types';

const V = [
  { id: 0, label: 'A', x: 50, y: 150 },
  { id: 1, label: 'B', x: 160, y: 70 },
  { id: 2, label: 'C', x: 160, y: 230 },
  { id: 3, label: 'D', x: 290, y: 70 },
  { id: 4, label: 'E', x: 290, y: 230 },
  { id: 5, label: 'F', x: 410, y: 150 },
];
const E = [
  { key: '0-1', from: 0, to: 1, w: 4 },
  { key: '0-2', from: 0, to: 2, w: 1 },
  { key: '2-1', from: 2, to: 1, w: 2 },
  { key: '2-3', from: 2, to: 3, w: 5 },
  { key: '1-3', from: 1, to: 3, w: 1 },
  { key: '1-4', from: 1, to: 4, w: 7 },
  { key: '3-4', from: 3, to: 4, w: 3 },
  { key: '3-5', from: 3, to: 5, w: 6 },
  { key: '4-5', from: 4, to: 5, w: 2 },
];
const mountIt = (graph: GraphTrack) => mount(GraphView, { props: { graph } });

describe('GraphView', () => {
  const base: GraphTrack = { vertices: V, edges: E, directed: true };

  it('TC-VIZ-GRAPHVIEW-01 渲染节点数 + 边数 + 权重文本', () => {
    const w = mountIt(base);
    expect(w.findAll('.graph-node')).toHaveLength(6);
    expect(w.findAll('.graph-edge')).toHaveLength(9);
    expect(w.text()).toContain('4'); // 某条边权重
  });

  it('TC-VIZ-GRAPHVIEW-02 doneNodes 绿 / activeNode 环', () => {
    const w = mountIt({ ...base, doneNodes: [0, 2], activeNode: 1 });
    const nodes = w.findAll('.graph-node');
    expect(nodes[0].classes()).toContain('done');
    expect(nodes[2].classes()).toContain('done');
    expect(nodes[1].classes()).toContain('active');
    expect(nodes[3].classes()).not.toContain('done');
  });

  it('TC-VIZ-GRAPHVIEW-03 edgeClass 边高亮', () => {
    const w = mountIt({ ...base, edgeClass: { '0-1': 'relaxed', '0-2': 'tree' } });
    const edges = w.findAll('.graph-edge');
    expect(edges[0].classes()).toContain('relaxed'); // '0-1'
    expect(edges[1].classes()).toContain('tree'); // '0-2'
    expect(edges[2].classes()).not.toContain('relaxed');
  });

  it('TC-VIZ-GRAPHVIEW-04 nodeBadge 距离徽标（含 ∞）', () => {
    const w = mountIt({ ...base, nodeBadge: ['0', '∞', '1', '∞', '∞', '∞'] });
    const badges = w.findAll('.node-badge');
    expect(badges).toHaveLength(6);
    expect(badges[0].text()).toBe('0');
    expect(badges[1].text()).toBe('∞');
    expect(badges[2].text()).toBe('1');
  });

  it('TC-VIZ-GRAPHVIEW-SCC-01 nodeGroup 分组着色（同组同色、异组异色）（C-069）', () => {
    const w = mountIt({ ...base, nodeGroup: [0, 0, 1, null, null, null] });
    const circles = w.findAll('.graph-node circle');
    const fill = (i: number) => circles[i].attributes('style') ?? '';
    expect(fill(0)).toContain('fill'); // 组 0 有 inline 填充
    expect(fill(0)).toBe(fill(1)); // 组 0 两点同色
    expect(fill(0)).not.toBe(fill(2)); // 组 1 异色
    expect(fill(3)).not.toBe(fill(0)); // 未归组（灰）异于组色
  });

  it('TC-VIZ-GRAPHVIEW-SCC-02 stackNodes 在栈虚线环（C-069）', () => {
    const w = mountIt({ ...base, stackNodes: [1] });
    expect(w.findAll('.on-stack')).toHaveLength(1);
    expect(w.findAll('.graph-node')[1].classes()).toContain('on-stack');
  });

  it('TC-VIZ-GRAPHVIEW-CHECK-01 checkPair 高亮一对文字节点（C-074）', () => {
    const w = mountIt({ ...base, checkPair: [0, 1] });
    const nodes = w.findAll('.graph-node');
    expect(w.findAll('.checking')).toHaveLength(2);
    expect(nodes[0].classes()).toContain('checking');
    expect(nodes[1].classes()).toContain('checking');
    expect(nodes[2].classes()).not.toContain('checking');
  });

  it('TC-VIZ-GRAPHVIEW-CHECK-02 不设 checkPair 则无 .checking（零回归）（C-074）', () => {
    const w = mountIt(base);
    expect(w.findAll('.checking')).toHaveLength(0);
  });

  it('TC-VIZ-GRAPHVIEW-FAIL-01 edgeClass fail → 边带 .fail 类（C-075 AC 自动机）', () => {
    const w = mountIt({ ...base, edgeClass: { '0-1': 'fail' } });
    const edges = w.findAll('.graph-edge');
    expect(edges[0].classes()).toContain('fail'); // '0-1'
    expect(edges[1].classes()).not.toContain('fail');
  });

  it('TC-VIZ-GRAPHVIEW-FAIL-02 无 fail 类的边不带 .fail（零回归）（C-075）', () => {
    const w = mountIt(base);
    expect(w.findAll('.graph-edge.fail')).toHaveLength(0);
  });
});
