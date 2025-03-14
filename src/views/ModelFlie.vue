<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted, Ref, watch } from "vue";
import { useRouter } from 'vue-router';
import testdata from '../data/data';
import { TemplateFile } from "../types/types";
import axios from "axios";
import host from "../config/hostname";
import { useUserStore } from "../store";
import formatDate from "../tools/formatDate";
import { ElMessage, ElMessageBox } from 'element-plus';

const userId = ref()
const hostname = host();


export default defineComponent({
    name: "FileManagement",
    setup() {
        const router = useRouter();
        const templateFiles: Ref<TemplateFile[]> = ref(testdata().templateFiles)

        //筛选框内容
        const filters = ref({
            id: "",
            templateName: "",
            author: "",
            category: "",
            modifyDate: "",
        });

        const filteredTemplates = ref<TemplateFile[]>(templateFiles.value);
        const currentPage = ref(1);
        const showPage = ref(1);
        const pageSize = 10;
        const inpval = ref();
        // 多定义一个inpvals的原因是按钮的激活判断inpval == showPage，如果直接给输入框绑定inpval会导致用户没有点击跳转按钮就使得按钮因为输入的数据实时变化而激活，
        // 所以要多定义一个变量用于存输入的内容，在需要变化inpval 的时候再变化
        const inpvals = ref('');

        const paginatedTemplates = computed(() => {
            const start = (currentPage.value - 1) * pageSize;
            return filteredTemplates.value.slice(start, start + pageSize);
        });

        const totalPages = ref(100)


        const updatePage = async (currentPage: number, pageSize: number, id?: number, fuzzyTemplateName?: string, authorName?: string, category?: string, updateTimeStart?: number) => {
            const configData: any = {
                currentPage,
                pageSize
            };

            // 检查每个可选参数是否被传入，如果传入则添加到 configData
            if (id !== undefined) configData.id = id;
            if (fuzzyTemplateName !== undefined) configData.fuzzyTemplateName = fuzzyTemplateName;
            if (authorName !== undefined) configData.authorName = authorName;
            if (category !== undefined) configData.category = category;
            if (updateTimeStart !== undefined) configData.updateTimeStart = updateTimeStart;

            try {
                const res = await axios.post(hostname + "/api/template/page", configData)
                if (res.data.code != 200) {
                    ElMessage.error(res.data.msg)
                    return;
                }
                templateFiles.value = res.data.data
                totalPages.value = res.data.totalPage


            } catch (e) {
                ElMessage.error("网络请求失败")
                console.error(e);
            }
        };


        const applyFilters = () => {
            if (filters.value.id || filters.value.author || filters.value.category || filters.value.modifyDate || filters.value.templateName) {
                console.log(filters.value)
                updatePage(currentPage.value, pageSize, Number(filters.value.id), filters.value.author, filters.value.category, filters.value.modifyDate)
            }


            // filteredTemplates.value = result;
            currentPage.value = 1;
        };

        const goToCreateTemplate = () => {
            router.push('/create-template');
        };
        const resetFilters = () => {
            filters.value = {
                id: "",
                templateName: "",
                author: "",
                category: "",
                modifyDate: "",
            };
            filteredTemplates.value = templateFiles.value;
            currentPage.value = 1;
        };


        //模板操作


        //模板列表刷新的函数


        // 查看模板详情（GET）
        const viewFileDetails = async (id: number) => {
            try {
                const response = await axios.get(`/api/files/${id}`);
                console.log('模板详情:', response.data);

                // 实际开发中这里可以跳转到详情页
                if (response.data.code == 200) {
                    ElMessage.success('模板详情获取成功');
                } else {
                    ElMessage.error(response.data.msg);
                }
            } catch (error) {
                ElMessage.error('获取模板详情失败');
                console.error('Error fetching file details:', error);
            }
            shouldShow.value = null;
        };

        // 删除模板（DELETE）
        const deleteFile = async (id: number) => {
            try {
                await ElMessageBox.confirm('确定要删除该模板吗？', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                });

                const response = await axios.post(hostname + `/api/template/delete`,
                    {
                        id: id
                    }
                );
                if (response.data.code == 200) {
                    ElMessage.success('模板删除成功');
                } else {
                    ElMessage.error(response.data.msg);
                }

                // 刷新模板列表
                // fetchFileList();
            } catch (error) {
                if (error !== 'cancel') {
                    ElMessage.error('模板删除失败');
                    console.error('Error deleting file:', error);
                }
            }
            shouldShow.value = null;
        };

        // 下载模板（POST）
        const downloadFile = async (id: number) => {
            try {
                const response = await axios.get(hostname + `/api/template/download/${id}`, {
                    responseType: 'blob',
                    headers: {
                        'Content-Type': 'application/octet-stream'
                    }
                });

                // 创建临时下载链接
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;

                // 从Content-Disposition获取模板名
                const fileName = response.headers['content-disposition']
                    ?.split('filename=')[1]
                    ?.replace(/"/g, '') || `file_${id}`;

                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                link.remove();

                if (response.data.code == 200) {
                    ElMessage.success('模板下载已开始');
                } else {
                    ElMessage.error(response.data.msg);
                }

            } catch (error) {
                ElMessage.error('模板下载失败');
                console.error('Error downloading file:', error);
            }
            shouldShow.value = null;
        };

        // 重命名模板
        const renameFile = async (id: number) => {
            try {
                const { value: newName } = await ElMessageBox.prompt(
                    '请输入新模板名',
                    '重命名模板',
                    {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        inputPattern: /\S+/, // 非空验证
                        inputErrorMessage: '模板名不能为空'
                    }
                );

                const response = await axios.post(hostname + `/api/template/rename`, {
                    id: id,
                    templateName: newName
                });
                if (response.data.code == 200) {
                    ElMessage.success('重命名成功');
                } else {
                    ElMessage.error(response.data.msg);
                }

                // 刷新模板列表
                // fetchFileList();
            } catch (error) {
                if (error !== 'cancel') {
                    ElMessage.error('重命名失败');
                    console.error('Error renaming file:', error);
                }
            }
            shouldShow.value = null;
        };



        // 跳转到模板管理页面并应用筛选条件的按钮
        const goToFileManage = (template: TemplateFile) => {
            router.push({
                path: '/filemanage',
                query: {
                    name: template.templateName,
                }
            });
        };


        //下拉框展示
        const shouldShow = ref()
        const showMenu = (id: number) => {
            if (shouldShow.value === id) {
                shouldShow.value = null;
            } else {
                shouldShow.value = id;
            }
        }

        // 页面跳转脚本实现
        function changePage(event: any) {
            const value = event.target.innerText;

            // 注意这里innerText是字符串，直接赋值会导致数据类型变化
            currentPage.value = Number(value)

            // console.log('Clicked value:', value); // 输出: Clicked value: 1

        }

        function prevPage() {
            // 先清空
            inpval.value = ''
            if (currentPage.value > 1) {
                currentPage.value--

                if (currentPage.value % 4 == 0) {
                    showPage.value = showPage.value - 4
                }
            }

        }
        function nextPage() {
            // 先清空
            inpval.value = ''
            if (currentPage.value < totalPages.value) {
                currentPage.value++

                if (currentPage.value >= showPage.value + 4) {
                    showPage.value = currentPage.value
                }
            }
        }

        function gotoPage() {
            if (inpvals.value == '') {
                return
            }
            inpval.value = inpvals.value
            // 先清空输入框
            inpvals.value = ''

            // 输入判断
            if (inpval.value <= 0 || inpval.value > totalPages.value) {
                return
            }
            currentPage.value = inpval.value

            // 在currentPage更新之后，立即要想到更新showPage变量
            if (inpval.value < showPage.value) {
                showPage.value = (Math.trunc(inpval.value / 4) - 1) * 4 + 1
            }
            if (inpval.value > showPage.value + 3) {
                showPage.value = Math.trunc(inpval.value / 4) * 4 + 1
            }
        }



        // 监听 currentPage 的变化，随时更新页面数据
        watch(
            () => currentPage.value,
            (newPage, oldPage) => {
                if (oldPage != undefined) {
                    console.log(`页码从 ${oldPage} 变为 ${newPage}`);
                    updatePage(newPage, pageSize);
                }
            },
            { immediate: true } // 立即执行一次，确保初始值也被处理
        );
        // 挂载时候发请求加载初始页面
        onMounted(async () => {
            const userStore = useUserStore();
            userId.value = userStore.$state.currentUser?.id
            console.log(currentPage.value)
            try {
                const res = await axios.post(hostname + "/api/template/page", {
                    currentPage: currentPage.value - 1,
                    pageSize: pageSize
                })
                templateFiles.value = res.data.data
                totalPages.value = res.data.totalPage
            } catch (e) {
                console.error(e)
            }
            console.log("加载了初始的第一页数据")
        });
        onUnmounted(() => {
            console.log("卸载了")
        })



        //暴露数据
        return {
            filters,
            userId,
            paginatedTemplates,
            currentPage,
            showMenu,
            shouldShow,
            showPage,
            goToCreateTemplate,
            inpval, inpvals,
            totalPages,
            gotoPage,
            applyFilters,
            resetFilters,
            changePage,
            prevPage,
            nextPage,
            formatDate,
            goToFileManage,
            viewFileDetails,
            deleteFile,
            downloadFile,
            renameFile
        };
    },
});



