import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import HashProbeViz from './HashProbeViz.vue';

const mountIt = () => mount(HashProbeViz);
const btn = (w: ReturnType<typeof mountIt>, label: string) =>
  w.findAll('.btn').find((b) => b.text().includes(label))!;
const setVal = (w: ReturnType<typeof mountIt>, v: number | string) =>
  w.find('.val-input').setValue(String(v));

describe('HashProbeViz 开放寻址互动', () => {
  it('TC-VIZ-PROBEVIZ-01 初始 7 格 + 4 filled + 3 按钮 + readout 含 4/7', () => {
    const w = mountIt();
    expect(w.findAll('.cell')).toHaveLength(7);
    expect(w.findAll('.cell.filled')).toHaveLength(4);
    expect(btn(w, '插入')).toBeTruthy();
    expect(btn(w, '查找')).toBeTruthy();
    expect(btn(w, '重置')).toBeTruthy();
    expect(w.find('.readout').text()).toContain('4/7');
  });
  it('TC-VIZ-PROBEVIZ-02 初始 filled 格含 15/8/23/4', () => {
    const w = mountIt();
    const txt = w.findAll('.cell.filled').map((c) => c.text());
    expect(txt).toContain('15');
    expect(txt).toContain('8');
    expect(txt).toContain('23');
    expect(txt).toContain('4');
  });
  it('TC-VIZ-PROBEVIZ-03 插入 5（非冲突）：filled→5、status 含「落座」', async () => {
    const w = mountIt();
    await setVal(w, 5);
    await btn(w, '插入').trigger('click');
    expect(w.findAll('.cell.filled')).toHaveLength(5);
    expect(w.find('.status').text()).toContain('落座');
  });
  it('TC-VIZ-PROBEVIZ-04 插入 9（冲突）：filled→5、status 含「探测」', async () => {
    const w = mountIt();
    await setVal(w, 9);
    await btn(w, '插入').trigger('click');
    expect(w.findAll('.cell.filled')).toHaveLength(5);
    expect(w.find('.status').text()).toContain('探测');
  });
  it('TC-VIZ-PROBEVIZ-05 查找 8（命中）：status 含「命中」', async () => {
    const w = mountIt();
    await setVal(w, 8);
    await btn(w, '查找').trigger('click');
    expect(w.find('.status').text()).toContain('命中');
  });
  it('TC-VIZ-PROBEVIZ-06 查找 99（未命中）：status 含「不在表中」', async () => {
    const w = mountIt();
    await setVal(w, 99);
    await btn(w, '查找').trigger('click');
    expect(w.find('.status').text()).toContain('不在表中');
  });
  it('TC-VIZ-PROBEVIZ-07 填满后插入：status 含「扩容」、readout 含 7/7', async () => {
    vi.useFakeTimers();
    try {
      const w = mountIt();
      for (const v of [7, 5, 6]) {
        await setVal(w, v);
        await btn(w, '插入').trigger('click');
        await vi.runAllTimersAsync();
      }
      await setVal(w, 99);
      await btn(w, '插入').trigger('click');
      expect(w.find('.readout').text()).toContain('7/7');
      expect(w.find('.status').text()).toContain('扩容');
    } finally {
      vi.useRealTimers();
    }
  });
  it('TC-VIZ-PROBEVIZ-08 重置：filled 回 4、readout 回 4/7', async () => {
    const w = mountIt();
    await setVal(w, 5);
    await btn(w, '插入').trigger('click');
    await btn(w, '重置').trigger('click');
    expect(w.findAll('.cell.filled')).toHaveLength(4);
    expect(w.find('.readout').text()).toContain('4/7');
  });
});
