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
});
