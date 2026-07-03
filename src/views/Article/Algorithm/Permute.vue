<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { permuteModule } from '@/algorithms/permute.module';
</script>

<template>
  <Article>
    <h1>全排列</h1>
    <p class="sub">回溯与搜索 · 决策树 DFS</p>

    <h2>列出所有排列</h2>
    <p>
      给一组互不相同的元素
      <code>[1, 2, 3]</code>，列出它们的<strong>全部排列</strong>——即所有「谁在第 1 位、谁在第 2
      位……」的顺序。<code>n</code> 个元素共有
      <code>n! = n × (n−1) × … × 1</code>
      个排列。这也是<strong>回溯</strong>的经典范例，和<router-link to="/docs/subsets"
        >子集生成</router-link
      >用的是<strong>同一套决策树可视化</strong>，只是决策的方式不同。
    </p>

    <h2>每个位置，从「剩下的」里挑一个</h2>
    <p>
      排列要求每个元素<strong>恰好用一次</strong>。所以在决策树上，每往下一层就为下一个位置<strong>从「还没用过」的元素里挑一个</strong>：根有
      <code>3</code> 个选择（第 1 位放谁），选定后剩 <code>2</code> 个（第 2 位），再剩
      <code>1</code>
      个（第 3 位）——分支数<strong>逐层收窄 3 → 2 → 1</strong
      >，走到叶子（元素用光）就得到一个完整排列，<code>3! = 6</code>
      个叶子对应 6 个排列。
    </p>
    <p>
      这正是它和<strong>子集</strong>的对照：子集对每个元素做<strong>「选 / 不选」</strong
      >的<strong>二叉</strong>决策（元素可要可不要）；排列在每个位置<strong>「从剩余里挑一个」</strong>做<strong>多叉</strong>决策（元素必用且不重复）。<strong>回溯</strong>的骨架完全一样——<strong
        >选一个 → 递归到底 → 撤销换下一个</strong
      >。「已经用过的元素直接跳过」就是这里的<strong>剪枝</strong>。
    </p>
    <p>
      下面是
      <code>[1, 2, 3]</code>
      的完整排列决策树。点<strong>「下一步」</strong>逐步看：<strong>当前节点</strong>琥珀高亮、<strong>根到当前的路径</strong>连起来高亮（此刻已挑的元素）；每条边标着这一步<strong>选了哪个元素</strong>；走到叶子就<strong>标绿</strong>、记录一个排列；一支走完就<strong>回溯</strong>去挑下一个剩余元素。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="permuteModule" />

    <p>
      注意分支数
      <code>3 → 2 → 1</code>
      相乘正好是 <code>3! = 6</code>——这就是排列数为 <code>n!</code>
      的直观来源。实现上通常用一个
      <code>used[]</code>
      标记谁已用过：进入一层前把选中的标为已用、递归、回来再<strong>撤销标记</strong>（回溯），保证每个元素在一条根到叶的路径上只出现一次。
    </p>

    <h2>排列在哪里用</h2>
    <Callout>
      <b>穷举顺序</b>：旅行商暴力解、任务排期、密码/字典序枚举。<br />
      <b>回溯家族</b>：排列与<router-link to="/docs/subsets">子集</router-link
      >、组合、组合总和同属「决策树 DFS」，区别只在每步的选择集与剪枝规则。<br />
      去重排列（含重复元素）只需在同层<b>跳过重复选择</b>——依旧是同一棵决策树上的剪枝。
    </Callout>
    <p>
      至此回溯与搜索大类有了三种视角：<router-link to="/docs/n-queens">N 皇后</router-link
      >（棋盘约束）、<router-link to="/docs/subsets">子集</router-link
      >（二叉决策树）、全排列（多叉决策树）——同一套 DFS + 剪枝 + 回退，套在不同的选择结构上。
    </p>
  </Article>
</template>
