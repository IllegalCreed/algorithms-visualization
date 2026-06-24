# 实现：链表 Linked List 知识页（TDD 任务分解 T1–T4）

> Status: verified
> Stable ID: C-20260625-018
> Owner: IllegalCreed
> Created: 2026-06-25
> Last reviewed: 2026-06-25
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 执行顺序（按依赖）

`T1 useLink` → `T2 LinkViz` → `T3 链表页` → `T4 e2e`。每个任务铁律：先写失败测试 → 跑红 → 实现 → 跑绿。骨架复用 C-015、零改动、不重测。

---

## T1 — `useLink.ts` 链表逻辑（L3，先写测试）

**先写失败测试** `src/components/structures/useLink.spec.ts`（`TC-LINK-LOGIC-*`）：

```ts
import { describe, it, expect } from 'vitest';
import { useLink, LINK_MAX } from './useLink';

const vals = (l: ReturnType<typeof useLink>) => l.items.value.map((t) => t[1]);

describe('useLink', () => {
  it('TC-LINK-LOGIC-01 初始 [1,2,3]、无选中、can 标志', () => {
    const l = useLink();
    expect(vals(l)).toEqual([1, 2, 3]);
    expect(l.selected.value).toBe(null);
    expect(l.hasSelection.value).toBe(false);
    expect(l.canInsert.value).toBe(false);
    expect(l.canPrepend.value).toBe(true);
  });
  it('TC-LINK-LOGIC-02 valueAt 按位置读、越界 null', () => {
    const l = useLink();
    expect(l.valueAt(0)).toBe(1);
    expect(l.valueAt(2)).toBe(3);
    expect(l.valueAt(-1)).toBe(null);
    expect(l.valueAt(3)).toBe(null);
  });
  it('TC-LINK-LOGIC-03 select toggle：选中/再点取消/换选', () => {
    const l = useLink();
    l.select(1);
    expect(l.selected.value).toBe(1);
    l.select(1);
    expect(l.selected.value).toBe(null);
    l.select(0);
    expect(l.selected.value).toBe(0);
  });
  it('TC-LINK-LOGIC-04 insertAfter 未选返回 null 且不变', () => {
    const l = useLink();
    expect(l.insertAfter()).toBe(null);
    expect(vals(l)).toEqual([1, 2, 3]);
  });
  it('TC-LINK-LOGIC-05 insertAfter 在选中后插递增值、选中落新节点(i+1)、链序、id 唯一', () => {
    const l = useLink();
    l.select(1);
    expect(l.insertAfter()).toBe(4);
    expect(vals(l)).toEqual([1, 2, 4, 3]);
    expect(l.selected.value).toBe(2);
    expect(l.valueAt(2)).toBe(4);
    expect(l.valueAt(3)).toBe(3);
    const ids = l.items.value.map((t) => t[0]);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('TC-LINK-LOGIC-06 remove 删选中、清空选中', () => {
    const l = useLink();
    l.select(1);
    expect(l.remove()).toBe(2);
    expect(vals(l)).toEqual([1, 3]);
    expect(l.selected.value).toBe(null);
  });
  it('TC-LINK-LOGIC-07 remove 未选返回 null', () => {
    const l = useLink();
    expect(l.remove()).toBe(null);
    expect(vals(l)).toEqual([1, 2, 3]);
  });
  it('TC-LINK-LOGIC-08 prepend 头插递增、落表头、选中随之 +1', () => {
    const l = useLink();
    l.select(1);
    expect(l.prepend()).toBe(4);
    expect(vals(l)).toEqual([4, 1, 2, 3]);
    expect(l.valueAt(0)).toBe(4);
    expect(l.selected.value).toBe(2);
  });
  it('TC-LINK-LOGIC-09 满 LINK_MAX：canPrepend/canInsert 为 false、返回 null', () => {
    const l = useLink();
    while (l.items.value.length < LINK_MAX) l.prepend();
    expect(l.items.value.length).toBe(LINK_MAX);
    expect(l.canPrepend.value).toBe(false);
    expect(l.prepend()).toBe(null);
    l.select(0);
    expect(l.canInsert.value).toBe(false);
    expect(l.insertAfter()).toBe(null);
    expect(l.items.value.length).toBe(LINK_MAX);
  });
  it('TC-LINK-LOGIC-10 reset 复位 [1,2,3]、清选中、下次 prepend=4', () => {
    const l = useLink();
    l.select(0);
    l.insertAfter();
    l.prepend();
    l.reset();
    expect(vals(l)).toEqual([1, 2, 3]);
    expect(l.selected.value).toBe(null);
    expect(l.prepend()).toBe(4);
  });
});
```

