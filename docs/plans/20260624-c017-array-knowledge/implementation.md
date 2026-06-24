# 实现：数组 Array 知识页（TDD 任务分解 T1–T4）

> Status: verified
> Stable ID: C-20260624-017
> Owner: IllegalCreed
> Created: 2026-06-24
> Last reviewed: 2026-06-24
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 执行顺序（按依赖）

`T1 useArray` → `T2 ArrayViz` → `T3 数组页 + Queue 结尾微调` → `T4 e2e`。每个任务铁律：先写失败测试 → 跑红 → 实现 → 跑绿。骨架（`Article`/`Callout`/`Playground`）复用 C-015、零改动、不重测。

---

## T1 — `useArray.ts` 数组逻辑（L3，先写测试）

**先写失败测试** `src/components/structures/useArray.spec.ts`（`TC-ARRAY-LOGIC-*`）：

```ts
import { describe, it, expect } from 'vitest';
import { useArray, ARRAY_MAX } from './useArray';

const vals = (a: ReturnType<typeof useArray>) => a.items.value.map((t) => t[1]);

describe('useArray', () => {
  it('TC-ARRAY-LOGIC-01 初始 [1,2,3,4]、无选中、can 标志', () => {
    const a = useArray();
    expect(vals(a)).toEqual([1, 2, 3, 4]);
    expect(a.selected.value).toBe(null);
    expect(a.hasSelection.value).toBe(false);
    expect(a.canInsert.value).toBe(false);
    expect(a.canAppend.value).toBe(true);
  });
  it('TC-ARRAY-LOGIC-02 valueAt 按下标读、越界 null', () => {
    const a = useArray();
    expect(a.valueAt(0)).toBe(1);
    expect(a.valueAt(3)).toBe(4);
    expect(a.valueAt(-1)).toBe(null);
    expect(a.valueAt(4)).toBe(null);
  });
  it('TC-ARRAY-LOGIC-03 select toggle：选中/再点取消/换选', () => {
    const a = useArray();
    a.select(2);
    expect(a.selected.value).toBe(2);
    a.select(2);
    expect(a.selected.value).toBe(null);
    a.select(0);
    expect(a.selected.value).toBe(0);
  });
  it('TC-ARRAY-LOGIC-04 insert 未选返回 null 且不变', () => {
    const a = useArray();
    expect(a.insert()).toBe(null);
    expect(vals(a)).toEqual([1, 2, 3, 4]);
  });
  it('TC-ARRAY-LOGIC-05 insert 在 i 处插入递增值、i 起右移、保持选中落新元素、下标≠值、id 唯一', () => {
    const a = useArray();
    a.select(2);
    expect(a.insert()).toBe(5);
    expect(vals(a)).toEqual([1, 2, 5, 3, 4]);
    expect(a.selected.value).toBe(2);
    expect(a.valueAt(2)).toBe(5);
    expect(a.valueAt(3)).toBe(3);
    const ids = a.items.value.map((t) => t[0]);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('TC-ARRAY-LOGIC-06 remove 删 i、后续左移、清空选中', () => {
    const a = useArray();
    a.select(2);
    a.insert(); // [1,2,5,3,4]，选中仍落在新元素（下标 2）
    expect(a.remove()).toBe(5);
    expect(vals(a)).toEqual([1, 2, 3, 4]);
    expect(a.selected.value).toBe(null);
  });
  it('TC-ARRAY-LOGIC-07 remove 未选返回 null', () => {
    const a = useArray();
    expect(a.remove()).toBe(null);
    expect(vals(a)).toEqual([1, 2, 3, 4]);
  });
  it('TC-ARRAY-LOGIC-08 append 尾插递增、不动选中', () => {
    const a = useArray();
    a.select(1);
    expect(a.append()).toBe(5);
    expect(vals(a)).toEqual([1, 2, 3, 4, 5]);
    expect(a.selected.value).toBe(1);
  });
  it('TC-ARRAY-LOGIC-09 满 ARRAY_MAX：canAppend/insert 为 false、返回 null', () => {
    const a = useArray();
    while (a.items.value.length < ARRAY_MAX) a.append();
    expect(a.items.value.length).toBe(ARRAY_MAX);
    expect(a.canAppend.value).toBe(false);
    expect(a.append()).toBe(null);
    a.select(0);
    expect(a.canInsert.value).toBe(false);
    expect(a.insert()).toBe(null);
    expect(a.items.value.length).toBe(ARRAY_MAX);
  });
  it('TC-ARRAY-LOGIC-10 reset 复位 [1,2,3,4]、清选中、下次 append=5', () => {
    const a = useArray();
    a.select(1);
    a.insert();
    a.append();
    a.reset();
    expect(vals(a)).toEqual([1, 2, 3, 4]);
    expect(a.selected.value).toBe(null);
    expect(a.append()).toBe(5);
  });
});
```

