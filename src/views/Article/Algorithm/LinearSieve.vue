<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { linearSieveModule } from '@/algorithms/linearsieve.module';
</script>

<template>
  <Article>
    <h1>线性筛（欧拉筛）</h1>
    <p class="sub">数学与数论 · 素数筛 · 每合数划一次 · O(N)</p>

    <h2>埃氏筛的浪费</h2>
    <p>
      <router-link to="/docs/sieve-of-eratosthenes">埃拉托斯特尼筛</router-link>
      已经很快，但它有个小浪费：同一个合数会被<strong>好几个素数</strong>重复划掉。比如
      <code>12</code> 会在处理 <code>2</code> 时被划（<code>2×6</code>）、在处理
      <code>3</code> 时又想划（<code>3×4</code>）。这些重复让它停在
      <code>O(N log log N)</code>
      而非严格线性。<strong>线性筛（欧拉筛）</strong>补上这一刀——让每个合数<strong>只被划一次</strong>，做到严格
      <code>O(N)</code>。
    </p>

    <h2>只被最小质因子划一次</h2>
    <p>
      关键改动：外层 <code>i</code> 不再只跳素数，而是<strong>遍历 2..N 的每一个数</strong
      >；对已经找到的每个素数 <code>p</code>（从小到大），划掉 <code>i × p</code>，并在
      <strong><code>i % p == 0</code> 时立即停</strong>。为什么这个
      <code>break</code> 就够了？因为当 <code>i % p == 0</code> 时，<code>p</code> 是
      <code>i</code> 的<strong>最小质因子</strong>；再往后用更大的 <code>p'</code> 去划
      <code>i × p'</code>，那个数的最小质因子其实是 <code>p</code>（藏在
      <code>i</code> 里），本该由后面某个 <code>i'</code> 来划——所以现在停手，就保证了<strong
        >每个合数 <code>i × p</code> 的最小质因子恰是 <code>p</code></strong
      >，且只在这一刻被划这一次。
    </p>
    <p>
      下面固定
      <code>N = 30</code
      >（和埃氏筛<strong>同一张网格</strong>，方便对比）。点<strong>「下一步」</strong>逐步看：<strong>琥珀环</strong>是当前
      <code>i</code>（注意它会停在合数上，因为外层遍历所有数）、<strong>红色</strong>是这一步划掉的
      <code>i × p</code
      >，每个合数<strong>右下角标注划它的那个素数</strong>（=它的最小质因子）。走到底，10
      个素数，且<strong>全网格没有一个合数被划第二次</strong>。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="linearSieveModule" />

    <h2>为什么恰好线性</h2>
    <Callout>
      <b>遍历所有 i</b>：外层不只跳素数，2..N 每个数都作一次「乘数」。<br />
      <b>i % p == 0 就停</b>：保证 i×p 的最小质因子是 p，不越界替别人划。<br />
      <b>每合数一次</b>：每个合数被且仅被它的最小质因子划一次 → 总操作数 = 合数个数 = O(N)。<br />
      <b>顺带</b>：过程中还免费得到每个数的最小质因子表，质因数分解 O(log x) 即得。
    </Callout>
    <p>
      线性筛的真正威力在于它能<strong>顺带批量计算积性函数</strong>：把
      <code>i % p == 0</code> 与否两种情况的递推挂上去，欧拉函数 <code>φ</code>、莫比乌斯函数
      <code>μ</code>、约数个数 <code>d</code> 等都能在同一趟
      <code>O(N)</code> 里全部算出——这正是它比<router-link to="/docs/sieve-of-eratosthenes"
        >埃氏筛</router-link
      >更受竞赛青睐的原因。
    </p>
  </Article>
</template>
