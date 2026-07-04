import type {
  AcExecPoint,
  AlgorithmModule,
  GraphTrack,
  Step,
  VarRow,
} from '@/components/player/types';
import { AC_PATTERNS, AC_TEXT, AC_VERTS, buildAc, acMatch } from './ahocorasick';
import { ahoCorasickSources } from './ahocorasick.sources';

type Edge = { key: string; from: number; to: number };

/** 固定 {he,she,hers}+"ushers" AC 自动机逐阶段重走，产出图轨胖步骤（复用 GraphView）。
 *  insert 建 Trie（节点+trie 边浮现）→ fail BFS 建 fail（非平凡画虚线边）→ match 文本匹配（fail 跳 + 输出链重叠命中）。 */
export function buildAcSteps(): Step<AcExecPoint>[] {
  const { states, bfsOrder } = buildAc();
  const steps: Step<AcExecPoint>[] = [];

  const revealed = new Set<number>([0]); // 已显示的状态节点（root 起）
  const trieEdges: Edge[] = []; // 已显示 trie 边
  const failEdges: Edge[] = []; // 已显示非平凡 fail 边（虚线）
  const nodeBadge: (string | null)[] = new Array<string | null>(states.length).fill(null);
  const hits: { pat: string; start: number; end: number }[] = [];

  const label = (id: number): string => states[id].label;
  // edgeClass：所有 fail 边标 'fail'（虚线紫），当前边覆盖为 'current'（琥珀）
  const edgeClassOf = (current: string | null): Record<string, string> => {
    const ec: Record<string, string> = {};
    for (const e of failEdges) ec[e.key] = 'fail';
    if (current) ec[current] = 'current';
    return ec;
  };
  const emit = (
    point: AcExecPoint,
    activeNode: number | null,
    current: string | null,
    caption: string,
    extra: VarRow[] = [],
  ): void => {
    const graph: GraphTrack = {
      vertices: AC_VERTS.filter((v) => revealed.has(v.id)),
      edges: [...trieEdges, ...failEdges],
      directed: true,
      nodeBadge: [...nodeBadge],
      activeNode,
      edgeClass: edgeClassOf(current),
    };
    const vars: VarRow[] = [
      { name: '模式集', value: `{${AC_PATTERNS.join(', ')}}` },
      { name: '文本', value: AC_TEXT },
      ...extra,
    ];
    steps.push({ array: [], pointers: [], emphasis: {}, vars, point, graph, caption });
  };

  // ① insert ×3：逐模式插入 Trie
  AC_PATTERNS.forEach((pat) => {
    let s = 0;
    let lastKey: string | null = null;
    for (const c of pat) {
      const v = states[s].goto[c];
      if (!revealed.has(v)) {
        revealed.add(v);
        const key = `${s}-${v}`;
        trieEdges.push({ key, from: s, to: v });
        lastKey = key;
      }
      s = v;
    }
    nodeBadge[s] = pat; // 终止状态标模式名
    emit(
      'insert',
      s,
      lastKey,
      `插入模式 "${pat}"：沿 root 摊成一条路径到状态 "${label(s)}"，末状态标记为模式终点`,
      [{ name: '已建状态', value: `${revealed.size} / ${states.length}` }],
    );
  });

  // ② fail ×7：BFS 序逐状态算 fail（父的 fail 先算好）
  bfsOrder.forEach((u) => {
    const f = states[u].fail;
    if (f !== 0) {
      const key = `${u}-${f}-f`;
      failEdges.push({ key, from: u, to: f });
      emit(
        'fail',
        u,
        key,
        `状态 "${label(u)}"：沿父的 fail 找 '${states[u].char}' 转移 → fail = "${label(f)}"（虚线）；"${label(u)}" 的最长真后缀恰是 "${label(f)}"`,
        [{ name: '非平凡 fail 边', value: `${failEdges.length}` }],
      );
    } else {
      emit(
        'fail',
        u,
        null,
        `状态 "${label(u)}"：没有更短的匹配后缀 → fail = root（默认，不画边）`,
        [{ name: '非平凡 fail 边', value: `${failEdges.length}` }],
      );
    }
  });

  // ③ match ×6：文本逐字符走自动机
  let s = 0;
  for (let i = 0; i < AC_TEXT.length; i++) {
    const c = AC_TEXT[i];
    const jumped: number[] = [];
    while (s !== 0 && states[s].goto[c] === undefined) {
      const prev = s;
      s = states[s].fail;
      jumped.push(prev);
    }
    const from = s;
    s = states[s].goto[c] ?? 0;
    const curKey =
      jumped.length && from !== 0
        ? `${jumped[jumped.length - 1]}-${from}-f`
        : states[from].goto[c] === s && s !== 0
          ? `${from}-${s}`
          : null;
    const out = states[s].out;
    const jumpTxt = jumped.length
      ? `"${label(jumped[0])}" 无 '${c}' 转移 → 沿 fail 跳到 "${label(from)}" → `
      : '';
    if (out.length) {
      for (const pi of out) {
        const L = AC_PATTERNS[pi].length;
        hits.push({ pat: AC_PATTERNS[pi], start: i - L + 1, end: i });
      }
      const rep = out.map((pi) => `${AC_PATTERNS[pi]}[${i - AC_PATTERNS[pi].length + 1},${i}]`);
      emit(
        'hit',
        s,
        curKey,
        `读 '${c}'（i=${i}）：${jumpTxt}到达 "${label(s)}" → 命中 ${rep.join('、')}${out.length > 1 ? '（含沿输出链的重叠命中）' : ''}`,
        [
          { name: '当前状态', value: label(s) },
          { name: '已命中', value: `${hits.length}` },
        ],
      );
    } else {
      emit(
        'match',
        s,
        curKey,
        `读 '${c}'（i=${i}）：${jumpTxt}${s === 0 ? '回到 root' : `到达 "${label(s)}"`}`,
        [
          { name: '当前状态', value: label(s) },
          { name: '已命中', value: `${hits.length}` },
        ],
      );
    }
  }

  // ④ done：汇总命中
  const summary = hits.map((h) => `${h.pat}[${h.start},${h.end}]`).join('、');
  emit(
    'done',
    null,
    null,
    `匹配结束：在 "${AC_TEXT}" 中命中 ${summary}（三处重叠，一趟 O(n+m+z)）`,
    [{ name: '全部命中', value: summary }],
  );
  return steps;
}

// 供 spec 对拍
export { acMatch };

export const ahoCorasickModule: AlgorithmModule<AcExecPoint> = {
  title: 'AC 自动机（Aho-Corasick）',
  initialInput: () => [],
  buildSteps: () => buildAcSteps(),
  sources: ahoCorasickSources,
};
