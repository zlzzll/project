// 用户接口
export interface User {
  id: number,
  email:string,
  accessToken: string,
  refreshToken: string
  }
  
// 用户信息接口
export interface UserInfo{
  id: number,
  username:string,
  email:string,
  organization:string,
  avatarUrl:string
}

// 模板文件接口
export  interface TemplateFile {
    id: number;
    name: string;
    createdBy: string;
    category: string;
    modifyDatetime: string;
}

// 文件接口
export interface MyFile {
  id: number;
  filename:string;
  templateName: string;
  createdBy: string;
  category: string;
  modifyDatetime: string;
}