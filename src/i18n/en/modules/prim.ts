import type { AlgorithmModule, PrimExecPoint, Step, VarRow } from '@/components/player/types';
import { primModule } from '@/algorithms/prim.module';
import { translateSources, valueOf } from '../shared';

function localizeCurrentEdge(value: VarRow['value']): VarRow['value'] {
  return typeof value === 'string' ? value.replace(/（w=([^）]+)）/, ' (w=$1)') : value;
}

function localizePrimVars(vars: VarRow[]): VarRow[] {
  const labels: Record<string, string> = {
    起点: 'Start',
    树内点: 'Tree vertices',
    当前横切边: 'Current crossing edge',
    已选边: 'Selected edges',
    'MST 权重': 'MST weight',
  };
  return vars.map((row) => ({
    name: labels[row.name] ?? row.name,
    value: row.name === '当前横切边' ? localizeCurrentEdge(row.value) : row.value,
  }));
}

function localizePrimStep(
  step: Step<PrimExecPoint>,
  previous?: Step<PrimExecPoint>,
): Step<PrimExecPoint> {
  const currentValue = String(valueOf(step, '当前横切边'));
  const edgeKey = currentValue.split('（', 1)[0];
  const edge = step.graph?.edges.find((candidate) => candidate.key === edgeKey);
  const labelOf = (id: number | undefined) =>
    step.graph?.vertices.find((vertex) => vertex.id === id)?.label ?? '-';
  const treeVertices = new Set(previous?.graph?.doneNodes ?? step.graph?.doneNodes ?? []);
  const outside = edge ? (treeVertices.has(edge.from) ? edge.to : edge.from) : undefined;
  const edgeLabel = edge ? `${labelOf(edge.from)}-${labelOf(edge.to)}` : edgeKey;
  const captions: Record<PrimExecPoint, () => string> = {
    init: () => `Start at ${valueOf(step, '起点')}; the tree initially contains one vertex.`,
    selectEdge: () =>
      `Choose the lightest crossing edge ${edgeLabel} with weight ${edge?.w}; it reaches outside vertex ${labelOf(outside)}.`,
    addVertex: () =>
      `Add ${labelOf(outside)} through ${edgeLabel}; the tree weight is now ${valueOf(step, 'MST 权重')}.`,
    done: () =>
      `All vertices are connected by ${valueOf(step, '已选边')} edges with total weight ${valueOf(step, 'MST 权重')}.`,
  };

  return {
    ...step,
    vars: localizePrimVars(step.vars),
    caption: captions[step.point](),
  };
}

export const englishPrimModule: AlgorithmModule<PrimExecPoint> = {
  ...primModule,
  title: "Prim's Minimum Spanning Tree",
  buildSteps: (input) => {
    const steps = primModule.buildSteps(input);
    return steps.map((step, index) => localizePrimStep(step, steps[index - 1]));
  },
  sources: translateSources(primModule.sources),
};
