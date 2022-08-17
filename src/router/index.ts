import { createRouter, createWebHistory } from 'vue-router';
import Master from '../views/Master/Index.vue';
import Home from '../views/Home/Index.vue';
import Docs from '../views/Docs/Index.vue';
import About from '../views/About/Index.vue';

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