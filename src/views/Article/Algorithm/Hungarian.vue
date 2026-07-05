<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { hungarianModule } from '@/algorithms/hungarian.module';
</script>

<template>
  <Article>
    <h1>二分图匹配（匈牙利算法）</h1>
    <p class="sub">图算法 · 增广路 · 一让一定</p>

    <h2>最多能安排几对</h2>
    <p>
      左边一排工人、右边一排岗位，连线表示「能胜任」——<strong>最多能同时安排几对</strong>？这是<strong>二分图最大匹配</strong>：任务指派、宿舍分配、骨牌覆盖棋盘，全是它换的皮。贪心地先到先得会卡住：好岗位被占了，后来的明明有救。
    </p>

    <h2>增广路：问一句「能不能让路」</h2>
    <p>
      <strong>匈牙利算法</strong
      >逐个工人找岗位：试探心仪岗位，<strong>空闲就定下</strong>；被占了不放弃，<strong>问占用者能不能让路</strong>——递归给它找别的岗位。让路成功，整条「让路链」（增广路）<strong>一起翻转</strong>：人人有岗、匹配数
      +1。下面 L2 会让 L1 让路（增广翻转），L3
      则会撞上一条<strong>死路</strong>整链回退、换下家。琥珀边 = 试探中，绿边 = 已匹配，灰虚 =
      死路。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="hungarianModule" />

    <h2>它背后的定理们</h2>
    <Callout>
      <b>增广路定理</b>：匹配是最大的 ⟺ 不存在增广路——所以逐点找增广路必达最优。<br />
      <b>复杂度</b>：每个左点一次 DFS，O(V·E)；Hopcroft-Karp 批量增广可到 O(E√V)。<br />
      <b>König 定理</b>：二分图中 最大匹配 = 最小点覆盖（少数点看住所有边）。<br />
      <b>带权版</b>：KM 算法求最大权匹配（指派问题）。
    </Callout>
    <p>
      往深一层看：给二分图加超级源汇、每条边容量 1，<router-link to="/docs/max-flow"
        >最大流</router-link
      >跑出来的整数流恰好就是最大匹配——匈牙利算法正是这个特例下的手工增广。图算法线到此十页：从最短路、生成树、拓扑，到强连通、可满足性、网络流与匹配。
    </p>
  </Article>
</template>
