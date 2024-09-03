<template>
	<el-form ref="formEl" :model="formData" :rules="formRules" label-width="150">
		<div style="width: 60%">
			<el-form-item label="选择老师" prop="adminId">
				<el-select-v2
					ref="adminIdSelectEl"
					v-model="formData.adminId"
					remote
					filterable
					:remoteMethod="adminCardListSearch"
					:options="adminCardList"
					:loading="adminCardLoading"
					@focus="() => adminCardListSearch('')"
					clearable
					placeholder="请选择"
					style="width: 100%"
					@change="handleChange"
				>
				</el-select-v2>
			</el-form-item>
			<el-form-item label="个人照片" prop="adminPhoto" required>
				<UploadImgs cropper v-model:file-list="formData.adminPhoto" :api="uploadProductImg" :limit="1" list-type="picture-card">
					<el-icon>
						<Plus />
					</el-icon>
				</UploadImgs>
			</el-form-item>
			<el-form-item label="省市区" prop="area">
				<el-cascader v-model="formData.area" :props="{ value: 'd', label: 'h', children: 'c' }" :options="regionList" />
			</el-form-item>
			<el-form-item label="标签" prop="tagList">
				<el-select-v2
					v-model="formData.tagList"
					filterable
					:options="cardTagList"
					clearable
					multiple
					placeholder="请选择"
					style="width: 100%"
				>
				</el-select-v2>
			</el-form-item>
			<el-form-item label="录音" prop="voiceDesc">
				<UploadBtn v-model="formData.voiceDesc"></UploadBtn>
				<!--				<el-input v-model="formData.audio" placeholder="请输入内容" />-->
			</el-form-item>
			<el-form-item label="个人介绍" prop="adminDesc" required>
				<el-input
					rows="6"
					v-model="formData.adminDesc"
					placeholder="请输入内容"
					type="textarea"
					maxlength="300"
					show-word-limit
				/>
			</el-form-item>
		</div>
		<el-form-item label="联系方式" prop="contactList">
			<EditContract v-model="formData.contactList"></EditContract>
		</el-form-item>

		<el-form-item label="相关证明" prop="paperList">
			<EditProve v-model="formData.paperList"></EditProve>
		</el-form-item>
		<el-form-item label="导师介绍" prop="textDesc">
			<UeditorWrap ref="ueditorWrapEl" v-model="formData.textDesc"></UeditorWrap>
		</el-form-item>
	</el-form>
</template>
<script setup lang="ts" name="Info">
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { GlobalStore } from "@/stores";
import { formatSelectData, setFormOutputImage, setImageUrl } from "@/utils/format";
import useSelectData from "@/hooks/useSelectData";
import useInfoForm from "@/views/business/renovationEdit/hook/useInfoForm";
import EditContract from "../components/EditContract.vue";
import UeditorWrap from "@/components/UeditorWrap/index.vue";
import UploadBtn from "@/components/Upload/btn.vue";
import EditProve from "../components/EditProve.vue";
import UploadImgs from "@/components/Upload/Imgs.vue";
import { getCardTagList, getCardTeacherList, addOrUpdateCardBase } from "@/api/card/index";
import { uploadProductImg } from "@/api/upload";
import regionJSON from "@/json/region.json";

import { checkPhoneNumber } from "@/utils/eleValidate";

const route = useRoute();
const router = useRouter();
const globalStore = GlobalStore();
const adminIdSelectEl = ref();
const ueditorWrapEl = ref();
// 表单示例
const formEl = ref<FormInstance>();
const {
	data: adminCardList,
	loading: adminCardLoading,
	remoteMethod: adminCardListSearch
} = useSelectData(
	getCardTeacherList,
	{ value: "adminId", label: "trueName", searchKey: "adminName" },
	{ pageSize: 20, pageNum: 1 }
);
// 标签列表
const { data: cardTagList } = useSelectData(
	getCardTagList,
	{ value: "id", label: "tagName", searchKey: "tagName" },
	{ pageSize: 999, pageNum: 1 }
);
// 地区列表
const regionList = regionJSON.data;
// 表单规则
const { formData, formRules } = useInfoForm();
watch(
	() => formData.value.contactList,
	val => {
		console.log(val);
		nextTick(() => {
			formEl.value?.validateField("contactList");
		});
	},
	{ deep: true }
);
// 处理输出的参数
function handleOutput(query: any): any {
	let params = JSON.parse(JSON.stringify(query));
	// 省市区处理
	if (params.area.length > 0) {
		const [province, city, area] = params.area;
		params = { ...params, province, city, area };
	} else {
		params = { ...params, province: "", city: "", area: "" };
	}
	// 图片处理
	if (params.adminPhoto.length > 0) {
		params = { ...params, adminPhoto: setFormOutputImage(params.adminPhoto) };
	}
	// 审核处理
	// if (params.paperList.length > 0) {
	// 	params.paperList = params.paperList.map((item: any) => {
	// 		return {
	// 			...item,
	// 			imgUrl: setFormOutputImage(item.imgUrl)
	// 		};
	// 	});
	// }
	// 标签处理
	if (params.tagList.length > 0) {
		console.log(params.tagList, cardTagList.value);
		params.tagList = params.tagList.map((currentItem: any) => {
			const findItem: any = cardTagList.value.find((tagItem: any) => currentItem === tagItem.value);

			const { value, label } = findItem;
			return { tagName: label, tagId: value };
		});
	}
	return params;
}
async function validateForm() {
	if (ueditorWrapEl.value.getLoadingStatus()) {
		ElMessage.warning("导师介绍的图片未上传完，请待上传完再提交");
		return;
	}
	if (!formEl.value) return;

	try {
		await formEl.value.validate();
	} catch (e) {
		ElMessage.error("请完善必填项");
		throw e;
	}
}
// 提交表单
async function submit() {
	try {
		const params = handleOutput(formData.value);
		const res = await addOrUpdateCardBase(params);
		return res.data;
	} catch (e) {
		console.log(e);
	}
}
function handleChange(val: any) {
	if (!val) {
		formData.value.phone = "";
		formData.value.trueName = "";
		return;
	}

	const { filteredOptions } = adminIdSelectEl.value;
	if (filteredOptions.length > 0) {
		const { mobile, trueName } = filteredOptions.find((item: any) => item.value === val);
		formData.value.phone = mobile;
		formData.value.trueName = trueName;
	}
}
defineExpose({
	formEl,
	formData,
	submit,
	validateForm
});
</script>

<style scoped lang="scss"></style>
