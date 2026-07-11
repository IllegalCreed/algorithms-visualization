<!-- 链表互动组件：读者驱动的 查找/在其后插入/删除/头插/重置（节点 + next 箭头 + head + null） -->
<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import type { SiteLocale } from '@/i18n/catalog';
import { useLink } from './useLink';

const props = withDefaults(defineProps<{ locale?: SiteLocale }>(), { locale: 'zh-CN' });
const english = props.locale === 'en';
const l = useLink();
const status = ref(
  english
    ? 'Select a node, then choose an operation above.'
    : '点一个节点选中它，再用上面的按钮操作',
);
const visiting = ref(-1); // 查找逐跳游标所在节点下标
const rewired = ref<(number | 'head')[]>([]); // 被改写的 next 箭头（脉冲高亮）
const busy = ref(false); // 仅查找逐跳期间锁工具栏
let vt: ReturnType<typeof setTimeout> | undefined;
let rt: ReturnType<typeof setTimeout> | undefined;

const flashRewire = (keys: (number | 'head')[]) => {
  rewired.value = keys;
  clearTimeout(rt);
  rt = setTimeout(() => (rewired.value = []), 700);
};
const onSelect = (i: number) => {
  if (busy.value) return;
  l.select(i);
  status.value =
    l.selected.value === null
      ? english
        ? 'Selection cleared.'
        : '已取消选中'
      : english
        ? `Selected a[${l.selected.value}] with value ${l.valueAt(l.selected.value)}. Find, insert after, or delete it.`
        : `选中 a[${l.selected.value}]（值 ${l.valueAt(l.selected.value)}）· 可查找 / 在其后插入 / 删除`;
};
const onFind = () => {
  const i = l.selected.value;
  if (i === null || busy.value) return;
  status.value = english
    ? `find: follow ${i + 1} link(s) from head to reach a[${i}] = ${l.valueAt(i)}; linked lists cannot jump, O(n).`
    : `find：从 head 走了 ${i + 1} 步才到 a[${i}]（值 ${l.valueAt(i)}），不能跳，O(n)`;
  busy.value = true;
  let k = 0;
  const step = () => {
    visiting.value = k;
    if (k < i) {
      k++;
      vt = setTimeout(step, 480);
    } else {
      vt = setTimeout(() => {
        visiting.value = -1;
        busy.value = false;
      }, 480);
    }
  };
  step();
};
const onInsert = () => {
  const i = l.selected.value;
  if (i === null) return;
  const v = l.insertAfter();
  if (v !== null) {
    flashRewire([i, i + 1]);
    status.value = english
      ? `Insert ${v} after a[${i}]: rewrite two next links; every other node stays put, O(1).`
      : `在 a[${i}] 后插入 ${v}：只改了 2 根 next（高亮），其余节点没动，O(1)`;
  }
};
const onRemove = () => {
  const i = l.selected.value;
  if (i === null) return;
  const v = l.remove();
  if (v !== null) {
    flashRewire([i - 1 >= 0 ? i - 1 : 'head']);
    status.value = english
      ? `Delete a[${i}] = ${v}: make the previous next link skip this node, O(1) after locating it.`
      : `删除 a[${i}] = ${v}：让前一个节点 next 跳过它，只改 1 根，O(1)`;
  }
};
const onPrepend = () => {
  const v = l.prepend();
  if (v !== null) {
    flashRewire(['head', 0]);
    status.value = english
      ? `Prepend ${v}: point the new node to the old head, then move head, O(1).`
      : `头插 ${v}：新节点 next 指原头、head 指新节点，O(1)`;
  }
};
const onReset = () => {
  l.reset();
  visiting.value = -1;
  rewired.value = [];
  status.value = english
    ? 'Reset complete. Select a node, then choose an operation.'
    : '已重置 · 点一个节点选中它，再用上面的按钮操作';
};

onUnmounted(() => {
  clearTimeout(vt);
  clearTimeout(rt);
});
</script>

