# 实现记录：鸡尾酒排序 Cocktail Shaker Sort（C-20260702-045）

> Status: verified
> Stable ID: C-20260702-045
> Owner: IllegalCreed
> Created: 2026-07-02
> Last reviewed: 2026-07-02
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T0**：types.ts 加 `CocktailExecPoint`；图标 cocktail.svg。
2. **T1 module + oracle + sources**（L3）：先 spec（TC-COCKTAIL-MOD-01..14）跑红 → 实现三文件跑绿。
3. **T2 CocktailSort.vue**（L4 全模板）：先 spec 跑红 → 实现跑绿。
4. **T3 接线**：路由 + 菜单/首页「冒泡排序」后插入 + import 图标 + 改 TC-HOOK-02-4（14→15）。
5. **T4 e2e**（L5）。
6. 全门禁 → 回写（含**阶段二收官**标记）→ 两提交 → 双轨部署。

## 关键实现笔记

- **双端就位收缩**：模块内维护 `sortedFrom`（fwd 趟毕 `right--` 后置 `right+1`）与 `sortedUpTo`（bwd 趟毕 `left++` 后置 `left`），每步 emphasis 同时带两者——BarsView 的 sortedRight/sortedLeft 分支本就并列，**零框架改动**得到「两端渐绿夹中间」的视觉。真机 step 31 柱态 `[sorted, comparing, comparing, idle×4, sorted]` 实证。
- **执行点带方向**（9 个）：f\*/b\* 分别映射源码两个循环，代码高亮随方向切换；fNoSwap/bNoSwap 映射对应循环行（「不换、继续扫」语义）。冒泡的 innerLoop 步在本页省略（compare 决策+动作两步已足够，趟标记步给方向）。
- **backward 指针**：比较对是 `a[j-1] vs a[j]`，红 '0' 给 j-1、蓝 '1' 给 j（forward 红 j/蓝 j+1）——红恒左、蓝恒右，方向靠趟标记 + caption。
- **提前收工**：两处 `if (!swapped) break` 都在源码展示；固定输入走 bwd2 全 noSwap → break 路径（fwd 后 break 路径不触发，属另一分支，lineMap 覆盖行即可）。
- **坑（TDD RED 一次）**：TS lineMap backward 段行号数错 2 行（把 15/17/18/16/25 写成实际的 13/15/16/14/23）——**MOD-13 的行号界内断言当场抓出**（done:25 > 24 行），逐语言重数修正。教训重申：4 语言 lineMap 必须逐行数，界内断言是最后防线。
- 图标 cocktail.svg：马天尼杯剪影（倒三角杯身 + 杯梗 + 底座 + 杯口内横线）。

## 自测报告

- 见 [test-cases.md](./test-cases.md)：全门禁绿（单测 931、e2e 40、format/lint/type-check exit 0）；覆盖率 93.54%/90.99%/94.07%/94.37%；真机双端绿夹中 + 末步升序自检通过。零回归。

## 变更历史

- 2026-07-02：创建（draft）。
