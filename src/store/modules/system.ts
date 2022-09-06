import { ref, Ref } from 'vue';
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
  const isDarkMode: Ref<boolean> = ref<boolean>(false);

  const colors = [
    'red',
    'blue',
    'yellow',
    'green'
  ]

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
  const isShowHeaderShadow: Ref<boolean> = ref<boolean>(false);
  function changeHeaderShadowe(isShow: boolean): void {
    isShowHeaderShadow.value = isShow;
  }

  return { colors, isDarkMode, changeDarkMode, isShowHeaderShadow, changeHeaderShadowe };
})