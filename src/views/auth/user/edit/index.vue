<template>
	<FormContainer :submitText="isEdit ? '更新信息' : '保存'" @submit="submit">
		<el-form :model="formData" ref="formEl" :rules="formRules" labelWidth="150">
			<el-form-item label="头像" prop="userImg">
				<UploadImgs v-model:file-list="formData.userImg" :api="uploadProductImg" :limit="1" list-type="picture-card">
					<el-icon>
						<Plus />
					</el-icon>
				</UploadImgs>
			</el-form-item>
			<el-form-item label="姓名" prop="trueName" required>
				<el-input v-model="formData.trueName" placeholder="请输入内容" />
			</el-form-item>
			<el-form-item label="手机" prop="mobile" required>
				<el-input v-model="formData.mobile" placeholder="请输入内容" />
			</el-form-item>
			<el-form-item label="密码" prop="password" required>
				<el-input
					@focus="handleFocus"
					type="password"
					show-password
					autocomplete="new-password"
					v-model="formData.password"
					placeholder="请输入内容"
				/>
			</el-form-item>
			<el-form-item label="角色" prop="roleId" required>
				<el-select-v2 v-model="formData.roleId" :options="roleIdOptions" placeholder="请选择角色"> </el-select-v2>
			</el-form-item>
			<el-form-item label="商家" prop="businessId" :required="!isAdmin">
				<el-select-v2
					v-model="formData.businessId"
					placeholder="请选择商家"
					:options="storeList"
					:disabled="route.query?.adminId"
				>
				</el-select-v2>
			</el-form-item>
		</el-form>
	</FormContainer>
</template>
<script setup lang="tsx" name="authUserEdit">
import FormContainer from "@/components/FormContainer/index.vue";
import { addOrUpdateAdmin, getAllAdminList } from "@/api/admin/index";
import { uploadProductImg } from "@/api/upload/index";
import { checkPhoneNumber } from "@/utils/eleValidate";
import { TabsStore } from "@/stores/modules/tabs";
import { GlobalStore } from "@/stores";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, FormRules } from "element-plus";
import { roleId } from "@/utils/serviceDict";
import { setFormInputImage, setFormOutputImage } from "@/utils/format";
import { ref, reactive } from "vue";
import UploadImgs from "@/components/Upload/Imgs.vue";
import type { ElForm } from "element-plus";
import useSelectData from "@/hooks/useSelectData";
const route = useRoute();
const router = useRouter();
const tabsStore = TabsStore();
const globalStore = GlobalStore();
const isEdit = Boolean(route.query?.adminId);
const formRules = reactive<FormRules>({
	mobile: [
		{ required: true, message: "请输入手机", trigger: "change" },
		{ validator: checkPhoneNumber, trigger: "change" }
	],
	roleId: [{ required: true, message: "请选择角色", trigger: "change" }],
	trueName: [{ required: true, message: "请输入姓名", trigger: "change" }],
	password: [{ required: true, message: "请输入密码", trigger: "change" }]
});
type FormInstance = InstanceType<typeof ElForm>;
const formEl = ref<FormInstance>();
const formData: any = ref({
	trueName: "",
	mobile: "",
	password: "",
	roleId: null,
	userImg: [],
	businessId: null
});
const { data: storeList } = useSelectData(getAllAdminList, { value: "businessId", label: "businessName" });
if (route.query?.adminId) {
	const { trueName, mobile, password = "******", roleId, adminId, userImg, businessId } = route.query;
	console.log(route.query);
	formData.value = { trueName, mobile, password, roleId, adminId, userImg: setFormInputImage(String(userImg)), businessId };
}
// onMounted(() => {
//
// });

async function submit() {
	if (!formEl.value) return;
	try {
		const res = await formEl.value.validate();
		const formDataClone = JSON.parse(JSON.stringify(formData.value));
		const params = { ...formDataClone, userImg: setFormOutputImage(formData.value.userImg) };
		if (params.password === "******") {
			params.password = "";
		}
		const updateRes = await addOrUpdateAdmin(params);
		console.log(updateRes);
		ElMessage.success("创建成功");
		router.push("/auth/user");
		cancel();
	} catch (e) {}
}
const roleIdOptions = computed(() => {
	const { userInfo } = globalStore;
	const roIdSelect = JSON.parse(JSON.stringify(roleId));
	if (userInfo.roleId !== "1" && userInfo.roleId !== "2") {
		return roIdSelect.filter((item: any) => Boolean(item.value !== "1" && item.value !== "2"));
	}
	return roIdSelect;
});
function setOptions() {}
function handleFocus() {
	isEdit && (formData.value.password = "");
}
function cancel() {
	console.log(route);
	tabsStore.removeTabs(route.fullPath);
}
const isAdmin = ref(
	computed(() => {
		return Boolean(formData.value.roleId === "1" || formData.value.roleId === "2" || formData.value.roleId === "3");
	})
);
watch(
	() => isAdmin.value,
	val => {
		if (val) {
			delete formRules.businessId;
		} else {
			formRules.businessId = [{ required: true, message: "请选择商家", trigger: "change" }];
		}
	}
);
</script>
