<!-- 数组互动组件：读者驱动的 访问/插入/删除/尾部追加/重置（贴合格 + 固定下标行 + ↑i 槽位指针） -->
<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { useArray } from './useArray';

const a = useArray();
const status = ref('点一个格子选中下标，再用上面的按钮操作');
const flashId = ref<string | null>(null);
let timer: ReturnType<typeof setTimeout> | undefined;

const onSelect = (i: number) => {
  a.select(i);
  status.value =
    a.selected.value === null
      ? '已取消选中'
      : `选中下标 ${a.selected.value}（值 ${a.valueAt(a.selected.value)}）· 可访问 / 插入 / 删除`;
};
const onAccess = () => {
  const i = a.selected.value;
  if (i === null) return;
  flashId.value = a.items.value[i][0];
  clearTimeout(timer);
  timer = setTimeout(() => (flashId.value = null), 600);
  status.value = `access：按下标直达 a[${i}] = ${a.valueAt(i)}，不用挨个找，O(1)`;
};
const onInsert = () => {
  const i = a.selected.value;
  if (i === null) return;
  const moved = a.items.value.length - i;
  const v = a.insert();
  if (v !== null)
    status.value = `insert：在下标 ${i} 放入 ${v}，下标 ${i} 起 ${moved} 个元素右移腾位，O(n)`;
};
const onRemove = () => {
  const i = a.selected.value;
  if (i === null) return;
  const v = a.remove();
  const moved = a.items.value.length - i;
  if (v !== null) status.value = `delete：移除 a[${i}] = ${v}，后面 ${moved} 个元素左移补位，O(n)`;
};
const onAppend = () => {
  const v = a.append();
  if (v !== null) status.value = `尾部追加：在末尾放入 ${v}，无需搬移，O(1)`;
};
const onReset = () => {
  a.reset();
  status.value = '已重置 · 点一个格子选中下标，再用上面的按钮操作';
};

onUnmounted(() => clearTimeout(timer));
</script>

<template>
  <div class="array-viz column center">
    <div class="toolbar row-wrap">
      <button class="btn" :disabled="!a.hasSelection.value" @click="onAccess">
        访问 a[{{ a.hasSelection.value ? a.selected.value : 'i' }}]
      </button>
      <button class="btn" :disabled="!a.canInsert.value" @click="onInsert">
        {{ a.hasSelection.value ? `在 ${a.selected.value} 处插入` : '插入' }}
      </button>
      <button class="btn" :disabled="!a.hasSelection.value" @click="onRemove">
        {{ a.hasSelection.value ? `删除 a[${a.selected.value}]` : '删除' }}
      </button>
      <button class="btn" :disabled="!a.canAppend.value" @click="onAppend">尾部追加</button>
      <button class="btn" @click="onReset">重置</button>
    </div>
    <div class="lane-wrap">
      <!-- 车道：定宽（空/满一致）；值行贴合排（连续内存），下标行固定不随值走 -->
      <div class="lane">
        <span v-if="!a.items.value.length" class="empty-hint">数组为空</span>
        <div class="lane-stack">
          <TransitionGroup name="array" tag="div" class="cells">
            <div
              v-for="(it, i) in a.items.value"
              :key="it[0]"
              class="cell"
              :class="{ 'is-selected': i === a.selected.value, flash: it[0] === flashId }"
              :data-i="i"
              @click="onSelect(i)"
            >
              {{ it[1] }}
            </div>
          </TransitionGroup>
          <!-- 下标行：v-for 位置序号，固定不参与 FLIP；↑ 指针挂选中槽位 -->
          <div class="indices">
            <div
              v-for="(it, i) in a.items.value"
              :key="i"
              class="slot"
              :class="{ 'is-selected': i === a.selected.value }"
            >
              <span class="ptr">↑</span><span class="num">{{ i }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p class="status">{{ status }}</p>
  </div>
</template>

<style scoped lang="less">
.array-viz {
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
  min-height: 132px;
}
.lane {
  position: relative;
  width: 448px;
  min-height: 96px;
  padding: 14px;
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
.lane-stack {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
// 值行与下标行：同 flex-row、同 gap、同列宽 → 第 i 个值与第 i 个下标天然列对齐（无像素计算）
.cells,
.indices {
  display: flex;
  flex-direction: row;
  gap: 2px;
  justify-content: flex-start;
}
.cells {
  position: relative; // 让 leave 的绝对定位元素以此为基准
  min-height: 50px;
}
.cell {
  position: relative;
  flex: none;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
  color: #1f5e3a;
  background: #8bd3a0;
  border-radius: 7px;
  cursor: pointer;
  box-shadow:
    2px 2px 5px @neumorphis-dark-shadow,
    -2px -2px 5px @neumorphis-light-shadow;
  transition:
    background-color 0.25s,
    color 0.25s,
    box-shadow 0.25s,
    transform 0.32s cubic-bezier(0.3, 1.1, 0.6, 1),
    opacity 0.32s;
}
// 选中态：仅配色 + 阴影环，不位移（避免与 TransitionGroup 的 move-transform 冲突）
.cell.is-selected {
  background: #4caf50;
  color: #ffffff;
  box-shadow:
    0 0 0 3px fade(#4caf50, 35%),
    2px 2px 5px @neumorphis-dark-shadow,
    -2px -2px 5px @neumorphis-light-shadow;
}
// 访问瞬时高亮（一次性，不引起布局搬移、与 FLIP 无冲突）
.cell.flash {
  animation: array-flash 0.62s ease;
}
@keyframes array-flash {
  30% {
    background: #4caf50;
    color: #ffffff;
    transform: translateY(-8px) scale(1.12);
    box-shadow: 0 8px 18px fade(#4caf50, 50%);
  }
}
// 下标行：固定槽位 = 连续内存地址；↑ 仅在选中槽位显形（占位常驻，避免行高跳变）
.slot {
  flex: none;
  width: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.2;
}
.ptr {
  font-size: 13px;
  font-weight: bold;
  color: #4caf50;
  opacity: 0;
  transition: opacity 0.2s;
}
.slot.is-selected .ptr {
  opacity: 1;
}
.num {
  font-size: 13px;
  font-weight: bold;
  color: #999;
}
.slot.is-selected .num {
  color: #4caf50;
}
// 插入从右滑入 / 删除缩淡离场（绝对定位让其余 FLIP 补位）/ 其余 FLIP 搬移
.array-enter-active,
.array-leave-active {
  transition: all 0.32s cubic-bezier(0.3, 1.1, 0.6, 1);
}
.array-enter-from {
  opacity: 0;
  transform: translateX(46px) scale(0.6);
}
.array-leave-to {
  opacity: 0;
  transform: translateY(-22px) scale(0.55);
}
.array-leave-active {
  position: absolute;
}
.array-move {
  transition: transform 0.32s cubic-bezier(0.3, 1.1, 0.6, 1);
}
.status {
  font-weight: bold;
  font-size: 15px;
  min-height: 44px;
  max-width: 420px;
  text-align: center;
  color: #555555;
}
</style>
