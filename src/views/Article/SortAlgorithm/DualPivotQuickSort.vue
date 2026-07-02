<!-- src/views/Article/SortAlgorithm/DualPivotQuickSort.vue -->
<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { dualPivotQuickSortModule } from '@/algorithms/dual-pivot-quick.module';
</script>

<template>
  <Article>
    <h1>双轴快排 Dual-Pivot Quicksort</h1>
    <p class="sub">交换排序 · 快排变体 · Java Arrays.sort 实际采用</p>

    <h2>从一根轴到两根轴</h2>
    <p>
      普通快排一趟围着<strong>一个</strong>基准把数组劈成两段。2009 年 Yaroslavskiy
      提出：一趟干脆用<strong>两个基准</strong>（p ≤ q），把数组直接分成<strong>三段</strong>——<code
        >&lt; p</code
      >
      / <code>[p, q]</code> /
      <code>&gt; q</code
      >。段分得更碎、递归更浅，配合更少的元素搬动和更好的缓存局部性，实测普遍快过单轴快排——<strong
        >Java 7 起基本类型的 <code>Arrays.sort</code> 用的就是它</strong
      >。
    </p>

    <h2>双轴快排怎么做</h2>
    <p>
      取区间<strong>首尾两个元素当双基准</strong>：若 <code>a[lo] &gt; a[hi]</code>
      先交换两端，保证 p ≤ q（下面第 2、3 趟就会看到这一步）。然后还是熟悉的三指针
      <code>lt / i / gt</code> 扫描中间：<code>a[i] &lt; p</code> 就和
      <code>lt</code> 交换、两者右移；<code>a[i] &gt; q</code> 就和 <code>gt</code> 交换、<code
        >gt</code
      >
      左移（<code>i</code> 不动，换来的值还没查）；落在 <code>[p, q]</code> 之间就留在中段、<code
        >i</code
      >
      右移。扫描完把<strong>两个基准分别换到三段的交界处</strong>——p 归位到左段右侧、q
      归位到中段右侧，这两个位置<strong>直接钉死</strong>，再对剩下的三段分治。
    </p>
    <p>
      下面固定 8 个数
      <code>[3, 5, 9, 1, 6, 2, 4, 7]</code>。点<strong>「下一步」</strong>：首趟双基准
      p=3、q=7（两根<strong>紫柱</strong>），一趟扫出
      <code>[2,1] | 3 | [5,6,4] | 7 | [9]</code>——双基准归位钉死后，只剩左右两个小段进区间栈。留意第
      2、3 趟弹出的子区间首尾是反的，都要<strong>先交换两端</strong>再选双基准。
    </p>

    <AlgorithmPlayer :module="dualPivotQuickSortModule" />

    <h2>复杂度与为什么 Java 选它</h2>
    <p>
      平均
      <code>O(n log n)</code
      >、原地、不稳定，和单轴快排同级。优势在常数：一趟分三段让<strong>递归树更浅</strong>（约 log₃
      级），元素跨段搬动更少、访存更连续。Yaroslavskiy 的基准测试赢了当时 JDK 的单轴实现，于是 Java
      7 把基本类型的 <code>Arrays.sort</code>
      换成了它（工程版还叠加了五点取样选轴、小段转插入排序等细节，本页取首尾双基准展示主线）。
    </p>

    <Callout>
      <b>快速排序</b>：1 个基准 → 2 段（&lt; / ≥）。<br />
      <b>三路快排</b>：1 个基准 → 3 段（&lt; / == / &gt;），中段是<b>等值</b>，治大量重复。<br />
      <b>双轴快排</b>：2 个基准 → 3 段（&lt;p / [p,q] /
      &gt;q），中段是<b>区间</b>，通用数据更快——Java <code>Arrays.sort</code> 实际采用。
    </Callout>

    <p>
      它和<strong>三路快排</strong>是一对好对照：同样的 lt/i/gt
      三指针、同样「一趟三段」，一个靠「等于」收中段、一个靠「第二根轴」撑中段。两页对着单步走一遍，三指针划分这个技巧就吃透了。
    </p>
  </Article>
</template>
