import { computed, defineComponent, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import TemplateFile from "../types/types";
import testdata from "../data/data";
export default defineComponent({
    name: "FileManagement",
    setup() {
        const route = useRoute();
        const templateFiles: TemplateFile[] = testdata();

        const filters = ref({
            id: "",
            templateName: "",
            author: "",
            category: "",
            modifyDate: "",
        });

        // 检查URL参数，如果有则应用筛选条件
        onMounted(() => {
            const queryId = route.query.id as string;
            const queryName = route.query.name as string;
            const queryAuthor = route.query.author as string;
            const queryCategory = route.query.category as string;
            
            if (queryId) filters.value.id = queryId;
            if (queryName) filters.value.templateName = queryName;
            if (queryAuthor) filters.value.author = queryAuthor;
            if (queryCategory) filters.value.category = queryCategory;
            
            // 如果有任何筛选条件，立即应用
            if (queryId || queryName || queryAuthor || queryCategory) {
                applyFilters();
            }
        });

        const filteredTemplates = ref<TemplateFile[]>(templateFiles);
        const currentPage = ref(1);
        const showPage = ref(1);
        const pageSize = 10;
        const inpval = ref();
        // 多定义一个inpvals的原因是按钮的激活判断inpval == showPage，如果直接给输入框绑定inpval会导致用户没有点击跳转按钮就使得按钮因为输入的数据实时变化而激活，
        // 所以要多定义一个变量用于存输入的内容，在需要变化inpval 的时候再变化
        const inpvals = ref('');
        
        // 控制操作下拉菜单的显示
        const showActionMenu = ref<number | null>(null);

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
        
        // 切换操作菜单的显示状态
        const toggleActionMenu = (id: number) => {
            if (showActionMenu.value === id) {
                showActionMenu.value = null;
            } else {
                showActionMenu.value = id;
            }
        };
        
        // 查看文件详情
        const viewFileDetails = (id: number) => {
            console.log('查看文件详情:', id);
            showActionMenu.value = null;
        };
        
        // 删除文件
        const deleteFile = (id: number) => {
            console.log('删除文件:', id);
            showActionMenu.value = null;
        };
        
        // 下载文件
        const downloadFile = (id: number) => {
            console.log('下载文件:', id);
            showActionMenu.value = null;
        };
        // 重命名文件
        const renameFile = (id: number) => {
            console.log('重命名文件:', id);
            showActionMenu.value = null;
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
            inpval,
            inpvals,
            totalPages,
            showActionMenu,
            toggleActionMenu,
            viewFileDetails,
            deleteFile,
            renameFile,
            downloadFile,
            gotoPage,
            applyFilters,
            resetFilters,
            changePage,
            prevPage,
            nextPage,
        };
    },
});