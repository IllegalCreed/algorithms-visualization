import { describe, expect, it } from 'vitest';
import type { AlgorithmModule, Step } from '@/components/player/types';
import { getEnglishAlgorithmPages } from '@/i18n/catalog';
import { englishAlgorithmModules } from './index';
import { fullParityAlgorithmModules } from './fullParityRegistry';
import { findUntranslatedTechnicalText } from '../shared';

const HAN = /[\u3400-\u9fff]/;

const SOURCE_BASENAME_BY_SLUG = {
  'cocktail-sort': 'cocktail',
  'bitonic-sort': 'bitonic',
  'selection-sort': 'selection-sort',
  'insertion-sort': 'insertion-sort',
  'binary-insertion-sort': 'binary-insertion',
  'shell-sort': 'shell-sort',
  'top-down-merge-sort': 'top-down-merge',
  'three-way-quick-sort': 'three-way-quick',
  'dual-pivot-quick-sort': 'dual-pivot-quick',
  'radix-sort': 'radix-sort',
  'bucket-sort': 'bucket-sort',
  'floyd-warshall': 'floyd',
  scc: 'scc',
  'two-sat': 'twosat',
  'max-flow': 'maxflow',
  hungarian: 'hungarian',
  lca: 'lca',
  'euler-path': 'euler',
  'complete-knapsack': 'completeknapsack',
  'coin-change': 'coinchange',
  'stone-merge': 'stones',
  tsp: 'tsp',
  'tree-dp': 'treedp',
  'digit-dp': 'digitdp',
  'reroot-dp': 'reroot',
  permutations: 'permute',
  'combination-sum': 'combsum',
  'number-of-islands': 'islands',
  'word-search': 'wordsearch',
  sudoku: 'sudoku',
  astar: 'astar',
  'boyer-moore': 'boyermoore',
  'suffix-array': 'suffixarray',
  'lcp-array': 'lcparray',
  'aho-corasick': 'ahocorasick',
  'z-function': 'zfunc',
  'linear-sieve': 'linearsieve',
  'fast-power': 'fastpower',
  'ext-gcd': 'extgcd',
  crt: 'crt',
  'euler-phi': 'phi',
  'miller-rabin': 'mr',
  fft: 'fft',
  'pollard-rho': 'rho',
  'rotating-calipers': 'calipers',
  'segment-intersection': 'segint',
  'bentley-ottmann': 'bentley',
  'rotated-search': 'rotsearch',
  'binary-answer': 'banswer',
  'ternary-search': 'ternary',
} as const satisfies Record<keyof typeof fullParityAlgorithmModules, string>;

const sourceFiles = import.meta.glob<Record<string, unknown>>('../../../algorithms/*.module.ts', {
  eager: true,
});

function isAlgorithmModule(value: unknown): value is AlgorithmModule {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<AlgorithmModule>;
  return (
    typeof candidate.title === 'string' &&
    typeof candidate.initialInput === 'function' &&
    typeof candidate.buildSteps === 'function' &&
    Array.isArray(candidate.sources)
  );
}

function sourceModule(basename: string): AlgorithmModule {
  const entry = Object.entries(sourceFiles).find(([path]) =>
    path.endsWith(`/${basename}.module.ts`),
  );
  const source = entry && Object.values(entry[1]).find(isAlgorithmModule);
  if (!source) throw new Error(`Source algorithm module is missing: ${basename}`);
  return source;
}

const modules = Object.entries(fullParityAlgorithmModules).map(([slug, english]) => ({
  slug,
  source: sourceModule(SOURCE_BASENAME_BY_SLUG[slug as keyof typeof fullParityAlgorithmModules]),
  english: english as AlgorithmModule,
}));

function withoutNarration(step: Step): Record<string, unknown> {
  const copy = structuredClone(step) as unknown as Record<string, unknown>;
  delete copy.caption;
  delete copy.vars;
  delete copy.quiz;
  return copy;
}

