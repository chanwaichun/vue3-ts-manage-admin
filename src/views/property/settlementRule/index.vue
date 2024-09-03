<template>
	<div class="table-box">
		<ProTable ref="proTable" title="结算规则" :columns="columns" :requestApi="getProductList">
			<template #tableHeader="scope">
				<el-button type="primary" @click="handleAdd(scope)">新建规则</el-button>
			</template>
			<template #operation="scope">
				<el-button type="text" @click="handleEdit(scope)">编辑</el-button>
			</template>
		</ProTable>
	</div>
</template>

<script setup lang="tsx">
import ProTable from "@/components/ProTable/index.vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { getProductList } from "@/api/product";
const router = useRouter();
const columns: ColumnProps<any>[] = [
	{
		prop: "nickName",
		label: "规则ID",
		search: { el: "input" }
	},
	{
		prop: "userImg",
		label: "商家名称"
	},
	{
		prop: "mobile",
		search: { el: "input" },
		label: "规则名称"
	},
	{
		prop: "totalAmount",
		label: "创建时间"
	},
	// 多级 prop
	{ prop: "totalOrderNum", label: "修改时间" },
	{ prop: "operation", label: "操作" }
];
function handleAdd() {
	router.push("/property/settlementRule/detail");
}
function handleEdit() {
	router.push("/property/settlementRule/detail/1111");
}
</script>

<style scoped lang="scss"></style>
