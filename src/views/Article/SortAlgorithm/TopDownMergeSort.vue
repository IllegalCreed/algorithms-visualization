<!-- src/views/Article/SortAlgorithm/TopDownMergeSort.vue -->
<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { topDownMergeSortModule } from '@/algorithms/top-down-merge.module';
</script>

<template>
  <Article>
    <h1>自顶向下归并 Top-Down Merge Sort</h1>
    <p class="sub">归并排序 · 递归分治 · 与迭代版对照</p>

    <h2>归并排序的另一种写法</h2>
    <p>
      站内的<strong>归并排序</strong>页走的是<strong>自底向上</strong>路线：不递归，段宽从 1
      开始一轮轮翻倍合并。本页是同一算法的另一种经典写法——<strong>自顶向下（递归分治）</strong>：<code
        >sort(lo, hi)</code
      >
      把区间<strong>对半劈开</strong>，先递归排好左半、再递归排好右半，回程时把两个有序半段<strong>合并</strong>成一段。递归到单个元素天然有序，就是分治的「底」。
    </p>

    <h2>递归怎么走：看调用栈</h2>
    <p>
      递归的执行轨迹就是一棵<strong>分治树</strong>，而机器执行它靠的是<strong>调用栈</strong>。下面播放器里右侧的栈轨显示的正是当前的递归调用链：<strong
        >压栈 = 下钻</strong
      >（区间对半、进入子问题），<strong>栈顶 = 正在处理的区间</strong>，合并完成后<strong
        >弹栈 = 返回上一层</strong
      >。温度计式的 temp 轨（同归并排序页）则展示每次合并：两段比较取小、依次写入 temp、整段拷回。
    </p>
    <p>
      下面固定 8 个数
      <code>[6, 3, 8, 1, 9, 2, 7, 4]</code>。点<strong>「下一步」</strong>：看栈先压到
      <code>[0,7] → [0,3] → [0,1]</code> 三层深，才做第一次合并
      <code>[6],[3] → [3,6]</code>；随后逐层回程合并、栈逐层收缩，最后合并 <code>[1,3,6,8]</code> 与
      <code>[2,4,7,9]</code> 得到全序。
    </p>

    <AlgorithmPlayer :module="topDownMergeSortModule" />

    <h2>复杂度与两种写法的取舍</h2>
    <p>
      与自底向上完全一致：时间 <code>O(n log n)</code>（每层合并共 O(n)、层数 log n）、额外空间
      <code>O(n)</code
      >（temp）、<strong>稳定</strong>。差别在驱动方式：递归版代码更贴近「分治」的思维模型，是教科书与面试的标准版本；迭代版省去递归调用开销、也不吃栈深，工程里两者都常见。
    </p>

    <Callout>
      <b>自顶向下（本页）</b
      >：递归下钻对半分，回程逐层合并——分治思想的标准载体，配调用栈看最清楚。<br />
      <b>自底向上（归并排序页）</b>：段宽 1→2→4→8 迭代翻倍——同一个 merge，不递归、免栈深。<br />
      两页的<b>合并过程一模一样</b>，对照着单步走一遍，「归并」就吃透了。
    </Callout>

    <p>
      递归 + 合并的组合还会在 <strong>TimSort</strong>（Python/Java
      实际使用的排序）里再升级——识别天然有序段再归并。那是排序线后面的进阶篇。
    </p>
  </Article>
</template>
