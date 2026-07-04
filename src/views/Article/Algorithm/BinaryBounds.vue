<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { bboundModule } from '@/algorithms/bbound.module';
</script>

<template>
  <Article>
    <h1>二分边界（lower / upper bound）</h1>
    <p class="sub">查找 · 半开区间模板 · 等值区间与计数</p>

    <h2>重复元素问的不是「在不在」</h2>
    <p>
      <router-link to="/docs/binary-search">基础二分</router-link
      >返回任意一个命中位置；可数组里有一段
      <code>2, 2, 2</code> 时，真正常问的是<strong>边界</strong>：<strong>lower_bound</strong> =
      第一个 <code>≥ t</code> 的位置、<strong>upper_bound</strong> = 第一个
      <code>&gt; t</code> 的位置。两界夹出<strong>等值区间</strong> <code>[lb, ub)</code>——出现次数
      = <code>ub − lb</code>，插入保序的落点也是它。
    </p>

    <h2>半开区间：两分支，不特判</h2>
    <p>
      模板换成<strong>半开区间</strong> <code>[lo, hi)</code>、<code>while (lo &lt; hi)</code>：mid
      太小就 <code>lo = mid + 1</code>；否则 <code>hi = mid</code>——注意<strong
        >mid 自己可能就是答案，所以 hi 不减一</strong
      >。没有 found、没有 −1，三分支变两分支，lo 与 hi 相遇点就是答案。下面两阶段找
      <code>target = 2</code>：lower_bound 收敛到 <strong>1</strong>、upper_bound 收敛到
      <strong>4</strong>，最后三个 2 全部点亮。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="bboundModule" />

    <h2>模板的力量</h2>
    <Callout>
      <b>不变量</b>：lo 左边全 &lt; t（或 ≤ t）、hi 起全 ≥ t（或 &gt; t）——收缩永远不丢答案。<br />
      <b>不存在</b>：lb == ub，count = 0，无需任何特判；lb 同时是保序插入位。<br />
      <b>相遇必答</b>：区间每轮严格缩小，必在答案处相遇——不会死循环。<br />
      <b>工程对应</b>：C++ <code>lower_bound / upper_bound / equal_range</code>、Python
      <code>bisect_left / bisect_right</code>、Java <code>Collections.binarySearch</code> 变体。
    </Callout>
    <p>
      「第一个满足条件的位置」这个抽象比「找值」更普适：条件从
      <code>≥ t</code> 换成任何<strong>单调谓词</strong>（前 false 后
      true），模板原封不动——这正是<strong>二分答案</strong>的入口，也是旋转数组等变形的基石，都在本大类后面几页。
    </p>
  </Article>
</template>
