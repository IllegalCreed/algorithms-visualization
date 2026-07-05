<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { eulerModule } from '@/algorithms/euler.module';
</script>

<template>
  <Article>
    <h1>欧拉路径（Hierholzer 一笔画）</h1>
    <p class="sub">图算法 · 边走边消 · 图论的起点</p>

    <h2>从七桥问题说起</h2>
    <p>
      1736 年柯尼斯堡的市民想一次走遍七座桥、每座恰走一次——欧拉证明了不可能，图论就此诞生。
      「每条<strong>边</strong>恰走一次」的路线叫<strong>欧拉路径</strong>（起终相同则叫欧拉回路），
      也就是小学的<strong>一笔画</strong>。判定出奇地简单，只看<strong>度数</strong>：
    </p>
    <Callout>
      连通图存在欧拉路径 ⟺ 奇度点恰 <b>0 个</b>（回路，随处起笔）或
      <b>2 个</b>（路径，必须从一个奇度点起笔、终于另一个）。<br />
      直觉：中途路过一个点，总是「进一条边、出一条边」成对消耗——度数得是偶数；只有起点（只出不进一次）和终点（只进不出一次）允许奇数。七桥的四个点<strong>全是奇度</strong>，所以无解。
    </Callout>

    <h2>Hierholzer：走到卡住，弹栈接环</h2>
    <p>
      判定过了怎么把路线画出来？<strong>Hierholzer</strong>
      用栈边走边消：沿未用过的边一路贪心走（走过就<strong>消掉</strong>、当前点压栈）；
      走到<strong>卡住</strong>（当前点无未用边）就弹栈、把它收进路径；
      若弹完后栈顶还有余边，就从它接着走——走出的<strong>子环自动插进路径</strong>。
      栈清空后把弹出序反转，就是欧拉路径，整个过程每条边恰进出栈一次，<code>O(E)</code>。
      下图徽标是每个点的<strong>剩余未用边数</strong>——减到 0 就走不动；虚线环表示在栈上。
    </p>

    <AlgorithmPlayer :module="eulerModule" />

    <h2>为什么子环插得进去</h2>
    <p>
      第一段路在终点卡住时，剩下没走的边（如果有）一定挂在<strong>栈上某个点</strong>的周围，
      而且这些残边每个点的度数都是偶数（进出成对）——所以从栈顶那个有余边的点出发，
      必然能走一个<strong>环</strong>回到它自己。弹栈的顺序恰好把这个环「缝」在正确的位置。
      应用远不止一笔画：DNA 测序把读段重叠建成 de Bruijn 图后<strong>找欧拉路径拼接基因组</strong>；
      扫雪车/邮递员要走遍每条街，是它的加权推广（中国邮递员问题）。与
      <router-link to="/docs/scc">强连通分量</router-link>、<router-link to="/docs/lca"
        >LCA</router-link
      >
      一样，都是「一遍 DFS/栈」榨干图结构的经典。
    </p>
  </Article>
</template>
