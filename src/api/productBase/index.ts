import http from "@/api";

export function getProductList(params: any) {
	return http.post("/white/clouds/manage/v1/base/product/page/list", params, { headers: { noLoading: false } });
}

export function addOrUpdateProduct(params: any) {
	return http.post("/white/clouds/manage/v1/base/product/addOrUpdate", params, { headers: { noLoading: false } });
}

export function batchDeleteProduct(params: any) {
	return http.get("/white/clouds/manage/v1/base/product/batch/del", params, { headers: { noLoading: true } });
}

export function batchSwitchProduct(params: any) {
	return http.get("/white/clouds/manage/v1/base/product/batch/switch", params, { headers: { noLoading: true } });
}

export function uploadProductImgList(params: any) {
	return http.post("/white/clouds/manage/v1/base/product/upload/img/list", params, { headers: { noLoading: false } });
}
