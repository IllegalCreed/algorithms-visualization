<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import Playground from '@/components/article/Playground.vue';
import TrieViz from '@/components/structures/TrieViz.vue';
</script>

<template>
  <Article>
    <h1>字典树 Trie</h1>
    <p class="sub">数据结构 · 把字符摊在边上的前缀树</p>

    <h2>什么是字典树</h2>
    <p>
      前面的<strong>树</strong>（BST）每个节点存一个<strong>值</strong>、靠比较大小找路；<strong>哈希表</strong>把整个键<strong>散列</strong>成一个桶号。字典树（Trie，又叫前缀树）换了个思路——<strong>字符在边上</strong>，从根到某个节点的一条<strong>路径</strong>，正好拼出一个字符串。一个词不是存在某一个节点里，而是<strong>摊成一条路径</strong>。
    </p>
    <p>
      这里固定放了 6 个词 <code>[cat, car, card, cup, do, dog]</code>。注意 cat/car/card/cup
      都<strong>共用开头的 c→a…</strong
      >（共享前缀），既省地方又快。查找一个词只看它<strong>有多长</strong>（<code>O(L)</code>，L
      是词长），跟一共存了多少词<strong>无关</strong>。点「查找」「前缀」试试。
    </p>

    <Playground>
      <TrieViz />
    </Playground>

    <p>
      查找有<strong>三种结局</strong>：走着走着<strong>没有往下的边</strong>了 →
      不存在；走到了、但这个节点<strong>不是单词结尾</strong> → 「只是前缀、不算一个词」（比如
      <code>ca</code>）；走到底<strong>且是结尾</strong> → 这是一个词。<strong
        >「前缀 ≠ 单词」</strong
      >是字典树的关键——所以每个单词的结尾节点要特别标记（带深绿环的那些）。
    </p>
    <p>
      它真正的<strong>看家本领是前缀查询</strong>：走到前缀节点，把下面<strong>整棵子树</strong>点亮，就是所有以它开头的词——这就是<strong>自动补全</strong>。哈希表把键打散、根本没有「前缀」这个概念，<strong>做不到</strong>这件事。这也正是字典树值得单独成为一种结构、而不是树或哈希表的「子类」的原因。
    </p>

    <h2>字典树在哪里用</h2>
    <Callout>
      <b>自动补全 / 搜索建议</b>：输入框边打边提示，就是前缀查询。<br />
      <b>拼写检查 / 词典</b>：快速判断一个词在不在、有哪些近似词。<br />
      <b>IP 路由 / 最长前缀匹配</b>：路由器按地址前缀转发。<br />
      <b>敏感词过滤</b>：一遍扫描匹配大量前缀。
    </Callout>
    <p>
      和它对比着记：<strong>BST</strong> 是「值在节点、比较大小」，<strong>哈希表</strong>
      是「整键散列、无前缀」，<strong>字典树</strong>
      是「字符在边、前缀共享」——三者各擅其长。
    </p>
  </Article>
</template>
