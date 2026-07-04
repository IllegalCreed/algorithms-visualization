<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { wordSearchModule } from '@/algorithms/wordsearch.module';
</script>

<template>
  <Article>
    <h1>单词搜索</h1>
    <p class="sub">回溯与搜索 · 网格 DFS</p>

    <h2>在字母网格里拼出一个单词</h2>
    <p>
      给一张字母网格和一个目标单词，问能不能沿<strong>上下左右相邻</strong>、且<strong>同一个格子不重复使用</strong>的路径把单词拼出来。它和
      <router-link to="/docs/maze">迷宫寻路</router-link> /
      <router-link to="/docs/number-of-islands">岛屿数量</router-link>同样是<strong>网格 DFS</strong
      >，但目标又不一样：迷宫<strong>找一条路</strong>、岛屿<strong>数连通块</strong>、单词搜索<strong>沿着匹配的字母找路径</strong>——而且这是三者里最贴合<strong>回溯</strong>本义的一种。
    </p>

    <h2>试探 → 失败 → 撤销 → 回退</h2>
    <p>
      从某个等于单词<strong>首字母</strong>的格子出发做
      <strong>DFS</strong
      >：当前格的字母对上了，就把它<strong>标记为已用</strong>（防止同一路径重复走），然后往四个方向找<strong>下一个字母</strong>；某个方向的字母不符就<strong>换方向</strong>；如果一个格子<strong>四个方向都走不通</strong>，说明此路不通——<strong>撤销刚才的标记、回退到上一格</strong>，接着试它剩下的方向。「撤销标记」这一步就是回溯的灵魂：回退后这个格子<strong>又能被别的路径使用</strong>了，这和迷宫的
      visited（一路累积、不撤销）正相反。
    </p>
    <p>
      下面固定一张 <code>3×4</code> 网格、目标词
      <strong>ADEE</strong
      >。点<strong>「下一步」</strong>逐步看：<strong>琥珀环</strong>是当前探查的格、<strong>琥珀路径</strong>是已匹配的字母串；留意开头——从左上角
      <strong>A(0,0)</strong> 出发找不到相邻的
      <strong>D</strong>，此路不通、<strong>撤销回退</strong>，换第二个
      <strong>A(2,0)</strong> 起点，沿<strong>底行</strong>
      <code>A→D→E→E</code> 一路匹配成功，整条路径<strong>变绿</strong>。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="wordSearchModule" />

    <p>
      单词搜索和 <router-link to="/docs/n-queens">N 皇后</router-link> /
      <router-link to="/docs/subsets">子集</router-link> /
      <router-link to="/docs/combination-sum">组合总和</router-link>
      是<strong>同一套回溯骨架</strong>，只是状态空间从棋盘、决策树换成了<strong>网格路径</strong>——「进入时标记、离开时撤销」让搜索能穷举而不越界。
    </p>

    <h2>单词搜索在哪里用</h2>
    <Callout>
      <b>拼字游戏 / Boggle</b>：判断能否在字母盘上连出某个词。<br />
      <b>路径约束搜索</b>：迷宫带钥匙、网格收集序列、棋盘连线消除。<br />
      <b>进阶</b>：一次找<b>很多</b>单词时，用
      <router-link to="/docs/trie">前缀树 Trie</router-link>
      把所有词组织起来一起搜（单词搜索 II），避免对每个词各扫一遍。
    </Callout>
    <p>
      至此网格搜索三形态齐了：<router-link to="/docs/maze">迷宫</router-link
      >（找一条路）、<router-link to="/docs/number-of-islands">岛屿</router-link
      >（数连通块）、单词搜索（带回溯的路径匹配）——同一张网格、同一套 DFS，目标不同、玩法各异。
    </p>
  </Article>
</template>
