<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { queensModule } from '@/algorithms/queens.module';
</script>

<template>
  <Article>
    <h1>N 皇后</h1>
    <p class="sub">回溯与搜索 · 约束满足</p>

    <h2>在棋盘上摆皇后</h2>
    <p>
      在 <code>N×N</code> 棋盘上放
      <code>N</code>
      个皇后，让它们<strong>两两不能互相攻击</strong>——即任意两个皇后不在<strong>同一行、同一列、同一对角线</strong>上。有多少种摆法、怎么找到一种？这是<strong>回溯（backtracking）</strong>算法的经典范例：一个「试探
      → 遇阻就退回重试」的通用套路。
    </p>

    <h2>回溯：试探、剪枝、回退</h2>
    <p>
      因为每列必有且只有一个皇后，我们<strong>逐列</strong>放置。在当前列<strong>从上到下</strong>试每一行：
    </p>
    <p>
      <strong>能放</strong>吗？——检查这一格是否与<strong>已放的皇后</strong>冲突（同行 /
      同对角线）。<strong>不冲突</strong>就放下，然后<strong>递归去放下一列</strong>；<strong>冲突</strong>就直接跳过这一行（这就是<strong>剪枝</strong>：不去尝试注定失败的分支）。如果一整列<strong>每一行都放不了</strong>，说明前面的选择有问题——<strong>回溯</strong>：退回上一列，把那里的皇后<strong>挪到下一个可行位置</strong>再往下试。
    </p>
    <p>
      下面是
      <code>4×4</code>
      棋盘。点<strong>「下一步」</strong>逐步看：当前尝试的格<strong>琥珀高亮</strong>，若与某个皇后冲突，冲突的皇后<strong>变红</strong>、换下一行；不冲突就放下
      <strong>♛</strong>
      进入下一列；一列走投无路就<strong>撤掉上一列的皇后回溯</strong>。经过几次试错，最终摆出一个合法解。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="queensModule" />

    <p>
      回溯的本质是<strong>深度优先地搜索一棵「决策树」</strong>：每一步做一个选择、往下走，走不通就退回换一个选择。<strong>剪枝</strong>（提前判断冲突、不进注定失败的分支）是它高效的关键——否则就退化成暴力枚举
      <code>N^N</code>
      种摆法。想枚举<strong>所有</strong>解，只要在找到一个解后<strong>不停下、继续回溯</strong>即可。
    </p>

    <h2>回溯在哪里用</h2>
    <Callout>
      <b>约束满足</b>：数独、图着色、时间表排布。<br />
      <b>组合枚举</b>：全排列、子集、组合、括号生成。<br />
      <b>路径搜索</b>：迷宫、单词搜索。凡是「一步步做选择、错了能退回重来」的问题，回溯都适用。
    </Callout>
    <p>
      回溯是搜索类算法的地基——它和<strong>动态规划</strong>常被对比：DP
      用「表」自底向上避免重复子问题，回溯用「递归 + 剪枝」自顶向下地搜索解空间。
    </p>
  </Article>
</template>
