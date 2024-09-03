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
					centerBox
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
			:id="uuid"
			:accept="fileType.join(',')"
			:before-upload="beforeUpload"
			:class="['upload', self_disabled ? 'disabled' : '', drag ? 'no-border' : '']"
			:disabled="self_disabled"
			:drag="drag"
			:http-request="handleHttpUpload"
			:multiple="false"
			:on-error="uploadError"
			:on-success="uploadSuccess"
			:show-file-list="false"
			action="#"
		>
			<template v-if="imageUrl">
				<img :src="setImageUrl(imageUrl)" class="upload-image" />
				<div class="upload-handle" @click.stop>
					<div v-if="!self_disabled" class="handle-icon" @click="editImg">
						<el-icon>
							<Edit />
						</el-icon>
						<span>编辑</span>
					</div>
					<div class="handle-icon" @click="imgViewVisible = true">
						<el-icon>
							<ZoomIn />
						</el-icon>
						<span>查看</span>
					</div>
					<div v-if="!self_disabled" class="handle-icon" @click="deleteImg">
						<el-icon>
							<Delete />
						</el-icon>
						<span>删除</span>
					</div>
				</div>
			</template>
			<template v-else>
				<div class="upload-empty">
					<slot name="empty">
						<el-icon>
							<Plus />
						</el-icon>
						<!-- <span>请上传图片</span> -->
					</slot>
				</div>
			</template>
		</el-upload>
		<div class="el-upload__tip">
			<slot name="tip"></slot>
		</div>
		<el-image-viewer
			v-if="imgViewVisible"
			:url-list="[setImageUrl(imageUrl)]"
			:z-index="999"
			teleported
			@close="imgViewVisible = false"
		/>
	</div>
</template>

<script lang="ts" name="UploadImg" setup>
import { ref, computed, inject } from "vue";
// import { uploadImg } from "@/api/modules/upload";
import { setImageUrl } from "@/utils/format";
import { generateUUID } from "@/utils/util";
import { ElNotification, formContextKey, formItemContextKey, UploadFile } from "element-plus";
import type { UploadProps, UploadRequestOptions } from "element-plus";
import { uploadProductImg } from "@/api/upload";

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
	cropper: boolean; //是否裁剪
	cropperOptions?: any; //裁剪配置项
	imageUrl: string; // 图片地址 ==> 必传
	api?: (params: any) => Promise<any>; // 上传图片的 api 方法，一般项目上传都是同一个 api 方法，在组件里直接引入即可 ==> 非必传
	drag?: boolean; // 是否支持拖拽上传 ==> 非必传（默认为 true）
	disabled?: boolean; // 是否禁用上传组件 ==> 非必传（默认为 false）
	fileSize?: number; // 图片大小限制 ==> 非必传（默认为 5M）
	fileType?: FileTypes[]; // 图片类型限制 ==> 非必传（默认为 ["image/jpeg", "image/png", "image/gif"]）
	height?: string; // 组件高度 ==> 非必传（默认为 150px）
	width?: string; // 组件宽度 ==> 非必传（默认为 150px）
	borderRadius?: string; // 组件边框圆角 ==> 非必传（默认为 8px）
}

// 接受父组件参数
const props = withDefaults(defineProps<UploadFileProps>(), {
	imageUrl: "",
	drag: true,
	disabled: false,
	fileSize: 5,
	fileType: () => ["image/jpeg", "image/png", "image/gif"],
	height: "150px",
	width: "150px",
	borderRadius: "8px",
	//是否裁剪，默认都是false
	cropper: false,
	//裁剪的默认配置项
	cropperOptions: {
		// 默认长宽高比 3：4
		fixedNumber: [3, 4],
		// 固定尺寸默认为true
		fixed: true
	}
});

// 生成组件唯一id
const uuid = ref("id-" + generateUUID());

// 查看图片
const imgViewVisible = ref(false);
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
const cropper = ref();

/**
 * @description 图片上传
 * @param options 上传的文件
 * */
interface UploadEmits {
	(e: "update:imageUrl", value: string): void;

