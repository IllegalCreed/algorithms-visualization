# 头部分享/仓库按钮 实现计划

> Status: approved
> Stable ID: C-20260622-009
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-22
> Last reviewed: 2026-06-22
> Progress: 0%
> Blocked by: none
> Next action: 按 Task 1→3 执行
> Replaces: none
> Replaced by: none
> Related plans: none
> Related tests: test-cases.md
> Related design: design.md

> **For agentic workers:** 本计划用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐 Task 执行。步骤用 `- [ ]` 复选框跟踪。每个 Task 结束都有可独立测试的交付物。

**Goal:** 让 Header 右上角三个按钮各司其职：GitHub 打开本仓库；微博/X 把当前页分享到对应平台（线上域名 + 当前路由 + 文案）。

**Architecture:** 点击行为不变（`IconLink.vue` 始终 `window.open(url)`），把「url 从哪来」收敛到纯函数 `share.ts`；`useIconLink()` 改 `computed` 依赖 `useRoute().fullPath`，让微博/X 的分享链接随当前页响应式更新。IconLink 组件零改动。

**Tech Stack:** Vue 3 `<script setup>` + TypeScript + vue-router；编码用浏览器内置 `URLSearchParams`；测试 Vitest + @vue/test-utils（L3/L4）。

## Global Constraints

- 包管理器 **pnpm**（corepack，版本锁 `packageManager`）；禁用 npm/yarn。
- 路径别名 `@` → `src/`；优先 `@/...`。
- **分享链接域名固定** `https://algo.illegalscreed.cn`（selfhost 根部署，base=/）。
- **用 `route.fullPath`（不含 base）拼接**：保证 localhost / Pages(`/algorithms-visualization/`) / 自有域名 任意环境浏览，分享出去都是规范线上 URL，不泄漏 localhost 或 base 前缀。
- **本仓库地址** `https://github.com/IllegalCreed/algorithms-visualization`（取自 git remote origin）。
- **分享文案** `算法可视化 —— 交互式数据结构与算法可视化`。
- **X 分享域名** `https://twitter.com/intent/tweet`（与 x.com 等价）；**微博** `https://service.weibo.com/share/share.php`。
- URL 参数一律经 `URLSearchParams` 编码。
- 行为变化遵循测试规范：**先改用例反映新行为（红），再改实现（绿）**。
- 门禁：`pnpm lint:check` + `pnpm format:check` + `pnpm type-check` 必须绿；覆盖率本地门槛（lines/functions/statements ≥70%、branches ≥60%），跑 `pnpm coverage`。
- 提交直接落 `main`（单人项目）。提交信息中文，结尾带 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。

---

### Task 1: 分享 URL 纯函数 `share.ts`（L3，新建）

不依赖 Vue/router 的纯函数模块：常量 + 3 个构造 URL 的函数。最易测（零 mock）。

**Files:**

- Create: `src/views/Master/Header/share.ts`
- Test: `src/views/Master/Header/share.spec.ts`

**Interfaces:**

- Produces（Task 2 依赖）：
  - `SITE_ORIGIN: string`（`'https://algo.illegalscreed.cn'`）
  - `GITHUB_REPO_URL: string`（`'https://github.com/IllegalCreed/algorithms-visualization'`）
  - `SHARE_TEXT: string`（`'算法可视化 —— 交互式数据结构与算法可视化'`）
  - `buildShareTargetUrl(fullPath: string): string`
  - `buildWeiboShareUrl(targetUrl: string, text: string): string`
  - `buildXShareUrl(targetUrl: string, text: string): string`

- [ ] **Step 1: 写失败测试 `src/views/Master/Header/share.spec.ts`**

