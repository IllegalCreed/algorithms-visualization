// src/algorithms/fft.module.spec.ts —— FFT module 对拍 oracle（C-107）
import { describe, it, expect } from 'vitest';
import { buildFftSteps, fftModule } from './fft.module';
import { fftTrace, dftBrute } from './fft';
import { fftSources } from './fft.sources';

const POINTS = new Set(['init', 'bitrev', 'twiddle', 'butterfly', 'done']);

describe('fft.module', () => {
  const steps = buildFftSteps();
  const last = steps[steps.length - 1];
  const tr = fftTrace();

  it('TC-FFT-MOD-01 对拍：末层 = 直算 DFT', () => {
    expect(tr.layers[3]).toEqual(dftBrute());
    expect(tr.layers[3][0]).toBe('10');
    expect(tr.layers[3][2]).toBe('-2+2i');
    expect(tr.layers[3][1]).toBe('-0.41-7.24i');
  });

  it('TC-FFT-MOD-02 逐层值：位反转 + layer1 + layer2 复数登场', () => {
    expect(tr.rev).toEqual([0, 4, 2, 6, 1, 5, 3, 7]);
    expect(tr.layers[0]).toEqual(['1', '0', '3', '0', '2', '0', '4', '0']);
    expect(tr.layers[1]).toEqual(['1', '1', '3', '3', '2', '2', '4', '4']);
    expect(tr.layers[2][1]).toBe('1-3i');
    expect(tr.layers[2][3]).toBe('1+3i');
  });

  it('TC-FFT-MOD-03 步合法：point + network + array 空', () => {
    for (const s of steps) {
      expect(POINTS.has(s.point)).toBe(true);
      expect(s.network).toBeTruthy();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-FFT-MOD-04 步数结构：9 步序列全等', () => {
    expect(steps.map((s) => s.point)).toEqual([
      'init',
      'bitrev',
      'twiddle',
      'butterfly',
      'twiddle',
      'butterfly',
      'twiddle',
      'butterfly',
      'done',
    ]);
  });

  it('TC-FFT-MOD-05 init 步：顺序输入 + 12 蝶形 3 列', () => {
    const init = steps[0];
    expect(init.network!.wireLabels).toEqual(['1', '2', '3', '4', '0', '0', '0', '0']);
    expect(init.network!.comparators).toHaveLength(12);
    expect(init.network!.cols).toBe(3);
  });

  it('TC-FFT-MOD-06 bitrev 步：重排 + 位反转语义', () => {
    const b = steps[1];
    expect(b.network!.wireLabels).toEqual(['1', '0', '3', '0', '2', '0', '4', '0']);
    expect(b.caption).toContain('位反转');
  });

  it('TC-FFT-MOD-07 twiddle 步：currentCol 逐层 + 值不变', () => {
    const tws = steps.filter((s) => s.point === 'twiddle');
    expect(tws.map((s) => s.network!.currentCol)).toEqual([0, 1, 2]);
    expect(tws[0].network!.wireLabels).toEqual(steps[1].network!.wireLabels);
    expect(tws[0].caption).toMatch(/ω|蝶形/);
  });

  it('TC-FFT-MOD-08 butterfly 步：三步后值 = layer1/2/3', () => {
    const bfs = steps.filter((s) => s.point === 'butterfly');
    expect(bfs[0].network!.wireLabels).toEqual(tr.layers[1]);
    expect(bfs[1].network!.wireLabels).toEqual(tr.layers[2]);
    expect(bfs[2].network!.wireLabels).toEqual(tr.layers[3]);
    expect(bfs[1].caption).toMatch(/1-3i|−i|-i/);
  });

  it('TC-FFT-MOD-09 tag 标注：col0 全 ×1；col1 含 ×ω²；col2 含 ×ω/×ω³', () => {
    const comps = steps[0].network!.comparators;
    expect(comps.filter((c) => c.col === 0).every((c) => c.tag === '×1')).toBe(true);
    expect(comps.filter((c) => c.col === 1).map((c) => c.tag)).toContain('×ω²');
    const col2 = comps.filter((c) => c.col === 2).map((c) => c.tag);
    expect(col2).toContain('×ω');
    expect(col2).toContain('×ω³');
  });

  it('TC-FFT-MOD-10 done：done 标记 + O(n log n) + 三部曲', () => {
    expect(last.network!.done).toBe(true);
    expect(last.caption).toContain('O(n log n)');
    expect(last.caption).toMatch(/IDFT|逐点相乘|点乘/);
  });

  it('TC-FFT-MOD-11 四语言 + 行号 + 五执行点', () => {
    expect(fftSources.map((s) => s.lang).sort()).toEqual(['go', 'python', 'rust', 'ts']);
    for (const src of fftSources) {
      const n = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(n);
      }
      expect(Object.keys(src.lineMap).sort()).toEqual(
        ['bitrev', 'butterfly', 'done', 'init', 'twiddle'].sort(),
      );
    }
  });

  it('TC-FFT-MOD-12 元信息：title 含 FFT；initialInput=[]', () => {
    expect(fftModule.title).toContain('FFT');
    expect(fftModule.initialInput()).toEqual([]);
  });
});
