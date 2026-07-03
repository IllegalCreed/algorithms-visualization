<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { editDistModule } from '@/algorithms/editdist.module';
</script>

<template>
  <Article>
    <h1>编辑距离</h1>
    <p class="sub">动态规划 · 字符串 · Levenshtein 距离</p>

    <h2>把一个词改成另一个词，最少几步</h2>
    <p>
      把 <code>SAT</code> 改成
      <code>SUN</code
      >，每步可以<strong>插入</strong>、<strong>删除</strong>或<strong>替换</strong>一个字符，最少要几步？这个「最少编辑次数」就是<strong>编辑距离</strong>，是拼写纠错、文本
      diff、DNA 序列比对的核心。逐一枚举改法会爆炸，<strong>动态规划</strong>能优雅解决。
    </p>

    <h2>用一张表填出答案</h2>
    <p>
      设 <code>dp[i][j]</code> = 把「源串前 <code>i</code> 个字符」变成「目标串前
      <code>j</code> 个字符」的最少编辑次数。<strong>边界</strong>：把空串变成
      <code>j</code> 个字符要插 <code>j</code> 次（第 0 行 = 0,1,2,…）；把
      <code>i</code> 个字符变成空串要删 <code>i</code> 次（第 0 列同理）。
    </p>
    <p>
      然后<strong>逐格填</strong>——每个
      <code>dp[i][j]</code>
      只看它的<strong>三个邻居</strong>：<strong>左上</strong>（都不动/替换）、<strong>上</strong>（删）、<strong>左</strong>（插）。若当前两个字符<strong>相同</strong>，不用编辑，直接取<strong>左上</strong>；若<strong>不同</strong>，取<strong
        >三个邻居的最小值 + 1</strong
      >。填到<strong>右下角</strong>就是答案。
    </p>
    <p>
      下面固定
      <code>SAT → SUN</code
      >。点<strong>「下一步」</strong>逐格看：当前格<strong>琥珀环</strong>，它依赖的邻居格<strong>黄色高亮</strong>，字符相同（绿）取左上、不同取
      1+min 三邻——填入即<strong>变绿</strong>。走到底，右下角
      <strong>= 2</strong>（SAT→SUN：A→U、T→N 两次替换）。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="editDistModule" />

    <p>
      这就是动态规划的精髓：<strong>大问题拆成子问题、子问题的解填进表格、后面的直接查表复用</strong>。每格
      <code>O(1)</code>、共 <code>O(m·n)</code> 格，远快于枚举。递推式「相同取左上、不同 1+min
      三邻」正是把「插/删/替」三种操作对应到三个邻居方向。
    </p>

    <h2>编辑距离在哪里用</h2>
    <Callout>
      <b>拼写纠错 / 模糊搜索</b>：找与输入编辑距离最小的候选词。<br />
      <b>文本 diff / 版本对比</b>：Git、编辑器的差异算法都由它变体而来。<br />
      <b>生物信息</b>：DNA / 蛋白质序列比对。它是<b>二维矩阵 DP</b> 的最经典范例。
    </Callout>
    <p>
      同样「填矩阵」的动态规划还有很多——最长公共子序列、背包等，都是在一张表上按递推式逐格填。想看另一种「矩阵
      DP」，可回看 <strong>Floyd 多源最短路</strong>（距离矩阵逐点中转）。
    </p>
  </Article>
</template>
