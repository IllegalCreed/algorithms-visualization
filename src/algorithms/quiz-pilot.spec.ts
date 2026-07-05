// src/algorithms/quiz-pilot.spec.ts —— 测验试点模块聚合断言（C-112，M10-P3）
import { describe, it, expect } from 'vitest';
import { bsearchModule } from './bsearch.module';
import { quickSortModule } from './quick-sort.module';

describe('测验试点（C-112）', () => {
  it('TC-MOD-QUIZ-01 二分/快排各 ≥2 quiz 步且题面合法', () => {
    for (const m of [bsearchModule, quickSortModule]) {
      const steps = m.buildSteps(m.initialInput());
      const quizzes = steps.filter((s) => s.quiz);
      expect(quizzes.length, m.title).toBeGreaterThanOrEqual(2);
      for (const s of quizzes) {
        const q = s.quiz!;
        expect(q.question.length, m.title).toBeGreaterThan(0);
        expect(q.options.length, m.title).toBeGreaterThanOrEqual(2);
        expect(q.answer, m.title).toBeGreaterThanOrEqual(0);
        expect(q.answer, m.title).toBeLessThan(q.options.length);
      }
    }
  });
});
