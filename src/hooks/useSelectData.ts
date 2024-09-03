import { onMounted } from "vue";

export default (api: any, selectOptions: any = {}, params: any = {}) => {
	const data = ref([]);
	const loading = ref(false);
	const options = { value: "value", label: "label", searchKey: "searchKey", ...selectOptions };
	function remoteMethod(query: any) {
		data.value = [];
		const current = { ...params, [options.searchKey]: query };
		getTagList(current);
	}
	async function getTagList(current: any) {
		loading.value = true;
		const res: any = await api(current);

		data.value = (params.pageNum ? res.data.records : res.data).map((item: any) => {
			return {
				...item,
				label: item[options.label],
				value: item[options.value]
			};
		});
		loading.value = false;
	}
	onMounted(async () => {
		getTagList(params);
	});

	console.log(data);
	return {
		data,
		loading,
		remoteMethod
	};
};
