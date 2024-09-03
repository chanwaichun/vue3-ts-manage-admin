<template>
	<div class="table-box">
		<ProTable row-key="id" ref="proTable" title="用户列表" :columns="columns" :requestApi="getTableList" :initParam="initParam">
			<template #tableHeader="scope">
				<div class="header-main">
					<div class="header-main-left">
						<el-button type="primary" @click="handleUpdateProduct(scope, 'add')">新增商品</el-button>
						<!-- 上架中商品：20 件，审核中商品：10 件 -->
					</div>
					<div class="header-main-right">
						<el-button type="primary" @click="batchDelete(scope, true)">批量删除</el-button>
						<el-button type="primary" @click="batchSwitch(scope, true, false)">批量下架</el-button>
						<el-button type="primary" @click="batchSwitch(scope, true, true)">批量上架</el-button>
					</div>
				</div>
			</template>
			<template #operation="scope">
				<el-button type="primary" link @click="handleUpdateProduct(scope, 'edit')">编辑</el-button>
				<el-button type="primary" link @click="batchDelete(scope, false)">删除</el-button>
				<el-button v-if="!scope.row.shelvesStatus" type="primary" link @click="batchSwitch(scope, false, true)">上架</el-button>
				<el-button v-else type="primary" link @click="batchSwitch(scope, false, false)">下架</el-button>
				<el-button type="primary" link v-copy="setCopyText(scope)">复制链接</el-button>
			</template>
		</ProTable>
	</div>
</template>

<script setup lang="tsx" name="productConsultantManage">
import { ColumnProps } from "@/components/ProTable/interface";
import { setImageUrl } from "@/utils/format";
import { productType } from "@/utils/serviceDict";
import ProTable from "@/components/ProTable/index.vue";
import { getProductList, batchDeleteProduct, batchSwitchProduct } from "@/api/product";
import { ElMessage } from "element-plus";
import { GlobalStore } from "@/stores";

const globalStore = GlobalStore();
const router = useRouter();

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref();

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({});
// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
	let newParams = JSON.parse(JSON.stringify(params));
	if (newParams.createTime && newParams.createTime.length > 0) {
		newParams.startTime = newParams.createTime[0];
		newParams.endTime = newParams.createTime[1];
	}
	if (params.consultantName) {
		newParams.storeName = params.consultantName;
		delete newParams.consultantName;
	}
	delete newParams.createTime;
	return getProductList(newParams);
};

// 表格配置项
const columns: ColumnProps<any>[] = [
	{ type: "selection", fixed: "left", width: 40 },
	{
		prop: "productSource",
		label: "商品图片",
		showOverflowTooltip: false,
		render: scope => {
			return <img class={"userAvatar"} src={setImageUrl(scope.row.img)}></img>;
		}
	},
	{
		prop: "productName",
		label: "商品标题",
		search: { el: "input" }
	},
	{
		prop: "productType",
		label: "类型",
		enum: productType
	},
	{
		prop: "price",
		label: "售价"
	},
	{
		prop: "businessName",
		label: "商家",
		search: { el: "input" },
		render: ({ row }) => {
			return row.businessName;
		}
	},
	{
		prop: "shelvesStatus",
		label: "商品状态",
		enum: [
			{ label: "上架", value: true },
			{ label: "下架", value: false }
		],
		search: { el: "select", props: { filterable: true } }
	},
	{
		prop: "createTime",
		label: "创建时间",
		search: { el: "date-picker", props: { type: "datetimerange", valueFormat: "YYYY-MM-DD HH:mm:ss" } }
	},
	{ prop: "operation", label: "操作", fixed: "right", width: 180 }
];
function handleBatchSelect(scope: any, isBatch: boolean) {
	let ids: Array<any> = [];
	if (isBatch) {
		ids = scope.selectedListIds;
	} else {
		ids = [scope.row.id];
	}
	if (ids.length === 0) {
		ElMessage.warning("请选择商品");
		return;
	}
	return ids;
}
// 管理增删改查
function handleUpdateProduct({ row }: any, type: string) {
	if (type === "add") {
		router.push("/product/consultantEdit");
	} else {
		router.push({ path: "/product/consultantEdit/" + row.id, query: { id: row.id } });
	}
}
function setCopyText(scope: any) {
	return `pages/product/detail/index?id=${scope.row.productId}`;
}
// 批量删除
async function batchDelete(scope: any, isBatch: boolean) {
	let ids = handleBatchSelect(scope, isBatch);
	if (ids) {
		const { code, message } = await batchDeleteProduct({ ids: ids.join(",") });
		if (code === 200) {
			ElMessage.success(message);
		}
		// console.log(res);
		proTable.value.getTableList();
		proTable.value.clearSelection();
	}
}
// 管理上下架
async function batchSwitch(scope: any, isBatch: boolean = true, isUp: boolean = true) {
	let ids = handleBatchSelect(scope, isBatch);
	if (ids) {
		const { code, message } = await batchSwitchProduct({ ids: ids.join(","), status: isUp });
		if (code === 200) {
			ElMessage.success(message);
		}
		// console.log(res);
		proTable.value.getTableList();
		proTable.value.clearSelection();
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
:deep(.table-header) {
	.header-main {
		padding-bottom: 16px;
		width: 100%;
		display: flex;
		justify-content: space-between;
		.el-button {
			margin-bottom: 0;
		}
	}
}
</style>
