import type {
  AlgorithmModule,
  BellmanFordExecPoint,
  Step,
  VarRow,
} from '@/components/player/types';
import { bellmanFordModule } from '@/algorithms/bellman-ford.module';
import { translateSources, valueOf } from '../shared';

function localizeBellmanFordVars(vars: VarRow[]): VarRow[] {
  return vars.map((row) => {
    if (row.name === '轮次 k') return { name: 'Round k', value: row.value };
    if (row.name === '总轮数 V−1') return { name: 'Total rounds V-1', value: row.value };
    if (row.name === '当前边') {
      return {
        name: 'Current edge',
        value:
          typeof row.value === 'string'
            ? row.value.replace(/（w=([^）]+)）/, ' (w=$1)')
            : row.value,
      };
    }
    if (row.name === '本轮已更新') return { name: 'Updates this round', value: row.value };
    return { ...row };
  });
}

function localizeBellmanFordStep(step: Step<BellmanFordExecPoint>): Step<BellmanFordExecPoint> {
  const graph = step.graph;
  const edgeKey = Object.entries(graph?.edgeClass ?? {}).find(
    ([, value]) => value === 'current',
  )?.[0];
  const edge = graph?.edges.find((candidate) => candidate.key === edgeKey);
  const labelOf = (id: number | undefined) =>
    graph?.vertices.find((vertex) => vertex.id === id)?.label ?? '-';
  const from = labelOf(edge?.from);
  const to = labelOf(edge?.to);
  const sourceIndex = graph?.nodeBadge?.findIndex((badge) => badge === '0') ?? -1;
  const captions: Record<BellmanFordExecPoint, () => string> = {
    init: () =>
      `Set source ${labelOf(sourceIndex)} to distance 0 and every other vertex to infinity.`,
    roundStart: () =>
      `Start round ${valueOf(step, '轮次 k')} of ${valueOf(step, '总轮数 V−1')}; relax every directed edge once.`,
    relaxUpdate: () =>
      `Relax ${from} -> ${to} with weight ${edge?.w}: the candidate is shorter, so set dist[${to}] to ${graph?.nodeBadge?.[edge?.to ?? -1]}.`,
    relaxSkip: () =>
      `Relax ${from} -> ${to} with weight ${edge?.w}: the candidate is not shorter, so keep dist[${to}] unchanged.`,
    done: () => `After V-1 rounds, the distances are final: [${graph?.nodeBadge?.join(', ')}].`,
  };

  return {
    ...step,
    vars: localizeBellmanFordVars(step.vars),
    caption: captions[step.point](),
  };
}

export const englishBellmanFordModule: AlgorithmModule<BellmanFordExecPoint> = {
  ...bellmanFordModule,
  title: 'Bellman-Ford Shortest Paths',
  buildSteps: (input) => bellmanFordModule.buildSteps(input).map(localizeBellmanFordStep),
  sources: translateSources(bellmanFordModule.sources),
};
