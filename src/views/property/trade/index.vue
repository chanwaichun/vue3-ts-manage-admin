<template>
	<div class="table-box">
		<ProTable ref="proTable" title="" :columns="columns" :requestApi="getAdminUserList"> </ProTable>
	</div>
</template>

<script setup lang="ts" name="propertyTrade">
import { getAdminUserList } from "@/api/adminUser/index";
import ProTable from "@/components/ProTable/index.vue";
import { ColumnProps } from "@/components/ProTable/interface";
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
	{ prop: "opetation", label: "操作" }
];
</script>

<style scoped lang="scss"></style>
