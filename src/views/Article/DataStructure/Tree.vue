<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import Playground from '@/components/article/Playground.vue';
import TreeViz from '@/components/structures/TreeViz.vue';
</script>

<template>
  <Article>
    <h1>树 Tree</h1>
    <p class="sub">数据结构 · 有层次的非线性结构（二叉搜索树）</p>

    <h2>什么是树</h2>
    <p>
      前面的栈、队列、数组、链表都是<strong>线性</strong>的——元素排成一条线。<strong>树</strong>不一样：它从一个<strong>根</strong>节点出发，每个节点向下长出若干<strong>子</strong>节点，像一棵倒过来的树，是<strong>非线性</strong>的层次结构。
    </p>
    <p>
      最常用的是<strong>二叉搜索树（BST）</strong>：每个节点最多两个孩子，且永远满足<strong>左子树都比它小、右子树都比它大</strong>。这条规矩让查找像猜数字一样高效——下面输入一个数试试<strong>插入</strong>或<strong>查找</strong>，看它怎么从根一路比较着往下走。
    </p>

    <Playground>
      <TreeViz />
    </Playground>

    <p>
      看见了吗——插入 <code>35</code>：和根 <code>50</code> 比，小，走左；和
      <code>30</code>
      比，大，走右；右边空了，就落在那。<strong>每下一层就排除掉一半</strong>，所以一棵平衡的 BST
      查找只要
      <code>O(log n)</code
      >。再点「中序遍历」——按<strong>左→根→右</strong>的顺序走一遍，吐出来的正好是<strong>升序</strong>，这是
      BST 最漂亮的性质。
    </p>

    <h2>树在哪里用</h2>
    <Callout>
      <b>有序查找 / 范围查询</b>：BST、红黑树、B 树是数据库和索引的核心。<br />
      <b>堆</b>：用完全二叉树实现的优先队列（下一篇就讲）。<br />
      <b>层次结构</b>：文件系统目录、DOM、表达式解析树都是树。
    </Callout>
    <p>
      树把「一条线」升级成「会分叉的层次」。下一篇讲<strong>堆</strong>——一种用数组装的完全二叉树。
    </p>
  </Article>
</template>
