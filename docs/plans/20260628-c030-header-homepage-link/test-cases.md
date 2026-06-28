# 测试用例：头部「个人主页」外链（C-030）

> Status: verified
> Stable ID: C-20260628-030
> Owner: IllegalCreed
> Created: 2026-06-28
> Last reviewed: 2026-06-28
> Related implementation: ./implementation.md

## 本次用例（2 新 + 2 改）

| Case ID           | 层级 | 标题                                            | 自动化路径                               | 状态 |
| ----------------- | ---- | ----------------------------------------------- | ---------------------------------------- | ---- |
| TC-SHARE-07       | L3   | 常量 `HOME_PAGE_URL` 为作者个人主页 https 链接  | `src/views/Master/Header/share.spec.ts`  | 新增 |
| TC-HOOK-05-4      | L3   | 个人主页项 url 指向 `HOME_PAGE_URL`             | `src/views/Master/Header/hooks.spec.ts`  | 新增 |
| TC-HOOK-05-1      | L3   | 返回 **4 项** 微博/X/GitHub/个人主页（原 3 项） | `src/views/Master/Header/hooks.spec.ts`  | 改写 |
| TC-VIEW-HEADER-06 | L4   | 渲染 **4 个** icon-link 含个人主页（原 3 个）   | `src/views/Master/Header/Header.spec.ts` | 改写 |

## 零回归

`TC-HOOK-05-2 / 05-3`、`TC-SHARE-01..06`、`TC-VIEW-ICONLINK-*`、其余 `TC-VIEW-HEADER-*` 全部保持绿——IconLink 点击模型、微博/X/GitHub 三项行为未动。

## 结果

全量 `pnpm test:unit run`：**663 passed**（97 文件）。覆盖率本地门槛达标（新增项随既有 Header 用例覆盖）。
