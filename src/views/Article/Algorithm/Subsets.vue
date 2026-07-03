<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { subsetsModule } from '@/algorithms/subsets.module';
</script>

<template>
  <Article>
    <h1>子集生成</h1>
    <p class="sub">回溯与搜索 · 决策树 DFS</p>

    <h2>枚举一个集合的所有子集</h2>
    <p>
      给一个集合
      <code>{1, 2, 3}</code
      >，列出它的<strong>全部子集</strong>（包括空集和它自己）——这些子集的集合叫<strong>幂集</strong>。<code
        >n</code
      >
      个元素共有
      <code>2^n</code>
      个子集。怎么不重不漏地枚举出来？这是<strong>回溯</strong>的又一经典范例，而且它把回溯的另一半心智模型——<strong>决策树</strong>——展现得最清楚。
    </p>

    <h2>把「选还是不选」画成一棵决策树</h2>
    <p>
      对每个元素，只有两种选择：<strong>选它</strong>，或<strong>不选它</strong>。于是「依次对
      <code>1、2、3</code>
      做决定」就构成一棵<strong>二叉决策树</strong>：从根出发，每往下一层就对一个元素拍板选/不选，走到<strong>叶子</strong>（三个元素都决定完）时，一路上「选」进来的元素就凑成了一个子集。<code
        >2^3 = 8</code
      >
      个叶子，恰好对应 8 个子集。
    </p>
    <p>
      <strong>回溯</strong
      >就是<strong>深度优先地走遍这棵决策树</strong>：先一头扎到底（一路「选」），到叶子记下一个子集；然后<strong>退回上一步</strong>，把最后那个决定从「选」改成「不选」，再往下走……如此<strong
        >前进 → 到底 → 回退换选择</strong
      >，直到整棵树走完。「退回上一步、撤销刚才的选择」正是<strong>回溯</strong>一词的由来。
    </p>
    <p>
      下面是元素
      <code>[1, 2, 3]</code>
      的完整决策树。点<strong>「下一步」</strong>逐步看：<strong>当前节点</strong>琥珀高亮，<strong>当前这条根到底的路径</strong>连起来高亮（就是此刻递归栈里的选择）；每条边标着这一步的决定（<strong
        >选 k</strong
      >
      /
      <strong>跳过 k</strong
      >）；走到叶子就把它<strong>标绿</strong>、记录一个子集；一条子树走完就<strong>回溯</strong>去试另一条分支。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="subsetsModule" />

    <p>
      注意这棵决策树的形状：<strong>每个内部节点分出「选 / 不选」两枝</strong>，深度
      <code>n</code>、叶子 <code>2^n</code>——这正是子集数为
      <code>2^n</code> 的直观解释。回溯并不比「暴力枚举全部
      <code>2^n</code>
      种情况」更快（子集问题本就有指数多个答案），它的价值在于<strong
        >用一套统一的「递归 + 撤销」框架，系统地、不重不漏地走遍解空间</strong
      >。
    </p>

    <h2>决策树：回溯的通用心智模型</h2>
    <Callout>
      几乎所有回溯题都是在一棵决策树上做 DFS，区别只在「每一步有哪些选择」「什么时候剪枝」：<br />
      <b>子集</b>：每个元素选 / 不选（本页）。<b>组合</b>：从剩余元素里挑，避免重复。<br />
      <b>全排列</b
      >：每步从<b>没用过</b>的元素里挑一个。<b>组合总和</b>：挑到和超标就<b>剪枝</b>回退。<br />
      连
      <router-link to="/docs/n-queens">N 皇后</router-link>
      也是——只是它的决策树画在棋盘上（每列选哪一行）。
    </Callout>
    <p>
      对比看：<router-link to="/docs/n-queens">N 皇后</router-link>
      用<strong>棋盘</strong>呈现「约束满足」的回溯，本页用<strong>决策树</strong>呈现「组合枚举」的回溯——两种视角，同一套
      DFS + 剪枝 + 回退。
    </p>
  </Article>
</template>
