# 实现：哈希表 Hash 知识页（TDD 任务分解 T1–T4）

> Status: verified
> Stable ID: C-20260625-021
> Owner: IllegalCreed
> Created: 2026-06-25
> Last reviewed: 2026-06-25
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 执行顺序（按依赖）

`T1 useHash` → `T2 HashViz` → `T3 哈希页` → `T4 e2e`。每个任务铁律：先写失败测试 → 跑红 → 实现 → 跑绿。骨架复用、零改动。

---

## T1 — `useHash.ts` 拉链哈希逻辑（L3，先写测试）

**先写失败测试** `src/components/structures/useHash.spec.ts`（`TC-HASH-LOGIC-*`）：

```ts
import { describe, it, expect } from 'vitest';
import { useHash, HASH_MAX } from './useHash';

const keys = (h: ReturnType<typeof useHash>, b: number) => h.buckets.value[b].map((e) => e[1]);

describe('useHash', () => {
  it('TC-HASH-LOGIC-01 初始：7 桶、桶1=[15,8]、桶2=[23]、桶4=[4]、size 4', () => {
    const h = useHash();
    expect(h.buckets.value).toHaveLength(7);
    expect(keys(h, 1)).toEqual([15, 8]);
    expect(keys(h, 2)).toEqual([23]);
    expect(keys(h, 4)).toEqual([4]);
    expect(keys(h, 0)).toEqual([]);
    expect(h.size.value).toBe(4);
  });
  it('TC-HASH-LOGIC-02 hash = key % 7', () => {
    const h = useHash();
    expect(h.hash(11)).toBe(4);
    expect(h.hash(8)).toBe(1);
    expect(h.hash(7)).toBe(0);
  });
  it('TC-HASH-LOGIC-03 has 命中/未命中', () => {
    const h = useHash();
    expect(h.has(15)).toBe(true);
    expect(h.has(99)).toBe(false);
  });
  it('TC-HASH-LOGIC-04 insert 空桶直放（无冲突）', () => {
    const h = useHash();
    const r = h.insert(7); // 7%7=0，空桶
    expect(r.ok).toBe(true);
    expect(r.bucket).toBe(0);
    expect(r.collision).toBe(false);
    expect(keys(h, 0)).toEqual([7]);
  });
  it('TC-HASH-LOGIC-05 insert 冲突追加链尾', () => {
    const h = useHash();
    const r = h.insert(11); // 11%7=4，桶4 已有 [4]
    expect(r.ok).toBe(true);
    expect(r.bucket).toBe(4);
    expect(r.collision).toBe(true);
    expect(keys(h, 4)).toEqual([4, 11]);
  });
  it('TC-HASH-LOGIC-06 insert 查重不插', () => {
    const h = useHash();
    const r = h.insert(15);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe('dup');
    expect(keys(h, 1)).toEqual([15, 8]);
  });
  it('TC-HASH-LOGIC-07 search 命中返回 bucket + steps', () => {
    const h = useHash();
    const r = h.search(8); // 桶1 第2个
    expect(r.found).toBe(true);
    expect(r.bucket).toBe(1);
    expect(r.steps).toBe(2);
  });
  it('TC-HASH-LOGIC-08 search 没找到（走完链）', () => {
    const h = useHash();
    const r = h.search(22); // 22%7=1，桶1=[15,8] 无 22
    expect(r.found).toBe(false);
    expect(r.bucket).toBe(1);
    expect(r.steps).toBe(2);
  });
  it('TC-HASH-LOGIC-09 满 HASH_MAX：canInsert false、insert full、id 唯一', () => {
    const h = useHash();
    let k = 30;
    while (h.size.value < HASH_MAX) h.insert(k++);
    expect(h.size.value).toBe(HASH_MAX);
    expect(h.canInsert.value).toBe(false);
    expect(h.insert(99).reason).toBe('full');
    const ids = h.buckets.value.flat().map((e) => e[0]);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('TC-HASH-LOGIC-10 reset 复位初始', () => {
    const h = useHash();
    h.insert(7);
    h.insert(11);
    h.reset();
    expect(keys(h, 1)).toEqual([15, 8]);
    expect(h.size.value).toBe(4);
  });
});
```

**实现** `src/components/structures/useHash.ts`（见 design §2）：

