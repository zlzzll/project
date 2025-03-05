import { defineStore } from 'pinia';
import type { User } from '../../types/types';

/**
 * 用户状态管理
 */
export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null as User | null,
  }),
  
  actions: {
    /**
     * 用户登录
     * @param username 用户名
     * @param password 密码
     * @returns 登录是否成功
     */
    login(username: string, password: string) {
      // 在实际应用中，这里会是一个API调用
      if (username === 'doctor' && password === 'password') {
        const user = {
          id: '1',
          name: 'Dr. Zhang Wei',
          role: 'doctor'
        };
        this.currentUser = user;
        localStorage.setItem('user', JSON.stringify(user));
        return true;
      }
      return false;
    },

    /**
     * 用户登出
     */
    logout() {
      this.currentUser = null;
      localStorage.removeItem('user');
    },

    /**
     * 初始化用户信息
     */
    initUser() {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        this.currentUser = JSON.parse(userStr);
      }
    }
  }
});