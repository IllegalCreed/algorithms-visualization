import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SuffixArrayView from './SuffixArrayView.vue';
import type { SuffixArrayTrack } from '@/components/player/types';

const base: SuffixArrayTrack = {
  s: 'banana',
  k: 2,
  order: [5, 3, 1, 0, 4, 2],
  rank: [3, 2, 5, 1, 4, 0],
};

const mountIt = (t: Partial<SuffixArrayTrack> = {}) =>
  mount(SuffixArrayView, { props: { suffixArray: { ...base, ...t } } });

describe('SuffixArrayView 后缀轨', () => {
  it('TC-VIZ-SAVIEW-01 6 后缀行；首行后缀以 a 开头', () => {
    const w = mountIt();
    const rows = w.findAll('.sa-row');
    expect(rows).toHaveLength(6);
    expect(rows[0].find('.sa-suffix').text().startsWith('a')).toBe(true); // order[0]=5 → 'a'
  });

  it('TC-VIZ-SAVIEW-02 每行下标 = order[row]', () => {
    const w = mountIt();
    const idx = w.findAll('.sa-index').map((e) => e.text());
    expect(idx).toEqual(['5', '3', '1', '0', '4', '2']);
  });

  it('TC-VIZ-SAVIEW-03 phase sort→.sa-key-active；rank→.sa-rank-active', () => {
    const wSort = mountIt({ phase: 'sort' });
    expect(wSort.findAll('.sa-key-active').length).toBeGreaterThanOrEqual(1);
    const wRank = mountIt({ phase: 'rank' });
    expect(wRank.findAll('.sa-rank-active').length).toBeGreaterThanOrEqual(1);
  });
});
