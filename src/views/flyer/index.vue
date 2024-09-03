<template>
	<div class="table-box">
		<ProTable ref="proTable" :columns="columns" :requestApi="getTableList">
			<template #tableHeader>
				<el-button type="primary" @click="handleAdd">新建</el-button>
			</template>
			<template #operation="scope">
				<el-button link type="primary" @click="handleEdit(scope.row)">修改</el-button>
				<el-button type="primary" link @click="handleDelete(scope.row)">删除</el-button>
			</template>
		</ProTable>
	</div>
</template>

<script lang="tsx" name="flyer" setup>
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
import { infoPageList, infoDel } from "@/api/flyer/index";
import { useHandleData } from "@/hooks/useHandleData";

const router = useRouter();
// ProTable 实例
const proTable = ref<ProTableInstance>();

// 表格配置项
const columns: ColumnProps<any>[] = [
	{
		prop: "flyerName",
		label: "名称",
		search: { el: "input" }
	},
	{
		prop: "businessName",
		label: "商家名称",
		search: { el: "input" }
	},
	{
		prop: "creator",
		label: "创建人"
	},
	{
		prop: "createTime",
		label: "创建时间"
	},
	{
		prop: "updateTime",
		label: "修改时间"
	},
	{ prop: "operation", label: "操作", fixed: "right", width: 180 }
];

// 获取表格数据列表
const getTableList = (params: any) => {
	return infoPageList(params);
};

const RENOVATION_EDIT_PATH = "/flyer/edit";

// 跳转到编辑页面
const navigateToRenovationEdit = (id?: string): void => {
	router.push({ path: id ? `${RENOVATION_EDIT_PATH}/${id}` : RENOVATION_EDIT_PATH });
};

// 添加
const handleAdd = (): void => {
	navigateToRenovationEdit();
};

// 编辑
const handleEdit = (row: any): void => {
	navigateToRenovationEdit(row.id);
};

// 删除
const handleDelete = async (row: any) => {
	await useHandleData(infoDel, { id: row.id }, `删除`);
	proTable.value?.getTableList();
};
</script>

<style lang="scss" scoped></style>
