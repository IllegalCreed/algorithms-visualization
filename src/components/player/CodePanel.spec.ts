// src/components/player/CodePanel.spec.ts
import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia } from 'pinia';
import CodePanel from './CodePanel.vue';
import { bubbleSortSources } from '@/algorithms/bubble-sort.sources';
import type { ExecPoint } from './types';

// 不在单测里真跑 Shiki：每行返回一个 token = 原始行文本
vi.mock('./useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = (point: ExecPoint) =>
  mount(CodePanel, {
    props: { sources: bubbleSortSources, point },
    global: { plugins: [createPinia()] },
  });

describe('CodePanel', () => {
  it('渲染默认语言(TS)的所有行', async () => {
    const w = mountIt('compare');
    await flushPromises();
    const tsLines = bubbleSortSources[0].code.split('\n').length;
    expect(w.findAll('.code-line')).toHaveLength(tsLines);
  });

  it('当前执行行随 point 经 lineMap 高亮', async () => {
    const w = mountIt('swap'); // TS lineMap.swap = 6
    await flushPromises();
    const active = w.findAll('.code-line').filter((n) => n.classes().includes('is-active'));
    expect(active).toHaveLength(1);
    expect(w.findAll('.code-line')[5].classes()).toContain('is-active'); // 第 6 行（0-based 5）
  });

  it('切换语言 Tab 后按该语言 lineMap 高亮', async () => {
    const w = mountIt('done'); // TS lineMap.done = 10 → 切到 Python done=7
    await flushPromises();
    const pyTab = w.findAll('.tab').find((b) => b.text() === 'Python')!;
    await pyTab.trigger('click');
    await flushPromises();
    expect(w.findAll('.code-line')[6].classes()).toContain('is-active'); // Python 第 7 行
  });
});