function expectLocalizedStructure(source: unknown, english: unknown, context: string): void {
  if (typeof source === 'string') {
    expect(typeof english, context).toBe('string');
    if (HAN.test(source)) {
      expect(english as string, context).not.toMatch(HAN);
      expect((english as string).trim().length, context).toBeGreaterThan(0);
    } else {
      expect(english, context).toBe(source);
    }
    return;
  }
  if (Array.isArray(source)) {
    expect(Array.isArray(english), context).toBe(true);
    expect(english as unknown[], context).toHaveLength(source.length);
    source.forEach((item, index) =>
      expectLocalizedStructure(item, (english as unknown[])[index], `${context}[${index}]`),
    );
    return;
  }
  if (source && typeof source === 'object') {
    expect(english && typeof english === 'object', context).toBe(true);
    expect(Object.keys(english as object).sort(), context).toEqual(Object.keys(source).sort());
    for (const [key, value] of Object.entries(source)) {
      expectLocalizedStructure(
        value,
        (english as Record<string, unknown>)[key],
        `${context}.${key}`,
      );
    }
    return;
  }
  expect(english, context).toBe(source);
}

describe('C131 English AlgorithmPlayer adapters', () => {
  it('TC-I18N-MODULE-131-00: seventy-seven adapters exactly match the algorithm catalog', () => {
    expect(Object.keys(englishAlgorithmModules).sort()).toEqual(
      getEnglishAlgorithmPages()
        .map((page) => page.key)
        .sort(),
    );
  });

  it('TC-I18N-MODULE-131-D01: fifty adapters preserve every non-narrative step field', () => {
    expect(modules).toHaveLength(50);
    for (const item of modules) {
      const input = item.source.initialInput();
      expect(item.english.initialInput(), item.slug).toEqual(input);
      const sourceSteps = item.source.buildSteps(input);
      const englishSteps = item.english.buildSteps(input);
      expect(englishSteps, item.slug).toHaveLength(sourceSteps.length);
      sourceSteps.forEach((step, index) =>
        expectLocalizedStructure(
          withoutNarration(step),
          withoutNarration(englishSteps[index]),
          `${item.slug}/step-${index}`,
        ),
      );
    }
  });

  it('TC-I18N-MODULE-131-D02: fifty adapters expose no Han text and caption every step', () => {
    for (const item of modules) {
      const steps = item.english.buildSteps(item.english.initialInput());
      const visibleText = JSON.stringify({
        title: item.english.title,
        hint: item.english.inputSpec?.hint,
        steps,
        sources: item.english.sources.map((source) => source.code),
      });
      expect(visibleText, item.slug).not.toMatch(HAN);
      expect(visibleText.match(/.{0,60}\[translation pending\].{0,60}/g) ?? [], item.slug).toEqual(
        [],
      );
      expect(
        steps.every((step) => Boolean(step.caption?.trim())),
        item.slug,
      ).toBe(true);
    }
  });

  it('TC-I18N-MODULE-131-D02A: shared technical copy covers every source label without fallback', () => {
    const pending = new Set<string>();
    for (const item of modules) {
      const sourceSteps = item.source.buildSteps(item.source.initialInput()).map((step) => {
        const copy = structuredClone(step);
        delete copy.caption;
        return copy;
      });
      const sourceText = JSON.stringify({
        steps: sourceSteps,
      });
      for (const segment of findUntranslatedTechnicalText(sourceText)) pending.add(segment);
    }
    expect([...pending].sort()).toEqual([]);
  });

  it('TC-I18N-MODULE-131-D03: fifty adapters preserve source languages, lines, and line maps', () => {
    for (const item of modules) {
      expect(
        item.english.sources.map((source) => source.lang),
        item.slug,
      ).toEqual(item.source.sources.map((source) => source.lang));
      item.source.sources.forEach((source, index) => {
        const english = item.english.sources[index];
        expect(english.lineMap, `${item.slug}/${source.lang}`).toEqual(source.lineMap);
        expect(english.code.split('\n'), `${item.slug}/${source.lang}`).toHaveLength(
          source.code.split('\n').length,
        );
      });
    }
  });
});
