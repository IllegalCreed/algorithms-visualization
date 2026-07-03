<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { combsumModule } from '@/algorithms/combsum.module';
</script>

<template>
  <Article>
    <h1>组合总和</h1>
    <p class="sub">回溯与搜索 · 决策树剪枝</p>

    <h2>凑出目标和</h2>
    <p>
      给一组数
      <code>[1, 2, 3, 4]</code> 和一个目标
      <code>5</code
      >，从中选出若干个（每个数<strong>最多用一次</strong>），使它们的和<strong>恰好等于目标</strong>——列出所有这样的组合。这里的答案是
      <code>{1, 4}</code> 和
      <code>{2, 3}</code
      >。这仍是<strong>回溯</strong>，但它引出了回溯真正高效的关键：<strong>剪枝</strong>。
    </p>

    <h2>剪枝：不去走注定失败的路</h2>
    <p>
      我们仍在一棵<strong>决策树</strong>上搜索：每一步<strong>再加入一个数</strong>（为避免重复，只从<strong>后面</strong>的数里选）。但和前几页不同，这里每个节点都带一个<strong>当前和</strong>。一旦加入某个数使<strong>当前和超过目标</strong>，这条分支<strong>再往下走也不可能成解</strong>——于是直接<strong>砍掉</strong>它、不再展开。这就是<strong>剪枝</strong>：提前判断死路，避免徒劳的搜索。
    </p>
    <p>
      下面是候选
      <code>[1, 2, 3, 4]</code>、目标
      <code>5</code>
      的决策树。点<strong>「下一步」</strong>逐步看：每条边表示<strong>加入了哪个数</strong>、节点显示<strong>当前和</strong>；和
      <strong>= 5</strong> 的节点<strong>标绿</strong>（一个解），和
      <strong>&gt; 5</strong>
      的分支<strong>标红剪掉</strong>（<strong>剪枝</strong>，不再展开），其余继续深入；一支走完就<strong>回溯</strong>换下一个数。留意有多少分支被剪枝提前砍掉——这正是剪枝省下的搜索。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="combsumModule" />

    <p>
      剪枝不改变<strong>答案</strong>，只砍掉<strong>不可能有答案的分支</strong>，让搜索规模大幅缩小。好的剪枝往往是回溯能否跑得动的关键——<router-link
        to="/docs/n-queens"
        >N 皇后</router-link
      >
      里「与已放皇后冲突就换一行」其实也是一种剪枝。本页的判据最直白：<strong
        >当前和 &gt; 目标就砍</strong
      >。
    </p>

    <h2>回溯三要素，到此凑齐</h2>
    <Callout>
      回溯 = <b>试探</b>（往下做一个选择）+ <b>剪枝</b>（提前否掉注定失败的分支）+
      <b>回溯</b>（撤销选择、退回去换一个）。<br />
      <router-link to="/docs/n-queens">N 皇后</router-link>：棋盘约束试探 + 冲突剪枝。<router-link
        to="/docs/subsets"
        >子集</router-link
      >：选/不选（无剪枝，全枚举）。<br />
      <router-link to="/docs/permutations">全排列</router-link
      >：已用元素剪枝。<b>组合总和</b>：<b>超目标剪枝</b>——把「剪枝」讲到最直观。
    </Callout>
    <p>
      同一套 DFS
      骨架，配上不同的<strong>选择集</strong>与<strong>剪枝规则</strong>，就能解决约束满足、组合枚举、路径搜索一大类问题——这就是回溯与搜索的通用力量。
    </p>
  </Article>
</template>