**实现** `src/components/structures/useLink.ts`（见 design §2，对标 `useArray`）：

```ts
import { ref, computed, type Ref, type ComputedRef } from 'vue';

/** 演示链表的最大节点数（满时禁止插入/头插，避免溢出容器） */
export const LINK_MAX = 6;

export interface UseLink {
  items: Ref<[string, number][]>; // [稳定id, 值]；顺序 = 从 head 起的链序，index 0 = head
  selected: Ref<number | null>;
  hasSelection: ComputedRef<boolean>;
  canInsert: ComputedRef<boolean>;
  canPrepend: ComputedRef<boolean>;
  select: (i: number) => void;
  valueAt: (i: number) => number | null;
  insertAfter: () => number | null;
  remove: () => number | null;
  prepend: () => number | null;
  reset: () => void;
}

const INITIAL = [1, 2, 3];

export function useLink(): UseLink {
  let seq = INITIAL.length; // 下一个值 = ++seq（= 4）
  let idn = 0;
  const make = (): [string, number][] => INITIAL.map((v) => [`l${idn++}`, v]);

  const items = ref<[string, number][]>(make());
  const selected = ref<number | null>(null);

  const hasSelection = computed(() => selected.value !== null);
  const canInsert = computed(() => selected.value !== null && items.value.length < LINK_MAX);
  const canPrepend = computed(() => items.value.length < LINK_MAX);

  const select = (i: number): void => {
    selected.value = selected.value === i ? null : i;
  };
  const valueAt = (i: number): number | null =>
    i >= 0 && i < items.value.length ? items.value[i][1] : null;
  const insertAfter = (): number | null => {
    if (selected.value === null || items.value.length >= LINK_MAX) return null;
    const v = ++seq;
    items.value.splice(selected.value + 1, 0, [`l${idn++}`, v]); // 选中后插（改 2 根 next）
    selected.value = selected.value + 1; // 选中落新节点
    return v;
  };
  const remove = (): number | null => {
    if (selected.value === null) return null;
    const v = items.value.splice(selected.value, 1)[0][1]; // 删选中（前驱 next 跳过）
    selected.value = null;
    return v;
  };
  const prepend = (): number | null => {
    if (items.value.length >= LINK_MAX) return null;
    const v = ++seq;
    items.value.unshift([`l${idn++}`, v]); // 头插（改 head + 新节点 next）
    if (selected.value !== null) selected.value = selected.value + 1;
    return v;
  };
  const reset = (): void => {
    seq = INITIAL.length;
    items.value = make();
    selected.value = null;
  };

  return {
    items,
    selected,
    hasSelection,
    canInsert,
    canPrepend,
    select,
    valueAt,
    insertAfter,
    remove,
    prepend,
    reset,
  };
}
```

**验证**：`pnpm test:unit run src/components/structures/useLink.spec.ts`。

---

## T2 — `LinkViz.vue` 链表互动组件（L4，先写测试）

**先写失败测试** `src/components/structures/LinkViz.spec.ts`（`TC-VIZ-LINKVIZ-*`，TransitionGroup stub 即时）：

```ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LinkViz from './LinkViz.vue';

const mountIt = () =>
  mount(LinkViz, {
    global: { stubs: { 'transition-group': { template: '<div><slot /></div>' } } },
  });
const btn = (w: ReturnType<typeof mountIt>, label: string) =>
  w.findAll('.btn').find((b) => b.text().includes(label))!;

describe('LinkViz', () => {
  it('TC-VIZ-LINKVIZ-01 初始 3 节点 + head + null + 无选中禁查找/插入/删除', () => {
    const w = mountIt();
    expect(w.findAll('.node')).toHaveLength(3);
    expect(w.find('.head').exists()).toBe(true);
    expect(w.find('.nullbox').exists()).toBe(true);
    expect(w.find('.empty-hint').exists()).toBe(false);
    expect(btn(w, '查找').attributes('disabled')).toBeDefined();
    expect(btn(w, '插入').attributes('disabled')).toBeDefined();
    expect(btn(w, '删除').attributes('disabled')).toBeDefined();
    expect(btn(w, '头插').attributes('disabled')).toBeUndefined();
  });
  it('TC-VIZ-LINKVIZ-02 点节点选中：is-sel + 启用查找/插入/删除', async () => {
    const w = mountIt();
    await w.findAll('.node .box')[1].trigger('click');
    expect(w.findAll('.node')[1].classes()).toContain('is-sel');
    expect(btn(w, '查找').attributes('disabled')).toBeUndefined();
    expect(btn(w, '插入').attributes('disabled')).toBeUndefined();
  });
  it('TC-VIZ-LINKVIZ-03 insertAfter 增节点、新值落选中后', async () => {
    const w = mountIt();
    await w.findAll('.node .box')[1].trigger('click');
    await btn(w, '插入').trigger('click');
    const boxes = w.findAll('.node .box');
    expect(boxes).toHaveLength(4);
    expect(boxes[2].text()).toBe('4'); // 落在 a[1] 之后 = index 2
  });
  it('TC-VIZ-LINKVIZ-04 remove 减节点', async () => {
    const w = mountIt();
    await w.findAll('.node .box')[1].trigger('click');
    await btn(w, '删除').trigger('click');
    expect(w.findAll('.node')).toHaveLength(2);
    expect(w.findAll('.node .box').map((b) => b.text())).toEqual(['1', '3']);
  });
  it('TC-VIZ-LINKVIZ-05 prepend 头插落表头', async () => {
    const w = mountIt();
    await btn(w, '头插').trigger('click');
    const boxes = w.findAll('.node .box');
    expect(boxes).toHaveLength(4);
    expect(boxes[0].text()).toBe('4');
  });
  it('TC-VIZ-LINKVIZ-06 每节点带 next 箭头 + 有 head/null', () => {
    const w = mountIt();
    expect(w.findAll('.node .arrow').length).toBeGreaterThanOrEqual(3);
    expect(w.find('.head').exists()).toBe(true);
    expect(w.find('.nullbox').exists()).toBe(true);
  });
  it('TC-VIZ-LINKVIZ-07 满 6 禁插入/头插', async () => {
    const w = mountIt();
    for (let i = 0; i < 3; i++) await btn(w, '头插').trigger('click'); // 3→6
    expect(w.findAll('.node')).toHaveLength(6);
    expect(btn(w, '头插').attributes('disabled')).toBeDefined();
    await w.findAll('.node .box')[0].trigger('click');
    expect(btn(w, '插入').attributes('disabled')).toBeDefined();
  });
  it('TC-VIZ-LINKVIZ-08 find 同步解说含 O(n)', async () => {
    const w = mountIt();
    await w.findAll('.node .box')[2].trigger('click');
    await btn(w, '查找').trigger('click');
    expect(w.find('.status').text()).toContain('O(n)');
  });
  it('TC-VIZ-LINKVIZ-09 reset 复位 3 节点、清选中', async () => {
    const w = mountIt();
    await w.findAll('.node .box')[1].trigger('click');
    await btn(w, '头插').trigger('click');
    await btn(w, '重置').trigger('click');
    expect(w.findAll('.node')).toHaveLength(3);
    expect(w.findAll('.node.is-sel')).toHaveLength(0);
  });
  it('TC-VIZ-LINKVIZ-10 删空显示 empty-hint + 禁三键', async () => {
    const w = mountIt();
    for (let i = 0; i < 3; i++) {
      await w.findAll('.node .box')[0].trigger('click');
      await btn(w, '删除').trigger('click');
    }
    expect(w.findAll('.node')).toHaveLength(0);
    expect(w.find('.empty-hint').exists()).toBe(true);
    expect(btn(w, '查找').attributes('disabled')).toBeDefined();
  });
});
```

**实现** `src/components/structures/LinkViz.vue`（见 design §3；用 `useLink` + `<TransitionGroup name="link">`）。骨架：

