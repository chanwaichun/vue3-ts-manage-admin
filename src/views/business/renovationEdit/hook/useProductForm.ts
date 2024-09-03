import { addOrUpdateCardProduct, getProductPage } from "@/api/card";
import { setFormInputImage, setFormOutputImage } from "@/utils/format";

export default function () {
	const route = useRoute();
	const cardId: any = ref(route.params.cardId || "");
	const formData: any = ref({
		id: cardId,
		posterId: "",
		posterUrl: [],
		productId: "",
		productIdList: []
	});

	function handleInputData(params: any) {
		if (params.posterUrl) {
			formData.value.posterUrl = setFormInputImage(params.posterUrl);
		}
		if (params.productId) {
			formData.value.productId = params.productId;
		}
		if (params.id) {
			formData.value.posterId = params.id;
		}
		if (params.cardProductList.length > 0) {
			formData.value.productIdList = params.cardProductList.map((item: any) => ({ ...item, id: item.productId }));
		}
		console.log(formData.value);
		// if (params.posterUrl) {
		// 	formData.value.posterUrl = setFormInputImage(params.posterUrl);
		// }
		// return params;
	}

	function handleOutput(formData: any) {
		const params: any = JSON.parse(JSON.stringify(formData));
		if (params.productIdList) {
			params.productIdList = params.productIdList.map((item: any) => item.id);
		}
		if (params.posterUrl) {
			params.posterUrl = setFormOutputImage(params.posterUrl);
		}
		return params;
	}

	async function submit() {
		try {
			const params = handleOutput(formData.value);
			console.log(params);
			const res = await addOrUpdateCardProduct(params);
		} catch (e) {
			console.error(e);
			throw 2;
		}
	}
	function updateCardId(id: any) {
		cardId.value = id;
	}
	async function handleGetCard() {
		const res = await getProductPage({ cardId: cardId.value });
		console.log(res);
		handleInputData(res.data);
		// formData.value = handleInputData(res.data);
	}

	onMounted(async () => {
		cardId && (await handleGetCard());
	});

	console.log(route);
	return {
		formData,
		cardId,
		submit,
		handleGetCard,
		updateCardId
	};
}
