import Vue from 'vue';
import Router from 'vue-router';
import Ebook from './views/Ebook';

Vue.use(Router);

export default new Router({
  mode: 'hash',
  // base: process.env.BASE_URL,
  base: '/yiTownWebApp/',//这个配置也很重要，否则会出现页面空白情况
  routes: [
     {
       path:'/',
       name:'ebook',
       component: Ebook
     }
  ],
});
