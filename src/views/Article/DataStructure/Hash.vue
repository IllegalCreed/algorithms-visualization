<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import Playground from '@/components/article/Playground.vue';
import HashViz from '@/components/structures/HashViz.vue';
import HashProbeViz from '@/components/structures/HashProbeViz.vue';
</script>

<template>
  <Article>
    <h1>哈希表 Hash</h1>
    <p class="sub">数据结构 · 用散列函数把键直接算成下标</p>

    <h2>什么是哈希表</h2>
    <p>
      前面找一个元素，要么靠下标、要么顺着指针走。哈希表换了个思路——<strong>靠算</strong>：把键丢进一个<strong>散列函数</strong>，算出一个桶下标，<strong>直接跳过去</strong>存或取，平均只要
      <code>O(1)</code>，不用比较、不用遍历。
    </p>
    <p>
      这里用最简单的散列 <code>hash(key) = key % 7</code>（7
      个桶）。但麻烦来了：两个不同的键可能算出<strong>同一个桶</strong>——这叫<strong>哈希冲突</strong>。<strong>拉链法</strong>的办法是：每个桶挂一条<strong>链</strong>，冲突的键就<strong>追加到链尾</strong>。输入一个数试试插入或查找。
    </p>

    <Playground>
      <HashViz />
    </Playground>

    <p>
      看见了吗——插入 <code>11</code>：<code>11 % 7 = 4</code>，跳到 4
      号桶；如果桶里已经有元素，就<strong>挂到链尾</strong>（冲突）。查找也一样：先算出桶号直达，再<strong>沿那条链比较</strong>。只要散列均匀、链都很短，存取就接近
      <code>O(1)</code>；但如果都挤进一个桶、链很长，就退化成
      <code>O(n)</code>——所以<strong>好的散列函数</strong>和<strong>合适的桶数</strong>很关键。
    </p>

    <h2>另一种解冲突：开放寻址</h2>
    <p>
      拉链法把冲突的键挂到桶<strong>外</strong>的链上。还有一条完全不同的路——<strong>开放寻址</strong>：不挂链，所有键都住在<strong>同一张扁平数组</strong>里。冲突了怎么办？<strong>就在表内往后探一格</strong>，找到第一个空位坐下。这种「撞了就顺位往后找」的探测方式叫<strong>线性探测</strong>。
    </p>
    <p>
      还是 <code>hash(key) = key % 7</code>、还是那 4 个键 <code>[15, 8, 23, 4]</code>，这次散进 7
      格扁平表：<code>15</code> 去 1 号；<code>8</code> 也想去 1 号但被占了 → 探到 2 号；<code
        >23</code
      >
      想去 2 号又被占 → 探到 3 号；<code>4</code> 去 4
      号。冲突的键在表里<strong>挤成一簇</strong>（这叫<strong>聚集</strong>）——这正是开放寻址要付的代价。试试插入、查找。
    </p>

    <Playground>
      <HashProbeViz />
    </Playground>

    <p>
      查找也顺着同样的路探：从
      <code>hash</code>
      算出的「家」开始往后比，命中就停，<strong>探到空位</strong>就说明不在表中。右下角的<strong>装载因子</strong>（已用格数
      ÷ 总格数）是开放寻址的命脉：它越接近
      <code>1</code
      >，聚集越严重、探测链越长；一旦满了就再也插不进，必须<strong>扩容</strong>——开一张更大的表、把所有键<strong>重新散列</strong>（rehash）搬过去。所以实战里通常装载因子超过约
      <code>0.7</code> 就提前扩容。
    </p>
    <p>
      两种解冲突各有所长：<strong>拉链法</strong>实现简单、还能装下超过表长的元素；<strong>开放寻址</strong>数据都在一张表里、对
      CPU 缓存友好。Java 的 <code>HashMap</code> 用拉链法，Python 的 <code>dict</code>、Go 的
      <code>map</code> 则用开放寻址——没有银弹，看取舍。
    </p>

    <h2>哈希表在哪里用</h2>
    <Callout>
      <b>字典 / 映射</b>：几乎所有语言的 dict/map/object 底层都是哈希表。<br />
      <b>去重 / 集合</b>：Set 用哈希表 O(1) 判断存在。<br />
      <b>缓存 / 索引</b>：键值缓存、数据库哈希索引。
    </Callout>
    <p>只剩最后一种、也是最一般的结构了——<strong>图</strong>：顶点和边的任意连接。</p>
  </Article>
</template>
