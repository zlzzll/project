<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import testdata from '../data/data';

interface TemplateFile {
    id: number;
    name: string;
    createdBy: string;
    category: string;
    modifyDatetime: string;
}

export default defineComponent({
    name: "FileManagement",
    setup() {
        const templateFiles: TemplateFile[] = testdata()

        const filters = ref({
            id: "",
            templateName: "",
            author: "",
            category: "",
            modifyDate: "",
        });

        const filteredTemplates = ref<TemplateFile[]>(templateFiles);
        const currentPage = ref(1);
        const pageSize = 10;

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

        return {
            filters,
            paginatedTemplates,
            currentPage,
            totalPages,
            applyFilters,
            resetFilters,
            prevPage: () => currentPage.value > 1 && currentPage.value--,
            nextPage: () => currentPage.value < totalPages.value && currentPage.value++,
        };
    },
});
</script>

<template>
    <div class="file-management">
        <header class="header">
            <h2>模板文件</h2>
            <p>现存模板如下</p>
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
                <button class="btn reset" @click="resetFilters">重置</button>
            </div>
        </div>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>模板名称</th>
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
                        <td>{{ template.modifyDatetime.split(" ")[0] }}
                            <div style="font-size: smaller; color: gray;">{{ template.modifyDatetime.split(" ")[1]}} AM</div>
                        </td>
                        <button style="color: blue;">></button>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="pagination" v-if="totalPages > 0">
            <button class="btn" :disabled="currentPage === 1" @click="prevPage">上一页</button>
            <span>第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
            <button class="btn" :disabled="currentPage === totalPages" @click="nextPage">下一页</button>
        </div>
    </div>
</template>

<style scoped>
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
    margin-bottom: 12px;
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
    text-align: left;
}

td {
    padding: 12px;
    border-top: 1px solid #ebeef5;
    color: #606266;
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
</style>