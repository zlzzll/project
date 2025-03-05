import { defineStore } from 'pinia';
import type { Patient, MedicalRecord } from '../../types/types';

/**
 * 患者状态管理
 */
export const usePatientStore = defineStore('patient', {
  state: () => ({
    // 患者列表数据
    patients: [
      {
        id: '1',
        name: '李明',
        gender: '男',
        age: 45,
        idCard: '110101197508156614',
        phone: '13812345678',
        address: '北京市海淀区中关村南大街5号',
        medicalHistory: ['高血压', '糖尿病']
      },
      {
        id: '2',
        name: '王芳',
        gender: '女',
        age: 32,
        idCard: '310104198912054321',
        phone: '13987654321',
        address: '上海市徐汇区漕河泾开发区',
        medicalHistory: ['过敏性鼻炎']
      },
      {
        id: '3',
        name: '张伟',
        gender: '男',
        age: 28,
        idCard: '440301199302121234',
        phone: '13500123456',
        address: '广州市天河区珠江新城',
        medicalHistory: []
      }
    ] as Patient[],

    // 医疗记录数据
    medicalRecords: [
      {
        id: '1',
        patientId: '1',
        date: '2023-10-15',
        diagnosis: '高血压',
        symptoms: '头痛、眩晕、血压升高',
        treatment: '建议控制饮食，减少盐分摄入，规律服药',
        medications: ['氨氯地平片', '缬沙坦胶囊'],
        doctorId: '1',
        doctorName: 'Dr. Zhang Wei'
      },
      {
        id: '2',
        patientId: '1',
        date: '2023-11-20',
        diagnosis: '糖尿病',
        symptoms: '多饮、多尿、体重下降',
        treatment: '控制饮食，增加运动，定期监测血糖',
        medications: ['二甲双胍片'],
        doctorId: '1',
        doctorName: 'Dr. Zhang Wei'
      },
      {
        id: '3',
        patientId: '2',
        date: '2023-12-05',
        diagnosis: '过敏性鼻炎',
        symptoms: '鼻塞、流涕、打喷嚏',
        treatment: '避免接触过敏原，使用抗过敏药物',
        medications: ['氯雷他定片', '布地奈德鼻喷雾剂'],
        doctorId: '1',
        doctorName: 'Dr. Zhang Wei'
      }
    ] as MedicalRecord[]
  }),

  getters: {
    /**
     * 根据ID获取患者信息
     */
    getPatientById: (state) => (id: string) => {
      return state.patients.find(patient => patient.id === id);
    },

    /**
     * 根据患者ID获取其所有医疗记录
     */
    getRecordsByPatientId: (state) => (patientId: string) => {
      return state.medicalRecords.filter(record => record.patientId === patientId);
    },

    /**
     * 根据ID获取医疗记录
     */
    getRecordById: (state) => (id: string) => {
      return state.medicalRecords.find(record => record.id === id);
    }
  },

  actions: {
    /**
     * 添加新患者
     */
    addPatient(patient: Patient) {
      this.patients.push(patient);
    },

    /**
     * 添加医疗记录
     */
    addMedicalRecord(record: MedicalRecord) {
      this.medicalRecords.push(record);
    }
  }
});