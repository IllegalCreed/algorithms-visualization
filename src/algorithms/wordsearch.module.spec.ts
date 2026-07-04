// src/algorithms/wordsearch.module.spec.ts
import { describe, it, expect } from 'vitest';
import { buildWordSearchSteps, wordSearchModule } from './wordsearch.module';
import { wordExists, wordPath, WORD_BOARD, WORD_TARGET, WORD_DIRS } from './wordsearch';
import type { WordSearchExecPoint, Step } from '@/components/player/types';

const steps = () => buildWordSearchSteps();
const last = (ss: Step<WordSearchExecPoint>[]) => ss[ss.length - 1];
const cnt = (ss: Step<WordSearchExecPoint>[], p: WordSearchExecPoint) =>
  ss.filter((s) => s.point === p).length;
const letterAt = ([r, c]: [number, number]) => WORD_BOARD[r][c];
const adjacent = (a: [number, number], b: [number, number]) =>
  WORD_DIRS.some(([dr, dc]) => a[0] + dr === b[0] && a[1] + dc === b[1]);

describe('wordsearch.module', () => {
  it('TC-WS-MOD-01 末步 found + solved + path = wordPath()', () => {
    const l = last(steps());
    expect(l.point).toBe('found');
    expect(l.maze!.solved).toBe(true);
    expect(l.maze!.path).toEqual(wordPath());
    expect(wordPath()).toEqual([
      [2, 0],
      [2, 1],
      [2, 2],
      [2, 3],
    ]);
    expect(wordExists()).toBe(true);
  });

  it('TC-WS-MOD-02 每步执行点合法且带网格轨（array 空）', () => {
    const ok = new Set<WordSearchExecPoint>(['start', 'match', 'mismatch', 'backtrack', 'found']);
    for (const s of steps()) {
      expect(ok.has(s.point)).toBe(true);
      expect(s.maze).toBeDefined();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-WS-MOD-03 每格显字母：letters === WORD_BOARD', () => {
    for (const s of steps()) expect(s.maze!.letters).toEqual(WORD_BOARD);
  });

  it('TC-WS-MOD-04 含真回溯（backtrack ≥ 1）', () => {
    expect(cnt(steps(), 'backtrack')).toBeGreaterThanOrEqual(1);
  });

  it('TC-WS-MOD-05 两次起点尝试，起点字母 = A', () => {
    const starts = steps().filter((s) => s.point === 'start');
    expect(starts.length).toBeGreaterThanOrEqual(2);
    for (const s of starts) {
      const cur = s.maze!.current as [number, number];
      expect(letterAt(cur)).toBe(WORD_TARGET[0]);
      expect(WORD_TARGET[0]).toBe('A');
    }
  });

  it('TC-WS-MOD-06 match 步当前格字母 = 期望字母 word[path.length-1]', () => {
    for (const s of steps().filter((x) => x.point === 'match')) {
      const cur = s.maze!.current as [number, number];
      const k = s.maze!.path!.length - 1;
      expect(letterAt(cur)).toBe(WORD_TARGET[k]);
    }
  });

  it('TC-WS-MOD-07 mismatch 步字母不对（或已在路径）', () => {
    for (const s of steps().filter((x) => x.point === 'mismatch')) {
      const cur = s.maze!.current as [number, number];
      const expected = WORD_TARGET[s.maze!.path!.length]; // 下一个待匹配字母
      const inPath = s.maze!.path!.some(([r, c]) => r === cur[0] && c === cur[1]);
      expect(letterAt(cur) !== expected || inPath).toBe(true);
    }
  });

  it('TC-WS-MOD-08 末步路径拼成 ADEE 且相邻四连通', () => {
    const path = last(steps()).maze!.path as [number, number][];
    expect(path.map((p) => letterAt(p)).join('')).toBe('ADEE');
    for (let i = 1; i < path.length; i++) expect(adjacent(path[i - 1], path[i])).toBe(true);
  });

  it('TC-WS-MOD-09 每步路径无重复格（同格不复用）', () => {
    for (const s of steps()) {
      const path = s.maze!.path ?? [];
      const uniq = new Set(path.map(([r, c]) => r + ',' + c));
      expect(uniq.size).toBe(path.length);
    }
  });

  it('TC-WS-MOD-10 found 步 solved = true', () => {
    for (const s of steps().filter((x) => x.point === 'found')) {
      expect(s.maze!.solved).toBe(true);
    }
  });

  it('TC-WS-MOD-11 四语言 sources 且行号在源码行数内', () => {
    const langs = wordSearchModule.sources.map((s) => s.lang);
    expect(langs).toEqual(['ts', 'python', 'go', 'rust']);
    for (const src of wordSearchModule.sources) {
      const lines = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(lines);
      }
    }
  });

  it('TC-WS-MOD-12 module 元信息', () => {
    expect(wordSearchModule.title).toMatch(/单词搜索/);
    expect(wordSearchModule.initialInput()).toEqual([]);
  });
});
