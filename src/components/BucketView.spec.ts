// src/components/BucketView.spec.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BucketView from './BucketView.vue';
import type { BucketTrack } from '@/components/player/types';

const RANGES: [number, number][] = [
  [0, 9],
  [10, 19],
  [20, 29],
  [30, 39],
  [40, 49],
];

const mountIt = (bucket: BucketTrack) => mount(BucketView, { props: { bucket } });

describe('BucketView', () => {
  // 演示态：5 桶宽 10，桶0[3,9] 桶1[] 桶2[21,25,29] 桶3[37] 桶4[43,49]，活动桶 2
  const base: BucketTrack = {
    buckets: [[3, 9], [], [21, 25, 29], [37], [43, 49]],
    ranges: RANGES,
    activeBucket: 2,
  };

  it('TC-VIZ-BUCKETVIEW-01 渲染桶数 = buckets.length，且每桶带值域标签', () => {
    const w = mountIt(base);
    expect(w.findAll('.bucket-col')).toHaveLength(5);
    expect(w.findAll('.bucket-range')).toHaveLength(5);
    expect(w.findAll('.bucket-range')[0].text()).toContain('0');
    expect(w.findAll('.bucket-range')[0].text()).toContain('9');
  });

  it('TC-VIZ-BUCKETVIEW-02 桶内每元素一格、文本为该值', () => {
    const cols = mountIt(base).findAll('.bucket-col');
    const cells = cols[2].findAll('.bucket-cell');
    expect(cells).toHaveLength(3);
    expect(cells.map((c) => c.text())).toEqual(['21', '25', '29']);
  });

  it('TC-VIZ-BUCKETVIEW-03 activeBucket 桶带 .active，其余不带', () => {
    const cols = mountIt(base).findAll('.bucket-col');
    expect(cols[2].classes()).toContain('active');
    expect(cols[0].classes()).not.toContain('active');
  });

  it('TC-VIZ-BUCKETVIEW-04 空桶渲染 0 格、仍显值域标签', () => {
    const cols = mountIt(base).findAll('.bucket-col');
    expect(cols[1].findAll('.bucket-cell')).toHaveLength(0);
    expect(cols[1].find('.bucket-range').text()).toContain('10');
  });
});
