<template>
	<div class="bindInfoForm">
		<div class="bindInfoForm-title">
			{{ loginWithPwd ? "账号登录" : "提交绑定" }}
		</div>
		<el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
			<el-form-item prop="username">
				<el-input v-model="loginForm.mobile" placeholder="请输入账号">
					<template #prefix>
						<el-icon class="el-input__icon"><user /></el-icon>
					</template>
				</el-input>
			</el-form-item>
			<el-form-item prop="password">
				<el-input type="password" v-model="loginForm.password" placeholder="请输入密码" show-password autocomplete="new-password">
					<template #prefix>
						<el-icon class="el-input__icon"><lock /></el-icon>
					</template>
				</el-input>
			</el-form-item>
		</el-form>
		<div class="bind-btn">
			<el-button :icon="UserFilled" round @click="login(loginFormRef)" size="large" type="primary" :loading="loading">
				{{ loginWithPwd ? "登录" : "绑定" }}
			</el-button>
		</div>
		<div v-if="loginWithPwd" class="bindInfoForm-tips" @click="handleSwitch">切换成扫码登录</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, defineEmits } from "vue";
import { useRouter } from "vue-router";
// import { Login } from "@/api/interface";
import { ElNotification } from "element-plus";
import { GlobalStore } from "@/stores";
import { TabsStore } from "@/stores/modules/tabs";
import { KeepAliveStore } from "@/stores/modules/keepAlive";
import { getTimeState } from "@/utils/util";
import { HOME_URL } from "@/config/config";
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";
import { CircleClose, UserFilled } from "@element-plus/icons-vue";
import { bindAdmin, handleLogin, getAdminInfo } from "@/api/admin/index";
import type { ElForm } from "element-plus";
import md5 from "js-md5";
const props = defineProps({
	loginWithPwd: {
		type: Boolean,
		default: false
	}
});
const emits = defineEmits(["changeLoginMethod"]);
const globalStore = GlobalStore();
const router = useRouter();
const tabsStore = TabsStore();
const keepAlive = KeepAliveStore();
// 定义 formRef（校验规则）
type FormInstance = InstanceType<typeof ElForm>;
const loginFormRef = ref<FormInstance>();
const loginRules = reactive({
	mobile: [{ required: true, message: "请输入用户名", trigger: "blur" }],
	password: [{ required: true, message: "请输入密码", trigger: "blur" }]
});

const loading = ref(false);
const loginForm = reactive({ mobile: "", password: "" });
const login = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async valid => {
		if (!valid) return;
		loading.value = true;
		try {
			// const { data } = await bindAdmin({ ...loginForm, password: md5(loginForm.password) });
			// 1.执行绑定接口
			if (props.loginWithPwd) {
				const { data } = await handleLogin(loginForm);
				globalStore.setToken(String(data));
				const res: any = await getAdminInfo({});
				globalStore.setUserInfo({ ...res.data });
			} else {
				const res: any = await bindAdmin(loginForm);
				globalStore.setUserInfo({ ...res.data });
			}

			// 2.添加 动态路由
			await initDynamicRouter();

			// 3.清空 tabs、keepAlive 保留的数据
			tabsStore.closeMultipleTab();
			keepAlive.setKeepAliveName();

			// 4.跳转到首页
			router.push(HOME_URL);
			ElNotification({
				title: getTimeState(),
				message: "欢迎登录白云乡",
				type: "success",
				duration: 3000
			});
		} finally {
			loading.value = false;
		}
	});
};
function handleSwitch() {
	console.log(emits);
	emits("changeLoginMethod", false);
}
// resetForm
const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
};

onMounted(() => {
	// 监听enter事件（调用登录）
	document.onkeydown = (e: any) => {
		e = window.event || e;
		if (e.code === "Enter" || e.code === "enter" || e.code === "NumpadEnter") {
			if (loading.value) return;
			login(loginFormRef.value);
		}
	};
});
</script>

<style scoped lang="scss">
@import "../index.scss";
.bindInfoForm-title {
	margin-bottom: 20px;
}
.bindInfoForm-tips {
	cursor: pointer;
	margin-top: 20px;
}
</style>
