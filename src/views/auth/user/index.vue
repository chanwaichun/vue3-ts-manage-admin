<template>
	<div class="table-box">
		<ProTable ref="proTable" title="用户列表" :columns="columns" :requestApi="getTableList" :initParam="initParam">
			<template #operation="scope">
				<el-button type="primary" link @click="handleEdit(scope)">编辑</el-button>
				<el-button type="primary" link @click="handleDelete(scope)">删除</el-button>
			</template>
			<template #tableHeader="scope">
				<el-button
					v-if="userInfo.roleId === '1' || userInfo.roleId === '2' || userInfo.roleId === '3'"
					type="primary"
					@click="handleAdd(scope)"
					>创建账号</el-button
				>
			</template>
		</ProTable>
	</div>
</template>

<script setup lang="tsx" name="authUser">
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { User } from "@/api/interface";
import { ColumnProps } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
import { roleId } from "@/utils/serviceDict";
import { getAdminList, deleteAdmin } from "@/api/admin/index";
import { GlobalStore } from "@/stores";
const globalStore = GlobalStore();
const router = useRouter();
const userInfo = globalStore.userInfo;

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref();

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({});

// 表格配置项
const columns: ColumnProps[] = [
	{
		prop: "mobile",
		label: "手机",
		search: { el: "input", label: "联系方式", order: 1 }
	},
	{
		prop: "trueName",
		search: { el: "input", label: "账号名称", order: 0 },
		label: "姓名"
	},
	{
		prop: "shortName",
		label: "商家"
	},
	{
		prop: "roleId",
		enum: roleId,
		label: "角色"
	},
	{
		prop: "createTime",
		label: "创建时间"
	},
	// 多级 prop
	{ prop: "updateTime", label: "修改时间" },
	{ prop: "operation", label: "操作", fixed: "right", width: 150 }
];
const getTableList = (params: any) => {
	let newParams = JSON.parse(JSON.stringify(params));
	if (newParams.trueName) {
		newParams.adminName = newParams.trueName;
		delete newParams.trueName;
	}
	return getAdminList(newParams);
};

async function handleDelete(scope: any) {
	console.log("删除", scope);
	const res = await deleteAdmin({ adminId: scope.row.adminId });
	ElMessage.success("删除成功");
	proTable.value.getTableList();
}
function handleEdit(scope: any) {
	console.log(scope);
	router.push({ path: "/auth/user/edit/" + scope.row.adminId, query: { ...scope.row } });
}
function handleAdd(scope: any) {
	console.log(scope);
	router.push({ path: "/auth/user/edit" });
}
</script>
<style lang="scss" scoped>
:deep(.el-table__row) {
	.userAvatar {
		width: 100px;
		height: 100px;
	}
}
</style>
