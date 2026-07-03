<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { mazeModule } from '@/algorithms/maze.module';
</script>

<template>
  <Article>
    <h1>迷宫寻路</h1>
    <p class="sub">回溯与搜索 · 网格搜索</p>

    <h2>在迷宫里找一条路</h2>
    <p>
      给一张带墙的方格地图，从<strong>起点</strong>出发，找一条通往<strong>终点</strong>的路。这是<strong>回溯</strong>最形象的一幕：像一只老鼠
      🐭
      在迷宫里走——挑一个方向往前走，走到<strong>死胡同</strong>就<strong>退回上一个路口</strong>，换一个方向再试，直到走到终点。前几页的回溯画在棋盘和决策树上，这一页画在<strong>网格</strong>上。
    </p>

    <h2>深度优先 + 回溯</h2>
    <p>
      做法是<strong>深度优先搜索（DFS）</strong>：站在一格，按固定顺序（比如<strong>下、右、上、左</strong>）尝试四个方向；遇到<strong>墙</strong>、<strong>越界</strong>或<strong>走过的格</strong>就跳过，否则迈过去、把新格<strong>标记为已访问</strong>（防止绕圈），然后在新格上递归地重复。如果一格<strong>四个方向都走不通</strong>，说明这是死路——<strong>回溯</strong>：退回上一格，接着试它剩下的方向。
    </p>
    <p>
      「标记已访问」是关键：没有它，老鼠会在两格之间来回打转、永远走不完。下面是一张
      <code>5×5</code> 迷宫（<strong>S</strong> 起点、<strong>🚩</strong>
      终点、深色是墙）。点<strong>「下一步」</strong>逐步看：<strong>🐭</strong>
      是当前位置、<strong>琥珀色</strong>是当前尝试的路径、<strong>浅蓝色</strong>是走过又放弃的格；留意老鼠几次撞进死路又退回来。走到终点时，整条<strong>解路径变绿</strong>。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="mazeModule" />

    <p>
      DFS
      找到的是<strong>一条</strong>路，未必是<strong>最短</strong>的。要找最短路，换成<strong>广度优先搜索（BFS）</strong>——一圈圈地扩散、第一次碰到终点就是最短；但那属于「搜索」的另一支，不再是回溯。想找<strong>所有</strong>路径，则和其它回溯题一样：找到一条后<strong>不停下、继续回溯</strong>。
    </p>

    <h2>网格搜索：回溯的第三种形态</h2>
    <Callout>
      至此回溯与搜索大类的三种状态空间都齐了：<br />
      <b>棋盘约束</b>：<router-link to="/docs/n-queens">N 皇后</router-link
      >。<b>决策树枚举</b>：<router-link to="/docs/subsets">子集</router-link>
      /
      <router-link to="/docs/permutations">全排列</router-link>
      /
      <router-link to="/docs/combination-sum">组合总和</router-link>。<br />
      <b>网格搜索</b>：迷宫寻路（本页）。同类还有：岛屿数量、单词搜索、扫雷展开——都是网格上的
      DFS/BFS。
    </Callout>
    <p>
      同一套「深入 → 受阻 →
      回退」的骨架，套在棋盘、决策树、网格等不同的<strong>状态空间</strong>上，就是回溯与搜索解决一大类问题的通用思路。
    </p>
  </Article>
</template>