</script>

<template>
    <div class="file-management">
        <header class="header">
            <h2 style="margin-top: -10px;">模板模板</h2>
            <p style="margin-top: -5px;margin-bottom: 20px;">现存模板如下</p>

            <button style="background: #409eff;color: white;margin-top: -40px;margin-left: 1110px;position: absolute;border-radius: 4px;"
                @click="goToCreateTemplate">创建模板</button>
            <hr style="width: 1250px;">
        </header>

        <div class="filter-container">
            <div class="filter-group">
                <div class="filter-item" style="margin-left: 40px;">
                    <label></label>
                    <input type="text" v-model="filters.id" placeholder="输入ID">
                </div>
                <div class="filter-item" style="margin-left: 0px;">
                    <label></label>
                    <input type="text" v-model="filters.templateName" placeholder="输入模板名称">
                </div>
                <div class="filter-item" style="margin-left: -40px;">
                    <label></label>
                    <input type="text" v-model="filters.author" placeholder="输入作者">
                </div>
                <div class="filter-item" style="margin-left: -90px;">
                    <label></label>
                    <select v-model="filters.category">
                        <option value="">类别</option>
                        <option value="a类">a类</option>
                        <option value="b类">b类</option>
                    </select>
                </div>
                <div class="filter-item" style="margin-left: -130px;">
                    <label></label>
                    <input type="date" v-model="filters.modifyDate">
                </div>

            </div>
            <div class="filter-actions">
                <button class="btn query" @click="applyFilters" style="width: 10px;height: 40px;">查询</button>
                <button class="btn reset" @click="resetFilters" >
                    <svg t="1740899657675" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="1471" width="200" height="200">
                        <path
                            d="M130 562.5c0-19.33 15.67-35 35-35s35 15.67 35 35C200 735.089 339.911 875 512.5 875S825 735.089 825 562.5 685.089 250 512.5 250c-19.33 0-35-15.67-35-35s15.67-35 35-35C723.749 180 895 351.251 895 562.5S723.749 945 512.5 945 130 773.749 130 562.5z"
                            fill="#2F54EB" p-id="1472"></path>
                        <path
                            d="M482.657 214.747l79.355 79.356c10.74 10.74 10.74 28.151 0 38.89-10.74 10.74-28.151 10.74-38.89 0l-85.573-85.572c-18.045-18.045-18.045-47.302 0-65.348l85.766-85.766c10.74-10.74 28.152-10.74 38.891 0 10.74 10.74 10.74 28.151 0 38.89l-79.55 79.55z"
                            fill="#2F54EB" p-id="1473"></path>
                    </svg>
                    重置</button>
            </div>
        </div>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>模板</th>
                        <th>作者</th>
                        <th ><p style="margin-top: 8px;">分类</p><span class="help-icon"
                                style="position: relative;left: 120px;bottom: 30px; " title="a类为超级模板，用户不能操作该模板；