```ts
import { describe, it, expect } from 'vitest';
import {
  SITE_ORIGIN,
  GITHUB_REPO_URL,
  SHARE_TEXT,
  buildShareTargetUrl,
  buildWeiboShareUrl,
  buildXShareUrl,
} from './share';

// TC-SHARE: Master/Header 分享 URL 纯函数（C-009）

describe('Master/Header share 纯函数', () => {
  it('TC-SHARE-01: buildShareTargetUrl 把 fullPath 拼到线上域名后', () => {
    expect(buildShareTargetUrl('/sort/bubble-sort')).toBe(
      'https://algo.illegalscreed.cn/sort/bubble-sort',
    );
  });

  it('TC-SHARE-02: buildShareTargetUrl 保留 query/hash', () => {
    expect(buildShareTargetUrl('/sort/bubble-sort?lang=py')).toBe(
      'https://algo.illegalscreed.cn/sort/bubble-sort?lang=py',
    );
  });

  it('TC-SHARE-03: buildWeiboShareUrl 指向微博分享页且含 url/title', () => {
    const target = 'https://algo.illegalscreed.cn/sort/bubble-sort';
    const url = buildWeiboShareUrl(target, '测试文案');
    expect(url).toContain('https://service.weibo.com/share/share.php?');
    const qs = new URL(url).searchParams;
    expect(qs.get('url')).toBe(target);
    expect(qs.get('title')).toBe('测试文案');
  });

  it('TC-SHARE-04: buildXShareUrl 指向 X 分享页且含 url/text', () => {
    const target = 'https://algo.illegalscreed.cn/sort/bubble-sort';
    const url = buildXShareUrl(target, '测试文案');
    expect(url).toContain('https://twitter.com/intent/tweet?');
    const qs = new URL(url).searchParams;
    expect(qs.get('url')).toBe(target);
    expect(qs.get('text')).toBe('测试文案');
  });

  it('TC-SHARE-05: 链接与中文文案经 URLSearchParams 正确编码（round-trip 还原）', () => {
    const target = 'https://algo.illegalscreed.cn/sort/bubble-sort?a=1&b=2';
    const text = '算法 & 可视化';
    const url = buildWeiboShareUrl(target, text);
    expect(url).toContain('%3A%2F%2F'); // :// 被编码，不破坏外层 URL
    expect(url).not.toContain('算法'); // 中文被百分号编码
    const qs = new URL(url).searchParams;
    expect(qs.get('url')).toBe(target); // 解析回来与原值一致
    expect(qs.get('title')).toBe(text);
  });

  it('TC-SHARE-06: 常量 GITHUB_REPO_URL / SITE_ORIGIN / SHARE_TEXT 校验', () => {
    expect(GITHUB_REPO_URL).toBe('https://github.com/IllegalCreed/algorithms-visualization');
    expect(SITE_ORIGIN).toBe('https://algo.illegalscreed.cn');
    expect(SHARE_TEXT).toBeTruthy();
  });
});
```

- [ ] **Step 2: 跑测试验证失败**

Run: `pnpm test:unit run src/views/Master/Header/share.spec.ts`
Expected: FAIL（`Failed to resolve import './share'` 或函数未定义）

- [ ] **Step 3: 实现 `src/views/Master/Header/share.ts`**

```ts
/** 线上自有域名（selfhost 根部署，base=/）—— 分享链接统一指向这里 */
export const SITE_ORIGIN = 'https://algo.illegalscreed.cn';
/** 本项目 GitHub 仓库（取自 git remote origin） */
export const GITHUB_REPO_URL = 'https://github.com/IllegalCreed/algorithms-visualization';
/** 分享文案：标题 + 一句简介 */
export const SHARE_TEXT = '算法可视化 —— 交互式数据结构与算法可视化';

/** 当前路由 fullPath（不含 base，形如 /sort/bubble-sort）→ 线上规范完整 URL */
export function buildShareTargetUrl(fullPath: string): string {
  return `${SITE_ORIGIN}${fullPath}`;
}

/** 微博分享 intent URL */
export function buildWeiboShareUrl(targetUrl: string, text: string): string {
  const qs = new URLSearchParams({ url: targetUrl, title: text });
  return `https://service.weibo.com/share/share.php?${qs.toString()}`;
}

