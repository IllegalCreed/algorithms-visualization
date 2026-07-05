# 需求：Z 函数（C-20260705-106，字符串第 8 页 · 复用 ManacherView additive 标签 · M9-4）

> Status: verified
> Stable ID: C-20260705-106
> Owner: IllegalCreed
> Created: 2026-07-05
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

M9 完结清单第 4 项。**Z 函数**：z[i] = s 与后缀 s[i..] 的最长公共前缀（LCP）长度——KMP 部分匹配表的「孪生兄弟」，模式匹配（P#T 拼接法）、周期性判定、字符串压缩的通用原语。朴素逐位比 O(n²)；**Z-box** 维护最右匹配区间 [l,r)：i 在 box 内先抄镜像 `z[i-l]`（截断到 r−i），只有达到 box 右缘才继续往右比——每次成功比较都推进 r，整体 O(n)。与 Manacher 的最右回文带同构（同一招「区间内抄镜像、出界才老实比」）。

## 目标

字符串第 8 页「Z 函数」，接入播放器，**复用 ManacherView（第 2 消费者）+ additive 两个可选字段**：

1. **T0**：`ManacherTrack.labels?: [string, string]`（行标签，缺省 ['S','p']）+ `statusLabels?`（状态文案覆盖，缺省原三条）；ManacherView 消费缺省回退——Manacher 页不设即零回归（VIZ 2 例）。
2. 固定 s=`aabaaab`（n=7，Python 已核验）：z=[7,1,0,2,3,1,0] **= 朴素逐位对拍**。三剧情齐：i=1,2,3 box 外暴力（brute）；**i=4 镜像达界（抄 1）→ 真扩展 +2 → z=3 → box 更新 [4,7)**（拆 mirror+extend 两步，核心教学点）；i=5,6 镜像直接抄零比较。**9 步** = init + brute×3 + mirror + extend + mirror×2 + done。
3. 视觉：S 行 + z 行（未算空）；Z-box 浅蓝带、当前 i 琥珀环、镜像 i−l 蓝环、当前 LCP 段绿；状态徽标 mirror/expand 复用。
4. 正文：LCP 直觉 → Z-box 三分支（box 外暴力 / 镜像小于余量直接抄 / 达界继续比）→ 为什么 O(n)（r 只增不减）→ 应用（P#T 模式匹配、周期性、与 KMP π 的互算）。

## 验收标准

- `/docs/z-function` 新页：正文 + 播放器同屏，四语言随步高亮；z 行标签显示 **z**（不是 p）、状态文案贴 Z 语义；done 给 O(n) 与 P#T 应用。
- 菜单 + 首页「字符串」第 8 项，新图标；改 TC-HOOK（字符串 7→8，两 spec）。
- 全门禁 + 真机自检；Manacher 页零回归（不设新字段、S/p 标签与原文案不变）。

## 非目标

- 不做 P#T 拼接的第二实例动画（正文/done 点到）；不做 Z→π 互算页。
- 不改 AlgorithmPlayer；ManacherView 仅 additive 标签/文案字段。

## 变更历史

- 2026-07-05：创建（draft → approved）。Z-box 三剧情 + additive 标签复用 ManacherView；9 步。
- 2026-07-05：交付验收（approved → verified）。18 Case 全绿 + 真机自检通过。
