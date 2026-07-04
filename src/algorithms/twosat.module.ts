import type {
  AlgorithmModule,
  GraphTrack,
  Step,
  TwoSatExecPoint,
  VarRow,
} from '@/components/player/types';
import {
  TS_VARS,
  TS_N,
  TS_NL,
  TS_VERTS,
  TS_CLAUSES,
  clauseLabel,
  nodeLabel,
  twoSatImplications,
  twoSatTarjan,
  twoSatSolve,
} from './twosat';
import { twoSatSources } from './twosat.sources';

const IMPL = twoSatImplications(); // 8 条蕴含边 [from,to][]（按子句序，每子句 2 条）
const KEY = (e: [number, number]): string => `${e[0]}-${e[1]}`;

/** 固定 3 变量 4 子句 2-SAT 逐阶段重走，产出图轨胖步骤（复用 GraphView）。
 *  init 列节点 → clause 逐条加蕴含边 → scc 逐个 SCC 着色（复用 Tarjan）→ check 逐变量判定同组 → assign 逐变量赋值。 */
export function buildTwoSatSteps(): Step<TwoSatExecPoint>[] {
  const { comp, sccs } = twoSatTarjan();
  const { assign } = twoSatSolve();
  const steps: Step<TwoSatExecPoint>[] = [];

  let edgeCount = 0; // 已加入的蕴含边数
  const nodeGroup: (number | null)[] = new Array<number | null>(TS_NL).fill(null); // 已上色 SCC
  const nodeBadge: (string | null)[] = new Array<string | null>(TS_NL).fill(null); // 赋值 badge

  const solved = TS_VARS.map((name, v) => `${name}=${assign[v] ? '真' : '假'}`).join('、');
  const baseVars = (): VarRow[] => [
    { name: '变量', value: `${TS_N}（${TS_VARS.join(',')}）` },
    { name: '子句', value: TS_CLAUSES.map(clauseLabel).join(' ∧ ') },
    { name: '蕴含边', value: `${edgeCount} / ${IMPL.length}` },
  ];

  const emit = (
    point: TwoSatExecPoint,
    caption: string,
    opts: {
      edgeClass?: Record<string, string>;
      checkPair?: [number, number] | null;
      extra?: VarRow[];
    } = {},
  ): void => {
    const edges = IMPL.slice(0, edgeCount).map((e) => ({ key: KEY(e), from: e[0], to: e[1] }));
    const graph: GraphTrack = {
      vertices: TS_VERTS,
      edges,
      directed: true,
      nodeGroup: [...nodeGroup],
      nodeBadge: [...nodeBadge],
      checkPair: opts.checkPair ?? null,
      edgeClass: opts.edgeClass,
    };
    steps.push({
      array: [],
      pointers: [],
      emphasis: {},
      vars: [...baseVars(), ...(opts.extra ?? [])],
      point,
      graph,
      caption,
    });
  };

  emit(
    'init',
    `变量 ${TS_VARS.join(',')} 各拆成两个文字节点（上排正 x、下排负 ¬x），共 ${TS_NL} 个；接下来把每条子句翻成蕴含边`,
  );

  // clause ×4：每条子句 (a∨b) 加两条蕴含边 ¬a→b、¬b→a
  TS_CLAUSES.forEach((c, ci) => {
    const e1 = IMPL[2 * ci];
    const e2 = IMPL[2 * ci + 1];
    edgeCount += 2;
    emit(
      'clause',
      `子句 ${clauseLabel(c)} ⟹ 两条蕴含：${nodeLabel(e1[0])}→${nodeLabel(e1[1])}、${nodeLabel(e2[0])}→${nodeLabel(e2[1])}（“或”真 ⟺ 一个假则另一个必真）`,
      { edgeClass: { [KEY(e1)]: 'current', [KEY(e2)]: 'current' } },
    );
  });

  // scc ×4：复用 Tarjan，按发现序逐个 SCC 着色
  sccs.forEach((group, si) => {
    for (const w of group) nodeGroup[w] = comp[w];
    const names = group.map(nodeLabel).join(',');
    const insight =
      group.length > 1
        ? `——{${names}} 同组：这些文字相互蕴含、被逼到同真同假`
        : `——{${names}} 自成一组`;
    emit('scc', `Tarjan（第 7 页）弹出第 ${si + 1} 个强连通分量 {${names}}${insight}`, {
      extra: [{ name: '已着色 SCC', value: `${si + 1} / ${sccs.length}` }],
    });
  });

  // check ×3：逐变量确认 x 与 ¬x 不同 SCC → 可满足
  for (let v = 0; v < TS_N; v++) {
    const px = 2 * v;
    const nx = 2 * v + 1;
    emit(
      'check',
      `判定变量 ${TS_VARS[v]}：${nodeLabel(px)}∈SCC${comp[px]}、${nodeLabel(nx)}∈SCC${comp[nx]}，不同组 ✓（若同组则“真”“假”相互蕴含 → 无解）`,
      {
        checkPair: [px, nx],
        extra: [{ name: '判定', value: `${TS_VARS[v]}: ${comp[px]}≠${comp[nx]}` }],
      },
    );
  }

  // assign ×3：逐变量按 comp 逆拓扑序赋值，正文字节点 badge 真/假
  for (let v = 0; v < TS_N; v++) {
    const px = 2 * v;
    const nx = 2 * v + 1;
    const val = assign[v];
    nodeBadge[px] = val ? '真' : '假';
    emit(
      'assign',
      `${TS_VARS[v]} = ${val ? '真' : '假'}：comp[${nodeLabel(px)}]=${comp[px]} ${val ? '<' : '>'} comp[${nodeLabel(nx)}]=${comp[nx]}，取拓扑序更靠后的文字为真`,
      {
        extra: [
          {
            name: '当前解',
            value: `${TS_VARS.slice(0, v + 1)
              .map((name, i) => `${name}=${assign[i] ? '真' : '假'}`)
              .join(' ')}`,
          },
        ],
      },
    );
  }

  emit('done', `2-SAT 可满足！解：${solved}（代回四条子句全为真）`, {
    extra: [
      { name: '解', value: TS_VARS.map((name, v) => `${name}=${assign[v] ? 'T' : 'F'}`).join(' ') },
    ],
  });
  return steps;
}

export const twoSatModule: AlgorithmModule<TwoSatExecPoint> = {
  title: '2-SAT（布尔可满足性）',
  initialInput: () => [],
  buildSteps: () => buildTwoSatSteps(),
  sources: twoSatSources,
};
