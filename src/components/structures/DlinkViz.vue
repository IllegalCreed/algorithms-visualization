<!-- 双向链表互动组件：→/← 双箭头 + head/tail + 两端 null；反向遍历(沿 prev) + 无需找前驱的 O(1) 删除 -->
<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import type { SiteLocale } from '@/i18n/catalog';
import { useDlink } from './useDlink';

const props = withDefaults(defineProps<{ locale?: SiteLocale }>(), { locale: 'zh-CN' });
const english = props.locale === 'en';
const d = useDlink();
const status = ref(
  english
    ? 'Each node has prev and next links. Traverse backward, or select a node to delete it.'
    : '双向链：每个节点都有 prev 和 next。点「反向遍历」，或点节点再删除。',
);
const lit = ref(-1); // 反向遍历当前点亮的节点下标
const rewired = ref<(number | 'head')[]>([]); // 接线改写脉冲
const busy = ref(false); // 反向遍历期间锁工具栏
let timers: ReturnType<typeof setTimeout>[] = [];
const sleep = (ms: number) => new Promise<void>((res) => timers.push(setTimeout(res, ms)));
const clearTimers = () => {
  timers.forEach(clearTimeout);
  timers = [];
};
const flashRewire = (keys: (number | 'head')[]) => {
  rewired.value = keys;
  timers.push(setTimeout(() => (rewired.value = []), 700));
};

const onSelect = (i: number) => {
  if (busy.value) return;
  d.select(i);
  status.value =
    d.selected.value === null
      ? english
        ? 'Selection cleared.'
        : '已取消选中'
      : english
        ? `Selected a[${d.selected.value}] with value ${d.items.value[d.selected.value][1]}. It can be deleted.`
        : `选中 a[${d.selected.value}]（值 ${d.items.value[d.selected.value][1]}）· 可删除`;
};
const onReverse = async () => {
  if (busy.value) return;
  busy.value = true;
  lit.value = -1;
  status.value = english
    ? `Traverse backward through prev from tail: ${d.backward.value.join(' → ')}. A singly linked list has no direct reverse link.`
    : `反向遍历（沿 prev 从 tail 往回）：${d.backward.value.join(' → ')}。单链表只有 next，做不到。`;
  for (let i = d.items.value.length - 1; i >= 0; i--) {
    lit.value = i;
    await sleep(480);
  }
  await sleep(360);
  lit.value = -1;
  busy.value = false;
};
const onRemove = () => {
  if (busy.value || d.selected.value === null) return;
  const i = d.selected.value;
  const r = d.removeAt(); // 同步改 items
  if (r) {
    flashRewire([r.rewire.left]);
    status.value = english
      ? `Delete a[${i}] = ${r.value}: set prev.next = next and next.prev = prev in O(1), without searching from head.`
      : `删除 a[${i}]=${r.value}：节点自带 prev → 直接 prev.next=next、next.prev=prev，O(1)，不用从 head 找前驱。`;
  }
};
const onReset = () => {
  clearTimers();
  busy.value = false;
  lit.value = -1;
  rewired.value = [];
  d.reset();
  status.value = english
    ? 'Reset complete. Traverse backward, or select a node to delete it.'
    : '已重置 · 点「反向遍历」，或点节点再删除。';
};
onUnmounted(clearTimers);
</script>

<template>
  <div class="dlink-viz column center">
    <div class="toolbar row-wrap">
      <button class="btn" :disabled="busy" @click="onReverse">
        ← {{ english ? 'Traverse backward' : '反向遍历' }}
      </button>
      <button class="btn" :disabled="busy || !d.hasSelection.value" @click="onRemove">
        {{
          d.hasSelection.value
            ? english
              ? `Delete a[${d.selected.value}]`
              : `删除 a[${d.selected.value}]`
            : english
              ? 'Delete selected'
              : '删除选中'
        }}
      </button>
      <button class="btn" :disabled="busy" @click="onReset">
        {{ english ? 'Reset' : '重置' }}
      </button>
    </div>
    <div class="lane-wrap">
      <!-- 车道：定宽定高（空/满一致）；∅ ⇄ 节点链 ⇄ ∅ -->
      <div class="lane">
        <div class="chain">
          <div class="dnullbox">∅</div>
          <span class="conn" :class="{ rewired: rewired.includes('head') }">
            <i class="nx">→</i><i class="pv">←</i>
          </span>
          <TransitionGroup name="dlink" tag="div" class="dnodes">
            <div
              v-for="(it, i) in d.items.value"
              :key="it[0]"
              class="dnode"
              :class="{ 'is-sel': i === d.selected.value, lit: i === lit }"
              :data-i="i"
            >
              <span v-if="i === 0" class="danchor head">head</span>
              <span v-if="i === d.items.value.length - 1" class="danchor tail">tail</span>
              <!-- 值盒（点选）+ 指向下一个的双箭头（挂节点，随 FLIP 走，不手算坐标） -->
              <div class="box" @click="onSelect(i)">{{ it[1] }}</div>
              <span class="conn" :class="{ rewired: rewired.includes(i) }">
                <i class="nx">→</i><i class="pv">←</i>
              </span>
            </div>
          </TransitionGroup>
          <div class="dnullbox">∅</div>
        </div>
      </div>
    </div>
    <p class="status">{{ status }}</p>
  </div>
