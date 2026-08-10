import { describe, expect, it } from 'vitest';

const structureSources = import.meta.glob('./*Viz.vue', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

function openingTags(source: string, tagPattern: string): string[] {
  return source.match(new RegExp(`<${tagPattern}\\b[^>]*>`, 'g')) ?? [];
}

describe('structure visualization accessibility contract', () => {
  it('TC-RESPONSIVE-140-07 exposes every dynamic status as a polite live region', () => {
    for (const [path, source] of Object.entries(structureSources)) {
      const statuses = openingTags(source, 'p').filter((tag) => /class="[^"]*\bstatus\b/.test(tag));

      expect(statuses.length, `${path} should expose its status`).toBeGreaterThan(0);
      for (const tag of statuses) {
        expect(tag, `${path} status role`).toContain('role="status"');
        expect(tag, `${path} status live region`).toContain('aria-live="polite"');
      }
    }
  });

  it('TC-RESPONSIVE-140-07 gives every structure input an accessible name', () => {
    for (const [path, source] of Object.entries(structureSources)) {
      for (const tag of openingTags(source, 'input')) {
        expect(tag, `${path} input accessible name`).toMatch(/(?:aria-label|aria-labelledby)=/);
      }
    }
  });

  it('TC-RESPONSIVE-140-07 keeps non-native click targets keyboard reachable', () => {
    for (const [path, source] of Object.entries(structureSources)) {
      const clickTargets = source.match(/<(?!button\b)[A-Za-z][^>]*@click="[^"]+"[^>]*>/g) ?? [];

      for (const tag of clickTargets) {
        expect(tag, `${path} click target role`).toContain('role="button"');
        expect(tag, `${path} click target tab stop`).toContain('tabindex="0"');
        expect(tag, `${path} click target Enter handler`).toContain('@keydown.enter.prevent=');
        expect(tag, `${path} click target Space handler`).toContain('@keydown.space.prevent=');
      }
    }
  });
});
