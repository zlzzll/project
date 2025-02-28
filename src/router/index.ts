import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import PatientList from '../views/PatientList.vue';
import PatientDetail from '../views/PatientDetail.vue';
import MedicalRecord from '../views/MedicalRecord.vue';
import NewRecord from '../views/NewRecord.vue';
import Register from '../views/Register.vue';
import Setting from '../views/Setting.vue';

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
    path: '/patients',
    name: 'PatientList',
    component: PatientList
  },
  {
    path: '/patients/:id',
    name: 'PatientDetail',
    component: PatientDetail
  },
  {
    path: '/records/:id',
    name: 'MedicalRecord',
    component: MedicalRecord
  },
  {
    path: '/new-record',
    name: 'NewRecord',
    component: NewRecord
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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard for authentication
router.beforeEach((to, _from, next) => {
  const isAuthenticated = localStorage.getItem('user');
  
  if (to.name !== 'Login' && !isAuthenticated) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;