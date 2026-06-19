// src/components/player/useHighlighter.ts
import { createHighlighter, type Highlighter, type BundledLanguage } from 'shiki';
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

let hlPromise: Promise<Highlighter> | null = null;
function getHighlighter(): Promise<Highlighter> {
  if (!hlPromise) {
    hlPromise = createHighlighter({
      langs: ['typescript', 'python', 'go', 'rust'],
      themes: [LIGHT, DARK],
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
    lang: SHIKI_LANG[lang] as BundledLanguage,
    theme: dark ? DARK : LIGHT,
  });
  const lines: HlLines = tokens.map((line) =>
    line.map((t) => ({ content: t.content, color: t.color })),
  );
  cache.set(key, lines);
  return lines;
}
