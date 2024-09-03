<template>
	<div class="editDialog">
		<div class="editDialog-btn">
			<el-button class="editDialog-btn-el" type="primary" @click="handleClick">新建</el-button>
			<el-dialog v-model="recommendShow" title="推荐理由" width="300px">
				<el-input v-model="recommendText" placeholder="推荐理由" style="margin-bottom: 16px"> </el-input>
				<span class="editDialog-footer">
					<el-button @click="recommendShow = false">取消</el-button>
					<el-button type="primary" @click="hanleRecommendConfirm"> 确认 </el-button>
				</span>
			</el-dialog>
			<el-dialog v-model="show" title="新建" width="60%">
				<div class="selectedTable">
					<el-input
						v-model="searchValue"
						class="input-with-select"
						placeholder="请输入搜索内容"
						style="width: 200px; margin-bottom: 16px"
					>
						<template #append>
							<el-button type="primary" @click="handleSearch">搜索</el-button>
						</template>
					</el-input>
					<ProTable
						ref="selectedTable"
						:columns="selectedColumns"
						:isShowSearch="false"
						:request-auto="false"
						:requestApi="api"
						max-height="350px"
						@selectionChange="selectionChange"
					></ProTable>
				</div>

				<template #footer>
					<span class="editDialog-footer">
						<el-button @click="show = false">取消</el-button>
						<el-button type="primary" @click="hanleConfirm"> 确认 </el-button>
					</span>
				</template>
			</el-dialog>
		</div>
		<div v-show="currentData.length > 0" class="currentTable">
			<ProTable
				ref="currentTable"
				:columns="currentColumns"
				:isShowSearch="false"
				:pagination="false"
				:requestApi="getCurrentList"
			>
			</ProTable>
		</div>
	</div>
</template>
<script lang="jsx" setup>
import ProTable from "@/components/ProTable/index.vue";
import { getProductList } from "@/api/product";

const searchValue = ref("");
const props = defineProps({
	type: {
		type: String,
		default: ""
	},
	searchKey: {
		type: String,
		default: "productName"
	},
	modelValue: {
		type: Array,
		default: () => []
	},
	rowKey: {
		type: String,
		default: "id"
	},
	columns: {
		type: Array,
		default: () => []
	},
	dataCallback: {
		type: Function,
		default: data => {
			return data;
		}
	},
	api: {
		type: Function,
		default: () => {}
	}
});
watch(
	() => props.modelValue,
	val => {
		currentData.value = val;
		currentTable.value.tableData = currentData.value;
		console.log(val, 11111111);
	}
);
const selectedColumns = ref([]);
const currentColumns = ref([]);
const emits = defineEmits(["update:modelValue"]);
//当前已添加的表格
const currentTable = ref();
// 当前的弹窗图表ref
const selectedTable = ref();
// 当前已选择的商品
const currentData = ref(props.modelValue);
const show = ref(false);
let colDataCahce = null;
const recommendShow = ref(false);
const recommendText = ref("");

selectedColumns.value = [{ type: "selection", fixed: "left", width: 40 }, ...props.columns];
currentColumns.value = [
	...props.columns,
	{
		prop: "operation",
		label: "操作",
		render: scope => {
			return (
				<div>
					{props.type === "recommend" ? (
						<el-button onClick={() => handleRecommend(scope)} type="text">
							推荐理由
						</el-button>
					) : (
						""
					)}

					<el-button onClick={() => handleDelete(scope)} type="text">
						删除
					</el-button>
				</div>
			);
		}
	}
];

function handleClick() {
	show.value = true;

	nextTick(() => {
		selectedTable.value.getTableList();
	});
}

function getCurrentList() {
	return new Promise(resolve => {
		resolve({ data: currentData.value });
	});
}

function handleSearch() {
	selectedTable.value.getTableList({ [props.searchKey]: searchValue.value });
}
function handleRecommend(scope) {
	console.log(scope);
	colDataCahce = scope.row;
	recommendText.value = colDataCahce.sellReason;
	recommendShow.value = true;
}
function hanleRecommendConfirm() {
	console.log(colDataCahce);
	colDataCahce.sellReason = recommendText.value;
	recommendText.value = "";
	recommendShow.value = false;
}

function handleDelete(scope) {
	console.log(scope);
	// selectedTable.value.toggleRowSelection(scope.row, false);
	currentData.value.splice(scope.$index, 1);
	console.log(currentData.value);

	currentTable.value.tableData = currentData.value;
	emits("update:modelValue", currentData.value);
}

// 选中后确认
function hanleConfirm() {
	nextTick(() => {
		console.log(selectedTable.value.selectedList);
		// 缓存数据
		currentData.value = props.dataCallback(selectedTable.value.selectedList);
		currentTable.value.tableData = JSON.parse(JSON.stringify(currentData.value));
		emits("update:modelValue", currentData.value);
		show.value = false;
	});
}
</script>
<style lang="scss" scoped>
.editDialog {
	width: 100%;

	.editDialog-btn-el {
		margin-bottom: 16px;
	}
}

.editDialog-footer {
	display: flex;
	justify-content: flex-end;
}

.editDialog {
	::v-deep(.selectedTable .table-main) {
		height: 400px;
	}

	::v-deep(.currentTable) {
		// .table-main {
		// 	height: 300px;
		// }
		.card {
			padding: 0;
			border: none;
			box-shadow: none;
		}
	}
}
</style>
