<template>
	<FormContainer ref="formContainerRef" @submit="submit" isP>
		<el-form ref="formRef" :model="form" label-width="120px">
			<DynamicsFormItem :config="formItemBasic" :form="form"></DynamicsFormItem>
			<template v-for="(rulesArrItem, index) in form.rulesArr" :key="index">
				<DynamicsFormItem :config="formItemRule(index)" :form="rulesArrItem"></DynamicsFormItem>
			</template>
		</el-form>
	</FormContainer>
</template>

<script setup lang="tsx">
import FormContainer from "@/components/FormContainer/index.vue";
import { VNodeTypes } from "vue";
import DynamicsFormItem from "@/components/DynamicsFormItem/index.vue";
import type { FormItemProps } from "@/components/DynamicsFormItem/interface/index";
import { settlementType } from "@/utils/serviceDict";
const form = ref({
	rules: "",
	jiesuanzhouqi: "",
	shengxiaoshijian: "",
	rulesArr: [
		{
			key: "1",
			settlementType: "",
			laxinType: "",
			roleList: []
		},
		{
			key: "2",
			settlementType: "",
			laxinType: "",
			roleList: []
		}
	]
});
const formRef = ref();
watch(
	() => form.value.rulesArr,
	val => {
		console.log(val);
		nextTick(() => {
			formRef.value?.validateField("rulesArr");
		});
	},
	{ deep: true }
);
const formItemBasic: FormItemProps[] = [
	{
		label: "rules",
		prop: "rules",
		comName: "el-input",
		required: true,
		render: () => {
			return (
				<el-input
					vModel={form.value.rules}
					{...{
						maxlength: 10,
						placeholder: "23为23饿3232323"
					}}
				></el-input>
			);
		},
		rules: [
			{
				required: true,
				message: "22222",
				trigger: "blur"
			},
			{
				validator: (rule: any, value: any, callback: any) => {
					if (value.includes("2")) {
						callback(new Error("wwwwwwwwwww"));
					}
					callback();
				},
				trigger: "blur"
			}
		],
		comEmit: {
			focus: (e: any) => {
				console.log(e);
			}
		}
	},
	{
		label: "jiesuanzhouqi",
		prop: "jiesuanzhouqi",
		comName: "el-input"
	},
	{
		label: "shengxiaoshijian",
		prop: "shengxiaoshijian",
		comName: "el-input"
	}
];
const formItemRule = (index: any): FormItemProps[] => [
	{
		label: "settlementType",
		prop: `rulesArr[${index}].settlementType`,
		comName: "el-input",
		// required: true,
		render: (item: any) => {
			console.log(item);
			return (
				<el-radio-group vModel={form.value.rulesArr[index].settlementType}>
					{settlementType.map(item => {
						return <el-radio label={item.value}>{item.label}</el-radio>;
					})}
				</el-radio-group>
			);
		},
		rules: [
			{
				required: true,
				message: "22222",
				trigger: "blur"
			}
		]
	}
];
function submit() {
	console.log(form.value);
	formRef.value.validate();
}
</script>

<style scoped lang="scss"></style>