**实现** `src/components/structures/useArray.ts`（见 design §2，对标 `useStack`/`useQueue`）：

```ts
import { ref, computed, type Ref, type ComputedRef } from 'vue';

/** 演示数组的最大容量（满时禁止插入/追加，避免溢出容器） */
export const ARRAY_MAX = 8;

export interface UseArray {
  items: Ref<[string, number][]>; // [稳定id, 值]；index = 位置；id 驱动 TransitionGroup
  selected: Ref<number | null>; // 当前选中下标
  hasSelection: ComputedRef<boolean>;
  canInsert: ComputedRef<boolean>;
  canAppend: ComputedRef<boolean>;
  select: (i: number) => void;
  valueAt: (i: number) => number | null;
  insert: () => number | null;
  remove: () => number | null;
  append: () => number | null;
  reset: () => void;
}

const INITIAL = [1, 2, 3, 4];

export function useArray(): UseArray {
  let seq = INITIAL.length; // 下一个插入/追加值 = ++seq（= 5）
  let idn = 0; // 稳定 id 计数（驱动 TransitionGroup）
  const make = (): [string, number][] => INITIAL.map((v) => [`a${idn++}`, v]);

  const items = ref<[string, number][]>(make());
  const selected = ref<number | null>(null);

  const hasSelection = computed(() => selected.value !== null);
  const canInsert = computed(() => selected.value !== null && items.value.length < ARRAY_MAX);
  const canAppend = computed(() => items.value.length < ARRAY_MAX);

  const select = (i: number): void => {
    selected.value = selected.value === i ? null : i;
  };
  const valueAt = (i: number): number | null =>
    i >= 0 && i < items.value.length ? items.value[i][1] : null;
  const insert = (): number | null => {
    if (selected.value === null || items.value.length >= ARRAY_MAX) return null;
    const v = ++seq;
    items.value.splice(selected.value, 0, [`a${idn++}`, v]); // 在 i 处插、i 起右移
    return v;
  };
  const remove = (): number | null => {
    if (selected.value === null) return null;
    const v = items.value.splice(selected.value, 1)[0][1]; // 删 i、后续左移
    selected.value = null;
    return v;
  };
  const append = (): number | null => {
    if (items.value.length >= ARRAY_MAX) return null;
    const v = ++seq;
    items.value.push([`a${idn++}`, v]); // 尾插、谁也不动
    return v;
  };
  const reset = (): void => {
    seq = INITIAL.length;
    items.value = make(); // 新 id（idn 不回退）→ TransitionGroup 干净重建
    selected.value = null;
  };

  return {
    items,
    selected,
    hasSelection,
    canInsert,
    canAppend,
    select,
    valueAt,
    insert,
    remove,
    append,
    reset,
  };
}
```

**验证**：`pnpm test:unit run src/components/structures/useArray.spec.ts`。

---

## T2 — `ArrayViz.vue` 数组互动组件（L4，先写测试）

**先写失败测试** `src/components/structures/ArrayViz.spec.ts`（`TC-VIZ-ARRAYVIZ-*`，TransitionGroup stub 即时）：

```ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ArrayViz from './ArrayViz.vue';

const mountIt = () =>
  mount(ArrayViz, {
    global: { stubs: { 'transition-group': { template: '<div><slot /></div>' } } },
  });
const btn = (w: ReturnType<typeof mountIt>, label: string) =>
  w.findAll('.btn').find((b) => b.text().includes(label))!;

describe('ArrayViz', () => {
  it('TC-VIZ-ARRAYVIZ-01 初始 4 格 + 下标 0..3 + 无选中禁访问/插入/删除', () => {
    const w = mountIt();
    expect(w.findAll('.cell')).toHaveLength(4);
    expect(w.findAll('.slot')).toHaveLength(4);
    expect(w.find('.empty-hint').exists()).toBe(false);
    expect(btn(w, '访问').attributes('disabled')).toBeDefined();
    expect(btn(w, '插入').attributes('disabled')).toBeDefined();
    expect(btn(w, '删除').attributes('disabled')).toBeDefined();
    expect(btn(w, '追加').attributes('disabled')).toBeUndefined();
  });
  it('TC-VIZ-ARRAYVIZ-02 点格选中：cell/slot is-selected + 启用三键', async () => {
    const w = mountIt();
    await w.findAll('.cell')[2].trigger('click');
    expect(w.findAll('.cell')[2].classes()).toContain('is-selected');
    expect(w.findAll('.slot')[2].classes()).toContain('is-selected');
    expect(btn(w, '访问').attributes('disabled')).toBeUndefined();
    expect(btn(w, '插入').attributes('disabled')).toBeUndefined();
  });
  it('TC-VIZ-ARRAYVIZ-03 insert 增元素、新值落 i、下标≠值', async () => {
    const w = mountIt();
    await w.findAll('.cell')[2].trigger('click');
    await btn(w, '插入').trigger('click');
    const cells = w.findAll('.cell');
    expect(cells).toHaveLength(5);
    expect(cells[2].text()).toBe('5');
    expect(cells[3].text()).toBe('3'); // 下标 3 的值是 3
  });
  it('TC-VIZ-ARRAYVIZ-04 remove 减元素', async () => {
    const w = mountIt();
    await w.findAll('.cell')[1].trigger('click');
    await btn(w, '删除').trigger('click');
    expect(w.findAll('.cell')).toHaveLength(3);
    expect(w.findAll('.cell').map((c) => c.text())).toEqual(['1', '3', '4']);
  });
  it('TC-VIZ-ARRAYVIZ-05 append 尾增（无需选中）', async () => {
    const w = mountIt();
    await btn(w, '追加').trigger('click');
    const cells = w.findAll('.cell');
    expect(cells).toHaveLength(5);
    expect(cells[4].text()).toBe('5');
  });
  it('TC-VIZ-ARRAYVIZ-06 下标行数量 = items 数', async () => {
    const w = mountIt();
    await btn(w, '追加').trigger('click');
    expect(w.findAll('.slot')).toHaveLength(5);
    expect(w.findAll('.slot .num').map((s) => s.text())).toEqual(['0', '1', '2', '3', '4']);
  });
  it('TC-VIZ-ARRAYVIZ-07 满 8 禁插入/追加', async () => {
    const w = mountIt();
    for (let i = 0; i < 4; i++) await btn(w, '追加').trigger('click'); // 4→8
    expect(w.findAll('.cell')).toHaveLength(8);
    expect(btn(w, '追加').attributes('disabled')).toBeDefined();
    await w.findAll('.cell')[0].trigger('click');
    expect(btn(w, '插入').attributes('disabled')).toBeDefined();
  });
  it('TC-VIZ-ARRAYVIZ-08 access 解说含 O(1)', async () => {
    const w = mountIt();
    await w.findAll('.cell')[2].trigger('click');
    await btn(w, '访问').trigger('click');
    expect(w.find('.status').text()).toContain('O(1)');
  });
  it('TC-VIZ-ARRAYVIZ-09 reset 复位 4 格、清选中', async () => {
    const w = mountIt();
    await w.findAll('.cell')[1].trigger('click');
    await btn(w, '追加').trigger('click');
    await btn(w, '重置').trigger('click');
    expect(w.findAll('.cell')).toHaveLength(4);
    expect(w.findAll('.cell.is-selected')).toHaveLength(0);
  });
  it('TC-VIZ-ARRAYVIZ-10 删空显示 empty-hint + 禁三键', async () => {
    const w = mountIt();
    for (let i = 0; i < 4; i++) {
      await w.findAll('.cell')[0].trigger('click');
      await btn(w, '删除').trigger('click');
    }
    expect(w.findAll('.cell')).toHaveLength(0);
    expect(w.find('.empty-hint').exists()).toBe(true);
    expect(btn(w, '访问').attributes('disabled')).toBeDefined();
  });
});
```

