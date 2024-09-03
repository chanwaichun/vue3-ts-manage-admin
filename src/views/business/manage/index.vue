<template>
	<div class="table-box">
		<ProTable ref="proTable" :columns="columns" :requestApi="getTableList">
			<template #tableHeader="scope">
				<el-button type="primary" @click="handleUpdateStore(scope, 'add')">新增</el-button>
			</template>
			<template #operation="scope">
				<el-button link type="primary" @click="handleUpdateStore(scope, 'edit')">修改</el-button>
			</template>
		</ProTable>
	</div>
</template>

<script lang="tsx" name="businessManage" setup>
import { User } from "@/api/interface";
import { ColumnProps } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
import { getBusinessList } from "@/api/business/index";
import { setImageUrl } from "@/utils/format";
import { businessType, suitType } from "@/utils/serviceDict";

const router = useRouter();
// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref();

// 表格配置项
const columns: ColumnProps<any>[] = [
	{
		prop: "businessCode",
		label: "商家ID"
	},
	{
		prop: "shortName",
		label: "商家名称",
		search: { el: "input" }
	},
	{
		prop: "telephone",
		label: "联系方式",
		search: { el: "input" }
	},
	{
		enum: businessType,
		prop: "businessType",
		label: "性质"
	},
	{
		enum: suitType,
		prop: "suitType",
		label: "套餐"
	},
	{
		prop: "createTime",
		label: "创建时间",
		search: {
			el: "date-picker",
			props: {
				type: "datetimerange",
				valueFormat: "YYYY-MM-DD HH:mm:ss"
			}
		}
	},
	// 多级 prop
	{ prop: "endDate", label: "到期时间" },
	{ prop: "operation", label: "操作", fixed: "right", width: 180 }
];

function getTableList(params: any) {
	let newParams = JSON.parse(JSON.stringify(params));
	if (newParams.createTime && newParams.createTime.length > 0) {
		const [startTime, endTime] = newParams.createTime;
		newParams.startTime = startTime;
		newParams.endTime = endTime;
		delete newParams.createTime;
	}
	return getBusinessList(newParams);
}

function handleUpdateStore(scope: any, type: string): void {
	console.log(scope.row);
	if (type === "add") {
		router.push({ path: "/business/edit" });
	} else {
		router.push({
			path: "/business/edit",
			query: scope.row
		});
	}
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
