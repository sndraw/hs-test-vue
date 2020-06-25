import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "Home" */ '../views/Home.vue')
  },
  {
    path: '/tablelist',
    name: 'TableList',
    component: () =>
      import(/* webpackChunkName: "TableList" */ '../views/TableList.vue')
  },
  // {
  //   path: '/canvas',
  //   name: 'Canvas',
  //   component: () =>
  //     import(/* webpackChunkName: "TableList" */ '../views/Canvas.vue')
  // }
];

const router = new VueRouter({
  routes
});

export default router;
