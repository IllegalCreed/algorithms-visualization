# 实现记录：头部「个人主页」外链（C-030）

> Status: verified
> Stable ID: C-20260628-030
> Owner: IllegalCreed
> Created: 2026-06-28
> Last reviewed: 2026-06-28
> Related design: ./design.md

## 落地文件

- `src/assets/homepage.svg`（新）：`<svg viewBox="0 0 24 24">` + Material `person` 单 path。
- `src/views/Master/Header/share.ts`：`export const HOME_PAGE_URL = 'https://illegalscreed.cn/zh/';`
- `src/views/Master/Header/hooks.ts`：import `homepageIcon`、`HOME_PAGE_URL`；返回数组末追加 `{ title: '个人主页', src: homepageIcon, url: HOME_PAGE_URL }`。
- 三个 spec：见 test-cases.md。

## TDD 过程

1. **RED**：先改 `hooks.spec.ts`（4 项 + 顺序含个人主页）+ `share.spec.ts`（TC-SHARE-07）→ 跑测试，`TC-HOOK-05-1`（期望 4 实得 3）、`TC-SHARE-07`（HOME_PAGE_URL undefined）按预期失败，其余 9 项绿。
2. **GREEN**：加 homepage.svg + share 常量 + hooks 数组项 → Header 目录 24 用例转绿。
3. 组件层 `TC-VIEW-HEADER-06` 因渲染数 3→4 失败 → 对齐为 4 + 补 `homepage.svg` mock + 断言「个人主页」项存在 → 绿。

## 验证

- 全量单测：**663 passed**（97 文件；较基线 661 +2 = TC-SHARE-07 + TC-HOOK-05-4）。
- 门禁：type-check ✓ / lint ✓ / format ✓ / build ✓。
- 真机自检（dev 5180）：`#header .icon-link` 共 **4** 项，末项 `title=个人主页`、`img=homepage.svg`；截图确认四图标黑色剪影并排、风格一致、大小相同。

## 已知 / 后续

- `IconLink.vue` 的 `window.open` 未显式带 `noopener`（既有模式，四项一致，默认已断 opener）；若后续统一加固可单开一项。
