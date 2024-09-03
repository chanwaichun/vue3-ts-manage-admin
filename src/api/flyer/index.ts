import http from "@/api";

const apiUrl = "/white/clouds/manage/v1/flyer";

export function infoPageList(params: any) {
	return http.post(apiUrl + "/info/page/list", params, { headers: { noLoading: true } });
}

export function infoGetDetail(params: any) {
	return http.get(apiUrl + "/info/get/detail", params, { headers: { noLoading: true } });
}

export function infoDel(params: any) {
	return http.get(apiUrl + "/info/del", params, { headers: { noLoading: true } });
}

export function infoAddOrUpdate(params: any) {
	return http.post(apiUrl + "/info/addOrUpdate", params, { headers: { noLoading: true } });
}
