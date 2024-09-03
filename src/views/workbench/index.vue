<template>
	<div class="workbench">
		<img v-if="!hasPermission" class="home-bg" src="@/assets/images/home.jpg" />
		<div v-else-if="data">
			<el-row :gutter="20" class="target">
				<el-col :lg="6" :md="12" :sm="12" :xl="6" :xs="24" class="mb20">
					<div class="target-item">
						<div class="title">总收入</div>
						<div class="cotent">￥{{ data.totalIncome }}</div>
					</div>
				</el-col>
				<el-col :lg="6" :md="12" :sm="12" :xl="6" :xs="24" class="mb20">
					<div class="target-item">
						<div class="title">本月收入</div>
						<div class="cotent">￥{{ data.monthIncome }}</div>
					</div>
				</el-col>
				<el-col :lg="6" :md="12" :sm="12" :xl="6" :xs="24" class="mb20">
					<div class="target-item">
						<div class="title">本月客户</div>
						<div class="cotent">{{ data.monthCustomer }}</div>
					</div>
				</el-col>
				<el-col :lg="6" :md="12" :sm="12" :xl="6" :xs="24" class="mb20">
					<div class="target-item">
						<div class="title">本月订单</div>
						<div class="cotent">{{ data.monthOrders }}</div>
					</div>
				</el-col>
			</el-row>
			<el-row :gutter="20" class="target">
				<!-- <el-col class="mb20" :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-card header="运营快捷入口" class="box-card">
						<div class="box-card-body">
							<div></div>
						</div>
					</el-card>
				</el-col> -->
				<el-col :lg="12" :md="24" :sm="24" :xl="12" :xs="24" class="mb20">
					<el-card class="box-card" header="订单列表">
						<div class="box-card-body">
							<template v-for="item in data.orderList" :key="item.id">
								<div class="notice">
									用户：{{ item.userName }} {{ item.createTime }} 下单{{ item.productName }}，请及时查看跟进！
								</div>
							</template>
						</div>
					</el-card>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script lang="ts" name="workbenchIndex" setup>
import { Ref } from "vue";
import { getWorkPanelData } from "@/api/work";
import { GlobalStore } from "@/stores";
import { ADMIN, ADMIN2 } from "@/routers/modules/staticRouter";
const globalStore = GlobalStore();
const hasPermission = computed(() => {
	return [ADMIN, ADMIN2].includes(globalStore.userInfo.roleId);
});

const data: Ref<any> = ref(null);
const routerList: Ref<Array<any>> = ref([
	{
		name: "添加商品"
	},
	{
		name: "查看订单"
	},
	{
		name: "用户管理"
	}
]);
onMounted(async () => {
	const res = await getWorkPanelData({});
	data.value = res.data;
});
</script>

<style lang="scss" scoped>
@import "./index.scss";
.box-card-body {
	overflow: auto;
	height: 200px;
	.notice {
		cursor: pointer;
		padding-bottom: 16px;
		margin-bottom: 16px;
		border-bottom: 1px solid #f1f1f1;
	}
}

.home-bg {
	width: 100%;
}
</style>
