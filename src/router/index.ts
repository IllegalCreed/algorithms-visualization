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
        ]
      }
    ]
  },
  {
    path: '/about',
    name: 'about',
    component: About
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})


export default router;