// src/components/player/AlgorithmPlayer.spec.ts
import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia } from 'pinia';
import AlgorithmPlayer from './AlgorithmPlayer.vue';
import TransportControls from './TransportControls.vue';
import Bar from '@/components/Bar.vue';
import { bubbleSortModule } from '@/algorithms/bubble-sort.module';
import AuxView from '@/components/AuxView.vue';
import StackView from '@/components/StackView.vue';
import TreeView from '@/components/TreeView.vue';
import CountView from '@/components/CountView.vue';
import BucketView from '@/components/BucketView.vue';
import GraphView from '@/components/GraphView.vue';
import MatrixView from '@/components/MatrixView.vue';
import BoardView from '@/components/BoardView.vue';
import DecisionTreeView from '@/components/DecisionTreeView.vue';
import MazeView from '@/components/MazeView.vue';
import KmpView from '@/components/KmpView.vue';
import ManacherView from '@/components/ManacherView.vue';
import SudokuView from '@/components/SudokuView.vue';
import SuffixArrayView from '@/components/SuffixArrayView.vue';
import SieveView from '@/components/SieveView.vue';
import GcdView from '@/components/GcdView.vue';
import PowerView from '@/components/PowerView.vue';
import BarsView from '@/components/BarsView.vue';
import type { AlgorithmModule, Step } from './types';

vi.mock('./useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(AlgorithmPlayer, {
    props: { module: bubbleSortModule },
    global: { plugins: [createPinia()] },
  });

