<template>
	<!-- <div class="login-container flx-center">
		<iframe id="qywxLogin"></iframe>
	</div> -->
	<div class="login-container flx-center">
		<div class="login-box">
			<div class="login-left">
				<img src="@/assets/images/login_left.png" alt="login" />
			</div>
			<div
				class="login-form"
				:class="{ qrCodeType: globalStore.isNotLogin && !loginByMobileAndPwd, bindUserType: globalStore.isNotBindMobile }"
			>
				<BindInfoForm v-if="loginByMobileAndPwd" :loginWithPwd="true" @changeLoginMethod="changeLoginMethod"></BindInfoForm>
				<WXLoginForm v-else-if="globalStore.isNotLogin" @changeLoginMethod="changeLoginMethod"></WXLoginForm>
				<BindInfoForm v-if="globalStore.isNotBindMobile" @changeLoginMethod="changeLoginMethod"></BindInfoForm>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="login">
import SwitchDark from "@/components/SwitchDark/index.vue";
import LoginForm from "./components/LoginForm.vue";
import WXLoginForm from "./components/WXLoginForm.vue";
import BindInfoForm from "./components/BindInfoForm.vue";
import { GlobalStore } from "@/stores";
import { onMounted, Ref, ref } from "vue";

const loginByMobileAndPwd: Ref<boolean> = ref(false);
const globalStore = GlobalStore();
// type为true则显示账号密码登录
// console.log(isNotLogin, isNotBindMobile);
function changeLoginMethod(type: boolean) {
	console.log(type);
	if (!type) {
		globalStore.setToken("");
		globalStore.setUserInfo(null);
	}
	loginByMobileAndPwd.value = type;
}
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
