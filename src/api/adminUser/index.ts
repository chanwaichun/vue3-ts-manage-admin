import http from "@/api";

// 分页查询账户列表
export const getAdminUserList = (params: any) => {
	return http.post("/white/clouds/manage/v1/adminUser/page/list", params, { headers: { noLoading: true } });
};
