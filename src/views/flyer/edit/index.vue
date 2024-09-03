<template>
	<FormContainer ref="formContainerEl" @submit="submit">
		<el-form ref="formEl" :model="formData" :rules="formRules" label-width="150">
			<el-form-item label="名称" prop="flyerName" required>
				<el-input v-model="formData.flyerName" maxlength="30" placeholder="请输入" />
			</el-form-item>
			<el-form-item label="商家名称" prop="businessId" required>
				<el-select-v2
					v-model="formData.businessId"
					:disabled="businessSelectDisabledStatus"
					:options="businessList"
					clearable
					placeholder="请选择"
				/>
			</el-form-item>
			<el-form-item label="分享文案" prop="shareTitle">
				<el-input v-model="formData.shareTitle" maxlength="30" placeholder="请输入" />
			</el-form-item>
			<el-form-item label="分享图片" prop="shareImg">
				<UploadImgs
					v-model:file-list="formData.shareImg"
					:api="uploadProductImg"
					:cropperOptions="{
						fixedNumber: [5, 4],
						// 固定尺寸默认为true
						fixed: true
					}"
					:limit="1"
					cropper
					list-type="picture-card"
				>
					<el-icon>
						<Plus />
					</el-icon>
				</UploadImgs>
			</el-form-item>
			<el-form-item label="跳转按钮" prop="jumpButtonStatus">
				<el-switch v-model="formData.jumpButtonStatus" />
			</el-form-item>
			<el-form-item v-show="formData.jumpButtonStatus" label="按钮名称" prop="buttonName">
				<el-input v-model="formData.buttonName" placeholder="请输入" />
			</el-form-item>
			<el-form-item v-show="formData.jumpButtonStatus" label="按钮链接" prop="buttonJumpUrl">
				<el-input v-model="formData.buttonJumpUrl" placeholder="请输入" />
			</el-form-item>
			<el-form-item label="页面内容" prop="pageContent" required>
				<UeditorWrap ref="ueditorWrapEl" v-model="formData.pageContent" />
			</el-form-item>
		</el-form>
	</FormContainer>
</template>

<script lang="tsx" name="flyerEdit" setup>
import { ElMessage } from "element-plus";
import FormContainer from "@/components/FormContainer/index.vue";
import UploadImgs from "@/components/Upload/Imgs.vue";
import UeditorWrap from "@/components/UeditorWrap/index.vue";
import { uploadProductImg } from "@/api/upload";
import { getBusinessList as getBusinessListApi } from "@/api/business/index";
import { infoGetDetail, infoAddOrUpdate } from "@/api/flyer/index";
import type { FormInstance, FormRules } from "element-plus";
import useSelectData from "@/hooks/useSelectData";
import { setFormInputImage, setFormOutputImage } from "@/utils/format";
import { GlobalStore } from "@/stores";
import { ADMIN3 } from "@/routers/modules/staticRouter";

const route = useRoute();
const router = useRouter();
const { userInfo } = GlobalStore();

const checkButtonForm = (rule: any, value: any, callback: any) => {
	if (!formData.value.jumpButtonStatus) {
		return callback();
	}

	if (!value) {
		return callback(new Error("请输入"));
	}

	callback();
};

// 表单元素
const formContainerEl = ref();
const formEl = ref<FormInstance>();
const ueditorWrapEl = ref();
// 表单验证规则
const formRules = reactive<FormRules>({
	flyerName: [{ required: true, message: "请输入名称", trigger: "blur" }],
	businessId: [{ required: true, message: "请选择商家名称", trigger: "change" }],
	buttonName: [{ required: true, validator: checkButtonForm, trigger: "blur" }],
	buttonJumpUrl: [{ required: true, validator: checkButtonForm, trigger: "blur" }]
});

// 表单数据
const formData = ref({
	flyerName: "",
	businessId: "",
	businessName: "",
	shareTitle: "",
	jumpButtonStatus: false,
	buttonName: "",
	buttonJumpUrl: "",
	shareImg: [],
	pageContent: ""
});

// 获取商家列表
const { data: businessList } = useSelectData(
	getBusinessListApi, // 获取商家列表的 API
	{ value: "id", label: "shortName" }, // 设置 value 和 label 的字段名
	{
		pageNum: 1,
		pageSize: 100
	}
);

// 根据用户信息判断是否禁用商家名称选择框
const businessSelectDisabledStatus = computed(() => {
	const isBusinessAccount = userInfo?.roleId === ADMIN3;

	// 若商家账户填写，默认使用商家账户，且无法修改
	if (isBusinessAccount) {
		formData.value.businessId = userInfo.businessId;
		formData.value.businessName = userInfo.businessName;
	}

	return isBusinessAccount; // 若角色为 ADMIN3，则禁用商家名称选择框
});

const detailId = route.params?.id;

// 获取详情
const getDetail = async () => {
	if (!detailId) {
		return;
	}

	const res: any = await infoGetDetail({ id: detailId });
	const { data } = res;
	formData.value = { ...data, shareImg: setFormInputImage(data.shareImg) };
};

getDetail();

const submit = async () => {
	if (ueditorWrapEl.value.getLoadingStatus()) {
		ElMessage.warning("页面内容图片未上传完，请待图片上传完再提交");
		return;
	}
	if (!formEl.value) {
		return;
	}

	const res = await formEl.value.validate();

	if (!res) {
		return;
	}

	try {
		const { shareImg, businessId } = formData.value;
		const params = {
			...formData.value,
			shareImg: setFormOutputImage(shareImg),
			businessName: (businessList.value.find((item: any) => item.id === businessId) as any)?.shortName || ""
		};
		await infoAddOrUpdate(params);
		ElMessage.success(detailId ? "更新成功" : "创建成功");
		formContainerEl.value.cancel();
		router.push("/flyer");
	} catch (e) {
		ElMessage.error("更新失败");
	}
};
</script>

<style lang="scss" scoped></style>
