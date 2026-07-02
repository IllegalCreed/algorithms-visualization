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
