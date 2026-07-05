import type {
  AlgorithmModule,
  EulerExecPoint,
  GraphTrack,
  Step,
  VarRow,
} from '@/components/player/types';
import { EULER_EDGES, eulerTrace } from './euler';
import { eulerSources } from './euler.sources';

const VERTS = [
  { id: 0, label: '0', x: 340, y: 60 },
  { id: 1, label: '1', x: 120, y: 60 },
  { id: 2, label: '2', x: 230, y: 150 },
  { id: 3, label: '3', x: 120, y: 240 },
  { id: 4, label: '4', x: 340, y: 240 },
];

const keyOf = (u: number, v: number): string => (u < v ? `${u}-${v}` : `${v}-${u}`);
const EDGES = EULER_EDGES.map(([u, v]) => ({ key: keyOf(u, v), from: u, to: v }));

/** 固定 5 节点 7 边无向图的 Hierholzer 重放，产出图轨胖步骤（纯复用 GraphView 第 10 消费者）。
 *  消边渐绿 + 徽标显剩余度数（清零即卡住）+ 栈上虚线环；卡住弹栈进路径、栈顶余边续走子环。 */
export function buildEulerSteps(): Step<EulerExecPoint>[] {
  const { deg, odd, start, events, path } = eulerTrace();
  const steps: Step<EulerExecPoint>[] = [];

  const remain = [...deg];
  const edgeClass: Record<string, string> = {};
  let stack: number[] = [start];
  let outPath: number[] = [];

  const emit = (
    point: EulerExecPoint,
    o: { badge?: boolean; check?: boolean; current?: string | null },
    caption: string,
    extra: VarRow[] = [],
  ): void => {
    const graph: GraphTrack = {
      vertices: VERTS,
      edges: EDGES,
      directed: false,
      nodeBadge: o.badge ? remain.map((d) => `${d}`) : undefined,
      activeNode: stack.length ? stack[stack.length - 1] : null,
      edgeClass: { ...edgeClass, ...(o.current ? { [o.current]: 'current' } : {}) },
      stackNodes: [...new Set(stack)],
      checkPair: o.check ? [odd[0], odd[1]] : null,
    };
    const vars: VarRow[] = [
      { name: '栈', value: stack.length ? stack.join(' → ') : '（空）' },
      { name: '路径', value: outPath.length ? outPath.join(' → ') : '（空）' },
      ...extra,
    ];
    steps.push({ array: [], pointers: [], emphasis: {}, vars, point, graph, caption });
  };

  stack = [];
  emit(
    'init',
    {},
    `一笔画：每条边恰好走一次，笔不离纸——能不能画完这 7 条边？这就是欧拉路径（起点终点可以不同；相同则叫欧拉回路）。Hierholzer 算法边走边消，O(E) 一次搞定`,
    [{ name: '目标', value: '7 条边各走一次' }],
  );

  stack = [start];
  emit(
    'check',
    { badge: true, check: true },
    `先判定再动笔：每个点的度数（蓝环 = 奇度点）。定理：连通图有欧拉路径 ⟺ 奇度点恰 0 个（回路）或 2 个（路径）。这里奇度点是 ${odd.join('、')} —— 必须从其一出发、终于另一个。从 ${start} 出发`,
    [{ name: '度数', value: `[${deg.join(', ')}]，奇度点 {${odd.join(', ')}}` }],
  );

  for (const ev of events) {
    if (ev.type === 'walk') {
      const k = keyOf(ev.from, ev.to);
      remain[ev.from]--;
      remain[ev.to]--;
      stack = [...ev.stack];
      emit(
        'walk',
        { badge: true, current: k },
        `沿未用边走：${ev.from} → ${ev.to}，这条边用掉（消边），${ev.to} 压栈。徽标 = 剩余未用边数——减到 0 这个点就走不动了`,
        [{ name: '刚消的边', value: `${ev.from}-${ev.to}` }],
      );
      edgeClass[k] = 'mst';
    } else if (outPath.length === 0) {
      stack = [...ev.stack];
      outPath = [...ev.path];
      emit(
        'back',
        { badge: true },
        `卡住！${ev.node} 的边全用光（徽标 0）、走不动了——弹栈：${ev.node} 收进路径。但栈顶 ${stack[stack.length - 1]} 还有余边——从它接着走，走出的「子环」会自动插进路径`,
        [{ name: '弹出', value: `${ev.node}` }],
      );
    }
  }

  const lastBacks = events.filter((e) => e.type === 'back');
  const finalBack = lastBacks[lastBacks.length - 1];
  stack = [];
  outPath = finalBack.type === 'back' ? [...finalBack.path] : outPath;
  emit(
    'back',
    { badge: true },
    `又卡住（2 的边也用光）——此后每个点都走不动，连环弹栈直到清空：弹出序 ${outPath.join(' → ')}。反转它，就是答案`,
    [{ name: '弹出序', value: outPath.join(' → ') }],
  );

  outPath = [...path];
  emit(
    'done',
    {},
    `一笔画完成：${path.join(' → ')}——7 条边各走一次、起终恰是两个奇度点。Hierholzer 每条边恰进出栈一次，O(E)。一笔画之外：DNA 测序拼接（de Bruijn 图找欧拉路径）、扫街/邮递员路线（中国邮递员问题）都是它`,
    [{ name: '欧拉路径', value: path.join(' → ') }],
  );
  return steps;
}

export const eulerModule: AlgorithmModule<EulerExecPoint> = {
  title: '欧拉路径（Hierholzer 一笔画）',
  initialInput: () => [],
  buildSteps: () => buildEulerSteps(),
  sources: eulerSources,
};
