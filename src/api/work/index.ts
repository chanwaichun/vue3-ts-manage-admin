import http from "@/api";

// 分页查询账户列表
export const getWorkPanelData = (params: any) => {
	return http.get("/white/clouds/manage/v1/work/panel/data", params, { headers: { noLoading: true } });
};
