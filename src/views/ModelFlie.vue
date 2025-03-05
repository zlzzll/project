<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useRouter } from 'vue-router';
import testdata from '../data/data';
import { TemplateFile } from "../types/types";


export default defineComponent({
    name: "FileManagement",
    setup() {
        const router = useRouter();
        const templateFiles: TemplateFile[] = testdata().templateFiles

        const filters = ref({
            id: "",
            templateName: "",
            author: "",
            category: "",
            modifyDate: "",
        });

        const filteredTemplates = ref<TemplateFile[]>(templateFiles);
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

        const totalPages = computed(() =>
            Math.ceil(filteredTemplates.value.length / pageSize)
        );

        const parseTemplateDate = (datetime: string) => {
            const [datePart] = datetime.split(' ');
            const [day, month, year] = datePart.split('.');
            return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        };

        const applyFilters = () => {
            let result = templateFiles;

            if (filters.value.id) {
                result = result.filter(t => t.id.toString().includes(filters.value.id));
            }

            if (filters.value.templateName) {
                result = result.filter(t => t.name.includes(filters.value.templateName));
            }

            if (filters.value.author) {
                result = result.filter(t => t.createdBy.includes(filters.value.author));
            }

            if (filters.value.category) {
                result = result.filter(t => t.category === filters.value.category);
            }

            if (filters.value.modifyDate) {
                const selectedDate = new Date(filters.value.modifyDate);
                result = result.filter(t => {
                    const templateDate = parseTemplateDate(t.modifyDatetime);
                    return templateDate.toDateString() === selectedDate.toDateString();
                });
            }

            filteredTemplates.value = result;
            currentPage.value = 1;
        };

        const resetFilters = () => {
            filters.value = {
                id: "",
                templateName: "",
                author: "",
                category: "",
                modifyDate: "",
            };
            filteredTemplates.value = templateFiles;
            currentPage.value = 1;
        };
        
        // 跳转到文件管理页面并应用筛选条件
        const goToFileManage = (template: TemplateFile) => {
            router.push({
                path: '/filemanage',
                query: {
                    
                    name: template.name,
                    author: template.createdBy,
                    date: template.modifyDatetime,
                }
            });
        };
        
        // 页面跳转脚本实现
        function changePage(event: any) {
            const value = event.target.innerText;

            // 注意这里innerText是字符串，直接赋值会导致数据类型变化
            currentPage.value = Number(value)
            console.log('Clicked value:', value); // 输出: Clicked value: 1

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

        function gotoPage(){
            if (inpvals.value == '') {
                return
            }
            inpval.value = inpvals.value
            // 先清空输入框
            inpvals.value = ''
           
            // 输入判断
            if (inpval.value <= 0 || inpval.value > totalPages.value ) {
                return
            }
            currentPage.value = inpval.value

            // 在currentPage更新之后，立即要想到更新showPage变量
            if (inpval.value < showPage.value) {
                showPage.value =(Math.trunc(inpval.value / 4)-1)*4+1
            }
            if (inpval.value > showPage.value+3) {
                showPage.value = Math.trunc(inpval.value / 4)*4+1
            }
        }
        return {
            filters,
            paginatedTemplates,
            currentPage,
            showPage,
            inpval,inpvals,
            totalPages,
            gotoPage,
            applyFilters,
            resetFilters,
            changePage,
            prevPage,
            nextPage,
            goToFileManage
        };
    },
});



</script>

<template>
    <div class="file-management">
        <header class="header">
            <h2>模板文件</h2>
            <p>现存模板如下</p>

            <button style="background: #409eff;color: white;position: relative;left: 1250px;">创建模板</button>
            <hr style="width: 1350px;">
        </header>

        <div class="filter-container">
            <div class="filter-group">
                <div class="filter-item">
                    <label>ID:</label>
                    <input type="text" v-model="filters.id" placeholder="输入ID">
                </div>
                <div class="filter-item">
                    <label>模板名称:</label>
                    <input type="text" v-model="filters.templateName" placeholder="输入模板名称">
                </div>
                <div class="filter-item">
                    <label>作者:</label>
                    <input type="text" v-model="filters.author" placeholder="输入作者">
                </div>
                <div class="filter-item">
                    <label>类别:</label>
                    <select v-model="filters.category">
                        <option value="">全部</option>
                        <option value="a类">a类</option>
                        <option value="b类">b类</option>
                    </select>
                </div>
                <div class="filter-item">
                    <label>修改日期:</label>
                    <input type="date" v-model="filters.modifyDate">
                </div>

            </div>
            <div class="filter-actions">
                <button class="btn query" @click="applyFilters">查询</button>
                <button class="btn reset" @click="resetFilters">
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
                        <th>分类</th>
                        <th>修改时间</th>

                    </tr>
                </thead>
                <tbody>
                    <tr v-if="paginatedTemplates.length === 0">
                        <td colspan="5" class="no-data">暂无相关数据</td>
                    </tr>
                    <tr v-else v-for="template in paginatedTemplates" :key="template.id">
                        <td>{{ template.id }}</td>
                        <td>{{ template.name }}</td>
                        <td>{{ template.createdBy }}</td>
                        <td><span class="category-tag">{{ template.category }}</span></td>
                        <td style="width: 100px;">{{ template.modifyDatetime.split(" ")[0] }}
                            <span style="font-size: smaller; color: gray;">{{ template.modifyDatetime.split(" ")[1] }} AM
                            </span>
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
                        <td style="padding: 0%; width: 50px; ">
                            <button>
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
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 底部的那个页面跳转按钮 -->
        <div class="pagination" v-if="totalPages > 0">
            <button  :disabled="currentPage === 1" @click="prevPage" ><</button>
            <button @click="changePage($event)" :class="{ active: showPage === currentPage || inpval == showPage}">{{ showPage }}</button>
            <button @click="changePage($event)" v-if="showPage + 1 <= totalPages"
                :class="{ active: currentPage === showPage + 1 || inpval == showPage+1}">{{ showPage + 1 }}</button>
            <button @click="changePage($event)" v-if="showPage + 2 <= totalPages"
                :class="{ active: currentPage === showPage + 2 || inpval == showPage+2}">{{ showPage + 2 }}</button>
            <button @click="changePage($event)" v-if="showPage + 3 <= totalPages"
                :class="{ active: currentPage === showPage + 3 || inpval == showPage+3}">{{ showPage + 3 }}</button>
            <!-- <span>第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span> -->
            <button  :disabled="currentPage === totalPages" @click="nextPage">></button>
            <div> 
              <input type="text" style="width: 60px; " v-model="inpvals"> <button @click="gotoPage">Go</button>
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

.icon {
    width: 20px;
    height: 20px;
    padding: 0;

}

.file-management {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
}

.header {
    margin-bottom: 24px;
    position: relative;
    right: 100px;
}

.filter-continer {
    /* width: 1500px; */
    background: #f8f9fa;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.filter-group {
    position: relative;
    right: 100px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
    margin-bottom: 6px;
}

.filter-item {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

label {
    font-size: 12px;
    color: #606266;
}

input,
select {
    padding: 8px 10px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    font-size: 14px;
    width: 200px;
}

.filter-actions {
    width: 200px;
    display: flex;
    position: relative;
    left: 1030px;
    bottom: 50px;
    gap: 8px;
    justify-content: flex-end;
}

.btn {
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
}

.btn.query {
    background: #409eff;
    color: white;
    border: none;
}

.btn.reset {
    background: #f4f4f5;
    color: #606266;
    border: 1px solid #d3d4d6;
}

.btn:hover {
    opacity: 0.9;
}

.table-container {
    border: 1px solid #ebeef5;
    border-radius: 8px;
    overflow: hidden;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th {
    background: #f5f7fa;
    color: #909399;
    font-weight: 500;
    padding: 12px;
    text-align: center;
}

td {
    width: 250px;
    padding-bottom: 6px;
    padding-top: 6px;
    padding-left: 30px;
    padding-right: 30px;
    border-top: 1px solid #ebeef5;
    color: #606266;
    text-align: center;
}

.category-tag {
    display: inline-block;
    padding: 4px 8px;
    background: #ecf5ff;
    color: #409eff;
    border-radius: 4px;
    font-size: 12px;
}

.no-data {
    text-align: center;
    padding: 24px;
    color: #909399;
}

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

/* 调整原有按钮间距 */
.btn {
    min-width: 80px;
}

/* 添加goto按钮的悬停效果 */
.goto {
    cursor: pointer;
    transition: transform 0.3s ease;
}

.goto:hover {
    transform: scale(1.2);
}
</style>