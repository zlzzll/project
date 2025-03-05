import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Register from '../views/Register.vue';
import Setting from '../views/Setting.vue';
import ForgotPassword from '../views/ForgotPassword.vue';
import PermissionManage from '../views/PermissionManage.vue';
import ModelFlie from '../views/ModelFlie.vue';
import Fliemange from '../views/Fliemange.vue';


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },

  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/setting',
    name: 'Setting',
    component: Setting
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword
  },
  {
    path:"/permissions",
    name: 'Permissions',
    component: PermissionManage
  },
  {
    path: '/modelfile',
    name: 'ModelFile',
    component: ModelFlie
  },
  {
    path: '/filemanage',
    name: 'FileManage',
    component: Fliemange
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 导航守卫用于身份验证
router.beforeEach((to, _from, next) => {
  const isAuthenticated = localStorage.getItem('user');
  
  // 不需要身份验证的路由
  const publicRoutes = ['Login', 'Register', 'ForgotPassword','Email']; //这里必须填路由的name
  
  if (!publicRoutes.includes(to.name as string) && !isAuthenticated) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;