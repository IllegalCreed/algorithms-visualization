// src/data/paths.spec.ts —— 学习路径数据完整性（C-115，M11-S3）
import { describe, it, expect } from 'vitest';
import { LEARNING_PATHS } from './paths';
import { useCategoryData } from '@/views/Home/Main/hooks';

describe('学习路径数据（C-115）', () => {
  it('TC-DATA-PATHS-01 四条路径；url 全有效；各 ≥8 步且条内无重复', () => {
    expect(LEARNING_PATHS).toHaveLength(4);
    const valid = new Set(useCategoryData().flatMap((c) => c.children.map((i) => i.url)));
    for (const p of LEARNING_PATHS) {
      expect(p.steps.length, p.title).toBeGreaterThanOrEqual(8);
      expect(new Set(p.steps).size, p.title).toBe(p.steps.length);
      for (const s of p.steps) expect(valid.has(s), `${p.title}: ${s}`).toBe(true);
      expect(p.title.length).toBeGreaterThan(0);
      expect(p.desc.length).toBeGreaterThan(0);
    }
  });
});
