import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import KmpView from './KmpView.vue';
import type { KmpTrack } from '@/components/player/types';

const base: KmpTrack = {
  text: 'abababcab',
  pattern: 'ababc',
  lps: [0, 0, 1, 2, 0],
  offset: 0,
  matchedLen: 0,
  found: [],
};

const mountIt = (t: Partial<KmpTrack> = {}) =>
  mount(KmpView, { props: { kmp: { ...base, ...t } } });

describe('KmpView 字符串匹配轨', () => {
  it('TC-VIZ-KMPVIEW-01 文本 9 格、模式 5 格、LPS 5 格', () => {
    const w = mountIt();
    expect(w.findAll('.kmp-text-cell')).toHaveLength(9);
    expect(w.findAll('.kmp-pat-cell')).toHaveLength(5);
    expect(w.findAll('.kmp-lps-cell')).toHaveLength(5);
  });

  it('TC-VIZ-KMPVIEW-02 compareText/comparePat=4 → 2 个 .kmp-compare', () => {
    const w = mountIt({ compareText: 4, comparePat: 4 });
    expect(w.findAll('.kmp-compare')).toHaveLength(2);
  });

  it('TC-VIZ-KMPVIEW-03 matchedLen=2 → 2 个 .kmp-matched（模式前缀）', () => {
    const w = mountIt({ matchedLen: 2 });
    expect(w.findAll('.kmp-matched')).toHaveLength(2);
  });

  it('TC-VIZ-KMPVIEW-04 found=[2] → 文本下标 2 起 5 格带 .kmp-found', () => {
    const w = mountIt({ found: [2] });
    expect(w.findAll('.kmp-found')).toHaveLength(5); // P 长 5
  });
});
