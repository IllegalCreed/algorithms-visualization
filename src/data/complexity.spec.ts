// src/data/complexity.spec.ts —— 复杂度数据资产完整性（C-114，M11-S2）
import { describe, it, expect } from 'vitest';
import { COMPLEXITY } from './complexity';
import { useCategoryData } from '@/views/Home/Main/hooks';

describe('复杂度数据资产（C-114）', () => {
  const allUrls = useCategoryData().flatMap((c) => c.children.map((i) => i.url));

  it('TC-DATA-CPLX-01 键集合与九大类 url 完全一致（不多不少）', () => {
    const keys = Object.keys(COMPLEXITY);
    expect(new Set(keys)).toEqual(new Set(allUrls));
    expect(keys).toHaveLength(allUrls.length);
  });

  it('TC-DATA-CPLX-02 每条 time/space 非空且符合书写惯例', () => {
    for (const [url, c] of Object.entries(COMPLEXITY)) {
      expect(c.time.length, url).toBeGreaterThan(0);
      expect(c.space.length, url).toBeGreaterThan(0);
      expect(c.time, url).toMatch(/^(O\(|期望|摊还|平均)/);
      expect(c.space, url).toMatch(/^O\(/);
    }
  });
});
