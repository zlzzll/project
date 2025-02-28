<script setup lang="ts">
import Sidebar from '../components/Sidebar.vue';
import { ref } from 'vue';

interface EditData {
    field: 'username' | 'organization' | 'email';
    value: string;
}

// 用户信息
const userInfo = ref({
    username: 'JohnDoe',
    organization: '技术部',
    email: 'johndoe@example.com',
});

// 是否显示编辑弹窗
const showDialog = ref(false);

// 当前编辑的数据
const editData = ref<EditData>({ field: 'username', value: '' });

// 临时值
const tempValue = ref('');

// 是否显示文件上传窗口
const fileLoading = ref(false);

// 打开编辑器
const openEditor = (field: EditData['field'], value: string) => {
    editData.value = { field, value };
    tempValue.value = value;
    showDialog.value = true;
};

// 保存编辑内容
const saveEdit = () => {
    userInfo.value[editData.value.field] = tempValue.value;
    showDialog.value = false;
};

// 打开文件上传功能
const openFileUpload = () => {
    fileLoading.value = true;
};

// 处理文件上传
const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            // 更新头像 URL
            (document.querySelector('.setting-icon') as HTMLImageElement).src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }
};

// 关闭文件上传窗口
const closeFileUpload = () => {
    fileLoading.value = false;
};
</script>

<template>
    <div class="main-container">
        <Sidebar />
        <div class="settings-container">
            <h2>设置</h2>
            <div class="setting-item">
                <div class="label">头像：</div>
                <div style="padding-right: 1104px;">
                    <img
                        class="setting-icon"
                        src="https://tse3-mm.cn.bing.net/th/id/OIP-C.JCEcaQJVR_vC2kgt6BGZlAAAAA?rs=1&pid=ImgDetMain"
                        alt="User Avatar"
                    />
                </div>
                <button class="edit-btn" @click="openFileUpload">编辑</button>
            </div>

            <!-- 设置项列表 -->
            <div class="setting-item">
                <div class="label">用户名：</div>
                <div class="value">{{ userInfo.username }}</div>
                <button class="edit-btn" @click="openEditor('username', userInfo.username)">编辑</button>
            </div>

            <div class="setting-item">
                <div class="label">所属组织：</div>
                <div class="value">{{ userInfo.organization }}</div>
                <button class="edit-btn" @click="openEditor('organization', userInfo.organization)">编辑</button>
            </div>

            <div class="setting-item">
                <div class="label">邮箱：</div>
                <div class="value">{{ userInfo.email }}</div>
                <button class="edit-btn" @click="openEditor('email', userInfo.email)">编辑</button>
            </div>

            <div class="setting-save">
                <button class="save-btn" @click="saveEdit">保存</button>
            </div>

            <!-- 权限管理模块 -->
            <div class="permission-section">
                <h3>权限管理</h3>
                <button class="permission-btn">管理权限</button>
            </div>

            <!-- 编辑弹窗 -->
            <div v-if="showDialog" class="edit-dialog-mask">
                <div class="edit-dialog">
                    <h3>
                        {{
                            editData.field === 'username'
                                ? '编辑用户名'
                                : editData.field === 'organization'
                                ? '编辑所属组织'
                                : '编辑邮箱'
                        }}
                    </h3>
                    <input
                        v-model="tempValue"
                        class="edit-input"
                        :type="editData.field === 'email' ? 'email' : 'text'"
                    />
                    <div class="dialog-buttons">
                        <button class="cancel-btn" @click="showDialog = false">取消</button>
                        <button class="confirm-btn" @click="saveEdit">保存</button>
                    </div>
                </div>
            </div>

            <!-- 文件上传窗口 -->
            <div v-if="fileLoading" class="edit-dialog-mask">
                <div class="edit-dialog">
                    <h3>编辑头像</h3>
                    <input type="file" class="file-input" @change="handleFileChange" />
                    <div class="dialog-buttons">
                        <button class="cancel-btn" @click="closeFileUpload">取消</button>
                        <button class="confirm-btn" @click="closeFileUpload">完成</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.main-container {
    display: flex;
    min-height: 100vh;
}

.settings-container {
    flex: 1;
    padding: 32px;
    background-color: #f5f6f7;
}

h2 {
    color: #1a1a1a;
    margin-bottom: 32px;
    font-size: 24px;
}

.setting-icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
}

.setting-item {
    display: flex;
    align-items: center;
    background: white;
    padding: 20px;
    margin-bottom: 12px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.label {
    width: 120px;
    color: #666;
    font-weight: 500;
}

.value {
    flex: 1;
    color: #333;
    margin: 0 20px;
}

.edit-btn {
    background: #f0f2f5;
    color: #1677ff;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
}

.edit-btn:hover {
    background: #1677ff;
    color: white;
}

.permission-section {
    margin-top: 40px;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.permission-section h3 {
    color: #1a1a1a;
    margin-bottom: 16px;
}

.permission-btn {
    background: #1677ff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    transition: opacity 0.2s;
}

.permission-btn:hover {
    opacity: 0.85;
}

.setting-save {
    position: relative;
    left: 42%;
    margin-top: 20px;
}

.save-btn {
    width: 220px;
    background: #1677ff;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
}

/* 编辑弹窗样式 */
.edit-dialog-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.edit-dialog {
    background: white;
    padding: 24px;
    border-radius: 8px;
    width: 400px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.edit-dialog h3 {
    margin-bottom: 20px;
    color: #1a1a1a;
}

.edit-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 24px;
    font-size: 14px;
}

.dialog-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.cancel-btn,
.confirm-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
}

.cancel-btn {
    background: #f0f2f5;
    color: #666;
}

.cancel-btn:hover {
    background: #e5e7eb;
}

.confirm-btn {
    background: #1677ff;
    color: white;
}

.confirm-btn:hover {
    opacity: 0.85;
}

/* 文件上传样式 */
.file-input {
    display: block;
    margin: 10px 0;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 100%;
    box-sizing: border-box;
}
</style>