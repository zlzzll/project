<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePatientStore, useUserStore } from '../store';
import { ElMessage } from 'element-plus';

const route = useRoute();
const router = useRouter();
const patientStore = usePatientStore();
const userStore = useUserStore();

// Check if patientId is provided in the query params
const preSelectedPatientId = computed(() => route.query.patientId as string | undefined);

// State for patient selection
const selectedPatientId = ref(preSelectedPatientId.value || '');
const showPatientSelector = ref(!preSelectedPatientId.value);

// Form data
const recordForm = ref({
  symptoms: '',
  diagnosis: '',
  treatment: '',
  medications: [''] // Start with one empty medication field
});

// Add/remove medication fields
const addMedicationField = () => {
  recordForm.value.medications.push('');
};

const removeMedicationField = (index: number) => {
  if (recordForm.value.medications.length > 1) {
    recordForm.value.medications.splice(index, 1);
  }
};

// Get the selected patient
const selectedPatient = computed(() => {
  if (!selectedPatientId.value) return null;
  return patientStore.getPatientById(selectedPatientId.value);
});

// Select a patient
const selectPatient = (id: string) => {
  selectedPatientId.value = id;
  showPatientSelector.value = false;
};

// Save the record
const saveRecord = () => {
  if (!selectedPatientId.value) {
    ElMessage.warning('请选择患者');
    return;
  }
  
  if (!recordForm.value.symptoms || !recordForm.value.diagnosis) {
    ElMessage.warning('请填写必要的病历信息');
    return;
  }
  
  // Filter out empty medication fields
  const medications = recordForm.value.medications.filter(med => med.trim() !== '');
  
  // Generate a new record ID (in a real app, this would be handled by the backend)
  const newId = (patientStore.medicalRecords.length + 1).toString();
  
  // Create the new record
  const newRecord = {
    id: newId,
    patientId: selectedPatientId.value,
    date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
    diagnosis: recordForm.value.diagnosis,
    symptoms: recordForm.value.symptoms,
    treatment: recordForm.value.treatment,
    medications: medications,
    doctorId: userStore.currentUser?.id || '',
    doctorName: userStore.currentUser?.name || ''
  };
  
  // Add the record to the store
  patientStore.addMedicalRecord(newRecord);
  
  ElMessage.success('病历保存成功');
  
  // Navigate to the new record
  router.push(`/records/${newId}`);
};

// Cancel and go back
const cancel = () => {
  router.go(-1);
};

onMounted(() => {
  if (preSelectedPatientId.value) {
    // If a patient ID was provided, verify it exists
    const patient = patientStore.getPatientById(preSelectedPatientId.value);
    if (!patient) {
      ElMessage.error('找不到指定的患者');
      router.push('/patients');
    }
  }
});
</script>

