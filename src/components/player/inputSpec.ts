// src/components/player/inputSpec.ts —— 自定义输入解析与校验（C-110，M10-P1）
import type { InputSpec } from './types';
import type { SiteLocale } from '@/i18n/pilot';

/** 常规排序共享输入规格（第一批 12 模块）；counting/radix/bitonic 约束特殊不用它 */
export const SORT_INPUT_SPEC: InputSpec = {
  hint: '2~12 个 1..99 的整数，用逗号分隔',
  lenMin: 2,
  lenMax: 12,
  valMin: 1,
  valMax: 99,
};

export type ParseResult = { ok: true; value: number[] } | { ok: false; error: string };

/** 解析用户输入：逗号/空格/中文逗号分隔的整数数组 + 长度/值域校验 */
export function parseInputArray(
  text: string,
  spec: InputSpec,
  locale: SiteLocale = 'zh-CN',
): ParseResult {
  const english = locale === 'en';
  const parts = text
    .split(/[,，\s]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  if (parts.length === 0) {
    return { ok: false, error: english ? 'Enter at least one number' : '请输入数字' };
  }

  const value: number[] = [];
  for (const p of parts) {
    const n = Number(p);
    if (Number.isNaN(n)) {
      return { ok: false, error: english ? `"${p}" is not a number` : `「${p}」不是数字` };
    }
    if (!Number.isInteger(n)) {
      return { ok: false, error: english ? `"${p}" is not an integer` : `「${p}」不是整数` };
    }
    value.push(n);
  }
  if (value.length < spec.lenMin || value.length > spec.lenMax) {
    return {
      ok: false,
      error: english
        ? `Enter ${spec.lenMin} to ${spec.lenMax} values (currently ${value.length})`
        : `个数需在 ${spec.lenMin} ~ ${spec.lenMax} 之间（当前 ${value.length} 个）`,
    };
  }
  for (const n of value) {
    if (n < spec.valMin || n > spec.valMax) {
      return {
        ok: false,
        error: english
          ? `Values must be between ${spec.valMin} and ${spec.valMax} (received ${n})`
          : `数值需在 ${spec.valMin} ~ ${spec.valMax} 之间（「${n}」越界）`,
      };
    }
  }
  return { ok: true, value };
}

/** 从 URL ?input= 读取（合法才返回；无参/非法返回 null） */
export function readInputFromUrl(spec: InputSpec | undefined): number[] | null {
  if (!spec) return null;
  const raw = new URLSearchParams(window.location.search).get('input');
  if (!raw) return null;
  const r = parseInputArray(raw, spec);
  return r.ok ? r.value : null;
}

/** 应用输入后把 ?input= 写回地址栏（不刷新、不碰 vue-router） */
export function writeInputToUrl(arr: number[]): void {
  const url = new URL(window.location.href);
  url.searchParams.set('input', arr.join(','));
  history.replaceState(history.state, '', url);
}

/** 恢复默认时清除 ?input= */
export function clearInputFromUrl(): void {
  const url = new URL(window.location.href);
  url.searchParams.delete('input');
  history.replaceState(history.state, '', url);
}
