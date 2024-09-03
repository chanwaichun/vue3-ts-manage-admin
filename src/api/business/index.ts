import http from "@/api";

export function addOrUpdateBusiness(params: any) {
	return http.post("/white/clouds/manage/v1/business/addOrUpdate", params, { headers: { noLoading: true } });
}

export function getBusinessList(params: any) {
	return http.post("/white/clouds/manage/v1/business/page/list", params, { headers: { noLoading: true } });
}
