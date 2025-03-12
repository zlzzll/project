<script setup lang="ts">
// import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store';

// 路由器实例
const router = useRouter();
// 用户存储
const userStore = useUserStore();
// 活动菜单项索引
// const activeIndex = ref('1');

// 导航到指定路径
const navigateTo = (path: string) => {
  router.push(path);
};

// 跳转到个人信息
const navigateToProfile = () => {
  router.push('/setting');
};

// 登出
const logout = () => {
  userStore.logout();
  router.push('/login');
};
</script>

<template>
  <div class="sidebar">
    <div class="logo">
      <h2>电子病历撰写系统</h2>
    </div>

    <div class="user-express">
      <div class="main-avatar">
        <img src="https://tse3-mm.cn.bing.net/th/id/OIP-C.JCEcaQJVR_vC2kgt6BGZlAAAAA?rs=1&pid=ImgDetMain"
          alt="User Avatar" class="icon"
          @click="navigateToProfile"
           />
      </div>
      <p></p>
      <div style="width: 86px; text-align: center;margin-top: 5px;">{{ userStore.$state.userInfo?.username }}
      </div>
    </div>


    <div class="menu">

      <div class="menu-item" @click="navigateTo('/modelfile')" :class="{ active: $route.path === '/modelfile' }">
        <i class="el-icon-document-add"></i>
        <span>模板管理</span>
      </div>
      
      <div class="menu-item" @click="navigateTo('/filemanage')" :class="{ active: $route.path === '/filemanage' }">
        <i class="el-icon-folder"></i>
        <span>文件管理</span>
      </div>

      <div class="menu-item" @click="navigateTo('/permissions')" :class="{ active: $route.path === '/permissions' }">
        <i class="el-icon-document-add"></i>
        <span>权限管理</span>
      </div>

      <div class="menu-item" @click="navigateTo('/setting')" :class="{ active: $route.path === '/setting' }">
        <i class="el-icon-document-add"></i>
        <span>设置</span>
      </div>
    </div>
    <div class="user-info">
      <div class="avatar">
        <img src="https://tse3-mm.cn.bing.net/th/id/OIP-C.JCEcaQJVR_vC2kgt6BGZlAAAAA?rs=1&pid=ImgDetMain"
          alt="User Avatar"
          @click="navigateToProfile"
          />
      </div>
      <div class="user-details">
        <div class="user-name">{{ userStore.$state.userInfo?.username }}</div>
        <div class="user-role">{{ userStore.$state.userInfo?.organization }}</div>
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
  width: 250px;
  height: 220px;
  background: #516076;
  overflow-y: auto;
  margin-top: 200px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.menu-item {
  height: 60px;
  width: 250px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  border-radius: 4px;
  margin-left: 10px;
  margin-right: 10px;
}

.menu-item:hover {
  background-color: #263445;
  transform: translateX(0px);
}

.menu-item.active {
  background-color: #178af6;
  color: white;
}

.menu-item i {
  margin-left: 60px;
  font-size: 18px;
  transition: all 0.3s ease;
}

.menu-item:hover i {
  transform: scale(1.2);
}

.user-express{
  width: 86px;
  height: 108px;
  font-size: 13px;
  /* display: flex; */
  position: relative;
  left: 70px;
  margin-top: 10px;
}

.user-info {
  height: 80px;
  margin-top: 450px;
  border-top: 1px solid #1f2d3d;
  display: flex;
  align-items: center;
  padding: 0 20px;
  background-color: #263445;
}

.main-avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
  border: 2px solid #ffffff33;
  transition: all 0.3s ease;
  
}
.icon{
  width: 100%;
  height: 100%;
  object-fit: cover;

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