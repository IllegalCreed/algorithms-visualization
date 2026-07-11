import type { AlgorithmModule, MazeExecPoint, Step, VarRow } from '@/components/player/types';
import { mazeModule } from '@/algorithms/maze.module';
import { translateSources } from '../shared';

const MAZE_SOURCE_REPLACEMENTS: ReadonlyArray<readonly [string, string]> = [
  ['死路 → 回溯，退回上一格', 'dead end: backtrack one cell'],
  ['墙 / 已访问', 'wall / visited'],
  ['到达终点', 'reach the goal'],
  ['四个方向', 'four directions'],
  ['四方向', 'four directions'],
  ['死路 → 回溯', 'dead end: backtrack'],
  ['走到 (r,c)', 'move to (r,c)'],
];

function localizeMazeVars(vars: VarRow[]): VarRow[] {
  const labels: Record<string, string> = {
    起点: 'Start',
    终点: 'Goal',
    当前格: 'Current cell',
    路径长: 'Path length',
    已访问: 'Visited',
  };
  return vars.map((row) => ({ name: labels[row.name] ?? row.name, value: row.value }));
}

function cellText(cell: [number, number] | null | undefined): string {
  return cell ? `(${cell[0]}, ${cell[1]})` : '-';
}

function localizeMazeStep(step: Step<MazeExecPoint>): Step<MazeExecPoint> {
  const maze = step.maze!;
  const captions: Record<MazeExecPoint, () => string> = {
    start: () => `Start at ${cellText(maze.start)} and search for goal ${cellText(maze.goal)}.`,
    move: () => `Move to open cell ${cellText(maze.current)} and mark it visited.`,
    deadend: () =>
      `${cellText(maze.current)} has no unvisited open neighbor, so this branch is a dead end.`,
    backtrack: () => `Backtrack to ${cellText(maze.current)} and continue with another direction.`,
    goal: () => `Reach the goal at ${cellText(maze.goal)}; the active path is a valid solution.`,
    done: () => `The final path contains ${maze.path?.length ?? 0} cells from start to goal.`,
  };

  return {
    ...step,
    vars: localizeMazeVars(step.vars),
    caption: captions[step.point](),
  };
}

export const englishMazeModule: AlgorithmModule<MazeExecPoint> = {
  ...mazeModule,
  title: 'Maze Solving with DFS',
  buildSteps: (input) => mazeModule.buildSteps(input).map(localizeMazeStep),
  sources: translateSources(mazeModule.sources, MAZE_SOURCE_REPLACEMENTS),
};
