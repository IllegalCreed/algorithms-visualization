<!-- src/views/Article/SortAlgorithm/ThreeWayQuickSort.vue -->
<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { threeWayQuickSortModule } from '@/algorithms/three-way-quick.module';
</script>

<template>
  <Article>
    <h1>三路快排 3-way Quicksort</h1>
    <p class="sub">交换排序 · 快排变体 · 荷兰国旗划分</p>

    <h2>普通快排的软肋</h2>
    <p>
      普通快排每趟只把数组分成<strong>「&lt; pivot」和「≥ pivot」两段</strong>，pivot
      自己归位。可一旦数组里有<strong>大量重复元素</strong>，等于 pivot
      的那些值会被反复塞进同一侧、一遍遍参与后续划分——递归变深，最坏退化到
      <code>O(n²)</code>。极端情况「全部相等」时，普通快排慢得离谱。
    </p>

    <h2>三路快排怎么做（荷兰国旗划分）</h2>
    <p>
      三路快排把一趟划分从「两段」升级成<strong>三段</strong>：<strong>&lt; pivot</strong> /
      <strong>== pivot</strong> / <strong>&gt; pivot</strong>。等于 pivot
      的元素<strong>一次性集中到中段、立即钉死</strong>，再也不参与递归——重复元素越多，省得越狠。这个「把一组数按某个基准劈成三段」的过程，就是经典的<strong
        >荷兰国旗问题（Dutch National Flag）</strong
      >。
    </p>
    <p>
      做法是三个指针 <code>lt / i / gt</code>：<code>lt</code> 是「小于区」的右边界、<code>gt</code>
      是「大于区」的左边界、<code>i</code> 是扫描游标。扫描时看 <code>a[i]</code> 和 pivot
      的关系——<strong>小于</strong>就和 <code>lt</code> 交换、<code>lt</code> 与
      <code>i</code> 同时右移；<strong>大于</strong>就和 <code>gt</code> 交换、<code>gt</code>
      左移（<code>i</code> 不动，因为换过来的值还没查过）；<strong>等于</strong>就只把
      <code>i</code> 右移、留在中段。当 <code>i</code> 越过 <code>gt</code>，三段就分好了。
    </p>
    <p>
      下面固定 8 个数 <code>[5, 3, 8, 3, 5, 8, 3, 5]</code>（只有 3、5、8
      三种值、大量重复）。点<strong>「下一步」</strong>看首趟划分（pivot=5）怎么把它们一趟分成
      <code>[3,3,3 | 5,5,5 | 8,8]</code>——中间那段 5
      <strong>直接钉死、不再递归</strong
      >，只剩左右两小段要处理。右侧区间栈显示「还有哪些段待划分」。
    </p>

    <AlgorithmPlayer :module="threeWayQuickSortModule" />

    <h2>复杂度与适用</h2>
    <p>
      和普通快排一样，平均
      <code>O(n log n)</code
      >、原地、不稳定。但在<strong>有大量重复键</strong>的数据上，三路快排把「等于
      pivot」的元素一次清掉，递归规模骤减——重复种类越少越接近
      <code>O(n)</code
      >。所以它是处理<strong>「键的取值范围小、重复多」</strong>场景的利器（如按枚举字段、评分、类别排序）。
    </p>

    <Callout>
      <b>普通快排</b>：两段划分（&lt; / ≥），重复多时等值元素反复参与递归 → 退化。<br />
      <b>三路快排</b>：三段划分（&lt; / == / &gt;），等值元素一次钉死 → 重复越多越快。<br />
      它正是 Java <code>Arrays.sort</code> 早期、以及不少标准库对偏斜数据的应对思路。
    </Callout>

    <p>
      想先复习普通快排的「基准 +
      区间栈」是怎么回事，可回看<strong>快速排序</strong>页——三路快排正是在它基础上，把划分从两段改成三段。
    </p>
  </Article>
</template>
