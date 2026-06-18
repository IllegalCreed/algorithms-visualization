import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { defineComponent } from 'vue';
import { useControlHeaderShadow } from './hooks';
import { useSystemStore } from '@/store/modules/system';

// TC-HOOK-04: Docs useControlHeaderShadow
// 该 hook 使用 onMounted/onUnmounted，需在组件上下文内执行。

function makeHostComponent() {
  return defineComponent({
    setup() {
      useControlHeaderShadow();
    },
    template: '<div />',
  });
}

describe('Docs useControlHeaderShadow', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('TC-HOOK-04-1: 组件挂载后 isShowHeaderShadow 变为 true', () => {
    const store = useSystemStore();
    expect(store.isShowHeaderShadow).toBe(false);

    mount(makeHostComponent());

    expect(store.isShowHeaderShadow).toBe(true);
  });

  it('TC-HOOK-04-2: 组件卸载后 isShowHeaderShadow 恢复为 false', () => {
    const store = useSystemStore();
    const wrapper = mount(makeHostComponent());
    expect(store.isShowHeaderShadow).toBe(true);

    wrapper.unmount();

    expect(store.isShowHeaderShadow).toBe(false);
  });
});
