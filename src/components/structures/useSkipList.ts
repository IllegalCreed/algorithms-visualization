/** 固定跳表：8 个有序值 + 各自层高（完美折半：L0 全 8、L1 4、L2 2、L3 1） */
export const SKIP_VALUES = [1, 3, 5, 7, 9, 11, 13, 15];
export const SKIP_HEIGHTS = [4, 1, 2, 1, 3, 1, 2, 1];
export const SKIP_MAX_LEVEL = 4;

export interface SkipNode {
  id: string;
  value: number; // head 为 -Infinity
  height: number;
  col: number; // 0 = head、1..8 = 元素（按值升序）
  isHead: boolean;
}
export interface SkipStep {
  node: number; // nodes 下标
  level: number;
  move: 'start' | 'right' | 'down';
}
export interface SkipSearchResult {
  found: boolean;
  path: SkipStep[]; // 楼梯步序
  visitedValues: number[]; // 落在过的元素值（去重、不含 head）
}
export interface UseSkipList {
  nodes: SkipNode[]; // [head, ...8 元素]
  maxLevel: number;
  present: (nodeIdx: number, level: number) => boolean;
  levelNodes: (level: number) => number[];
  search: (target: number) => SkipSearchResult;
}

export function useSkipList(): UseSkipList {
  const nodes: SkipNode[] = [
    { id: 'sk-head', value: -Infinity, height: SKIP_MAX_LEVEL, col: 0, isHead: true },
    ...SKIP_VALUES.map((value, i) => ({
      id: `sk${i}`,
      value,
      height: SKIP_HEIGHTS[i],
      col: i + 1,
      isHead: false,
    })),
  ];
  const maxLevel = SKIP_MAX_LEVEL;
  const present = (n: number, lv: number): boolean => lv < nodes[n].height;
  const levelNodes = (lv: number): number[] => nodes.map((_, i) => i).filter((i) => present(i, lv));
  const nextAtLevel = (cur: number, lv: number): number => {
    for (let j = cur + 1; j < nodes.length; j++) if (present(j, lv)) return j;
    return -1;
  };

  const search = (target: number): SkipSearchResult => {
    const path: SkipStep[] = [];
    let cur = 0;
    let level = maxLevel - 1;
    path.push({ node: 0, level, move: 'start' });
    while (level >= 0) {
      let nx = nextAtLevel(cur, level);
      while (nx !== -1 && nodes[nx].value <= target) {
        cur = nx;
        path.push({ node: cur, level, move: 'right' });
        nx = nextAtLevel(cur, level);
      }
      if (level === 0) break;
      level -= 1;
      path.push({ node: cur, level, move: 'down' });
    }
    const found = !nodes[cur].isHead && nodes[cur].value === target;
    const visitedValues = [
      ...new Set(
        path
          .map((s) => nodes[s.node])
          .filter((n) => !n.isHead)
          .map((n) => n.value),
      ),
    ];
    return { found, path, visitedValues };
  };

  return { nodes, maxLevel, present, levelNodes, search };
}
