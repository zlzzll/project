<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store';

const router = useRouter();
const userStore = useUserStore();
const activeIndex = ref('1');

const navigateTo = (path: string) => {
  router.push(path);
};

const logout = () => {
  userStore.logout();
  router.push('/login');
};
</script>

<template>
  <div class="sidebar">
    <div class="logo">
      <h2>电子病历系统</h2>
    </div>
    <div class="menu">
      <div class="menu-item" @click="navigateTo('/dashboard')" :class="{ active: $route.path === '/dashboard' }">
        <i class="el-icon-s-home"></i>
        <span>首页</span>
      </div>
      <div class="menu-item" @click="navigateTo('/patients')" :class="{ active: $route.path === '/patients' }">
        <i class="el-icon-user"></i>
        <span>患者管理</span>
      </div>
      <div class="menu-item" @click="navigateTo('/new-record')" :class="{ active: $route.path === '/new-record' }">
        <i class="el-icon-document-add"></i>
        <span>新建病历</span>
      </div>
    </div>
    <div class="user-info">
      <div class="avatar">
        <img src="https://tse3-mm.cn.bing.net/th/id/OIP-C.JCEcaQJVR_vC2kgt6BGZlAAAAA?rs=1&pid=ImgDetMain" alt="User Avatar" />
      </div>
      <div class="user-details">
        <div class="user-name">{{ userStore.currentUser?.name }}</div>
        <div class="user-role">{{ userStore.currentUser?.role === 'doctor' ? '医生' : '护士' }}</div>
      </div>
      <div class="logout" @click="logout">
        <i class="el-icon-switch-button">X</i>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  background-color: #304156;
  color: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
  flex-shrink: 0;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #1f2d3d;
  background-color: #263445;
}

.logo h2 {
  margin: 0;
  font-size: 18px;
  letter-spacing: 1px;
}

.menu {
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
}

.menu-item {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 5px;
  border-radius: 4px;
  margin-left: 10px;
  margin-right: 10px;
}

.menu-item:hover {
  background-color: #263445;
  transform: translateX(5px);
}

.menu-item.active {
  background-color: #1890ff;
  color: white;
}

.menu-item i {
  margin-right: 10px;
  font-size: 18px;
  transition: all 0.3s ease;
}

.menu-item:hover i {
  transform: scale(1.2);
}

.user-info {
  height: 80px;
  border-top: 1px solid #1f2d3d;
  display: flex;
  align-items: center;
  padding: 0 20px;
  background-color: #263445;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.avatar:hover {
  border-color: #1890ff;
  transform: scale(1.05);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 14px;
  font-weight: bold;
}

.user-role {
  font-size: 12px;
  color: #ccc;
}

.logout {
  cursor: pointer;
  font-size: 18px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.logout:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ff6b6b;
  transform: rotate(180deg);
}
</style>