import { ref } from 'vue';
import { defineStore } from 'pinia';

/** pinia的类setup式定义，你也可以使用传统的option式定义，形如
 *  export const useCounterStore = defineStore('counter', {
 *  state: () => {
 *    return { count: 0 }
 *  },
 *  // 也可以定义为
 *  // state: () => ({ count: 0 })
 *  actions: {
 *    increment() {
 *      this.count++
 *    },
 *  },
 *  })
 *
 */
export const useSystemStore = defineStore('System', () => {
  // define state
  const isDarkMode = ref<boolean>(false);

  const colors = ['red', 'blue', 'yellow', 'green'];

  // define action
  function changeDarkMode(): void {
    isDarkMode.value = !isDarkMode.value;
  }

  // define getter
  /**
   * function doubleCount() {
   *   return count.value * 2;
   * }
   */

  /**
   * 控制header阴影是否出现
   */
  const isShowHeaderShadow = ref<boolean>(false);
  function changeHeaderShadowe(isShow: boolean): void {
    isShowHeaderShadow.value = isShow;
  }

  /** 全站搜索面板开关（C-113，M11-S1） */
  const isSearchOpen = ref<boolean>(false);
  const isMobileMenuOpen = ref<boolean>(false);

  function openSearch(): void {
    // 全局一次只允许一个 modal surface；否则手机目录和搜索会争抢焦点与滚动锁。
    isMobileMenuOpen.value = false;
    isSearchOpen.value = true;
  }
  function closeSearch(): void {
    isSearchOpen.value = false;
  }

  /**
   * 手机导航面板开关（C-140）。Header 与 Docs 目录是跨层级的兄弟组件，
   * 通过共享 store 保持同一个触发点和抽屉状态，避免在页面间传递事件。
   */
  function openMobileMenu(): void {
    isSearchOpen.value = false;
    isMobileMenuOpen.value = true;
  }
  function closeMobileMenu(): void {
    isMobileMenuOpen.value = false;
  }
  function toggleMobileMenu(): void {
    const shouldOpen = !isMobileMenuOpen.value;
    if (shouldOpen) isSearchOpen.value = false;
    isMobileMenuOpen.value = shouldOpen;
  }

  return {
    colors,
    isDarkMode,
    changeDarkMode,
    isShowHeaderShadow,
    changeHeaderShadowe,
    isSearchOpen,
    openSearch,
    closeSearch,
    isMobileMenuOpen,
    openMobileMenu,
    closeMobileMenu,
    toggleMobileMenu,
  };
});
