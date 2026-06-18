# M1 测试体系 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 给 algorithms-visualization 全量补 L3/L4 单元/组件测试 + L5 端到端测试，建立 Vitest 覆盖率与 Playwright e2e 基础设施和全局测试索引。

**Architecture:** 先把冒泡排序纯逻辑从 `BubbleSort.vue` 抽到 `src/algorithms/bubble-sort.ts`（可测、行为不变）；Vitest（jsdom）跑 L3 单元与 L4 组件，co-locate `*.spec.ts`；Playwright 跑 L5 e2e（`e2e/`，webServer 自动起 dev）；覆盖率 V8，本地 thresholds 门槛，不卡 CI。

**Tech Stack:** Vitest 4 + @vue/test-utils 2 + jsdom（已装），@playwright/test（待装），Vue 3 / Pinia 3 / vue-router 5。

## Global Constraints

- 包管理器 **pnpm**（`pnpm exec` / `pnpm test:unit`），不用 npm/yarn。
- 测试 co-locate：`Foo.spec.ts` 贴 `Foo.vue` / `foo.ts`；e2e 放 `e2e/<flow>.e2e.ts`。
- 命名功能化（规范 §5.3），禁 Phase/Stage 等内部代号。
- **不加 CI 测试门禁**（`deploy.yml` 不动）；不改 UI/动画表现；不补新算法。
- 覆盖率门槛（本地 thresholds）：业务核心 lines ≥85 / branches ≥75；一般 ≥70 / ≥60。本项目无安全类代码。
- 每个 Case 有稳定 ID（`TC-<MODULE>-<NN>`），同步登记 `docs/test-cases/{index,by-layer,by-module}.md`。
- 提交信息中文，结尾带 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。

---

## File Structure

**创建：**

- `vitest.config.ts` — Vitest 配置（jsdom、globals、覆盖率 V8 + thresholds）
- `src/algorithms/bubble-sort.ts` — 抽离的冒泡排序纯逻辑（步骤序列）
- `src/algorithms/bubble-sort.spec.ts` — L3 算法测试
- `src/store/modules/system.spec.ts` — L3 store 测试
- `src/views/Home/Main/hooks.spec.ts`、`src/views/Docs/Menu/hooks.spec.ts`（及其余 hooks）— L3
- `src/components/{Block,List,Arrow,ArrowTrack}.spec.ts` — L4 可视化引擎
- `src/views/**/<Component>.spec.ts` — L4 视图组件
- `playwright.config.ts` — Playwright 配置
- `e2e/{home-navigation,docs-menu,bubble-sort}.e2e.ts` — L5
- `docs/test-cases/{index,by-layer,by-module}.md` — 全局索引（index 已存在，补 by-layer/by-module）

**修改：**

- `src/views/Article/SortAlgorithm/BubbleSort.vue` — 消费抽离算法
- `package.json` — 加 `test:e2e`、`coverage` 脚本
- `.gitignore` — 加 `coverage/`、`playwright-report/`、`test-results/`

---

## Phase 0 — 测试基础设施

### Task 1: Vitest 配置 + 覆盖率 + 脚本

**Files:**

- Create: `vitest.config.ts`
- Modify: `package.json`、`.gitignore`
- Test: `src/algorithms/bubble-sort.spec.ts`（Task 2 用，本任务先建最小 smoke）

**Interfaces:**

- Produces: `pnpm test:unit` 跑 Vitest（jsdom）；`pnpm coverage` 出 V8 覆盖率报告。

- [ ] **Step 1: 写 `vitest.config.ts`**

```ts
import { fileURLToPath } from 'node:url';
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config';
import viteConfig from './vite.config';

export default defineConfig((env) =>
  mergeConfig(viteConfig(env), {
    test: {
      environment: 'jsdom',
      globals: true,
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        include: ['src/**/*.{ts,vue}'],
        exclude: ['src/main.ts', 'src/**/*.spec.ts', 'src/vite-env.d.ts'],
        thresholds: { lines: 70, branches: 60, functions: 70, statements: 70 },
      },
    },
  }),
);
```

