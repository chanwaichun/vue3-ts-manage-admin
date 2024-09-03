import { ref } from "vue";
export async function useFetchData(actionApi: Function) {
	const data = ref(null);
	const loading = ref(false);
	const res = await actionApi();
	data.value = res;
	return {
		data,
		loading
	};
}