**实现** `src/components/structures/ArrayViz.vue`（见 design §3；用 `useArray` + `<TransitionGroup name="array">`）。骨架：

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useArray } from './useArray';
const a = useArray();
const status = ref('点一个格子选中下标，再用上面的按钮操作');
const flashId = ref<string | null>(null);
let timer: ReturnType<typeof setTimeout> | undefined;
const onSelect = (i: number) => {
  a.select(i);
  status.value =
    a.selected.value === null
      ? '已取消选中'
      : `选中下标 ${a.selected.value}（值 ${a.valueAt(a.selected.value)}）· 可访问 / 插入 / 删除`;
};
const onAccess = () => {
  if (a.selected.value === null) return;
  const i = a.selected.value;
  flashId.value = a.items.value[i][0];
  clearTimeout(timer);
  timer = setTimeout(() => (flashId.value = null), 600);
  status.value = `access：按下标直达 a[${i}] = ${a.valueAt(i)}，不用挨个找，O(1)`;
};
const onInsert = () => {
  const i = a.selected.value;
  if (i === null) return;
  const moved = a.items.value.length - i;
  const v = a.insert();
  if (v !== null)
    status.value = `insert：在下标 ${i} 放入 ${v}，下标 ${i} 起 ${moved} 个元素右移腾位，O(n)`;
};
const onRemove = () => {
  const i = a.selected.value;
  if (i === null) return;
  const v = a.remove();
  const moved = a.items.value.length - i;
  if (v !== null) status.value = `delete：移除 a[${i}] = ${v}，后面 ${moved} 个元素左移补位，O(n)`;
};
const onAppend = () => {
  const v = a.append();
  if (v !== null) status.value = `尾部追加：在末尾放入 ${v}，无需搬移，O(1)`;
};
const onReset = () => {
  a.reset();
  status.value = '已重置 · 点一个格子选中下标，再用上面的按钮操作';
};
</script>

