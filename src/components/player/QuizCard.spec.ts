// src/components/player/QuizCard.spec.ts —— 测验题卡组件（C-112，M10-P3）
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import QuizCard from './QuizCard.vue';
import type { QuizItem } from './types';

const quiz: QuizItem = {
  question: '下一步候选区间是？',
  options: ['[5, 8]（右半）', '[0, 3]（左半）', '不变 [0, 8]'],
  answer: 0,
};

const mountIt = () => mount(QuizCard, { props: { quiz } });

describe('QuizCard 题卡', () => {
  it('TC-VIZ-QUIZCARD-01 渲染题目 + 全部选项；未答无结果态', () => {
    const w = mountIt();
    expect(w.find('.qc-question').text()).toContain('下一步候选区间');
    expect(w.findAll('.qc-option')).toHaveLength(3);
    expect(w.find('.qc-correct').exists()).toBe(false);
    expect(w.find('.qc-resume').exists()).toBe(false);
  });

  it('TC-VIZ-QUIZCARD-02 点正确项 → ✓ 态 + emit answered(true) + 继续按钮', async () => {
    const w = mountIt();
    await w.findAll('.qc-option')[0].trigger('click');
    expect(w.emitted('answered')).toEqual([[true]]);
    expect(w.findAll('.qc-option')[0].classes()).toContain('qc-correct');
    expect(w.find('.qc-resume').exists()).toBe(true);
  });

  it('TC-VIZ-QUIZCARD-03 点错误项 → ✗ 态 + 正确项高亮 + emit answered(false)', async () => {
    const w = mountIt();
    await w.findAll('.qc-option')[2].trigger('click');
    expect(w.emitted('answered')).toEqual([[false]]);
    expect(w.findAll('.qc-option')[2].classes()).toContain('qc-wrong');
    expect(w.findAll('.qc-option')[0].classes()).toContain('qc-correct');
  });

  it('TC-VIZ-QUIZCARD-04 答后点继续 → emit resume；答后选项锁定', async () => {
    const w = mountIt();
    await w.findAll('.qc-option')[0].trigger('click');
    await w.findAll('.qc-option')[1].trigger('click'); // 已答，不再变
    expect(w.emitted('answered')).toHaveLength(1);
    await w.find('.qc-resume').trigger('click');
    expect(w.emitted('resume')).toHaveLength(1);
  });
});
