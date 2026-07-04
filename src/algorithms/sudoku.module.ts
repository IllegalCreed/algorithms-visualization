import type {
  AlgorithmModule,
  Step,
  SudokuExecPoint,
  SudokuTrack,
  VarRow,
} from '@/components/player/types';
import { SUDOKU_N, SUDOKU_BOX, SUDOKU_PUZZLE, sudokuValid } from './sudoku';
import { sudokuSources } from './sudoku.sources';

/** 固定 4×4 迷你数独约束回溯逐事件重走，产出数独轨胖步骤（新建 SudokuView，第 14 轨）。
 *  按行列序找空格，试填 1..n 做行/列/宫约束检查：合法则填入下探，冲突换下一个，一格都填不了就撤销回退。 */
export function buildSudokuSteps(): Step<SudokuExecPoint>[] {
  const n = SUDOKU_N;
  const box = SUDOKU_BOX;
  const work = SUDOKU_PUZZLE.map((row) => [...row]); // 数值盘，0=空
  const given = SUDOKU_PUZZLE.map((row) => row.map((v) => v !== 0));
  const blanks: [number, number][] = [];
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (work[r][c] === 0) blanks.push([r, c]);

  const steps: Step<SudokuExecPoint>[] = [];
  let solved = false;

  const snapshot = (): (number | null)[][] =>
    work.map((row) => row.map((v) => (v === 0 ? null : v)));
  const vars = (cur: [number, number] | null, filled: number): VarRow[] => [
    { name: '盘', value: `${n}×${n}（${box}×${box} 宫）` },
    { name: '当前格', value: cur ? `(${cur[0]},${cur[1]})` : '-' },
    { name: '已填空格', value: `${filled} / ${blanks.length}` },
  ];
  const emit = (
    point: SudokuExecPoint,
    cur: [number, number] | null,
    tryNum: number | null,
    status: SudokuTrack['status'],
    filled: number,
    caption: string,
  ): void => {
    const sudoku: SudokuTrack = {
      n,
      box,
      given: given.map((row) => [...row]),
      grid: snapshot(),
      current: cur,
      tryNum,
      status,
      solved,
    };
    steps.push({
      array: [],
      pointers: [],
      emphasis: {},
      vars: vars(cur, filled),
      point,
      sudoku,
      caption,
    });
  };

  emit(
    'init',
    null,
    null,
    null,
    0,
    `初始盘：加粗为给定数字，共 ${blanks.length} 个空格待填（每空格试填 1..${n}，行/列/宫不重复）`,
  );

  const dfs = (k: number, filled: number): boolean => {
    if (k === blanks.length) {
      solved = true;
      return true;
    }
    const [r, c] = blanks[k];
    for (let v = 1; v <= n; v++) {
      if (sudokuValid(work, r, c, v)) {
        work[r][c] = v;
        emit(
          'place',
          [r, c],
          v,
          'place',
          filled + 1,
          `(${r},${c}) 试 ${v}：行/列/宫都不冲突 → 填入，继续下一个空格`,
        );
        if (dfs(k + 1, filled + 1)) return true;
        work[r][c] = 0;
        emit(
          'backtrack',
          [r, c],
          null,
          'backtrack',
          filled,
          `(${r},${c}) 填 ${v} 后走不通：撤销、回退，换个数再试`,
        );
      } else {
        emit(
          'reject',
          [r, c],
          v,
          'reject',
          filled,
          `(${r},${c}) 试 ${v}：与同行/列/宫已有数字冲突 → 换下一个`,
        );
      }
    }
    return false;
  };

  dfs(0, 0);
  emit('done', null, null, null, blanks.length, `全部 ${blanks.length} 个空格填满：数独完成！`);
  return steps;
}

export const sudokuModule: AlgorithmModule<SudokuExecPoint> = {
  title: '数独',
  initialInput: () => [],
  buildSteps: () => buildSudokuSteps(),
  sources: sudokuSources,
};
