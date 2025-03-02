<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePatientStore } from '../store';

const route = useRoute();
const router = useRouter();
const patientStore = usePatientStore();

const patientId = computed(() => route.params.id as string);
const patient = computed(() => patientStore.getPatientById(patientId.value));
const patientRecords = computed(() => patientStore.getRecordsByPatientId(patientId.value));

const navigateToRecord = (id: string) => {
  router.push(`/records/${id}`);
};

const createNewRecord = () => {
  router.push({
    path: '/new-record',
    query: { patientId: patientId.value }
  });
};

onMounted(() => {
  if (!patient.value) {
    router.push('/patients');
  }
});
</script>

<template>
  <div class="patient-detail-container" v-if="patient">
    <div class="header">
      <div class="back-button" @click="router.push('/patients')">
        <i class="el-icon-arrow-left"></i> 返回患者列表
      </div>
      <h1>患者详情</h1>
    </div>
    
    <div class="patient-info-card">
      <div class="patient-header">
        <div class="patient-name">{{ patient.name }}</div>
        <button class="new-record-btn" @click="createNewRecord">新建病历</button>
      </div>
      
      <div class="patient-details">
        <div class="detail-item">
          <div class="detail-label">性别</div>
          <div class="detail-value">{{ patient.gender }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">年龄</div>
          <div class="detail-value">{{ patient.age }}岁</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">身份证号</div>
          <div class="detail-value">{{ patient.idCard }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">联系电话</div>
          <div class="detail-value">{{ patient.phone }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">住址</div>
          <div class="detail-value">{{ patient.address }}</div>
        </div>
      </div>
      
      <div class="medical-history" v-if="patient.medicalHistory.length > 0">
        <h3>既往病史</h3>
        <div class="history-tags">
          <span class="history-tag" v-for="(history, index) in patient.medicalHistory" :key="index">
            {{ history }}
          </span>
        </div>
      </div>
    </div>
    
    <div class="medical-records">
      <h2>病历记录</h2>
      <div class="records-table" v-if="patientRecords.length > 0">
        <table>
          <thead>
            <tr>
              <th>日期</th>
              <th>诊断</th>
              <th>医生</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in patientRecords" :key="record.id">
              <td>{{ record.date }}</td>
              <td>{{ record.diagnosis }}</td>
              <td>{{ record.doctorName }}</td>
              <td>
                <button class="view-btn" @click="navigateToRecord(record.id)">查看</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="no-records" v-else>
        <p>暂无病历记录</p>
        <button class="create-record-btn" @click="createNewRecord">创建第一份病历</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.patient-detail-container {
  padding: 20px;
  background-color: #f5f7fa;
}

.header {
  margin-bottom: 20px;
}

.back-button {
  display: inline-flex;
  align-items: center;
  color: #1890ff;
  cursor: pointer;
  margin-bottom: 10px;
}

.header h1 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.patient-info-card {
  background-color: white;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.patient-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.patient-name {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.new-record-btn {
  padding: 8px 15px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.patient-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  flex-direction: column;
}

.detail-label {
  font-size: 14px;
  color: #999;
  margin-bottom: 5px;
}

.detail-value {
  font-size: 16px;
  color: #333;
}

.medical-history h3 {
  font-size: 16px;
  margin-top: 0;
  margin-bottom: 10px;
  color: #333;
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.history-tag {
  padding: 5px 10px;
  background-color: #f0f2f5;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
}

.medical-records {
  background-color: white;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.medical-records h2 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
  color: #333;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ebeef5;
}

th {
  font-weight: bold;
  color: #606266;
  background-color: #f5f7fa;
}

.view-btn {
  padding: 5px 10px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.no-records {
  text-align: center;
  padding: 30px 0;
}

.no-records p {
  color: #999;
  margin-bottom: 15px;
}

.create-record-btn {
  padding: 8px 15px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>