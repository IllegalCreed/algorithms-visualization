<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { maxFlowModule } from '@/algorithms/maxflow.module';
</script>

<template>
  <Article>
    <h1>最大流（Ford-Fulkerson）</h1>
    <p class="sub">图算法 · 网络流 · 残量网络 · 最大流 = 最小割</p>

    <h2>从源到汇最多能送多少</h2>
    <p>
      有一张有向图，每条边有一个<strong>容量</strong>（一秒最多流过多少水）。从<strong>源 s</strong
      >往<strong>汇 t</strong>送水，每条边的<strong>流量</strong>不能超过容量、每个中间点<strong
        >流入 = 流出</strong
      >。问：最多能送多少？这就是<strong>最大流</strong>问题，它是任务分配、二分图匹配、图像分割等一大类问题的通用模型。
    </p>

    <h2>残量网络与反向边</h2>
    <p>
      <strong>Ford-Fulkerson 方法</strong>：反复找一条从 s 到 t
      的<strong>增广路</strong>（每条边都还有剩余容量），沿路把流推满<strong>瓶颈</strong>（路径上最小的剩余容量），直到再也找不到增广路。关键在<strong>残量网络</strong>：每条用了流量的边
      <code>u→v</code> 会生出一条容量等于「已用流量」的<strong>反向边</strong>
      <code>v→u</code
      >。它的作用是<strong>反悔</strong>——如果之前贪心走错了路，后面可以沿反向边<strong>把流退回、改道</strong>。正因为有反向边，任意顺序找增广路都能得到正确的最大流。
    </p>
    <p>
      下面固定一张 4 点网络。<strong>故意</strong>让第一条增广路走「贪心陷阱」
      <code>s→a→b→t</code>（占用了中间边
      <code>a→b</code
      >）。点<strong>「下一步」</strong>逐步看：每条边标<strong>「流量/容量」</strong>，<strong>琥珀</strong>是正向增广、<strong>红色虚线</strong>是<strong>反向退流</strong>。到第
      4 轮，增广路 <code>s→b→a→t</code> <strong>反向经过 a→b</strong>，把第 1 轮误走的那 1
      单位<strong>退回、改道</strong>。走到底，最大流 <strong>6</strong>。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="maxFlowModule" />

    <h2>最大流 = 最小割</h2>
    <Callout>
      <b>增广路</b>：残量网络里一条 s→t 的路径，沿路推满瓶颈。<br />
      <b>反向边</b>：<code>u→v</code> 用了 f 流量 → 生出 <code>v→u</code> 容量 f，允许退流改道。<br />
      <b>停机</b>：再无增广路即最大流；此时 s 可达集与其余点之间的边就是<strong>最小割</strong>。<br />
      <b>Edmonds-Karp</b>：用 BFS 找<strong>最短</strong>增广路，迭代次数被界定在 O(VE²)。
    </Callout>
    <p>
      走到底，把
      <strong>s 能到达的点</strong
      >和<strong>其余点</strong>切开，被切断的边的容量之和恰好等于最大流——这就是著名的
      <strong>最大流最小割定理</strong>：送得越多，是因为「咽喉」（最小割）就那么宽。本例最小割是
      <code>s→a</code> 与 <code>s→b</code>（都被打满 3/3），容量和 <strong>6</strong> =
      最大流。许多看似无关的问题（<router-link to="/docs/hungarian">二分图最大匹配</router-link
      >、项目选择、图像前景背景分割）都能<strong>归约</strong>成最大流/最小割来解。
    </p>
  </Article>
</template>
