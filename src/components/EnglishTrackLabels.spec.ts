import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ManacherView from './ManacherView.vue';
import PowerView from './PowerView.vue';
import SuffixArrayView from './SuffixArrayView.vue';
import type { ManacherTrack, PowerTrack, SuffixArrayTrack } from './player/types';

const HAN = /[\u3400-\u9fff]/;

const manacher: ManacherTrack = {
  s: '#a#',
  p: [0, 1, 0],
  center: 1,
  mirror: 1,
  boxL: 0,
  boxR: 2,
  best: [0, 2],
  status: 'mirror',
};

const power: PowerTrack = {
  a: 3,
  n: 5,
  binary: '101',
  blocks: [{ k: 0, exp: 1, value: 3, bit: 1, selected: true }],
  current: 0,
  result: 3,
};

const suffixArray: SuffixArrayTrack = {
  s: 'aba',
  k: 1,
  order: [2, 0, 1],
  rank: [0, 1, 0],
  phase: 'sort',
};

describe('English player track labels', () => {
  it('TC-I18N-UI-131-05: Manacher, power, and suffix-array fixed labels support English', () => {
    const wrappers = [
      mount(ManacherView, { props: { manacher, locale: 'en' } }),
      mount(PowerView, { props: { power, locale: 'en' } }),
      mount(SuffixArrayView, { props: { suffixArray, locale: 'en' } }),
    ];

    for (const wrapper of wrappers) {
      expect(wrapper.text()).not.toMatch(HAN);
      wrapper.unmount();
    }
  });

  it('TC-I18N-UI-131-06: omitted locale preserves existing Chinese fixed labels', () => {
    expect(mount(ManacherView, { props: { manacher } }).text()).toContain('镜像复用');
    expect(mount(PowerView, { props: { power } }).text()).toContain('结果');
    expect(mount(SuffixArrayView, { props: { suffixArray } }).text()).toContain('后缀');
  });
});
