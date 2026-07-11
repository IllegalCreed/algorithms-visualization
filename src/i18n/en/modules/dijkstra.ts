import type { AlgorithmModule, DijkstraExecPoint, Step } from '@/components/player/types';
import { dijkstraModule } from '@/algorithms/dijkstra.module';
import { translateSources } from '../shared';

function graphNodeLabel(step: Step<DijkstraExecPoint>, node: number | null | undefined): string {
  if (node === null || node === undefined) return '-';
  return step.graph?.vertices.find((vertex) => vertex.id === node)?.label ?? '-';
}

function localizeDijkstraStep(step: Step<DijkstraExecPoint>): Step<DijkstraExecPoint> {
  const graph = step.graph;
  const active = graph?.activeNode;
  const activeLabel = graphNodeLabel(step, active);
  const edgeKey = Object.keys(graph?.edgeClass ?? {})[0];
  const edge = graph?.edges.find((candidate) => candidate.key === edgeKey);
  const from = graphNodeLabel(step, edge?.from);
  const to = graphNodeLabel(step, edge?.to);
  const toDistance = edge ? graph?.nodeBadge?.[edge.to] : undefined;
  const captions: Record<DijkstraExecPoint, () => string> = {
    init: () => 'Set the source distance to 0 and every other distance to infinity.',
    selectMin: () =>
      `Choose unsettled vertex ${activeLabel}, which has the smallest tentative distance ${graph?.nodeBadge?.[active ?? -1]}.`,
    settle: () => `Settle ${activeLabel}; its shortest distance is now final.`,
    relaxEdge: () => `Consider edge ${from} -> ${to} with weight ${edge?.w}.`,
    relaxUpdate: () => `A shorter path was found; update dist[${to}] to ${toDistance}.`,
    relaxSkip: () => `The route through ${from} is not shorter, so keep dist[${to}] unchanged.`,
    done: () =>
      'All reachable vertices are settled and the green edges form the shortest-path tree.',
  };

  return {
    ...step,
    vars: step.vars.map((row) => {
      if (row.name === 'u（当前点）') return { name: 'u (current)', value: row.value };
      if (row.name === '已确定') return { name: 'Settled', value: row.value };
      return { ...row };
    }),
    caption: captions[step.point](),
  };
}

export const englishDijkstraModule: AlgorithmModule<DijkstraExecPoint> = {
  ...dijkstraModule,
  title: "Dijkstra's Shortest Path",
  buildSteps: (input) => dijkstraModule.buildSteps(input).map(localizeDijkstraStep),
  sources: translateSources(dijkstraModule.sources),
};