```ts
import { ref, computed, type Ref, type ComputedRef } from 'vue';

export const HASH_BUCKETS = 7;
export const HASH_MAX = 16; // 演示总容量

export interface InsertResult {
  ok: boolean;
  reason?: 'dup' | 'full';
  bucket: number;
  collision?: boolean;
}
export interface SearchResult {
  found: boolean;
  bucket: number;
  steps: number;
}
export interface UseHash {
  buckets: Ref<[string, number][][]>; // 7 个桶，每桶一条 [id, key] 链
  size: ComputedRef<number>;
  canInsert: ComputedRef<boolean>;
  hash: (key: number) => number;
  has: (key: number) => boolean;
  insert: (key: number) => InsertResult;
  search: (key: number) => SearchResult;
  reset: () => void;
}

/** 初始预填：桶1 = [15,8]（冲突）、桶2 = [23]、桶4 = [4] */
const INITIAL = [15, 8, 23, 4];

export function useHash(): UseHash {
  let idn = 0;
  const buckets = ref<[string, number][][]>([]);

  const hash = (key: number): number => key % HASH_BUCKETS;
  const size = computed(() => buckets.value.reduce((s, b) => s + b.length, 0));
  const canInsert = computed(() => size.value < HASH_MAX);
  const has = (key: number): boolean => buckets.value[hash(key)].some((e) => e[1] === key);

  const insert = (key: number): InsertResult => {
    const b = hash(key);
    if (has(key)) return { ok: false, reason: 'dup', bucket: b };
    if (size.value >= HASH_MAX) return { ok: false, reason: 'full', bucket: b };
    const collision = buckets.value[b].length > 0;
    buckets.value[b].push([`e${idn++}`, key]); // 空放 / 冲突追加链尾
    return { ok: true, bucket: b, collision };
  };
  const search = (key: number): SearchResult => {
    const b = hash(key);
    const chain = buckets.value[b];
    for (let i = 0; i < chain.length; i++) {
      if (chain[i][1] === key) return { found: true, bucket: b, steps: i + 1 };
    }
    return { found: false, bucket: b, steps: chain.length };
  };
  const reset = (): void => {
    buckets.value = Array.from({ length: HASH_BUCKETS }, () => []);
    for (const k of INITIAL) buckets.value[hash(k)].push([`e${idn++}`, k]);
  };

  reset();
  return { buckets, size, canInsert, hash, has, insert, search, reset };
}
```

**验证**：`pnpm test:unit run src/components/structures/useHash.spec.ts`。

---

## T2 — `HashViz.vue` 哈希互动组件（L4，先写测试）

**先写失败测试** `src/components/structures/HashViz.spec.ts`（`TC-VIZ-HASHVIZ-*`）：

```ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import HashViz from './HashViz.vue';

const mountIt = () => mount(HashViz);
const btn = (w: ReturnType<typeof mountIt>, label: string) =>
  w.findAll('.btn').find((b) => b.text().includes(label))!;
const setVal = (w: ReturnType<typeof mountIt>, v: number | string) =>
  w.find('.val-input').setValue(String(v));

describe('HashViz', () => {
  it('TC-VIZ-HASHVIZ-01 初始 7 桶 + 桶1 含 2 项 + 输入框 + 3 按钮', () => {
    const w = mountIt();
    expect(w.findAll('.bucket')).toHaveLength(7);
    expect(w.findAll('.bucket')[1].findAll('.entry')).toHaveLength(2);
    expect(w.find('.val-input').exists()).toBe(true);
    expect(btn(w, '插入')).toBeTruthy();
    expect(btn(w, '查找')).toBeTruthy();
    expect(btn(w, '重置')).toBeTruthy();
  });
  it('TC-VIZ-HASHVIZ-02 insert 空桶直放', async () => {
    const w = mountIt();
    await setVal(w, 7); // 7%7=0
    await btn(w, '插入').trigger('click');
    const e = w.findAll('.bucket')[0].findAll('.entry');
    expect(e).toHaveLength(1);
    expect(e[0].text()).toBe('7');
  });
  it('TC-VIZ-HASHVIZ-03 insert 冲突追加链尾', async () => {
    const w = mountIt();
    await setVal(w, 11); // 11%7=4，桶4 已有 [4]
    await btn(w, '插入').trigger('click');
    const e = w.findAll('.bucket')[4].findAll('.entry');
    expect(e).toHaveLength(2);
    expect(e[1].text()).toBe('11');
  });
  it('TC-VIZ-HASHVIZ-04 insert 总项数 +1', async () => {
    const w = mountIt();
    expect(w.findAll('.entry')).toHaveLength(4);
    await setVal(w, 7);
    await btn(w, '插入').trigger('click');
    expect(w.findAll('.entry')).toHaveLength(5);
  });
  it('TC-VIZ-HASHVIZ-05 insert 查重不增、解说已存在', async () => {
    const w = mountIt();
    await setVal(w, 15);
    await btn(w, '插入').trigger('click');
    expect(w.findAll('.entry')).toHaveLength(4);
    expect(w.find('.status').text()).toContain('已经在');
  });
  it('TC-VIZ-HASHVIZ-06 search 命中解说', async () => {
    const w = mountIt();
    await setVal(w, 8);
    await btn(w, '查找').trigger('click');
    expect(w.find('.status').text()).toContain('找到');
  });
  it('TC-VIZ-HASHVIZ-07 search 没找到解说', async () => {
    const w = mountIt();
    await setVal(w, 22);
    await btn(w, '查找').trigger('click');
    expect(w.find('.status').text()).toContain('不存在');
  });
  it('TC-VIZ-HASHVIZ-08 insert 解说含 hash 算式', async () => {
    const w = mountIt();
    await setVal(w, 11);
    await btn(w, '插入').trigger('click');
    expect(w.find('.status').text()).toContain('% 7');
  });
  it('TC-VIZ-HASHVIZ-09 非法值提示、不增', async () => {
    const w = mountIt();
    await setVal(w, 0);
    await btn(w, '插入').trigger('click');
    expect(w.find('.status').text()).toContain('请输入');
    expect(w.findAll('.entry')).toHaveLength(4);
  });
  it('TC-VIZ-HASHVIZ-10 reset 复位 4 项', async () => {
    const w = mountIt();
    await setVal(w, 7);
    await btn(w, '插入').trigger('click');
    await btn(w, '重置').trigger('click');
    expect(w.findAll('.entry')).toHaveLength(4);
  });
});
```

