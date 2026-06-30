import { createRouter, createWebHistory } from 'vue-router';
import Master from '../views/Master/Master.vue';
import Home from '../views/Home/Home.vue';
import Docs from '../views/Docs/Docs.vue';
import About from '../views/About/About.vue';

const routes = [
  {
    path: '/',
    component: Master,
    children: [
      {
        path: '',
        name: 'home',
        component: Home,
      },
      {
        path: '/docs',
        name: 'docs',
        component: Docs,
        children: [
          {
            path: '/docs/array',
            name: 'array',
            component: () => import('../views/Article/DataStructure/Array.vue'),
          },
          {
            path: '/docs/link',
            name: 'link',
            component: () => import('../views/Article/DataStructure/Link.vue'),
          },
          {
            path: '/docs/stack',
            name: 'stack',
            component: () => import('../views/Article/DataStructure/Stack.vue'),
          },
          {
            path: '/docs/queue',
            name: 'queue',
            component: () => import('../views/Article/DataStructure/Queue.vue'),
          },
          {
            path: '/docs/tree',
            name: 'tree',
            component: () => import('../views/Article/DataStructure/Tree.vue'),
          },
          {
            path: '/docs/heap',
            name: 'heap',
            component: () => import('../views/Article/DataStructure/Heap.vue'),
          },
          {
            path: '/docs/hash',
            name: 'hash',
            component: () => import('../views/Article/DataStructure/Hash.vue'),
          },
          {
            path: '/docs/graph',
            name: 'graph',
            component: () => import('../views/Article/DataStructure/Graph.vue'),
          },
          {
            path: '/docs/trie',
            name: 'trie',
            component: () => import('../views/Article/DataStructure/Trie.vue'),
          },
          {
            path: '/docs/union-find',
            name: 'union-find',
            component: () => import('../views/Article/DataStructure/UnionFind.vue'),
          },
          {
            path: '/docs/lru',
            name: 'lru',
            component: () => import('../views/Article/DataStructure/Lru.vue'),
          },
          {
            path: '/docs/skip-list',
            name: 'skip-list',
            component: () => import('../views/Article/DataStructure/SkipList.vue'),
          },
          {
            path: '/docs/segment-tree',
            name: 'segment-tree',
            component: () => import('../views/Article/DataStructure/SegmentTree.vue'),
          },
          {
            path: '/docs/b-tree',
            name: 'b-tree',
            component: () => import('../views/Article/DataStructure/BTree.vue'),
          },
          {
            path: '/docs/bloom-filter',
            name: 'bloom-filter',
            component: () => import('../views/Article/DataStructure/BloomFilter.vue'),
          },
          {
            path: '/docs/dijkstra',
            name: 'dijkstra',
            component: () => import('../views/Article/Algorithm/Dijkstra.vue'),
          },
          {
            path: '/docs/kruskal',
            name: 'kruskal',
            component: () => import('../views/Article/Algorithm/Kruskal.vue'),
          },
          {
            path: '/docs/bubble-sort',
            name: 'bubble-sort',
            component: () => import('../views/Article/SortAlgorithm/BubbleSort.vue'),
          },
          {
            path: '/docs/selection-sort',
            name: 'selection-sort',
            component: () => import('../views/Article/SortAlgorithm/SelectionSort.vue'),
          },
          {
            path: '/docs/insertion-sort',
            name: 'insertion-sort',
            component: () => import('../views/Article/SortAlgorithm/InsertionSort.vue'),
          },
          {
            path: '/docs/shell-sort',
            name: 'shell-sort',
            component: () => import('../views/Article/SortAlgorithm/ShellSort.vue'),
          },
          {
            path: '/docs/merge-sort',
            name: 'merge-sort',
            component: () => import('../views/Article/SortAlgorithm/MergeSort.vue'),
          },
          {
            path: '/docs/quick-sort',
            name: 'quick-sort',
            component: () => import('../views/Article/SortAlgorithm/QuickSort.vue'),
          },
          {
            path: '/docs/heap-sort',
            name: 'heap-sort',
            component: () => import('../views/Article/SortAlgorithm/HeapSort.vue'),
          },
          {
            path: '/docs/counting-sort',
            name: 'counting-sort',
            component: () => import('../views/Article/SortAlgorithm/CountingSort.vue'),
          },
          {
            path: '/docs/radix-sort',
            name: 'radix-sort',
            component: () => import('../views/Article/SortAlgorithm/RadixSort.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/about',
    name: 'about',
    component: About,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes,
});

export default router;
