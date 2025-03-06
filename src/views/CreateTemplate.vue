<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'; 


declare type File = {
  name: string;
  size: number;
  type: string;
  lastModified: number;
};

const router = useRouter();
const templateName = ref('');
const templateType = ref('b类');
const fileList = ref<File[]>([]);

const handleFileUpload = (e:EventTarget|null|any) => {
    const file = (e as HTMLInputElement).files?.[0];
  if (file) {
    fileList.value.push(file); 
  }
};

const handleSubmit = () => {
  if (!templateName.value) {
    ElMessage.warning('请输入模板名称');
    return;
  }
  if (fileList.value.length === 0) {
    ElMessage.warning('请上传模板文件');
    return;
  }
  
  ElMessage.success('模板创建成功');
  router.push('/modelfile');
};

const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  const files = e.dataTransfer?.files;
  if (files && files.length > 0) {
    const file = files[0];
    handleFileUpload(file);
  }
};

const removeFile = (index: number) => {
  fileList.value.splice(index, 1);
};
</script>

<template>
  <div class="create-template">
    <div class="template-form">
      <h2>创建模板</h2>
      
      <div class="form-group">
        <label>模板类别</label>
        <div class="select-wrapper">
          <select v-model="templateType">
            <option value="a类">a类</option>
            <option value="b类">b类</option>
          </select>
          <div class="help-icon" title="选择模板类别">?</div>
        </div>
      </div>

      <div class="form-group">
        <label>模板名称</label>
        <input 
          type="text" 
          v-model="templateName"
          placeholder="请输入模板名称"
        />
      </div>

      <div class="form-group">
        <label>模板上传</label>
        <div 
          class="upload-area"
          @dragover="handleDragOver"
          @drop="handleDrop"
        >
          <input 
            type="file" 
            @change="(e) => handleFileUpload(e.target)"
            style="display: none"
            ref="fileInput"
          />
          <div v-if="fileList.length === 0" class="upload-placeholder">
            <div class="upload-icon">+</div>
            <p>点击或拖拽文件到此处上传</p>
          </div>
          <div v-else class="file-list">
            <div v-for="(file, index) in fileList" :key="index" class="file-item">
              <span>{{ file.name }}</span>
              <button @click="removeFile(index)" class="remove-btn">×</button>
            </div>
          </div>
        </div>
      </div>

      <button class="submit-btn" @click="handleSubmit">提交</button>
    </div>
  </div>
</template>

<style scoped>
.create-template {
  min-height: 100vh;
  padding: 2vw;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background: #f5f7fa;
}

.template-form {
  width: 100%;
  max-width: 800px;
  background: white;
  padding: 2em;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-bottom: 1.5em;
  color: #333;
  font-size: 1.5em;
}

.form-group {
  margin-bottom: 1.5em;
}

label {
  display: block;
  margin-bottom: 0.5em;
  color: #333;
  font-weight: 500;
}

input, select {
  width: 100%;
  padding: 0.8em;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 0.9em;
  transition: all 0.3s;
  box-sizing: border-box;
}

input:focus, select:focus {
  border-color: #409eff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.help-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #f4f4f5;
  color: #909399;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: help;
}

.upload-area {
  border: 2px dashed #dcdfe6;
  border-radius: 4px;
  padding: 2em;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area:hover {
  border-color: #409eff;
  background: rgba(64, 158, 255, 0.02);
}

.upload-placeholder {
  color: #909399;
}

.upload-icon {
  font-size: 2.5em;
  color: #909399;
  margin-bottom: 0.5em;
}

.file-list {
  width: 100%;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8em;
  background: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 0.5em;
}

.remove-btn {
  background: none;
  border: none;
  color: #f56c6c;
  cursor: pointer;
  font-size: 1.2em;
  padding: 0 0.5em;
  transition: color 0.3s;
}

.remove-btn:hover {
  color: #f78989;
}

.submit-btn {
  width: 100%;
  padding: 0.8em;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 1em;
}

.submit-btn:hover {
  background: #66b1ff;
  transform: translateY(-1px);
}

.submit-btn:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .create-template {
    padding: 1em;
  }

  .template-form {
    padding: 1.5em;
  }

  .upload-area {
    padding: 1em;
    min-height: 150px;
  }
}
</style>