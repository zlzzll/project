import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import PatientList from '../views/PatientList.vue';
import PatientDetail from '../views/PatientDetail.vue';
import MedicalRecord from '../views/MedicalRecord.vue';
import NewRecord from '../views/NewRecord.vue';

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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('user');
  
  if (to.name !== 'Login' && !isAuthenticated) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;