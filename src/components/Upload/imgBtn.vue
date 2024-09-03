<template>
	<el-upload
		ref="replaceUploader"
		:before-upload="beforeUpload"
		:file-list="[]"
		:http-request="handleHttpUpload"
		:limit="1"
		:on-progress="uploadVideoProcess"
		:on-success="handleSuccess"
		:show-file-list="false"
		class="avatar-uploader"
	>
		<div class="uploadBtn-content">
			<el-button class="btnClick" size="small" type="primary">点击上传</el-button>
			<el-progress v-if="flag === true" style="margin-top: 7px" type="line" v-bind:percentage="audioUploadPercent"></el-progress>
		</div>
	</el-upload>
</template>
<script name="UploadAudioRecord" setup>
import { ElMessage } from "element-plus";
const voiceUrl = ref("");
const audioForm = ref({
	voiceUrl: "",
	voiceName: ""
});
const audioUploadPercent = ref(0);
const flag = ref(false);

function handleHttpUpload(options) {}

// 音频上传成功
function handleSuccess(res, file, fileList) {
	flag.value = false;
	audioUploadPercent.value = 0;
	if (res.code == 200) {
		audioForm.value.voiceUrl = process.env.VUE_APP_BASE_API + res.fileName;
		audioForm.value.voiceName = fileList[0].name;
	} else {
	}
}

// //进度条
function uploadVideoProcess(event, file, fileList) {
	flag.value = true;
	audioUploadPercent.value = file.percentage.toFixed(0) * 1;
}

// /**上传文件限制--只能上传mp3格式的文件 */
function beforeUpload(file) {
	const isLt10M = file.size / 1024 / 1024 < 50;
	if (["audio/mp3", "audio/mpeg"].indexOf(file.type) == -1) {
		ElMessage.error("请上传正确的音频格式");
		return false;
	}
	if (!isLt10M) {
		ElMessage.error("上传音频大小不能超过50MB哦!");
		return false;
	}
}
</script>
