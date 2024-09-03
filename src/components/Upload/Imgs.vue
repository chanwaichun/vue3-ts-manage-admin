<template>
	<div class="upload-box">
		<el-dialog
			v-model="cropperProps.show"
			:close-on-click-modal="false"
			:show-close="false"
			append-to-body
			center
			destroy-on-close
			title="裁剪图片"
			top="10vh"
			width="1000px"
		>
			<div class="upload-cropper">
				<VueCropper
					ref="cropper"
					:fixed="cropperOptions.fixed"
					:fixedNumber="cropperOptions.fixedNumber"
					:img="cropperProps.src"
					autoCrop
					full
					mode="cover"
				></VueCropper>
			</div>
			<template #footer>
				<el-button @click="handleCancel"> 取消</el-button>
				<el-button type="primary" @click="handleConfirm"> 确认</el-button>
			</template>
		</el-dialog>
		<el-upload
			v-model:file-list="fileList"
			:accept="fileType.join(',')"
			:before-upload="beforeUpload"
			:class="['upload', self_disabled ? 'disabled' : '', drag ? 'no-border' : '']"
			:disabled="self_disabled"
			:drag="drag"
			:http-request="handleHttpUpload"
			:limit="limit"
			:list-type="listType"
			:multiple="true"
			:on-error="uploadError"
			:on-exceed="handleExceed"
			:on-success="uploadSuccess"
			action="#"
		>
			<template v-if="slots.default">
				<slot></slot>
			</template>

			<div v-else class="upload-empty">
				<slot name="empty">
					<el-icon>
						<Plus />
					</el-icon>
					<!-- <span>请上传图片</span> -->
				</slot>
			</div>

			<template v-if="showFileList" #file="{ file }">
				<img :src="file.url" class="upload-image" />
				<div class="upload-handle" @click.stop>
					<div class="handle-icon" @click="handlePictureCardPreview(file)">
						<el-icon>
							<ZoomIn />
						</el-icon>
						<span>查看</span>
					</div>
					<div v-if="!self_disabled" class="handle-icon" @click="handleRemove(file)">
						<el-icon>
							<Delete />
						</el-icon>
						<span>删除</span>
					</div>
				</div>
			</template>
		</el-upload>
		<div v-show="showFileList" class="el-upload__tip">
			<slot name="tip"></slot>
		</div>
		<el-image-viewer v-if="imgViewVisible" :url-list="[viewImageUrl]" @close="imgViewVisible = false" />
	</div>
</template>

<script lang="ts" name="UploadImgs" setup>
import { ref, computed, inject } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { uploadImg } from "@/api/modules/upload";
import type { UploadProps, UploadFile, UploadUserFile, UploadRequestOptions } from "element-plus";
import { ElNotification, formContextKey, formItemContextKey } from "element-plus";

const slots = useSlots();
type FileTypes =
	| "image/apng"
	| "image/bmp"
	| "image/gif"
	| "image/jpeg"
	| "image/pjpeg"
	| "image/png"
	| "image/svg+xml"
	| "image/tiff"
	| "image/webp"
	| "image/x-icon";

interface UploadFileProps {
	showFileList?: boolean;
	listType: any;
	cropper: boolean; //是否裁剪
	cropperOptions?: any; //裁剪配置项
	fileList: UploadUserFile[];
	api?: (params: any) => Promise<any>; // 上传图片的 api 方法，一般项目上传都是同一个 api 方法，在组件里直接引入即可 ==> 非必传
	drag?: boolean; // 是否支持拖拽上传 ==> 非必传（默认为 true）
	disabled?: boolean; // 是否禁用上传组件 ==> 非必传（默认为 false）
	limit?: number; // 最大图片上传数 ==> 非必传（默认为 5张）
	fileSize?: number; // 图片大小限制 ==> 非必传（默认为 5M）
	fileType?: FileTypes[]; // 图片类型限制 ==> 非必传（默认为 ["image/jpeg", "image/png", "image/gif"]）
	height?: string; // 组件高度 ==> 非必传（默认为 150px）
	width?: string; // 组件宽度 ==> 非必传（默认为 150px）
	borderRadius?: string; // 组件边框圆角 ==> 非必传（默认为 8px）
}

