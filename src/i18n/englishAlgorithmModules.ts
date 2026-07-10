import type {
  AlgorithmModule,
  BsExecPoint,
  DijkstraExecPoint,
  FenwickExecPoint,
  HullExecPoint,
  KmpExecPoint,
  KnapsackExecPoint,
  LangSource,
  QuickExecPoint,
  QuizItem,
  Step,
  VarRow,
} from '@/components/player/types';
import { quickSortModule } from '@/algorithms/quick-sort.module';
import { bsearchModule } from '@/algorithms/bsearch.module';
import { dijkstraModule } from '@/algorithms/dijkstra.module';
import { knapsackModule } from '@/algorithms/knapsack.module';
import { kmpModule } from '@/algorithms/kmp.module';
import { fenwickModule } from '@/algorithms/fenwick.module';
import { convexHullModule } from '@/algorithms/convexhull.module';
import { CAPACITY, ITEM_LABELS, VALUES, WEIGHTS } from '@/algorithms/knapsack';
import { BIT_N, lowbit } from '@/algorithms/fenwick';

const SOURCE_COMMENT_REPLACEMENTS: ReadonlyArray<readonly [string, string]> = [
  ['tree[i] 管辖长 lowbit(i) 的区段和', 'tree[i] stores a lowbit(i)-wide range sum'],
  ['tree[i] 管辖长 lowbit(i)', 'tree[i] covers lowbit(i) values'],
  ['目标在右半：扔掉左半', 'target is right: discard the left half'],
  ['目标在左半：扔掉右半', 'target is left: discard the right half'],
  ['区间清空：不存在', 'empty range: not found'],
  ['失配：跳转，i 不回退', 'mismatch: jump without rewinding i'],
  ['j=0 失配：文本前进', 'mismatch at j=0: advance the text'],
  ['下 + 上凸壳拼接', 'concatenate lower and upper hulls'],
  ['下凸壳：左 → 右', 'lower hull: left to right'],
  ['上凸壳：右 → 左', 'upper hull: right to left'],
  ['非左转弹栈', 'pop non-left turns'],
  ['叉积 (A-O)×(B-O)', 'cross product (A-O)x(B-O)'],
  ['按 (x,y) 排序', 'sort by (x,y)'],
  ['候选区间', 'candidate range'],
  ['探针：取中点', 'probe the midpoint'],
  ['最低位的 1', 'least significant set bit'],
  ['前缀和', 'prefix sum'],
  ['沿链往前跳', 'follow the chain backward'],
  ['通知每个管辖者', 'update every covering node'],
  ['命中', 'match found'],
  ['拼接', 'concatenate'],
];

function translateSources<P extends string>(sources: LangSource<P>[]): LangSource<P>[] {
  return sources.map((source) => {
    let code = source.code;
    for (const [chinese, english] of SOURCE_COMMENT_REPLACEMENTS) {
      code = code.replaceAll(chinese, english);
    }
    return { ...source, code, lineMap: { ...source.lineMap } };
  });
}

function valueOf(step: Step, name: string): VarRow['value'] {
  return step.vars.find((row) => row.name === name)?.value ?? '-';
}

function translatedQuickQuiz(
  point: QuickExecPoint,
  quiz: QuizItem | undefined,
): QuizItem | undefined {
  if (!quiz) return undefined;
  if (point === 'pivotSelect') {
    return {
      question: 'Which element does this Lomuto partition use as its pivot?',
      options: ['The last element', 'The first element', 'A random element'],
      answer: 0,
    };
  }
  return {
    question: 'What happens after the pivot reaches its final position?',
    options: [
      'Process the left and right subranges',
      'Scan the entire array for another pivot',
      'Stop sorting immediately',
    ],
    answer: 0,
  };
}

