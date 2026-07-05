import type {
  AlgorithmModule,
  GraphTrack,
  RhoExecPoint,
  Step,
  VarRow,
} from '@/components/player/types';
import { RHO_N, rhoTrace } from './rho';
import { rhoSources } from './rho.sources';

// ρ 布局：尾 2 居左；三站台（mod 97 余 5 / 26 / 95）三角排布，第二圈值径向内缩
const VERTS = [
  { id: 0, label: '2', x: 52, y: 150 },
  { id: 1, label: '5', x: 160, y: 62 },
  { id: 2, label: '26', x: 330, y: 62 },
  { id: 3, label: '677', x: 408, y: 190 },
  { id: 4, label: '7474', x: 208, y: 118 },
  { id: 5, label: '2839', x: 300, y: 118 },
  { id: 6, label: '871', x: 330, y: 200 },
  { id: 7, label: '1848', x: 212, y: 205 },
];
const EDGES = Array.from({ length: 7 }, (_, i) => ({
  key: `${i}-${i + 1}`,
  from: i,
  to: i + 1,
}));
// mod 97 余数类：2 | 5,7474,1848 | 26,2839 | 677,871 —— reveal 步四色站台
const GROUPS = [0, 1, 2, 3, 1, 2, 3, 1];

/** 固定 n=8051 的 Pollard's Rho 重放，产出图轨胖步骤（纯复用 GraphView 第 11 消费者）。
 *  序列值按「mod 97 同余同站台」布成 ρ 链；checkPair 蓝环 = 龟兔；reveal 步 nodeGroup 四色现形。 */
export function buildRhoSteps(): Step<RhoExecPoint>[] {
  const { xs, races, factor, cofactor } = rhoTrace();
  const steps: Step<RhoExecPoint>[] = [];

  const emit = (
    point: RhoExecPoint,
    o: {
      active?: number | null;
      pair?: [number, number] | null;
      mstUpto?: number; // 链边绿到 x_{mstUpto}（含）
      groups?: boolean;
    },
    caption: string,
    extra: VarRow[] = [],
  ): void => {
    const edgeClass: Record<string, string> = {};
    for (let i = 0; i < (o.mstUpto ?? 0); i++) edgeClass[`${i}-${i + 1}`] = 'mst';
    const graph: GraphTrack = {
      vertices: VERTS,
      edges: EDGES,
      directed: true,
      activeNode: o.active ?? null,
      checkPair: o.pair ?? null,
      edgeClass,
      nodeGroup: o.groups ? GROUPS : undefined,
    };
    steps.push({ array: [], pointers: [], emphasis: {}, vars: extra, point, graph, caption });
  };

  emit(
    'init',
    {},
    `分解 n = ${RHO_N}。试除法要拿 2, 3, 5, … 一路除到 √n ≈ 90（24 个素数逐个试）；数再大一点（比如 RSA 的几百位）试除直接判死刑。Pollard's Rho 换思路：不去「找」因子，让因子自己在随机序列里「显影」`,
    [
      { name: 'n', value: `${RHO_N}（其实 = 83 × 97，装作不知道）` },
      { name: '目标', value: '找出一个非平凡因子' },
    ],
  );

  emit(
    'seed',
    { active: 0 },
    `造一条伪随机序列：x₀ = 2，往后每一步 x ← x² + 1 (mod n)。图上这串数 2 → 5 → 26 → 677 → 7474 → … 在 mod ${RHO_N} 的世界里看着乱跳、毫无规律——但在某个「看不见的世界」里，它早有安排`,
    [
      { name: 'f(x)', value: 'x² + 1 (mod n)' },
      { name: '序列', value: xs.slice(0, 5).join(' → ') + ' → …' },
    ],
  );

  for (const r of races.slice(0, 2)) {
    emit(
      'race',
      { pair: [r.slowIdx, r.fastIdx], mstUpto: r.fastIdx },
      r.step === 1
        ? `龟兔起跑（Floyd 判环）：乌龟每次 1 步、兔子 2 步（蓝环 = 龟、兔位置）。每走一步做一次「显影」：gcd(|龟 − 兔|, n) = gcd(|${r.slow} − ${r.fast}|, n) = gcd(${r.diff}, ${RHO_N}) = ${r.g}——没显出东西，继续`
        : `再跑一轮：龟到 ${r.slow}、兔到 ${r.fast}。gcd(${r.diff}, ${RHO_N}) = ${r.g}，还是 1。别急——生日悖论保证「看不见的世界」里碰撞很快就来`,
      [
        { name: '龟 / 兔', value: `${r.slow} / ${r.fast}` },
        { name: '显影', value: `gcd(${r.diff}, n) = ${r.g}` },
      ],
    );
  }

  const h = races[2];
  emit(
    'hit',
    { pair: [h.slowIdx, h.fastIdx], mstUpto: h.fastIdx },
    `第三轮：龟 = ${h.slow}、兔 = ${h.fast}，gcd(|${h.slow} − ${h.fast}|, n) = gcd(${h.diff}, ${RHO_N}) = ${factor}——显影成功！${RHO_N} = ${cofactor} × ${factor}。两个数 mod n 明明不同，差却被 ${factor} 整除——它们在「mod ${factor} 的世界」里是同一个点`,
    [
      { name: '命中', value: `gcd(${h.diff}, ${RHO_N}) = ${factor}` },
      { name: '分解', value: `${RHO_N} = ${cofactor} × ${factor}` },
    ],
  );

  emit(
    'reveal',
    { pair: [h.slowIdx, h.fastIdx], mstUpto: 7, groups: true },
    `揭开「看不见的世界」：在 mod 97 下，这串数是 2 → 5 → 26 → 95 → 5 → 26 → 95 → …——尾巴 1 步、环长 3 的 ρ 字形！同色 = mod 97 同余（同一站台）。环只有 3 个站台（生日悖论：约 √97 个值就撞），龟兔在环上必相遇：677 与 871 同在余 95 的站台，差 194 = 2 × 97 一显影就现形`,
    [
      { name: 'mod 97', value: '2 → 5 → 26 → 95 → (5 → 26 → 95 → …循环)' },
      { name: 'ρ', value: '尾 1 + 环 3——算法名字的由来' },
    ],
  );

  emit(
    'done',
    { mstUpto: 7, groups: true },
    `期望步数 O(n^¼)（在 mod p 的世界里 √p 步撞车，p ≤ √n）——8051 只跑了 3 轮。完整分解流水线：先用米勒-拉宾判素，合数交给 Rho 劈成两半、递归下去。工程上用 Brent 变体（少一半 gcd）+ 大整数乘法；RSA 的 2048 位模数正是笃定 Rho 们（n^¼ ≈ 2⁵¹²）啃不动才敢公开`,
    [
      { name: '复杂度', value: '期望 O(n^¼)（试除 O(√n)）' },
      { name: '流水线', value: '米勒-拉宾判素 → Rho 分解 → 递归' },
    ],
  );
  return steps;
}

export const rhoModule: AlgorithmModule<RhoExecPoint> = {
  title: "Pollard's Rho（大数因数分解）",
  initialInput: () => [],
  buildSteps: () => buildRhoSteps(),
  sources: rhoSources,
};