	(e: "check-validate"): void;
}

const emit = defineEmits<UploadEmits>();
const handleHttpUpload = async (options: UploadRequestOptions) => {
	if (!props.cropper) {
		let formData = new FormData();
		formData.append("img", options.file);
		try {
			const res: any = await uploadProductImg(formData);
			emit("update:imageUrl", res.data);
			// 调用 el-form 内部的校验方法（可自动校验）
			formItemContext?.prop && formContext?.validateField([formItemContext.prop as string]);
			emit("check-validate");
			options.onSuccess(res.data);
		} catch (error) {
			options.onError(error as any);
		}
	} else {
		cropperProps.src = URL.createObjectURL(options.file);
		cropperProps.options = options;
		cropperProps.show = true;
	}
};

/**
 * @description 删除图片
 * */
const deleteImg = () => {
	emit("update:imageUrl", "");
};

/**
 * @description 编辑图片
 * */
const editImg = () => {
	const dom = document.querySelector(`#${uuid.value} .el-upload__input`);
	dom && dom.dispatchEvent(new MouseEvent("click"));
};

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

// 图片上传成功提示
const uploadSuccess = (response: any, uploadFile: any) => {
	console.log(response, uploadFile);
	if (!response) return;
	// // 暂时删掉
	uploadFile.res = response;
	// 如果是剪裁模式把当前的url替换掉
	if (props.cropper) {
		uploadFile.url = cropperProps.src;
	}

	emit("update:imageUrl", response);
	ElNotification({
		title: "温馨提示",
		message: "图片上传成功！",
		type: "success"
	});
	cropperProps.show = false;
};

// 图片上传错误提示
const uploadError = () => {
	ElNotification({
		title: "温馨提示",
		message: "图片上传失败，请您重新上传！",
		type: "error"
	});
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
				// const api = props.api ?? uploadProductImg;
				const { data } = await uploadProductImg(formData);
				currentOptions.onSuccess(data);
			} catch (error) {
				currentOptions.onError(error as any);
			}
		});
	});
};
const handleCancel = () => {
	deleteImg();
	cropperProps.show = false;
};
</script>
<style>
.upload-cropper {
	height: 600px;
}
</style>
<style lang="scss" scoped>
.is-error {
	.upload {
		:deep(.el-upload),
		:deep(.el-upload-dragger) {
			border: 1px dashed var(--el-color-danger) !important;

			&:hover {
				border-color: var(--el-color-primary) !important;
			}
		}
	}
}

:deep(.disabled) {
	.el-upload,
	.el-upload-dragger {
		cursor: not-allowed !important;
		background: var(--el-disabled-bg-color);
		border: 1px dashed var(--el-border-color-darker) !important;

		&:hover {
			border: 1px dashed var(--el-border-color-darker) !important;
		}
	}
}

.upload-box {
	.no-border {
		:deep(.el-upload) {
			border: none !important;
		}
	}

	:deep(.upload) {
		.el-upload {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			width: v-bind(width);
			height: v-bind(height);
			overflow: hidden;
			border: 1px dashed var(--el-border-color-darker);
			border-radius: v-bind(borderRadius);
			transition: var(--el-transition-duration-fast);

			&:hover {
				border-color: var(--el-color-primary);

				.upload-handle {
					opacity: 1;
				}
			}

			.el-upload-dragger {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				height: 100%;
				padding: 0;
				overflow: hidden;
				background-color: transparent;
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

			.upload-image {
				width: 100%;
				height: 100%;
				object-fit: contain;
			}

			.upload-empty {
				position: relative;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				font-size: 12px;
				line-height: 30px;
				color: var(--el-color-info);

				.el-icon {
					font-size: 28px;
					color: var(--el-text-color-secondary);
				}
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
						margin-bottom: 40%;
						font-size: 130%;
						line-height: 130%;
					}

					span {
						font-size: 85%;
						line-height: 85%;
					}
				}
			}
		}
	}

	.el-upload__tip {
		line-height: 18px;
		text-align: center;
	}
}
</style>