function localizeQuickStep(step: Step<QuickExecPoint>): Step<QuickExecPoint> {
  const lo = valueOf(step, 'lo');
  const hi = valueOf(step, 'hi');
  const pivot = valueOf(step, 'pivot');
  const i = valueOf(step, 'i');
  const j = valueOf(step, 'j');
  const aj = valueOf(step, 'a[j]');
  const depth = valueOf(step, '栈深');
  const caption: Record<QuickExecPoint, () => string> = {
    pop: () => `Pop interval [${lo}, ${hi}] from the work stack.`,
    pivotSelect: () => `Choose a[${hi}] = ${pivot} as the pivot.`,
    compare: () =>
      `Compare a[${j}] = ${aj} with pivot ${pivot}: ${Number(aj) < Number(pivot) ? '<' : '>='}.`,
    swap: () => `Move a[${j}] into the less-than region and advance i to ${i}.`,
    noSwap: () => `a[${j}] is at least the pivot, so leave it in place and continue.`,
    pivotPlace: () => `Place the pivot at index ${i}; this position is now final.`,
    push: () => `Push the non-trivial subranges; ${depth} interval(s) remain.`,
    done: () => 'Done. Every value is in sorted order.',
  };

  return {
    ...step,
    vars: step.vars.map((row) =>
      row.name === '栈深' ? { name: 'Stack depth', value: row.value } : { ...row },
    ),
    caption: caption[step.point](),
    quiz: translatedQuickQuiz(step.point, step.quiz),
  };
}

function translatedBsearchQuiz(
  point: BsExecPoint,
  quiz: QuizItem | undefined,
): QuizItem | undefined {
  if (!quiz) return undefined;
  if (point === 'mid') {
    return {
      question: 'arr[4] = 9 is smaller than target 17. What is the next candidate range?',
      options: ['[5, 9], the right half', '[0, 3], the left half', '[0, 9], unchanged'],
      answer: 0,
    };
  }
  return {
    question: 'What does lo > hi mean after the candidate range becomes empty?',
    options: [
      'The target is absent; return -1',
      'Scan from the start to confirm',
      'The array is unsorted',
    ],
    answer: 0,
  };
}

function localizeBsearchStep(step: Step<BsExecPoint>): Step<BsExecPoint> {
  const target = valueOf(step, 'target');
  const range = valueOf(step, '[lo, hi]');
  const mid = Number(valueOf(step, 'mid'));
  const probe = Number.isInteger(mid) ? step.array[mid]?.[1] : undefined;
  const captions: Record<BsExecPoint, () => string> = {
    init: () => `Search for target ${target} in the sorted array; start with range ${range}.`,
    mid: () =>
      `Probe mid = ${mid}: arr[${mid}] = ${probe} ${Number(probe) < Number(target) ? '<' : Number(probe) > Number(target) ? '>' : '='} ${target}.`,
    cut: () => `Discard the impossible half; the candidate range is now ${range}.`,
    found: () => `Found target ${target} at index ${mid}.`,
    empty: () => `The candidate range ${range} is empty, so target ${target} is absent. Return -1.`,
    done: () => 'Binary Search halves the candidate range at every comparison: O(log n) time.',
  };

  return {
    ...step,
    vars: step.vars.map((row) =>
      row.name === '复杂度' ? { name: 'Complexity', value: row.value } : { ...row },
    ),
    caption: captions[step.point](),
    quiz: translatedBsearchQuiz(step.point, step.quiz),
  };
}

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

const knapsackItems = ITEM_LABELS.map(
  (label, index) => `${label}(weight=${WEIGHTS[index]}, value=${VALUES[index]})`,
).join(' ');

function localizeKnapsackStep(step: Step<KnapsackExecPoint>): Step<KnapsackExecPoint> {
  const active = step.matrix?.active;
  const row = active?.[0] ?? 0;
  const capacity = active?.[1] ?? 0;
  const label = ITEM_LABELS[row - 1];
  const weight = WEIGHTS[row - 1];
  const value = VALUES[row - 1];
  const result = active ? step.matrix?.cells[row]?.[capacity] : undefined;
  const baseVars: VarRow[] = [
    { name: 'Capacity', value: CAPACITY },
    { name: 'Items', value: knapsackItems },
  ];

  if (step.point === 'init') {
    return {
      ...step,
      vars: baseVars,
      caption: 'With no items or zero capacity, the best value is 0.',
    };
  }

  if (step.point === 'done') {
    return {
      ...step,
      vars: [...baseVars, { name: 'Optimal value', value: result ?? 0 }],
      caption: `The bottom-right cell gives the optimal value ${result}: take items A and B.`,
    };
  }

  const current = `Item ${label} (weight=${weight}, value=${value}), capacity ${capacity}`;
  if (step.point === 'cellSkip') {
    return {
      ...step,
      vars: [
        ...baseVars,
        { name: 'Current', value: current },
        {
          name: 'Decision',
          value: `${weight} > ${capacity}; it does not fit, so copy ${result} from the row above`,
        },
      ],
      caption: `${label} does not fit at capacity ${capacity}; copy the value ${result} from the row above.`,
    };
  }

  const skip = step.matrix?.cells[row - 1]?.[capacity] ?? 0;
  const previous = step.matrix?.cells[row - 1]?.[capacity - weight] ?? 0;
  const take = Number(previous) + value;
  return {
    ...step,
    vars: [
      ...baseVars,
      { name: 'Current', value: current },
      {
        name: 'Decision',
        value: `max(skip=${skip}, take=${previous}+${value}=${take}) = ${result}`,
      },
    ],
    caption: `${label} fits: choose max(skip ${skip}, take ${take}) = ${result}.`,
  };
}

