import http from "@/api";

// 导出财务报表
export const exportPayList = (params: any) => {
	return http.post("/white/clouds/manage/v1/finance/export/pay/flow", params, {
		headers: { noLoading: true },
		responseType: "blob"
	});
};
// 获取财务列表
export const getPayList = (params: any) => {
	return http.post("/white/clouds/manage/v1/finance/page/pay/flow", params, { headers: { noLoading: false } });
};
