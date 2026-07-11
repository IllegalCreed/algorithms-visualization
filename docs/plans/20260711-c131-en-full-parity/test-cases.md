# 测试用例：英文目录全量对齐

> Status: verified
> Stable ID: C-20260711-131
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-11
> Last reviewed: 2026-07-11
> Progress: 100%
> Blocked by: none
> Next action: 继续 C127 T3-B GitHub CLI typed client 与授权健康检查红测
> Replaces: none
> Replaced by: none
> Related plans: C-20260711-126、C-20260711-130、C-20260711-127、C-20260710-124
> Related tests: TC-I18N-CATALOG-131-_、TC-I18N-STRUCT-131-_、TC-I18N-MODULE-131-_、TC-I18N-CONTENT-131-_、TC-SEO-I18N-131-_、TC-I18N-UI-131-_、TC-I18N-BUILD-131-_、TC-E2E-I18N-131-_
> Related requirement: requirements.md

## 用例计划

| 层级  | Case ID 区间                                    | 数量 | 目标                                                               |
| ----- | ----------------------------------------------- | ---- | ------------------------------------------------------------------ |
| L3    | TC-I18N-CATALOG-131-01..12                      | 12   | 95/15/77/2/1、唯一性、94 loader/route、92 learning pages、全量切换 |
| L3/L4 | TC-I18N-STRUCT-131-A01..A03、B01..B02、C01..C02 | 7    | 20 个 Viz 英文 copy/交互、默认中文零回归与 15 个英文 SFC           |
| L3    | TC-I18N-MODULE-131-00..01、D01、D02、D02A、D03  | 6    | 77 adapter 集合与 50 个增量 adapter 的结构、无 Han、源码/lineMap   |
| L4    | TC-I18N-CONTENT-131-01..02                      | 2    | 50 个播放器 SFC/loader 完整、英文正文非薄                          |
| L3    | TC-SEO-I18N-131-01..02                          | 2    | 190 页 registry 与 95 组完整 alternate                             |
| L4    | TC-I18N-UI-131-01..08                           | 8    | Home/Menu/Search 94、Complexity/Paths 92、轨标签、head 与目录顺序  |
| build | TC-I18N-BUILD-131-01..02                        | 2    | production/selfhost 190 页与 sitemap/llms/manifest/静态正文门禁    |
| L5    | TC-E2E-I18N-131-01..07                          | 7    | 全目录、工具、切换、搜索、互动页、播放器无 Han 与 900px            |
| 合计  |                                                 | 46   | 参数化 Case 覆盖全部 65 个新增页面和 77 个 adapter                 |

## Catalog Case

1. `TC-I18N-CATALOG-131-01`：95 组恰为 1 Home、2 工具、15 structure、77 algorithm。
2. `TC-I18N-CATALOG-131-02`：中英 name/path 全局唯一，英文路径均在 `/en` 下。
3. `TC-I18N-CATALOG-131-03`：92 个 learning page 中文 key 与 Home 中文目录集合全等。
4. `TC-I18N-CATALOG-131-04`：94 个英文非 Home catalog、loader 与 router 集合双向全等。
5. `TC-I18N-CATALOG-131-05`：九大类数量与中文目录逐类一致，工具组另含 2 页。
6. `TC-I18N-CATALOG-131-06`：92 个 learning page 均有 icon、complexity、path metadata。
7. `TC-I18N-CATALOG-131-07`：学习路径覆盖 92 个 learning page 至少一次，链接均存在。
8. `TC-I18N-CATALOG-131-08`：95 组中英切换保留 query 并进入对应 route。

## 互动页 Case

互动组件与页面由七个参数化 Case 覆盖：

- `01`：英文页面与 Viz 初始 DOM 不含 Han，按钮、空态、输入提示和 SVG 标签为英文。
- `02`：执行该批代表性关键操作后，英文状态仍无 Han，数据结果与中文状态机一致。
- `03`：不传 locale 时既有中文文案和交互断言保持不变。
- B/C 组补充 15 个 structure metadata、路径、loader 与完整英文 SFC 守护。

## Module Case

50 个新增 adapter 由共享参数化 Case 一次覆盖全部八批：

- `01`：该批英文 adapter key 与预期中文 route 集合全等。
- `02`：同输入下中英步骤数、point、轨快照和最终状态一致。
- `03`：title/hint/caption/vars/quiz/source comments 无 Han，lineMap 与源码行数保持有效。
- 既有 C130 adapter Case 继续覆盖首 27 个 adapter 的 input/quiz 语义；C131 map Case 保证最终 77 项全集。

## 内容与 SEO Case

- 65 个新增 SFC 必须存在且 loader 可静态解析；算法页含 `AlgorithmPlayer locale="en"`，互动页显式给 Viz 传英文 locale。
- 页面正文遵循 `docs/i18n/english-style-guide.md`，至少包含一个有效英文内部链接。
- registry 为 190 页，95 对页面全部拥有三条 alternate；canonical、sitemap 与目录静态入口保持尾斜杠一致。
- 英文构建产物在初始渲染和代表性交互后均通过 Han 门禁。

## TDD 顺序

1. T0 先把 C130 的 30/29/27/125 断言升级为 95/94/92/190，确认现状按预期失败。
2. A-K 每批只推进本批预期；先红后补 catalog、adapter/Viz、SFC 与链接到全绿。
3. 每批结束运行现有 C126/C130 定向回归，禁止把红测留给下一批。
4. 最终运行全量 Vitest、coverage、Playwright、production/selfhost 与线上双轨验证。

## 当前结果

| Case 范围                          | 结果   | 日期       | 说明                                                       |
| ---------------------------------- | ------ | ---------- | ---------------------------------------------------------- |
| C131 L3/L4                         | passed | 2026-07-11 | 297 文件 / 2118 用例全绿；coverage 四项均超过仓库门槛      |
| TC-E2E-I18N-131-01..07             | passed | 2026-07-11 | 全量 Playwright 104 文件 / 117 用例全绿                    |
| TC-I18N-BUILD-131-01..02           | passed | 2026-07-11 | production/selfhost 各 190 页预渲染与 SEO 产物验证通过     |
| GitHub Pages / selfhost 线上 smoke | passed | 2026-07-11 | Pages run `29145907250`；自有域代表页 200、sitemap 190 URL |

## 变更历史

- 2026-07-11：建立 80 个精确 Case 计划；等待 T0 先红后绿实施。
- 2026-07-11：按实际参数化实现收束为 46 个显式 Case，覆盖全部 65 个新增页面、77 个 adapter、190 页产物和双轨 smoke；状态转 verified。
