# 设计：头部「个人主页」外链（C-030）

> Status: verified
> Stable ID: C-20260628-030
> Owner: IllegalCreed
> Created: 2026-06-28
> Last reviewed: 2026-06-28
> Related requirement: ./requirements.md

## 改动总览

| 文件                               | 改动                                                                    |
| ---------------------------------- | ----------------------------------------------------------------------- |
| `src/views/Master/Header/share.ts` | 新增常量 `HOME_PAGE_URL`                                                |
| `src/views/Master/Header/hooks.ts` | import `homepageIcon` + `HOME_PAGE_URL`；返回数组末尾追加「个人主页」项 |
| `src/assets/homepage.svg`          | 新增单色人像剪影图标                                                    |
| `…/share.spec.ts`                  | 新增 TC-SHARE-07                                                        |
| `…/hooks.spec.ts`                  | 改 TC-HOOK-05-1（3→4）、新增 TC-HOOK-05-4                               |
| `…/Header.spec.ts`                 | 改 TC-VIEW-HEADER-06（3→4，补 homepage.svg mock + 断言个人主页项）      |

## 关键决策

1. **复用 IconLink 模型**：`IconLink.vue` 仍 `window.open(props.data.url)` 单参数，**零组件改动**；新项只是 `useIconLink()` 数组多一条，渲染走既有 `v-for`。
2. **url 用常量而非纯函数**：个人主页是固定地址（同 `GITHUB_REPO_URL`），无需像微博/X 那样按 `route.fullPath` 拼，直接常量，不抽 `buildHomePageUrl()`（YAGNI）。
3. **图标**：Material Design `person` 实心剪影（`viewBox 0 0 24 24`，单 path）。语义「个人 = 人像」最贴「个人主页」；微博/X/GitHub 本就是第三方图标，viewBox 不同不影响——`IconLink.vue` 用 `<img>` 统一缩放至 30px。
4. **位置**：放 GitHub 之后（数组末）。语义与 GitHub 同为「作者 / 项目导向」外链；工程上保留既有 `[weibo, x, github]` 解构断言（TC-HOOK-05-3）零回归。

## 安全

- `HOME_PAGE_URL` 为编译期静态常量，无用户输入参与，无 URL 注入面。
- `window.open(url)`（不带 windowName/features）在现代浏览器默认令新标签 `window.opener === null`，反向标签劫持（reverse tabnabbing）不适用；与既有微博/X/GitHub 三项同模型，未引入新风险。`noopener` 统一加固属既有 IconLink 议题，不在本次范围。

## 不做

- 不抽 `buildHomePageUrl()`（无参可拼）。
- 不动 IconLink / Header 样式与布局。
