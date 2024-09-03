import http from "@/api";

export function getProductList(params: any) {
	return http.post("/white/clouds/manage/v1/business/product/page/list", params, { headers: { noLoading: false } });
}
export function getProductSelectList(params: any) {
	return http.post("/white/clouds/manage/v1/business/product/page/list", params, { headers: { noLoading: true } });
}

export function addOrUpdateProduct(params: any) {
	return http.post("/white/clouds/manage/v1/business/product/addOrUpdate", params, { headers: { noLoading: true } });
}

export function batchDeleteProduct(params: any) {
	return http.get("/white/clouds/manage/v1/business/product/batch/del", params, { headers: { noLoading: true } });
}

export function batchSwitchProduct(params: any) {
	return http.get("/white/clouds/manage/v1/business/product/batch/switch", params, { headers: { noLoading: false } });
}

export function getAllCategory(params: any) {
	return http.get("/white/clouds/manage/v1/business/product/get/all/category", params, { headers: { noLoading: false } });
}
export function getProductDetail(params: any) {
	return http.get("/white/clouds/manage/v1/business/product/get/detail", params, { headers: { noLoading: false } });
}
