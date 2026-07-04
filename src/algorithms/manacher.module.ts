import type {
  AlgorithmModule,
  ManacherExecPoint,
  ManacherTrack,
  Step,
  VarRow,
} from '@/components/player/types';
import { MANACHER_RAW, manacherTransform } from './manacher';
import { manacherSources } from './manacher.sources';

/** 固定 "babad" 转换串 + 半径数组逐中心重走，产出回文轨胖步骤（新建 ManacherView，第 13 轨）。
 *  维护最右回文 [C,R]：中心 i 在 R 内用镜像对称性复用，否则纯扩展；末步给出最长回文。 */
export function buildManacherSteps(): Step<ManacherExecPoint>[] {
  const t = manacherTransform();
  const n = t.length;
  const p = new Array<number>(n).fill(0);

  const steps: Step<ManacherExecPoint>[] = [];
  let bestP = 0;
  let bestCi = 0;

  // p 快照：已算到 upto（含）为数值，之后为 null（未算）
  const snapshotP = (upto: number): (number | null)[] =>
    p.map((v, idx) => (idx <= upto ? v : null));

  const bestOnRaw = (): string => {
    const start = (bestCi - bestP) / 2;
    return MANACHER_RAW.substr(start, bestP);
  };

  const emit = (
    point: ManacherExecPoint,
    upto: number,
    opts: {
      center?: number | null;
      mirror?: number | null;
      boxL?: number | null;
      boxR?: number | null;
      status?: ManacherTrack['status'];
    },
    vars: VarRow[],
    caption: string,
  ): void => {
    const manacher: ManacherTrack = {
      s: t,
      p: snapshotP(upto),
      center: opts.center ?? null,
      mirror: opts.mirror ?? null,
      boxL: opts.boxL ?? null,
      boxR: opts.boxR ?? null,
      best: bestP > 0 ? [bestCi - bestP, bestCi + bestP] : null,
      status: opts.status ?? null,
    };
    steps.push({ array: [], pointers: [], emphasis: {}, vars, point, manacher, caption });
  };

  const baseVars = (extra: VarRow[] = []): VarRow[] => [
    { name: '原串', value: MANACHER_RAW },
    { name: '转换串', value: t },
    ...extra,
  ];

  emit(
    'init',
    -1,
    {},
    baseVars(),
    `预处理：在每个字符两侧插入 # 得到转换串「${t}」——长度恒为奇数，把奇/偶回文统一成「以某个下标为中心」`,
  );

  let c = 0;
  let r = 0; // 最右回文右边界（含），r = c + p[c]
  for (let i = 0; i < n; i++) {
    const cBefore = c;
    const rBefore = r;
    const boxL = 2 * cBefore - rBefore;
    const boxR = rBefore;
    let point: ManacherExecPoint;
    let mirror: number | null = null;
    let caption: string;

    if (i < rBefore) {
      point = 'mirror';
      mirror = 2 * cBefore - i;
      const initVal = Math.min(rBefore - i, p[mirror]);
      p[i] = initVal;
      while (i - p[i] - 1 >= 0 && i + p[i] + 1 < n && t[i - p[i] - 1] === t[i + p[i] + 1]) p[i]++;
      caption =
        `中心 ${i}（'${t[i]}'）落在最右回文 [${boxL},${boxR}] 内：` +
        `先用镜像点 ${mirror} 复用 p[${i}]=min(R−i=${rBefore - i}, p[${mirror}]=${p[mirror]})=${initVal}，` +
        `再向外扩展 → 半径 ${p[i]}`;
    } else {
      point = 'expand';
      p[i] = 0;
      while (i - p[i] - 1 >= 0 && i + p[i] + 1 < n && t[i - p[i] - 1] === t[i + p[i] + 1]) p[i]++;
      caption = `中心 ${i}（'${t[i]}'）在最右回文之外：从 0 开始中心扩展 → 半径 ${p[i]}`;
    }

    if (i + p[i] > r) {
      c = i;
      r = i + p[i];
    }
    if (p[i] > bestP) {
      bestP = p[i];
      bestCi = i;
    }

    emit(
      point,
      i,
      { center: i, mirror, boxL, boxR, status: point },
      baseVars([
        { name: '当前中心 i', value: `${i}（'${t[i]}'）` },
        { name: '半径 p[i]', value: `${p[i]}` },
        { name: '最右回文 C/R', value: `${c}/${r}` },
        { name: '当前最长', value: bestP > 0 ? `"${bestOnRaw()}"（长 ${bestP}）` : '—' },
      ]),
      caption,
    );
  }

  emit(
    'done',
    n - 1,
    { status: 'done' },
    baseVars([
      { name: '最长半径', value: `${bestP}（中心 ${bestCi}）` },
      { name: '最长回文', value: `"${bestOnRaw()}"` },
    ]),
    `全部中心算完：max(p)=${bestP} 在中心 ${bestCi}，最长回文子串 = "${bestOnRaw()}"（长 ${bestP}）`,
  );
  return steps;
}

export const manacherModule: AlgorithmModule<ManacherExecPoint> = {
  title: 'Manacher 最长回文子串',
  initialInput: () => [],
  buildSteps: () => buildManacherSteps(),
  sources: manacherSources,
};