a类模板提交json，上传该模板的模板有严格的格式校验；">?</span></th>
                        <th>修改时间</th>

                    </tr>
                </thead>
                <tbody>
                    <tr v-if="paginatedTemplates.length === 0">
                        <td colspan="5" class="no-data">暂无相关数据</td>
                    </tr>
                    <tr v-else v-for="template in paginatedTemplates" :key="template.id">
                        <td>{{ template.id }}</td>
                        <td>{{ template.templateName }}</td>
                        <td>{{ template.authorName }}</td>
                        <td><span class="category-tag">{{ template.category }}</span></td>
                        <td>{{ formatDate(template.updateTime).split(" ")[0] }}
                            <div style="font-size: smaller; color: gray;">
                                {{ formatDate(template.updateTime).split(" ")[1] }}
                                {{ formatDate(template.updateTime).split(" ")[2] }}
                            </div>
                        </td>
                        <td style=" width: 50px;height: 50px; ">
                            <button style="align-items: center; " class="goto" @click="goToFileManage(template)">
                                <svg t="1740899969657" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                    xmlns="http://www.w3.org/2000/svg" p-id="4149" width="200" height="200">
                                    <path
                                        d="M584.533333 512l-302.933333 302.933333L341.333333 874.666667l302.933334-302.933334 59.733333-59.733333-59.733333-59.733333L341.333333 145.066667 281.6 209.066667l302.933333 302.933333z"
                                        fill="#1296db" p-id="4150"></path>
                                </svg>
                            </button>
                        </td>
                        <td class="action-cell">
                            <div class="act">
                                <button @click="showMenu(template.id)">
                                    <svg t="1740900353387" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                        xmlns="http://www.w3.org/2000/svg" p-id="12391" width="200" height="200">
                                        <path
                                            d="M319 256.43c-22.57 0-43.59-13.14-54.88-32.69A63.37 63.37 0 0 1 319 128.69h577a63.37 63.37 0 0 1 54.88 95.06c-11.28 19.55-32.31 32.69-54.88 32.69z"
                                            p-id="12392" fill="#8a8a8a"></path>
                                        <path d="M126.5 192.56m-63.5 0a63.5 63.5 0 1 0 127 0 63.5 63.5 0 1 0-127 0Z"
                                            p-id="12393" fill="#8a8a8a"></path>
                                        <path
                                            d="M319 577.43c-22.57 0-43.59-13.14-54.88-32.69A63.37 63.37 0 0 1 319 449.69h577a63.37 63.37 0 0 1 54.88 95.06c-11.28 19.55-32.31 32.69-54.88 32.69z"
                                            p-id="12394" fill="#8a8a8a"></path>
                                        <path d="M126.5 513.56m-63.5 0a63.5 63.5 0 1 0 127 0 63.5 63.5 0 1 0-127 0Z"
                                            p-id="12395" fill="#8a8a8a"></path>
                                        <path
                                            d="M319 896.43c-22.57 0-43.59-13.14-54.88-32.69A63.37 63.37 0 0 1 319 768.69h577a63.37 63.37 0 0 1 54.88 95.06c-11.28 19.55-32.31 32.69-54.88 32.69z"
                                            p-id="12396" fill="#8a8a8a"></path>
                                        <path d="M126.5 832.56m-63.5 0a63.5 63.5 0 1 0 127 0 63.5 63.5 0 1 0-127 0Z"
                                            p-id="12397" fill="#8a8a8a"></path>
                                    </svg>

                                </button>
                                <div class="action-menu" :class="{ show: shouldShow === template.id }">
                                    <div v-if="template.category == `b类` && template.authorId == userId"
                                        class="action-item" style="background-color:orangered;"
                                        @click="deleteFile(template.id)">
                                        <i class="delete-icon"></i>
                                        <span>删除</span>
                                    </div>
                                    <div class="action-item" style="background-color:#409eff;"
                                        @click="viewFileDetails(template.id)">
                                        <i class="view-icon"></i>
                                        <span>查看</span>
                                    </div>
                                    <div v-if="template.category == `b类` && template.authorId == userId"
                                        class="action-item" style="background-color:greenyellow;"
                                        @click="renameFile(template.id)">
                                        <i class="rename-icon"></i> <!-- 修正图标类名 -->
                                        <span>重命名</span>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 底部的那个页面跳转按钮 -->
        <div class="pagination" v-if="totalPages > 0">
            <button :disabled="currentPage === 1" @click="prevPage">&lt;</button>
                    <button @click="changePage($event)"
                        :class="{ active: showPage === currentPage || inpval == showPage }">{{ showPage }}</button>
                    <button @click="changePage($event)" v-if="showPage + 1 <= totalPages"
                        :class="{ active: currentPage === showPage + 1 || inpval == showPage + 1 }">{{ showPage + 1
                        }}</button>
                    <button @click="changePage($event)" v-if="showPage + 2 <= totalPages"
                        :class="{ active: currentPage === showPage + 2 || inpval == showPage + 2 }">{{ showPage + 2
                        }}</button>
                    <button @click="changePage($event)" v-if="showPage + 3 <= totalPages"
                        :class="{ active: currentPage === showPage + 3 || inpval == showPage + 3 }">{{ showPage + 3
                        }}</button>
                    <!-- <span>第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span> -->
                    <button :disabled="currentPage === totalPages" @click="nextPage">></button>
                    <div>
                        <input type="text" style="width: 65px; " v-model="inpvals" placeholder="第几页" @keyup.enter="gotoPage"> <button
                            @click="gotoPage">Go</button>
                    </div>
        </div>
    </div>
