<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import Playground from '@/components/article/Playground.vue';
import LruViz from '@/components/structures/LruViz.vue';
</script>

<template>
  <Article>
    <h1>LRU 缓存 Least Recently Used</h1>
    <p class="sub">数据结构 · 哈希表 + 双向链表的经典组合</p>

    <h2>什么是 LRU 缓存</h2>
    <p>
      缓存空间有限，满了就得淘汰一项。<strong>LRU（最近最少使用）</strong>的策略是：淘汰<strong>最久没被用过</strong>的那一项——刚用过的最该留着，最久没碰的最该走。
    </p>
    <p>
      这里容量
      4，缓存项按「最近使用」从左到右排：最左是刚用的（<strong>MRU</strong>），最右是最久没用的（<strong>LRU</strong>，下一个被淘汰）。<code>get</code>、<code
        >put</code
      >
      只要碰到某一项，就把它<strong>挪到最前</strong>。试试 <code>get</code> 一个已有的键、<code
        >put</code
      >
      一个新键、再把缓存 put 到满。
    </p>

    <Playground>
      <LruViz />
    </Playground>

    <p>
      怎么做到 <code>get</code>/<code>put</code> 都
      <code>O(1)</code>？答案正是前面两种结构的<strong>组合</strong>：<strong>哈希表</strong>负责按
      key <code>O(1)</code> 找到节点（见<strong>哈希</strong>那篇），<strong>双向链表</strong>负责
      <code>O(1)</code> 把节点挪到最前、从最后淘汰（见<strong>链表</strong>的双向那节）。哈希定位 +
      双链表调序，缺一不可——这也是它常被当面试题的原因。
    </p>

    <h2>LRU 在哪里用</h2>
    <Callout>
      <b>操作系统</b>：页面置换算法。<br />
      <b>数据库 / Redis</b>：缓冲池、内存淘汰策略。<br />
      <b>CPU cache / 浏览器 / CDN</b>：就近缓存最近访问的数据。<br />
      <b>各类 LRU cache 库</b>：限定内存的键值缓存。
    </Callout>
    <p>它是「<strong>组合已有结构解决新问题</strong>」的典范——也为这趟数据结构之旅收个尾。</p>
  </Article>
</template>
