<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { usePatientStore, useUserStore } from '../store';

const router = useRouter();
const patientStore = usePatientStore();
const userStore = useUserStore();

const recentRecords = computed(() => {
  return patientStore.medicalRecords.slice(0, 5);
});

const navigateToPatient = (id: string) => {
  router.push(`/patients/${id}`);
};

const navigateToRecord = (id: string) => {
  router.push(`/records/${id}`);
};
</script>

<template>
  <div class="dashboard-container">
    <div class="header">
      <h1>欢迎，{{ userStore.currentUser?.name }}</h1>
      <p>今天是 {{ new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
    </div>
    
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon patients-icon">
          <i class="el-icon-user"></i>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ patientStore.patients.length }}</div>
          <div class="stat-label">患者总数</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon records-icon">
          <i class="el-icon-document"></i>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ patientStore.medicalRecords.length }}</div>
          <div class="stat-label">病历总数</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon today-icon">
          <i class="el-icon-date"></i>
        </div>
        <div class="stat-info">
          <div class="stat-value">2</div>
          <div class="stat-label">今日新增</div>
        </div>
      </div>
    </div>
    
    <div class="recent-section">
      <h2>最近病历</h2>
      <div class="recent-records">
        <table>
          <thead>
            <tr>
              <th>日期</th>
              <th>患者姓名</th>
              <th>诊断</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in recentRecords" :key="record.id" class="record-row">
              <td>{{ record.date }}</td>
              <td>{{ patientStore.getPatientById(record.patientId)?.name }}</td>
              <td>{{ record.diagnosis }}</td>
              <td>
                <button class="view-btn" @click="navigateToRecord(record.id)">查看</button>
                <button class="patient-btn" @click="navigateToPatient(record.patientId)">患者信息</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="quick-actions">
      <h2>快捷操作</h2>
      <div class="action-buttons">
        <button class="action-btn" @click="router.push('/patients')">
          <i class="el-icon-user"></i>
          <span>患者管理</span>
        </button>
        <button class="action-btn" @click="router.push('/new-record')">
          <i class="el-icon-document-add"></i>
          <span>新建病历</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 20px;
  background-color: #f5f7fa;
}

.header {
  margin-bottom: 30px;
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.header h1 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.header p {
  margin: 5px 0 0;
  color: #666;
}

.stats-cards {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  animation: slideIn 0.5s ease-in-out;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

.stat-card {
  flex: 1;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 24px;
  color: white;
  transition: all 0.3s ease;
}

.stat-card:hover .stat-icon {
  transform: scale(1.1) rotate(10deg);
}

.patients-icon {
  background-color: #1890ff;
}

.records-icon {
  background-color: #52c41a;
}

.today-icon {
  background-color: #faad14;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.recent-section, .quick-actions {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  animation: fadeUp 0.5s ease-in-out;
  animation-delay: 0.2s;
  animation-fill-mode: both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.recent-section h2, .quick-actions h2 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
  color: #333;
  position: relative;
  padding-left: 12px;
}

.recent-section h2::before, .quick-actions h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 16px;
  background-color: #1890ff;
  border-radius: 2px;
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

.record-row {
  transition: all 0.3s ease;
}

.record-row:hover {
  background-color: #f0f7ff;
}

.view-btn, .patient-btn {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
  font-size: 12px;
  transition: all 0.3s ease;
}

.view-btn {
  background-color: #1890ff;
  color: white;
}

.patient-btn {
  background-color: #52c41a;
  color: white;
}

.view-btn:hover, .patient-btn:hover {
  opacity: 0.8;
  transform: translateY(-2px);
}

.action-buttons {
  display: flex;
  gap: 20px;
}

.action-btn {
  flex: 1;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background-color: #e6f7ff;
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.action-btn i {
  font-size: 32px;
  margin-bottom: 10px;
  color: #1890ff;
  transition: all 0.3s ease;
}

.action-btn:hover i {
  transform: scale(1.2);
}

.action-btn span {
  font-size: 16px;
  color: #333;
}

@media (max-width: 768px) {
  .stats-cards {
    flex-direction: column;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>