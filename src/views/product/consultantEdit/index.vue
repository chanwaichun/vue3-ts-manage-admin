<template>
	<FormContainer ref="formContainerEl" :confirmBtnDisabled="disabledEdit" :isTransparent="true" mainWidth="100%" @submit="submit">
		<el-form ref="formEl" :disabled="disabledEdit" :model="formData" :rules="formRules" label-width="100">
			<el-card :style="{ marginBottom: '16px' }" header="基本信息">
				<div class="card-body">
					<!--商品类型-->
					<el-form-item label="商品类型" prop="productType" required>
						<el-radio-group v-model="formData.productType" :disabled="disabled" @change="handleRadioChange">
							<el-radio v-for="item in productType" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
						</el-radio-group>
					</el-form-item>
					<!--标题-->
					<el-form-item label="标题" prop="productName" required>
						<el-input v-model="formData.productName" maxlength="60" placeholder="请输入标题"></el-input>
					</el-form-item>
					<el-form-item label="副标题" prop="subName">
						<el-input v-model="formData.subName" placeholder="请输入副标题"></el-input>
					</el-form-item>
					<el-form-item label="分类" prop="categoryId" required>
						<el-cascader
							v-model="formData.categoryId"
							:disabled="disabled"
							:options="categoryList"
							:props="{ children: 'childCategoryVoList', label: 'title', value: 'id' }"
							style="width: 100%"
						/>
					</el-form-item>

					<el-form-item label="服务主图" prop="img">
						<UploadImgs
							ref="uploadImgsRef"
							v-model:file-list="formData.img"
							:api="uploadProductImg"
							cropper
							:cropperOptions="{
								fixedNumber: [1, 1],
								fixed: true
							}"
							:limit="1"
							list-type="picture-card"
						>
							<el-icon>
								<Plus />
							</el-icon>
						</UploadImgs>
					</el-form-item>
					<el-form-item label="服务商家" prop="businessId" required>
						<el-select-v2
							v-model="formData.businessId"
							:disabled="businessSelectDisabledStatus"
							:options="businessList"
							clearable
							placeholder="请选择"
							@change="handleBusinessIdChange"
						/>
					</el-form-item>
					<el-form-item label="关联名片" prop="cardId">
						<el-select-v2 v-model="formData.cardId" :options="cardList" placeholder="请输入内容" style="width: 100%">
						</el-select-v2>
					</el-form-item>
				</div>
			</el-card>
			<el-card header="售卖信息">
				<div class="card-body">
					<el-form-item :label="setLabel('price')" prop="price" required>
						<el-input-number
							v-model="formData.price"
							:min="0"
							:precision="2"
							:step="0.01"
							controls-position="right"
							placeholder="请输入内容"
						/>
					</el-form-item>
					<el-form-item v-if="setFromItemShow([1])" label="招生时间" prop="enrollTimeRange">
						<el-date-picker v-model="formData.enrollTimeRange" type="daterange" value-format="YYYY-MM-DD"></el-date-picker>
					</el-form-item>
					<el-form-item v-if="setFromItemShow([1])" label="服务时间" prop="serviceTimeRange">
						<el-date-picker v-model="formData.serviceTimeRange" type="daterange" value-format="YYYY-MM-DD"></el-date-picker>
						<!--					<el-select-v2 v-model="formData.serviceTimeRange" :options="suitType" placeholder="请输入内容" style="width: 100%">-->
						<!--					</el-select-v2>-->
					</el-form-item>
					<el-form-item v-if="setFromItemShow([1])" label="服务时长" prop="serviceDuration">
						<el-input-number
							v-model="formData.serviceDuration"
							:min="0"
							:precision="0"
							:step="1"
							controls-position="right"
							placeholder="请输入内容"
						/>
					</el-form-item>

					<el-form-item v-if="setFromItemShow([1, 2, 3])" :label="setLabel('serviceNum')" prop="serviceNum">
						<el-input-number
							v-model="formData.serviceNum"
							:min="0"
							:precision="0"
							:step="1"
							controls-position="right"
							placeholder="请输入内容"
						/>
					</el-form-item>
				</div>

				<el-form-item v-if="setFromItemShow([1, 2, 3])" label="详情图" prop="productDetail">
					<UeditorWrap ref="ueditorWrapEl" v-model="formData.productDetail"></UeditorWrap>
				</el-form-item>
			</el-card>
		</el-form>
	</FormContainer>
</template>

<script lang="tsx" name="productConsultantEdit" setup>
import { Ref } from "vue";
import FormContainer from "@/components/FormContainer/index.vue";
import { addOrUpdateProduct, getAllCategory, getProductDetail } from "@/api/product/index";
import { getBusinessList } from "@/api/business/index";
import { uploadProductImg } from "@/api/upload/index";
import { getListBySjId } from "@/api/card/index";
import { productType } from "@/utils/serviceDict";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";

import { GlobalStore } from "@/stores";
import { setImageUrl } from "@/utils/format";
import { checkImage } from "@/utils/eleValidate";
import UploadImgs from "@/components/Upload/Imgs.vue";
import UeditorWrap from "@/components/UeditorWrap/index.vue";
import useSelectData from "@/hooks/useSelectData";
import { ADMIN, ADMIN2 } from "@/routers/modules/staticRouter";

const route = useRoute();
const router = useRouter();

