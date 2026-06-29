<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import Playground from '@/components/article/Playground.vue';
import BTreeViz from '@/components/structures/BTreeViz.vue';
</script>

<template>
  <Article>
    <h1>B 树与 B+ 树</h1>
    <p class="sub">数据结构 · 数据库与文件系统的索引</p>

    <h2>什么是 B 树</h2>
    <p>
      二叉查找树一个节点只存 1 个值、2 个孩子，数据一多就长得又瘦又高，查一次要走很多层。<strong
        >B 树</strong
      >反其道：一个节点存「<strong>一排有序 key + 一排孩子指针</strong
      >」，又<strong>矮又宽</strong>。所有叶子在同一层，几层就能在海量数据里定位——这正适合磁盘：一次
      IO 读一个节点（能装几十上百个 key），<strong>层数越少 IO 越少</strong>。
    </p>

    <h2>B+ 树：数据全在叶子 + 叶链</h2>
    <p>
      <strong>B+ 树</strong>是 B
      树的改良：内部节点只存「<strong>路标</strong>」做路由、不存数据，所有数据都落在<strong>叶子</strong>；叶子之间还用<strong>链表</strong>串起来。这样区间查询特别快——定位到起点叶子后，<strong>顺着叶链一路扫</strong>过去即可。MySQL
      InnoDB 主键索引、很多文件系统的目录索引，用的都是 B+ 树。
    </p>
    <p>
      下面是一棵装了 12 个数的 B+ 树（2 层）。填 a
      点<strong>「查找」</strong>看它从根<strong>下钻</strong>几层就命中；填 a、b
      点<strong>「范围查」</strong>看它定位起点叶后顺着<strong>叶链横扫</strong>一段。
    </p>

    <Playground>
      <BTreeViz />
    </Playground>

    <p>
      查找：从根开始，在节点的有序 key 里比较，决定走哪个孩子指针，几层就到叶子——<code
        >O(log n)</code
      >，但因为「<strong>多路</strong>」底数大，层数比二叉树少得多。范围查询：B+
      树<strong>定位一次再顺叶链扫</strong>，省去回树。插入太满时节点会<strong>「分裂」</strong>、删空会<strong>「合并」</strong>来保持平衡（这里是固定结构，分裂/合并只作了解）。
    </p>

    <h2>B 树 / B+ 树在哪里用</h2>
    <Callout>
      <b>数据库索引</b>：MySQL InnoDB 用的就是 B+ 树。<br />
      <b>文件系统</b>：目录 / inode 索引。<br />
      <b>任何「海量有序数据 + 按 key 查 + 范围扫」的磁盘场景</b>。
    </Callout>
    <p>
      它把<strong>「多路 + 平衡 + 磁盘友好」</strong>做到了极致——这趟结构之旅里工程味最浓的一站。
    </p>
  </Article>
</template>
