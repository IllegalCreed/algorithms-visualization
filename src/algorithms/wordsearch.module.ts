import type {
  AlgorithmModule,
  MazeTrack,
  Step,
  VarRow,
  WordSearchExecPoint,
} from '@/components/player/types';
import { WORD_BOARD, WORD_TARGET, WORD_DIRS } from './wordsearch';
import { wordSearchSources } from './wordsearch.sources';

/** 固定字母网格 + 目标词 DFS 逐字母试探 + 回溯细粒度重走，产出网格轨胖步骤（复用 MazeView 字母网格轨，第 3 消费者）。
 *  沿匹配字母深入、失配换方向、四方向试完则撤销回退；命中时整条路径标绿。 */
export function buildWordSearchSteps(): Step<WordSearchExecPoint>[] {
  const board = WORD_BOARD;
  const word = WORD_TARGET;
  const rows = board.length;
  const cols = board[0].length;
  const walls = board.map((row) => row.map(() => false)); // 单词搜索无墙
  const key = (r: number, c: number) => r + ',' + c;
  const inB = (r: number, c: number) => r >= 0 && r < rows && c >= 0 && c < cols;

  const steps: Step<WordSearchExecPoint>[] = [];
  const path: [number, number][] = [];
  const used = new Set<string>();
  let solved = false;

  const vars = (cur: [number, number] | null): VarRow[] => [
    { name: '网格', value: `${rows}×${cols} 字母` },
    { name: '目标词', value: word },
    { name: '已匹配', value: word.slice(0, path.length) || '—' },
    { name: '当前格', value: cur ? `(${cur[0]},${cur[1]})='${board[cur[0]][cur[1]]}'` : '-' },
    { name: '路径长', value: `${path.length}` },
  ];
  const emit = (
    point: WordSearchExecPoint,
    cur: [number, number] | null,
    caption: string,
  ): void => {
    const maze: MazeTrack = {
      rows,
      cols,
      walls,
      current: cur,
      path: path.map((p) => [p[0], p[1]] as [number, number]),
      solved,
      letters: board,
    };
    steps.push({ array: [], pointers: [], emphasis: {}, vars: vars(cur), point, maze, caption });
  };

  const dfs = (r: number, c: number, k: number, isStart: boolean): boolean => {
    path.push([r, c]);
    used.add(key(r, c));
    if (k === word.length - 1) {
      solved = true;
      emit('found', [r, c], `拼出完整单词 "${word}" → 命中！整条路径标绿`);
      return true;
    }
    emit(
      isStart ? 'start' : 'match',
      [r, c],
      isStart
        ? `从 (${r},${c})='${board[r][c]}' 出发作为 "${word}" 的首字母起点`
        : `(${r},${c})='${board[r][c]}' 匹配第 ${k + 1} 个字母，深入找 '${word[k + 1]}'`,
    );
    for (const [dr, dc] of WORD_DIRS) {
      const nr = r + dr;
      const nc = c + dc;
      if (!inB(nr, nc) || used.has(key(nr, nc))) continue;
      if (board[nr][nc] === word[k + 1]) {
        if (dfs(nr, nc, k + 1, false)) return true;
      } else {
        emit(
          'mismatch',
          [nr, nc],
          `邻格 (${nr},${nc})='${board[nr][nc]}' ≠ 待匹配 '${word[k + 1]}'：换方向`,
        );
      }
    }
    path.pop();
    used.delete(key(r, c));
    const back = path.length ? path[path.length - 1] : null;
    emit(
      'backtrack',
      back,
      `(${r},${c}) 四方向都走不通：撤销标记、回退${back ? ` 到 (${back[0]},${back[1]})` : '（换起点）'}`,
    );
    return false;
  };

  for (let r = 0; r < rows && !solved; r++) {
    for (let c = 0; c < cols && !solved; c++) {
      if (board[r][c] === word[0]) dfs(r, c, 0, true);
    }
  }

  return steps;
}

export const wordSearchModule: AlgorithmModule<WordSearchExecPoint> = {
  title: '单词搜索',
  initialInput: () => [],
  buildSteps: () => buildWordSearchSteps(),
  sources: wordSearchSources,
};
