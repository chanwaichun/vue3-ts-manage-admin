<template>
	<el-table ref="tableRef" v-bind="$attrs" :data="currentData" :border="border" :row-key="rowKey">
		<template v-for="item in currentColumns" :key="item">
			{{ item.prop }}
			<!-- selection || index -->
			<el-table-column
				v-bind="item"
				:align="item.align ?? 'center'"
				:reserve-selection="item.type == 'selection'"
				v-if="item.type == 'selection' || item.type == 'index'"
			>
			</el-table-column>
			<!-- expand 支持 tsx 语法 && 作用域插槽 (tsx > slot) -->
			<el-table-column v-bind="item" :align="item.align ?? 'center'" v-if="item.type == 'expand'" v-slot="scope">
				<component :is="item.render" :row="scope.row" v-if="item.render"> </component>
				<slot :name="item.type" :row="scope.row" :index="scope.$index" v-else></slot>
			</el-table-column>
			<!-- other 循环递归 -->
			<TableColumn v-if="!item.type && item.prop && item.isShow" :column="item">
				<template v-for="slot in Object.keys($slots)" #[slot]="scope">
					<slot :name="slot" :row="scope.row" :index="scope.$index"></slot>
				</template>
			</TableColumn>
		</template>
		<!-- 插入表格最后一行之后的插槽 -->
		<template #append>
			<slot name="append"> </slot>
		</template>
		<!-- 表格无数据情况 -->
		<template #empty>
			<div class="table-empty">
				<slot name="empty">
					<img src="@/assets/images/notData.png" alt="notData" />
					<div>暂无数据</div>
				</slot>
			</div>
		</template>
	</el-table>
</template>
<script setup lang="ts" name="NormalTable">
import { defineProps, provide } from "vue";
import TableColumn from "@/components/ProTable/components/TableColumn.vue";
import { ref, onMounted } from "vue";
const props = defineProps({
	columns: {
		type: Array,
		default: () => []
	},
	data: {
		type: Array,
		default: () => []
	},
	rowKey: {
		type: String,
		default: "id"
	},
	border: {
		type: Boolean,
		default: true
	}
});
watch(
	() => props.data,
	val => {
		currentData.value = val;
	}
);
// onMounted(() => {
// 	console.log(props);
// });
const setEnumMap = async (col: ColumnProps) => {
	if (!col.enum) return;
	// 如果当前 enum 为后台数据需要请求数据，则调用该请求接口，并存储到 enumMap
	if (typeof col.enum !== "function") return enumMap.value.set(col.prop!, col.enum!);
	const { data } = await col.enum();
	enumMap.value.set(col.prop!, data);
};
const flatColumnsFunc = (columns: ColumnProps[], flatArr: ColumnProps[] = []) => {
	columns.forEach(async col => {
		if (col._children?.length) flatArr.push(...flatColumnsFunc(col._children));
		flatArr.push(col);

		// 给每一项 column 添加 isShow && isFilterEnum 默认属性
		col.isShow = col.isShow ?? true;
		col.isFilterEnum = col.isFilterEnum ?? true;

		// 设置 enumMap
		setEnumMap(col);
	});
	return flatArr.filter(item => !item._children?.length);
};
const currentData = ref(props.data);
const currentColumns = ref(props.columns);
const flatColumns = ref<ColumnProps[]>();
const enumMap = ref(new Map<string, { [key: string]: any }[]>());
flatColumns.value = flatColumnsFunc(currentColumns.value);
provide("enumMap", enumMap);
</script>
