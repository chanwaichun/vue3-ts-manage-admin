import http from "@/api";

// 分页查询账户列表
export const getOrderDetail = (params: any) => {
	return http.get("/white/clouds/manage/v1/orders/detail", params, { headers: { noLoading: true } });
};
export const getOrderRefundDetail = (params: any) => {
	return http.get("/white/clouds/manage/v1/orders/get/refund/detail", params, { headers: { noLoading: true } });
};

export const getOrderList = (params: any) => {
	return http.post("/white/clouds/manage/v1/orders/page/list", params, { headers: { noLoading: true } });
};
export const getOrderRefundList = (params: any) => {
	return http.post("/white/clouds/manage/v1/orders/page/refund/list", params, { headers: { noLoading: true } });
};
export const setOrderDone = (params: any) => {
	return http.get("/white/clouds/manage/v1/orders/hand/done", params, { headers: { noLoading: true } });
};
