<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePatientStore } from '../store';

const route = useRoute();
const router = useRouter();
const patientStore = usePatientStore();

const recordId = computed(() => route.params.id as string);
const record = computed(() => patientStore.getRecordById(recordId.value));
const patient = computed(() => record.value ? patientStore.getPatientById(record.value.patientId) : null);

onMounted(() => {
  if (!record.value || !patient.value) {
    router.push('/dashboard');
  }
});

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const printRecord = () => {
  window.print();
};
</script>

<template>
  <div class="medical-record-container" v-if="record && patient">
    <div class="header">
      <div class="back-button" @click="router.push(`/patients/${patient.id}`)">
        <i class="el-icon-arrow-left"></i> 返回患者详情
      </div>
      <h1>病历详情</h1>
      <button class="print-btn" @click="printRecord">
        <i class="el-icon-printer"></i> 打印
      </button>
    </div>
    
    <div class="record-content">
      <div class="record-header">
        <h2>门诊病历</h2>
        <div class="record-date">就诊日期：{{ formatDate(record.date) }}</div>
      </div>
      
      <div class="patient-info">
        <div class="info-row">
          <div class="info-item">
            <span class="label">姓名：</span>
            <span class="value">{{ patient.name }}</span>
          </div>
          <div class="info-item">
            <span class="label">性别：</span>
            <span class="value">{{ patient.gender }}</span>
          </div>
          <div class="info-item">
            <span class="label">年龄：</span>
            <span class="value">{{ patient.age }}岁</span>
          </div>
        </div>
        <div class="info-row">
          <div class="info-item">
            <span class="label">身份证号：</span>
            <span class="value">{{ patient.idCard }}</span>
          </div>
          <div class="info-item">
            <span class="label">联系电话：</span>
            <span class="value">{{ patient.phone }}</span>
          </div>
        </div>
      </div>
      
      <div class="record-section">
        <h3>主诉</h3>
        <div class="section-content">{{ record.symptoms }}</div>
      </div>
      
      <div class="record-section">
        <h3>诊断</h3>
        <div class="section-content">{{ record.diagnosis }}</div>
      </div>
      
      <div class="record-section">
        <h3>治疗方案</h3>
        <div class="section-content">{{ record.treatment }}</div>
      </div>
      
      <div class="record-section">
        <h3>用药</h3>
        <div class="section-content">
          <ul class="medication-list">
            <li v-for="(medication, index) in record.medications" :key="index">
              {{ medication }}
            </li>
          </ul>
        </div>
      </div>
      
      <div class="record-footer">
        <div class="doctor-info">
          <span class="label">医生：</span>
          <span class="value">{{ record.doctorName }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.medical-record-container {
  padding: 20px;
  background-color: #f5f7fa;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.back-button {
  display: inline-flex;
  align-items: center;
  color: #1890ff;
  cursor: pointer;
}

.header h1 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.print-btn {
  padding: 8px 15px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.print-btn i {
  margin-right: 5px;
}

.record-content {
  background-color: white;
  border-radius: 4px;
  padding: 30px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.record-header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.record-header h2 {
  margin: 0 0 10px;
  font-size: 24px;
  color: #333;
}

.record-date {
  color: #666;
}

.patient-info {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.info-row {
  display: flex;
  margin-bottom: 10px;
}

.info-item {
  margin-right: 30px;
}

.label {
  color: #666;
}

.value {
  font-weight: bold;
  color: #333;
}

.record-section {
  margin-bottom: 25px;
}

.record-section h3 {
  margin: 0 0 10px;
  font-size: 18px;
  color: #333;
  padding-bottom: 5px;
  border-bottom: 1px dashed #ebeef5;
}

.section-content {
  color: #333;
  line-height: 1.6;
}

.medication-list {
  margin: 0;
  padding-left: 20px;
}

.medication-list li {
  margin-bottom: 5px;
}

.record-footer {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
  display: flex;
  justify-content: flex-end;
}

@media print {
  .header {
    display: none;
  }
  
  .medical-record-container {
    padding: 0;
  }
  
  .record-content {
    box-shadow: none;
  }
}
</style>