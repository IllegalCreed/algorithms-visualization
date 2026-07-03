import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import DecisionTreeView from './DecisionTreeView.vue';
import type { DecisionTreeTrack } from '@/components/player/types';

const base: DecisionTreeTrack = {
  nodes: [
    { id: 0, label: '', x: 100, y: 30 },
    { id: 1, label: '{1}', x: 50, y: 110 },
    { id: 2, label: '∅', x: 150, y: 110 },
  ],
  edges: [
    { from: 0, to: 1, label: '选 1' },
    { from: 0, to: 2, label: '跳过 1' },
  ],
};

const mountIt = (t: Partial<DecisionTreeTrack> = {}) =>
  mount(DecisionTreeView, { props: { decisionTree: { ...base, ...t } } });

describe('DecisionTreeView 决策树轨', () => {
  it('TC-VIZ-DTREEVIEW-01 3 节点 2 边 → 3 .dtree-node、2 .dtree-edge', () => {
    const w = mountIt();
    expect(w.findAll('.dtree-node')).toHaveLength(3);
    expect(w.findAll('.dtree-edge')).toHaveLength(2);
  });

  it('TC-VIZ-DTREEVIEW-02 activeId=1 → 恰 1 个 .active 节点', () => {
    const w = mountIt({ activeId: 1 });
    expect(w.findAll('.dtree-node.active')).toHaveLength(1);
  });

  it('TC-VIZ-DTREEVIEW-03 solutionIds=[2] → 恰 1 个 .solution 节点', () => {
    const w = mountIt({ solutionIds: [2] });
    expect(w.findAll('.dtree-node.solution')).toHaveLength(1);
  });

  it('TC-VIZ-DTREEVIEW-04 决策边标签「选 1」+ 叶标签「{1}」渲染为文字', () => {
    const w = mountIt();
    const txt = w.text();
    expect(txt).toContain('选 1'); // 决策边标签
    expect(txt).toContain('{1}'); // 叶节点最终子集标签
  });

  it('TC-VIZ-DTREEVIEW-05 prunedIds=[2] → 恰 1 个 .pruned 节点；不设时 0 个（C-058 扩展）', () => {
    expect(mountIt({ prunedIds: [2] }).findAll('.dtree-node.pruned')).toHaveLength(1);
    expect(mountIt().findAll('.dtree-node.pruned')).toHaveLength(0); // 子集/排列不设 → 零回归
  });
});
