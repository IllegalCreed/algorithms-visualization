<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import Playground from '@/components/article/Playground.vue';
import GraphViz from '@/components/structures/GraphViz.vue';
</script>

<template>
  <Article>
    <h1>图 Graph</h1>
    <p class="sub">数据结构 · 顶点和边的任意连接（最一般的结构）</p>

    <h2>什么是图</h2>
    <p>
      树是「一个父亲、向下分叉」的特例；<strong>图</strong>则彻底放开——任意几个<strong>顶点</strong>之间，想连就连一条<strong>边</strong>，可以成环、可以多对多。地图路网、社交关系、网页链接，本质都是图。
    </p>
    <p>
      图怎么<strong>遍历</strong>（不重不漏地走遍所有顶点）？两条经典路线，正好把前面学的<strong>队列</strong>和<strong>栈</strong>用上了——选个起点，点
      <strong>BFS</strong> 或 <strong>DFS</strong> 看它们怎么走（点顶点可换起点）。
    </p>

    <Playground>
      <GraphViz />
    </Playground>

    <p>
      看出区别了吗——<strong>BFS</strong>（广度优先）像水波：用一个<strong>队列</strong>，先把起点的邻居全排队，再一圈圈向外，<strong>一层层</strong>访问；<strong>DFS</strong>（深度优先）像走迷宫：用一个<strong>栈</strong>（或递归），<strong>一条道走到底</strong>，撞墙了再回头换路。BFS
      能找<strong>最短路</strong>（边数最少），DFS 适合<strong>探路 / 找连通块</strong>。
    </p>

    <h2>图怎么存 · 在哪里用</h2>
    <p>
      图常用两种存法：<strong>邻接表</strong>（每个顶点挂一串邻居，省空间、适合稀疏图）和<strong>邻接矩阵</strong>（一张
      N×N 表，<code>matrix[i][j]=1</code> 表示 i、j 相连，查两点是否相邻 <code>O(1)</code>）。
    </p>
    <Callout>
      <b>路网 / 导航</b>：顶点是地点、边是路，最短路就是 BFS / Dijkstra。<br />
      <b>社交网络</b>：顶点是人、边是关注，找共同好友、做推荐。<br />
      <b>依赖 / 调度</b>：任务依赖图，拓扑排序定执行顺序。
    </Callout>
    <p>
      到这里，从线性的栈、队列、数组、链表，到非线性的树、堆、哈希表、图——数据结构这一程就走完了。它们其实是同一件事的不同取舍：<strong>怎么把数据组织好，让该快的操作快起来</strong>。
    </p>
  </Article>
</template>
