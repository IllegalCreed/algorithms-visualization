// src/components/CountView.spec.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CountView from './CountView.vue';
import type { CountTrack } from '@/components/player/types';

const mountIt = (count: CountTrack) => mount(CountView, { props: { count } });

describe('CountView', () => {
  // 演示态：值域 1..6、桶 [3,1,2,2,0,2]（值 5 空桶）、活动桶下标 2（值 3）
  const base: CountTrack = { min: 1, buckets: [3, 1, 2, 2, 0, 2], activeBucket: 2 };

  it('TC-VIZ-COUNTVIEW-01 渲染桶数 = buckets.length', () => {
    expect(mountIt(base).findAll('.count-bucket')).toHaveLength(6);
  });

  it('TC-VIZ-COUNTVIEW-02 每桶单元格数 = buckets[b]', () => {
    const buckets = mountIt(base).findAll('.count-bucket');
    expect(buckets[0].findAll('.count-cell')).toHaveLength(3);
    expect(buckets[1].findAll('.count-cell')).toHaveLength(1);
    expect(buckets[2].findAll('.count-cell')).toHaveLength(2);
  });

  it('TC-VIZ-COUNTVIEW-03 桶底值标签 = b + min', () => {
    const buckets = mountIt(base).findAll('.count-bucket');
    expect(buckets[0].find('.count-val').text()).toBe('1');
    expect(buckets[5].find('.count-val').text()).toBe('6');
  });

  it('TC-VIZ-COUNTVIEW-04 activeBucket 桶带 .active，其余不带', () => {
    const buckets = mountIt(base).findAll('.count-bucket');
    expect(buckets[2].classes()).toContain('active');
    expect(buckets[0].classes()).not.toContain('active');
  });

  it('TC-VIZ-COUNTVIEW-05 空桶渲染 0 格、仍显值标签与计数 0', () => {
    const empty = mountIt(base).findAll('.count-bucket')[4];
    expect(empty.findAll('.count-cell')).toHaveLength(0);
    expect(empty.find('.count-val').text()).toBe('5');
    expect(empty.find('.count-num').text()).toBe('0');
  });

  it('TC-VIZ-COUNTVIEW-06 桶顶计数数字 = buckets[b]', () => {
    const buckets = mountIt(base).findAll('.count-bucket');
    expect(buckets[0].find('.count-num').text()).toBe('3');
    expect(buckets[3].find('.count-num').text()).toBe('2');
  });
});
