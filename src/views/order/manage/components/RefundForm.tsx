import { ref, VNode } from "vue";
import type { FormItemProps } from "@/components/DynamicsFormItem/interface";
import DynamicsFormItem from "@/components/DynamicsFormItem/index.vue";
export default function RefundForm(): VNode {
	const form = ref({
		refundType: "",
		refundAmount: ""
	});
	const refundFormEl = ref(null);
	const config: FormItemProps[] = [
		{
			label: "22222",
			prop: "refundType",
			required: true,
			rules: [
				{
					required: true,
					message: "请输入",
					trigger: ["change"]
				}
			],
			render: () => (
				<el-radio-group
					vModel={form.value.refundType}
					onChange={() => {
						console.log(refundFormEl.value);
					}}
				>
					<el-radio label={"1"}>部分</el-radio>
					<el-radio label={"2"}>全部</el-radio>
				</el-radio-group>
			)
		},
		{
			label: "222222",
			prop: "refundAmount",
			comName: "el-input-number",
			comProps: {
				controls: false,
				precision: 2
			}
		}
	];

	return (
		<el-form ref={refundFormEl} model={form.value} label-width={"120px"}>
			<DynamicsFormItem form={form.value} config={config}></DynamicsFormItem>
		</el-form>
	);
}