const props = withDefaults(defineProps<UploadFileProps>(), {
	showFileList: true,
	fileList: () => [],
	drag: true,
	//是否裁剪，默认都是false
	cropper: false,
	disabled: false,
	limit: 5,
	listType: "list-card",
	fileSize: 5,
	//裁剪的默认配置项
	cropperOptions: {
		// 默认长宽高比 3：4
		fixedNumber: [3, 4],
		// 固定尺寸默认为true
		fixed: true
	},
	fileType: () => ["image/jpeg", "image/png", "image/gif"],
	height: "150px",
	width: "150px",
	borderRadius: "8px"
});

// 获取 el-form 组件上下文
const formContext = inject(formContextKey, void 0);
// 获取 el-form-item 组件上下文
const formItemContext = inject(formItemContextKey, void 0);
// 判断是否禁用上传和删除
const self_disabled = computed(() => {
	return props.disabled || formContext?.disabled;
});
const cropperProps: any = reactive({
	show: false,
	src: "",
	options: null
});
watch(
	() => props.fileList,
	val => {
		fileList.value = val;
	}
);

const fileList = ref<UploadUserFile[]>(props.fileList);
/**
 * @description 文件上传之前判断
 * @param rawFile 上传的文件
 * */
const beforeUpload: UploadProps["beforeUpload"] = rawFile => {
	const imgSize = rawFile.size / 1024 / 1024 < props.fileSize;
	const imgType = props.fileType;
	if (!imgType.includes(rawFile.type as FileTypes))
		ElNotification({
			title: "温馨提示",
			message: "上传图片不符合所需的格式！",
			type: "warning"
		});
	if (!imgSize)
		ElNotification({
			title: "温馨提示",
			message: `上传图片大小不能超过 ${props.fileSize}M！`,
			type: "warning"
		});
	return imgType.includes(rawFile.type as FileTypes) && imgSize;
};

/**
 * @description 图片上传
 * @param options 上传的文件
 * */
const handleHttpUpload = async (options: UploadRequestOptions) => {
	if (!props.cropper) {
		let formData = new FormData();
		formData.append("img", options.file);
		try {
			const api = props.api ?? uploadImg;
			const { data } = await api(formData);
			options.onSuccess(data);
		} catch (error) {
			options.onError(error as any);
		}
	} else {
		cropperProps.src = URL.createObjectURL(options.file);
		cropperProps.options = options;
		cropperProps.show = true;
	}
};

// 图片上传成功
interface UploadEmits {
	(e: "update:fileList", value: UploadUserFile[]): void;
}

const emit = defineEmits<UploadEmits>();
const uploadSuccess = (response: { fileUrl: string } | undefined, uploadFile: any) => {
	if (!response) return;
	// 暂时删掉
	uploadFile.res = response;
	// 如果是剪裁模式把当前的url替换掉
	if (props.cropper) {
		uploadFile.url = cropperProps.src;
	}

	// uploadFile.url = response.fileUrl;
	emit("update:fileList", fileList.value);
	// 调用 el-form 内部的校验方法（可自动校验）
	formItemContext?.prop && formContext?.validateField([formItemContext.prop as string]);
	ElNotification({
		title: "温馨提示",
		message: "图片上传成功！",
		type: "success"
	});
	// cropperProps.src = "";
	// cropperProps.options = null;
	cropperProps.show = false;
};

// 删除图片
const handleRemove = (uploadFile: UploadFile) => {
	if (!uploadFile.url) {
		fileList.value = fileList.value.filter(item => item.name !== uploadFile.name);
	} else {
		fileList.value = fileList.value.filter(item => item.url !== uploadFile.url || item.name !== uploadFile.name);
	}

	emit("update:fileList", fileList.value);
};