describe('AlgorithmPlayer', () => {
  it('渲染柱状图 + 代码面板 + 变量面板 + 控制条', async () => {
    const w = mountIt();
    await flushPromises();
    expect(w.findAllComponents(Bar)).toHaveLength(10);
    expect(w.find('.code-panel').exists()).toBe(true);
    expect(w.find('.var-panel').exists()).toBe(true);
    expect(w.findComponent(TransportControls).exists()).toBe(true);
  });

  it('默认停在第 0 步，点下一步推进到第 2 步', async () => {
    const w = mountIt();
    await flushPromises();
    expect(w.find('.counter').text()).toContain('1 / ');
    await w.find('.ctl[title="下一步"]').trigger('click');
    expect(w.find('.counter').text()).toContain('2 / ');
  });

  // 内联最小 module：单步带 aux，用于验证外壳条件渲染（不依赖归并模块）
  const auxModule: AlgorithmModule = {
    title: 'aux-test',
    initialInput: () => [3, 1, 2],
    buildSteps: (): Step[] => [
      {
        array: [
          ['0', 3],
          ['1', 1],
          ['2', 2],
        ],
        pointers: [],
        emphasis: {},
        vars: [],
        point: 'mergeStart',
        aux: {
          array: [
            ['t0', 0],
            ['t1', 0],
            ['t2', 0],
          ],
          filled: [],
          pointer: 0,
        },
      },
    ],
    sources: [{ lang: 'ts', label: 'TS', code: 'line1', lineMap: { mergeStart: 1 } }],
  };

  it('TC-PLAYER-AUX-01 module 无 aux 时不渲染 AuxView（前四算法向后兼容）', async () => {
    const w = mountIt(); // bubbleSortModule，无 aux
    await flushPromises();
    expect(w.findComponent(AuxView).exists()).toBe(false);
  });

  it('TC-PLAYER-AUX-02 当前步带 aux 时渲染 AuxView', async () => {
    const w = mount(AlgorithmPlayer, {
      props: { module: auxModule },
      global: { plugins: [createPinia()] },
    });
    await flushPromises();
    expect(w.findComponent(AuxView).exists()).toBe(true);
  });

  // 内联最小 module：单步带 stack，用于验证外壳条件渲染区间栈轨（不依赖快排模块）
  const stackModule: AlgorithmModule = {
    title: 'stack-test',
    initialInput: () => [3, 1, 2],
    buildSteps: (): Step[] => [
      {
        array: [
          ['0', 3],
          ['1', 1],
          ['2', 2],
        ],
        pointers: [],
        emphasis: {},
        vars: [],
        point: 'pop',
        stack: { frames: [{ lo: 0, hi: 2 }] },
      },
    ],
    sources: [{ lang: 'ts', label: 'TS', code: 'line1', lineMap: { pop: 1 } }],
  };

  it('TC-PLAYER-STACK-01 module 无 stack 时不渲染 StackView（前五算法向后兼容）', async () => {
    const w = mountIt(); // bubbleSortModule，无 stack
    await flushPromises();
    expect(w.findComponent(StackView).exists()).toBe(false);
  });

  it('TC-PLAYER-STACK-02 当前步带 stack 时渲染 StackView', async () => {
    const w = mount(AlgorithmPlayer, {
      props: { module: stackModule },
      global: { plugins: [createPinia()] },
    });
    await flushPromises();
    expect(w.findComponent(StackView).exists()).toBe(true);
  });

  it('TC-PLAYER-STACK-03 带 aux 不带 stack 时只渲染 AuxView、不渲染 StackView（两轨互不干扰）', async () => {
    const w = mount(AlgorithmPlayer, {
      props: { module: auxModule },
      global: { plugins: [createPinia()] },
    });
    await flushPromises();
    expect(w.findComponent(AuxView).exists()).toBe(true);
    expect(w.findComponent(StackView).exists()).toBe(false);
  });

  // 内联最小 module：单步同时带 aux + stack（自顶向下归并 C-043：temp 轨 + 递归栈双辅助轨并存）
  const auxStackModule: AlgorithmModule = {
    title: 'aux-stack-test',
    initialInput: () => [3, 1, 2],
    buildSteps: (): Step[] => [
      {
        array: [
          ['0', 3],
          ['1', 1],
          ['2', 2],
        ],
        pointers: [],
        emphasis: {},
        vars: [],
        point: 'split',
        aux: {
          array: [
            ['t0', 0],
            ['t1', 0],
            ['t2', 0],
          ],
          filled: [],
        },
        stack: { frames: [{ lo: 0, hi: 2 }] },
      },
    ],
    sources: [{ lang: 'ts', label: 'TS', code: 'line1', lineMap: { split: 1 } }],
  };

  it('TC-PLAYER-STACK-04 同时带 aux + stack 时双辅助轨并存都渲染', async () => {
    const w = mount(AlgorithmPlayer, {
      props: { module: auxStackModule },
      global: { plugins: [createPinia()] },
    });
    await flushPromises();
    expect(w.findComponent(AuxView).exists()).toBe(true);
    expect(w.findComponent(StackView).exists()).toBe(true);
  });

  // 内联最小 module：单步带 graph 且 array 空（图算法 C-047：GraphView 轨 + 无柱主轨）
  const graphModule: AlgorithmModule = {
    title: 'graph-test',
    initialInput: () => [],
    buildSteps: (): Step[] => [
      {
        array: [],
        pointers: [],
        emphasis: {},
        vars: [],
        point: 'init',
        graph: {
          vertices: [
            { id: 0, label: 'A', x: 50, y: 150 },
            { id: 1, label: 'B', x: 160, y: 70 },
          ],
          edges: [{ key: '0-1', from: 0, to: 1, w: 4 }],
          directed: true,
        },
      },
    ],
    sources: [{ lang: 'ts', label: 'TS', code: 'line1', lineMap: { init: 1 } }],
  };

  it('TC-PLAYER-GRAPH-01 当前步带 graph 时渲染 GraphView', async () => {
    const w = mount(AlgorithmPlayer, {
      props: { module: graphModule },
      global: { plugins: [createPinia()] },
    });
    await flushPromises();
    expect(w.findComponent(GraphView).exists()).toBe(true);
  });

  it('TC-PLAYER-GRAPH-02 array 空时不渲染 BarsView；既有排序 array 非空仍渲染（零回归）', async () => {
    const wGraph = mount(AlgorithmPlayer, {
      props: { module: graphModule },
      global: { plugins: [createPinia()] },
    });
    await flushPromises();
    expect(wGraph.findComponent(BarsView).exists()).toBe(false); // 图算法空数组 → 主轨隐藏

    const wSort = mountIt(); // bubbleSortModule，array 恒非空
    await flushPromises();
    expect(wSort.findComponent(BarsView).exists()).toBe(true); // 排序主轨照常
  });

  // 内联最小 module：单步带 matrix 且 array 空（Floyd C-052：MatrixView 矩阵轨 + 无柱主轨）
  const matrixModule: AlgorithmModule = {
    title: 'matrix-test',
    initialInput: () => [],
    buildSteps: (): Step[] => [
      {
        array: [],
        pointers: [],
        emphasis: {},
        vars: [],
        point: 'init',
        matrix: {
          labels: ['A', 'B'],
          cells: [
            [0, 3],
            [null, 0],
          ],
        },
      },
    ],
    sources: [{ lang: 'ts', label: 'TS', code: 'line1', lineMap: { init: 1 } }],
  };

  it('TC-PLAYER-MATRIX-01 当前步带 matrix 时渲染 MatrixView', async () => {
    const w = mount(AlgorithmPlayer, {
      props: { module: matrixModule },
      global: { plugins: [createPinia()] },
    });
    await flushPromises();
    expect(w.findComponent(MatrixView).exists()).toBe(true);
  });

  it('TC-PLAYER-MATRIX-02 既有排序 step（无 matrix）不渲染 MatrixView；matrix step 空数组不渲染 BarsView', async () => {
    const wSort = mountIt(); // bubbleSortModule，无 matrix
    await flushPromises();
    expect(wSort.findComponent(MatrixView).exists()).toBe(false); // 零回归

    const wMatrix = mount(AlgorithmPlayer, {
      props: { module: matrixModule },
      global: { plugins: [createPinia()] },
    });
    await flushPromises();
    expect(wMatrix.findComponent(MatrixView).exists()).toBe(true);
    expect(wMatrix.findComponent(BarsView).exists()).toBe(false); // array:[] → 主轨隐藏
  });

  // 内联最小 module：单步带 board 且 array 空（N 皇后 C-055：BoardView 棋盘轨 + 无柱主轨）
  const boardModule: AlgorithmModule = {
    title: 'board-test',
    initialInput: () => [],
    buildSteps: (): Step[] => [
      {
        array: [],
        pointers: [],
        emphasis: {},
        vars: [],
        point: 'init',
        board: { n: 4, queens: [1, 3, 0, 2] },
      },
    ],
    sources: [{ lang: 'ts', label: 'TS', code: 'line1', lineMap: { init: 1 } }],
  };

  it('TC-PLAYER-BOARD-01 当前步带 board 时渲染 BoardView', async () => {
    const w = mount(AlgorithmPlayer, {
      props: { module: boardModule },
      global: { plugins: [createPinia()] },
    });
    await flushPromises();
    expect(w.findComponent(BoardView).exists()).toBe(true);
  });

  it('TC-PLAYER-BOARD-02 既有排序 step（无 board）不渲染 BoardView', async () => {
    const wSort = mountIt(); // bubbleSortModule，无 board
    await flushPromises();
    expect(wSort.findComponent(BoardView).exists()).toBe(false); // 零回归
  });

  // 内联最小 module：单步带 decisionTree 且 array 空（子集 C-056：决策树轨 + 无柱主轨）
  const dtreeModule: AlgorithmModule = {
    title: 'dtree-test',
    initialInput: () => [],
    buildSteps: (): Step[] => [
      {
        array: [],
        pointers: [],
        emphasis: {},
        vars: [],
        point: 'start',
        decisionTree: {
          nodes: [
            { id: 0, label: '', x: 100, y: 30 },
            { id: 1, label: '{1}', x: 60, y: 110 },
          ],
          edges: [{ from: 0, to: 1, label: '选 1' }],
        },
      },
    ],
    sources: [{ lang: 'ts', label: 'TS', code: 'line1', lineMap: { start: 1 } }],
  };

  it('TC-PLAYER-DTREE-01 当前步带 decisionTree 时渲染 DecisionTreeView', async () => {
    const w = mount(AlgorithmPlayer, {
      props: { module: dtreeModule },
      global: { plugins: [createPinia()] },
    });
    await flushPromises();
    expect(w.findComponent(DecisionTreeView).exists()).toBe(true);
  });

  it('TC-PLAYER-DTREE-02 既有排序 step（无 decisionTree）不渲染 DecisionTreeView', async () => {
    const wSort = mountIt(); // bubbleSortModule，无 decisionTree
    await flushPromises();
    expect(wSort.findComponent(DecisionTreeView).exists()).toBe(false); // 零回归
  });

  // 内联最小 module：单步带 maze 且 array 空（迷宫 C-059：MazeView 迷宫轨 + 无柱主轨）
  const mazeModule: AlgorithmModule = {
    title: 'maze-test',
    initialInput: () => [],
    buildSteps: (): Step[] => [
      {
        array: [],
        pointers: [],
        emphasis: {},
        vars: [],
        point: 'start',
        maze: {
          rows: 2,
          cols: 2,
          walls: [
            [false, false],
            [false, false],
          ],
          start: [0, 0],
          goal: [1, 1],
          current: [0, 0],
          path: [[0, 0]],
        },
      },
    ],
    sources: [{ lang: 'ts', label: 'TS', code: 'line1', lineMap: { start: 1 } }],
  };

  it('TC-PLAYER-MAZE-01 当前步带 maze 时渲染 MazeView', async () => {
    const w = mount(AlgorithmPlayer, {
      props: { module: mazeModule },
      global: { plugins: [createPinia()] },
    });
    await flushPromises();
    expect(w.findComponent(MazeView).exists()).toBe(true);
  });

  it('TC-PLAYER-MAZE-02 既有排序 step（无 maze）不渲染 MazeView', async () => {
    const wSort = mountIt(); // bubbleSortModule，无 maze
    await flushPromises();
    expect(wSort.findComponent(MazeView).exists()).toBe(false); // 零回归
  });

  // 内联最小 module：单步带 kmp 且 array 空（KMP C-062：KmpView 字符串匹配轨 + 无柱主轨）
  const kmpModule: AlgorithmModule = {
    title: 'kmp-test',
    initialInput: () => [],
    buildSteps: (): Step[] => [
      {
        array: [],
        pointers: [],
        emphasis: {},
        vars: [],
        point: 'start',
        kmp: {
          text: 'abc',
          pattern: 'bc',
          lps: [0, 0],
          offset: 1,
          matchedLen: 0,
          found: [],
        },
      },
    ],
    sources: [{ lang: 'ts', label: 'TS', code: 'line1', lineMap: { start: 1 } }],
  };

  it('TC-PLAYER-KMP-01 当前步带 kmp 时渲染 KmpView', async () => {
    const w = mount(AlgorithmPlayer, {
      props: { module: kmpModule },
      global: { plugins: [createPinia()] },
    });
    await flushPromises();
    expect(w.findComponent(KmpView).exists()).toBe(true);
  });

  it('TC-PLAYER-KMP-02 既有排序 step（无 kmp）不渲染 KmpView', async () => {
    const wSort = mountIt(); // bubbleSortModule，无 kmp
    await flushPromises();
    expect(wSort.findComponent(KmpView).exists()).toBe(false); // 零回归
  });

  // 内联最小 module：单步带 manacher 且 array 空（Manacher C-067：ManacherView 回文轨 + 无柱主轨）
  const manacherModule: AlgorithmModule = {
    title: 'manacher-test',
    initialInput: () => [],
    buildSteps: (): Step[] => [
      {
        array: [],
        pointers: [],
        emphasis: {},
        vars: [],
        point: 'init',
        manacher: { s: '#a#', p: [null, null, null] },
      },
    ],
    sources: [{ lang: 'ts', label: 'TS', code: 'line1', lineMap: { init: 1 } }],
  };

  it('TC-PLAYER-MANACHER-01 当前步带 manacher 时渲染 ManacherView', async () => {
    const w = mount(AlgorithmPlayer, {
      props: { module: manacherModule },
      global: { plugins: [createPinia()] },
    });
    await flushPromises();
    expect(w.findComponent(ManacherView).exists()).toBe(true);
  });

  it('TC-PLAYER-MANACHER-02 既有排序 step（无 manacher）不渲染 ManacherView', async () => {
    const wSort = mountIt(); // bubbleSortModule，无 manacher
    await flushPromises();
    expect(wSort.findComponent(ManacherView).exists()).toBe(false); // 零回归
  });

  // 内联最小 module：单步带 sudoku 且 array 空（Sudoku C-071：SudokuView 数独轨 + 无柱主轨）
  const sudokuModule: AlgorithmModule = {
    title: 'sudoku-test',
    initialInput: () => [],
    buildSteps: (): Step[] => [
      {
        array: [],
        pointers: [],
        emphasis: {},
        vars: [],
        point: 'init',
        sudoku: {
          n: 4,
          box: 2,
          given: [
            [true, true, true, true],
            [true, true, true, true],
            [true, true, true, true],
            [true, true, true, true],
          ],
          grid: [
            [1, 2, 3, 4],
            [3, 4, 1, 2],
            [2, 3, 4, 1],
            [4, 1, 2, 3],
          ],
        },
      },
    ],
    sources: [{ lang: 'ts', label: 'TS', code: 'line1', lineMap: { init: 1 } }],
  };

  it('TC-PLAYER-SUDOKU-01 当前步带 sudoku 时渲染 SudokuView', async () => {
    const w = mount(AlgorithmPlayer, {
      props: { module: sudokuModule },
      global: { plugins: [createPinia()] },
    });
    await flushPromises();
    expect(w.findComponent(SudokuView).exists()).toBe(true);
  });

  it('TC-PLAYER-SUDOKU-02 既有排序 step（无 sudoku）不渲染 SudokuView', async () => {
    const wSort = mountIt(); // bubbleSortModule，无 sudoku
    await flushPromises();
    expect(wSort.findComponent(SudokuView).exists()).toBe(false); // 零回归
  });

  // 内联最小 module：单步带 suffixArray 且 array 空（后缀数组 C-072：SuffixArrayView 后缀轨 + 无柱主轨）
  const suffixArrayModule: AlgorithmModule = {
    title: 'sa-test',
    initialInput: () => [],
    buildSteps: (): Step[] => [
      {
        array: [],
        pointers: [],
        emphasis: {},
        vars: [],
        point: 'init',
        suffixArray: { s: 'ab', k: 1, order: [0, 1], rank: [0, 1] },
      },
    ],
    sources: [{ lang: 'ts', label: 'TS', code: 'line1', lineMap: { init: 1 } }],
  };

  it('TC-PLAYER-SA-01 当前步带 suffixArray 时渲染 SuffixArrayView', async () => {
    const w = mount(AlgorithmPlayer, {
      props: { module: suffixArrayModule },
      global: { plugins: [createPinia()] },
    });
    await flushPromises();
    expect(w.findComponent(SuffixArrayView).exists()).toBe(true);
  });

  it('TC-PLAYER-SA-02 既有排序 step（无 suffixArray）不渲染 SuffixArrayView', async () => {
    const wSort = mountIt(); // bubbleSortModule，无 suffixArray
    await flushPromises();
    expect(wSort.findComponent(SuffixArrayView).exists()).toBe(false); // 零回归
  });

  // 内联最小 module：单步带 sieve 且 array 空（埃氏筛 C-077：SieveView 数字网格轨 + 无柱主轨）
  const sieveModule: AlgorithmModule = {
    title: 'sieve-test',
    initialInput: () => [],
    buildSteps: (): Step[] => [
      {
        array: [],
        pointers: [],
        emphasis: {},
        vars: [],
        point: 'init',
        sieve: {
          n: 6,
          cols: 3,
          states: ['unknown', 'special', 'prime', 'prime', 'composite', 'prime', 'composite'],
        },
      },
    ],
    sources: [{ lang: 'ts', label: 'TS', code: 'line1', lineMap: { init: 1 } }],
  };

  it('TC-PLAYER-SIEVE-01 当前步带 sieve 时渲染 SieveView', async () => {
    const w = mount(AlgorithmPlayer, {
      props: { module: sieveModule },
      global: { plugins: [createPinia()] },
    });
    await flushPromises();
    expect(w.findComponent(SieveView).exists()).toBe(true);
  });

  it('TC-PLAYER-SIEVE-02 既有排序 step（无 sieve）不渲染 SieveView', async () => {
    const wSort = mountIt(); // bubbleSortModule，无 sieve
    await flushPromises();
    expect(wSort.findComponent(SieveView).exists()).toBe(false); // 零回归
  });

  // 内联最小 module：单步带 gcd 且 array 空（欧几里得 C-079：GcdView 矩形铺砖轨 + 无柱主轨）
  const gcdModule: AlgorithmModule = {
    title: 'gcd-test',
    initialInput: () => [],
    buildSteps: (): Step[] => [
      {
        array: [],
        pointers: [],
        emphasis: {},
        vars: [],
        point: 'init',
        gcd: { a: 30, b: 18, squares: [{ x: 0, y: 0, size: 18, step: 0 }], remaining: null },
      },
    ],
    sources: [{ lang: 'ts', label: 'TS', code: 'line1', lineMap: { init: 1 } }],
  };

  it('TC-PLAYER-GCD-01 当前步带 gcd 时渲染 GcdView', async () => {
    const w = mount(AlgorithmPlayer, {
      props: { module: gcdModule },
      global: { plugins: [createPinia()] },
    });
    await flushPromises();
    expect(w.findComponent(GcdView).exists()).toBe(true);
  });

  it('TC-PLAYER-GCD-02 既有排序 step（无 gcd）不渲染 GcdView', async () => {
    const wSort = mountIt(); // bubbleSortModule，无 gcd
    await flushPromises();
    expect(wSort.findComponent(GcdView).exists()).toBe(false); // 零回归
  });

  // 内联最小 module：单步带 power 且 array 空（快速幂 C-080：PowerView 幂块轨 + 无柱主轨）
  const powerModule: AlgorithmModule = {
    title: 'power-test',
    initialInput: () => [],
    buildSteps: (): Step[] => [
      {
        array: [],
        pointers: [],
        emphasis: {},
        vars: [],
        point: 'init',
        power: {
          a: 3,
          n: 13,
          binary: '1101',
          blocks: [{ k: 0, exp: 1, value: 3, bit: 1, selected: true }],
          result: 3,
        },
      },
    ],
    sources: [{ lang: 'ts', label: 'TS', code: 'line1', lineMap: { init: 1 } }],
  };

  it('TC-PLAYER-POWER-01 当前步带 power 时渲染 PowerView', async () => {
    const w = mount(AlgorithmPlayer, {
      props: { module: powerModule },
      global: { plugins: [createPinia()] },
    });
    await flushPromises();
    expect(w.findComponent(PowerView).exists()).toBe(true);
  });

  it('TC-PLAYER-POWER-02 既有排序 step（无 power）不渲染 PowerView', async () => {
    const wSort = mountIt(); // bubbleSortModule，无 power
    await flushPromises();
    expect(wSort.findComponent(PowerView).exists()).toBe(false); // 零回归
  });

  // 内联最小 module：单步带 tree，用于验证外壳条件渲染二叉树轨（不依赖堆排序模块）
  const treeModule: AlgorithmModule = {
    title: 'tree-test',
    initialInput: () => [3, 1, 2],
    buildSteps: (): Step[] => [
      {
        array: [
          ['0', 3],
          ['1', 1],
          ['2', 2],
        ],
        pointers: [],
        emphasis: {},
        vars: [],
        point: 'heapify',
        tree: { heapSize: 3 },
      },
    ],
    sources: [{ lang: 'ts', label: 'TS', code: 'line1', lineMap: { heapify: 1 } }],
  };

  it('TC-PLAYER-TREE-01 当前步带 tree 时渲染 TreeView', async () => {
    const w = mount(AlgorithmPlayer, {
      props: { module: treeModule },
      global: { plugins: [createPinia()] },
    });
    await flushPromises();
    expect(w.findComponent(TreeView).exists()).toBe(true);
  });

  it('TC-PLAYER-TREE-02 module 无 tree 时不渲染 TreeView（前六算法向后兼容）', async () => {
    const w = mountIt(); // bubbleSortModule，无 tree
    await flushPromises();
    expect(w.findComponent(TreeView).exists()).toBe(false);
  });

  it('TC-PLAYER-TREE-03 带 aux 不带 tree 时只渲染 AuxView、不渲染 TreeView（多轨互不干扰）', async () => {
    const w = mount(AlgorithmPlayer, {
      props: { module: auxModule },
      global: { plugins: [createPinia()] },
    });
    await flushPromises();
    expect(w.findComponent(AuxView).exists()).toBe(true);
    expect(w.findComponent(TreeView).exists()).toBe(false);
  });

  // 内联最小 module：单步带 count，用于验证外壳条件渲染计数桶轨（不依赖计数排序模块）
  const countModule: AlgorithmModule = {
    title: 'count-test',
    initialInput: () => [3, 1, 2],
    buildSteps: (): Step[] => [
      {
        array: [
          ['0', 3],
          ['1', 1],
          ['2', 2],
        ],
        pointers: [],
        emphasis: {},
        vars: [],
        point: 'count',
        count: { min: 1, buckets: [1, 1, 1], activeBucket: 0 },
      },
    ],
    sources: [{ lang: 'ts', label: 'TS', code: 'line1', lineMap: { count: 1 } }],
  };

  it('TC-PLAYER-COUNT-01 当前步带 count 时渲染 CountView', async () => {
    const w = mount(AlgorithmPlayer, {
      props: { module: countModule },
      global: { plugins: [createPinia()] },
    });
    await flushPromises();
    expect(w.findComponent(CountView).exists()).toBe(true);
  });

  it('TC-PLAYER-COUNT-02 module 无 count 时不渲染 CountView（前七算法向后兼容）', async () => {
    const w = mountIt(); // bubbleSortModule，无 count
    await flushPromises();
    expect(w.findComponent(CountView).exists()).toBe(false);
  });

  it('TC-PLAYER-COUNT-03 带 tree 不带 count 时只渲染 TreeView、不渲染 CountView（多轨互不干扰）', async () => {
    const w = mount(AlgorithmPlayer, {
      props: { module: treeModule },
      global: { plugins: [createPinia()] },
    });
    await flushPromises();
    expect(w.findComponent(TreeView).exists()).toBe(true);
    expect(w.findComponent(CountView).exists()).toBe(false);
  });

  // 内联最小 module：单步带 bucket，用于验证外壳条件渲染桶轨（不依赖桶排序模块）
  const bucketModule: AlgorithmModule = {
    title: 'bucket-test',
    initialInput: () => [3, 1, 2],
    buildSteps: (): Step[] => [
      {
        array: [
          ['0', 3],
          ['1', 1],
          ['2', 2],
        ],
        pointers: [],
        emphasis: {},
        vars: [],
        point: 'distribute',
        bucket: {
          buckets: [[3, 1, 2], [], []],
          ranges: [
            [0, 9],
            [10, 19],
            [20, 29],
          ],
          activeBucket: 0,
        },
      },
    ],
    sources: [{ lang: 'ts', label: 'TS', code: 'line1', lineMap: { distribute: 1 } }],
  };

  it('TC-PLAYER-BUCKET-01 当前步带 bucket 时渲染 BucketView', async () => {
    const w = mount(AlgorithmPlayer, {
      props: { module: bucketModule },
      global: { plugins: [createPinia()] },
    });
    await flushPromises();
    expect(w.findComponent(BucketView).exists()).toBe(true);
  });

  it('TC-PLAYER-BUCKET-02 module 无 bucket 时不渲染 BucketView（前八算法向后兼容）', async () => {
    const w = mountIt(); // bubbleSortModule，无 bucket
    await flushPromises();
    expect(w.findComponent(BucketView).exists()).toBe(false);
  });
});
