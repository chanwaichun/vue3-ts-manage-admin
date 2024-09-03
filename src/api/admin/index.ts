import http from "@/api";

// 分页查询账户列表
export const getAdminList = (params: any) => {
	return http.post("/white/clouds/manage/v1/admin/page/list", params, { headers: { noLoading: true } });
};
// 扫码登录微信回调接口
export const wechatCallback = (params: any) => {
	return http.get("/white/clouds/manage/v1/admin/WeChat/callback", params, { headers: { noLoading: true } });
};
// 更新用户信息
export const addOrUpdateAdmin = (params: any) => {
	return http.post("/white/clouds/manage/v1/admin/addOrUpdate", params, { headers: { noLoading: true } });
};
// 删除用户
export const deleteAdmin = (params: any) => {
	return http.get("/white/clouds/manage/v1/admin/del", params, { headers: { noLoading: true } });
};
// 绑定用户
export const bindAdmin = (params: any) => {
	return http.get("/white/clouds/manage/v1/admin/band", params, { headers: { noLoading: true } });
};
// 获取用户信息
export const getAdminInfo = (params: any) => {
	return http.get("/white/clouds/manage/v1/admin/get/info", params, { headers: { noLoading: true } });
};
// 通过手机号获取信息
export const getAdminInfoMobile = (params: any) => {
	return http.get("/white/clouds/manage/v1/admin/get/info", params, { headers: { noLoading: true } });
};
// 获取微信二维码
export const getLoginQrCode = (params: any) => {
	return http.get("/white/clouds/manage/v1/admin/get/login/qrCode", params, { headers: { noLoading: true } });
};
// 获取咨询师的列表
export const getAllAdminList = (params: any) => {
	return http.get("/white/clouds/manage/v1/admin/select/business/list", params, { headers: { noLoading: true } });
};

// 获取咨询师的列表
export const handleLogin = (params: any) => {
	return http.get("/white/clouds/manage/v1/admin/account/login", params, { headers: { noLoading: true } });
};
