# 设计：Z 函数（C-20260705-106，复用 ManacherView additive 标签 · M9-4）

> Status: verified
> Stable ID: C-20260705-106
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 固定实例（Python 已核验）

s = `aabaaab`（n=7）；z = [7,1,0,2,3,1,0] = 朴素逐位对拍。事件流：

| i   | 分支                         | 镜像抄              | 扩展   | z[i] | box       |
| --- | ---------------------------- | ------------------- | ------ | ---- | --------- |
| 1   | 暴力（box 外）               | -                   | +1     | 1    | [1,2)     |
| 2   | 暴力                         | -                   | +0     | 0    | 不变      |
| 3   | 暴力                         | -                   | +2     | 2    | [3,5)     |
| 4   | **镜像达界 → 真扩展**        | 抄 min(r−i, z[1])=1 | **+2** | 3    | **[4,7)** |
| 5   | 镜像直接抄（z[1]=1 < r−i=2） | 抄 1                | 0      | 1    | 不变      |
| 6   | 镜像直接抄（z[2]=0）         | 抄 0                | 0      | 0    | 不变      |

## T0：ManacherView additive（第 2 消费者）

`ManacherTrack` 加 `labels?: [string, string]`（行标签，缺省 ['S','p']）与 `statusLabels?: Partial<Record<'mirror'|'expand'|'done', string>>`（状态文案覆盖，缺省 🪞 镜像复用/↔ 中心扩展/🎯 完成）。ManacherView 模板两处标签 + statusText 读覆盖。Manacher 页不设 → 全回退，零回归。VIZ 2 例（TC-VIZ-MANACHERVIEW-05/06）：设时生效 / 不设回退。

## T1：oracle + module + sources

`zfunc.ts`：`Z_S='aabaaab'`；`zTrace()` → `{z, events:[{i, mode:'brute'|'mirror-copy'|'mirror-capped', mirrored, ext, zi, boxUpd, box:[l,r]}]}`；`zBrute()` 朴素逐位（独立真值）。
`zfunc.module.ts`：init（问题 + z[0]=n）→ brute×3（i=1,2,3 暴力右扩，status='expand'）→ mirror（i=4 镜像达界抄 1，status='mirror'，蓝环 i−l=1）→ extend（i=4 从 box 右缘真比 +2 → z=3、box 刷新 [4,7)，status='expand'）→ mirror×2（i=5 抄 1 零比较、i=6 抄 0，status='mirror'）→ done（O(n)：r 只增不减 + P#T 应用）。**9 步**。`ZExecPoint = 'init'|'brute'|'mirror'|'extend'|'done'`。轨映射：labels=['S','z']、statusLabels（expand→'→ 右扩比较'）、p=z 已算部分（null 未算）、center=i、mirror=i−l（仅 mirror/extend 步）、box=[l, r−1]、best=当前 LCP 段 [i, i+z[i]−1]（z>0 时）。
`zfunc.sources.ts`：四语言，lineMap init/brute/mirror/extend/done（brute 与 extend 同落 while 右扩行）。

## T2：页面 + 接线

`ZFunction.vue`（Algorithm 目录）；路由 `/docs/z-function`；菜单/首页「字符串」第 8 项（suffix-array 后）；新 svg（S 行 + 镜像箭头 + box 带）；改 TC-HOOK（字符串 7→8 两 spec）。

## 复用与零回归

ManacherView additive 零破坏（Manacher 页不设新字段全回退）；AlgorithmPlayer 零改动（复用 manacher 轨字段）。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。实现与设计一致（oracle 事件补 prevBox 供 mirror 步展示旧 box）。