```vue
<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { useLink } from './useLink';
const l = useLink();
const status = ref('点一个节点选中它，再用上面的按钮操作');
const visiting = ref(-1); // 查找逐跳游标
const rewired = ref<(number | 'head')[]>([]); // 被改写的 next 箭头（脉冲）
const busy = ref(false);
let vt: ReturnType<typeof setTimeout> | undefined;
let rt: ReturnType<typeof setTimeout> | undefined;
const flashRewire = (keys: (number | 'head')[]) => {
  rewired.value = keys;
  clearTimeout(rt);
  rt = setTimeout(() => (rewired.value = []), 700);
};
const onSelect = (i: number) => {
  if (busy.value) return;
  l.select(i);
  status.value =
    l.selected.value === null
      ? '已取消选中'
      : `选中 a[${l.selected.value}]（值 ${l.valueAt(l.selected.value)}）· 可查找 / 在其后插入 / 删除`;
};
const onFind = () => {
  const i = l.selected.value;
  if (i === null || busy.value) return;
  status.value = `find：从 head 走了 ${i + 1} 步才到 a[${i}]（值 ${l.valueAt(i)}），不能跳，O(n)`;
  busy.value = true; // 仅查找锁工具栏（逐跳视觉）
  let k = 0;
  const step = () => {
    visiting.value = k;
    if (k < i) {
      k++;
      vt = setTimeout(step, 480);
    } else {
      vt = setTimeout(() => {
        visiting.value = -1;
        busy.value = false;
      }, 480);
    }
  };
  step();
};
const onInsert = () => {
  const i = l.selected.value;
  if (i === null) return;
  const v = l.insertAfter();
  if (v !== null) {
    flashRewire([i, i + 1]);
    status.value = `在 a[${i}] 后插入 ${v}：只改了 2 根 next（高亮），其余节点没动，O(1)`;
  }
};
const onRemove = () => {
  const i = l.selected.value;
  if (i === null) return;
  const v = l.remove();
  if (v !== null) {
    flashRewire([i - 1 >= 0 ? i - 1 : 'head']);
    status.value = `删除 a[${i}] = ${v}：让前一个节点 next 跳过它，只改 1 根，O(1)`;
  }
};
const onPrepend = () => {
  const v = l.prepend();
  if (v !== null) {
    flashRewire(['head', 0]);
    status.value = `头插 ${v}：新节点 next 指原头、head 指新节点，O(1)`;
  }
};
const onReset = () => {
  l.reset();
  visiting.value = -1;
  status.value = '已重置 · 点一个节点选中它，再用上面的按钮操作';
};
onUnmounted(() => {
  clearTimeout(vt);
  clearTimeout(rt);
});
</script>

<template>
  <div class="link-viz column center">
    <div class="toolbar row-wrap">
      <button class="btn" :disabled="busy || !l.hasSelection.value" @click="onFind">
        {{ l.hasSelection.value ? `查找 a[${l.selected.value}]` : '查找选中' }}
      </button>
      <button class="btn" :disabled="busy || !l.canInsert.value" @click="onInsert">
        {{ l.hasSelection.value ? `在 a[${l.selected.value}] 后插入` : '插入' }}
      </button>
      <button class="btn" :disabled="busy || !l.hasSelection.value" @click="onRemove">
        {{ l.hasSelection.value ? `删除 a[${l.selected.value}]` : '删除选中' }}
      </button>
      <button class="btn" :disabled="busy || !l.canPrepend.value" @click="onPrepend">头插</button>
      <button class="btn" :disabled="busy" @click="onReset">重置</button>
    </div>
    <div class="lane-wrap">
      <div class="lane">
        <span v-if="!l.items.value.length" class="empty-hint">链表为空</span>
        <div class="row">
          <div class="head"><span class="pill">head</span></div>
          <span
            v-if="l.items.value.length"
            class="arrow"
            :class="{ rewired: rewired.includes('head') }"
            >→</span
          >
          <TransitionGroup name="link" tag="div" class="nodes">
            <div
              v-for="(it, i) in l.items.value"
              :key="it[0]"
              class="node"
              :class="{ 'is-sel': i === l.selected.value, visiting: i === visiting }"
              :data-i="i"
            >
              <div class="box" @click="onSelect(i)">{{ it[1] }}</div>
              <span class="arrow" :class="{ rewired: rewired.includes(i) }">→</span>
            </div>
          </TransitionGroup>
          <div class="nullbox">∅</div>
        </div>
      </div>
    </div>
    <p class="status">{{ status }}</p>
  </div>
</template>

<style scoped lang="less">
/* 车道定宽 560、head 胶囊 + 节点[值|next→] + null、选中深绿(仅配色)、visiting 逐跳、rewired 脉冲、
   .nodes flex-row 承载 TransitionGroup（enter 滑入/leave 缩淡/move FLIP）；取原型样式 */
</style>
```