function localizeKmpStep(step: Step<KmpExecPoint>): Step<KmpExecPoint> {
  const track = step.kmp!;
  const i = track.compareText ?? track.text.length;
  const j = track.comparePat ?? 0;
  const textChar = track.text[i];
  const patternChar = track.pattern[j];
  const captions: Record<KmpExecPoint, () => string> = {
    start: () => 'Align the pattern with the start of the text; both pointers begin at 0.',
    match: () => `T[${i}] = P[${j}] = '${patternChar}', so advance both pointers.`,
    jump: () =>
      `T[${i}] = '${textChar}' differs from P[${j}] = '${patternChar}'; jump j to lps[${j - 1}] = ${track.lps[j - 1]} without rewinding i.`,
    advance: () =>
      `T[${i}] = '${textChar}' differs from P[0] = '${patternChar}' at j = 0, so advance the text pointer.`,
    found: () =>
      `The complete pattern matches at text index ${i - (track.pattern.length - 1)}; continue with the LPS fallback.`,
    done: () =>
      track.found.length
        ? `The scan is complete with ${track.found.length} match(es) at index ${track.found.join(', ')}.`
        : 'The scan is complete and the pattern was not found.',
  };

  return {
    ...step,
    vars: [
      { name: 'Text T', value: track.text },
      { name: 'Pattern P', value: track.pattern },
      { name: 'i (text)', value: `${i}` },
      { name: 'j (pattern)', value: `${j}` },
      { name: 'Matches', value: track.found.length ? track.found.join(', ') : 'None' },
    ],
    caption: captions[step.point](),
  };
}

function localizeFenwickSteps(steps: Step<FenwickExecPoint>[]): Step<FenwickExecPoint>[] {
  let updateStarted = false;
  return steps.map((step) => {
    const current = step.pointers[0] ? step.pointers[0].index + 1 : undefined;
    const treeValue = current ? step.array[current - 1]?.[1] : undefined;
    const sourceArray: VarRow = { name: 'Source array a', value: '[3, 2, 5, 1, 4, 2, 3, 1]' };

    if (step.point === 'init') {
      return {
        ...step,
        vars: [sourceArray, { name: 'Rule', value: 'tree[i] covers lowbit(i) values' }],
        caption:
          'Each bar is tree[1..8]. Prefix queries jump backward with i -= lowbit(i), while point updates jump forward with i += lowbit(i).',
      };
    }

    if (step.point === 'update') updateStarted = true;

    if (step.point === 'query' && current !== undefined) {
      const accumulated = valueOf(step, '累计');
      const next = current - lowbit(current);
      return {
        ...step,
        vars: [
          sourceArray,
          { name: 'Operation', value: updateStarted ? 'query(6), verify update' : 'query(6)' },
          { name: 'Accumulated', value: accumulated },
        ],
        caption: `At i=${current}, add tree[${current}]=${treeValue}; total=${accumulated}. Then jump to ${next}.`,
      };
    }

    if (step.point === 'update' && current !== undefined) {
      const next = current + lowbit(current);
      return {
        ...step,
        vars: [
          sourceArray,
          { name: 'Operation', value: 'update(3, +2)' },
          { name: 'tree[i]', value: treeValue ?? '-' },
        ],
        caption: `Add 2 to covering node tree[${current}], now ${treeValue}; jump forward to ${next > BIT_N ? 'done' : next}.`,
      };
    }

    return {
      ...step,
      vars: [sourceArray, { name: 'Complexity', value: 'query and update are both O(log n)' }],
      caption:
        'Both operations follow a lowbit chain, giving O(log n) updates and prefix queries in a compact structure.',
    };
  });
}