**实现** `src/components/structures/HashViz.vue`（见 design §3；用 `useHash` + 7 桶阵列；插入/查找同步改数据 + 延时高亮）。骨架：

```vue
<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { useHash, HASH_MAX } from './useHash';

const h = useHash();
const val = ref(11);
const status = ref('输入一个数，点「插入」——看它被算进哪个桶。');
const lit = ref(-1); // 命中桶
const cmpAt = ref<[number, number] | null>(null); // 扫链比较中 [桶, 链下标]
const hotAt = ref<[number, number] | null>(null); // 命中 [桶, 链下标]
const enterId = ref<string | null>(null);
const busy = ref(false);
let timers: ReturnType<typeof setTimeout>[] = [];
const sleep = (ms: number) => new Promise<void>((res) => timers.push(setTimeout(res, ms)));
const clearTimers = () => {
  timers.forEach(clearTimeout);
  timers = [];
};
const clearMarks = () => {
  lit.value = -1;
  cmpAt.value = null;
  hotAt.value = null;
};
const isCmp = (b: number, j: number) =>
  !!cmpAt.value && cmpAt.value[0] === b && cmpAt.value[1] === j;
const isHot = (b: number, j: number) =>
  !!hotAt.value && hotAt.value[0] === b && hotAt.value[1] === j;
const validVal = (): number | null => {
  if (!Number.isInteger(val.value) || val.value < 1 || val.value > 99) {
    status.value = '请输入 1–99 的整数。';
    return null;
  }
  return val.value;
};

const onInsert = async () => {
  if (busy.value) return;
  const v = validVal();
  if (v === null) return;
  busy.value = true;
  clearMarks();
  const r = h.insert(v); // 同步：查重 / 满 / 入桶
  lit.value = r.bucket;
  if (!r.ok && r.reason === 'dup') {
    status.value = `hash(${v}) = ${v} % 7 = ${r.bucket}；${v} 已经在 ${r.bucket} 号桶里了。`;
  } else if (!r.ok && r.reason === 'full') {
    status.value = '演示容量到上限（16 个），先重置。';
  } else {
    const chain = h.buckets.value[r.bucket];
    enterId.value = chain[chain.length - 1][0];
    status.value = r.collision
      ? `hash(${v}) = ${v} % 7 = ${r.bucket}，${r.bucket} 号桶已有元素 → 冲突！追加链尾，O(1)。`
      : `hash(${v}) = ${v} % 7 = ${r.bucket}，${r.bucket} 号桶是空的，直接放入，O(1)。`;
  }
  await sleep(900);
  enterId.value = null;
  clearMarks();
  busy.value = false;
};
const onSearch = async () => {
  if (busy.value) return;
  const v = validVal();
  if (v === null) return;
  busy.value = true;
  clearMarks();
  const r = h.search(v); // 同步：found + bucket + steps
  lit.value = r.bucket;
  status.value = r.found
    ? `hash(${v}) = ${v} % 7 = ${r.bucket} → 在 ${r.bucket} 号桶第 ${r.steps} 个找到 ${v}！（扫链 ${r.steps} 次）`
    : `hash(${v}) = ${v} % 7 = ${r.bucket} → ${r.bucket} 号桶里没有 ${v}（找了 ${r.steps} 个），不存在。`;
  const chain = h.buckets.value[r.bucket];
  for (let j = 0; j < r.steps; j++) {
    cmpAt.value = [r.bucket, j];
    await sleep(560);
  }
  cmpAt.value = null;
  if (r.found) hotAt.value = [r.bucket, r.steps - 1];
  await sleep(700);
  clearMarks();
  busy.value = false;
};
const onReset = () => {
  clearTimers(); // 重置可中断进行中的扫链动画
  busy.value = false;
  clearMarks();
  enterId.value = null;
  h.reset();
  status.value = '已重置 · 1 号桶里 15、8 已经冲突了。输入一个数试试。';
};
onUnmounted(clearTimers);
</script>

<template>
  <div class="hash-viz column center">
    <div class="toolbar row-wrap">
      <input class="val-input" v-model.number="val" type="number" min="1" max="99" />
      <button class="btn" :disabled="busy" @click="onInsert">插入</button>
      <button class="btn" :disabled="busy" @click="onSearch">查找</button>
      <button class="btn" @click="onReset">重置</button>
    </div>
    <div class="lane-wrap">
      <div class="lane">
        <div
          v-for="(chain, b) in h.buckets.value"
          :key="b"
          class="bucket"
          :class="{ lit: lit === b }"
          :data-b="b"
        >
          <div class="bindex">{{ b }}</div>
          <div class="barrow">→</div>
          <div class="chain">
            <span v-if="!chain.length" class="empty-slot">空</span>
            <div
              v-for="(e, j) in chain"
              :key="e[0]"
              class="entry"
              :class="{ cmp: isCmp(b, j), hot: isHot(b, j), enter: e[0] === enterId }"
            >
              {{ e[1] }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <p class="status">{{ status }}</p>
  </div>
</template>

<style scoped lang="less">
/* 7 桶竖排（.bucket 行）+ 下标徽章（lit 主题绿）+ 每桶横向链（.entry 盒，cmp 黄/hot 深绿/enter 滑入）；画布定宽 520；取原型样式 */
</style>
```

