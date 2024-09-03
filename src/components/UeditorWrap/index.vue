<script setup lang="tsx">
const props = defineProps({
	value: {
		type: String,
		default: ""
	}
});
const emit = defineEmits(["update:modelValue"]);
const curentValue = ref(props.value);

watch(
	() => curentValue.value,
	val => {
		emit("update:modelValue", val);
	}
);
onUnmounted(() => {
	window.XIUMI_IMAGE_LOADING = false;
});
const editorConfig = {
	initialFrameWidth: 550,
	UEDITOR_HOME_URL: "/UEditor/",
	uploadUrl: import.meta.env.VITE_API_URL + "/white/clouds/manage/v1/file/upload/img/list",
	catcherUrlPrefix: import.meta.env.VITE_HOST_URL + "/productUploadImg/", // 访问 UEditor 静态资源的根路径，可参考常见问题1
	autoFloatEnabled: false
	// catchRemoteImageEnable: true
};
function getLoadingStatus() {
	return window.XIUMI_IMAGE_LOADING;
}
const editorDependencies = [
	"ueditor.config.js",
	"ueditor.all.min.js",
	// 添加秀米相关的资源
	"xiumi/xiumi-ue-dialog-v5.js",
	"xiumi/xiumi-ue-v5.css"
];
defineExpose({
	getLoadingStatus
});
</script>

<template>
	<VueUeditorWrap
		v-model="curentValue"
		:config="editorConfig"
		:editor-dependencies="editorDependencies"
		editor-id="editor-demo-01"
	></VueUeditorWrap>
</template>

<style scoped lang="scss"></style>
