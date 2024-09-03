<template>
	<div class="editContract">
		<el-form-item label="设置为主要联系" size="small">
			<el-radio-group v-model="formData.mainStatus" @change="handleChange">
				<el-radio v-for="item in contractMethodMain" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
			</el-radio-group>
		</el-form-item>
		<el-row :gutter="20">
			<el-col v-for="(item, index) in contractMethod" :key="item.contactType" :span="10">
				<el-form-item :label="item.label" size="small">
					<template v-if="contractList[index].contactType === 2">
						<el-input v-model="contractList[index].textRemark"></el-input>
					</template>
					<template v-else>
						<UploadImg
							v-model:imageUrl="contractList[index].icon"
							:cropperOptions="{
								// 默认长宽高比 3：4
								fixedNumber: [1, 1],
								// 固定尺寸默认为true
								fixed: true
							}"
							:file-size="1"
							cropper
							height="135px"
							width="135px"
						>
							<template #empty>
								<el-icon>
									<Plus />
								</el-icon>
							</template>
						</UploadImg>
					</template>
				</el-form-item>
			</el-col>
		</el-row>
	</div>
</template>

<script name="EditContract" setup>
import { contractMethod, contractMethodMain } from "@/utils/serviceDict";
import UploadImg from "@/components/Upload/Img.vue";
import { uploadProductImg } from "@/api/upload";

const emits = defineEmits(["update:modelValue"]);
const props = defineProps({
	modelValue: {
		type: Array,
		default: () => []
	}
});
// 重新设置数据
watch(
	() => props.modelValue,
	val => {
		console.log(val);
		if (!formData.mainStatus) {
			val.forEach(item => {
				if (item.mainStatus) {
					formData.value.mainStatus = item.contactType;
				}
			});
		}
		contractList.value = val;
	}
);
const contractList = ref(props.modelValue);
const formData = ref({
	mainStatus: ""
});

async function submit() {}

function handleChange(e) {
	console.log(e);
	contractList.value.forEach(item => {
		item.mainStatus = item.contactType === e;
	});
	emits("update:modelValue", contractList.value);
}

// 1：抖音，2：手机，3：企业微信，4：微信，5：小红书
defineExpose({
	formData,
	submit
});
</script>

<style lang="scss" scoped>
.editContract {
	::v-deep(.el-form-item) {
		margin-bottom: 16px;
	}
}
</style>