const globalStore = GlobalStore();
// ref
const formContainerEl = ref();
const uploadImgsRef = ref();
const ueditorWrapEl = ref();
const formEl = ref<FormInstance>();
// 表单规则
const formRules = reactive<FormRules>({
	productType: [{ required: true, message: "请输入商品名", trigger: "change" }],
	productName: [{ required: true, message: "请输入商品名", trigger: "change" }],
	price: [
		{ required: true, message: "请输入价格", trigger: "change" },
		{
			validator: (rule: any, value: any, callback: any) => {
				if (!value || value === "0") {
					callback(new Error("价格不能为0"));
				} else {
					callback();
				}
			}
		}
	],
	img: [{ required: true, validator: checkImage, trigger: "blur" }],
	businessId: [{ required: true, message: "请选择商家", trigger: "change" }]
});
// 来自于总部商品且不是管理员本人
const disabled: any = computed(() => Boolean(route.query.id));
const formData: any = ref({
	productType: 1,
	productName: "",
	price: 0,
	subName: "",
	categoryId: "",
	productDetail: "",
	businessId: null,
	cardId: null,
	// settleRules: "",
	img: []
});

const categoryList: Ref<Array<any>> = ref([]);
handleGetAllCategory();
handleGetProductDetail();

/*
 * 动态设置字段
 * */
function setLabel(type: string): any {
	const labelMap = {
		price: {
			1: "服务价格",
			2: "服务价格",
			3: "商品价格"
		},
		serviceNum: {
			1: "服务人数",
			2: "服务次数",
			3: "商品库存"
		}
	};
	return labelMap[type][formData.value.productType];
}

/*
 * 处理表单字段的显示隐藏
 * */
function setFromItemShow(classifyArr: Array<number>) {
	return classifyArr.includes(formData.value.productType);
}

/*
 * 处理进来的数据
 * */
function handleInput(query: any) {
	const params: any = JSON.parse(JSON.stringify(query));
	if (params.enrollStart && params.enrollEnd) {
		params.enrollTimeRange = [params.enrollStart, params.enrollEnd];
		delete params.enrollStart;
		delete params.enrollEnd;
	}
	if (params.serviceStart && params.serviceEnd) {
		params.serviceTimeRange = [params.serviceStart, params.serviceEnd];
		delete params.serviceStart;
		delete params.serviceEnd;
	}
	if (params.img) {
		params.img = [{ url: setImageUrl(params.img), res: params.img }];
		uploadImgsRef.value.fileList = params.img;
	}
	return { ...params, productType: Number(params.productType) };
}

/*
 * 处理输出的数据
 * */
function handleOutput(query: any) {
	const params = JSON.parse(JSON.stringify(query));
	if (params.productType === 2 || params.productType === 3) {
		delete params.enrollTimeRange;
		delete params.serviceTimeRange;
		delete params.serviceDuration;
	}
	if (params.enrollTimeRange) {
		const [enrollStart, enrollEnd] = params.enrollTimeRange;
		params.enrollStart = enrollStart;
		params.enrollEnd = enrollEnd;
		delete params.enrollTimeRange;
	}
	if (params.serviceTimeRange) {
		const [serviceStart, serviceEnd] = params.serviceTimeRange;
		params.serviceStart = serviceStart;
		params.serviceEnd = serviceEnd;
		delete params.serviceTimeRange;
	}
	if (typeof params.categoryId === "object") {
		const [parent, child] = params.categoryId;
		params.categoryId = child;
	}
	if (params.img) {
		params.img = setImgListText(params.img);
	}
	return params;
}

/*
 * 获取所有的分类
 * */
async function handleGetAllCategory() {
	const res: any = await getAllCategory({});
	categoryList.value = res.data;
	if (route.query?.id) {
		const res: any = await getProductDetail({ id: route.query.id });
		formData.value = handleInput(res.data);
		getCardList();
	}
}

async function handleGetProductDetail() {}

/*
 * 表单提交
 * */
async function submit() {
	if (ueditorWrapEl.value.getLoadingStatus()) {
		ElMessage.warning("详情图未上传完，请待图片上传完再提交");
		return;
	}
	if (!formEl.value) return;
	const res = await formEl.value.validate();
	if (!res) return;
	try {
		// console.log(params);
		const params = handleOutput(formData.value);
		const updateRes = addOrUpdateProduct(params);
		ElMessage.success(params.id ? "更新成功" : "创建成功");
		formContainerEl.value.cancel();
		router.push("/product/consultantManage");
	} catch (e) {
		ElMessage.error("创建失败");
	}
}

/*
 * 把图片列表中的res提取出来
 * */
function setImgListText(fileList: any) {
	return fileList.map((item: any) => item.res).join(",");
}

// 获取商家列表
const { data: businessList } = useSelectData(
	getBusinessList, // 获取商家列表的 API
	{ value: "id", label: "shortName" }, // 设置 value 和 label 的字段名
	{
		pageNum: 1,
		pageSize: 100
	}
);

// 根据用户信息判断是否禁用商家名称选择框
const businessSelectDisabledStatus = computed(() => {
	if (disabled.value) {
		return disabled.value;
	}

	const { userInfo } = globalStore;
	const isBusinessAccount = userInfo?.roleId !== ADMIN && userInfo?.roleId !== ADMIN2;

	// 若商家账户填写，默认使用商家账户，且无法修改
	if (isBusinessAccount) {
		formData.value.businessId = userInfo.businessId;
		getCardList();
	}

	return isBusinessAccount; // 若角色为 ADMIN3，则禁用商家名称选择框
});

const cardList = ref([]);
const getCardList = async () => {
	const { businessId } = formData.value;
	if (!businessId) {
		return;
	}

	const res: any = await getListBySjId({ businessId });
	cardList.value = (res.data || []).map((item: any) => {
		return {
			...item,
			label: item.trueName,
			value: item.id
		};
	});
};

const handleBusinessIdChange = async () => {
	formData.value.cardId = null;
	cardList.value = [];
	getCardList();
};
</script>
<style lang="scss" scoped>
.card-body {
	width: 50%;
}
.productEdit {
	padding: 16px;
	background-color: white;
}
</style>
