import type { AlgorithmModule, Step, TopoExecPoint, VarRow } from '@/components/player/types';
import { topoModule } from '@/algorithms/topo.module';
import { translateSources, valueOf } from '../shared';

function localizeTopoVars(vars: VarRow[]): VarRow[] {
  return vars.map((row) => {
    if (row.name === '当前点') return { name: 'Current vertex', value: row.value };
    if (row.name === '已输出') return { name: 'Output', value: row.value };
    if (row.name === '剩余') return { name: 'Remaining', value: row.value };
    const indegree = row.name.match(/^入度\[(.+)]$/);
    return indegree ? { name: `indegree[${indegree[1]}]`, value: row.value } : { ...row };
  });
}

function localizeTopoStep(step: Step<TopoExecPoint>): Step<TopoExecPoint> {
  const active = step.graph?.activeNode;
  const label = step.graph?.vertices.find((vertex) => vertex.id === active)?.label ?? '-';
  const outgoing = Object.entries(step.graph?.edgeClass ?? {})
    .filter(([, value]) => value === 'current')
    .map(([key]) => key);
  const captions: Record<TopoExecPoint, () => string> = {
    init: () => 'Count the incoming edges of every vertex.',
    selectNode: () =>
      `${label} has indegree 0, so it has no remaining prerequisite and can be output next.`,
    removeNode: () =>
      `Output ${label}, remove its ${outgoing.length} outgoing edge(s), and decrement each successor's indegree.`,
    done: () =>
      `Every vertex is output; one valid topological order is ${valueOf(step, '已输出')}.`,
  };

  return {
    ...step,
    vars: localizeTopoVars(step.vars),
    caption: captions[step.point](),
  };
}

export const englishTopoModule: AlgorithmModule<TopoExecPoint> = {
  ...topoModule,
  title: 'Topological Sort',
  buildSteps: (input) => topoModule.buildSteps(input).map(localizeTopoStep),
  sources: translateSources(topoModule.sources),
};
