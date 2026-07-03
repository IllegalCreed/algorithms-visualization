import type {
  AlgorithmModule,
  KmpTrack,
  RabinKarpExecPoint,
  Step,
  VarRow,
} from '@/components/player/types';
import { RK_TEXT, RK_PATTERN, rkHash, rkWindowHashes } from './rabinkarp';
import { rabinKarpSources } from './rabinkarp.sources';

/** 固定 T=abcabcab / P=cab，滚动哈希匹配细粒度重走（复用 KmpView 轨，lps 空隐 π 行），产出字符串匹配轨胖步骤 */
export function buildRabinKarpSteps(): Step<RabinKarpExecPoint>[] {
  const t = RK_TEXT;
  const p = RK_PATTERN;
  const n = t.length;
  const m = p.length;
  const ph = rkHash(p);
  const winHashes = rkWindowHashes();

  const steps: Step<RabinKarpExecPoint>[] = [];
  const found: number[] = [];

  const vars = (i: number): VarRow[] => [
    { name: '文本 T', value: t },
    { name: '模式 P', value: p },
    { name: '模式哈希', value: `${ph}` },
    { name: '窗口哈希', value: `${winHashes[i]}` },
    { name: '已找到', value: found.length ? found.join(', ') : '—' },
  ];
  const track = (i: number, matchedLen: number, status: KmpTrack['status']): KmpTrack => ({
    text: t,
    pattern: p,
    lps: [],
    offset: i,
    windowStart: i,
    matchedLen,
    compareText: null,
    comparePat: null,
    lpsActive: null,
    status,
    found: [...found],
  });
  const emit = (
    point: RabinKarpExecPoint,
    i: number,
    matchedLen: number,
    status: KmpTrack['status'],
    caption: string,
  ): void => {
    steps.push({
      array: [],
      pointers: [],
      emphasis: {},
      vars: vars(i),
      point,
      kmp: track(i, matchedLen, status),
      caption,
    });
  };

  emit(
    'start',
    0,
    0,
    null,
    `先算模式哈希：hash("${p}") = ${ph}；从第 0 个窗口开始，每格只比一个哈希数`,
  );

  for (let i = 0; i + m <= n; i++) {
    const wh = winHashes[i];
    if (wh !== ph) {
      emit(
        'skip',
        i,
        0,
        'mismatch',
        `窗口 [${i},${i + m}) 哈希 ${wh} ≠ 模式哈希 ${ph}：不可能匹配，滑到下一格（哈希 O(1) 更新）`,
      );
    } else {
      emit(
        'hashHit',
        i,
        0,
        'match',
        `窗口 [${i},${i + m}) 哈希 ${wh} = 模式哈希 ${ph}：可能匹配，需逐字符验证（防哈希冲突）`,
      );
      emit('verify', i, m, 'match', `逐字符验证窗口 "${t.slice(i, i + m)}" 与模式 "${p}"…`);
      found.push(i);
      emit('found', i, m, 'found', `验证通过 → 命中于文本下标 ${i}`);
    }
  }

  emit(
    'done',
    n - m,
    0,
    null,
    found.length
      ? `文本扫描完毕：共命中 ${found.length} 处（下标 ${found.join(', ')}）`
      : `文本扫描完毕：未找到模式`,
  );
  return steps;
}

export const rabinKarpModule: AlgorithmModule<RabinKarpExecPoint> = {
  title: 'Rabin-Karp 字符串匹配',
  initialInput: () => [],
  buildSteps: () => buildRabinKarpSteps(),
  sources: rabinKarpSources,
};
