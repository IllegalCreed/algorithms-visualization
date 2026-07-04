import type {
  AlgorithmModule,
  AstarExecPoint,
  MazeTrack,
  Step,
  VarRow,
} from '@/components/player/types';
import { AS_ROWS, AS_COLS, AS_WALLS, AS_START, AS_GOAL, astarTrace, bfsInfo } from './astar';
import { astarSources } from './astar.sources';

const cellTxt = ([r, c]: [number, number]): string => `(${r}, ${c})`;

/** 固定 4×6 网格 A* 逐扩展重走，产出迷宫轨胖步骤（纯复用 MazeView 第 4 消费者）。
 *  letters 复用为 f 值标注；visited=closed；current=本步弹出格；终局 path+solved 绿。 */
export function buildAstarSteps(): Step<AstarExecPoint>[] {
  const tr = astarTrace();
  const bfs = bfsInfo();
  const steps: Step<AstarExecPoint>[] = [];

  const walls: boolean[][] = Array.from({ length: AS_ROWS }, (_, r) =>
    Array.from({ length: AS_COLS }, (_, c) => AS_WALLS.some(([wr, wc]) => wr === r && wc === c)),
  );
  const letters: string[][] = Array.from({ length: AS_ROWS }, () =>
    new Array<string>(AS_COLS).fill(''),
  );
  const visited: [number, number][] = [];

  const emit = (
    point: AstarExecPoint,
    o: { current?: [number, number] | null; path?: [number, number][]; solved?: boolean },
    caption: string,
    extra: VarRow[] = [],
  ): void => {
    const maze: MazeTrack = {
      rows: AS_ROWS,
      cols: AS_COLS,
      walls: walls.map((row) => [...row]),
      start: AS_START,
      goal: AS_GOAL,
      current: o.current ?? null,
      path: o.path ?? [],
      visited: visited.map((v) => [...v] as [number, number]),
      solved: o.solved ?? false,
      letters: letters.map((row) => [...row]),
      mark: '🧭',
    };
    const vars: VarRow[] = [{ name: '规则', value: 'f = g + h（h = 曼哈顿距离）' }, ...extra];
    steps.push({ array: [], pointers: [], emphasis: {}, vars, point, maze, caption });
  };

  letters[AS_START[0]][AS_START[1]] = '6';
  emit(
    'init',
    {},
    `找 S 到 🚩 的最短路。BFS 不认方向地洪泛，A* 给每格打分 f = g + h：g 是起点到此的实际步数，h 是到终点的曼哈顿估计——每次扩展 f 最小的格子，朝终点「有方向感」地推进`,
    [
      { name: 'open', value: `{ ${cellTxt(AS_START)} f=6 }` },
      { name: '已扩展', value: '0' },
    ],
  );

  let openSize = 1;
  tr.expansions.forEach((e, k) => {
    visited.push(e.cell);
    openSize -= 1;
    for (const o of e.opened) {
      letters[o.cell[0]][o.cell[1]] = String(o.f);
      openSize += 1;
    }
    const isGoal = e.cell[0] === AS_GOAL[0] && e.cell[1] === AS_GOAL[1];
    const extra: VarRow[] = [
      { name: '弹出', value: `${cellTxt(e.cell)}：g=${e.g}, h=${e.h}, f=${e.f}` },
      { name: 'open 大小', value: `${openSize}` },
      { name: '已扩展', value: `${k + 1}` },
    ];
    if (isGoal) {
      emit(
        'goal',
        { current: e.cell },
        `弹出的正是终点 ${cellTxt(e.cell)}（f = g = 8，h = 0）——A* 在终点出队时结束：此刻它的 g 已是最短距离`,
        extra,
      );
    } else {
      const openedTxt = e.opened.length
        ? `开邻居 ${e.opened.map((o) => `${cellTxt(o.cell)} f=${o.f}`).join('、')}`
        : '无新邻居可开（被墙与 closed 围住）';
      emit(
        'expand',
        { current: e.cell },
        `第 ${k + 1} 次扩展：弹出 f 最小的 ${cellTxt(e.cell)}（g=${e.g}+h=${e.h}→f=${e.f}），${openedTxt}${k === 3 ? '——直奔的 f=6 队伍撞墙耗尽，接下来 f 抬到 8、绕行下侧' : ''}`,
        extra,
      );
    }
  });

  emit(
    'trace',
    { path: tr.path, solved: true },
    `从终点沿 parent 指针回溯：${tr.path.length - 1} 步最优路径点亮——恰好等于 BFS 算出的最短距离，但代价小得多`,
    [{ name: '路径', value: `${tr.path.length - 1} 步` }],
  );

  emit(
    'done',
    { path: tr.path, solved: true },
    `A* 只扩展了 ${tr.expansions.length} 格；BFS 要洪泛全部 ${bfs.reachable} 个可达格。省的来源是 h：只要 h 从不高估真实剩余距离（可采纳，曼哈顿在 4 向网格正是如此），A* 保证最优。游戏寻路、导航、机器人规划的标配`,
    [
      { name: 'A* 扩展', value: `${tr.expansions.length}` },
      { name: 'BFS 可达', value: `${bfs.reachable}` },
    ],
  );
  return steps;
}

export const astarModule: AlgorithmModule<AstarExecPoint> = {
  title: 'A* 寻路（启发式搜索）',
  initialInput: () => [],
  buildSteps: () => buildAstarSteps(),
  sources: astarSources,
};