</template>

<style scoped>
/* 添加一个简单的 active 状态样式 */
button.active {
    background-color: #6eb9fb;
    /* 绿色背景 */
    color: white;
    /* 白色文字 */
}

/* 图标基础样式 */
.icon {
    width: 20px;
    height: 20px;
    padding: 0;
}

/* 模板管理区域整体布局 */
.file-management {
    /* background-color: #f4cdcd; */
    padding: 24px;
    margin: 0 auto;
overflow: hidden;
}

/* 页面头部样式 */
.header {
    margin-bottom: 24px;
    position: relative;
    left: 0px;
}

/* 筛选容器基础样式 */
.filter-container {
    box-sizing: border-box;
    width: 1200px;
    /* background: #000; */
}

/* 筛选组布局 */
.filter-group {
    /* background: #000; */
    position: relative;
}

/* 筛选项布局 */
.filter-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

/* 标签样式 */
label {
    font-size: 12px;
    color: #606266;
}

/* 输入框和选择框基础样式 */
input,
select {
    padding: 8px 10px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    font-size: 14px;
    width: 160px;
}

/* 筛选操作按钮区域 */
.filter-actions {
    /* background: #973a3a; */
    width: 190px;
    display: flex;
    position: relative;
    left: 1000px;
    bottom: 50px;
    gap: 8px;
    justify-content: flex-end;
    margin-top: 10px;
}

