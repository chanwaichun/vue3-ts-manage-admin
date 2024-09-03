<template>
	<el-upload
		ref="uploadBtn"
		action="#"
		:before-upload="beforeUpload"
		:file-list="[]"
		:http-request="handleHttpUpload"
		:limit="1"
		:on-progress="uploadVideoProcess"
		:show-file-list="false"
		class="avatar-uploader"
	>
		<div class="uploadBtn-content">
			<el-button class="uploadBtn-btn" size="small" type="primary">点击上传</el-button>
			<div class="uploadBtn-audio" v-if="voiceUrl != '' && !audioFlag">
				<audio :src="voiceUrl" controls>你的浏览器不支持 <code>audio</code> 标签.</audio>
				<el-icon :size="16" color="#409EFC" @click.stop="handleDelete">
					<Delete />
				</el-icon>
			</div>

			<el-progress v-if="audioFlag == true" style="margin-top: 7px" type="line" :percentage="audioUploadPercent"></el-progress>
		</div>
	</el-upload>
</template>
<script name="UploadAudioRecord" setup>
import { ElMessage } from "element-plus";
import { Delete } from "@element-plus/icons-vue";
import { uploadProductImg } from "@/api/upload/index";
import { setImageUrl } from "@/utils/format";
const voiceUrl = ref("");
const uploadBtn = ref();
const audioForm = ref({
	voiceUrl: "",
	voiceName: ""
});
const audioUploadPercent = ref(0);
const audioFlag = ref(false);

const handleHttpUpload = async options => {
	try {
		const file = options.file;
		let formData = new FormData();
		formData.append("img", file, file.name);
		const res = await uploadProductImg(formData);
		audioFlag.value = false;
		audioUploadPercent.value = 0;
		if (res.code == 200) {
			voiceUrl.value = setImageUrl(res.data);
			audioForm.value.voiceUrl = setImageUrl(res.data);
			audioForm.value.voiceName = file.name;
		}
	} catch (error) {
		options.onError(error);
	}
};

// 音频上传成功
// function handleSuccess(res, file, fileList) {
// 	console.log(res);
// }

// //进度条
function uploadVideoProcess(event, file, fileList) {
	audioFlag.value = true;
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
function handleDelete() {
	nextTick(() => {
		uploadBtn.value.clearFiles();
		voiceUrl.value = "";
		audioForm.value.voiceUrl = "";
		audioForm.value.voiceName = "";
	});
}
</script>
<style lang="scss" scoped>
.uploadBtn-btn {
	display: block;
}
.uploadBtn-audio {
	display: flex;
	align-items: center;
	margin-top: 16px;
}
</style>