/** X（原 Twitter）分享 intent URL */
export function buildXShareUrl(targetUrl: string, text: string): string {
  const qs = new URLSearchParams({ url: targetUrl, text });
  return `https://twitter.com/intent/tweet?${qs.toString()}`;
}
```

- [ ] **Step 4: 跑测试验证通过**

Run: `pnpm test:unit run src/views/Master/Header/share.spec.ts`
Expected: PASS（6 passed）

- [ ] **Step 5: 提交**

```bash
git add src/views/Master/Header/share.ts src/views/Master/Header/share.spec.ts
git commit -m "$(cat <<'EOF'
feat(c009): share.ts 分享 URL 纯函数 + L3 用例（TC-SHARE-01..06）

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: `useIconLink` 响应式 + Header key + 两个 spec 的路由 mock（L3 + 回归）

`useIconLink()` 改 `computed` 依赖 `useRoute().fullPath`，三项变为 微博/X/GitHub；`Header.vue` 的 `:key` 改 `item.title`；更新 `hooks.spec.ts` 断言新行为；给 `Header.spec.ts` 补 `useRoute` mock 防崩。

**Files:**

- Modify: `src/views/Master/Header/hooks.ts`
- Modify: `src/views/Master/Header/Header.vue:28`
- Modify: `src/views/Master/Header/hooks.spec.ts`（改写 TC-HOOK-05-1..3）
- Modify: `src/views/Master/Header/Header.spec.ts:10-12`（补 `useRoute`）

**Interfaces:**

- Consumes（来自 Task 1）：`GITHUB_REPO_URL`、`SHARE_TEXT`、`buildShareTargetUrl`、`buildWeiboShareUrl`、`buildXShareUrl`
- Produces：`useIconLink(): ComputedRef<IconLink[]>`，元素顺序 `[微博, X, GitHub]`，`title` 分别为 `'分享到微博'`/`'分享到 X'`/`'GitHub 仓库'`

- [ ] **Step 1: 改写失败测试 `src/views/Master/Header/hooks.spec.ts`（整文件替换）**

```ts
import { describe, it, expect, vi } from 'vitest';
import { useIconLink } from './hooks';

// TC-HOOK-05: Master/Header useIconLink（C-009 起：分享/仓库按钮）

vi.mock('vue-router', () => ({
  useRoute: () => ({ fullPath: '/sort/bubble-sort' }),
}));

describe('Master/Header useIconLink', () => {
  it('TC-HOOK-05-1: 返回 3 项，顺序 微博/X/GitHub，title 为新行为文案', () => {
    const data = useIconLink().value;
    expect(data).toHaveLength(3);
    expect(data.map((d) => d.title)).toEqual(['分享到微博', '分享到 X', 'GitHub 仓库']);
  });

  it('TC-HOOK-05-2: 每项 title/src/url 非空且 url 为 https', () => {
    const data = useIconLink().value;
    for (const item of data) {
      expect(item.title).toBeTruthy();
      expect(item.src).toBeTruthy();
      expect(item.url).toMatch(/^https:\/\//);
    }
  });

  it('TC-HOOK-05-3: 微博/X url 含线上域名+当前 path；GitHub url=仓库地址', () => {
    const [weibo, x, github] = useIconLink().value;
    const target = 'https://algo.illegalscreed.cn/sort/bubble-sort';
    expect(weibo.url).toContain('service.weibo.com/share/share.php');
    expect(new URL(weibo.url).searchParams.get('url')).toBe(target);
    expect(x.url).toContain('twitter.com/intent/tweet');
    expect(new URL(x.url).searchParams.get('url')).toBe(target);
    expect(github.url).toBe('https://github.com/IllegalCreed/algorithms-visualization');
  });
});
```

- [ ] **Step 2: 跑测试验证失败**