<template>
  <div class="new-record-container">
    <div class="header">
      <div class="back-button" @click="cancel">
        <i class="el-icon-arrow-left"></i> 取消
      </div>
      <h1>新建病历</h1>
    </div>
    
    <!-- Patient Selection -->
    <div class="patient-selection" v-if="!selectedPatient">
      <div class="selection-header">
        <h2>选择患者</h2>
      </div>
      <div class="patient-list">
        <div 
          v-for="patient in patientStore.patients" 
          :key="patient.id" 
          class="patient-item"
          @click="selectPatient(patient.id)"
        >
          <div class="patient-name">{{ patient.name }}</div>
          <div class="patient-info">{{ patient.gender }}, {{ patient.age }}岁</div>
          <div class="patient-id">身份证: {{ patient.idCard }}</div>
        </div>
      </div>
    </div>
    
    <!-- Record Form -->
    <div class="record-form" v-if="selectedPatient">
      <div class="patient-info-bar">
        <div class="patient-details">
          <span class="patient-name">{{ selectedPatient.name }}</span>
          <span class="patient-gender-age">{{ selectedPatient.gender }}, {{ selectedPatient.age }}岁</span>
        </div>
        <button class="change-patient-btn" @click="showPatientSelector = true" v-if="!showPatientSelector">
          更换患者
        </button>
      </div>
      
      <!-- Patient Selector Modal -->
      <div class="modal" v-if="showPatientSelector">
        <div class="modal-content">
          <div class="modal-header">
            <h2>选择患者</h2>
            <button class="close-btn" @click="showPatientSelector = false">&times;</button>
          </div>
          <div class="modal-body">
            <div class="patient-list">
              <div 
                v-for="patient in patientStore.patients" 
                :key="patient.id" 
                class="patient-item"
                @click="selectPatient(patient.id)"
              >
                <div class="patient-name">{{ patient.name }}</div>
                <div class="patient-info">{{ patient.gender }}, {{ patient.age }}岁</div>
                <div class="patient-id">身份证: {{ patient.idCard }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="form-section">
        <div class="form-group">
  <label>主诉 <span class="required">*</span></label>
  <textarea v-model="recordForm.symptoms" placeholder="请输入患者主诉"></textarea>
</div>
        
        <div class="form-group">
          <label>诊断 <span class="required">*</span></label>
          <textarea v-model="recordForm.diagnosis" placeholder="请输入诊断结果"></textarea>
        </div>
        
        <div class="form-group">
          <label>治疗方案</label>
          <textarea v-model="recordForm.treatment" placeholder="请输入治疗方案"></textarea>
        </div>
        
        <div class="form-group">
          <label>用药</label>
          <div class="medications-list">
            <div class="medication-item" v-for="(medication, index) in recordForm.medications" :key="index">
              <input type="text" v-model="recordForm.medications[index]" placeholder="请输入药品名称" />
              <button class="remove-btn" @click="removeMedicationField(index)" v-if="recordForm.medications.length > 1">
                <i class="el-icon-delete"></i>
              </button>
            </div>
            <button class="add-medication-btn" @click="addMedicationField">
              <i class="el-icon-plus"></i> 添加药品
            </button>
          </div>
        </div>
      </div>
      
      <div class="form-actions">
        <button class="cancel-btn" @click="cancel">取消</button>
        <button class="save-btn" @click="saveRecord">保存病历</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.new-record-container {
  padding: 20px;
  background-color: #f5f7fa;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.back-button {
  display: inline-flex;
  align-items: center;
  color: #1890ff;
  cursor: pointer;
  margin-right: 15px;
}

.header h1 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

/* Patient Selection */
.patient-selection {
  background-color: white;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.selection-header {
  margin-bottom: 20px;
}

.selection-header h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.patient-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
}

.patient-item {
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.patient-item:hover {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.patient-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.patient-info, .patient-id {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

/* Record Form */
.record-form {
  background-color: white;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(255, 248, 248, 0.1);
}

.patient-info-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.patient-details {
  display: flex;
  align-items: center;
}

.patient-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-right: 10px;
}

.patient-gender-age {
  font-size: 14px;
  color: #666;
}

.change-patient-btn {
  padding: 5px 10px;
  background-color: #f5f7fa;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  color: #606266;
  cursor: pointer;
}

.form-section {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;
}

.required {
  color: #f56c6c;
}

.form-group textarea {
  width: 100%;
  height: 100px;
  padding: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  resize: vertical;
}

.form-group textarea:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  outline: none;
}

.medications-list {
  margin-bottom: 10px;
}

.medication-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.medication-item input {
  flex: 1;
  height: 36px;
  padding: 0 15px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.medication-item input:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  outline: none;
}

.remove-btn {
  background: none;
  border: none;
  color: #f56c6c;
  cursor: pointer;
  margin-left: 10px;
}

.add-medication-btn {
  padding: 8px 15px;
  background-color: #f5f7fa;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  color: #606266;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-medication-btn i {
  margin-right: 5px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-btn, .save-btn {
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.cancel-btn {
  background-color: white;
  border: 1px solid #dcdfe6;
  color: #606266;
}

.save-btn {
  background-color: #1890ff;
  border: none;
  color: white;
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
  width: 600px;
  max-height: 80vh;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
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
  overflow-y: auto;
}
</style>