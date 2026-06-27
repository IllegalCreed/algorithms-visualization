<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import Playground from '@/components/article/Playground.vue';
import UnionFindViz from '@/components/structures/UnionFindViz.vue';
</script>

<template>
  <Article>
    <h1>并查集 Union-Find</h1>
    <p class="sub">数据结构 · 极快地维护「谁和谁同组」</p>

    <h2>什么是并查集</h2>
    <p>
      前面的结构大多在存「数据序列」；并查集（Union-Find，又叫不相交集合
      DSU）换了个差事——把一堆元素分成若干<strong>不相交的组</strong>，专门极快地回答两件事：<strong
        >find(x)</strong
      >
      这个元素属于哪个组（返回组的代表元、也就是「<strong>根</strong>」）、<strong
        >union(a,b)</strong
      >
      把两个组<strong>合并</strong>成一个。
    </p>
    <p>
      实现很巧：每个元素记一个 <code>parent</code>，顺着
      <code>parent</code>
      一直走到「<strong>自己指自己</strong>」的那个就是<strong>根</strong>。<strong
        >同根 = 同组</strong
      >；合并，就是把一个根指到另一个根上。这里有 8
      个元素，一开始各自成组。选两个元素点「合并」，或「查根 / 连通?」试试。
    </p>

    <Playground>
      <UnionFindViz />
    </Playground>

    <p>
      朴素的 find 可能要顺着一条长链一路走到根。<strong>路径压缩</strong>是点睛之笔：find
      找到根之后，把<strong>沿途每个节点直接指向根</strong>，下次再 find
      几乎一步到位——并查集能做到<strong>近乎 O(1)</strong
      >，就靠路径压缩（外加按秩合并）。连成一条链后点「查根」，看箭头怎么齐刷刷改指向根。
    </p>

    <h2>并查集在哪里用</h2>
    <Callout>
      <b>连通性判断</b>：朋友圈 / 网络节点是否连通，一个 connected 搞定。<br />
      <b>Kruskal 最小生成树</b>：加一条边前，用它判断两端是否已连通（会不会成环）。<br />
      <b>岛屿 / 连通分量计数</b>：合并相邻同类，最后数有几个组。<br />
      <b>账号合并 / 等价类</b>：把判定为「同一个」的对象并到一起。
    </Callout>
    <p>它不存序列、只管「同不同组」，是一种用途专一、实现精巧的结构。</p>
  </Article>
</template>