> 注：`vite.config.ts` 现为函数式 `defineConfig(({mode})=>...)`，故 `viteConfig(env)` 调用传入 env。

- [ ] **Step 2: 加 package.json 脚本**

在 `scripts` 中加：

```json
"coverage": "vitest run --coverage",
"test:e2e": "playwright test"
```

（`test:unit` 已存在为 `vitest`）

- [ ] **Step 3: 更新 .gitignore**

追加：

```
coverage
playwright-report
test-results
```

- [ ] **Step 4: 建最小 smoke 测试验证配置**

`src/algorithms/bubble-sort.spec.ts`（临时 smoke，Task 2 替换为真实用例）：

```ts
import { describe, it, expect } from 'vitest';
describe('vitest smoke', () => {
  it('runs', () => expect(1 + 1).toBe(2));
});
```

- [ ] **Step 5: 跑测试验证配置生效**

Run: `pnpm test:unit run`
Expected: smoke 测试 PASS，Vitest 用 jsdom 环境启动无报错。

- [ ] **Step 6: 提交**

```bash
git add vitest.config.ts package.json .gitignore src/algorithms/bubble-sort.spec.ts
git commit -m "test: 配置 Vitest + 覆盖率（M1 基础设施）

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Phase 1 — L3 前端单元

### Task 2: BubbleSort 算法抽离 + L3 测试（TDD）

**Files:**

- Create: `src/algorithms/bubble-sort.ts`
- Test: `src/algorithms/bubble-sort.spec.ts`（替换 smoke）
- Modify: `src/views/Article/SortAlgorithm/BubbleSort.vue`

**Interfaces:**

- Produces:

  ```ts
  export interface SortStep {
    array: number[]; // 该步结束后的数组快照
    compare: [number, number]; // 本步比较的两个下标
    swapped: boolean; // 本步是否交换
  }
  export function bubbleSortSteps(input: number[]): SortStep[];
  ```

  规则：标准冒泡（每轮把最大值冒到末尾）；每比较一对相邻元素产出一个 SortStep；空数组/单元素返回 `[]`；不修改入参。

- [ ] **Step 1: 写失败测试 `src/algorithms/bubble-sort.spec.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { bubbleSortSteps, type SortStep } from './bubble-sort';

describe('bubbleSortSteps', () => {
  it('空数组与单元素不产生步骤', () => {
    expect(bubbleSortSteps([])).toEqual([]);
    expect(bubbleSortSteps([5])).toEqual([]);
  });

  it('最终数组升序排列', () => {
    const steps = bubbleSortSteps([7, 6, 5, 10, 9, 8, 4, 3, 2, 1]);
    const last = steps[steps.length - 1];
    expect(last.array).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('每步 compare 是相邻合法下标', () => {
    const steps = bubbleSortSteps([3, 1, 2]);
    for (const s of steps) {
      const [a, b] = s.compare;
      expect(b).toBe(a + 1);
      expect(a).toBeGreaterThanOrEqual(0);
      expect(b).toBeLessThan(s.array.length);
    }
  });

  it('已排序数组无任何 swap', () => {
    const steps = bubbleSortSteps([1, 2, 3, 4]);
    expect(steps.every((s) => !s.swapped)).toBe(true);
  });

  it('含重复元素结果正确且稳定地不越界', () => {
    const last = bubbleSortSteps([3, 1, 3, 2])!.at(-1)!;
    expect(last.array).toEqual([1, 2, 3, 3]);
  });

  it('不修改入参', () => {
    const input = [3, 2, 1];
    bubbleSortSteps(input);
    expect(input).toEqual([3, 2, 1]);
  });
});
```

- [ ] **Step 2: 跑测试验证失败**

Run: `pnpm test:unit run src/algorithms/bubble-sort.spec.ts`
Expected: FAIL（`bubble-sort` 模块不存在 / 函数未定义）

- [ ] **Step 3: 实现 `src/algorithms/bubble-sort.ts`**

```ts
export interface SortStep {
  array: number[];
  compare: [number, number];
  swapped: boolean;
}

/** 标准冒泡排序，返回每次相邻比较的步骤序列（纯函数，不改入参） */
export function bubbleSortSteps(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];
  for (let end = arr.length - 1; end > 0; end--) {
    for (let i = 0; i < end; i++) {
      let swapped = false;
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
      }
      steps.push({ array: [...arr], compare: [i, i + 1], swapped });
    }
  }
  return steps;
}
```

- [ ] **Step 4: 跑测试验证通过**

Run: `pnpm test:unit run src/algorithms/bubble-sort.spec.ts`
Expected: PASS（6 用例全绿）

- [ ] **Step 5: 改 `BubbleSort.vue` 消费抽离算法（行为不变）**

把内联的双层 for 循环替换为「先算步骤序列、再逐步驱动动画」。`doSort` 改为：

```ts
import { bubbleSortSteps } from '@/algorithms/bubble-sort';

