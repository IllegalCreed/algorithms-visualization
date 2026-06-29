<!-- 布隆过滤器互动组件：16 位数组 + k=3 哈希；加入置位（绿）+ 查询取交（探测位橙描边）+ 误判演示 -->
<script setup lang="ts">
import { ref } from 'vue';
import { useBloom } from './useBloom';

const bloom = useBloom();
const a = ref(3);
const status = ref('先「加入」几个数（如 3、7、11），再「查询」——试试查 2，看什么是「误判」。');
const probe = ref<Set<number>>(new Set()); // 本次哈希探测到的位
const isFalsePositive = ref(false);

const onAdd = () => {
  const x = a.value;
  if (!Number.isInteger(x) || x < 0) {
    status.value = '请输入一个非负整数。';
    return;
  }
  const r = bloom.add(x);
  probe.value = new Set(r.positions);
  isFalsePositive.value = false;
  status.value = `加入 ${x}：哈希到位 ${r.positions.join('、')}，把这几位都置 1。`;
};

const onQuery = () => {
  const x = a.value;
  if (!Number.isInteger(x) || x < 0) {
    status.value = '请输入一个非负整数。';
    return;
  }
  const r = bloom.query(x);
  probe.value = new Set(r.positions);
  isFalsePositive.value = r.falsePositive;
  if (!r.mightExist) {
    status.value = `查询 ${x}：位 ${r.positions.join('、')} 中有 0 → 一定不存在。`;
  } else if (r.falsePositive) {
    status.value = `查询 ${x}：位 ${r.positions.join('、')} 都是 1 → 可能存在；但其实从没加入过，这就是误判（假阳性）！`;
  } else {
    status.value = `查询 ${x}：位 ${r.positions.join('、')} 都是 1 → 可能存在。`;
  }
};

const onReset = () => {
  bloom.reset();
  probe.value = new Set();
  isFalsePositive.value = false;
  status.value = '已重置 · 先「加入」几个数，再「查询」。';
};
</script>

<template>
  <div class="bloom-viz column center">
    <div class="toolbar row-wrap">
      <label class="lab">值</label>
      <input class="val-input in-a" v-model.number="a" type="number" />
      <button class="btn" @click="onAdd">加入</button>
      <button class="btn" @click="onQuery">查询</button>
      <button class="btn" @click="onReset">重置</button>
      <span class="hint">m = 16 位 · k = 3 个哈希</span>
    </div>
    <div class="array-wrap">
      <div class="bit-array">
        <div
          v-for="(on, i) in bloom.bits.value"
          :key="i"
          class="bit-cell"
          :class="{ set: on, probe: probe.has(i) }"
        >
          <span class="val">{{ on ? 1 : 0 }}</span>
          <span class="idx">{{ i }}</span>
        </div>
      </div>
    </div>
    <p class="status" :class="{ warn: isFalsePositive }">{{ status }}</p>
  </div>
</template>

<style scoped lang="less">
.bloom-viz {
  width: 100%;
  gap: 16px;
}
.toolbar {
  gap: 8px;
  justify-content: center;
  align-items: center;
}
.lab {
  font-weight: bold;
  font-size: 15px;
  color: @font-color;
}
.val-input {
  width: 64px;
  padding: 8px 10px;
  font-size: 15px;
  font-weight: bold;
  text-align: center;
  color: @font-color;
  border: none;
  .neumorphism-pressed(3px, 10px);
}
.btn {
  border: none;
  font-size: 15px;
  font-weight: bold;
  color: @font-color;
  padding: 9px 16px;
  .neumorphism-btn(4px, 12px);
}
.hint {
  font-size: 13px;
  color: #888888;
}
.array-wrap {
  display: flex;
  justify-content: center;
  max-width: 100%;
  overflow-x: auto;
}
.bit-array {
  display: flex;
  gap: 4px;
  padding: 12px;
  .neumorphism-pressed(4px, 14px);
}
.bit-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  .val {
    width: 28px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    font-size: 15px;
    font-weight: bold;
    color: #7a8a80;
    background: #d8e0db;
    border: 2px solid transparent;
    border-radius: 6px;
    transition:
      background 0.25s,
      border-color 0.25s;
  }
  .idx {
    font-size: 11px;
    color: #aaaaaa;
  }
}
.bit-cell.set .val {
  background: #4caf50;
  color: #ffffff;
}
.bit-cell.probe .val {
  border-color: #f0a000;
}
.status {
  font-weight: bold;
  font-size: 15px;
  min-height: 44px;
  max-width: 560px;
  text-align: center;
  color: #555555;
}
.status.warn {
  color: #e0631b;
}
</style>
