import type {
  AlgorithmModule,
  BoardTrack,
  NQueensExecPoint,
  Step,
  VarRow,
} from '@/components/player/types';
import { QUEENS_N } from './queens';
import { queensSources } from './queens.sources';

/** 固定 N=4 逐列回溯细粒度重走（试探/冲突/放置/回溯/求解），产出棋盘轨胖步骤 */
export function buildQueensSteps(): Step<NQueensExecPoint>[] {
  const n = QUEENS_N;
  const queens: (number | null)[] = Array(n).fill(null);
  const steps: Step<NQueensExecPoint>[] = [];

  const board = (opts: {
    tryCell?: [number, number] | null;
    conflictCells?: [number, number][];
  }): BoardTrack => ({
    n,
    queens: [...queens],
    tryCell: opts.tryCell ?? null,
    conflictCells: opts.conflictCells ?? [],
  });
  const label = (i: number) => String.fromCharCode(65 + i); // 列 A B C D
  const vars = (extra: VarRow[] = []): VarRow[] => [
    { name: '棋盘', value: `${n}×${n}` },
    {
      name: '已放皇后',
      value:
        queens
          .map((r, c) => (r === null ? null : `${label(c)}${r + 1}`))
          .filter(Boolean)
          .join(' ') || '-',
    },
    ...extra,
  ];
  const emit = (point: NQueensExecPoint, b: BoardTrack, v: VarRow[], caption: string) => {
    steps.push({ array: [], pointers: [], emphasis: {}, vars: v, point, board: b, caption });
  };

  // 与已放皇后（列 < col）的冲突：同行 or 同对角
  const conflictsOf = (row: number, col: number): [number, number][] => {
    const out: [number, number][] = [];
    for (let c = 0; c < col; c++) {
      const r = queens[c];
      if (r !== null && (r === row || Math.abs(r - row) === Math.abs(c - col))) out.push([r, c]);
    }
    return out;
  };

  emit('init', board({}), vars(), `空棋盘，从第 A 列开始逐列放皇后`);

  const solve = (col: number): boolean => {
    if (col === n) {
      emit(
        'solved',
        board({}),
        vars([{ name: '结果', value: '找到一个解！' }]),
        `4 个皇后互不攻击——找到一个解！`,
      );
      return true;
    }
    for (let row = 0; row < n; row++) {
      const conf = conflictsOf(row, col);
      if (conf.length > 0) {
        emit(
          'tryConflict',
          board({ tryCell: [row, col], conflictCells: conf }),
          vars([{ name: '尝试', value: `第 ${label(col)} 列放第 ${row + 1} 行 → 冲突` }]),
          `第 ${label(col)} 列试第 ${row + 1} 行：与已放皇后冲突（红），换下一行`,
        );
        continue;
      }
      queens[col] = row;
      emit(
        'place',
        board({ tryCell: [row, col] }),
        vars([{ name: '放置', value: `第 ${label(col)} 列 → 第 ${row + 1} 行` }]),
        `第 ${label(col)} 列第 ${row + 1} 行不冲突：放下皇后 ♛`,
      );
      if (solve(col + 1)) return true;
      queens[col] = null;
      emit(
        'backtrack',
        board({ tryCell: [row, col] }),
        vars([{ name: '回溯', value: `撤掉第 ${label(col)} 列的皇后` }]),
        `后面走不通：撤掉第 ${label(col)} 列第 ${row + 1} 行的皇后，回溯`,
      );
    }
    return false;
  };

  solve(0);
  return steps;
}

export const queensModule: AlgorithmModule<NQueensExecPoint> = {
  title: 'N 皇后',
  initialInput: () => [],
  buildSteps: () => buildQueensSteps(),
  sources: queensSources,
};
