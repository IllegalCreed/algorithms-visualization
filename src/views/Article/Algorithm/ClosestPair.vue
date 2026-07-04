<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { closestPairModule } from '@/algorithms/closestpair.module';
</script>

<template>
  <Article>
    <h1>最近点对（分治）</h1>
    <p class="sub">计算几何 · 分治 + δ 带合并 · O(n log n)</p>

    <h2>离得最近的两个点</h2>
    <p>
      平面上 n 个点，找<strong>距离最近的两个</strong>——与<router-link to="/docs/rotating-calipers"
        >最远点对</router-link
      >正好对偶。暴力比较所有点对是 O(n²)；但「最近」没有「必在<router-link to="/docs/convex-hull"
        >凸包</router-link
      >上」这样的免费午餐（最近的点往往藏在内部），需要另一件武器：<strong>分治</strong>。
    </p>

    <h2>分而治之 + δ 带</h2>
    <p>
      把点按 x 排序，沿<strong>中线</strong>切成左右两半，各自<strong>递归</strong>求最近距离，取
      <code>δ = min(左, 右)</code
      >。麻烦在<strong>合并</strong>：最近的一对可能<strong>一只脚在左、一只脚在右</strong>。但注意——这样的点对两端都必须离中线不到
      δ，所以只需检查中线两侧 <strong>δ 宽的带</strong>。更妙的是把带内的点按
      <strong>y 排序</strong>后，每个点只需和 <strong>y 差小于 δ</strong> 的邻居比较：一个 δ×2δ
      的矩形里最多塞得下 <strong>8 个</strong>相距 ≥δ
      的点（鸽笼原理），所以每点只比<strong>常数次</strong>。合并 O(n)，整体
      <code>T(n) = 2T(n/2) + O(n) = O(n log n)</code>。
    </p>
    <p>
      下面固定 8
      个点。点<strong>「下一步」</strong>逐步看：<strong>紫色虚线</strong>是分治中线、左右两半各自求出最近对（<strong>绿线</strong>）定出
      δ，然后<strong>浅紫色带</strong>亮起——带内按 y
      序逐对比较（<strong>蓝色虚线</strong>），本例连刷两次：先 1.581、再
      <strong>1.118</strong>——最终答案<strong>恰好跨越中线</strong>，正是 δ
      带存在的意义。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="closestPairModule" />

    <h2>为什么合并只要 O(n)</h2>
    <Callout>
      <b>分治</b>：中线分半，δ = min(左最近, 右最近)。<br />
      <b>δ 带</b>：跨线的更近对两端必落在 |x − 中线| &lt; δ 的带内。<br />
      <b>鸽笼</b>：带内按 y 排序，每点只需比 y 差 &lt; δ 的至多 7 个邻居。<br />
      <b>复杂度</b>：T(n) = 2T(n/2) + O(n) = <code>O(n log n)</code>。
    </Callout>
    <p>
      最近点对是「<strong>分治 + 有序合并</strong
      >」在几何上的招牌应用，同一套思想还支撑着归并排序、逆序对计数、平面最近异色点对等问题。它也提醒我们：分治的难点常常不在「分」，而在<strong>合并时如何不漏掉跨越边界的答案</strong>——δ
      带就是那个精确的补网。
    </p>
  </Article>
</template>
