<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import Playground from '@/components/article/Playground.vue';
import LinkViz from '@/components/structures/LinkViz.vue';
</script>

<template>
  <Article>
    <h1>链表 Linked List</h1>
    <p class="sub">数据结构 · 用指针把节点串起来的序列</p>

    <h2>什么是链表</h2>
    <p>
      和数组把元素挤在<strong>连续</strong>内存里不同，链表的节点<strong>散落</strong>各处，每个节点除了存值，还存一根指向下一个节点的
      <code>next</code> 指针，像手拉手一样把它们串成一条链。开头有个
      <code>head</code> 指针指向第一个节点，最后一个节点的 <code>next</code> 指向
      <code>∅</code>（null）表示结束。
    </p>
    <p>
      正因为不连续，想取第 <code>i</code> 个节点<strong>没法直接跳</strong>——只能从
      <code>head</code> 出发，顺着 <code>next</code> 一个一个走过去，所以按位置访问是
      <code>O(n)</code>。但反过来，增删节点时<strong>只需改几根指针、谁也不用搬</strong>，是
      <code>O(1)</code>。正好和数组<strong>互为镜像</strong>。点一个节点选中它，再操作看看。
    </p>

    <Playground>
      <LinkViz />
    </Playground>

    <p>
      点中一个靠后的节点按「查找」——看游标从 <code>head</code> 一跳一跳走过去，走了几步才到，这就是
      <code>O(n)</code>。再按「在其后插入」，新节点<strong>当场接进链里</strong>，只有相邻的两根
      <code>next</code>
      被改写（高亮那两根），其余节点纹丝不动，<code>O(1)</code>；删除同理，让前一个节点的
      <code>next</code>
      直接跳过它即可。这正是数组（访问快、增删慢）与链表（访问慢、增删快）的<strong>取舍</strong>。
    </p>

    <h2>链表在哪里用</h2>
    <Callout>
      <b>频繁增删的场景</b>：已知位置插入/删除只改指针，不像数组要整体搬移。<br />
      <b>栈 / 队列的链式实现</b>：用链表当底座，天然不受定长限制。<br />
      <b>更复杂结构的基石</b>：树、图的节点之间，也都是用指针（边）连接的。
    </Callout>
    <p>
      链表牺牲了随机访问，换来增删的灵活。下一篇进入<strong>树</strong>——节点不再排成一条线，而是长出层次分明的分叉。
    </p>
  </Article>
</template>
