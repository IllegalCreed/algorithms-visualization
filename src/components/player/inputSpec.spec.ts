// src/components/player/inputSpec.spec.ts —— 自定义输入解析纯函数（C-110，M10-P1）
import { describe, it, expect } from 'vitest';
import { parseInputArray, SORT_INPUT_SPEC } from './inputSpec';

const spec = SORT_INPUT_SPEC;

describe('parseInputArray', () => {
  it('TC-INPUT-PARSE-01 合法：逗号/空格/中文逗号混合', () => {
    const r = parseInputArray('5, 3，8 1', spec);
    expect(r).toEqual({ ok: true, value: [5, 3, 8, 1] });
  });

  it('TC-INPUT-PARSE-02 非数字报错', () => {
    const r = parseInputArray('5,a,3', spec);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain('数字');
  });

  it('TC-INPUT-PARSE-03 小数拒绝', () => {
    const r = parseInputArray('5,3.5', spec);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain('整数');
  });

  it('TC-INPUT-PARSE-04 长度越界（下界与上界）', () => {
    const one = parseInputArray('5', spec);
    expect(one.ok).toBe(false);
    if (!one.ok) expect(one.error).toContain(`${spec.lenMin}`);
    const thirteen = parseInputArray(Array.from({ length: 13 }, (_, i) => i + 1).join(','), spec);
    expect(thirteen.ok).toBe(false);
    if (!thirteen.ok) expect(thirteen.error).toContain(`${spec.lenMax}`);
  });

  it('TC-INPUT-PARSE-05 值域越界', () => {
    const low = parseInputArray('0, 5', spec);
    expect(low.ok).toBe(false);
    if (!low.ok) expect(low.error).toContain(`${spec.valMin}`);
    const high = parseInputArray('5, 100', spec);
    expect(high.ok).toBe(false);
    if (!high.ok) expect(high.error).toContain(`${spec.valMax}`);
  });

  it('TC-INPUT-PARSE-06 空串/纯分隔符不崩溃', () => {
    expect(parseInputArray('', spec).ok).toBe(false);
    expect(parseInputArray(' ,， ', spec).ok).toBe(false);
  });
});