async function doSort() {
  const steps = bubbleSortSteps(getInitialNum());
  for (const step of steps) {
    const [i, j] = step.compare;
    pointerArray[0].index = i;
    pointerArray[1].index = j;
    firstPointerValue.value = numArray[i][1];
    secondPointerValue.value = numArray[j][1];
    await delay(500);
    if (step.swapped) {
      const temp = numArray[i];
      numArray[i] = numArray[j];
      numArray[j] = temp;
    }
    await delay(1000);
  }
}
```

> 时序（500ms 指针移动 + 1000ms 交换）与原实现一致，渲染不变。

- [ ] **Step 6: 跑 type-check + 构建验证行为不变**

Run: `pnpm type-check && pnpm exec vite build --mode selfhost`
Expected: 均通过（动画行为在 Task 8 的 L4 与 Task 12 的 L5 进一步验证）

- [ ] **Step 7: 提交**

```bash
git add src/algorithms/bubble-sort.ts src/algorithms/bubble-sort.spec.ts src/views/Article/SortAlgorithm/BubbleSort.vue
git commit -m "refactor: 抽离冒泡排序纯逻辑到 algorithms/ 并补 L3 测试

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

**Case 登记：** TC-SORT-01..06（algorithms/bubble-sort）

---

### Task 3: system store L3 测试

**Files:**

- Test: `src/store/modules/system.spec.ts`

**Interfaces:**

- Consumes: `useSystemStore`（state: `isDarkMode`、`isShowHeaderShadow`、`colors`；action: `changeDarkMode()`、`changeHeaderShadowe(isShow)`）。

- [ ] **Step 1: 写测试**

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useSystemStore } from './system';

