<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import Playground from '@/components/article/Playground.vue';
import QueueViz from '@/components/structures/QueueViz.vue';
import DequeViz from '@/components/structures/DequeViz.vue';
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

    <h2>双端队列 Deque：两端都能进出</h2>
    <p>
      普通队列死守
      FIFO——只能<strong>尾进头出</strong>。<strong>双端队列</strong>（deque，double-ended
      queue）放宽了这条限制：<strong>队头、队尾两端都能进、都能出</strong>，于是有四个操作——头部入
      <code>pushFront</code>、尾部入 <code>pushBack</code>、头部出 <code>popFront</code>、尾部出
      <code>popBack</code>。
    </p>
    <p>
      正因为两端自由，它是<strong>栈和队列的共同推广</strong>：只用<strong>一端</strong>进出，就退化成<strong>栈</strong>（后进先出）；<strong>一端进、另一端出</strong>，就是普通<strong>队列</strong>（先进先出）。四个方向都点点看。
    </p>

    <Playground>
      <DequeViz />
    </Playground>

    <p>
      deque 的经典用途是<strong>滑动窗口最值</strong>——用一个「单调队列」在两端维护候选，进出都
      <code>O(1)</code>；定长 deque 还能存「最近 N 条」历史 /
      撤销记录，挤满了就从另一端丢掉最旧的。另外还有一种带优先级的队列——<strong>优先队列</strong>，它总让「最小/最大」的先出，本质是一个<strong>堆</strong>（见堆那篇），和这里按位置进出的
      deque 是两回事。
    </p>

    <h2>队列在哪里用</h2>
    <p>队列天然适合「按到达顺序处理」的场景：</p>
    <Callout>
      <b>消息队列 / 任务调度</b>：先到的请求先处理，削峰填谷。<br />
      <b>BFS 广度优先搜索</b>：用队列按层扩展节点。<br />
      <b>打印机 / 缓冲区</b>：先发的文档先打印，数据先进先出。
    </Callout>
    <p>
      栈和队列是最基础的两种受限线性表。线性表家族里还有更通用的<strong>数组</strong>和<strong>链表</strong>，再往后才是有层次的非线性结构——<strong>树</strong>。
    </p>
  </Article>
</template>
