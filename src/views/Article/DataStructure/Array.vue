<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import Playground from '@/components/article/Playground.vue';
import ArrayViz from '@/components/structures/ArrayViz.vue';
import ArrayGrowViz from '@/components/structures/ArrayGrowViz.vue';
</script>

<template>
  <Article>
    <h1>数组 Array</h1>
    <p class="sub">数据结构 · 连续内存里的带下标序列</p>

    <h2>什么是数组</h2>
    <p>
      数组是一段<strong>连续</strong>的内存，里面挨个排着同类型的元素。每个元素都有一个从
      <code>0</code> 开始的<strong>下标</strong>（index）。要取第 <code>i</code>
      个元素，直接按下标一步到位、不用从头挨个找——这叫<strong>随机访问</strong>，时间复杂度
      <code>O(1)</code>。
    </p>
    <p>
      但代价藏在改动里：因为元素必须保持连续，往中间<strong>插入</strong>一个，下标
      <code>i</code>
      往后的元素就得<strong>整体右移一格</strong>腾位；<strong>删除</strong>一个，后面的又得<strong>左移补位</strong>。这两步都是
      <code>O(n)</code>。下面亲手试试——<strong>点一个格子选中它的下标</strong>，再用工具栏操作。
    </p>

    <Playground>
      <ArrayViz />
    </Playground>

    <p>
      点中下标
      <code>2</code> 按「访问」，它<strong>瞬间</strong>高亮，不管数组多长都一样快。再按「在 2
      处插入」，看下标
      <code>2</code>
      起的元素怎么<strong>排队右移</strong>给新元素让位；删除则反过来左移补位；而「尾部追加」放在末尾，谁也不用动，
      <code>O(1)</code
      >。插几次后你会发现：<strong>下标和值不再相等</strong>——下标是位置，值是内容，本就是两码事。
    </p>

    <h2>动态数组：容量满了怎么办——翻倍扩容</h2>
    <p>
      上面这个数组容量是<strong>固定</strong>的。可现实里我们天天用的「数组」——JS 的
      <code>Array</code>、C++ 的 <code>vector</code>、Java 的 <code>ArrayList</code>、Python 的
      <code>list</code>——却能<strong>一直 append</strong> 下去，靠的就是<strong>动态扩容</strong>。
    </p>
    <p>
      它的办法是：当容量<strong>正好装满</strong>、还要再放，就开一个<strong>2 倍大</strong
      >的新数组，把旧元素<strong>逐个拷过去</strong>（<code>O(n)</code>），再放新元素。拷贝很贵，但只在「装满」那一刻才发生。一直点「追加」试试。
    </p>

    <Playground>
      <ArrayGrowViz />
    </Playground>

    <p>
      关键全在「<strong>翻倍</strong>」上：容量 <code>4 → 8 → 16 → …</code>
      指数增长，扩容越来越<strong>稀疏</strong>。把每次扩容的拷贝成本<strong>摊到</strong>它之后那一大批
      <code>append</code> 上，平均下来每次
      <code>append</code> 只花<strong>常数次</strong>操作——这就是「尾部追加<strong>均摊 O(1)</strong
      >」的<strong>摊还分析</strong>。看右边那个均摊读数，无论追加多少次它始终<strong>有界</strong>，不会越长越慢。
    </p>

    <h2>数组在哪里用</h2>
    <p>几乎无处不在，凡是「按编号快速取用、整体顺序存放」的场景都靠它：</p>
    <Callout>
      <b>查表 / 缓冲区</b>：按下标 O(1) 直取，最适合频繁随机读。<br />
      <b>矩阵 / 图像像素</b>：二维数组就是「数组的数组」。<br />
      <b>其它结构的底座</b>：栈、队列、堆、哈希表的底层多半都是一段数组。
    </Callout>
    <p>
      数组胜在随机访问、败在中间增删要搬移。下一篇讲<strong>链表</strong>——它把元素用指针串起来，增删只改指针、不搬移，正好和数组互为镜像。
    </p>
  </Article>
</template>
