import { describe, expect, it } from 'vitest';
import type { AlgorithmModule, Step } from '@/components/player/types';
import { quickSortModule } from '@/algorithms/quick-sort.module';
import { bsearchModule } from '@/algorithms/bsearch.module';
import { dijkstraModule } from '@/algorithms/dijkstra.module';
import { knapsackModule } from '@/algorithms/knapsack.module';
import { kmpModule } from '@/algorithms/kmp.module';
import { fenwickModule } from '@/algorithms/fenwick.module';
import { convexHullModule } from '@/algorithms/convexhull.module';
import {
  englishBsearchModule,
  englishConvexHullModule,
  englishDijkstraModule,
  englishFenwickModule,
  englishKmpModule,
  englishKnapsackModule,
  englishQuickSortModule,
} from './englishAlgorithmModules';

const HAN = /[\u3400-\u9fff]/;

const modules: Array<{
  slug: string;
  source: AlgorithmModule;
  english: AlgorithmModule;
}> = [
  { slug: 'quick-sort', source: quickSortModule, english: englishQuickSortModule },
  { slug: 'binary-search', source: bsearchModule, english: englishBsearchModule },
  { slug: 'dijkstra', source: dijkstraModule, english: englishDijkstraModule },
  { slug: 'knapsack', source: knapsackModule, english: englishKnapsackModule },
  { slug: 'kmp', source: kmpModule, english: englishKmpModule },
  { slug: 'fenwick', source: fenwickModule, english: englishFenwickModule },
  { slug: 'convex-hull', source: convexHullModule, english: englishConvexHullModule },
];

function visualStructure(step: Step): Omit<Step, 'caption' | 'vars' | 'quiz'> {
  const structure: Partial<Step> = { ...step };
  delete structure.caption;
  delete structure.vars;
  delete structure.quiz;
  return structure as Omit<Step, 'caption' | 'vars' | 'quiz'>;
}

describe('English algorithm module adapters', () => {
  it('TC-I18N-MODULE-126-01: 七页步骤、执行点和所有视觉轨与中文 module 一致', () => {
    for (const { slug, source, english } of modules) {
      const input = source.initialInput();
      expect(english.initialInput(), slug).toEqual(input);

      const sourceSteps = source.buildSteps(input);
      const englishSteps = english.buildSteps(input);
      expect(englishSteps, slug).toHaveLength(sourceSteps.length);
      expect(englishSteps.map(visualStructure), slug).toEqual(sourceSteps.map(visualStructure));
    }
  });

  it('TC-I18N-MODULE-126-02: 标题、输入、字幕、变量、题卡与源码无中文残留', () => {
    for (const { slug, english } of modules) {
      const steps = english.buildSteps(english.initialInput());
      const visibleText = JSON.stringify({
        title: english.title,
        hint: english.inputSpec?.hint,
        steps: steps.map(({ caption, vars, quiz }) => ({ caption, vars, quiz })),
        sources: english.sources.map((source) => source.code),
      });

      expect(visibleText, slug).not.toMatch(HAN);
      expect(
        steps.every((step) => Boolean(step.caption?.trim())),
        slug,
      ).toBe(true);
      expect(
        steps.every((step) => step.vars.every((row) => row.name.trim())),
        slug,
      ).toBe(true);
    }
  });

  it('TC-I18N-MODULE-126-03: 四语言、代码行数与 lineMap 保持不变', () => {
    for (const { slug, source, english } of modules) {
      expect(
        english.sources.map((item) => item.lang),
        slug,
      ).toEqual(source.sources.map((item) => item.lang));

      source.sources.forEach((sourceItem, index) => {
        const englishItem = english.sources[index];
        expect(englishItem.lineMap, `${slug}/${sourceItem.lang}`).toEqual(sourceItem.lineMap);
        expect(englishItem.code.split('\n'), `${slug}/${sourceItem.lang}`).toHaveLength(
          sourceItem.code.split('\n').length,
        );
      });
    }
  });
});
