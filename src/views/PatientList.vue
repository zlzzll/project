<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { usePatientStore } from '../store';
import { ElMessage, ElMessageBox } from 'element-plus';

const router = useRouter();
const patientStore = usePatientStore();

const searchQuery = ref('');
const showAddPatientForm = ref(false);

// New patient form data
const newPatient = ref({
  name: '',
  gender: '男',
  age: 0,
  idCard: '',
  phone: '',
  address: '',
  medicalHistory: []
});

// Filter patients based on search query
const filteredPatients = computed(() => {
  if (!searchQuery.value) return patientStore.patients;
  
  const query = searchQuery.value.toLowerCase();
  return patientStore.patients.filter(patient => 
    patient.name.toLowerCase().includes(query) || 
    patient.idCard.includes(query) ||
    patient.phone.includes(query)
  );
});

const viewPatient = (id: string) => {
  router.push(`/patients/${id}`);
};

const addPatient = () => {
  // Validate form
  if (!newPatient.value.name || !newPatient.value.idCard || !newPatient.value.phone) {
    ElMessage.warning('请填写必要的患者信息');
    return;
  }
  
  // Generate a new ID (in a real app, this would be handled by the backend)
  const newId = (patientStore.patients.length + 1).toString();
  
  // Add the new patient
  patientStore.addPatient({
    id: newId,
    ...newPatient.value,
    medicalHistory: []
  });
  
  // Reset form and hide it
  newPatient.value = {
    name: '',
    gender: '男',
    age: 0,
    idCard: '',
    phone: '',
    address: '',
    medicalHistory: []
  };
  showAddPatientForm.value = false;
  
  ElMessage.success('患者添加成功');
};

const cancelAddPatient = () => {
  showAddPatientForm.value = false;
  newPatient.value = {
    name: '',
    gender: '男',
    age: 0,
    idCard: '',
    phone: '',
    address: '',
    medicalHistory: []
  };
};
</script>

<template>
  <div class="patient-list-container">
    <div class="header">
      <h1>患者管理</h1>
      <div class="actions">
        <div class="search-box">
          <input type="text" v-model="searchQuery" placeholder="搜索患者姓名/身份证/电话" />
          <i class="el-icon-search"></i>  
        </div>
        <button class="add-btn" @click="showAddPatientForm = true">添加患者</button>
      </div>
    </div>
    
    <div class="patient-table">
      <table>
        <thead>
          <tr>
            <th>姓名</th>
            <th>性别</th>
            <th>年龄</th>
            <th>身份证号</th>
            <th>联系电话</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="patient in filteredPatients" :key="patient.id">
            <td>{{ patient.name }}</td>
            <td>{{ patient.gender }}</td>
            <td>{{ patient.age }}</td>
            <td>{{ patient.idCard }}</td>
            <td>{{ patient.phone }}</td>
            <td>
              <button class="view-btn" @click="viewPatient(patient.id)">查看</button>
            </td>
          </tr>
          <tr v-if="filteredPatients.length === 0">
            <td colspan="6" class="no-data">没有找到匹配的患者</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Add Patient Form Modal -->
    <div class="modal" v-if="showAddPatientForm">
      <div class="modal-content">
        <div class="modal-header">
          <h2>添加新患者</h2>
          <button class="close-btn" @click="cancelAddPatient">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>姓名 <span class="required">*</span></label>
            <input type="text" v-model="newPatient.name" placeholder="请输入患者姓名" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>性别</label>
              <select v-model="newPatient.gender">
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </div>
            <div class="form-group">
              <label>年龄</label>
              <input type="number" v-model="newPatient.age" placeholder="请输入年龄" />
            </div>
          </div>
          <div class="form-group">
            <label>身份证号 <span class="required">*</span></label>
            <input type="text" v-model="newPatient.idCard" placeholder="请输入身份证号" />
          </div>
          <div class="form-group">
            <label>联系电话 <span class="required">*</span></label>
            <input type="text" v-model="newPatient.phone" placeholder="请输入联系电话" />
          </div>
          <div class="form-group">
            <label>住址</label>
            <input type="text" v-model="newPatient.address" placeholder="请输入住址" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="cancelAddPatient">取消</button>
          <button class="submit-btn" @click="addPatient">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.patient-list-container {
  padding: 20px;
  background-color: #f5f7fa;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h1 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.actions {
  display: flex;
  align-items: center;
}

.search-box {
  position: relative;
  margin-right: 15px;
  background-color: white;
}

.search-box input {
  width: 250px;
  height: 36px;
  padding: 0 15px 0 35px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  transition: all 0.3s;
}

.search-box input:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  outline: none;
}

.search-box i {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.add-btn {
  height: 36px;
  padding: 0 15px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.add-btn:hover {
  background-color: #40a9ff;
}

.patient-table {
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
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

.no-data {
  text-align: center;
  color: #999;
  padding: 30px 0;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 500px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-row {
  display: flex;
  gap: 15px;
}

.form-row .form-group {
  flex: 1;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #606266;
}

.required {
  color: #f56c6c;
}

.form-group input, .form-group select {
  width: 100%;
  height: 36px;
  padding: 0 15px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  transition: all 0.3s;
}

.form-group input:focus, .form-group select:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  outline: none;
}

.modal-footer {
  padding: 10px 20px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-btn, .submit-btn {
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.cancel-btn {
  background-color: white;
  border: 1px solid #d9d9d9;
  color: #606266;
}

.submit-btn {
  background-color: #1890ff;
  border: none;
  color: white;
}
</style>