describe('useSystemStore', () => {
  beforeEach(() => setActivePinia(createPinia()));

  it('初始 isDarkMode=false、isShowHeaderShadow=false', () => {
    const s = useSystemStore();
    expect(s.isDarkMode).toBe(false);
    expect(s.isShowHeaderShadow).toBe(false);
  });

  it('changeDarkMode 切换暗色', () => {
    const s = useSystemStore();
    s.changeDarkMode();
    expect(s.isDarkMode).toBe(true);
    s.changeDarkMode();
    expect(s.isDarkMode).toBe(false);
  });

  it('changeHeaderShadowe 设置阴影开关', () => {
    const s = useSystemStore();
    s.changeHeaderShadowe(true);
    expect(s.isShowHeaderShadow).toBe(true);
  });

  it('colors 含 red/blue/yellow/green', () => {
    const s = useSystemStore();
    expect(s.colors).toEqual(['red', 'blue', 'yellow', 'green']);
  });
});
```

- [ ] **Step 2: 跑测试** — `pnpm test:unit run src/store/modules/system.spec.ts` → PASS（store 已存在，应直接通过）
- [ ] **Step 3: 提交** — `git commit -m "test: system store L3 测试"`（含 Co-Authored-By）

**Case 登记：** TC-STORE-01..04

---

### Task 4: hooks L3 测试

**Files:**

- Test: `src/views/Home/Main/hooks.spec.ts`、`src/views/Docs/Menu/hooks.spec.ts`，以及 `src/views/Home/hooks.spec.ts`、`src/views/Docs/hooks.spec.ts`、`src/views/Master/Header/hooks.spec.ts`

**Interfaces:**

- Consumes: 各 `useXxx`。执行者先 `Read` 每个 hooks.ts 确认导出与签名。

被测点（concrete）：

- `Home/Main/hooks.ts` `useCategoryData()`：返回 2 个分类（数据结构 8 项、排序算法若干）；每项有 `title/desc/icon/url`；所有 `url` 唯一。
- `Docs/Menu/hooks.ts` `useCategoryData()`：每项 `title/url`；`useMenuSelect()` 用 `provide` + `onBeforeRouteUpdate` 联动 —— 用 `@vue/test-utils` 的 `withSetup` 或挂一个宿主组件 + mock `vue-router`（`useRoute` 返回 `{name:'array'}`），断言 provide 的 ref 初值为当前路由名。
- `Home/hooks.ts`、`Docs/hooks.ts`（`useControlHeaderShadow`）、`Master/Header/hooks.ts`：读文件后针对其副作用/返回值各写 1-2 个 case（如 scroll 监听挂载/卸载，用 mock）。

- [ ] **Step 1: 写 `Home/Main/hooks.spec.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { useCategoryData } from './hooks';

describe('Home useCategoryData', () => {
  const data = useCategoryData();
  it('返回数据结构与排序两个分类', () => {
    expect(data).toHaveLength(2);
    expect(data[0].title).toBe('数据结构');
  });
  it('每个条目含 title/desc/icon/url', () => {
    for (const cat of data)
      for (const item of cat.children) {
        expect(item.title).toBeTruthy();
        expect(item.url).toBeTruthy();
        expect(item.icon).toBeTruthy();
      }
  });
  it('所有 url 唯一', () => {
    const urls = data.flatMap((c) => c.children.map((i) => i.url));
    expect(new Set(urls).size).toBe(urls.length);
  });
});
```

- [ ] **Step 2: 写 `Docs/Menu/hooks.spec.ts`**（含 `useMenuSelect` mock vue-router）

```ts
import { describe, it, expect, vi } from 'vitest';
import { useCategoryData } from './hooks';

vi.mock('vue-router', () => ({
  useRoute: () => ({ name: 'array' }),
  onBeforeRouteUpdate: vi.fn(),
}));

describe('Docs Menu useCategoryData', () => {
  it('每项含 title/url 且 url 唯一', () => {
    const data = useCategoryData();
    const urls = data.flatMap((c) => c.children.map((i) => i.url));
    expect(new Set(urls).size).toBe(urls.length);
  });
});
```

> `useMenuSelect` 需 `provide`/生命周期上下文，放到 Task 9 的 Menu 组件挂载测试里间接覆盖；本步只测纯数据 hook。

- [ ] **Step 3-5:** Read 其余 hooks.ts → 各补 spec → `pnpm test:unit run src/views` → PASS
- [ ] **Step 6: 提交** — `git commit -m "test: hooks L3 测试"`（含 Co-Authored-By）

**Case 登记：** TC-HOOK-01.. （按 hook 编号）

---

## Phase 2 — L4 前端组件

> 通用：用 `mount`（@vue/test-utils）。涉及 store 的组件包 `createTestingPinia()` 或真实 pinia；涉及 router 的用 `vi.mock('vue-router')` 或 `createRouter` + memory history。

### Task 5: Block 组件测试

**Files:** Test `src/components/Block.spec.ts`
**Interfaces:** Consumes `Block.vue`（props `data: [string, number]`、`percent: number`；渲染 `data[1]`，背景 `rgba(0,200,50,percent)`，文字 `percent<0.5?'block':'white'`）。

- [ ] **Step 1: 写测试**

```ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Block from './Block.vue';