Run: `pnpm test:unit run src/views/Master/Header/hooks.spec.ts`
Expected: FAIL（旧 `hooks.ts` 返回数组而非 ComputedRef，`useIconLink().value` 为 undefined；title 为 github/twitter/新浪微博）

- [ ] **Step 3: 改实现 `src/views/Master/Header/hooks.ts`（整文件替换）**

```ts
import { computed, type ComputedRef } from 'vue';
import { useRoute } from 'vue-router';
import type { IconLink } from './IconLink/types';
import weiboIcon from '@/assets/weibo.svg';
import githubIcon from '@/assets/github.svg';
import twitterIcon from '@/assets/twitter.svg';
import {
  GITHUB_REPO_URL,
  SHARE_TEXT,
  buildShareTargetUrl,
  buildWeiboShareUrl,
  buildXShareUrl,
} from './share';

export function useIconLink(): ComputedRef<IconLink[]> {
  const route = useRoute();
  return computed(() => {
    const target = buildShareTargetUrl(route.fullPath);
    return [
      { title: '分享到微博', src: weiboIcon, url: buildWeiboShareUrl(target, SHARE_TEXT) },
      { title: '分享到 X', src: twitterIcon, url: buildXShareUrl(target, SHARE_TEXT) },
      { title: 'GitHub 仓库', src: githubIcon, url: GITHUB_REPO_URL },
    ];
  });
}
```

- [ ] **Step 4: 改 `src/views/Master/Header/Header.vue` 第 28 行的 key**

把：

```html
<IconLinkComp v-for="item in iconLinkData" :key="item.url" :data="item" />
```

改为（`iconLinkData` 现是 ComputedRef，模板顶层自动解包；分享 url 随路由变，title 才是稳定 key）：

```html
<IconLinkComp v-for="item in iconLinkData" :key="item.title" :data="item" />
```

> `<script>` 里 `const iconLinkData = useIconLink();` 不变。

- [ ] **Step 5: 给 `src/views/Master/Header/Header.spec.ts` 补 `useRoute` mock**

把第 10-12 行：

```ts
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));
```

改为（Header 经 `useIconLink()` 新依赖 `useRoute()`，不补则 mount 时 `useRoute` 为 undefined → 7 个用例全崩）：

```ts
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
  useRoute: () => ({ fullPath: '/' }),
}));
```

- [ ] **Step 6: 跑三个测试文件验证全绿（含 IconLink 零回归）**

Run: `pnpm test:unit run src/views/Master/Header/hooks.spec.ts src/views/Master/Header/Header.spec.ts src/views/Master/Header/IconLink/IconLink.spec.ts`
Expected: PASS（hooks 3 + Header 7 + IconLink 6 = 16 passed）

- [ ] **Step 7: 提交**

