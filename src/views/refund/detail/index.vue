<template>
	<div class="table-box orderDetail">
		<Loading v-show="loading"></Loading>
		<template v-if="!loading">
			<div class="orderDetail-title">当前订单状态：{{ filterEnum(detail.refundStatus, refundStatus) }}</div>
			<div class="orderDetail-body">
				<div class="basicInfo body-item">
					基本信息
					<div class="orderTable">
						<NormalTable :columns="columnInfo" :data="[detail]"></NormalTable>
					</div>
				</div>
				<div class="productInfo body-item">
					支付信息
					<div :class="{ empty: detail.recordVoList?.length === 0 }" class="orderTable">
						<NormalTable :columns="columnPay" :data="detail.recordVoList"></NormalTable>
					</div>
				</div>
				<div class="productInfo body-item">
					商品信息
					<div :class="{ empty: detail.itemVoList?.length === 0 }" class="orderTable">
						<NormalTable :columns="columnProduct" :data="detail.itemVoList"></NormalTable>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>

<script lang="tsx" name="refundDetail" setup>
import { ColumnProps } from "@/components/ProTable/interface";
import NormalTable from "@/components/NormalTable/index.vue";
import { getOrderRefundDetail } from "@/api/order";
import Loading from "@/components/Loading/index.vue";
import { setImageUrl } from "@/utils/format";
import { refundStatus, payMethods, refundMethod } from "@/utils/serviceDict";
import { filterEnum } from "@/utils/util";

const route = useRoute();

const loading = ref(false);
const detail: Ref<any> = ref({});
onMounted(async () => {
	console.log(route.query);
	loading.value = true;
	const res: any = await getOrderRefundDetail(route.query);

	detail.value = res.data;
	console.log(detail.value);
	loading.value = false;
});
const columnInfo: ColumnProps<any>[] = [
	{
		label: "订单编号",
		prop: "orderSn"
	},
	{
		label: "下单时间",
		prop: "createTime"
	},
	{
		label: "下单用户",
		prop: "userName"
	},
	{
		label: "手机号",
		prop: "userMobile"
	},
	{
		label: "商家信息",
		prop: "adminName"
	},
	{
		label: "商家联系方式",
		prop: "adminMobile"
	}
];
const columnPay: ColumnProps<any>[] = [
	{
		label: "支付流水号",
		prop: "refundId"
	},
	{
		label: "退款编号",
		prop: "refundSn"
	},
	{
		enum: refundMethod,
		label: "支付方式",
		prop: "refundType"
	},
	{
		label: "支付时间",
		prop: "successTime"
	},
	{
		label: "支付状态",
		prop: "status",
		enum: refundStatus
	},
	{
		label: "退款金额",
		prop: "refundAmount"
	}
];
const columnProduct: ColumnProps<any>[] = [
	{
		prop: "img",
		label: "商品图片",
		showOverflowTooltip: false,
		render: scope => {
			return <el-image style="width: 200px; height: 200px" src={setImageUrl(scope.row.img)} fit="scale-down" />;
		}
	},
	{
		label: "商品名称",
		prop: "productName"
	},
	{
		label: "价格",
		prop: "price"
	},
	{
		label: "数量",
		prop: "quantity"
	},
	{
		label: "小计",
		prop: "totalAmount"
	}
];
</script>
<style lang="scss" scoped>
.orderDetail {
	.orderDetail-title {
		padding: 16px;
	}

	.orderDetail-body {
		flex: 1;
		overflow: auto;
		padding: 16px;

		.body-item {
			margin-bottom: 16px;
		}

		.orderTable {
			display: block;
			margin-top: 16px;

			&.empty {
				display: flex;
				flex-direction: column;
				height: 200px;
			}
		}

		.agreement {
			display: flex;
			flex-direction: column;

			::v-deep(.argreement-image) {
				margin-top: 16px;

				.el-image__wrapper {
					font-size: 30px;
					line-height: 200px;
					text-align: center;
					background-color: #8d9095;
				}
			}
		}
	}

	background-color: white;
}
</style>