describe('Block', () => {
  it('渲染数值', () => {
    const w = mount(Block, { props: { data: ['0', 42], percent: 0.5 } });
    expect(w.text()).toContain('42');
  });
  it('背景透明度随 percent', () => {
    const w = mount(Block, { props: { data: ['0', 1], percent: 0.3 } });
    expect(w.find('.block').attributes('style')).toContain('rgba(0,200,50,0.3)');
  });
  it('percent<0.5 文字色 block，否则 white', () => {
    const low = mount(Block, { props: { data: ['0', 1], percent: 0.2 } });
    const high = mount(Block, { props: { data: ['0', 1], percent: 0.8 } });
    expect(low.find('span').attributes('style')).toContain('block');
    expect(high.find('span').attributes('style')).toContain('white');
  });
});
```

- [ ] **Step 2-4:** 跑 → PASS（组件已存在）→ 提交 `test: Block 组件 L4 测试`

**Case 登记：** TC-VIZ-BLOCK-01..03

### Task 6: List 组件测试

**Files:** Test `src/components/List.spec.ts`
**Interfaces:** Consumes `List.vue`（props `data: [string,number][]`；渲染 N 个 Block；percent 按 min→0、max→1 归一化；含 TransitionGroup）。

- [ ] **Step 1: 写测试**

```ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import List from './List.vue';
import Block from './Block.vue';

describe('List', () => {
  const data: [string, number][] = [
    ['0', 10],
    ['1', 20],
    ['2', 30],
  ];
  it('渲染与数据等量的 Block', () => {
    const w = mount(List, { props: { data } });
    expect(w.findAllComponents(Block)).toHaveLength(3);
  });
  it('最小值 percent=0、最大值 percent=1', () => {
    const w = mount(List, { props: { data } });
    const blocks = w.findAllComponents(Block);
    expect(blocks[0].props('percent')).toBe(0);
    expect(blocks[2].props('percent')).toBe(1);
  });
});
```

- [ ] **Step 2-4:** 跑 → PASS → 提交 `test: List 组件 L4 测试`

**Case 登记：** TC-VIZ-LIST-01..02

### Task 7: Arrow + ArrowTrack 测试

**Files:** Test `src/components/Arrow.spec.ts`、`src/components/ArrowTrack.spec.ts`
**Interfaces:** `Arrow`（prop `color`，svg `fill`）；`ArrowTrack`（prop `data: Pointer[]`，按 `colors[id]` 着色、`translateX(index*60px)` 定位；依赖 `useSystemStore`）。

- [ ] **Step 1: Arrow 测试**

```ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Arrow from './Arrow.vue';

describe('Arrow', () => {
  it('按 color 着色 svg', () => {
    const w = mount(Arrow, { props: { color: 'red' } });
    expect(w.find('svg').attributes('fill')).toBe('red');
  });
});
```

- [ ] **Step 2: ArrowTrack 测试（需 pinia）**

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import ArrowTrack from './ArrowTrack.vue';
import Arrow from './Arrow.vue';

describe('ArrowTrack', () => {
  it('每个 Pointer 渲染一个 Arrow 并按 index 定位', () => {
    const w = mount(ArrowTrack, {
      props: {
        data: [
          { id: '0', index: 2 },
          { id: '1', index: 3 },
        ],
      },
      global: { plugins: [createPinia()] },
    });
    const arrows = w.findAllComponents(Arrow);
    expect(arrows).toHaveLength(2);
    expect(arrows[0].attributes('style')).toContain('translateX(120px)');
  });
});
```

- [ ] **Step 3-4:** 跑 → PASS → 提交 `test: Arrow/ArrowTrack 组件 L4 测试`

**Case 登记：** TC-VIZ-ARROW-01、TC-VIZ-TRACK-01..02

### Task 8: BubbleSort 组件测试

