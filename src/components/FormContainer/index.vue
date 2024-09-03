<template>
	<div class="formContainer" :class="{ transparent: isTransparent }">
		<slot name="header"></slot>

		<div class="main" :style="{ width: mainWidth }">
			<slot></slot>
		</div>
		<div class="footer" v-if="showFooter">
			<el-button type="primary" :disabled="confirmBtnDisabled" @click="emits('submit')">{{ props.submitText }}</el-button>
			<el-button @click="cancel">取消</el-button>
		</div>
	</div>
</template>
<script setup lang="ts">
import { defineEmits, defineExpose } from "vue";
import { useRoute, useRouter } from "vue-router";
import { TabsStore } from "@/stores/modules/tabs";
const route = useRoute();
const tabsStore = TabsStore();
const props = defineProps({
	submitText: {
		type: String,
		default: "保存"
	},
	confirmBtnDisabled: {
		type: Boolean,
		default: false
	},
	mainWidth: {
		type: String,
		default: "50%"
	},
	isTransparent: {
		type: Boolean,
		default: false
	},
	showFooter: {
		type: Boolean,
		default: true
	}
});
const emits = defineEmits(["submit"]);
function cancel() {
	tabsStore.removeTabs(route.fullPath);
}
defineExpose({
	cancel
});
</script>
<style lang="scss" scoped>
.formContainer {
	//display: flex;
	//flex-direction: column;
	background-color: white;
	&.transparent {
		background-color: transparent;
	}
	.main {
		//flex: 1;
		padding: 16px;
		::v-deep .el-input-number {
			width: 100%;
			.el-input-number__decrease,
			.el-input-number__increase {
				display: none;
			}
			.el-input__inner {
				text-align: left;
			}
		}
	}
	.footer {
		padding: 16px;
	}
}
</style>
