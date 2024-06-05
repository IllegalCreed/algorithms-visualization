import type { Category } from "./types";
import ArrayIcon from '@/assets/array.svg';
import LinkIcon from '@/assets/link.svg';
import StackIcon from '@/assets/stack.svg';
import QueueIcon from '@/assets/queue.svg';
import TreeIcon from '@/assets/tree.svg';
import HeapIcon from '@/assets/heap.svg';
import HashIcon from '@/assets/hash.svg';
import GraphIcon from '@/assets/graph.svg';
import BubbleIcon from '@/assets/bubble.svg';
import SelectionIcon from '@/assets/selection.svg';
import InsertionIcon from '@/assets/insertion.svg';
import ShellIcon from '@/assets/shell.svg';
import MergeIcon from '@/assets/merge.svg';
import QuickIcon from '@/assets/quick.svg';
import CountingIcon from '@/assets/counting.svg';
import RadixIcon from '@/assets/radix.svg';
import BucketIcon from '@/assets/bucket.svg';

export function useCategoryData(): Category[] {
  const categoryData: Category[] = [
    {
      title: '数据结构',
      desc: '计算机存储、组织数据的方式',
      children: [
        {
          title: "数组",
          desc: '数组是有序元素的序列,每个元素都会被分配一个自增连续下标',
          icon: ArrayIcon,
          url: 'array'
        },
        {
          title: "链表",
          desc: '链表由一系列节点组成,每个节点包含储存数据的部分和保存相邻节点指针的部分',
          icon: LinkIcon,
          url: 'link'
        },
        {
          title: "栈",
          desc: '栈是一种特殊的线性表,栈顶允许操作,栈底不允许操作',
          icon: StackIcon,
          url: 'stack'
        },
        {
          title: "队列",
          desc: '队列是一种特殊的线性表,允许在队列的一端进行插入，而在队列的另一端进行删除',
          icon: QueueIcon,
          url: 'queue'
        },
        {
          title: "树",
          desc: '树是由n(n>=1)个有限节点组成一个具有层次关系的集合',
          icon: TreeIcon,
          url: 'tree'
        },
        {
          title: "堆",
          desc: '堆可以看做是一颗用数组实现的二叉树',
          icon: HeapIcon,
          url: 'heap'
        },
        {
          title: "哈希表",
          desc: '哈希表是根据键和值直接进行访问的数据结构',
          icon: HashIcon,
          url: 'hash'
        },
        {
          title: "图",
          desc: '图是一系列顶点的集合，这些顶点通过一系列边连接起来组成图这种数据结构。',
          icon: GraphIcon,
          url: 'graph'
        },
      ]
    },
    {
      title: '经典排序算法',
      desc: '根据不同数据结构对无序元素进行有序化的计算方法',
      children: [
        {
          title: "冒泡排序",
          desc: '每次循环找出目前数组中最大的数,放在当前数组末尾',
          icon: BubbleIcon,
          url: 'bubble-sort'
        },
        {
          title: "选择排序",
          desc: '每次循环找出目前数组中最小的数,放在当前数组头部',
          icon: SelectionIcon,
          url: 'selection-sort'
        },
        {
          title: "插入排序",
          desc: '顺序遍历数组每一个数字,然后和该数字前面的数组比较,将其放在适当的位置',
          icon: InsertionIcon,
          url: 'insertion-sort'
        },
        {
          title: "希尔排序",
          desc: '核心是一个插入排序,步进数1改为数组长度的一半,每完成一次步进都减小一半',
          icon: ShellIcon,
          url: 'shell-sort'
        },
        {
          title: "归并排序",
          desc: '通过递归构建二叉树结构，然进行左右两个节点的有序数组合并。',
          icon: MergeIcon,
          url: 'merge-sort'
        },
        {
          title: "快速排序",
          desc: '将数组首位作为基准数，将比他小的放在前面，比他大的放在后面，前后两个数组重复这一过程',
          icon: QuickIcon,
          url: 'quick-sort'
        },
        {
          title: "堆排序",
          desc: '利用大顶堆性质每次找出最大的数放在末尾，然后重复构造和维护大顶堆',
          icon: HeapIcon,
          url: 'heap-sort'
        },
        {
          title: "计数排序",
          desc: '在已知取值范围的情况下，按照一种萝卜一个坑的思想进行排序',
          icon: CountingIcon,
          url: 'counting-sort'
        },
        // {
        //   title: "桶排序",
        //   desc: '计数排序优化，放宽桶接受范围，减少桶数量，桶内排序',
        //   icon: BucketIcon,
        //   url: 'bucket-sort'
        // },
        // {
        //   title: "基数排序",
        //   desc: '先按个位数进桶，得到个位数有序数组后按十位数进桶，以此类推',
        //   icon: RadixIcon,
        //   url: 'radix-sort'
        // },
      ]
    }
  ]
  return categoryData;
}