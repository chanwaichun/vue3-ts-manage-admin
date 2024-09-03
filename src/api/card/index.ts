import http from "@/api";

const apiUrl = "/white/clouds/manage/v1/business/card";
export function addOrUpdateCardBase(params: any) {
	return http.post(apiUrl + "/addOrUpdate/card/base", params, { headers: { noLoading: true } });
}

export function addOrUpdateCardProduct(params: any) {
	return http.post(apiUrl + "/addOrUpdate/card/product", params, { headers: { noLoading: true } });
}
// 获取咨询师名片信息
export function addOrUpdateCardShare(params: any) {
	return http.post(apiUrl + "/addOrUpdate/card/share", params, { headers: { noLoading: true } });
}
export function getAdminCardSelf(params: any) {
	return http.get(apiUrl + "/get/admin/card", params, { headers: { noLoading: true } });
}
// 获取咨询师名片信息
export function getAdminCard(params: any) {
	return http.get(apiUrl + "/get/card/info", params, { headers: { noLoading: true } });
}
export function getProductPage(params: any) {
	return http.get(apiUrl + "/get/product/page", params, { headers: { noLoading: true } });
}
export function getSharePage(params: any) {
	return http.get(apiUrl + "/get/share/page", params, { headers: { noLoading: true } });
}
export function getCardList(params: any) {
	return http.post(apiUrl + "/page/list", params, { headers: { noLoading: true } });
}
export function getCardTagList(params: any) {
	return http.post(apiUrl + "/page/tag/list", params, { headers: { noLoading: true } });
}
export function getCardTeacherList(params: any) {
	return http.get(apiUrl + "/page/teacher/list", params, { headers: { noLoading: true } });
}
export function getShareProductList(params: any) {
	return http.post(apiUrl + "/page/list/product", params, { headers: { noLoading: true } });
}
export function checkPaperAuditAll(params: any) {
	return http.get(apiUrl + "/paper/audit/all", params, { headers: { noLoading: true } });
}
export function checkPaperAuditSingle(params: any) {
	return http.get(apiUrl + "/paper/audit/single", params, { headers: { noLoading: true } });
}
export function getCardPaperList(params: any) {
	return http.get(apiUrl + "/paper/list", params, { headers: { noLoading: true } });
}

export function delCard(params: any) {
	return http.get(apiUrl + "/del", params, { headers: { noLoading: true } });
}

export function getListBySjId(params: any) {
	return http.get(apiUrl + "/list/bySjId", params, { headers: { noLoading: true } });
}
