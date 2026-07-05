# 测试用例：播放器自定义输入（C-20260705-110，M10-P1）

> Status: verified
> Stable ID: C-20260705-110
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3 / L4 / L5
> 命名空间：`TC-INPUT-PARSE-*`、`TC-VIZ-INPUTBAR-*`、`TC-PLAYER-INPUT-*`、`TC-MOD-INPUTSPEC-01`、`TC-E2E-INPUT-01`

## L3 —— `parseInputArray`

| 用例 ID           | 场景                         | 期望                                            |
| ----------------- | ---------------------------- | ----------------------------------------------- |
| TC-INPUT-PARSE-01 | 合法：逗号/空格/中文逗号混合 | '5, 3，8 1' → ok [5,3,8,1]                      |
| TC-INPUT-PARSE-02 | 非数字                       | '5,a,3' → error 含「数字」                      |
| TC-INPUT-PARSE-03 | 小数拒绝                     | '5,3.5' → error 含「整数」                      |
| TC-INPUT-PARSE-04 | 长度越界                     | 1 个 → error 含 lenMin；13 个 → error 含 lenMax |
| TC-INPUT-PARSE-05 | 值域越界                     | 0 或 100 → error 含值域                         |
| TC-INPUT-PARSE-06 | 空串/纯分隔符                | error（不崩溃）                                 |

## L4 —— InputBar / AlgorithmPlayer / 模块聚合

| 用例 ID             | 期望                                              |
| ------------------- | ------------------------------------------------- |
| TC-VIZ-INPUTBAR-01  | 渲染文本框 + hint + 应用/恢复默认按钮             |
| TC-VIZ-INPUTBAR-02  | 合法输入点应用 → emit apply 带数组                |
| TC-VIZ-INPUTBAR-03  | 非法输入 → 行内错误、不 emit                      |
| TC-VIZ-INPUTBAR-04  | 恢复默认 → emit restore + 清错误                  |
| TC-PLAYER-INPUT-01  | module 无 inputSpec → 不渲染 InputBar（全站回归） |
| TC-PLAYER-INPUT-02  | 有 inputSpec → 渲染 InputBar                      |
| TC-PLAYER-INPUT-03  | 应用新输入 → steps 重建（柱数变化）+ 回到第 0 步  |
| TC-PLAYER-INPUT-04  | ?input= 合法 → 初始即自定义；非法 → 落回默认      |
| TC-PLAYER-INPUT-05  | 应用写 URL（?input=…）；恢复默认清除              |
| TC-MOD-INPUTSPEC-01 | 12 排序模块 inputSpec 齐且 = SORT_INPUT_SPEC      |

## L5 —— e2e

| 用例 ID         | 期望                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------- |
| TC-E2E-INPUT-01 | quick-sort 页：默认 10 柱 → 输入 5 个数应用 → 5 柱 + URL 含 input=；带 ?input= 直开 → 初始即 5 柱 |

## 回归

无 inputSpec 页面零变化（TC-PLAYER-INPUT-01 + 既有全部 TC-PLAYER-\* 原样）；usePlayer 静态数组签名原样（usePlayer.spec 零改动通过）；e2e 既有 100 例回归。

## 自测报告

- 执行：1977/1977 全绿、96.30%/95.92%；**全量 e2e 101/101**（播放器核心改动全站回归）+ 新 TC-E2E-INPUT-01 首跑过。
- 新增 17 Case：INPUT-PARSE 6 + VIZ-INPUTBAR 4 + PLAYER-INPUT 5 + MOD-INPUTSPEC 1 + E2E-INPUT 1。
- 关键实测：无 inputSpec 不渲染（回归）；应用 5 数 → 柱数 10→5 + 回第 0 步；?input=9,2,7 直开 3 柱、非法参数落回默认；应用写 URL/恢复默认清参（TC-PLAYER-INPUT-01..05）；12 模块 inputSpec 全等 SORT_INPUT_SPEC 且默认输入自过校验（TC-MOD-INPUTSPEC-01）。
- 真机：?input=9,5,27,1,14 直开——输入条回显 + 5 柱；新拟物凹陷文本框与按钮风格统一。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。17 Case 全绿。
