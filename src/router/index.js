/*
import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/!* Layout *!/
import Layout from '../views/layout/Layout'

/!**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **!/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'home' }
    }]
  },
  {
    path: '/router',
    component: Layout,
    redirect: '/router/channel',
    name: 'Router',
    meta: { title: '路由', icon: 'router' },
    children: [
      {
        path: 'host',
        name: 'Host',
        component: () => import('@/views/router/host/index'),
        meta: { title: '主机', icon: 'host' }
      },
      {
        path: 'channel',
        name: 'Channel',
        component: () => import('@/views/router/channel/index'),
        meta: { title: '通道', icon: 'channel' }
      },
      {
        path: 'node',
        name: 'Node',
        component: () => import('@/views/router/node/index'),
        meta: { title: '节点', icon: 'node' }
      }
    ]
  },
  {
    path: '/maintenance',
    component: Layout,
    redirect: '/maintenance/unit',
    name: 'Maintenance',
    meta: { title: '维保', icon: 'maintenance' },
    children: [
      {
        path: 'unitInfo',
        name: 'UnitInfo',
        component: () => import('@/views/maintenance/unitInfo/index'),
        meta: { title: '单位信息', icon: 'unit' }
      },
      {
        path: 'unit',
        name: 'Unit',
        component: () => import('@/views/maintenance/unit/index'),
        meta: { title: '维保单位', icon: 'unit' }
      },
      {
        path: 'personal',
        name: 'Personal',
        component: () => import('@/views/maintenance/personnel/index'),
        meta: { title: '维保人', icon: 'personal' }
      },
      {
        path: 'removal',
        name: 'Removal',
        component: () => import('@/views/maintenance/disarmlog/index'),
        meta: { title: '撤防历史', icon: 'removal' }
      }
    ]
  },
  {
    path: '/alarm',
    component: Layout,
    redirect: '/alarm/untreated',
    name: 'Alarm',
    meta: { title: '报警', icon: 'alarm' },
    children: [
      {
        path: 'untreated',
        name: 'Untreated',
        component: () => import('@/views/alarm/untreated/index'),
        meta: { title: '报警管理', icon: 'table' }
      },

      {
        path: 'history',
        name: 'History',
        component: () => import('@/views/alarm/history/index'),
        meta: { title: '通知历史', icon: 'tree' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/area',
    name: 'System',
    meta: { title: '系统管理', icon: 'nested' },
    children: [
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/system/role/index'),
        meta: { title: '权限角色', icon: 'table' }
      },
      {
        path: 'resource',
        name: 'Resource',
        component: () => import('@/views/system/resource/index'),
        meta: { title: '数据资源', icon: 'tree' }
      },
      {
        path: 'account',
        name: 'Account',
        component: () => import('@/views/system/account/index'),
        meta: { title: '账号', icon: 'tree' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
*/
import Vue from "vue";
import Router from "vue-router";
import Layout from "../views/layout/Layout";
// import Empty from '../views/empty'

Vue.use(Router);

export const constantRouterMap = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },
  {
    path: "/empty",
    component: () => import("@/views/empty"),
    hidden: true
  },
  {
    path: "/help",
    component: () => import("@/views/help"),
    hidden: true
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "首页", icon: "home" }
      }
    ]
  }
];
export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});