/* 按钮基础样式 */
.btn {
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    min-width: 80px;
}

/* 查询按钮样式 */
.btn.query {
    background: #409eff;
    color: white;
    border: none;
}

/* 重置按钮样式 */
.btn.reset {
    background: #f4f4f5;
    color: #606266;
    border: 1px solid #d3d4d6;
}

/* 按钮悬停效果 */
.btn:hover {
    opacity: 0.9;
}

/* 表格容器样式 */
.table-container {
    /* background: #e59999; */
    border: 1px solid #ebeef5;
    border-radius: 8px;
    overflow: visible;
    /* 允许菜单溢出 */
    margin-top: -30px;
}

/* 表格基础样式 */
table {
    width: 100%;
    border-collapse: collapse;
}

/* 表头样式 */
th {
    background: #f5f7fa;
    color: #909399;
    font-weight: 500;
    padding: 5px;
    text-align: center;
    height: 50px;
}

/* 表格单元格样式 */
td {
    width: 250px;
    padding-bottom: 6px;
    padding-top: 6px;
    padding-left: 20px;
    padding-right: 20px;
    border-top: 1px solid #ebeef5;
    color: #606266;
    text-align: center;
}

/* 分类标签样式 */
.category-tag {
    display: inline-block;
    padding: 4px 8px;
    background: #ecf5ff;
    color: #409eff;
    border-radius: 4px;
    font-size: 12px;
}

