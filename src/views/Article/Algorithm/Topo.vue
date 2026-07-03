<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { topoModule } from '@/algorithms/topo.module';
</script>

<template>
  <Article>
    <h1>拓扑排序</h1>
    <p class="sub">图算法 · 有向无环图（DAG）的依赖排序</p>

    <h2>什么是拓扑排序</h2>
    <p>
      有些事情有<strong>先后依赖</strong>：先修完「高等数学」才能上「概率论」，先编译完 A 库才能链接
      B。把这些「谁必须在谁之前」画成一张<strong>有向图</strong>（边
      <code>u→v</code> 表示「u 必须在 v
      前」），<strong>拓扑排序</strong>就是给出一个满足所有依赖的<strong>线性顺序</strong>——排在前面的绝不依赖后面的。前提是图<strong>无环</strong>（有环就互相依赖、无解）。
    </p>

    <h2>Kahn 算法怎么做</h2>
    <p>
      一个直观办法（Kahn 算法）：先数每个点的<strong>入度</strong>（有多少条边指向它）。<strong
        >入度为 0</strong
      >
      的点没有任何前置依赖，可以<strong>直接输出</strong>；输出它之后，把它「删掉」——它指向的每个后继<strong
        >入度减 1</strong
      >。不断重复「取一个入度 0 的点输出、后继减度」，直到所有点输出完。
    </p>
    <p>
      下面固定一张 6 个点的 DAG。点<strong>「下一步」</strong>逐步看：当前取出的入度 0
      点<strong>琥珀高亮</strong>、输出后<strong>变绿</strong>，它的出边<strong>黄色高亮</strong>、后继的<strong>入度徽标下降</strong>——某个后继降到
      0 时又成为下一批可输出的点。走到底得到一个合法拓扑序（本图为
      <strong>C→A→E→B→D→F</strong>）。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="topoModule" />

    <p>
      注意：入度 0
      的点可能<strong>同时有多个</strong>，取哪个都对——拓扑序<strong>通常不唯一</strong>（这里固定「取下标最小的」让过程确定）。复杂度
      <code>O(V + E)</code>：每个点、每条边各处理一次。若某步<strong>找不到入度 0 的点</strong
      >但还有点没输出，就说明图里<strong>有环</strong>，不存在拓扑序。
    </p>

    <h2>拓扑排序在哪里用</h2>
    <Callout>
      <b>课程/先修</b>：安排一个不违反先修关系的修课顺序。<br />
      <b>构建/编译</b>：按依赖决定模块编译、任务执行顺序（Make、打包器都用它）。<br />
      <b>电子表格</b>：单元格公式依赖的重算顺序。也用于<b>检测循环依赖</b>（有环即报错）。
    </Callout>
    <p>
      Kahn 用「入度 + 队列」实现——想复习队列怎么进出，可回看
      <strong>数据结构 · 队列</strong>；想看图怎么存、怎么遍历，回看
      <strong>数据结构 · 图</strong>。
    </p>
  </Article>
</template>
