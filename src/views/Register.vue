<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

// 路由器实例
const router = useRouter();

// 表单数据
const formData = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  captcha: ''
});

// 验证码相关
const captchaImage = ref('');
const captchaText = ref('');

// 表单验证状态
const formErrors = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  captcha: ''
});

// 生成随机验证码
const generateCaptcha = () => {
  // 生成随机字符
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let captcha = '';
  for (let i = 0; i < 4; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  captchaText.value = captcha;
  
  // 创建验证码图片
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 40;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // 背景
    ctx.fillStyle = '#f0f2f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 文字
    ctx.fillStyle = '#333';
    ctx.font = 'bold 20px Arial';
    ctx.textBaseline = 'middle';
    
    // 添加干扰线
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }
    
    // 添加验证码文字
    for (let i = 0; i < captcha.length; i++) {
      ctx.fillStyle = `rgb(${Math.random() * 150},${Math.random() * 150},${Math.random() * 150})`;
      ctx.fillText(
        captcha.charAt(i),
        20 + i * 20,
        canvas.height / 2 + Math.random() * 8 - 4
      );
    }
  }
  
  // 转换为图片URL
  captchaImage.value = canvas.toDataURL('image/png');
};

// 表单验证
const validateForm = () => {
  let isValid = true;
  
  // 验证邮箱
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email) {
    formErrors.email = '请输入邮箱地址';
    isValid = false;
  } else if (!emailRegex.test(formData.email)) {
    formErrors.email = '请输入有效的邮箱地址';
    isValid = false;
  } else {
    formErrors.email = '';
  }
  
  // 验证密码
  if (!formData.password) {
    formErrors.password = '请输入密码';
    isValid = false;
  } else if (formData.password.length < 6) {
    formErrors.password = '密码长度不能少于6个字符';
    isValid = false;
  } else {
    formErrors.password = '';
  }
  
  // 验证确认密码
  if (!formData.confirmPassword) {
    formErrors.confirmPassword = '请确认密码';
    isValid = false;
  } else if (formData.confirmPassword !== formData.password) {
    formErrors.confirmPassword = '两次输入的密码不一致';
    isValid = false;
  } else {
    formErrors.confirmPassword = '';
  }
  
  // 验证验证码
  if (!formData.captcha) {
    formErrors.captcha = '请输入验证码';
    isValid = false;
  } else if (formData.captcha.toLowerCase() !== captchaText.value.toLowerCase()) {
    formErrors.captcha = '验证码不正确';
    isValid = false;
  } else {
    formErrors.captcha = '';
  }
  
  return isValid;
};

// 提交注册表单
const handleRegister = () => {
  if (validateForm()) {
    // 这里应该是调用API进行注册
    // 模拟注册成功
    ElMessage.success('注册成功，请登录');
    router.push('/login');
  }
};

// 返回登录页
const goToLogin = () => {
  router.push('/login');
};

// 组件挂载时生成验证码
generateCaptcha();
</script>

<template>
  <div class="register-container">
    <div class="register-box">
      <div class="register-header">
        <h2>用户注册</h2>
        <p>欢迎加入电子病历系统</p>
      </div>
      
      <div class="register-form">
        <div class="form-item">
          <label>邮箱 <span class="required">*</span></label>
          <input 
            type="email" 
            v-model="formData.email" 
            placeholder="请输入邮箱地址" 
            @focus="formErrors.email = ''"
          />
          <div class="error-message" v-if="formErrors.email">{{ formErrors.email }}</div>
        </div>
        
        <div class="form-item">
          <label>密码 <span class="required">*</span></label>
          <input 
            type="password" 
            v-model="formData.password" 
            placeholder="请输入密码" 
            @focus="formErrors.password = ''"
          />
          <div class="error-message" v-if="formErrors.password">{{ formErrors.password }}</div>
        </div>
        
        <div class="form-item">
          <label>确认密码 <span class="required">*</span></label>
          <input 
            type="password" 
            v-model="formData.confirmPassword" 
            placeholder="请再次输入密码" 
            @focus="formErrors.confirmPassword = ''"
          />
          <div class="error-message" v-if="formErrors.confirmPassword">{{ formErrors.confirmPassword }}</div>
        </div>
        
        <div class="form-item captcha-container">
          <label>验证码 <span class="required">*</span></label>
          <div class="captcha-input-container">
            <input 
              type="text" 
              v-model="formData.captcha" 
              placeholder="请输入验证码" 
              @focus="formErrors.captcha = ''"
            />
            <div class="captcha-image" @click="generateCaptcha">
              <img :src="captchaImage" alt="验证码" />
            </div>
          </div>
          <div class="error-message" v-if="formErrors.captcha">{{ formErrors.captcha }}</div>
        </div>
        
        <div class="form-actions">
          <button class="register-btn" @click="handleRegister">注册</button>
          <button class="login-btn" @click="goToLogin">返回登录</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  height: 100vh;
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

.register-box {
  width: 450px;
  padding: 40px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  animation: slideUp 0.6s ease;
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

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h2 {
  font-size: 28px;
  color: #1890ff;
  margin-bottom: 10px;
}

.register-header p {
  font-size: 14px;
  color: #999;
}

.register-form {
  animation: fadeIn 0.8s ease;
}

.form-item {
  margin-bottom: 20px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
}

.required {
  color: #f56c6c;
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

.error-message {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 5px;
}

.captcha-container {
  margin-bottom: 30px;
}

.captcha-input-container {
  display: flex;
  align-items: center;
}

.captcha-input-container input {
  flex: 1;
  margin-right: 10px;
}

.captcha-image {
  width: 100px;
  height: 40px;
  cursor: pointer;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  overflow: hidden;
}

.captcha-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.register-btn, .login-btn {
  height: 40px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
}

.register-btn {
  background-color: #1890ff;
  color: white;
  border: none;
}

.register-btn:hover {
  background-color: #40a9ff;
}

.login-btn {
  background-color: white;
  color: #1890ff;
  border: 1px solid #1890ff;
}

.login-btn:hover {
  background-color: #f0f7ff;
}
</style>