import type {
  AlgorithmModule,
  KmpExecPoint,
  KmpTrack,
  Step,
  VarRow,
} from '@/components/player/types';
import { KMP_TEXT, KMP_PATTERN, kmpLps } from './kmp';
import { kmpSources } from './kmp.sources';

/** 固定 T=abababcab / P=ababc，KMP 匹配循环细粒度重走（预置 LPS），产出字符串匹配轨胖步骤 */
export function buildKmpSteps(): Step<KmpExecPoint>[] {
  const t = KMP_TEXT;
  const p = KMP_PATTERN;
  const n = t.length;
  const m = p.length;
  const lps = kmpLps();

  const steps: Step<KmpExecPoint>[] = [];
  const found: number[] = [];
  let i = 0;
  let j = 0;

  const vars = (ct: number, cp: number): VarRow[] => [
    { name: '文本 T', value: t },
    { name: '模式 P', value: p },
    { name: 'i（文本）', value: `${ct}` },
    { name: 'j（模式）', value: `${cp}` },
    { name: '已找到', value: found.length ? found.join(', ') : '—' },
  ];

  const emit = (
    point: KmpExecPoint,
    ct: number,
    cp: number,
    extra: { lpsActive?: number | null; status?: KmpTrack['status'] },
    caption: string,
  ): void => {
    const kmp: KmpTrack = {
      text: t,
      pattern: p,
      lps,
      offset: ct - cp,
      matchedLen: cp,
      compareText: ct,
      comparePat: cp,
      lpsActive: extra.lpsActive ?? null,
      status: extra.status ?? null,
      found: [...found],
    };
    steps.push({ array: [], pointers: [], emphasis: {}, vars: vars(ct, cp), point, kmp, caption });
  };

  emit('start', 0, 0, {}, `在文本 T 中找模式 P：i、j 都从 0 开始，模式对齐到文本开头`);

  while (i < n) {
    if (t[i] === p[j]) {
      if (j === m - 1) {
        found.push(i - (m - 1));
        emit(
          'found',
          i,
          j,
          { status: 'found' },
          `T[${i}]=P[${j}]='${p[j]}' → 模式整段匹配！命中于文本下标 ${i - (m - 1)}`,
        );
        i++;
        j = lps[j];
      } else {
        emit(
          'match',
          i,
          j,
          { status: 'match' },
          `T[${i}]=P[${j}]='${p[j]}'：字符相等，i、j 一起前进`,
        );
        i++;
        j++;
      }
    } else if (j > 0) {
      emit(
        'jump',
        i,
        j,
        { lpsActive: j - 1, status: 'mismatch' },
        `T[${i}]='${t[i]}' ≠ P[${j}]='${p[j]}'：失配 → j 跳到 lps[${j - 1}]=${lps[j - 1]}（复用已匹配前缀，文本 i 不回退）`,
      );
      j = lps[j - 1];
    } else {
      emit(
        'advance',
        i,
        j,
        { status: 'mismatch' },
        `T[${i}]='${t[i]}' ≠ P[0]='${p[0]}' 且 j=0：模式右移一格，文本 i 前进`,
      );
      i++;
    }
  }

  emit(
    'done',
    i,
    j,
    {},
    found.length
      ? `文本扫描完毕：共命中 ${found.length} 处（下标 ${found.join(', ')}）`
      : `文本扫描完毕：未找到模式`,
  );
  return steps;
}

export const kmpModule: AlgorithmModule<KmpExecPoint> = {
  title: 'KMP 字符串匹配',
  initialInput: () => [],
  buildSteps: () => buildKmpSteps(),
  sources: kmpSources,
};
