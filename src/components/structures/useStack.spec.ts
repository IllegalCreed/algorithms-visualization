import { describe, it, expect } from 'vitest';
import { useStack, STACK_MAX } from './useStack';

describe('useStack', () => {
  it('TC-STACK-LOGIC-01 初始空：items 空、top=null、canPop=false、canPush=true', () => {
    const s = useStack();
    expect(s.items.value).toEqual([]);
    expect(s.top.value).toBe(null);
    expect(s.canPop.value).toBe(false);
    expect(s.canPush.value).toBe(true);
  });
  it('TC-STACK-LOGIC-02 push 追加递增序号、返回压入值、top 更新', () => {
    const s = useStack();
    expect(s.push()).toBe(1);
    expect(s.push()).toBe(2);
    expect(s.items.value.map((t) => t[1])).toEqual([1, 2]);
    expect(s.top.value).toBe(2);
  });
  it('TC-STACK-LOGIC-03 pop 删尾并返回原栈顶；空 pop 返回 null', () => {
    const s = useStack();
    s.push();
    s.push();
    expect(s.pop()).toBe(2);
    expect(s.items.value.map((t) => t[1])).toEqual([1]);
    expect(s.pop()).toBe(1);
    expect(s.pop()).toBe(null);
  });
  it('TC-STACK-LOGIC-04 peek 返回栈顶但不改变 items', () => {
    const s = useStack();
    s.push();
    s.push();
    expect(s.peek()).toBe(2);
    expect(s.items.value.length).toBe(2);
    expect(s.peek()).toBe(2);
  });
  it('TC-STACK-LOGIC-05 reset 清空且 seq 归零（下次 push 又从 1 开始）', () => {
    const s = useStack();
    s.push();
    s.push();
    s.reset();
    expect(s.items.value).toEqual([]);
    expect(s.push()).toBe(1);
  });
  it('TC-STACK-LOGIC-06 canPush 在满 STACK_MAX 时为 false', () => {
    const s = useStack();
    for (let i = 0; i < STACK_MAX; i++) s.push();
    expect(s.items.value.length).toBe(STACK_MAX);
    expect(s.canPush.value).toBe(false);
    expect(s.push()).toBe(null); // 满了不再压入
    expect(s.items.value.length).toBe(STACK_MAX);
  });
  it('TC-STACK-LOGIC-07 每个元素 id 唯一', () => {
    const s = useStack();
    s.push();
    s.push();
    s.push();
    const ids = s.items.value.map((t) => t[0]);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('TC-STACK-LOGIC-08 canPop 随空/非空切换', () => {
    const s = useStack();
    expect(s.canPop.value).toBe(false);
    s.push();
    expect(s.canPop.value).toBe(true);
    s.pop();
    expect(s.canPop.value).toBe(false);
  });
});
