import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { ENGLISH_ICON_BY_KEY } from './en/icons';
import { LOCALIZED_PAGE_PAIRS, getEnglishLearningPaths, getLanguageSwitchRoute } from './catalog';
import { englishPageLoaders } from '@/views/English/pages';

const HAN = /[\u3400-\u9fff]/;
const structureSlugs = [
  'array',
  'link',
  'stack',
  'queue',
  'tree',
  'heap',
  'hash',
  'graph',
  'trie',
  'union-find',
  'lru',
  'skip-list',
  'segment-tree',
  'b-tree',
  'bloom-filter',
] as const;

const structurePairs = LOCALIZED_PAGE_PAIRS.filter((page) => page.kind === 'structure');

describe('C131 English data-structure page parity', () => {
  it('TC-I18N-STRUCT-131-B01: catalog contains exactly the fifteen interactive structure pages', () => {
    expect(structurePairs.map((page) => page.key)).toEqual(structureSlugs);
  });

  it('TC-I18N-STRUCT-131-B02: every structure has complete metadata, icon, and language switch', () => {
    for (const page of structurePairs) {
      expect(page.en.category).toBe('Data Structures');
      expect(page.en.description.length, page.key).toBeGreaterThan(40);
      expect(page.en.complexity.note.length, page.key).toBeGreaterThan(20);
      expect(ENGLISH_ICON_BY_KEY[page.en.iconKey], page.key).toBeTruthy();
      expect(getLanguageSwitchRoute(page.zh.name, 'en')).toEqual({ name: page.en.name });
      expect(getLanguageSwitchRoute(page.en.name, 'zh-CN')).toEqual({ name: page.zh.name });
    }
  });

  it('TC-I18N-STRUCT-131-C01: learning paths include every structure exactly once', () => {
    const pathKeys = getEnglishLearningPaths().flatMap((path) =>
      path.steps.filter((page) => page.kind === 'structure').map((page) => page.key),
    );
    expect(pathKeys).toEqual(structureSlugs);
  });

  it('TC-I18N-STRUCT-131-C02: all fifteen static loaders render English-only pages', async () => {
    for (const page of structurePairs) {
      const loader = englishPageLoaders[page.en.name as keyof typeof englishPageLoaders];
      expect(loader, page.key).toBeDefined();
      const loaded = await loader();
      const wrapper = mount(loaded.default, {
        global: {
          stubs: {
            RouterLink: { template: '<a><slot /></a>' },
          },
        },
      });
      expect(wrapper.text(), page.key).not.toMatch(HAN);
      wrapper.unmount();
    }
  });
});
