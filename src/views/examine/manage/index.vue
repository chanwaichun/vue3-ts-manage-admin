<template>
	<div class="table-box">
		<ProTable
			ref="proTable"
			title="用户列表"
			:columns="columns"
			:requestApi="getTableList"
			:initParam="initParam"
			:dataCallback="dataCallback"
		>
		</ProTable>
	</div>
</template>

<script setup lang="tsx" name="examineManage">
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { User } from "@/api/interface";
import { ColumnProps } from "@/components/ProTable/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { useDownload } from "@/hooks/useDownload";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import UserDrawer from "@/views/proTable/components/UserDrawer.vue";
import { getUserList, changeUserStatus, getUserStatus, getUserGender } from "@/api/modules/user";
import { url } from "inspector";

const router = useRouter();

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref();

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({
	type: 1
});

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total && pageNum && pageSize 这些字段，那么你可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
	return {
		list: data.list,
		total: data.total,
		pageNum: data.pageNum,
		pageSize: data.pageSize
	};
};

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
	let newParams = JSON.parse(JSON.stringify(params));
	newParams.username && (newParams.username = "custom-" + newParams.username);
	return getUserList(newParams);
};

// 表格配置项
const columns: ColumnProps<User.ResUserList>[] = [
	{
		prop: "username",
		label: "用户昵称",
		search: { el: "input" }
	},
	{
		prop: "username",
		label: "用户头像",

		render: scope => {
			return <img class={"userAvatar"} src={new URL("@/assets/images/login_left.png", import.meta.url).href}></img>;
		}
	},
	{
		prop: "gender",
		search: { el: "input" },
		label: "联系电话"
	},
	{
		prop: "gender",
		label: "消费金额"
	},
	// 多级 prop
	{ prop: "user.detail.age", label: "累计订单" },
	{ prop: "createTime", label: "最近消费时间" },
	{ prop: "createTime", label: "创建时间" }
];
</script>
<style lang="scss" scoped>
:deep(.el-table__row) {
	.userAvatar {
		width: 100px;
		height: 100px;
	}
}
</style>
