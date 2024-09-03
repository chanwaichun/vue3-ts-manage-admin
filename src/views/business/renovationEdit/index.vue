<template>
	<FormContainer ref="formContainerEl" :showFooter="false" mainWidth="100%" @submit="submit">
		<template #header>
			<div class="header">
				<el-steps :active="active" align-center>
					<el-step title="基本信息" />
					<el-step title="产品列表" />
				</el-steps>
			</div>
			<keep-alive>
				<Info v-show="active === 1" ref="info"></Info>
			</keep-alive>
			<keep-alive>
				<ProductList v-show="active === 2" ref="productList"></ProductList>
			</keep-alive>

			<Footer
				:loading="loading"
				:active="active"
				@cancel="handleCancel"
				@submit="handleSubmit"
				@updateStep="handleUpdateStep"
			></Footer>
		</template>
	</FormContainer>
</template>

<script name="businessRenovationEdit" setup>
import FormContainer from "@/components/FormContainer/index.vue";
import Info from "./components/Info.vue";
import Footer from "./components/Footer.vue";
import ProductList from "./components/ProductList.vue";
import { getAdminCard } from "@/api/card";
const route = useRoute();
const active = ref(1);
const info = ref();
const productList = ref();
const formContainerEl = ref();
const loading = ref(false);
function setActive(type) {
	type === "next" ? active.value++ : active.value--;
}
// 点击下一步
async function handleUpdateStep(type) {
	if (type === "prev") {
		active.value--;
		return;
	}

	console.log(info.value.formData);
	console.log(productList.value.formData);
	if (active.value === 1) {
		try {
			loading.value = true;
			await info.value.validateForm();
			const dataId = await info.value.submit();
			if (!dataId) {
				loading.value = false;
				return;
			}
			console.log(dataId);
			if (!route.params.cardId) {
				productList.value.updateCardId(dataId);
				productList.value.handleGetCard();
			}
			loading.value = false;
			active.value++;
		} catch (e) {
			loading.value = false;
			console.log(e);
		}
	}
}

function handleCancel() {}
// 点击保存
async function handleSubmit() {
	try {
		loading.value = true;
		await productList.value.submit();
		loading.value = false;
		formContainerEl.value.cancel();
	} catch (e) {
		loading.value = false;
		console.error(e);
	}
	// try {
	// 	const res = await Promise.all([info.value.submit(), productList.value.submit()]);
	// 	console.log(res);
	// 	formContainerEl.value.cancel();
	// } catch (e) {
	// 	active.value = 2;
	// 	console.log(e);
	// }
}
</script>
<style lang="scss" scoped>
.header {
	padding: 16px 0;
}
.hidden {
	visibility: hidden;
}
</style>