```bash
git add src/views/Master/Header/hooks.ts src/views/Master/Header/Header.vue src/views/Master/Header/hooks.spec.ts src/views/Master/Header/Header.spec.ts
git commit -m "$(cat <<'EOF'
feat(c009): useIconLink 响应式分享链接 + Header key/mock，TC-HOOK-05 行为更新

- useIconLink 改 computed 依赖 route.fullPath，三项 微博/X/GitHub
- 微博/X 拼分享 intent URL，GitHub 打开本仓库
- Header.vue key 改 title；Header.spec.ts 补 useRoute mock 防崩

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: 全量回归 + 门禁 + 文档回写 + 状态推进

确认全量测试零回归、覆盖率/门禁达标；把 `TC-SHARE-*` 登记进三索引、更新 `TC-HOOK-05-*` 描述；四文档状态块 → verified、`docs/plans/index.md` 状态/完成度回写。

**Files:**

- Modify: `docs/test-cases/index.md`、`docs/test-cases/by-layer.md`、`docs/test-cases/by-module.md`
- Modify: `docs/plans/index.md`
- Modify: 本 plan 四文档（requirements/design/test-cases/implementation）状态块

- [ ] **Step 1: 全量单测 + 覆盖率**

Run: `pnpm coverage`
Expected: 全部 passed（含冒泡/选择/插入与 master 全量）；覆盖率 lines/functions/statements ≥70%、branches ≥60%

- [ ] **Step 2: 三门禁**

Run: `pnpm lint:check && pnpm format:check && pnpm type-check`
Expected: 三条均无错误退出

> 若 `format:check` 报错，先跑 `pnpm format` 再 `git add` 重提。

- [ ] **Step 3: 回写 `docs/test-cases/index.md`**

在 `TC-HOOK-05-3` 行之后追加 6 行（照该表 8 列格式）：

```
| TC-SHARE-01 | buildShareTargetUrl 拼线上域名 + fullPath | master / share | C-20260622-009 | L3 | `src/views/Master/Header/share.spec.ts` | active | 2026-06-22 |
| TC-SHARE-02 | buildShareTargetUrl 保留 query/hash | master / share | C-20260622-009 | L3 | `src/views/Master/Header/share.spec.ts` | active | 2026-06-22 |
| TC-SHARE-03 | buildWeiboShareUrl 指向微博分享页含 url/title | master / share | C-20260622-009 | L3 | `src/views/Master/Header/share.spec.ts` | active | 2026-06-22 |
| TC-SHARE-04 | buildXShareUrl 指向 X 分享页含 url/text | master / share | C-20260622-009 | L3 | `src/views/Master/Header/share.spec.ts` | active | 2026-06-22 |
| TC-SHARE-05 | 链接与中文文案经 URLSearchParams 正确编码 | master / share | C-20260622-009 | L3 | `src/views/Master/Header/share.spec.ts` | active | 2026-06-22 |
| TC-SHARE-06 | 常量 GITHUB_REPO_URL / SITE_ORIGIN 校验 | master / share | C-20260622-009 | L3 | `src/views/Master/Header/share.spec.ts` | active | 2026-06-22 |
```

并把 `TC-HOOK-05-1..3` 三行更新为新行为（标题加「（C-009 改写）」、Owner Plan → `C-20260622-009`、最后验证 → `2026-06-22`）：

```
| TC-HOOK-05-1 | 返回 3 项 微博/X/GitHub，title 为分享/仓库文案（C-009 改写） | master / icon-hook | C-20260622-009 | L3 | `src/views/Master/Header/hooks.spec.ts` | active | 2026-06-22 |
| TC-HOOK-05-2 | 每项 title/src/url 非空且 url 为 https（C-009 改写） | master / icon-hook | C-20260622-009 | L3 | `src/views/Master/Header/hooks.spec.ts` | active | 2026-06-22 |
| TC-HOOK-05-3 | 微博/X url 含线上域名+当前 path；GitHub=仓库地址（C-009 改写） | master / icon-hook | C-20260622-009 | L3 | `src/views/Master/Header/hooks.spec.ts` | active | 2026-06-22 |
```

- [ ] **Step 4: 回写 `docs/test-cases/by-layer.md`**

在 L3 区新增分组（放在 `### hooks` 分组之后），表头与该文件其它 L3 表一致（`| Case ID | 标题 | 自动化路径 |`）：

```
### share（C-009）

| Case ID     | 标题                                       | 自动化路径                              |
| ----------- | ------------------------------------------ | --------------------------------------- |
| TC-SHARE-01 | buildShareTargetUrl 拼线上域名 + fullPath  | `src/views/Master/Header/share.spec.ts` |
| TC-SHARE-02 | buildShareTargetUrl 保留 query/hash        | `src/views/Master/Header/share.spec.ts` |
| TC-SHARE-03 | buildWeiboShareUrl 指向微博分享页          | `src/views/Master/Header/share.spec.ts` |
| TC-SHARE-04 | buildXShareUrl 指向 X 分享页               | `src/views/Master/Header/share.spec.ts` |
| TC-SHARE-05 | 链接与中文文案经 URLSearchParams 编码      | `src/views/Master/Header/share.spec.ts` |
| TC-SHARE-06 | 常量 GITHUB_REPO_URL / SITE_ORIGIN 校验    | `src/views/Master/Header/share.spec.ts` |
```

