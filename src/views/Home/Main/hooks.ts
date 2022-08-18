import { Category } from "./types";
import ArrayIcon from '@/assets/array.svg';
import LinkIcon from '@/assets/link.svg';
import StackIcon from '@/assets/stack.svg';
import QueueIcon from '@/assets/queue.svg';
import TreeIcon from '@/assets/tree.svg';
import HeapIcon from '@/assets/heap.svg';
import HashIcon from '@/assets/hash.svg';
import GraphIcon from '@/assets/graph.svg';

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
    }
  ]
  return categoryData;
}