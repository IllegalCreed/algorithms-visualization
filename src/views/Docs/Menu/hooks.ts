import type { Category } from "./types";
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { ref, provide } from 'vue';

export function useCategoryData(): Category[] {
  const categoryData: Category[] = [
    {
      title: '数据结构',
      children: [
        {
          title: "数组",
          url: 'array'
        },
        {
          title: "链表",
          url: 'link'
        },
        {
          title: "栈",
          url: 'stack'
        },
        {
          title: "队列",
          url: 'queue'
        },
        {
          title: "树",
          url: 'tree'
        },
        {
          title: "堆",
          url: 'heap'
        },
        {
          title: "哈希表",
          url: 'hash'
        },
        {
          title: "图",
          url: 'graph'
        },
      ]
    },
    {
      title: '经典排序算法',
      children: [
        {
          title: "冒泡排序",
          url: 'bubble-sort'
        },
        {
          title: "选择排序",
          url: 'selection-sort'
        },
        {
          title: "插入排序",
          url: 'insertion-sort'
        },
        {
          title: "希尔排序",
          url: 'shell-sort'
        },
        {
          title: "归并排序",
          url: 'merge-sort'
        },
        {
          title: "快速排序",
          url: 'quick-sort'
        },
        {
          title: "堆排序",
          url: 'heap-sort'
        },
        {
          title: "计数排序",
          url: 'counting-sort'
        },
        {
          title: "桶排序",
          url: 'bucket-sort'
        },
        {
          title: "基数排序",
          url: 'radix-sort'
        },
      ]
    }
  ]
  return categoryData;
}

export function useMenuSelect(): void {
  let currentSelectMenuItemKey = ref<string | null>(null);
  provide('currentSelectMenuItemKey', currentSelectMenuItemKey);
  onBeforeRouteUpdate(async (to, from) => {
    currentSelectMenuItemKey.value = to.name as string;
  })
  const route = useRoute();
  currentSelectMenuItemKey.value = route.name as string;
}