# 设计：头部分享/仓库按钮（微博 / X / GitHub）

> Status: draft
> Stable ID: C-20260622-009
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-22
> Last reviewed: 2026-06-22
> Progress: 0%
> Blocked by: none
> Next action: 写 implementation.md 后实现
> Replaces: none
> Replaced by: none
> Related plans: none
> Related tests: 见 §5「对现有测试的影响」
> Related requirement: requirements.md

## 总体方案

**点击行为本质不变** —— `IconLink.vue` 始终 `window.open(props.data.url)`。变的只有「`url` 从哪来」：把它从 `hooks.ts` 里的三个写死字符串，改为

1. GitHub 项 = 一个常量（本仓库地址）；
2. 微博 / X 项 = 由**纯函数**基于「线上域名 + 当前路由 `fullPath`」实时构造的分享 intent URL。

为此把 URL 构造逻辑收敛到一个**不依赖 Vue / router 的纯函数模块** `share.ts`（最易做 L3 单测，零 mock），`useIconLink()` 仅负责把当前路由喂给纯函数并用 `computed` 保持响应式。

### 方案选择（已确认方案 A）

| 方案          | 做法                                                                                                        | 取舍                                              |
| ------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| **A（采纳）** | 抽 `share.ts` 纯函数 + `useIconLink()` 改 `computed`（依赖 `useRoute().fullPath`）；**IconLink 组件零改动** | 纯函数 L3 零 mock；组件不动 → L4 零回归；职责清晰 |
| B             | 给数据加 `kind` 字段，组件内按类型分流行为                                                                  | 行为逻辑塞进组件，耦合升高                        |
| C             | `url` 改为 `string \| (() => string)`，点击时求值                                                           | 类型变复杂，组件须改                              |

采纳 A：点击模型不变，唯一变化（url 来源）被隔离到可独立测试的纯函数里。

## 1. 纯函数模块 `src/views/Master/Header/share.ts`（新增）

常量：

```ts
/** 线上自有域名（selfhost 根部署，base=/）—— 分享链接统一指向这里 */
export const SITE_ORIGIN = 'https://algo.illegalscreed.cn';
/** 本项目 GitHub 仓库（取自 git remote origin） */
export const GITHUB_REPO_URL = 'https://github.com/IllegalCreed/algorithms-visualization';
/** 分享文案：标题 + 一句简介 */
export const SHARE_TEXT = '算法可视化 —— 交互式数据结构与算法可视化';
```

纯函数（均无副作用、可直接断言）：

```ts
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

要点：

- `fullPath` 由 vue-router 保证以 `/` 开头，与 `SITE_ORIGIN` 直接拼接安全，无需处理斜杠。
- `URLSearchParams` 自动对 `targetUrl`（含 `:` `/` `?` 等）与中文 `text` 做百分号编码。
- 微博参数名是 `title`，X 是 `text`，二者刻意分开两个函数而非合并，保留各平台差异、避免过早抽象。

## 2. `src/views/Master/Header/hooks.ts`（改造）

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

变化点：

- 返回类型 `IconLink[]` → `ComputedRef<IconLink[]>`，导航后微博/X 的 `url` 自动重算。
- 顺序按用户口述「微博、X、GitHub」。
- `title` 改为表达行为的 hover 提示（`分享到微博` / `分享到 X` / `GitHub 仓库`）。

## 3. `src/views/Master/Header/Header.vue`（微调）

```diff
- <IconLinkComp v-for="item in iconLinkData" :key="item.url" :data="item" />
+ <IconLinkComp v-for="item in iconLinkData" :key="item.title" :data="item" />
```

- `iconLinkData` 现在是 `ComputedRef`，模板顶层自动解包，`v-for` 写法不变。
- `:key` 由 `item.url` 改为 `item.title`：分享 url 随路由变化，title 才是稳定 key。

## 4. 不改的件

- `IconLink/IconLink.vue`、`IconLink/types.ts` —— **零改动**。点击仍 `window.open(props.data.url)`。

## 数据流

```
用户导航到某算法页
  → route.fullPath 变（如 /sort/bubble-sort?lang=py）
  → useIconLink() 的 computed 重算
      target = SITE_ORIGIN + fullPath
             = https://algo.illegalscreed.cn/sort/bubble-sort?lang=py
      微博项.url = buildWeiboShareUrl(target, SHARE_TEXT)
      X 项.url   = buildXShareUrl(target, SHARE_TEXT)
      GitHub 项.url = GITHUB_REPO_URL（恒定）
  → 用户点某按钮 → IconLink window.open(url)
      微博/X → 平台分享页（预填链接 + 文案）
      GitHub → 本项目仓库
```

## 5. 对现有测试的影响

| 现有用例                                                    | 影响                                                                                                                                                        | 处理                                                                                           |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `TC-VIEW-ICONLINK-01..06`（`IconLink.spec.ts`）             | **无**（组件未改）                                                                                                                                          | 不动，作为零回归证据                                                                           |
| `TC-VIEW-HEADER-01..07`（`Header.spec.ts`）                 | **间接受影响**：Header 经 `useIconLink()` 新依赖 `useRoute()`，但该文件现有 `vi.mock('vue-router')` 只导出 `useRouter`、缺 `useRoute` → 不补则 7 个用例全崩 | **补 mock** `useRoute: () => ({ fullPath: '/' })`；断言不变（HEADER-06 仍只数 3 个 icon-link） |
| `TC-HOOK-05-1`（返 3 项、title 含 github/twitter/新浪微博） | **行为变化**：title 变为 分享到微博/分享到 X/GitHub 仓库；顺序变                                                                                            | 更新断言                                                                                       |
| `TC-HOOK-05-2`（每项 title/src/url 非空）                   | 基本不变，但调用方式变（需 router 上下文）                                                                                                                  | 在 mock 路由下复测                                                                             |
| `TC-HOOK-05-3`（所有 url 为 https 首页）                    | **行为变化**：微博/X url 现为分享 intent、GitHub 为仓库地址                                                                                                 | 改为断言「微博/X url 含 `algo.illegalscreed.cn`+当前 path、GitHub url=仓库地址」               |

`useIconLink()` 现依赖 `useRoute()`，更新后的 `hooks.spec.ts` 用 `vi.mock('vue-router')` 提供固定 `route.fullPath` 再断言。**同理 `Header.spec.ts` 的 `vi.mock('vue-router')` 必须补上 `useRoute` 导出**（它 mount 真实 Header，会触发 `useIconLink()→useRoute()`）。纯 URL 构造逻辑已下沉到 `share.ts`，主力断言放在零依赖的 `TC-SHARE-*`。

> 按测试规范：`TC-HOOK-05-*` 属行为变化，**先改用例反映新行为（红），再改 `hooks.ts`（绿）**。

## 6. 任务分解（概览，细节见 implementation.md）

1. **Task 1（L3 纯函数 TDD）**：写 `share.spec.ts`（`TC-SHARE-*` 红）→ 实现 `share.ts`（绿）。
2. **Task 2（L3 hooks 行为变更 TDD）**：改 `hooks.spec.ts`（`TC-HOOK-05-*` 反映新行为，红）→ 改 `hooks.ts`（绿）→ 改 `Header.vue` 的 key。
3. **Task 3（回归 + 文档）**：跑全量单测（确认 `TC-VIEW-ICONLINK-*` 零回归）+ lint/format/type-check + 覆盖率；回写三索引与 `index.md`，状态推进 verified。
