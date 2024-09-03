import { contractMethod, contractMethodMain } from "@/utils/serviceDict";
import { getAdminCard } from "@/api/card";
import { setFormInputImage } from "@/utils/format";

export default function () {
	const route = useRoute();
	const formData: any = ref({
		adminId: "",
		adminPhoto: [],
		area: [],
		tagList: [],
		adminDesc: "",
		voiceDesc: "",
		contactList: contractMethod.map(item => {
			return { contactType: item.value, icon: "", mainStatus: false, textRemark: "" };
		}),
		textDesc: "",
		paperList: [],
		phone: ""
	});
	const formRules: any = reactive<any>({
		adminPhoto: [{ required: true, message: "请上传个人照片", trigger: "change" }],
		adminDesc: [{ required: true, message: "请输入个人介绍", trigger: "change" }],
		tagList: [
			{
				required: true,
				message: "请选择标签"
			},
			{
				validator: (rule: any, value: any, callback: any) => {
					if (value.length > 10) {
						return callback(Error("最多选择10个标签"));
					}
					return callback();
				}
			}
		],
		contactList: [
			{
				validator: (rule: any, value: any, callback: any) => {
					// debugger;
					console.log(value);
					const result = value.every((item: any) => {
						// 手机号为主要联系的时候报错
						if (item.mainStatus && item.contactType === 2 && !item.textRemark) {
							return false;
						}
						if (item.mainStatus && item.contactType !== 2 && !item.icon) {
							return false;
						}
						return true;
					});
					return result ? callback() : callback(Error("请完善联系方式"));
				},
				trigger: "change"
			}
		]
	});
	function handleInputData(data: any) {
		const params = data;
		params.adminPhoto = setFormInputImage(params.adminPhoto);
		if (params.contacts.length > 0) {
			// 根据当前字典顺序排列
			params.contactList = contractMethod.map(item => {
				const current = params.contacts.find((findItem: any) => findItem.contactType === item.value);

				return current || { contactType: item.value, icon: "", mainStatus: false, textRemark: "" };
			});
			delete params.contacts;
		} else {
			params.contactList = contractMethod.map(item => {
				return { contactType: item.value, icon: "", mainStatus: false, textRemark: "" };
			});
			delete params.contacts;
		}
		if (params.city && params.province && params.area) {
			params.area = [params.province, params.city, params.area];
		}
		if (params.tags) {
			params.tagList = params.tags.map((item: any) => item.tagId);
			delete params.tags;
		}
		if (params.papers) {
			params.paperList = params.papers;
			delete params.papers;
		}
		console.log(params);
		return params;
	}

	async function handleGetAdminCard() {
		const res = await getAdminCard({ cardId: route.params.cardId });
		console.log(res);
		formData.value = handleInputData(res.data);
	}

	onMounted(async () => {
		if (route.params.cardId) {
			await handleGetAdminCard();
		}
	});

	console.log(route);
	return {
		formData,
		formRules
	};
}
