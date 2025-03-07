import { defineStore } from 'pinia';
import type { User } from '../../types/types';
import axios from 'axios';
import host from '../../config/hostname';
import verifyCode from '../../tools/verifyCode';
import { ElMessage } from 'element-plus';

/**
 * 用户状态管理
 */
const hostname = host()
export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null as User | null,
  }),

  actions: {
    /**
     * 用户登录
     * @param  email 用户邮箱
     * @param password 密码
     * @returns 登录是否成功
     */
    async login(email: string, password: string) {
      try {
        const response = await axios.post(hostname + '/api/login', {
          email: email,
          password: password,
        });


        if (response.data.code === 200) {
          const user = {
            id: response.data.data.id,
            email: response.data.data.email,
            accessToken: response.data.tokens[0],
            refreshToken: response.data.tokens[1]
          }
          localStorage.setItem('user', JSON.stringify(user));

          return 200
        } else {

          return response.data.code;
        }

      } catch (e) {
        console.error(e);
        return "请求错误";
      }
    },

    /**
     * 用户登出
     */
    async logout() {
      const userItem = localStorage.getItem('user');
      if (userItem !== null) {    
        //反序列化
        const user = JSON.parse(userItem)
        const res =await axios.post(`/auth/logout/${user.id}`,{
          userid: user.id
        });
        if ( res.data.code=== 200) {
          ElMessage.success('登出成功');
        } else {
          ElMessage.error('登出失败');
          ElMessage.error(verifyCode(res.data.code))
        }
      } else {
        // 处理用户信息不存在的情况
        console.error("用户信息不存在");
      }

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