注：两条硬约束见 design §3.1（箭头/head 挂节点、车道定宽）；选中态仅配色（沿用 C-017 教训）；find 同步置 O(n) 状态（可测）、逐跳 setTimeout 纯视觉、卸载清理。**验证**：`pnpm test:unit run src/components/structures/LinkViz.spec.ts`。

---

## T3 — `Link.vue` 链表页（L4，先写测试）

**先写失败测试** `src/views/Article/DataStructure/Link.spec.ts`（`TC-VIEW-LINK-*`）：

- `-01` 挂载渲染 `Article` + `LinkViz`（`findComponent` 存在）。
- `-02` 含「链表」标题与 `Playground`（`.playground` 存在）。

**实现**：填充 `Link.vue`（见 design §4 大纲；`<Article>` 套正文 + `<Playground><LinkViz/></Playground>` + `<Callout>`），正文以原型文案为基础。**验证**：`pnpm test:unit run src/views/Article/DataStructure/Link.spec.ts`。

---

## T4 — e2e（L5，Playwright）

`e2e/link.e2e.ts`（`TC-E2E-LINK-01`）：导航 `/docs/link`、见标题「链表」与 `.playground`；限定 `.link-viz` 内：初始 3 节点 + `.head` + `.nullbox`；点第 2 个 `.node .box` 选中（`is-sel`）；在其后插入见 4 节点且新节点值落选中后；头插见 5 节点且落表头；重置回 3 节点。（菜单也用 `.btn`，全部限定 `.link-viz`/`.article`；插入/删除后先等数量变化再断言，避开 FLIP/leave 瞬时态。）**验证**：`pnpm exec playwright test e2e/link.e2e.ts`。

---

## 全门禁

`pnpm type-check` / `pnpm lint:check` / `pnpm format:check` / `pnpm test:unit run` / `pnpm exec playwright test`，全绿后回写三索引 + roadmap，提交 main。

## 自测报告（实现期回填）

- [x] T1 useLink 全绿（10 Case）— TDD：先红（模块缺失）→ 实现 → 绿
- [x] T2 LinkViz 全绿（10 Case）— 中途修正测试自身笔误：选中后插入按钮文案变「在 a[i] 后插入」，helper 子串应用稳定的「插入」（不误中「头插」），非实现问题；选中态仅配色（沿用 C-017 教训）；find 同步置 O(n) 状态（可测）、逐跳 setTimeout 纯视觉
- [x] T3 链表页全绿（2 Case）
- [x] T4 e2e 全绿（TC-E2E-LINK-01）— 真机另验（dev server 截图）：head + 节点[值|next→] + null + 选中后插入只改 2 根 next O(1) + 查找游标从 head 逐跳 O(n)；e2e 跳过 find（避 2.4s 逐跳）由 L4 状态断言覆盖
- [x] 全门禁达标：type-check ✓ / lint:check ✓ / format:check ✓（LinkViz/Link 经 prettier --write）/ coverage All files 93.86%/91.82%/90.63%/94.55%（stmts/branch/funcs/lines，均过门槛）；LinkViz 92.18% 行覆盖（未覆盖仅查找计时器回调 + onUnmounted）
- [x] 单测 440 passed（69 文件，含新增 22 单测 Case）+ e2e 14 passed（含新增 1）；8 排序 + 栈 + 队列 + 数组 + 播放器全部现有 Case 零回归；**骨架（article/）零改动复用**——第三次验证可复用性
