import { describe, expect, it } from 'vitest';
import type { AlgorithmModule, Step } from '@/components/player/types';
import { quickSortModule } from '@/algorithms/quick-sort.module';
import { bsearchModule } from '@/algorithms/bsearch.module';
import { dijkstraModule } from '@/algorithms/dijkstra.module';
import { knapsackModule } from '@/algorithms/knapsack.module';
import { kmpModule } from '@/algorithms/kmp.module';
import { fenwickModule } from '@/algorithms/fenwick.module';
import { convexHullModule } from '@/algorithms/convexhull.module';
import { bubbleSortModule } from '@/algorithms/bubble-sort.module';
import { mergeSortModule } from '@/algorithms/merge-sort.module';
import { heapSortModule } from '@/algorithms/heap-sort.module';
import { countingSortModule } from '@/algorithms/counting-sort.module';
import { bboundModule } from '@/algorithms/bbound.module';
import { kruskalModule } from '@/algorithms/kruskal.module';
import { primModule } from '@/algorithms/prim.module';
import { bellmanFordModule } from '@/algorithms/bellman-ford.module';
import { topoModule } from '@/algorithms/topo.module';
import { closestPairModule } from '@/algorithms/closestpair.module';
import { editDistModule } from '@/algorithms/editdist.module';
import { lcsModule } from '@/algorithms/lcs.module';
import { lisModule } from '@/algorithms/lis.module';
import { queensModule } from '@/algorithms/queens.module';
import { subsetsModule } from '@/algorithms/subsets.module';
import { mazeModule } from '@/algorithms/maze.module';
import { rabinKarpModule } from '@/algorithms/rabinkarp.module';
import { manacherModule } from '@/algorithms/manacher.module';
import { sieveModule } from '@/algorithms/sieve.module';
import { gcdModule } from '@/algorithms/gcd.module';
import {
  englishBinaryBoundsModule,
  englishBsearchModule,
  englishBubbleSortModule,
  englishConvexHullModule,
  englishCountingSortModule,
  englishDijkstraModule,
  englishFenwickModule,
  englishHeapSortModule,
  englishKmpModule,
  englishKnapsackModule,
  englishMergeSortModule,
  englishQuickSortModule,
  englishKruskalModule,
  englishPrimModule,
  englishBellmanFordModule,
  englishTopoModule,
  englishClosestPairModule,
  englishEditDistanceModule,
  englishLcsModule,
  englishLisModule,
  englishNQueensModule,
  englishSubsetsModule,
  englishMazeModule,
  englishRabinKarpModule,
  englishManacherModule,
  englishSieveModule,
  englishGcdModule,
  englishAlgorithmModules,
} from './englishAlgorithmModules';

const HAN = /[\u3400-\u9fff]/;

