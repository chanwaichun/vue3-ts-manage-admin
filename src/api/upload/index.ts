import http from "@/api";

export function uploadProductImgList(params: any) {
	return http.post("/white/clouds/manage/v1/file/upload/img/list", params, { headers: { noLoading: false } });
}

export function uploadProductImg(params: any) {
	return http.post("/white/clouds/manage/v1/file/upload/img", params, { headers: { noLoading: false } });
}