// 图片上传错误提示
const uploadError = () => {
	ElNotification({
		title: "温馨提示",
		message: "图片上传失败，请您重新上传！",
		type: "error"
	});
};

// 文件数超出提示
const handleExceed = () => {
	ElNotification({
		title: "温馨提示",
		message: `当前最多只能上传 ${props.limit} 张图片，请移除后上传！`,
		type: "warning"
	});
};

// 图片预览
const viewImageUrl = ref("");
const imgViewVisible = ref(false);
const handlePictureCardPreview: UploadProps["onPreview"] = uploadFile => {
	viewImageUrl.value = uploadFile.url!;
	imgViewVisible.value = true;
};
const cropper = ref();
const handleCancel = () => {
	const currentOptions = cropperProps.options;
	handleRemove(currentOptions.file);
	cropperProps.show = false;
};
const handleConfirm = () => {
	nextTick(() => {
		cropper.value.getCropBlob(async (data: any) => {
			const currentOptions = cropperProps.options;
			const fileName = currentOptions.file.name.split(".")[0] + ".jpeg";
			let file = new File([data], fileName, { type: data.type });
			let formData = new FormData();
			formData.append("img", file, fileName);
			cropperProps.src = URL.createObjectURL(file);
			try {
				const api = props.api ?? uploadImg;
				const { data } = await api(formData);
				currentOptions.onSuccess(data);
			} catch (error) {
				currentOptions.onError(error as any);
			}
		});
	});
};

defineExpose({
	fileList
});
</script>
<style>
.upload-cropper {
	height: 600px;
}
</style>
<style lang="scss" scoped>
.is-error {
	.upload {
		:deep(.el-upload--picture-card),
		:deep(.el-upload-dragger) {
			border: 1px dashed var(--el-color-danger) !important;

			&:hover {
				border-color: var(--el-color-primary) !important;
			}
		}
	}
}

:deep(.disabled) {
	.el-upload--picture-card,
	.el-upload-dragger {
		cursor: not-allowed;
		background: var(--el-disabled-bg-color) !important;
		border: 1px dashed var(--el-border-color-darker);

		&:hover {
			border-color: var(--el-border-color-darker) !important;
		}
	}
}

.upload-box {
	.no-border {
		:deep(.el-upload--picture-card) {
			border: none !important;
		}
	}

	:deep(.upload) {
		.el-upload-dragger {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 100%;
			padding: 0;
			overflow: hidden;
			border: 1px dashed var(--el-border-color-darker);
			border-radius: v-bind(borderRadius);

			&:hover {
				border: 1px dashed var(--el-color-primary);
			}
		}

		.el-upload-dragger.is-dragover {
			background-color: var(--el-color-primary-light-9);
			border: 2px dashed var(--el-color-primary) !important;
		}

		.el-upload-list__item,
		.el-upload--picture-card {
			width: v-bind(width);
			height: v-bind(height);
			background-color: transparent;
			border-radius: v-bind(borderRadius);
		}

		.upload-image {
			width: 100%;
			height: 100%;
			object-fit: contain;
		}

		.upload-handle {
			position: absolute;
			top: 0;
			right: 0;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 100%;
			cursor: pointer;
			background: rgb(0 0 0 / 60%);
			opacity: 0;
			transition: var(--el-transition-duration-fast);

			.handle-icon {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				padding: 0 6%;
				color: aliceblue;

				.el-icon {
					margin-bottom: 15%;
					font-size: 140%;
				}

				span {
					font-size: 100%;
				}
			}
		}

		.el-upload-list__item {
			&:hover {
				.upload-handle {
					opacity: 1;
				}
			}
		}

		.upload-empty {
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 12px;
			line-height: 30px;
			color: var(--el-color-info);

			.el-icon {
				font-size: 28px;
				color: var(--el-text-color-secondary);
			}
		}
	}

	.el-upload__tip {
		line-height: 15px;
		text-align: center;
	}
}
</style>
