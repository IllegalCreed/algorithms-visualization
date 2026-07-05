import type {
  AlgorithmModule,
  FenwickExecPoint,
  Pointer,
  Step,
  VarRow,
} from '@/components/player/types';
import { BIT_N, lowbit, buildTree, queryTrace, updateTrace } from './fenwick';
import { fenwickSources } from './fenwick.sources';

const ID_CUR = '1'; // 蓝：当前跳的 i

const bin = (i: number): string => i.toString(2).padStart(4, '0');

/** 固定 a=[3,2,5,1,4,2,3,1] 的 BIT 操作重放：query(6) → update(3,+2) → 复查 query(6)。
 *  纯复用主柱轨：8 柱 = tree[1..8]（update 柱子真实长高）；groupMembers 累积 lowbit 链。 */
export function buildFenwickSteps(): Step<FenwickExecPoint>[] {
  const tree = buildTree();
  const steps: Step<FenwickExecPoint>[] = [];

  const snap = (): [string, number][] =>
    Array.from({ length: BIT_N }, (_, k) => [String(k), tree[k + 1]] as [string, number]);

  const emit = (
    point: FenwickExecPoint,
    o: { cur?: number | null; chain?: number[] },
    caption: string,
    extra: VarRow[] = [],
  ): void => {
    const pointers: Pointer[] = [];
    if (o.cur !== undefined && o.cur !== null) pointers.push({ id: ID_CUR, index: o.cur - 1 });
    steps.push({
      array: snap(),
      pointers,
      emphasis: {
        ...(o.chain ? { groupMembers: o.chain.map((i) => i - 1) } : {}),
        ...(o.cur !== undefined && o.cur !== null ? { pivotIndex: o.cur - 1 } : {}),
      },
      vars: [{ name: '原数组 a', value: '[3, 2, 5, 1, 4, 2, 3, 1]' }, ...extra],
      point,
      caption,
    });
  };

  emit(
    'init',
    {},
    `8 根柱子是 tree[1..8]，不是原数组：tree[i] 管辖「以 i 结尾、长 lowbit(i) = i & -i」的区段和——tree[4]=11 管 a₁..a₄、tree[6]=6 只管 a₅+a₆、tree[8]=21 管全部。两种操作都只沿 lowbit 链跳 O(log n) 步`,
    [{ name: '读法', value: 'tree[i] 管辖长 lowbit(i)' }],
  );

  // query(6)
  const q1 = queryTrace(tree, 6);
  const chain1: number[] = [];
  q1.hops.forEach((h) => {
    chain1.push(h.i);
    emit(
      'query',
      { cur: h.i, chain: [...chain1] },
      `query(6) 求 a₁..a₆：i=${h.i}（${bin(h.i)}₂），收下 tree[${h.i}]=${h.val}，累计 ${h.acc}；lowbit(${h.i})=${lowbit(h.i)}，i ← ${h.i}−${lowbit(h.i)}=${h.i - lowbit(h.i)}${h.i - lowbit(h.i) === 0 ? '——到 0 收工：前缀和 = ' + h.acc : ''}`,
      [
        { name: '操作', value: 'query(6)' },
        { name: '累计', value: `${h.acc}` },
      ],
    );
  });

  // update(3, +2)
  const u = updateTrace(tree, 3, 2);
  const chain2: number[] = [];
  u.hops.forEach((h, k) => {
    chain2.push(h.i);
    emit(
      'update',
      { cur: h.i, chain: [...chain2] },
      `update(3, +2)${k === 0 ? '——a₃ 加 2，所有管到 a₃ 的区段都要知道' : ''}：第 ${k + 1} 个管辖者 tree[${h.i}] += 2 → ${h.after}（柱子长高）；lowbit(${h.i})=${lowbit(h.i)}，i ← ${h.i}+${lowbit(h.i)}=${h.i + lowbit(h.i)}${h.i + lowbit(h.i) > BIT_N ? '——越界收工，3 个管辖者全部通知完毕' : ''}`,
      [
        { name: '操作', value: 'update(3, +2)' },
        { name: 'tree[i]', value: `${h.after}` },
      ],
    );
  });

  // 复查 query(6)
  const q2 = queryTrace(tree, 6);
  const chain3: number[] = [];
  q2.hops.forEach((h, k) => {
    chain3.push(h.i);
    emit(
      'query',
      { cur: h.i, chain: [...chain3] },
      k === 0
        ? `复查 query(6)：还是同一条链——i=6 收下 tree[6]=${h.val}，累计 ${h.acc}`
        : `i=4 收下 tree[4]=${h.val}（刚被 update 改成 13），累计 ${h.acc}——19 = 17 + 2，更新生效，验证通过 ✓`,
      [
        { name: '操作', value: 'query(6) 复查' },
        { name: '累计', value: `${h.acc}` },
      ],
    );
  });

  emit(
    'done',
    {},
    `改查双 O(log n)：普通数组「查」要 O(n)、前缀和数组「改」要 O(n)，树状数组两头都只沿 lowbit 链跳几步。逆序对计数、动态排名、滑动窗口统计的标配；线段树是它的全能兄长（区间改/区间查），BIT 以十行代码换 90% 的日常场景`,
    [{ name: '复杂度', value: 'query / update 均 O(log n)' }],
  );
  return steps;
}

export const fenwickModule: AlgorithmModule<FenwickExecPoint> = {
  title: '树状数组（Fenwick / BIT）',
  initialInput: () => buildTree().slice(1),
  buildSteps: () => buildFenwickSteps(),
  sources: fenwickSources,
};
