<template>
	<div class="wxLoginForm">
		<!-- <el-tabs v-model="activeName" class="demo-tabs">
			<el-tab-pane label="微信" name="wx">
				<span v-if="errorMsg">{{ errorMsg }}</span>
				<Loading v-if="urlTextLoading"></Loading>
				<iframe v-else class="login-qrCode" :src="urltext" sandbox="allow-scripts allow-top-navigation allow-same-origin"></iframe
			></el-tab-pane>
			<el-tab-pane label="企业微信" name="qywx">
				<div>
					<iframe id="qywxLogin"></iframe>
				</div>
			</el-tab-pane>
		</el-tabs> -->
		<div class="wxLoginForm-body">
			<span v-if="errorMsg">{{ errorMsg }}</span>
			<Loading v-if="urlTextLoading"></Loading>
			<iframe v-else class="login-qrCode" :src="urltext" sandbox="allow-scripts allow-top-navigation allow-same-origin"></iframe>
		</div>
		<div v-if="!urlTextLoading" class="login-tips lg">
			<div class="tips-item lg">同时支持企业微信扫码登陆</div>
			<div class="tips-item md" @click="emits('changeLoginMethod', true)">账号密码登录</div>
		</div>
	</div>
</template>
<script setup name="WXLoginForm" lang="ts">
import { ref, onMounted } from "vue";
import * as ww from "@wecom/jssdk";
import type { WWLoginOptions, WWLoginInstance } from "@wecom/jssdk";
import Loading from "@/components/Loading/index.vue";
import { getLoginQrCode } from "@/api/admin/index";

const emits = defineEmits(["changeLoginMethod"]);
// tab的绑定值
const activeName = ref("wx");
// url的值
const urltext = ref("");
const urlTextLoading = ref(true);
const errorMsg = ref("");
onMounted(() => {
	handleGetUrl();
});
async function handleGetUrl() {
	urlTextLoading.value = true;
	errorMsg.value = "";
	try {
		const res: any = await getLoginQrCode({});
		urltext.value = res.data;
		urlTextLoading.value = false;
	} catch (e) {
		urlTextLoading.value = false;
		errorMsg.value = "服务器异常";
	}
}
ww.createWWLoginPanel({
	el: "#qywxLogin",
	params: {
		appid: "wwb0e68e5841731c01",
		redirect_uri: "https://white-clouds-dev.dongliuxinli.com/white/clouds/manage/v1/admin/crop/callback"
	},
	onCheckWeComLogin({ isWeComLogin }) {
		console.log(isWeComLogin);
	},
	onLoginSuccess({ code }) {
		console.log({ code });
	},
	onLoginFail(err) {
		console.log(err);
	}
});
</script>
<style lang="scss" scoped>
.wxLoginForm {
	height: 100%;
	.wxLoginForm-body {
		height: calc(100% - 50px);
	}
	:deep(.el-tabs) {
		height: calc(100% - 50px);
		.el-tabs__content {
			height: calc(100% - 60px);
			.el-tab-pane {
				height: 100%;
				overflow: hidden;
			}
		}
	}
	.login-qrCode {
		height: calc(100%);
		border: none;
	}
	.login-tips {
		//height: 90px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.tips-item {
			&.md {
				cursor: pointer;
			}
			&:first-child {
				margin-bottom: 6px;
			}
		}
	}
}
</style>
