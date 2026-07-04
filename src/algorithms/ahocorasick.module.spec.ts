// src/algorithms/ahocorasick.module.spec.ts —— AC 自动机 module 对拍 oracle（C-075，字符串第 7 页）
import { describe, it, expect } from 'vitest';
import { buildAcSteps, ahoCorasickModule } from './ahocorasick.module';
import { AC_PATTERNS, AC_TEXT, buildAc, acMatch } from './ahocorasick';
import { ahoCorasickSources } from './ahocorasick.sources';

const POINTS = new Set(['insert', 'fail', 'match', 'hit', 'done']);

describe('ahocorasick.module', () => {
  const steps = buildAcSteps();
  const last = steps[steps.length - 1];
  const { states } = buildAc();

  // 收集某步图中 class='fail' 的边的 (from,to)
  const failPairs = (step: (typeof steps)[number]): string[] => {
    const ec = step.graph!.edgeClass ?? {};
    return step
      .graph!.edges.filter((e) => ec[e.key] === 'fail')
      .map((e) => `${e.from}-${e.to}`)
      .sort();
  };

  it('TC-AC-MOD-01 末步 done + 命中 = acMatch()（she[1,3]/he[2,3]/hers[2,5]）', () => {
    expect(last.point).toBe('done');
    const m = acMatch();
    expect(m).toEqual([
      { pat: 'she', start: 1, end: 3 },
      { pat: 'he', start: 2, end: 3 },
      { pat: 'hers', start: 2, end: 5 },
    ]);
  });

  it('TC-AC-MOD-02 每步执行点合法且带图轨（array 空）', () => {
    for (const s of steps) {
      expect(POINTS.has(s.point)).toBe(true);
      expect(s.graph).toBeTruthy();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-AC-MOD-03 建 Trie：insert 步 3 个；建完 8 状态 + 7 trie 边', () => {
    const ins = steps.filter((s) => s.point === 'insert');
    expect(ins).toHaveLength(3);
    const lastInsert = ins[ins.length - 1];
    expect(lastInsert.graph!.vertices).toHaveLength(8);
    // trie 边 = 非 fail 类边（此阶段还没 fail 边）
    expect(lastInsert.graph!.edges).toHaveLength(7);
  });

  it('TC-AC-MOD-04 BFS 建 fail：fail 步 7 个；末步 fail 边 3 条', () => {
    const fs = steps.filter((s) => s.point === 'fail');
    expect(fs).toHaveLength(7);
    expect(failPairs(last)).toEqual(['4-1', '5-2', '7-3']);
  });

  it('TC-AC-MOD-05 fail 值对拍 buildAc = [0,0,0,0,1,2,0,3]', () => {
    expect(states.map((s) => s.fail)).toEqual([0, 0, 0, 0, 1, 2, 0, 3]);
  });

  it('TC-AC-MOD-06 非平凡 fail 边 = {sh→h(4-1), she→he(5-2), hers→s(7-3)}', () => {
    const nontrivial = states
      .filter((s) => s.id !== 0 && s.fail !== 0)
      .map((s) => `${s.id}-${s.fail}`)
      .sort();
    expect(nontrivial).toEqual(['4-1', '5-2', '7-3']);
  });

  it('TC-AC-MOD-07 匹配逐字符：match+hit 合计 6 步（文本长）', () => {
    const matchLike = steps.filter((s) => s.point === 'match' || s.point === 'hit');
    expect(matchLike).toHaveLength(AC_TEXT.length);
  });

  it('TC-AC-MOD-08 命中步：hit 恰 2 个（i=3 命中 she+he、i=5 命中 hers）', () => {
    const hitSteps = steps.filter((s) => s.point === 'hit');
    expect(hitSteps).toHaveLength(2);
  });

  it('TC-AC-MOD-09 输出链重叠：状态 she(5) 的 out 含 he', () => {
    const heIdx = AC_PATTERNS.indexOf('he');
    expect(states[5].out).toContain(heIdx);
  });

  it('TC-AC-MOD-10 done 步 caption 含三处命中 she/he/hers', () => {
    expect(last.caption).toContain('she');
    expect(last.caption).toContain('he');
    expect(last.caption).toContain('hers');
  });

  it('TC-AC-MOD-11 四语言 sources + 每 point 行号在源码行数内', () => {
    expect(ahoCorasickSources.map((s) => s.lang).sort()).toEqual(['go', 'python', 'rust', 'ts']);
    for (const src of ahoCorasickSources) {
      const n = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(n);
      }
      expect(Object.keys(src.lineMap).sort()).toEqual(
        ['done', 'fail', 'hit', 'insert', 'match'].sort(),
      );
    }
  });

  it('TC-AC-MOD-12 module 元信息 title 含 AC/Aho；initialInput()=[]', () => {
    expect(ahoCorasickModule.title).toMatch(/AC|Aho/);
    expect(ahoCorasickModule.initialInput()).toEqual([]);
  });
});
