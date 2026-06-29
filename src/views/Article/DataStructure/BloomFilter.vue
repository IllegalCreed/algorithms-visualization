<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import Playground from '@/components/article/Playground.vue';
import BloomViz from '@/components/structures/BloomViz.vue';
</script>

<template>
  <Article>
    <h1>布隆过滤器 Bloom Filter</h1>
    <p class="sub">数据结构 · 概率型「在不在」判断</p>

    <h2>什么是布隆过滤器</h2>
    <p>
      要判断「这个元素在不在一个海量集合里」，用哈希表存全部元素又费内存。布隆过滤器换个思路：只用一个<strong
        >位数组</strong
      >
      +
      几个<strong>哈希函数</strong>，<strong>不存原始元素</strong>，空间省到极致。代价是——它会<strong>「误判」</strong>。
    </p>
    <p>
      <strong>加入</strong>元素：用 k 个哈希算出 k 个位置，把这些位都<strong>置 1</strong
      >。<strong>查询</strong>元素：算出同样 k 个位置，只要<strong>有一位是 0，就一定不在</strong
      >；如果<strong>全是 1，那「可能在」</strong>（也可能是别的元素把这些位凑成了 1——误判）。
    </p>
    <p>
      这里是 <code>m=16</code> 位、<code>k=3</code> 个哈希的布隆过滤器。先「加入」几个数（比如
      3、7、11），再「查询」：试试查 <strong>7</strong>（加过，命中）、查 <strong>5</strong>（有
      0，一定不存在）、再查 <strong>2</strong>（没加过，但 3
      个位恰好都被占了——<strong>误判</strong>！）。
    </p>

    <Playground>
      <BloomViz />
    </Playground>

    <p>
      布隆过滤器的铁律：<b>说「不在」就一定不在（绝不漏判），说「在」只是可能（会误判）</b>。位数组越大、元素越少，误判率越低。标准布隆<strong>不支持删除</strong>（清一位可能影响别的元素），要删得用「计数布隆」。
    </p>

    <h2>布隆过滤器在哪里用</h2>
    <Callout>
      <b>缓存穿透防护</b>：先问布隆，「一定不存在」就不必查数据库。<br />
      <b>爬虫 URL 去重</b> / <b>海量黑名单·白名单预筛</b>。<br />
      <b>大数据 join 前过滤</b>：先用布隆刷掉绝不匹配的行。
    </Callout>
    <p>
      它用「一点误判」换来「极省空间」——这趟结构之旅的最后一站，也是工程里最实用的近似数据结构之一。
    </p>
  </Article>
</template>
