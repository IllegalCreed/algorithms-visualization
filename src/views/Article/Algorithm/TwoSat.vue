<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { twoSatModule } from '@/algorithms/twosat.module';
</script>

<template>
  <Article>
    <h1>2-SAT（布尔可满足性）</h1>
    <p class="sub">图算法 · 有向图连通性 · Tarjan 应用 · O(V+E)</p>

    <h2>给布尔变量找一组真值</h2>
    <p>
      有若干布尔变量 <code>A, B, C…</code> 和一堆<strong>二元子句</strong>，每个形如
      <code>(a ∨ b)</code>（a、b 是某个变量或它的否定，至少一个为真）。问：能否给每个变量赋
      真/假，让<strong>所有子句同时成立</strong>？这就是 <strong>2-SAT</strong>。一般的 SAT 是 NP
      完全的，但每子句只有两个文字的 2-SAT 有<strong>线性时间</strong>解法——秘密就在
      <router-link to="/docs/scc">强连通分量</router-link>。
    </p>

    <h2>子句变成蕴含边</h2>
    <p>
      把每个变量 <code>x</code> 拆成两个<strong>文字节点</strong>：<code>x</code>（取真）与
      <code>¬x</code>（取假），共 <code>2n</code> 个点。一条子句
      <code>(a ∨ b)</code> 「至少一个为真」等价于两条<strong>蕴含</strong>：<strong
        ><code>¬a → b</code></strong
      >（若 a 假，则 b 必真）和 <strong><code>¬b → a</code></strong
      >。把所有子句都翻成蕴含边，得到一张<strong>蕴含图</strong>——蕴含具有传递性，正好是有向图上的<strong>可达性</strong>。
    </p>

    <h2>用强连通分量判定 + 赋值</h2>
    <p>
      在蕴含图上跑
      <router-link to="/docs/scc">Tarjan</router-link>
      求强连通分量。<strong>核心判据</strong>：若某个 <code>x</code> 与它的否定
      <code>¬x</code> 落在<strong>同一个 SCC</strong>，说明「x 真」能推出「x
      假」、反之亦然——自相矛盾，<strong>无解</strong>。否则一定<strong>有解</strong>，并且赋值也现成：SCC
      缩点后是 DAG，取每个变量里<strong>拓扑序更靠后</strong>的那个文字为真即可。Tarjan 给每个 SCC
      的编号 <code>comp</code> 恰好是<strong>逆拓扑序</strong>，所以判据可写成
      <strong><code>x = 真 ⟺ comp[x] &lt; comp[¬x]</code></strong
      >。
    </p>
    <p>
      下面固定 3 个变量、4 条子句
      <code>(A∨B) ∧ (A∨¬B) ∧ (A∨C) ∧ (¬A∨¬B)</code
      >。点<strong>「下一步」</strong>逐步看：先逐条把子句<strong>翻成两条蕴含边</strong>，再跑
      Tarjan <strong>逐个把 SCC 着色</strong>（同色一组），然后<strong>蓝环</strong>逐变量高亮
      <code>x / ¬x</code> 确认它们<strong>不同组</strong>（可满足），最后按 <code>comp</code>
      逐变量赋值、节点标上<strong>真/假</strong>。走到底得到可满足解
      <strong>A=真、B=假、C=真</strong>。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="twoSatModule" />

    <h2>为什么这么快</h2>
    <Callout>
      <b>两条蕴含</b>：<code>(a∨b)</code> ⟺ <code>¬a→b</code> 且 <code>¬b→a</code>。<br />
      <b>无解判据</b>：存在变量使 <code>x</code> 与 <code>¬x</code> 同 SCC。<br />
      <b>赋值</b>：否则取 <code>comp[x] &lt; comp[¬x]</code>（拓扑序更后者）为真。<br />
      <b>复杂度</b>：建图 O(子句数) + 一趟 Tarjan O(V+E)，整体线性。
    </Callout>
    <p>
      这正是
      <router-link to="/docs/scc">强连通分量</router-link>
      最漂亮的应用之一：SCC 不只是「找环」，它把「相互蕴含 =
      必须同真同假」这件事一次性算清楚，于是一个看似组合爆炸的可满足性问题被压成了<strong>线性时间</strong>。许多约束问题（开关取舍、二选一排班、图着色的特例）都能归约成
      2-SAT。
    </p>
  </Article>
</template>
