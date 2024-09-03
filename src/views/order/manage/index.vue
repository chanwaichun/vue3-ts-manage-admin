<template>
	<div class="table-box">
		<ProTable
			:spanMethod="data => emptyRowSpanMethod(data, columns.length)"
			ref="proTable"
			title="用户列表"
			:columns="columns"
			:requestApi="getTableList"
			:dataCallback="dataCallback"
		>
			<template #operation="scope">
				<div>
					<el-button type="primary" link @click="checkOrderDetail(scope)">查看订单</el-button>
				</div>
				<!--				<div>-->
				<!--					<el-button type="primary" link @click="handleRefund(scope)">退款</el-button>-->
				<!--				</div>-->
				<div>
					<el-button v-if="[2, 3, 4].includes(scope.row.status)" type="primary" link @click="handleSetOrderDone(scope)"
						>完成订单</el-button
					>
				</div>
			</template>
		</ProTable>
	</div>
</template>

<script setup lang="tsx" name="orderManage">
import { ref, VNode } from "vue";
import { useRouter } from "vue-router";
import { ColumnProps } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
import { getOrderList, setOrderDone } from "@/api/order/index";
import { payStatus } from "@/utils/serviceDict";
import { emptyRowSpanMethod, emptyRowDataFormat, emptyRowDataRender } from "@/utils/table";
import { ElMessageBox, ElMessage } from "element-plus";
import RefundForm from "./components/RefundForm";
const router = useRouter();

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref();
const getTableList = (params: any) => {
	let newParams = JSON.parse(JSON.stringify(params));
	if (newParams.timeRange && newParams.timeRange.length > 0) {
		const [startTime, endTime] = newParams.timeRange;
		newParams.startTime = startTime;
		newParams.endTime = endTime;
		delete newParams.timeRange;
	}
	return getOrderList(newParams);
};
const dataCallback = (data: any) => {
	data.records = emptyRowDataFormat(data.records);
	return data;
};
// 表格配置项
const columns: ColumnProps<any>[] = [
	{
		prop: "orderSn",
		label: "订单编号",
		render: ({ $index, row }: any): VNode | string => {
			return emptyRowDataRender(
				<div class="orderInfo" style={{ width: "100%", textAlign: "left" }}>
					<span class="orderInfo-item">订单号: {row.orderSn}</span>
					<span class="orderInfo-item">下单时间：{row.createTime}</span>
					<span class="orderInfo-item">订单完成时间：{row.paymentTime || "-"}</span>
				</div>,
				row.orderSn,
				$index
			);
		}
	},
	{
		prop: "productName",
		label: "商品名称",
		search: { el: "input", order: 0 }
	},

	{
		prop: "orderAmount",
		label: "订单金额"
	},
	{
		prop: "userName",
		search: { el: "input", order: 3 },
		label: "下单用户"
	},
	{
		prop: "adminName",
		search: { el: "input", label: "商家名称", order: 1 },
		label: "商家"
	},
	{
		prop: "status",
		label: "订单状态",
		enum: payStatus,
		search: { el: "select", order: 2 }
	},
	{ prop: "createTime", label: "下单时间" },
	{
		prop: "userMobile",
		label: "联系方式",
		search: { el: "input", order: 4 },
		isShow: false
	},
	{
		prop: "timeRange",
		label: "创建时间",
		search: {
			el: "date-picker",
			order: 5,
			props: {
				type: "datetimerange",
				valueFormat: "YYYY-MM-DD HH:mm:ss"
			}
		},
		isShow: false
	},
	{
		prop: "operation",
		label: "操作"
	}
];
async function handleSetOrderDone(scope: any) {
	try {
		const {
			row: { orderSn }
		} = scope;

		await ElMessageBox.confirm("确认后按此订单已完成，无法修改。请确认是否无异议？", "订单完成", {
			cancelButtonText: "取消",
			confirmButtonText: "确认"
		});
		const res = await setOrderDone({ orderSn });
		ElMessage.success({
			message: "操作成功"
		});
		proTable.value.getTableList();
	} catch (e) {
		// ElMessage.error({
		// 	message: "操作失败"
		// });
	}
}
async function handleRefund(scope: any) {
	const {
		row: { orderSn }
	} = scope;

	try {
		await ElMessageBox.confirm(RefundForm, "退款", {
			cancelButtonText: "取消",
			confirmButtonText: "确认"
		});
		console.log(form.value);
	} catch (e) {}
}
function checkOrderDetail(scope: any) {
	router.push({ path: "/order/detail", query: { orderSn: scope.row.orderSn } });
}
</script>
<style lang="scss" scoped>
:deep(.el-table__row) {
	.userAvatar {
		width: 100px;
		height: 100px;
	}
}
::v-deep(.el-table__cell) {
	.orderInfo {
		.orderInfo-item {
			display: inline-block;
			margin-right: 16px;
			color: #999999;
		}
	}
}
</style>
