import type {
  AlgorithmModule,
  MazeExecPoint,
  MazeTrack,
  Step,
  VarRow,
} from '@/components/player/types';
import { MAZE_GRID, MAZE_START, MAZE_GOAL, MAZE_DIRS } from './maze';
import { mazeSources } from './maze.sources';

/** 固定 5×5 迷宫网格 DFS + 回溯细粒度重走，产出迷宫轨胖步骤 */
export function buildMazeSteps(): Step<MazeExecPoint>[] {
  const rows = MAZE_GRID.length;
  const cols = MAZE_GRID[0].length;
  const walls = MAZE_GRID.map((row) => row.map((v) => v === 1));
  const key = (r: number, c: number) => r + ',' + c;
  const isGoal = (r: number, c: number) => r === MAZE_GOAL[0] && c === MAZE_GOAL[1];
  const open = (r: number, c: number) =>
    r >= 0 && r < rows && c >= 0 && c < cols && MAZE_GRID[r][c] === 0;

  const steps: Step<MazeExecPoint>[] = [];
  const visited = new Set<string>();
  const visitedList: [number, number][] = [];
  const path: [number, number][] = [];
  let solved = false;

  const cur = (): [number, number] | null => (path.length ? path[path.length - 1] : null);

  const vars = (): VarRow[] => {
    const cc = cur();
    return [
      { name: '起点', value: `(${MAZE_START[0]},${MAZE_START[1]})` },
      { name: '终点', value: `(${MAZE_GOAL[0]},${MAZE_GOAL[1]})` },
      { name: '当前格', value: cc ? `(${cc[0]},${cc[1]})` : '-' },
      { name: '路径长', value: `${path.length}` },
      { name: '已访问', value: `${visitedList.length}` },
    ];
  };

  const emit = (point: MazeExecPoint, caption: string, solvedFlag = false): void => {
    const maze: MazeTrack = {
      rows,
      cols,
      walls,
      start: MAZE_START,
      goal: MAZE_GOAL,
      current: cur(),
      path: path.map((p) => [p[0], p[1]] as [number, number]),
      visited: visitedList.map((p) => [p[0], p[1]] as [number, number]),
      solved: solvedFlag,
    };
    steps.push({ array: [], pointers: [], emphasis: {}, vars: vars(), point, maze, caption });
  };

  const dfs = (r: number, c: number, isStart: boolean): boolean => {
    visited.add(key(r, c));
    visitedList.push([r, c]);
    path.push([r, c]);
    if (isStart) {
      emit('start', `从起点 (${r},${c}) 出发，找终点 (${MAZE_GOAL[0]},${MAZE_GOAL[1]})`);
    } else {
      emit('move', `前进到 (${r},${c})`);
    }
    if (isGoal(r, c)) {
      solved = true;
      emit('goal', `到达终点 (${r},${c}) 🚩！找到一条路径`);
      return true;
    }
    const avail = MAZE_DIRS.map(([dr, dc]) => [r + dr, c + dc]).filter(
      ([nr, nc]) => open(nr, nc) && !visited.has(key(nr, nc)),
    );
    if (avail.length === 0) {
      emit('deadend', `(${r},${c}) 四周都走不通：死路，需要回溯`);
    }
    for (const [dr, dc] of MAZE_DIRS) {
      const nr = r + dr;
      const nc = c + dc;
      if (open(nr, nc) && !visited.has(key(nr, nc))) {
        if (dfs(nr, nc, false)) return true;
      }
    }
    path.pop();
    if (!solved) {
      const cc = cur();
      emit('backtrack', `退回到上一格${cc ? ` (${cc[0]},${cc[1]})` : ''}，换个方向再试`);
    }
    return false;
  };

  dfs(MAZE_START[0], MAZE_START[1], true);
  emit('done', `找到路径：起点 → 终点，共 ${path.length} 格（绿色为解路径）`, true);
  return steps;
}

export const mazeModule: AlgorithmModule<MazeExecPoint> = {
  title: '迷宫寻路',
  initialInput: () => [],
  buildSteps: () => buildMazeSteps(),
  sources: mazeSources,
};
