<template>
	<div class="table-box refundManage">
		<ProTable
			:spanMethod="data => emptyRowSpanMethod(data, columns.length)"
			ref="proTable"
			title="列表"
			:columns="columns"
			:requestApi="getTableList"
			:dataCallback="dataCallback"
		>
			<template #operation="scope">
				<el-button type="primary" link @click="checkOrderDetail(scope)">查看详情</el-button>
			</template>
		</ProTable>
	</div>
</template>
<script setup lang="tsx">
import ProTable from "@/components/ProTable/index.vue";
import { getOrderRefundList } from "@/api/order";
import { ColumnProps } from "@/components/ProTable/interface";
import { refundStatus } from "@/utils/serviceDict";
import type { TableColumnCtx } from "element-plus";
import { VNode } from "vue";
import { emptyRowSpanMethod, emptyRowDataFormat, emptyRowDataRender } from "@/utils/table";

const router = useRouter();
// const proTable = ref();
const columns: ColumnProps<any>[] = [
	{
		prop: "productName",
		label: "商品名称",
		search: { el: "input", order: 0 },
		render: ({ $index, row }: any): VNode | string => {
			return emptyRowDataRender(
				<div class="orderInfo" style={{ width: "100%", textAlign: "left" }}>
					<span class="orderInfo-item">订单号: {row.orderSn}</span>
					<span class="orderInfo-item">下单时间：{row.createTime}</span>
					<span class="orderInfo-item">订单完成时间：{row.refundTime || "-"}</span>
				</div>,
				row.productName,
				$index
			);
		}
	},

	{
		prop: "refundStatus",
		label: "售后状态",
		enum: refundStatus
	},
	{
		prop: "paidAmount",
		label: "实收金额"
	},
	{
		prop: "refundAmount",
		label: "退款金额"
	},
	{
		prop: "adminName",
		label: "商家名称",
		search: { el: "input", order: 1 }
	},
	{
		prop: "userName",
		search: { label: "下单用户", el: "input", order: 3 },
		label: "客户名称"
	},
	{
		prop: "userMobile",
		search: { el: "input", order: 4 },
		label: "联系方式",
		isShow: false
	},
	{
		prop: "timeRange",
		label: "创建时间",
		search: {
			el: "date-picker",
			order: 2,
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
const dataCallback = (data: any) => {
	data.records = emptyRowDataFormat(data.records);
	return data;
};
const getTableList = (params: any) => {
	let newParams = JSON.parse(JSON.stringify(params));
	if (newParams.timeRange && newParams.timeRange.length > 0) {
		const [startTime, endTime] = newParams.timeRange;
		newParams.startTime = startTime;
		newParams.endTime = endTime;
		delete newParams.timeRange;
	}
	return getOrderRefundList(newParams);
};
function checkOrderDetail(scope: any) {
	router.push({ path: "/refund/detail", query: { orderSn: scope.row.orderSn } });
}
</script>
<style scoped lang="scss">
.refundManage {
	::v-deep(.el-table__cell) {
		.orderInfo {
			.orderInfo-item {
				display: inline-block;
				margin-right: 16px;
				color: #999999;
			}
		}
	}
}
</style>
