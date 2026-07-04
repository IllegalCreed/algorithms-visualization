import type {
  AlgorithmModule,
  IslandsExecPoint,
  MazeTrack,
  Step,
  VarRow,
} from '@/components/player/types';
import { ISLAND_GRID, ISLAND_DIRS } from './islands';
import { islandsSources } from './islands.sources';

const MARK = '🔎';

/** 固定网格逐格扫描 + DFS Flood Fill 细粒度重走，产出网格轨胖步骤（复用 MazeView，第 2 消费者）。
 *  水为墙（深色）、已数陆地为绿（filled）、当前扫描格琥珀 + 🔎；数出四连通陆地块个数。 */
export function buildIslandsSteps(): Step<IslandsExecPoint>[] {
  const grid = ISLAND_GRID;
  const rows = grid.length;
  const cols = grid[0].length;
  const walls = grid.map((row) => row.map((v) => v === 0)); // 水 = 墙
  const key = (r: number, c: number) => r + ',' + c;
  const inBounds = (r: number, c: number) => r >= 0 && r < rows && c >= 0 && c < cols;

  const steps: Step<IslandsExecPoint>[] = [];
  const filled: [number, number][] = [];
  const filledSet = new Set<string>();
  let count = 0;

  const vars = (cur: [number, number] | null): VarRow[] => [
    { name: '网格', value: `${rows}×${cols}（1=陆地/0=水）` },
    { name: '当前格', value: cur ? `(${cur[0]},${cur[1]})` : '-' },
    { name: '岛屿数', value: `${count}` },
    { name: '已数陆地', value: `${filled.length}` },
  ];
  const emit = (point: IslandsExecPoint, cur: [number, number] | null, caption: string): void => {
    const maze: MazeTrack = {
      rows,
      cols,
      walls,
      current: cur,
      filled: filled.map((p) => [p[0], p[1]] as [number, number]),
      mark: MARK,
    };
    steps.push({ array: [], pointers: [], emphasis: {}, vars: vars(cur), point, maze, caption });
  };

  const add = (r: number, c: number): void => {
    filled.push([r, c]);
    filledSet.add(key(r, c));
  };

  // Flood Fill：从已入岛的 (r,c) 出发，把四连通的未访问陆地逐格并入当前岛
  const flood = (r: number, c: number): void => {
    for (const [dr, dc] of ISLAND_DIRS) {
      const nr = r + dr;
      const nc = c + dc;
      if (inBounds(nr, nc) && grid[nr][nc] === 1 && !filledSet.has(key(nr, nc))) {
        add(nr, nc);
        emit(
          'flood',
          [nr, nc],
          `Flood Fill：并入四连通陆地 (${nr},${nc}) → 当前岛第 ${filled.length} 格`,
        );
        flood(nr, nc);
      }
    }
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 0) {
        emit('scan', [r, c], `扫描 (${r},${c})：是水，跳过`);
      } else if (filledSet.has(key(r, c))) {
        emit('scan', [r, c], `扫描 (${r},${c})：陆地，但已属某个岛屿，跳过`);
      } else {
        count++;
        add(r, c);
        emit(
          'found',
          [r, c],
          `扫描 (${r},${c})：发现未访问陆地 → 第 ${count} 个岛屿，从这里 Flood Fill`,
        );
        flood(r, c);
      }
    }
  }

  emit('done', null, `扫描完毕：网格里共有 ${count} 个岛屿（绿色为已数出的陆地）`);
  return steps;
}

export const islandsModule: AlgorithmModule<IslandsExecPoint> = {
  title: '岛屿数量',
  initialInput: () => [],
  buildSteps: () => buildIslandsSteps(),
  sources: islandsSources,
};
