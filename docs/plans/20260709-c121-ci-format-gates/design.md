# 设计：CI 与格式门禁补强（C-20260709-121）

> Status: verified
> Stable ID: C-20260709-121
> Owner: IllegalCreed
> Created: 2026-07-09
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 格式脚本范围

不使用 `prettier --check .`，因为仓库根部存在 `.remember/`、`.superpowers/` 等本地记忆目录，整仓库扫描会把非项目文件纳入门禁。脚本改为显式列出项目文件范围：

- `src/`
- `docs/`
- `e2e/`
- `public/`
- `.github/workflows/`
- 根部 `*.html`、`*.json`、`*.md`、`*.ts`、`.prettierrc.json`

脚本使用 `--ignore-unknown`，避免图片等不可格式化资产成为错误。

## CI 单元测试

在 Pages build job 中把 `pnpm test:unit:run` 放到 `type-check` 后、`build-only` 前：

1. lint / format / type-check 先挡住静态错误；
2. unit test 再验证 L3/L4 行为；
3. build-only 最后产出 `dist/` 与 `404.html`。

Playwright e2e 暂不进入 Pages CI。它依赖 dev server 和浏览器，维护期先保留为本地全门禁与发版前验证，避免每次 Pages 部署耗时大幅增加。

## 404.html

只做 Prettier 排版，不改 `pathSegmentsToKeep = 1`、路径切片、query/hash 还原逻辑。该文件仍由 `pnpm build-only` 复制进 `dist/`。

## 变更历史

- 2026-07-09：创建（implemented）。
- 2026-07-09：目标门禁通过（implemented → verified）。
