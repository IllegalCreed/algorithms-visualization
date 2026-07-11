import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { ENGLISH_FULL_PARITY_ADDITIONS } from '@/i18n/en/fullParityPages';
import { fullParityAlgorithmModules } from '@/i18n/en/modules/fullParityRegistry';
import { englishPageLoaders } from './pages';

const HAN = /[\u3400-\u9fff]/;
const algorithmPages = ENGLISH_FULL_PARITY_ADDITIONS.filter((page) => page.kind === 'algorithm');

describe('C131 English full-parity algorithm content', () => {
  it('TC-I18N-CONTENT-131-01: fifty metadata rows, adapters, and static loaders are bidirectionally complete', () => {
    const metadataKeys = algorithmPages.map((page) => page.key).sort();
    const adapterKeys = Object.keys(fullParityAlgorithmModules).sort();
    const loaderKeys = algorithmPages.map((page) => `en-${page.key}`).sort();

    expect(metadataKeys).toHaveLength(50);
    expect(adapterKeys).toEqual(metadataKeys);
    expect(loaderKeys.every((name) => name in englishPageLoaders)).toBe(true);
  });

  it('TC-I18N-CONTENT-131-02: all fifty pages render substantive English-only learning content', async () => {
    for (const page of algorithmPages) {
      const name = `en-${page.key}` as keyof typeof englishPageLoaders;
      const loaded = await englishPageLoaders[name]();
      const wrapper = mount(loaded.default, {
        global: {
          stubs: {
            AlgorithmPlayer: { template: '<div class="algorithm-player-stub" />' },
            RouterLink: { template: '<a><slot /></a>' },
          },
        },
      });

      expect(wrapper.get('h1').text(), page.key).toBe(page.heading);
      expect(wrapper.findAll('h2'), page.key).toHaveLength(4);
      expect(wrapper.find('.algorithm-player-stub').exists(), page.key).toBe(true);
      expect(wrapper.text().length, page.key).toBeGreaterThan(500);
      expect(wrapper.text(), page.key).not.toMatch(HAN);
      wrapper.unmount();
    }
  });
});
