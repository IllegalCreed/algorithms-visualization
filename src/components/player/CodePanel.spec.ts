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

  it('TC-RESPONSIVE-140-06 代码语言使用 tab 语义并支持方向键切换', async () => {
    const w = mountIt('compare');
    await flushPromises();

    const tabs = w.find('.tabs');
    expect(tabs.attributes('role')).toBe('tablist');
    const languageTabs = w.findAll('.tab');
    expect(languageTabs.length).toBeGreaterThan(1);
    expect(languageTabs[0].attributes('role')).toBe('tab');
    expect(languageTabs[0].attributes('aria-selected')).toBe('true');
    expect(languageTabs[0].attributes('tabindex')).toBe('0');
    expect(languageTabs[1].attributes('aria-selected')).toBe('false');
    expect(languageTabs[1].attributes('tabindex')).toBe('-1');
    expect(w.find('.code').attributes('role')).toBe('tabpanel');

    await languageTabs[0].trigger('keydown', { key: 'ArrowRight' });
    await flushPromises();
    expect(w.findAll('.tab')[1].attributes('aria-selected')).toBe('true');
    expect(w.findAll('.tab')[1].attributes('tabindex')).toBe('0');
    expect(w.findAll('.tab')[0].attributes('tabindex')).toBe('-1');
  });

  it('TC-I18N-UI-131-05 英文播放器为代码 tab 提供英文标签', () => {
    const w = mount(CodePanel, {
      props: { sources: bubbleSortSources, point: 'compare', locale: 'en' },
      global: { plugins: [createPinia()] },
    });
    expect(w.find('[role="tablist"]').attributes('aria-label')).toBe('Code language');
  });

  it('TC-PLAYER-LAYOUT-137-03 标记当前代码行并只滚动代码容器', async () => {
    const w = mountIt('compare');
    await flushPromises();
    expect(w.find('.code-line.is-active').attributes('data-line')).toBe('5');

    const code = w.find('.code').element as HTMLElement;
    Object.defineProperty(code, 'clientHeight', { configurable: true, value: 40 });
    const codeRect = { top: 100, bottom: 140 } as DOMRect;
    const lineRect = { top: 100, bottom: 160 } as DOMRect;
    vi.spyOn(code, 'getBoundingClientRect').mockReturnValue(codeRect);
    vi.spyOn(w.find('.code-line.is-active').element, 'getBoundingClientRect').mockReturnValue(
      lineRect,
    );
    const initialPageScroll = window.scrollY;

    await w.setProps({ point: 'done' });
    await flushPromises();
    expect(w.find('.code-line.is-active').attributes('data-line')).toBe('10');
    // The implementation must not invoke scrollIntoView (which can move the
    // article); this assertion is intentionally a contract rather than a
    // browser-specific geometry check.
    expect(window.scrollY).toBe(initialPageScroll);
  });
});
