<script lang="jsx" setup>
import { businessType, contractMethod, suitType } from "@/utils/serviceDict";
import UploadImgs from "@/components/Upload/Imgs.vue";
import EditDialog from "@/views/business/renovationEdit/components/EditDialog.vue";
import useSelectData from "@/hooks/useSelectData";
import useProductForm from "@/views/business/renovationEdit/hook/useProductForm";
import { uploadProductImg } from "@/api/upload";
import { addOrUpdateCardProduct } from "@/api/card";
import { getProductList } from "@/api/product";

import { setImageUrl } from "@/utils/format";

const { formData, cardId, submit, handleGetCard, updateCardId } = useProductForm();
const formEl = ref();
const dialogColumns = [
	{
		prop: "productSource",
		label: "服务主图",
		showOverflowTooltip: false,
		render: scope => {
			return <el-image class={"userAvatar"} src={setImageUrl(scope.row.img)}></el-image>;
		}
	},
	{
		prop: "productName",
		label: "服务名称"
	},
	{
		prop: "createTime",
		label: "创建时间"
	}
];

defineExpose({
	formEl,
	formData,
	cardId,
	submit,
	handleGetCard,
	updateCardId
});
</script>

<template>
	<el-form ref="formEl" :model="formData" label-width="150">
		<div style="width: 60%">
			<el-form-item label="上传广告位" prop="img">
				<UploadImgs
					cropped
					:cropperOptions="{ fixedNumber: [16, 9], fixed: true }"
					v-model:file-list="formData.posterUrl"
					:api="uploadProductImg"
					:limit="1"
					cropper
					list-type="picture-card"
				>
					<el-icon>
						<Plus />
					</el-icon>
				</UploadImgs>
			</el-form-item>
		</div>
		<el-form-item label="服务列表" prop="label">
			<EditDialog v-model="formData.productIdList" :api="getProductList" :columns="dialogColumns"></EditDialog>
		</el-form-item>
	</el-form>
</template>

<style lang="scss" scoped>
.footer {
	padding: 16px;
}
</style>
