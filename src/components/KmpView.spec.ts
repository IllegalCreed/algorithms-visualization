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

  it('TC-VIZ-KMPVIEW-05 windowStart=2（P 长 3）→ 3 格 .kmp-window；lps=[] → 无 π 行（C-063 扩展）', () => {
    const w = mountIt({ pattern: 'cab', windowStart: 2, lps: [] });
    expect(w.findAll('.kmp-window')).toHaveLength(3); // 窗口 [2,5) 共 3 格
    expect(w.findAll('.kmp-lps-cell')).toHaveLength(0); // lps 空 → π 行隐藏
  });

  it('TC-VIZ-KMPVIEW-06 matchedFrom=1（P 长 3）→ 模式后缀 2 格 .kmp-matched（C-064 扩展）', () => {
    const w = mountIt({ pattern: 'abc', matchedFrom: 1, matchedLen: 0 });
    expect(w.findAll('.kmp-pat-cell.kmp-matched')).toHaveLength(2); // 后缀 [1,3) 共 2 格
  });
});
