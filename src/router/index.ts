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
        path: '/docs/:page',
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