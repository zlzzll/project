// 用户接口
export interface User {
    id: string;
    name: string;
    role: string;
  }
  
  // 患者接口
  export interface Patient {
    id: string;
    name: string;
    gender: string;
    age: number;
    idCard: string;
    phone: string;
    address: string;
    medicalHistory: string[];
  }
  
  // 医疗记录接口
  export interface MedicalRecord {
    id: string;
    patientId: string;
    date: string;
    diagnosis: string;
    symptoms: string;
    treatment: string;
    medications: string[];
    doctorId: string;
    doctorName: string;
  }