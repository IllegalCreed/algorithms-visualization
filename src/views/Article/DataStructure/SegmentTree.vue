<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import Playground from '@/components/article/Playground.vue';
import SegTreeViz from '@/components/structures/SegTreeViz.vue';
</script>

<template>
  <Article>
    <h1>线段树 Segment Tree</h1>
    <p class="sub">数据结构 · 每个节点管一段区间，存这段的聚合</p>

    <h2>什么是线段树</h2>
    <p>
      要反复求「数组某一段的和（或最值）」，逐个累加是
      <code>O(n)</code
      >，区间一长就慢。线段树把数组建成一棵<strong>二叉树</strong>：每个节点<strong>管一段区间、存这段的聚合值</strong>（这里用<strong>和</strong>）。根管整个数组，往下对半分，叶子是单个元素——父节点的和正好是左右孩子之和。
    </p>
    <p>
      这里给 8 个数 <code>[2, 5, 1, 4, 9, 3, 7, 6]</code> 建了一棵求和线段树（共 15 个节点，根的和是
      37）。填两个下标
      a、b：点<strong>「区间和」</strong>看它怎么把一段拆成几个<strong>「现成的整段」</strong>相加；点<strong>「更新」</strong>把第
      a 个元素改成 b，看改一个数只牵动一条<strong>叶→根</strong>的路径。
    </p>

    <Playground>
      <SegTreeViz />
    </Playground>

    <p>
      区间查询的诀窍：把目标区间拆成
      <code>O(log n)</code>
      个「正好被某个节点完整覆盖」的<strong>整段</strong>，直接取它们存好的和，不必逐个累加。<strong>单点更新</strong>也只动叶子到根的<strong>一条路径</strong>，同样
      <code>O(log n)</code>。要做<strong>区间整体修改</strong>（比如把一段都加
      5），还能配<strong>「懒标记」</strong>把更新延迟下推、批量处理。
    </p>
    <p>
      另有一个更省空间的同类结构——<strong>树状数组（Fenwick / BIT）</strong>，用一维数组 +
      <code>lowbit</code>
      巧算前缀和，代码更短更省内存，但不如线段树直观、也没这么通用（线段树能装和、最值、最大子段和等各种聚合）。
    </p>

    <h2>线段树在哪里用</h2>
    <Callout>
      <b>区间和 / 区间最值 / 区间统计</b>：反复查询又夹杂修改的场景。<br />
      <b>算法竞赛重器</b>：区间问题的标配，配懒标记还能区间修改。<br />
      <b>数据库 / 时序聚合</b>：按区间汇总指标的底层思路。
    </Callout>
    <p>它把<strong>「树 + 数组聚合」</strong>用到了极致——也是这趟结构之旅里很硬核的一站。</p>
  </Article>
</template>
