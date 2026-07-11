import type { AlgorithmModule, KruskalExecPoint, Step, VarRow } from '@/components/player/types';
import { kruskalModule } from '@/algorithms/kruskal.module';
import { translateSources, valueOf } from '../shared';

function localizeCurrentEdge(value: VarRow['value']): VarRow['value'] {
  return typeof value === 'string' ? value.replace(/（w=([^）]+)）/, ' (w=$1)') : value;
}

function localizeKruskalVars(vars: VarRow[]): VarRow[] {
  const labels: Record<string, string> = {
    '边数 E': 'Edges E',
    当前边: 'Current edge',
    'MST 边数': 'MST edges',
    'MST 权重': 'MST weight',
    成环跳过: 'Cycle rejections',
  };
  return vars.map((row) => ({
    name: labels[row.name] ?? row.name,
    value: row.name === '当前边' ? localizeCurrentEdge(row.value) : row.value,
  }));
}

function localizeKruskalStep(step: Step<KruskalExecPoint>): Step<KruskalExecPoint> {
  const currentValue = String(valueOf(step, '当前边'));
  const edgeKey = currentValue.split('（', 1)[0];
  const edge = step.graph?.edges.find((candidate) => candidate.key === edgeKey);
  const labelOf = (id: number | undefined) =>
    step.graph?.vertices.find((vertex) => vertex.id === id)?.label ?? '-';
  const edgeLabel = edge ? `${labelOf(edge.from)}-${labelOf(edge.to)}` : edgeKey;
  const captions: Record<KruskalExecPoint, () => string> = {
    init: () =>
      `Sort all ${valueOf(step, '边数 E')} edges by weight; the MST is empty and every vertex starts in its own set.`,
    consider: () =>
      `Consider the lightest remaining edge ${edgeLabel} with weight ${edge?.w}; check whether its endpoints are already connected.`,
    accept: () =>
      `The endpoints are in different sets, so accept ${edgeLabel}, union them, and raise the total weight to ${valueOf(step, 'MST 权重')}.`,
    reject: () =>
      `The endpoints are already connected, so reject ${edgeLabel} because it would create a cycle.`,
    done: () =>
      `The tree has ${valueOf(step, 'MST 边数')} edges and total weight ${valueOf(step, 'MST 权重')}; the minimum spanning tree is complete.`,
  };

  return {
    ...step,
    vars: localizeKruskalVars(step.vars),
    caption: captions[step.point](),
  };
}

export const englishKruskalModule: AlgorithmModule<KruskalExecPoint> = {
  ...kruskalModule,
  title: "Kruskal's Minimum Spanning Tree",
  buildSteps: (input) => kruskalModule.buildSteps(input).map(localizeKruskalStep),
  sources: translateSources(kruskalModule.sources),
};