const legacyModules: Array<{
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

const batchAModules: Array<{
  slug: string;
  source: AlgorithmModule;
  english: AlgorithmModule;
}> = [
  { slug: 'bubble-sort', source: bubbleSortModule, english: englishBubbleSortModule },
  { slug: 'merge-sort', source: mergeSortModule, english: englishMergeSortModule },
  { slug: 'heap-sort', source: heapSortModule, english: englishHeapSortModule },
  { slug: 'counting-sort', source: countingSortModule, english: englishCountingSortModule },
  { slug: 'binary-bounds', source: bboundModule, english: englishBinaryBoundsModule },
];

const batchBModules: Array<{
  slug: string;
  source: AlgorithmModule;
  english: AlgorithmModule;
}> = [
  { slug: 'kruskal', source: kruskalModule, english: englishKruskalModule },
  { slug: 'prim', source: primModule, english: englishPrimModule },
  { slug: 'bellman-ford', source: bellmanFordModule, english: englishBellmanFordModule },
  { slug: 'topological-sort', source: topoModule, english: englishTopoModule },
  { slug: 'closest-pair', source: closestPairModule, english: englishClosestPairModule },
];

const batchCModules: Array<{
  slug: string;
  source: AlgorithmModule;
  english: AlgorithmModule;
}> = [
  { slug: 'edit-distance', source: editDistModule, english: englishEditDistanceModule },
  { slug: 'lcs', source: lcsModule, english: englishLcsModule },
  { slug: 'lis', source: lisModule, english: englishLisModule },
  { slug: 'n-queens', source: queensModule, english: englishNQueensModule },
  { slug: 'subsets', source: subsetsModule, english: englishSubsetsModule },
];

const batchDModules: Array<{
  slug: string;
  source: AlgorithmModule;
  english: AlgorithmModule;
}> = [
  { slug: 'maze', source: mazeModule, english: englishMazeModule },
  { slug: 'rabin-karp', source: rabinKarpModule, english: englishRabinKarpModule },
  { slug: 'manacher', source: manacherModule, english: englishManacherModule },
  { slug: 'sieve-of-eratosthenes', source: sieveModule, english: englishSieveModule },
  { slug: 'gcd', source: gcdModule, english: englishGcdModule },
];

const modules = [
  ...legacyModules,
  ...batchAModules,
  ...batchBModules,
  ...batchCModules,
  ...batchDModules,
];

function visualStructure(step: Step): Omit<Step, 'caption' | 'vars' | 'quiz'> {
  const structure: Partial<Step> = { ...step };
  delete structure.caption;
  delete structure.vars;
  delete structure.quiz;
  if (structure.matrix) {
    structure.matrix = {
      ...structure.matrix,
      labels: structure.matrix.labels.map(() => ''),
      rowLabels: structure.matrix.rowLabels?.map(() => ''),
      colLabels: structure.matrix.colLabels?.map(() => ''),
    };
  }
  if (structure.decisionTree) {
    structure.decisionTree = {
      ...structure.decisionTree,
      nodes: structure.decisionTree.nodes.map((node) => ({ ...node, label: '' })),
      edges: structure.decisionTree.edges.map((edge) => ({ ...edge, label: '' })),
    };
  }
  if (structure.manacher) {
    const manacher = { ...structure.manacher };
    delete manacher.statusLabels;
    structure.manacher = manacher;
  }
  return structure as Omit<Step, 'caption' | 'vars' | 'quiz'>;
}

describe('English algorithm module adapters', () => {
  it('TC-I18N-MODULE-130-01: 二十七个 adapter 由 typed map 完整导出', () => {
    expect(Object.keys(englishAlgorithmModules).sort()).toEqual(
      modules.map((item) => item.slug).sort(),
    );
  });

  it('TC-I18N-MODULE-126-01: 七页步骤、执行点和所有视觉轨与中文 module 一致', () => {
    for (const { slug, source, english } of legacyModules) {
      const input = source.initialInput();
      expect(english.initialInput(), slug).toEqual(input);

      const sourceSteps = source.buildSteps(input);
      const englishSteps = english.buildSteps(input);
      expect(englishSteps, slug).toHaveLength(sourceSteps.length);
      expect(englishSteps.map(visualStructure), slug).toEqual(sourceSteps.map(visualStructure));
    }
  });

  it('TC-I18N-MODULE-126-02: 标题、输入、字幕、变量、题卡与源码无中文残留', () => {
    for (const { slug, english } of legacyModules) {
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
    for (const { slug, source, english } of legacyModules) {
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

  it('TC-I18N-MODULE-130-02A: Batch A 五页步骤、执行点和视觉轨与中文 module 一致', () => {
    for (const { slug, source, english } of batchAModules) {
      const input = source.initialInput();
      const sourceSteps = source.buildSteps(input);
      const englishSteps = english.buildSteps(input);

      expect(english.initialInput(), slug).toEqual(input);
      expect(englishSteps, slug).toHaveLength(sourceSteps.length);
      expect(englishSteps.map(visualStructure), slug).toEqual(sourceSteps.map(visualStructure));
    }
  });

  it('TC-I18N-MODULE-130-03A: Batch A 五页展示字段与源码无中文残留', () => {
    for (const { slug, english } of batchAModules) {
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
    }
  });

  it('TC-I18N-MODULE-130-04A: Batch A 五页四语言、代码行数与 lineMap 保持不变', () => {
    for (const { slug, source, english } of batchAModules) {
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

  it('TC-I18N-MODULE-130-02B: Batch B 五页步骤、执行点和视觉轨与中文 module 一致', () => {
    for (const { slug, source, english } of batchBModules) {
      const input = source.initialInput();
      const sourceSteps = source.buildSteps(input);
      const englishSteps = english.buildSteps(input);

      expect(english.initialInput(), slug).toEqual(input);
      expect(englishSteps, slug).toHaveLength(sourceSteps.length);
      expect(englishSteps.map(visualStructure), slug).toEqual(sourceSteps.map(visualStructure));
    }
  });

  it('TC-I18N-MODULE-130-03B: Batch B 五页展示字段与源码无中文残留', () => {
    for (const { slug, english } of batchBModules) {
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
    }
  });

  it('TC-I18N-MODULE-130-04B: Batch B 五页四语言、代码行数与 lineMap 保持不变', () => {
    for (const { slug, source, english } of batchBModules) {
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

  it('TC-I18N-MODULE-130-02C: Batch C 五页步骤、执行点和视觉结构与中文 module 一致', () => {
    for (const { slug, source, english } of batchCModules) {
      const input = source.initialInput();
      const sourceSteps = source.buildSteps(input);
      const englishSteps = english.buildSteps(input);

      expect(english.initialInput(), slug).toEqual(input);
      expect(englishSteps, slug).toHaveLength(sourceSteps.length);
      expect(englishSteps.map(visualStructure), slug).toEqual(sourceSteps.map(visualStructure));
    }
  });

  it('TC-I18N-MODULE-130-03C: Batch C 五页展示字段、轨道标签与源码无中文残留', () => {
    for (const { slug, english } of batchCModules) {
      const steps = english.buildSteps(english.initialInput());
      const visibleText = JSON.stringify({
        title: english.title,
        hint: english.inputSpec?.hint,
        steps: steps.map(({ caption, vars, quiz, matrix, decisionTree }) => ({
          caption,
          vars,
          quiz,
          matrixLabels: matrix
            ? [matrix.labels, matrix.rowLabels, matrix.colLabels, matrix.emptyText]
            : undefined,
          decisionTreeLabels: decisionTree
            ? [
                decisionTree.nodes.map((node) => node.label),
                decisionTree.edges.map((edge) => edge.label),
              ]
            : undefined,
        })),
        sources: english.sources.map((source) => source.code),
      });

      expect(visibleText, slug).not.toMatch(HAN);
      expect(
        steps.every((step) => Boolean(step.caption?.trim())),
        slug,
      ).toBe(true);
    }
  });

  it('TC-I18N-MODULE-130-04C: Batch C 五页四语言、代码行数与 lineMap 保持不变', () => {
    for (const { slug, source, english } of batchCModules) {
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

  it('TC-I18N-MODULE-130-02D: Batch D 五页步骤、执行点和视觉结构与中文 module 一致', () => {
    for (const { slug, source, english } of batchDModules) {
      const input = source.initialInput();
      const sourceSteps = source.buildSteps(input);
      const englishSteps = english.buildSteps(input);

      expect(english.initialInput(), slug).toEqual(input);
      expect(englishSteps, slug).toHaveLength(sourceSteps.length);
      expect(englishSteps.map(visualStructure), slug).toEqual(sourceSteps.map(visualStructure));
    }
  });

  it('TC-I18N-MODULE-130-03D: Batch D 五页展示字段与源码无中文残留', () => {
    for (const { slug, english } of batchDModules) {
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
    }
  });

  it('TC-I18N-MODULE-130-04D: Batch D 五页四语言、代码行数与 lineMap 保持不变', () => {
    for (const { slug, source, english } of batchDModules) {
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
