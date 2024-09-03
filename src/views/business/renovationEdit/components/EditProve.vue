<script lang="ts" name="EditProve" setup>
import NormalTable from "@/components/NormalTable/index.vue";
import { Ref } from "vue";
import { paperType, paperName } from "@/utils/serviceDict";
import UploadImgs from "@/components/Upload/Imgs.vue";
import UploadImg from "@/components/Upload/Img.vue";
import { uploadProductImg } from "@/api/upload";

const emits = defineEmits(["update:modelValue"]);
const props = defineProps({
	modelValue: {
		type: Array,
		default: () => []
	}
});
const editProveColumn = [
	{
		prop: "paperType",
		label: "证明类型",
		slot: "paperType"
	},
	{
		prop: "paperName",
		label: "证明名称",
		slot: "paperName"
	},
	{
		prop: "imgUrl",
		label: "上传图片",
		showOverflowTooltip: false,
		slot: "imgUrl"
	},
	{
		label: "操作",
		prop: "operation"
	}
];
watch(
	() => props.modelValue,
	val => {
		console.log(val, 11111111);
		currentValue.value = val;
		normalTable.value.tableData = val;
	}
);
const currentValue: Ref<Array<any>> = ref(props.modelValue);
const normalTable = ref();
function handleAdd() {
	currentValue.value.push({ paperType: "", imgName: "", imgUrl: "", paperName: "", paperStatus: "" });
	emits("update:modelValue", currentValue.value);
}
function handleDelete(scope: any) {
	console.log(scope);
	currentValue.value.splice(scope.index, 1);
}
</script>

<template>
	<div class="EditProve">
		<el-button type="primary" @click="handleAdd">新建</el-button>
		<NormalTable ref="normalTable" :columns="editProveColumn" :data="currentValue" style="margin-top: 16px">
			<template #paperType="scope">
				<el-select-v2
					v-model="scope.row.paperType"
					:options="paperType"
					clearable
					placeholder="请选择"
					style="width: 100%"
					@change="
						(val: any) => {
							val !== 1 && (scope.row.paperName = '');
						}
					"
				>
				</el-select-v2>
			</template>
			<template #paperName="scope">
				<el-input v-if="scope.row.paperType !== 1" v-model="scope.row.paperName" placeholder="请输入内容" style="width: 100%">
				</el-input>
				<el-select-v2
					v-else
					v-model="scope.row.paperName"
					:options="paperName"
					clearable
					placeholder="请选择"
					style="width: 100%"
					maxlength="20"
				>
				</el-select-v2>
			</template>
			<template #imgUrl="scope">
				<UploadImg
					cropped
					:cropperOptions="{ fixedNumber: [1, 1], fixed: true }"
					v-model:imageUrl="scope.row.imgUrl"
					width="135px"
					height="135px"
					:file-size="1"
				>
					<template #empty>
						<el-icon><Plus /></el-icon>
					</template>
				</UploadImg>
			</template>

			<template #operation="scope">
				<el-button type="text" @click="handleDelete(scope)">删除</el-button>
			</template>
		</NormalTable>
	</div>
</template>

<style lang="scss" scoped>
.EditProve {
	width: 100%;
}
</style>
