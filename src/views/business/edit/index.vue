<template>
	<FormContainer ref="formContainerEl" @submit="submit">
		<el-form ref="formEl" :model="formData" :rules="formRules" label-width="150">
			<el-form-item label="商家名称" prop="shortName" required>
				<el-input maxlength="10" v-model="formData.shortName" placeholder="请输入内容" />
			</el-form-item>
			<el-form-item label="商家全称" prop="fullName">
				<el-input v-model="formData.fullName" placeholder="请输入内容" />
			</el-form-item>
			<el-form-item label="联系方式" prop="telephone" required>
				<el-input v-model="formData.telephone" placeholder="请输入内容" />
			</el-form-item>
			<el-form-item label="商家性质" prop="businessType" required>
				<el-select-v2 clearable v-model="formData.businessType" :options="businessType" placeholder="请选择" style="width: 100%">
				</el-select-v2>
			</el-form-item>
			<el-form-item label="套餐" prop="businessType" required>
				<el-select-v2 clearable v-model="formData.suitType" :options="suitType" placeholder="请选择" style="width: 100%">
				</el-select-v2>
			</el-form-item>
			<el-form-item label="开始时间-到期时间" prop="timeRange" required>
				<el-date-picker
					v-model="formData.timeRange"
					:teleported="false"
					type="daterange"
					valueFormat="YYYY-MM-DD"
				></el-date-picker>
			</el-form-item>
			<el-form-item label="Secret" prop="secretSn">
				<el-input v-model="formData.secretSn" placeholder="请输入内容" />
			</el-form-item>
			<el-form-item label="企业ID" prop="corpId">
				<el-input v-model="formData.corpId" placeholder="请输入内容" />
			</el-form-item>
		</el-form>
	</FormContainer>
</template>

<script lang="tsx" name="businesssEdit" setup>
import { addOrUpdateBusiness } from "@/api/business/index";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import FormContainer from "@/components/FormContainer/index.vue";
import { GlobalStore } from "@/stores";
import { formatSelectData, setImageUrl } from "@/utils/format";
import { checkImage, checkPhoneNumber } from "@/utils/eleValidate";
import { businessType, suitType } from "@/utils/serviceDict";
import UploadImgs from "@/components/Upload/Imgs.vue";

const route = useRoute();
const router = useRouter();
const globalStore = GlobalStore();
const formContainerEl = ref();
// 表单示例
const formEl = ref<FormInstance>();
// 表单规则
const formRules = reactive<FormRules>({
	shortName: [{ required: true, message: "请输入商品名", trigger: "change" }],
	telephone: [
		{ required: true, message: "请输入价格", trigger: "change" },
		{ validator: checkPhoneNumber, message: "请输入正确的手机号码", trigger: "change" }
	],
	businessType: [{ required: true, message: "请选择商家", trigger: "change" }],
	suitType: [{ required: true, message: "请选择套餐", trigger: "blur" }],
	timeRange: [{ required: true, message: "请选择时间段", trigger: "blur" }],
	// 后来说不要，去掉
	// secretSn: [{ required: true, message: "请输入Secret", trigger: ["blur", "change"] }],
	// corpId: [{ required: true, message: "请输入企业ID", trigger: ["blur", "change"] }]
});
const formData: any = ref({
	fullName: "",
	shortName: "",
	telephone: "",
	businessType: null,
	suitType: null,
	timeRange: [],
	secretSn: "",
	corpId: ""
});

if (route.query?.id) {
	const { id, fullName, shortName, telephone, businessType, suitType, startDate, endDate, secretSn, corpId } = route.query;
	const timeRange = [startDate, endDate];
	formData.value = {
		id,
		fullName,
		shortName,
		telephone,
		businessType: Number(businessType),
		suitType: Number(suitType),
		timeRange,
		secretSn,
		corpId
	};
}
async function submit() {
	if (!formEl.value) return;
	const res = await formEl.value.validate();
	if (!res) return;
	try {
		const params = JSON.parse(JSON.stringify(formData.value));
		const [startDate, endDate] = params.timeRange;
		delete params.timeRange;
		const updateRes = await addOrUpdateBusiness({
			...params,
			startDate,
			endDate
		});

		ElMessage.success(route.query?.id ? "更新成功" : "创建成功");
		formContainerEl.value.cancel();
		router.push("/business/manage");
	} catch (e) {
		ElMessage.error("更新失败");
	}
}
</script>
<style lang="scss" scoped>
.productEdit {
	padding: 16px;
	background-color: white;
}
</style>
