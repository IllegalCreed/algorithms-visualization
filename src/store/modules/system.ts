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
  function openSearch(): void {
    isSearchOpen.value = true;
  }
  function closeSearch(): void {
    isSearchOpen.value = false;
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
  };
});
