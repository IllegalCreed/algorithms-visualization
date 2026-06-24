<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import Playground from '@/components/article/Playground.vue';
import QueueViz from '@/components/structures/QueueViz.vue';
</script>

<template>
  <Article>
    <h1>队列 Queue</h1>
    <p class="sub">数据结构 · 先进先出的线性表</p>

    <h2>什么是队列</h2>
    <p>
      队列和栈一样是线性表，但它<strong>两端各管一件事</strong>：一端只进（<strong>队尾</strong>），另一端只出（<strong>队首</strong>）。就像排队买票——新来的排到队尾，叫号的总是队首那位。
    </p>
    <p>
      从队尾加入一个元素叫 <code>enqueue</code>（入队），从队首拿走一个叫
      <code>dequeue</code>（出队），只看队首而不拿走叫
      <code>peek</code>。先排进来的先被服务——这就是<strong
        >先进先出（FIFO，First In First Out）</strong
      >，正好和栈的后进先出相反。
    </p>

    <Playground>
      <QueueViz />
    </Playground>

    <p>
      试试连入 <code>1</code>、<code>2</code>、<code>3</code>，再连出两次——最先出来的是
      <strong>1</strong>，谁先排队谁先走。和栈对比：同样压/入 1、2、3，栈先吐
      <strong>3</strong>、队列先吐 <strong>1</strong>。<code>enqueue</code> 和
      <code>dequeue</code> 都只动一端，复杂度都是 <code>O(1)</code>。
    </p>

    <h2>队列在哪里用</h2>
    <p>队列天然适合「按到达顺序处理」的场景：</p>
    <Callout>
      <b>消息队列 / 任务调度</b>：先到的请求先处理，削峰填谷。<br />
      <b>BFS 广度优先搜索</b>：用队列按层扩展节点。<br />
      <b>打印机 / 缓冲区</b>：先发的文档先打印，数据先进先出。
    </Callout>
    <p>栈和队列是最基础的两种受限线性表，再往后是<strong>树</strong>——一种有层次的非线性结构。</p>
  </Article>
</template>
