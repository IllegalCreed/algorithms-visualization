// src/components/player/useHighlighter.ts
import { createHighlighterCore, type HighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import type { Lang } from './types';

const SHIKI_LANG: Record<Lang, string> = {
  ts: 'typescript',
  python: 'python',
  go: 'go',
  rust: 'rust',
};
const LIGHT = 'github-light';
const DARK = 'github-dark';

let hlPromise: Promise<HighlighterCore> | null = null;
function getHighlighter(): Promise<HighlighterCore> {
  if (!hlPromise) {
    // 细粒度按需引入：只打包这 4 门语法 + 2 套主题；
    // 用主包 createHighlighter 会把内置 ~300 门语法全部生成 chunk（懒加载但产物臃肿）
    hlPromise = createHighlighterCore({
      langs: [
        import('@shikijs/langs/typescript'),
        import('@shikijs/langs/python'),
        import('@shikijs/langs/go'),
        import('@shikijs/langs/rust'),
      ],
      themes: [import('@shikijs/themes/github-light'), import('@shikijs/themes/github-dark')],
      engine: createJavaScriptRegexEngine(),
    });
  }
  return hlPromise;
}

export interface HlToken {
  content: string;
  color?: string;
}
export type HlLines = HlToken[][];

const cache = new Map<string, HlLines>();

export async function highlightToLines(code: string, lang: Lang, dark: boolean): Promise<HlLines> {
  const key = `${lang}|${dark ? 'd' : 'l'}|${code}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const hl = await getHighlighter();
  const { tokens } = hl.codeToTokens(code, {
    lang: SHIKI_LANG[lang],
    theme: dark ? DARK : LIGHT,
  });
  const lines: HlLines = tokens.map((line) =>
    line.map((t) => ({ content: t.content, color: t.color })),
  );
  cache.set(key, lines);
  return lines;
}