<template>
  <div class="array-viz column center">
    <div class="toolbar row-wrap">
      <button class="btn" :disabled="!a.hasSelection.value" @click="onAccess">
        访问 a[{{ a.hasSelection.value ? a.selected.value : 'i' }}]
      </button>
      <button class="btn" :disabled="!a.canInsert.value" @click="onInsert">
        {{ a.hasSelection.value ? `在 ${a.selected.value} 处插入` : '插入' }}
      </button>
      <button class="btn" :disabled="!a.hasSelection.value" @click="onRemove">
        {{ a.hasSelection.value ? `删除 a[${a.selected.value}]` : '删除' }}
      </button>
      <button class="btn" :disabled="!a.canAppend.value" @click="onAppend">尾部追加</button>
      <button class="btn" @click="onReset">重置</button>
    </div>
    <div class="lane-wrap">
      <div class="lane">
        <span v-if="!a.items.value.length" class="empty-hint">数组为空</span>
        <div class="stack">
          <TransitionGroup name="array" tag="div" class="cells">
            <div
              v-for="(it, i) in a.items.value"
              :key="it[0]"
              class="cell"
              :class="{ 'is-selected': i === a.selected.value, flash: it[0] === flashId }"
              :data-i="i"
              @click="onSelect(i)"
            >
              {{ it[1] }}
            </div>
          </TransitionGroup>
          <div class="indices">
            <div
              v-for="(it, i) in a.items.value"
              :key="i"
              class="slot"
              :class="{ 'is-selected': i === a.selected.value }"
            >
              <span class="ptr">↑</span><span class="num">{{ i }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p class="status">{{ status }}</p>
  </div>
</template>

<style scoped lang="less">
/* 车道定宽 448、cells/indices 同 flex 左对齐贴合（gap 2px）、选中深绿(仅配色不位移)、
   ptr 挂槽位 CSS 显隐、enter 右滑/leave 缩淡/move FLIP；取原型样式 */
</style>
```

注：两条硬约束见 design §3.1（`↑` 挂槽位、车道定宽）；选中态**仅配色**不位移（避免与 FLIP move-transform 冲突），`flash` 仅 access 一次性。**验证**：`pnpm test:unit run src/components/structures/ArrayViz.spec.ts`。

---

## T3 — `Array.vue` 数组页 + `Queue.vue` 结尾微调（L4，先写测试）

**先写失败测试** `src/views/Article/DataStructure/Array.spec.ts`（`TC-VIEW-ARRAY-*`）：

- `-01` 挂载渲染 `Article` + `ArrayViz`（`findComponent` 存在）。
- `-02` 含「数组」标题与 `Playground`（`.playground` 存在）。

**实现**：填充 `Array.vue`（见 design §4 大纲；`<Article>` 套正文 + `<Playground><ArrayViz/></Playground>` + `<Callout>`），正文以原型文案为基础。

**Queue 结尾微调**：把 `Queue.vue` 结尾「再往后是树——一种有层次的非线性结构。」改为承接线性表家族（数组/链表）再到树，保持菜单顺序叙事连贯。**先 grep 确认** `Queue.spec.ts`/`e2e/queue.e2e.ts` 不断言该句（只断言「队列」标题、`Playground`、enqueue/dequeue 行为），改后 queue 全测仍绿。**验证**：`pnpm test:unit run src/views/Article/DataStructure/Array.spec.ts` + `pnpm test:unit run src/views/Article/DataStructure/Queue.spec.ts`。

---

## T4 — e2e（L5，Playwright）

`e2e/array.e2e.ts`（`TC-E2E-ARRAY-01`）：导航 `/docs/array`、见标题「数组」与 `.playground`；限定 `.array-viz` 内：初始 4 格、点下标 2 的 `.cell` 选中（`is-selected` 深绿 + 对应 `.slot` is-selected）；insert 见 5 格且下标 2 `.cell`=「5」、下标 3 `.cell`=「3」；append 见 6 格、末位=「5」或对应值；reset 回 4 格。（菜单也用 `.btn`，全部限定 `.array-viz`/`.article`；insert/remove 后先等数量变化再断言，避开 FLIP/leave 瞬时态。）**验证**：`pnpm exec playwright test e2e/array.e2e.ts`。

---

## 全门禁

`pnpm type-check` / `pnpm lint:check` / `pnpm format:check` / `pnpm test:unit run` / `pnpm exec playwright test`，全绿后回写三索引 + roadmap，提交 main。

## 自测报告（实现期回填）

- [x] T1 useArray 全绿（10 Case）— TDD：先红（模块缺失）→ 实现 → 绿；其中 TC-06 修正测试自身笔误（insert 后选中已落新元素，无需再 select 否则 toggle 掉）
- [x] T2 ArrayViz 全绿（10 Case）— 选中态改为仅配色 + 阴影环（去掉原型的 transform 上浮，避免与 FLIP move-transform 冲突）；flash 仅 access 一次性
- [x] T3 数组页全绿（2 Case）+ Queue 改结尾一句后 queue 全测仍绿（先 grep 确认无断言该句）
- [x] T4 e2e 全绿（TC-E2E-ARRAY-01）— 真机另验（dev server 截图）：贴合格 + 固定下标行 + ↑ 槽位指针挂位置（搬移时值滑、指针留原位）+ 右移腾位 + 下标≠值 + 车道定宽空/满一致
- [x] 全门禁达标：type-check ✓ / lint:check ✓ / format:check ✓（Array.vue 经 prettier --write）/ coverage All files 94.00%/92.37%/90.74%/94.39%（stmts/branch/funcs/lines，均过门槛）；ArrayViz 100% 行覆盖、分支 70.83%
- [x] 单测 418 passed（66 文件，含新增 22 单测 Case）+ e2e 13 passed（含新增 1）；8 排序 + 栈 + 队列 + 播放器全部现有 Case 零回归；**骨架（article/）零改动复用**——再次验证可复用性