**Files:** Test `src/views/Article/SortAlgorithm/BubbleSort.spec.ts`
**Interfaces:** Consumes `BubbleSort.vue`（挂载即自动 `doSort`）。用 `vi.useFakeTimers()` 或 mock `delay` 控制时序；断言初始渲染含 List/ArrowTrack/表达式。

- [ ] **Step 1: 写测试**

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import BubbleSort from './BubbleSort.vue';
import List from '@/components/List.vue';

describe('BubbleSort', () => {
  it('挂载渲染 List + 比较表达式', () => {
    const w = mount(BubbleSort, { global: { plugins: [createPinia()] } });
    expect(w.findComponent(List).exists()).toBe(true);
    expect(w.find('.expression').exists()).toBe(true);
  });
  it('初始渲染 10 个方块', () => {
    const w = mount(BubbleSort, { global: { plugins: [createPinia()] } });
    expect(w.findComponent(List).props('data')).toHaveLength(10);
  });
});
```

> 若自动播放的 timer 在测试环境报错，在 `beforeEach` 用 `vi.useFakeTimers()`，`afterEach` 复原。

- [ ] **Step 2-4:** 跑 → PASS → 提交 `test: BubbleSort 组件 L4 测试`

**Case 登记：** TC-SORT-COMP-01..02

### Task 9: 视图组件测试

**Files:** Test `src/views/**/<Component>.spec.ts` —— Splash、Home/Main/Category、Home/Main/Category/Item、Docs/Menu/Menu、Docs/Menu/Header/Item、Master/Header/Header、Master/Header/IconLink/IconLink、Home/Footer 等。

执行者对每个组件：先 `Read` 该 `.vue` 确认 props/交互，再写 mount 测试。Concrete 要求：

- **有交互/导航**的（Category/Item/Menu/IconLink/Header）：断言关键元素渲染 + 点击触发路由跳转（`vi.mock('vue-router')` 或注入 router stub，断言 `push`/`RouterLink` to）。
- **纯展示**的（Splash/Footer）：断言关键文案/元素存在即可。
- 依赖 store/router 的：`global.plugins` 注入 `createPinia()` 与 router stub。

代表（Category/Item，按实际 props 调整）：

```ts
import { describe, it, expect } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import Item from './Item.vue';

describe('Category Item', () => {
  it('渲染标题与描述', () => {
    const w = mount(Item, {
      props: { title: '数组', desc: '有序元素序列', icon: 'x.svg', url: 'array' },
      global: { stubs: { RouterLink: RouterLinkStub } },
    });
    expect(w.text()).toContain('数组');
  });
});
```

- [ ] **Steps:** 逐组件 Read → 写 spec → 跑 → 分组提交（如 `test: Home 视图组件 L4 测试`、`test: Docs/Master 视图组件 L4 测试`）

**Case 登记：** TC-VIEW-<组件>-NN

---

## Phase 3 — L5 端到端（Playwright）

### Task 10: Playwright 配置 + 首页导航 e2e

**Files:**

- Create: `playwright.config.ts`、`e2e/home-navigation.e2e.ts`
- Modify: 无（`test:e2e` 脚本已在 Task 1 加）

**Interfaces:** Produces `pnpm test:e2e` 跑 e2e；webServer 自动起 `pnpm dev`。

- [ ] **Step 1: 装 Playwright**

Run: `pnpm add -D @playwright/test && pnpm exec playwright install chromium`

- [ ] **Step 2: 写 `playwright.config.ts`**

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  use: { baseURL: 'http://localhost:5179' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm dev --port 5179',
    url: 'http://localhost:5179',
    reuseExistingServer: !process.env.CI,
  },
});
```

- [ ] **Step 3: 写 `e2e/home-navigation.e2e.ts`**

```ts
import { test, expect } from '@playwright/test';

test('首页加载并能进入 docs', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/算法可视化/);
  await page.getByText('开始学习').click();
  await expect(page).toHaveURL(/\/docs/);
});
```

- [ ] **Step 4: 跑** — `pnpm test:e2e e2e/home-navigation.e2e.ts` → PASS
- [ ] **Step 5: 提交** — `test: Playwright 配置 + 首页导航 e2e`