并把 `### hooks` 分组里 `TC-HOOK-05-1..3` 三行标题更新为新行为（同 Step 3 标题，去掉后 3 列只留「标题 / 自动化路径」两列对应内容）。

- [ ] **Step 5: 回写 `docs/test-cases/by-module.md`**

在 `## master（全局框架 Header）` 组的表内（`TC-HOOK-05-3` 行之后）追加 6 行（照该组 3 列格式 `| Case ID | 标题 | 层级 | 自动化路径 |`）：

```
| TC-SHARE-01 | buildShareTargetUrl 拼线上域名 + fullPath（C-009） | L3 | `src/views/Master/Header/share.spec.ts` |
| TC-SHARE-02 | buildShareTargetUrl 保留 query/hash（C-009） | L3 | `src/views/Master/Header/share.spec.ts` |
| TC-SHARE-03 | buildWeiboShareUrl 指向微博分享页（C-009） | L3 | `src/views/Master/Header/share.spec.ts` |
| TC-SHARE-04 | buildXShareUrl 指向 X 分享页（C-009） | L3 | `src/views/Master/Header/share.spec.ts` |
| TC-SHARE-05 | 链接与中文文案经 URLSearchParams 编码（C-009） | L3 | `src/views/Master/Header/share.spec.ts` |
| TC-SHARE-06 | 常量 GITHUB_REPO_URL / SITE_ORIGIN 校验（C-009） | L3 | `src/views/Master/Header/share.spec.ts` |
```

并把该组 `TC-HOOK-05-1..3` 标题更新为新行为（标注「（C-009 改写）」）。

- [ ] **Step 6: 四文档状态块 + `docs/plans/index.md` 推进 verified**

- 本 plan 四文档（requirements/design/test-cases/implementation）状态块 `Status: draft|approved` → `verified`，`Progress: 0%` → `100%`，`Next action: 已完成`。
- `docs/plans/index.md`：C-20260622-009 在「All Changes」「By Type→feature」「By Module→home / docs-shell」三处的 `状态` → `verified`、`完成度` → `100%`、「下一步」→ `已完成`。

- [ ] **Step 7: 提交**

```bash
git add docs/
git commit -m "$(cat <<'EOF'
docs(c009): 回写测试三索引（TC-SHARE + TC-HOOK-05 更新）+ plans 状态 verified

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Self-Review（写计划后自检）

**1. Spec coverage（对 requirements「要做什么」逐条）**

- ① GitHub 开本仓库 → Task 1 `GITHUB_REPO_URL` 常量 + Task 2 GitHub 项 `url`。
- ② 微博/X 拼分享 intent URL（线上域名+path+文案）→ Task 1 三个 build 函数 + Task 2 微博/X 项。
- ③ 抽纯函数模块 `share.ts` → Task 1。
- ④ `useIconLink` 改响应式 → Task 2 `computed` + `useRoute`。
- ⑤ 测试与文档 → Task 1/2 测试 + Task 3 三索引/plans 回写。

**2. 对现有测试的影响（对 design §5 逐条）**

- `TC-VIEW-ICONLINK-*` 零回归 → Task 2 Step 6 一并跑绿。
- `TC-VIEW-HEADER-*` 补 `useRoute` mock → Task 2 Step 5。
- `TC-HOOK-05-*` 行为更新 → Task 2 Step 1（先红）+ Step 3（绿）。

**3. Placeholder scan：** 无 TBD/TODO；每个 code step 均含完整代码。

**4. Type consistency：** `useIconLink(): ComputedRef<IconLink[]>` 在 Task 2 接口与实现、`hooks.spec.ts` 的 `.value` 用法一致；三个 build 函数签名在 Task 1 测试/实现/接口三处一致；`IconLink`（`{ url, src, title }`）沿用 `IconLink/types.ts` 未改。