<template>
  <div class="link-viz column center">
    <div class="toolbar row-wrap">
      <button class="btn" :disabled="busy || !l.hasSelection.value" @click="onFind">
        {{
          l.hasSelection.value
            ? english
              ? `Find a[${l.selected.value}]`
              : `查找 a[${l.selected.value}]`
            : english
              ? 'Find selected'
              : '查找选中'
        }}
      </button>
      <button class="btn" :disabled="busy || !l.canInsert.value" @click="onInsert">
        {{
          l.hasSelection.value
            ? english
              ? `Insert after a[${l.selected.value}]`
              : `在 a[${l.selected.value}] 后插入`
            : english
              ? 'Insert after'
              : '在其后插入'
        }}
      </button>
      <button class="btn" :disabled="busy || !l.hasSelection.value" @click="onRemove">
        {{
          l.hasSelection.value
            ? english
              ? `Delete a[${l.selected.value}]`
              : `删除 a[${l.selected.value}]`
            : english
              ? 'Delete selected'
              : '删除选中'
        }}
      </button>
      <button class="btn" :disabled="busy || !l.canPrepend.value" @click="onPrepend">
        {{ english ? 'Prepend' : '头插' }}
      </button>
      <button class="btn" :disabled="busy" @click="onReset">
        {{ english ? 'Reset' : '重置' }}
      </button>
    </div>
    <div class="lane-wrap">
      <!-- 车道：定宽（空/满一致）；head 胶囊 + 节点[值|next→] + null -->
      <div class="lane">
        <span v-if="!l.items.value.length" class="empty-hint">
          {{ english ? 'List is empty' : '链表为空' }}
        </span>
        <div class="chain">
          <div class="head"><span class="pill">head</span></div>
          <span
            v-if="l.items.value.length"
            class="arrow"
            :class="{ rewired: rewired.includes('head') }"
            >→</span
          >
          <TransitionGroup name="link" tag="div" class="nodes">
            <div
              v-for="(it, i) in l.items.value"
              :key="it[0]"
              class="node"
              :class="{ 'is-sel': i === l.selected.value, visiting: i === visiting }"
              :data-i="i"
            >
              <!-- 值盒（点选）+ 该节点的 next 箭头（挂节点、随 FLIP 走，不手算坐标） -->
              <div class="box" @click="onSelect(i)">{{ it[1] }}</div>
              <span class="arrow" :class="{ rewired: rewired.includes(i) }">→</span>
            </div>
          </TransitionGroup>
          <div class="nullbox">∅</div>
        </div>
      </div>
    </div>
    <p class="status">{{ status }}</p>
  </div>
</template>

<style scoped lang="less">
.link-viz {
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
  min-height: 130px;
}
.lane {
  position: relative;
  width: 560px;
  min-height: 96px;
  padding: 16px 14px;
  overflow: hidden;
  .neumorphism-pressed(4px, 12px);
}
.empty-hint {
  position: absolute;
  inset: 0;
  margin: auto;
  width: fit-content;
  height: fit-content;
  color: #aaa;
  font-size: 14px;
}
.chain {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  min-height: 64px;
}
.head {
  display: flex;
  align-items: center;
  flex: none;
}
.head .pill {
  font-size: 12px;
  font-weight: bold;
  color: #ffffff;
  background: @font-highlight-color;
  border-radius: 8px;
  padding: 4px 9px;
  box-shadow:
    2px 2px 4px @neumorphis-dark-shadow,
    -2px -2px 4px @neumorphis-light-shadow;
}
// next 箭头：挂节点、靠 flex 相邻指向下一个；改写时脉冲
.arrow {
  flex: none;
  width: 28px;
  text-align: center;
  font-size: 21px;
  font-weight: bold;
  color: #7bbf94;
  transition:
    color 0.25s,
    transform 0.25s;
}
.arrow.rewired {
  color: #4caf50;
  animation: link-pulse 0.7s ease;
}
@keyframes link-pulse {
  30% {
    transform: scale(1.5);
    color: #4caf50;
  }
}
.nodes {
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative; // 让 leave 的绝对定位元素以此为基准
}
.node {
  flex: none;
  display: flex;
  align-items: center;
  position: relative;
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
// 选中态：仅配色 + 阴影环、不位移（沿用 C-017 教训，避开 FLIP 冲突）
.node.is-sel .box {
  background: #4caf50;
  color: #ffffff;
  box-shadow:
    0 0 0 3px fade(#4caf50, 35%),
    2px 2px 5px @neumorphis-dark-shadow,
    -2px -2px 5px @neumorphis-light-shadow;
}
// 查找逐跳游标：白底深绿环、抬起（瞬时、不与持续选中态叠加冲突）
.node.visiting .box {
  background: #ffffff;
  color: #4caf50;
  box-shadow:
    0 0 0 3px #4caf50,
    0 6px 14px fade(#4caf50, 40%);
  transform: translateY(-4px);
}
.nullbox {
  flex: none;
  width: 40px;
  height: 46px;
  margin-left: 2px;
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
.link-enter-active,
.link-leave-active {
  transition: all 0.32s cubic-bezier(0.3, 1.1, 0.6, 1);
}
.link-enter-from {
  opacity: 0;
  transform: translateY(-24px) scale(0.6);
}
.link-leave-to {
  opacity: 0;
  transform: translateY(-24px) scale(0.55);
}
.link-leave-active {
  position: absolute;
}
.link-move {
  transition: transform 0.32s cubic-bezier(0.3, 1.1, 0.6, 1);
}
.status {
  font-weight: bold;
  font-size: 15px;
  min-height: 44px;
  max-width: 480px;
  text-align: center;
  color: #555555;
}
</style>