function hullCoordinate(step: Step<HullExecPoint>, index: number): string {
  const point = step.hull!.points[index];
  return `(${point.x},${point.y})`;
}

function localizeHullStep(step: Step<HullExecPoint>): Step<HullExecPoint> {
  const hull = step.hull!;
  const phase =
    hull.phase === 'lower' ? 'Lower hull' : hull.phase === 'upper' ? 'Upper hull' : 'Done';
  const stack = hull.stack.length
    ? hull.stack.map((index) => hullCoordinate(step, index)).join(' -> ')
    : 'Empty';
  const vars: VarRow[] = [
    { name: 'Points', value: `${hull.points.length}` },
    { name: 'Phase', value: phase },
    { name: 'Stack', value: stack },
  ];

  if (step.point === 'init') {
    return {
      ...step,
      vars,
      caption:
        'Sort the points by (x, y), then scan left to right to build the lower hull with cross-product turn tests.',
    };
  }

  if (step.point === 'done') {
    return {
      ...step,
      vars: [...vars, { name: 'Hull vertices', value: `${hull.finalHull?.length ?? 0}` }],
      caption: `The lower and upper chains form a closed convex polygon with ${hull.finalHull?.length ?? 0} vertices.`,
    };
  }

  const label = step.point === 'lower' ? 'Lower hull' : 'Upper hull';
  const current = hullCoordinate(step, hull.current!);
  const popped = hull.popped ?? [];
  return {
    ...step,
    vars,
    caption: popped.length
      ? `${label}: adding ${current} creates a non-left turn, so pop ${popped.map((index) => hullCoordinate(step, index)).join(', ')} before pushing it.`
      : `${label}: adding ${current} keeps a left turn, so push it directly.`,
  };
}

export const englishQuickSortModule: AlgorithmModule<QuickExecPoint> = {
  ...quickSortModule,
  title: 'Quick Sort',
  buildSteps: (input) => quickSortModule.buildSteps(input).map(localizeQuickStep),
  sources: translateSources(quickSortModule.sources),
  inputSpec: quickSortModule.inputSpec
    ? {
        ...quickSortModule.inputSpec,
        hint: 'Enter 2 to 12 integers from 1 to 99, separated by commas',
      }
    : undefined,
};

export const englishBsearchModule: AlgorithmModule<BsExecPoint> = {
  ...bsearchModule,
  title: 'Binary Search',
  buildSteps: (input) => bsearchModule.buildSteps(input).map(localizeBsearchStep),
  sources: translateSources(bsearchModule.sources),
};

export const englishDijkstraModule: AlgorithmModule<DijkstraExecPoint> = {
  ...dijkstraModule,
  title: "Dijkstra's Shortest Path",
  buildSteps: (input) => dijkstraModule.buildSteps(input).map(localizeDijkstraStep),
  sources: translateSources(dijkstraModule.sources),
};

export const englishKnapsackModule: AlgorithmModule<KnapsackExecPoint> = {
  ...knapsackModule,
  title: '0/1 Knapsack',
  buildSteps: (input) => knapsackModule.buildSteps(input).map(localizeKnapsackStep),
  sources: translateSources(knapsackModule.sources),
};

export const englishKmpModule: AlgorithmModule<KmpExecPoint> = {
  ...kmpModule,
  title: 'KMP String Matching',
  buildSteps: (input) => kmpModule.buildSteps(input).map(localizeKmpStep),
  sources: translateSources(kmpModule.sources),
};

export const englishFenwickModule: AlgorithmModule<FenwickExecPoint> = {
  ...fenwickModule,
  title: 'Fenwick Tree (Binary Indexed Tree)',
  buildSteps: (input) => localizeFenwickSteps(fenwickModule.buildSteps(input)),
  sources: translateSources(fenwickModule.sources),
};

export const englishConvexHullModule: AlgorithmModule<HullExecPoint> = {
  ...convexHullModule,
  title: 'Convex Hull',
  buildSteps: (input) => convexHullModule.buildSteps(input).map(localizeHullStep),
  sources: translateSources(convexHullModule.sources),
};
