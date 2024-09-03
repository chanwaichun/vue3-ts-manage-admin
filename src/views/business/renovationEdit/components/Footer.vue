<script setup lang="ts">
const emits = defineEmits(["cancel", "updateStep", "submit"]);
const props = defineProps({
	active: {
		type: Number,
		default: 0
	},
	loading: {
		type: Boolean,
		default: false
	}
});
watch(
	() => props.loading,
	val => {
		currentLoading.value = val;
	}
);
const currentLoading = ref(false);
</script>

<template>
	<div class="footer">
		<el-button v-if="props.active === 1" @click="emits('cancel')"> 取消</el-button>
		<el-button v-if="props.active === 2" type="primary" @click="emits('updateStep', 'prev')">上一步</el-button>
		<el-button :loading="currentLoading" v-if="props.active === 1" type="primary" @click="emits('updateStep', 'next')"
			>下一步</el-button
		>
		<el-button :loading="currentLoading" v-if="props.active === 2" type="primary" @click="emits('submit')">保存</el-button>
	</div>
</template>

<style scoped lang="scss">
.footer {
	display: flex;
	justify-content: center;
	padding: 16px;
}
</style>
