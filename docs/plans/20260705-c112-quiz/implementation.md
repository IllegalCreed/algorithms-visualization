# 实现记录：测验模式（C-20260705-112，M10-P3）

> Status: verified
> Stable ID: C-20260705-112
> Owner: IllegalCreed
> Created: 2026-07-05
> Last reviewed: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD）

1. L4：QUIZCARD spec 红 → types +QuizItem/quiz? + QuizCard.vue 绿。
2. L4：PLAYER-QUIZ spec 红 → AlgorithmPlayer 集成（拦停/记分/守卫/成绩行）绿。
3. 试点：MOD-QUIZ 红 → bsearch/quick-sort 插桩 绿。
4. e2e + 门禁 + 真机 + 回写 + 两提交 + 双轨部署。

## 关键实现笔记

- 拦停在 watch(index)：到达未答 quiz 步时快照 wasAutoPlaying = isPlaying 再 pause()——resume 时只有自动播放被拦的才 play()（手动步进到题步答完不强制播）。
- 题卡显隐 = current.quiz && (!quizRecord.has(index) || showQuizResult)：answered 置 showQuizResult 保持结果态，离步（watch index）收卡；回拖已答步不再出题。
- 键盘守卫 onKeydown 首行 activeQuizVisible 直接 return——防空格绕题；quiz 概念题（快排）与自定义输入无关、bsearch 数值题依赖固定输入（查找类未开 inputSpec，安全）。
- e2e 教训 ×2：goto 后立即 keyboard.press 在复用 dev server 上时序不稳 → 改点击 .play（键盘路径 C-111 e2e 已覆盖）；quick-sort 插桩后 playback e2e 的键盘步进被题卡正确拦下 → 该 e2e 换 heap-sort 页。
- applyInput/restoreInput 重建 steps 时 quizRecord.clear()（题挂在步下标上，重建后失效）。

## 自测报告

见 [test-cases.md](./test-cases.md)：1993/1993 + e2e 103/103 + 真机题卡核验。

## 变更历史

- 2026-07-05：创建（draft）。
- 2026-07-05：交付验收（draft → verified）。
