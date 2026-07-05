# 需求：M12 营销启动包（C-20260705-118，M12 · 完结清单收官）

> Status: verified
> Stable ID: C-20260705-118
> Owner: IllegalCreed
> Created: 2026-07-05
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

completion-backlog 最后一站。M12 定义「M9–M11 完成后**启动**营销」——启动 = 站内地基补齐 + 发布物料就绪 + Owner 行动清单交接；实际发帖/统计接入是站外人工项。

## 地基缺口纠偏（重要）

backlog 写「地基已有：C-034（prerender/routing-meta/JSON-LD/robots/sitemap）」——**核查发现 prerender/routing-meta/JSON-LD 并不在当前代码中**（scripts 仅 deploy.sh；robots/sitemap 是 C-117 刚补的）。据此纠偏：C-034 的增长工程范围**未完整落地**，本变更不重做 prerender（构建管线大改、独立大工程），将其列为 M12 执行期技术项——冷启动发帖走直链分享，不依赖搜索收录。

## 目标（站内可做）

1. **OG 分享卡**：`public/og-cover.png`（1200×630，站牌 + 五大类徽标 + 柱状元素）+ index.html og:/twitter: meta 全套——发到掘金/V2EX/微信有大图卡片。
2. **发布物料** `docs/marketing/launch-posts.md`：掘金项目分享文全文、V2EX 分享创造帖全文、B站三支 60 秒视频脚本大纲、发布节奏建议、Owner 行动项清单（统计/赞赏/搜索提交/录屏）。
3. **收官回写**：backlog 完成定义达成（M9→M12 全勾）——**1.0 封版**，转入营销与维护期；roadmap 同步。

## 验收标准

OG 图部署可达且 meta 就位（e2e 断言）；物料落档；全清单闭环回写。

## 变更历史

- 2026-07-05：创建（draft → approved）。