/* 无数据提示样式 */
.no-data {
    text-align: center;
    padding: 24px;
    color: #909399;
}

/* 分页组件样式 */
.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-top: 24px;
}

/* 新增样式 */
.filter-row {
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
}

.filter-group {
    flex-grow: 1;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
}

.filter-actions {
    flex-shrink: 0;
    display: flex;
    gap: 8px;
    margin-left: 12px;
}

/* 添加goto按钮的悬停效果 */
.goto {
    cursor: pointer;
    transition: transform 0.3s ease;
}

.goto:hover {
    transform: scale(1.2);
}

/* 操作按钮和下拉菜单样式 */
.action-cell {
    position: relative;
    width: 80px;
    /* 固定宽度防止错位 */
}

.act {
    position: relative;
    display: flex;
    justify-content: center;
}

.action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    background: #f0f2f5;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
}

.action-btn:hover {
    background: #e0e2e5;
}

/* 下拉菜单基础样式 */
.action-menu {
    position: absolute;
    top: 100%;
    /* 垂直居中 */
    right: 20px;
    /* 根据新位置调整 */
    width: 120px;
    background: transparent;
    border-radius: 4px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    z-index: 10;
    transform-origin: right center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0;
    transform: translateX(20px) scale(0.95);
    pointer-events: none;
    /* 新增 */
}

/* 下拉菜单显示时的动画状态 */
.action-menu.show {
    opacity: 1;
    transform: translateX(0) scale(1);
    pointer-events: auto;
    /* 新增 */
}

/* 操作项基础样式 */
.action-item {
    color: white;
    display: flex;
    align-items: center;
    border-radius: 4px;
    padding: 10px 15px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    gap: 8px;
}

/* 操作项悬停动画 */
.action-item:hover {
    color: #000;
    transform: translateX(6px);
    background: rgba(255, 255, 255, 0.2) !important;
}

/* 操作项间分隔线 */
.action-item:not(:last-child)::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 10px;
    right: 10px;
    height: 1px;
    background: rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;
}

/* 图标动画效果 */
.action-item i {
    transition: transform 0.3s ease;
}

.action-item:hover i {
    transform: scale(1.2);
}

/* 图标具体样式 */
.delete-icon::before {
    content: "×";
    font-weight: bold;
}

.view-icon::before {
    content: "👁️";
}

.rename-icon::before {
    content: "✎";
}

/* 背景色过渡增强 */
.action-item[style*="background-color:orangered"] {
    background-color: orangered !important;
}

.action-item[style*="background-color:#409eff"] {
    background-color: #409eff !important;
}

.action-item[style*="background-color:greenyellow"] {
    background-color: greenyellow !important;
}

/* 优化图标对齐 */
.action-item i {
    display: inline-block;
    width: 18px;
    height: 18px;
    text-align: center;
}
</style>