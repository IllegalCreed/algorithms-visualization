<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { islandsModule } from '@/algorithms/islands.module';
</script>

<template>
  <Article>
    <h1>岛屿数量</h1>
    <p class="sub">回溯与搜索 · Flood Fill</p>

    <h2>数一数有几片陆地</h2>
    <p>
      给一张 <code>0</code>（水）/
      <code>1</code
      >（陆地）的方格地图，<strong>上下左右相连</strong>的陆地算作<strong>一个岛</strong>，问一共有几个岛。它和
      <router-link to="/docs/maze">迷宫寻路</router-link
      >同样是<strong>网格搜索</strong>，但目标正好互补：迷宫是「从起点<strong>找一条路</strong>到终点」，岛屿是「扫描整张图、<strong>数出有几片</strong>连通的陆地」。
    </p>

    <h2>扫描 + Flood Fill</h2>
    <p>
      做法叫
      <strong>Flood Fill（洪水填充）</strong
      >，就是油漆桶工具的原理：<strong>逐格扫描</strong>整张网格，遇到一个<strong>还没访问过的陆地</strong>格，就说明发现了一个<strong>新岛</strong>——岛屿计数
      <strong>+1</strong>，然后从这一格出发做
      <strong>DFS</strong
      >，把与它<strong>四连通</strong>的整片陆地全部「淹掉」（标记为已访问），一片铺满后再继续扫描。已经淹过的陆地和水，扫描时直接跳过。
    </p>
    <p>
      关键还是<strong>「标记已访问」</strong>：把数过的陆地沉成水（或另设
      visited），才不会把同一个岛重复计数。它和迷宫是同一套网格 DFS
      骨架，区别只在——迷宫找到终点就停，岛屿要<strong>把每一片都铺满、一直扫到底</strong>，最后计数就是答案。
    </p>
    <p>
      下面是一张
      <code>4×4</code>
      网格（<strong>深色</strong>是水、<strong>浅色</strong>是未访问陆地）。点<strong>「下一步」</strong>逐步看：<strong
        >🔎</strong
      >
      是当前扫描格，遇到新陆地就<strong>计数 +1</strong> 并 Flood Fill
      把整片<strong>标绿</strong>；数完全图，绿色连通块共 <strong>3</strong> 片 —— 答案就是
      <strong>3</strong>。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="islandsModule" />

    <p>
      本页用 <strong>DFS</strong> 铺岛，也可以用
      <strong>BFS</strong
      >（队列）一圈圈地淹，效果相同；把「数几片」换成「记录每片的大小」，就能求<strong>最大岛屿面积</strong>。Flood
      Fill 是<strong>连通分量</strong>在网格上的形态。
    </p>

    <h2>Flood Fill 在哪里用</h2>
    <Callout>
      <b>图像处理</b>：油漆桶填充、连通域标记、去除小噪点。<br />
      <b>游戏</b>：扫雷点开一片空格、消消乐找同色块、地图区域划分。<br />
      <b>网格建模</b>：岛屿 / 湖泊 / 势力范围计数，本质都是<b>连通分量</b>。
    </Callout>
    <p>
      和 <router-link to="/docs/maze">迷宫寻路</router-link>两页对照着看——同一张网格、同一套
      DFS，「找一条路」与「数所有连通块」是网格搜索最常见的一对目标。
    </p>
  </Article>
</template>
