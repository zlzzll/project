// 用户接口
export interface User {
  id: number,
  email:string,
  accessToken: string,
  refreshToken: string
  }
  
// 用户信息接口
export interface UserInfo{
  name:string,
  email:string,
  role:string,
  avatar:string
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