**Case 登记：** TC-E2E-HOME-01

### Task 11: docs 菜单切换 e2e

**Files:** Create `e2e/docs-menu.e2e.ts`

- [ ] **Step 1: 写测试**

```ts
import { test, expect } from '@playwright/test';

test('docs 菜单点击切换路由', async ({ page }) => {
  await page.goto('/docs/bubble-sort');
  await page.getByText('冒泡排序').click();
  await expect(page).toHaveURL(/bubble-sort/);
});
```

- [ ] **Step 2-3:** 跑 → PASS → 提交 `test: docs 菜单 e2e`

**Case 登记：** TC-E2E-MENU-01

### Task 12: 冒泡动画 e2e（验证抽离后行为）

**Files:** Create `e2e/bubble-sort.e2e.ts`

- [ ] **Step 1: 写测试**

```ts
import { test, expect } from '@playwright/test';

test('冒泡排序动画最终升序', async ({ page }) => {
  await page.goto('/docs/bubble-sort');
  // 方块渲染
  await expect(page.locator('.block').first()).toBeVisible();
  // 等待动画完成（10 元素冒泡约 ~? 秒；轮询直到稳定有序，超时 90s）
  await expect(async () => {
    const nums = await page.locator('.block span').allInnerTexts();
    const vals = nums.map(Number);
    const sorted = [...vals].sort((a, b) => a - b);
    expect(vals).toEqual(sorted);
  }).toPass({ timeout: 90_000 });
});
```

- [ ] **Step 2-3:** 跑 → PASS → 提交 `test: 冒泡动画 e2e`

**Case 登记：** TC-E2E-SORT-01

---

## Phase 4 — 收尾

### Task 13: 全局测试索引 + 覆盖率验证 + 回填文档

**Files:**

- Modify: `docs/test-cases/index.md`
- Create: `docs/test-cases/by-layer.md`、`docs/test-cases/by-module.md`
- Modify: `docs/plans/20260618-c003-test-suite/{implementation,test-cases}.md`、`docs/plans/index.md`

- [ ] **Step 1: 跑全量覆盖率**

Run: `pnpm coverage`
Expected: L3/L4 全绿，覆盖率达 thresholds（达不到则补测试至达标）。

- [ ] **Step 2: 跑全量 e2e** — `pnpm test:e2e` → 全绿
- [ ] **Step 3: 登记 `docs/test-cases/index.md`** — 把所有 TC-\* 写入主索引（Case ID、标题、owner plan=C-003、层级、自动化路径、状态 active、最后验证日期）。
- [ ] **Step 4: 建 `by-layer.md`**（L3/L4/L5 分组）、`by-module.md`（viz-engine / home / docs-shell / article-sort / store / algorithms 分组），引用同一批 Case ID。
- [ ] **Step 5: 回填 C-003 四文档** — `implementation.md`（改动清单/验证记录/覆盖率数字）、`test-cases.md`（Case 表）、`index.md` 状态 draft→verified、roadmap M1。
- [ ] **Step 6: 提交** — `docs: M1 测试体系全局索引 + 回填 C-003（verified）`

---

## Self-Review

- **Spec coverage:** L3（算法/store/hooks）→ Task 2-4；L4（引擎+视图）→ Task 5-9；L5 → Task 10-12；Vitest/覆盖率 → Task 1；Playwright → Task 10；全局索引 → Task 13；BubbleSort 抽离 → Task 2。覆盖完整。
- **Placeholder scan:** 核心任务给了完整测试代码；Task 4/9 对未细读的 hooks/视图组件给了 concrete 被测点 + 代表代码 + 「执行者先 Read」指令（非 TBD）。
- **Type consistency:** `SortStep`/`bubbleSortSteps` 在 Task 2 定义并在 Task 8/12 引用一致；`useSystemStore` action 名（`changeDarkMode`/`changeHeaderShadowe`）与源码一致。
