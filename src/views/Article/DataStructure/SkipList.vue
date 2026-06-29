<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import Playground from '@/components/article/Playground.vue';
import SkipListViz from '@/components/structures/SkipListViz.vue';
</script>

<template>
  <Article>
    <h1>跳表 Skip List</h1>
    <p class="sub">数据结构 · 给有序链表加几层「快车道」</p>

    <h2>什么是跳表</h2>
    <p>
      有序链表查一个值得从头一个一个走，<code>O(n)</code>。跳表的点子很妙：在它上面再架几层<strong>快车道</strong>——最底层是<strong>全部元素</strong>，每往上一层只保留<strong>一部分</strong>做索引，像高速公路的出入口越往上越稀。
    </p>
    <p>
      查找从<strong>最高层</strong>快车道往右大步走，一旦「下一个就超过目标」，就<strong>下沉一层</strong>接着走，到最底层看命中没。这里固定放了
      8 个值、4
      层（最底层全有，往上折半）。查一个值，看它怎么走<strong>楼梯</strong>、怎么一步<strong>跳过</strong>中间一串。
    </p>

    <Playground>
      <SkipListViz />
    </Playground>

    <p>
      因为高层一步能跨过好几个元素，平均查找只要
      <code>O(log n)</code
      >，比有序链表快得多，又比平衡树<strong>好实现</strong>。那插入时新元素该升到第几层？靠<strong>抛硬币随机</strong>决定（大约一半概率再往上升一层）——所以跳表是<strong>概率型</strong>结构，期望层数
      <code>O(log n)</code>。本质上，它就是一摞<strong>多层链表</strong>。
    </p>

    <h2>跳表在哪里用</h2>
    <Callout>
      <b>Redis 有序集合 zset</b>：底层就是跳表 + 哈希表。<br />
      <b>需要有序 + 范围查询</b>又想好实现的场景，常拿它替代平衡树。<br />
      <b>并发场景</b>：跳表的无锁 / 细粒度锁实现比平衡树好做（如 Java ConcurrentSkipListMap）。
    </Callout>
    <p>它是链表家族里「用空间换时间」的漂亮一招——也是这趟结构之旅里的进阶一站。</p>
  </Article>
</template>
