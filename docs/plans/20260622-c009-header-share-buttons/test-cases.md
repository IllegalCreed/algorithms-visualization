# 测试用例：头部分享/仓库按钮（微博 / X / GitHub）

> Status: verified
> Stable ID: C-20260622-009
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-22
> Last reviewed: 2026-06-22
> Progress: 100%
> Blocked by: none
> Next action: 已完成（6 个 TC-SHARE + 3 个 TC-HOOK-05 已登记三索引并置 active）
> Replaces: none
> Replaced by: none
> Related plans: none
> Related tests: `docs/test-cases/index.md`
> Related requirement: requirements.md

## 说明

本变更**产出**一批 L3 纯函数用例（`TC-SHARE-*`，新建文件），并**更新**一批既有 hooks 用例（`TC-HOOK-05-*`，行为变化）。`TC-VIEW-ICONLINK-*`（L4 组件）**不改**，作为「组件点击模型零回归」的证据一并跑绿。

测试分层裁剪为 L3（前端单元，纯函数 / composable）/ L4（前端组件，已存在不改）。本变更无 L5（不引入新页面 / 新交互流，e2e 价值低）。

> 按测试规范，`TC-HOOK-05-*` 是行为变化：**先改用例（红）再改实现（绿）**。`TC-SHARE-*` 标准 TDD：先红后绿。

## 汇总统计（计划）

| 层级 | 测试文件                             | 新增 Case | 更新 Case                     | 运行命令         |
| ---- | ------------------------------------ | --------- | ----------------------------- | ---------------- |
| L3   | `share.spec.ts`（新建）              | 6         | 0                             | `pnpm test:unit` |
| L3   | `hooks.spec.ts`（改写）              | 0         | 3                             | `pnpm test:unit` |
| L4   | `IconLink.spec.ts`（不动）           | 0         | 0（零回归验证）               | `pnpm test:unit` |
| L4   | `Header.spec.ts`（补 useRoute mock） | 0         | 0（断言不变，仅补 mock 防崩） | `pnpm test:unit` |
| 合计 | 3 改/建                              | 6         | 3                             | —                |

## 全量 Case 清单（计划）

### L3 — 分享 URL 纯函数（`src/views/Master/Header/share.spec.ts`，新建）

| Case ID     | 标题                                                                                         |
| ----------- | -------------------------------------------------------------------------------------------- |
| TC-SHARE-01 | `buildShareTargetUrl` 把 fullPath 拼到线上域名后（`https://algo.illegalscreed.cn` + path）   |
| TC-SHARE-02 | `buildShareTargetUrl` 保留 query/hash（如 `/sort/bubble-sort?lang=py` 原样带上）             |
| TC-SHARE-03 | `buildWeiboShareUrl` 指向 `service.weibo.com/share/share.php`，含 `url` 与 `title` 参数      |
| TC-SHARE-04 | `buildXShareUrl` 指向 `twitter.com/intent/tweet`，含 `url` 与 `text` 参数                    |
| TC-SHARE-05 | 链接与中文文案经 `URLSearchParams` 正确百分号编码（中文 / `:` / `/` / `?` / `&` 不破坏 URL） |
| TC-SHARE-06 | 常量校验：`GITHUB_REPO_URL` 指向本仓库、`SITE_ORIGIN` 为 `https://algo.illegalscreed.cn`     |

### L3 — useIconLink composable（`src/views/Master/Header/hooks.spec.ts`，改写）

> 用 `vi.mock('vue-router')` 提供固定 `route.fullPath`（如 `/sort/bubble-sort`）。

| Case ID      | 标题（更新后）                                                                                                             |
| ------------ | -------------------------------------------------------------------------------------------------------------------------- |
| TC-HOOK-05-1 | 返回 3 项，顺序为 微博 / X / GitHub，title 分别为 `分享到微博` / `分享到 X` / `GitHub 仓库`                                |
| TC-HOOK-05-2 | 每项 title/src/url 均非空，url 均为 https                                                                                  |
| TC-HOOK-05-3 | 微博 / X 项 url 含线上域名 + 当前 path（`algo.illegalscreed.cn` 与编码后的 `/sort/bubble-sort`）；GitHub 项 url = 仓库地址 |

### L4 — 组件回归（不新增 Case，跑绿即可）

| Case ID                 | 文件                        | 处理                                                                                                                                                                                               |
| ----------------------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TC-VIEW-ICONLINK-01..06 | `IconLink/IconLink.spec.ts` | **零改动**，跑绿即证明组件点击模型（`window.open(url)`）未回归                                                                                                                                     |
| TC-VIEW-HEADER-01..07   | `Header.spec.ts`            | Header 经 `useIconLink()` 新依赖 `useRoute()`；该文件 `vi.mock('vue-router')` 仅导出 `useRouter`，**须补 `useRoute: () => ({ fullPath: '/' })`**，否则 7 用例全崩。断言不变（HEADER-06 仍数 3 个） |

## 全量 Case 列表（落地后）

落地后把 `TC-SHARE-*` 登记进 `docs/test-cases/index.md`（主索引）、`by-layer.md`（L3 组）、`by-module.md` 的 **`master（全局框架 Header）` 组**；`TC-HOOK-05-*` 在三索引中的标题/描述同步更新为新行为（旧描述「github/twitter/微博」「https 首页」改为新行为）。
