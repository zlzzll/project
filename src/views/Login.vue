<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store';
import { ElMessage } from 'element-plus';

const router = useRouter();
const userStore = useUserStore();

const username = ref('');
const password = ref('');
const loading = ref(false);

const handleLogin = async () => {
  if (!username.value || !password.value) {
    ElMessage.warning('请输入用户名和密码');
    return;
  }

  loading.value = true;
  try {
    const success = userStore.login(username.value, password.value);
    if (success) {
      ElMessage.success('登录成功');
      router.push('/dashboard');
    } else {
      ElMessage.error('用户名或密码错误');
    }
  } catch (error) {
    ElMessage.error('登录失败，请重试');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h2>电子病历系统</h2>
        <p>医疗服务数字化管理平台</p>
      </div>
      <div class="login-form">
        <div class="form-item">
          <label>用户名</label>
          <input type="text" v-model="username" placeholder="请输入用户名" />
        </div>
        <div class="form-item">
          <label>密码</label>
          <input type="password" v-model="password" placeholder="请输入密码" @keyup.enter="handleLogin" />
        </div>
        <div class="form-item">
          <button :disabled="loading" @click="handleLogin" class="login-btn">
            <span class="btn-text">{{ loading ? '登录中...' : '登录' }}</span>
          </button>
        </div>
        <div class="login-tips">
          <p>提示：用户名 doctor，密码 password</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
  background-image: url('https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg');
  background-repeat: no-repeat;
  background-position: center 110px;
  background-size: 100%;
  animation: fadeIn 0.8s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.login-box {
  width: 400px;
  padding: 40px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  animation: slideUp 0.6s ease;
  transform-origin: center;
}

@keyframes slideUp {
  from { 
    opacity: 0; 
    transform: translateY(30px) scale(0.95);
  }
  to { 
    opacity: 1; 
    transform: translateY(0) scale(1);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-header h2 {
  font-size: 28px;
  color: #1890ff;
  margin-bottom: 10px;
  animation: fadeInDown 0.8s ease;
  animation-delay: 0.2s;
  animation-fill-mode: both;
}

@keyframes fadeInDown {
  from { 
    opacity: 0; 
    transform: translateY(-20px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
}

.login-header p {
  font-size: 14px;
  color: #999;
  animation: fadeInDown 0.8s ease;
  animation-delay: 0.3s;
  animation-fill-mode: both;
}

.form-item {
  margin-bottom: 24px;
  animation: fadeInUp 0.8s ease;
  animation-delay: calc(0.4s + var(--index, 0) * 0.1s);
  animation-fill-mode: both;
}

.form-item:nth-child(1) {
  --index: 1;
}

.form-item:nth-child(2) {
  --index: 2;
}

.form-item:nth-child(3) {
  --index: 3;
}

@keyframes fadeInUp {
  from { 
    opacity: 0; 
    transform: translateY(20px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
}

.form-item input {
  width: 100%;
  height: 40px;
  padding: 0 15px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  transition: all 0.3s;
}

.form-item input:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  outline: none;
}

.login-btn {
  width: 100%;
  height: 40px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.login-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.login-btn:hover::before {
  width: 300px;
  height: 300px;
}

.login-btn:hover {
  background-color: #40a9ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
}

.login-btn:active {
  transform: translateY(0);
  box-shadow: none;
}

.btn-text {
  position: relative;
  z-index: 1;
}

.login-btn:disabled {
  background-color: #d9d9d9;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.login-tips {
  text-align: center;
  font-size: 12px;
  color: #999;
  animation: fadeIn 0.8s ease;
  animation-delay: 0.7s;
  animation-fill-mode: both;
}
</style>