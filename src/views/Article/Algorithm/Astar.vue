<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { astarModule } from '@/algorithms/astar.module';
</script>

<template>
  <Article>
    <h1>A* 寻路</h1>
    <p class="sub">回溯与搜索 · 启发式搜索 · f = g + h</p>

    <h2>给搜索装上方向感</h2>
    <p>
      同一张网格找最短路：<router-link to="/docs/maze">迷宫 DFS</router-link>
      一条道走到黑再回头，BFS
      则像水一样<strong>不认方向地洪泛</strong>——终点在东边，它也先把西边淹一遍。<strong>A*</strong>
      的改进只有一行：给每个格子打分
      <strong><code>f = g + h</code></strong
      >——g 是起点到此的<strong>实际步数</strong>，h
      是到终点的<strong>估计距离</strong>（网格用曼哈顿距离）——每次从候选（open 集）里<strong
        >扩展 f 最小</strong
      >的格子。
    </p>

    <h2>看它怎么「省」</h2>
    <p>
      下面 S 到 🚩 之间隔着一道 L 形墙。每格数字是它的 f 值：A* 先沿 f=6
      的格子<strong>直奔终点</strong>，撞墙后 f 抬到 8、自动改道下侧绕行——全程只扩展
      <strong>10</strong> 个格子（浅蓝 = closed），而 BFS 要淹掉全部 <strong>22</strong>
      个可达格。终局沿 parent 指针回溯，8 步最优路径整条点亮。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="astarModule" />

    <h2>为什么最优，何时会退化</h2>
    <Callout>
      <b>可采纳</b>：h 从不高估真实剩余距离 ⟹ 终点出队那一刻 g 已是最短（曼哈顿在 4
      向网格恰好可采纳）。<br />
      <b>三兄弟</b>：h ≡ 0 时 A* 退化成 Dijkstra；只用 h 不看 g
      是贪婪最佳优先（快但不保证最优）。<br />
      <b>退化</b>：h 越接近真实距离越省；h 信息量为零时与 Dijkstra/BFS 同量级。<br />
      <b>变体</b>：IDA*（迭代加深省内存）、JPS（网格跳点加速）、双向 A*。
    </Callout>
    <p>
      游戏单位寻路、地图导航、机器人运动规划，跑的都是 A*
      家族。它也把本大类的故事说完整了：<strong>盲目搜索</strong>（DFS 回溯、BFS
      洪泛）在没有先验时兜底，<strong>启发式搜索</strong>拿一点点关于目标的知识，换来数量级的加速。
    </p>
  </Article>
</template>
