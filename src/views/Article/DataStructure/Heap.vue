<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import Playground from '@/components/article/Playground.vue';
import HeapViz from '@/components/structures/HeapViz.vue';
</script>

<template>
  <Article>
    <h1>堆 Heap</h1>
    <p class="sub">数据结构 · 用数组装的完全二叉树（大顶堆）</p>

    <h2>什么是堆</h2>
    <p>
      堆还是一棵<strong>完全二叉树</strong>（从上到下、从左到右挨个填满，不留空），但它的规矩和 BST
      不同：大顶堆要求<strong>每个父节点都 ≥ 它的孩子</strong
      >，所以<strong>堆顶永远是最大值</strong>。它不比较左右大小，只管父子。
    </p>
    <p>
      最妙的是它<strong>不用指针、直接用一个数组装</strong>：下标 <code>i</code> 的左孩子是
      <code>2i+1</code>、右孩子 <code>2i+2</code>、父亲是
      <code>⌊(i-1)/2⌋</code
      >。下面上下两个视图是<strong>同一个堆</strong>——上面是数组、下面是树。输入一个数<strong>插入</strong>，看它从末尾<strong>上浮</strong>到该去的位置。
    </p>

    <Playground>
      <HeapViz />
    </Playground>

    <p>
      插入会先放到数组<strong>末尾</strong>（树的最后一个叶子），再一路和父亲比：比父亲大就交换、<strong>上浮</strong>，直到不再比父亲大。「弹出堆顶」则相反：取走最大的根，把末尾元素搬到根上，再和较大的孩子比、<strong>下沉</strong>归位。两步都只走一条到根的路径，所以是
      <code>O(log n)</code>。这正是<strong>优先队列</strong>和<strong>堆排序</strong>的核心。
    </p>

    <h2>堆在哪里用</h2>
    <Callout>
      <b>优先队列</b>：任务调度、Dijkstra 最短路，每次 O(log n) 取最值。<br />
      <b>堆排序</b>：反复弹出堆顶，得到有序序列。<br />
      <b>Top-K / 中位数</b>：用堆维护最大/最小的若干个。
    </Callout>
    <p>
      栈、队列、数组、链表、树、堆都讲完了，剩下两种更「跳跃」的结构——<strong>哈希表</strong>和<strong>图</strong>。
    </p>
  </Article>
</template>
