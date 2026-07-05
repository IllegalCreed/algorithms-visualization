# 需求：测验模式（C-20260705-112，M10-P3）

> Status: verified
> Stable ID: C-20260705-112
> Owner: IllegalCreed
> Created: 2026-07-05
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

M10 播放器 2.0 第三项（backlog P3）。看动画是被动学习；在关键步停下来问一句「下一步会发生什么」，检验的是真理解。`Step.quiz?` 走轨道范式同款 additive——不设 quiz 的模块零回归。

## 目标

1. **types additive**：`QuizItem { question, options, answer }`；`Step.quiz?: QuizItem`。
2. **QuizCard 组件**：题目 + 选项按钮；答对绿 ✓、答错红 ✗ 并亮出正确项；答后出「继续播放」。
3. **播放器集成**：自动播放到 quiz 步 → 暂停出卡；答后点继续 → 若此前在自动播放则续播；**同一步答过不再出题**（回拖/循环不重复拦）；题卡期间键盘快捷键不响应（防绕题）；到末步且本页有题 → 显示「测验成绩 n/m」。
4. **试点**：二分查找 + 快速排序两页各插 2 题（探针后区间走向 / 区间清空判定 / Lomuto pivot 取位 / 分区后走向），答案由步骤数据保证正确。

## 验收标准

- 两试点页自动播放会被题卡拦住，答题流转完整、末步见成绩；其余 112 页零变化（无 quiz 不渲染）。
- 全量单测 + e2e 回归绿。

## 非目标

- 不做题库/随机抽题/错题本；不做其它页铺开（试点验证后另行批次）。

## 变更历史

- 2026-07-05：创建（draft → approved）。M10-P3：Step.quiz? + QuizCard + 两页试点。
- 2026-07-05：交付验收（approved → verified）。10 Case 全绿 + 全量 e2e 103 + 真机题卡核验。