</template>

<style scoped lang="less">
.dlink-viz {
  width: 100%;
  gap: 18px;
}
.toolbar {
  gap: 10px;
  justify-content: center;
}
.btn {
  border: none;
  font-size: 15px;
  font-weight: bold;
  color: @font-color;
  padding: 9px 16px;
  .neumorphism-btn(4px, 12px);

  &:disabled {
    opacity: 0.4;
    pointer-events: none;
  }
}
.lane-wrap {
  display: flex;
  justify-content: center;
  min-height: 140px;
}
.lane {
  position: relative;
  width: 560px;
  min-height: 108px;
  padding: 22px 14px 16px;
  overflow: hidden;
  .neumorphism-pressed(4px, 12px);
}
.chain {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  min-height: 64px;
}
// 双箭头连接：上 → next、下 ← prev；挂节点、靠 flex 相邻；改写时脉冲
.conn {
  flex: none;
  width: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1;
  gap: 2px;
  color: #7bbf94;
  font-weight: bold;
  transition: color 0.25s;

  .nx,
  .pv {
    font-size: 17px;
    font-style: normal;
    transition: transform 0.25s;
  }
}
.conn.rewired {
  color: #4caf50;
  animation: dlink-pulse 0.7s ease;
}
@keyframes dlink-pulse {
  30% {
    transform: scale(1.4);
    color: #4caf50;
  }
}
.dnodes {
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
}
.dnode {
  flex: none;
  display: flex;
  align-items: center;
  position: relative;
}
.danchor {
  position: absolute;
  top: -19px;
  left: 0;
  font-size: 11px;
  font-weight: bold;
  color: #ffffff;
  background: @font-highlight-color;
  border-radius: 7px;
  padding: 2px 7px;
  box-shadow:
    2px 2px 4px @neumorphis-dark-shadow,
    -2px -2px 4px @neumorphis-light-shadow;
}
.danchor.tail {
  left: auto;
  right: 30px; // 让开尾节点的尾箭头
}
.box {
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
  color: #1f5e3a;
  background: #8bd3a0;
  border-radius: 9px;
  cursor: pointer;
  box-shadow:
    2px 2px 5px @neumorphis-dark-shadow,
    -2px -2px 5px @neumorphis-light-shadow;
  transition:
    background-color 0.25s,
    color 0.25s,
    box-shadow 0.2s,
    transform 0.25s;
}
// 选中态：仅配色 + 阴影环、不位移（避开 FLIP 冲突）
.dnode.is-sel .box {
  background: #4caf50;
  color: #ffffff;
  box-shadow:
    0 0 0 3px fade(#4caf50, 35%),
    2px 2px 5px @neumorphis-dark-shadow,
    -2px -2px 5px @neumorphis-light-shadow;
}
// 反向遍历点亮：白底深绿环、抬起
.dnode.lit .box {
  background: #ffffff;
  color: #4caf50;
  box-shadow:
    0 0 0 3px #4caf50,
    0 6px 14px fade(#4caf50, 40%);
  transform: translateY(-4px);
}
.dnullbox {
  flex: none;
  width: 38px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  color: #aaa;
  border: 2px dashed #b9b9b9;
  border-radius: 9px;
}
// 插入滑入 / 删除缩淡离场（绝对定位让其余 FLIP 补位）/ 其余 FLIP
.dlink-enter-active,
.dlink-leave-active {
  transition: all 0.32s cubic-bezier(0.3, 1.1, 0.6, 1);
}
.dlink-enter-from {
  opacity: 0;
  transform: translateY(-24px) scale(0.6);
}
.dlink-leave-to {
  opacity: 0;
  transform: translateY(-24px) scale(0.55);
}
.dlink-leave-active {
  position: absolute;
}
.dlink-move {
  transition: transform 0.32s cubic-bezier(0.3, 1.1, 0.6, 1);
}
.status {
  font-weight: bold;
  font-size: 15px;
  min-height: 44px;
  max-width: 520px;
  text-align: center;
  color: #555555;
}
</style>
