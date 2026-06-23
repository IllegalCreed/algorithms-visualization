// src/components/TreeView.spec.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TreeView from './TreeView.vue';
import type { StepEmphasis } from '@/components/player/types';

const mk = (n: number): [string, number][] =>
  Array.from({ length: n }, (_, i) => [String(i), n - i] as [string, number]);

const mountIt = (array: [string, number][], emphasis: StepEmphasis = {}, heapSize?: number) =>
  mount(TreeView, { props: { array, emphasis, heapSize: heapSize ?? array.length } });

describe('TreeView', () => {
  it('TC-VIZ-TREEVIEW-01 渲染节点数 = array.length', () => {
    expect(mountIt(mk(7)).findAll('.tree-node')).toHaveLength(7);
  });

  it('TC-VIZ-TREEVIEW-02 完全二叉树布局：k=0 顶层中央、k=1 左、k=2 右', () => {
    const nodes = mountIt(mk(7)).findAll('.tree-node');
    expect(nodes[0].attributes('style')).toContain('left: 50%'); // depth0：(0+0.5)/1
    expect(nodes[1].attributes('style')).toContain('left: 25%'); // depth1 左：(0+0.5)/2
    expect(nodes[2].attributes('style')).toContain('left: 75%'); // depth1 右：(1+0.5)/2
  });

  it('TC-VIZ-TREEVIEW-03 父子边数 = n-1', () => {
    expect(mountIt(mk(7)).findAll('line')).toHaveLength(6);
  });

  it('TC-VIZ-TREEVIEW-04 heapNode 节点带 heapNode 类', () => {
    const nodes = mountIt(mk(7), { heapNode: 1 }).findAll('.tree-node');
    expect(nodes[1].classes()).toContain('heapNode');
  });

  it('TC-VIZ-TREEVIEW-05 heapSize 区分就位：k>=heapSize 节点为 sorted', () => {
    const nodes = mountIt(mk(7), {}, 5).findAll('.tree-node');
    expect(nodes[4].classes()).not.toContain('sorted'); // 4 < 5，仍在堆
    expect(nodes[5].classes()).toContain('sorted'); // 5 >= 5，已就位
    expect(nodes[6].classes()).toContain('sorted'); // 6 >= 5，已就位
  });

  it('TC-VIZ-TREEVIEW-06 comparing 节点黄、swapped 节点橙', () => {
    const cmp = mountIt(mk(7), { comparing: [1, 2] }).findAll('.tree-node');
    expect(cmp[1].classes()).toContain('comparing');
    expect(cmp[2].classes()).toContain('comparing');
    const swp = mountIt(mk(7), { comparing: [1, 2], swapped: true }).findAll('.tree-node');
    expect(swp[1].classes()).toContain('swapped');
  });
});
