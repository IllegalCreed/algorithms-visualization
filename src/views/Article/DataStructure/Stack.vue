<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import Playground from '@/components/article/Playground.vue';
import StackViz from '@/components/structures/StackViz.vue';
</script>

<template>
  <Article>
    <h1>栈 Stack</h1>
    <p class="sub">数据结构 · 后进先出的线性表</p>

    <h2>什么是栈</h2>
    <p>
      栈是一种<strong>只能在一端操作</strong>的线性表。这一端叫<strong>栈顶</strong>，另一端是栈底。所有的添加和删除都只发生在栈顶——你没法从中间或底部插手。
    </p>
    <p>
      往栈顶放一个元素叫 <code>push</code>（压入），从栈顶拿走一个叫
      <code>pop</code>（弹出），只看一眼栈顶而不拿走叫
      <code>peek</code>。因为进出都在同一端，最后压进去的元素一定最先被弹出——这就是<strong
        >后进先出（LIFO，Last In First Out）</strong
      >。
    </p>

    <Playground>
      <StackViz />
    </Playground>

    <p>
      试试连压 <code>1</code>、<code>2</code>、<code>3</code>，再连弹两次——最先出来的是
      <strong>3</strong>，最后压进去的最先出来。无论栈里有多少元素，<code>push</code> 和
      <code>pop</code> 都只动栈顶那一个，所以它们的时间复杂度都是 <code>O(1)</code>。
    </p>

    <h2>栈在哪里用</h2>
    <p>
      栈最经典的身影是<strong>函数调用栈</strong>：每调用一个函数就 push 一个栈帧，函数返回就 pop
      掉——所以最后被调用的函数最先返回。此外还有：
    </p>
    <Callout>
      <b>撤销操作</b>：每步操作压栈，Ctrl+Z 就是弹栈回到上一步。<br />
      <b>括号匹配</b>：遇到左括号压栈，遇到右括号弹栈配对，栈空则匹配成功。<br />
      <b>浏览器后退</b>：每访问一个页面压栈，后退就是弹栈。
    </Callout>
    <p>往下还会接着讲<strong>队列</strong>——和栈相反，它是先进先出（FIFO），从一端进、另一端出。</p>
  </Article>
</template>
