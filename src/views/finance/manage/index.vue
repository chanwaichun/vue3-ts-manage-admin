<template>
	<div class="table-box">
		<ProTable ref="proTable" title="用户列表" :columns="columns" :requestApi="getPayList">
			<template #tableHeader>
				<div class="header-main">
					<el-button type="primary" @click="handleExport">导出</el-button>
				</div>
			</template>
		</ProTable>
	</div>
</template>

<script setup lang="tsx" name="financeManage">
import { ref } from "vue";
import { ElMessageBox } from "element-plus";
import { ColumnProps } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
import { getPayList, exportPayList } from "@/api/finance/index";
import { useDownload } from "@/hooks/useDownload";

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref();

// 表格配置项
const columns: ColumnProps<any>[] = [
	{
		prop: "paySn",
		label: "支付订单号",
		search: { el: "input" }
	},
	{
		prop: "orderSn",
		label: "订单号",
		search: { el: "input" }
	},
	{
		prop: "userName",
		search: { el: "input" },
		label: "用户昵称"
	},
	{
		prop: "adminName",
		search: { el: "input" },
		label: "商家名称"
	},
	// 多级 prop
	{ prop: "payment", label: "支付渠道" },
	{ prop: "amount", label: "支付金额" },
	{
		prop: "successTime",
		label: "支付时间",
		search: { el: "date-picker", props: { type: "datetime", valueFormat: "YYYY-MM-DD HH:mm:ss" } }
	}
];
function handleExport(): void {
	// const searchParam: any = proTable.value.searchParam;

	// console.log(searchParam);
	ElMessageBox.confirm("确认导出财务报表?", "温馨提示", { type: "warning" }).then(() =>
		useDownload(exportPayList, "财务报表", { ...proTable.value.searchParam, ...proTable.value.pageable })
	);
}
</script>
<style lang="scss" scoped>
.header-main {
	display: flex;
	justify-content: flex-end;
}
</style>
