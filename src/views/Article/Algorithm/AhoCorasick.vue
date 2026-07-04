<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { ahoCorasickModule } from '@/algorithms/ahocorasick.module';
</script>

<template>
  <Article>
    <h1>AC 自动机（Aho-Corasick）</h1>
    <p class="sub">字符串 · 多模式匹配 · Trie + fail · O(n + m + z)</p>

    <h2>一次找出一大堆模式</h2>
    <p>
      前面的
      <router-link to="/docs/kmp">KMP</router-link>、<router-link to="/docs/rabin-karp"
        >Rabin-Karp</router-link
      >、<router-link to="/docs/boyer-moore">Boyer-Moore</router-link>
      都是<strong>单模式</strong>匹配——一次找一个模式。如果要在文本里同时找
      <strong>一组</strong>模式（比如敏感词过滤、多关键词高亮），挨个跑一遍太慢。<strong
        >AC 自动机（Aho-Corasick）</strong
      >把这组模式<strong>一次性</strong>编译成一台自动机，然后<strong>一趟</strong>扫过文本，就能报出所有出现（含重叠），复杂度
      <code>O(文本长 + 模式总长 + 命中数)</code>。
    </p>

    <h2>Trie + fail 指针</h2>
    <p>
      第一步：把所有模式塞进一棵
      <router-link to="/docs/trie">字典树 Trie</router-link>，共享前缀（<code>he</code> 和
      <code>hers</code> 共用 <code>h→e</code>）。第二步：给每个状态建一条
      <strong>fail 指针</strong>——它正是 <router-link to="/docs/kmp">KMP</router-link> 里<strong
        >部分匹配表 π 的多模式推广</strong
      >：<code>fail[u]</code> 指向「<code>u</code>
      代表的串的<strong>最长真后缀</strong>，且该后缀也是 Trie
      中的一条路径」。匹配失配时不必回退文本，顺着 fail 指针跳到这个「次好」的状态继续。
    </p>
    <p>
      fail 用 <strong>BFS</strong> 逐层构造（父的 fail 先算好才能算子的）：状态
      <code>u</code> 沿边字符 <code>c</code> 的孩子 <code>v</code>，其
      <code>fail[v] = goto(fail[u], c)</code>——沿 <code>u</code> 的 fail 链回退，直到某个状态有
      <code>c</code> 转移（否则回到根）。到达的每个状态还要沿 <strong>输出链</strong>（fail
      链上的终止状态）报告：这样在 <code>she</code> 处能<strong>顺带</strong>报出后缀
      <code>he</code>。
    </p>
    <p>
      下面固定模式 <code>{he, she, hers}</code>、文本
      <code>"ushers"</code>。点<strong>「下一步」</strong>逐步看：先<strong>逐模式建 Trie</strong
      >（节点上是入边字符、终点标模式名），再 <strong>BFS 建 fail</strong>（跨分支的
      <strong>非平凡 fail 边</strong>画成<strong>紫色虚线</strong>，如
      <code>she→he</code>；指向根的默认 fail
      只在字幕说明），最后<strong>文本逐字符匹配</strong>：<strong>琥珀环</strong>是当前状态，遇无转移沿
      <strong>fail 跳</strong>（虚线点亮）。走到底命中三处、且<strong>重叠</strong>：
      <code>she[1,3]</code
      >、<code>he[2,3]</code>、<code>hers[2,5]</code>。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="ahoCorasickModule" />

    <h2>fail 指针 = 多模式的 π</h2>
    <Callout>
      <b>建 Trie</b>：所有模式塞进前缀树，共享公共前缀。<br />
      <b>建 fail（BFS）</b>：<code>fail[v] = goto(fail[父], 边字符)</code>，沿 fail 链回退。<br />
      <b>匹配</b>：文本指针不回退；无转移沿 fail 跳；沿输出链报告所有命中。<br />
      <b>复杂度</b>：<code>O(n + m + z)</code>（文本长 + 模式总长 + 命中数）。
    </Callout>
    <p>
      把它和
      <router-link to="/docs/kmp">KMP</router-link>
      对照：KMP 在<strong>一条链</strong>上用 π 跳，AC 自动机在<strong>一棵 Trie</strong>上用 fail
      跳——同一个「失配就退到最长可用后缀」的思想，从单模式推广到多模式。这也是很多敏感词过滤、生物序列比对、入侵检测里多关键词扫描的底层引擎。
    </p>
  </Article>
</template>
