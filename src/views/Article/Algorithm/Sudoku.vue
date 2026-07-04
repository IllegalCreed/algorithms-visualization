<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { sudokuModule } from '@/algorithms/sudoku.module';
</script>

<template>
  <Article>
    <h1>数独</h1>
    <p class="sub">回溯与搜索 · 约束满足</p>

    <h2>填数游戏，也是约束回溯的名场面</h2>
    <p>
      数独要把每个空格填上数字，使每一<strong>行</strong>、每一<strong>列</strong>、每一<strong>宫</strong>（小方块）里的数字都<strong>不重复</strong>。它和
      <router-link to="/docs/n-queens">N 皇后</router-link>同属「棋盘约束」回溯，但换了个玩法：N
      皇后是<strong>放置型</strong>（每列放一个皇后、避开攻击），数独是<strong>填数型</strong>（每个空格从
      1..n 里挑一个、满足<strong>行/列/宫三重约束</strong>）。
    </p>

    <h2>试填 → 冲突就换 → 死路就回退</h2>
    <p>
      做法是<strong>回溯</strong>：找到一个空格，从小到大试
      <code>1..n</code
      >；如果某个数字和<strong>同行、同列、同宫</strong>已有的数字冲突，就<strong>换下一个</strong>；如果不冲突，就<strong>填进去</strong>、去填下一个空格。要是某个空格
      <code>1..n</code>
      <strong>全都填不了</strong
      >，说明之前的某一步填错了——<strong>撤销刚才的填入、回退</strong>到上一个空格，换个数字重来。「撤销」正是回溯的关键：错了能退回去，而不是一条道走到黑。
    </p>
    <p>
      下面是一张 <code>4×4</code> 迷你数独（<code>2×2</code>
      宫，<strong>加粗</strong>为题目给定）。点<strong>「下一步」</strong>逐步看：当前格<strong>琥珀环</strong>，试填数字冲突时<strong>标红</strong>、合法时<strong>填绿</strong>。特别留意中间——某个空格先填了一个<strong>当下看着合法、其实全局错误</strong>的数，一路填到<strong>死路</strong>后，<strong>撤销、回退</strong>，改填另一个数才走通（本例有
      <strong>2 次</strong>这样的回退）。走到底，整盘填满。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="sudokuModule" />

    <p>
      真实 9×9
      数独空格更多、回溯更深，但骨架完全一样。想更快，可以用<strong>约束传播</strong>（优先填候选最少的格，即
      MRV）、<strong>位运算</strong>记录每行列宫的可用数字，甚至 Dancing Links——但内核依然是「试探 →
      冲突 → 回退」。
    </p>

    <h2>约束满足与回溯</h2>
    <Callout>
      <b>约束满足问题（CSP）</b
      >：数独、地图着色、排课、八皇后，本质都是「给变量赋值、满足一堆约束」，回溯是通用解法。<br />
      <b>剪枝越早越好</b>：一填入就检查冲突（本页做法），比填满再验快得多。<br />
      <b>回溯的两种棋盘形态</b>：<router-link to="/docs/n-queens">N 皇后</router-link>（放置）+
      数独（填数），加上决策树、网格，凑齐回溯的各种状态空间。
    </Callout>
  </Article>
</template>
