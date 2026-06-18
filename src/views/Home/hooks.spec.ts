import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { defineComponent, nextTick } from 'vue';
import { useControlHeaderShadow } from './hooks';
import { useSystemStore } from '@/store/modules/system';

// TC-HOOK-03: Home useControlHeaderShadow
// 该 hook 使用 onMounted/onUnmounted 生命周期，必须在组件上下文中调用。
// 用 @vue/test-utils mount 一个宿主组件来驱动生命周期。

function makeHostComponent() {
  return defineComponent({
    setup() {
      useControlHeaderShadow();
    },
    template: '<div />',
  });
}

describe('Home useControlHeaderShadow', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    // 重置 scrollY
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('TC-HOOK-03-1: 组件挂载时注册 scroll 监听器', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const wrapper = mount(makeHostComponent());
    expect(addSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    wrapper.unmount();
  });

  it('TC-HOOK-03-2: 组件卸载时移除 scroll 监听器', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const wrapper = mount(makeHostComponent());
    wrapper.unmount();
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('TC-HOOK-03-3: scrollY > 0 时 isShowHeaderShadow 变为 true', async () => {
    const store = useSystemStore();
    expect(store.isShowHeaderShadow).toBe(false);

    const wrapper = mount(makeHostComponent());

    Object.defineProperty(window, 'scrollY', { value: 100, writable: true, configurable: true });
    window.dispatchEvent(new Event('scroll'));
    await nextTick();

    expect(store.isShowHeaderShadow).toBe(true);
    wrapper.unmount();
  });

  it('TC-HOOK-03-4: scrollY === 0 时 isShowHeaderShadow 变为 false', async () => {
    const store = useSystemStore();
    store.isShowHeaderShadow = true;

    const wrapper = mount(makeHostComponent());

    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
    window.dispatchEvent(new Event('scroll'));
    await nextTick();

    expect(store.isShowHeaderShadow).toBe(false);
    wrapper.unmount();
  });
});
