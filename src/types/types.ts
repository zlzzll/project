// 用户接口
export interface User {
    id: string;
    name: string;
    role: string;
  }
  
export  interface TemplateFile {
    id: number;
    name: string;
    createdBy: string;
    category: string;
    modifyDatetime: string;
}

export interface File {
  id: number;
  filename:string;
  templateName: string;
  createdBy: string;
  category: string;
  modifyDatetime: string;
}