注：`insert`/`search` 同步改数据 / 返回结果（L4 可断言数量 + 同步状态），扫链/入场为延时高亮（卸载清理、busy 防重入、重置可中断）。**验证**：`pnpm test:unit run src/components/structures/HashViz.spec.ts`。

---

## T3 — `Hash.vue` 哈希页（L4，先写测试）

**先写失败测试** `src/views/Article/DataStructure/Hash.spec.ts`（`TC-VIEW-HASH-*`）：

- `-01` 挂载渲染 `Article` + `HashViz`（`findComponent` 存在）。
- `-02` 含「哈希表」标题与 `Playground`（`.playground` 存在）。

**实现**：填充 `Hash.vue`（见 design §4 大纲），正文以原型文案为基础。**验证**：`pnpm test:unit run src/views/Article/DataStructure/Hash.spec.ts`。

---

## T4 — e2e（L5，Playwright）

`e2e/hash.e2e.ts`（`TC-E2E-HASH-01`）：导航 `/docs/hash`、见标题「哈希表」与 `.playground`；限定 `.hash-viz` 内：初始 7 桶 + 4 项；填输入框 `11` 点插入见桶 4 变 2 项且含 `11`、status 含 `% 7`；重置回 4 项。（菜单也用 `.btn`，全部限定 `.hash-viz`/`.article`。）**验证**：`pnpm exec playwright test e2e/hash.e2e.ts`。

---

## 全门禁

`pnpm type-check` / `pnpm lint:check` / `pnpm format:check` / `pnpm test:unit run` / `pnpm exec playwright test`，全绿后回写三索引 + roadmap，提交 main。

## 自测报告（实现期回填）

- [x] T1 useHash 全绿（10 Case）— TDD：先红（模块缺失）→ 实现 → 绿；hash/insert（空放·冲突·查重·满）/search（命中·扫链步数）/has 一次通过
- [x] T2 HashViz 全绿（10 Case）— 一次通过；insert/search 同步改数据 + 返回结果（L4 同步断言数量/状态），扫链/入场延时高亮、重置可中断
- [x] T3 哈希页全绿（2 Case）
- [x] T4 e2e 全绿（TC-E2E-HASH-01）— 真机另验（dev server 截图）：7 桶 + 1 号桶 [15][8] 冲突链；插入 11→11%7=4 冲突追加到 4 号桶、解说含算式；重置回 4 项
- [x] 全门禁达标：type-check ✓ / lint:check ✓ / format:check ✓（HashViz 经 prettier --write）/ coverage All files 92.33%/89.71%/92.30%/93.20%（聚合过门槛；HashViz 88.75% 行，满桶+扫链异步尾由 e2e 覆盖）
- [x] 单测 506 passed（78 文件，含新增 22 单测 Case）+ e2e 17 passed（含新增 1）；8 排序 + 栈 + 队列 + 数组 + 链表 + 树 + 堆 + 播放器 全部现有 Case 零回归；**骨架零改动**
