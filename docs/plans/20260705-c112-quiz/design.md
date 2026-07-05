# 设计：测验模式（C-20260705-112，M10-P3）

> Status: verified
> Stable ID: C-20260705-112
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## types（additive）

```ts
export interface QuizItem { question: string; options: string[]; answer: number }
Step.quiz?: QuizItem; // 纯加法：不设 = 无题卡（轨道范式同款）
```

## QuizCard.vue

props `{quiz}`；内部 `selected: number | null`。未答：选项按钮列表；点选 → 对（选项绿 + ✓）/ 错（所选红 ✗ + 正确项绿）+ emit `answered(correct)`；答后显示「继续播放」按钮 emit `resume`。

## AlgorithmPlayer 集成

- `quizRecord = reactive(new Map<number, boolean>())`（步下标 → 是否答对）；`quizTotal = steps 中 quiz 步数`（computed，随 steps 重建）。
- `activeQuiz = computed(() => current.quiz && !quizRecord.has(index) ? current.quiz : null)`。
- `watch(index)`：到达未答 quiz 步且 isPlaying → `pause()` + 记 `wasAutoPlaying=true`。
- `onAnswered(correct)`：`quizRecord.set(index, correct)`。`onResume()`：若 wasAutoPlaying → `play()`。
- 模板：`<QuizCard v-if="activeQuiz || justAnswered(index)" …/>`——实现上卡片显隐由「当前步有 quiz 且（未答 或 刚答完未离步）」控制；离步自动收卡。简化：卡片 v-if = `current.quiz && (!quizRecord.has(index) || showResult)`，showResult 在 answered 时置 true、index 变化时清 false。
- 键盘守卫：`onKeydown` 首行加 `if (activeQuizVisible) return`。
- 成绩行：`atEnd && quizTotal > 0` → caption 下方 `.quiz-score`「本页测验：n / m」。
- 自定义输入重建 steps → quizRecord 清空。

## 试点插桩

module `buildSteps` 末尾按条件给步赋 quiz（不动 emit 签名）：

- bsearch：首个 'mid' 步（探针 arr[4]=9 < 17）→「下一步候选区间是？」[右半 [5,8] ✓ / 左半 [0,3] / 不变 [0,8]]；miss 试验首个 'cut' 后的 'mid' 步 →「区间清空（lo > hi）意味着什么？」……改为第二试验最后 'empty' 前的 mid 步问「arr[mid] 与 target 比较后若区间清空说明？」[目标不存在 ✓ / 需要再扫一遍 / 数组无序]。实现取 point 序列定位。
- quick-sort：首步后插概念题「Lomuto 分区把哪个位置当 pivot？」[区间末位 ✓ / 区间首位 / 随机]；首个 settle（pivot 钉死）步 →「pivot 钉死后接下来？」[递归处理左右两半 ✓ / 重扫整个数组 / 结束]。

## 测试

L4 QUIZCARD 4 + PLAYER-QUIZ 4（无 quiz 回归/自动播拦停/答对记分续播/末步成绩+已答不重问）+ MOD-QUIZ 聚合 1 + e2e 1 = 10 Case。

## 零回归论证

quiz? 可选字段——112 页不设即无卡；键盘守卫仅在题卡可见时生效；quizTotal=0 不渲染成绩行。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。实现与设计一致。
