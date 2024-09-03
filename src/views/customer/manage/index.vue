<template>
	<div class="table-box">
		<ProTable ref="proTable" title="用户列表" :columns="columns" :requestApi="getAdminUserList"> </ProTable>
	</div>
</template>

<script setup lang="tsx" name="customerManage">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { User } from "@/api/interface";
import { ColumnProps } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
import { getAdminUserList } from "@/api/adminUser/index";
import { setImageUrl } from "@/utils/format";

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref();

// 表格配置项
const columns: ColumnProps<any>[] = [
	{
		prop: "nickName",
		label: "用户昵称",
		search: { el: "input" }
	},
	{
		prop: "userImg",
		label: "用户头像",

		showOverflowTooltip: false,
		render: scope => {
			return <img class={"userAvatar"} src={setImageUrl(scope.row.userImg)}></img>;
		}
	},
	{
		prop: "mobile",
		search: { el: "input" },
		label: "联系电话"
	},
	{
		prop: "totalAmount",
		label: "消费金额"
	},
	// 多级 prop
	{ prop: "totalOrderNum", label: "累计订单" },
	{ prop: "updateTime", label: "最近消费时间" },
	{ prop: "userCreateTime", label: "创建时间" }
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
