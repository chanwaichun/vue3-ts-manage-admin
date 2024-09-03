// * 系统全局字典
interface DictType {
	label: string;
	value: any;
}

/**
 * @description：用户性别
 */
export const genderType: Array<DictType> = [
	{ label: "男", value: 1 },
	{ label: "女", value: 2 }
];

/**
 * @description：用户状态
 */
export const userStatus: Array<DictType> = [
	{ label: "启用", value: 1 },
	{ label: "禁用", value: 0 }
];
/**
 * @description：角色状态
 */
export const roleId: Array<DictType> = [
	{ label: "平台管理员", value: "1" },
	{ label: "平台运营", value: "2" },
	{ label: "商家管理员", value: "3" },
	{ label: "商家导师", value: "4" },
	{ label: "商家老师", value: "5" },
	{ label: "商家推荐官", value: "6" },
	{ label: "商家助教", value: "7" },
	{ label: "合伙人", value: "8" }
];
// /**
//  * @description：商品类型状态
//  */
// export const roleId = [
// 	{ label: "管理员", value: "1" },
// 	{ label: "心理咨询师", value: "2" }
// ];
export const payStatus: Array<DictType> = [
	{ label: "取消", value: 0 },
	{ label: "待支付", value: 1 },
	{ label: "部分支付", value: 2 },
	{ label: "已支付", value: 3 },
	{ label: "已完成", value: 4 }
];
export const refundStatus: Array<DictType> = [
	{ label: "无退款", value: 0 },
	{ label: "退款中", value: 1 },
	{ label: "完成退款", value: 2 }
];
export const refundMethod: Array<DictType> = [
	{ label: "微信", value: 1 },
	{ label: "支付宝", value: 2 }
];
export const payMethods: Array<DictType> = [{ label: "微信", value: 1 }];
export const businessType: Array<DictType> = [
	{ label: "个人", value: 1 },
	{ label: "机构", value: 2 }
];
export const suitType: Array<DictType> = [
	{ label: "个人版", value: 1 },
	{ label: "小组版", value: 2 },
	{ label: "团队版", value: 3 },
	{ label: "企业版", value: 4 },
	{ label: "社群版", value: 5 },
	{ label: "合伙人版", value: 6 }
];
export const productType: Array<DictType> = [
	{ label: "课程", value: 1 },
	{ label: "服务", value: 2 },
	{ label: "商品", value: 3 }
];
export const paperType: Array<DictType> = [
	{
		label: "官方证明",
		value: 1
	},
	{
		label: "公司证明",
		value: 2
	},
	{
		label: "其他证明",
		value: 3
	}
];
export const paperName: Array<DictType> = [
	{
		label: "国家二级心理咨询师资格证书",
		value: "国家二级心理咨询师资格证书"
	},
	{
		label: "国家三级心理咨询师资格证书",
		value: "国家三级心理咨询师资格证书"
	},
	{
		label: "心理健康教育教师资格证",
		value: "心理健康教育教师资格证"
	},
	{
		label: "中国科学院心理研究所-心理咨询师证书",
		value: "中国科学院心理研究所-心理咨询师证书"
	},
	{
		label: "东流心理证明",
		value: "东流心理证明"
	},
	{
		label: "心理治疗师证书",
		value: "心理治疗师证书"
	}
];
export const paperStatus: Array<DictType> = [
	{
		label: "待审核",
		value: 1
	},
	{
		label: "不通过",
		value: 2
	},
	{
		label: "已审核",
		value: 3
	}
];

export const contractMethodMain: Array<DictType> = [
	// {
	// 	label: "抖音",
	// 	value: 1
	// },

	{
		label: "企业微信",
		value: 3
	},
	{
		label: "微信",
		value: 4
	},
	// {
	// 	label: "小红书",
	// 	value: 5
	// },
	{
		label: "手机电话",
		value: 2
	}
];
export const contractMethod: Array<DictType> = [
	{
		label: "抖音",
		value: 1
	},
	{
		label: "企业微信",
		value: 3
	},
	{
		label: "微信",
		value: 4
	},
	{
		label: "小红书",
		value: 5
	},
	{
		label: "手机电话",
		value: 2
	},
	{
		label: "微信视频号",
		value: 6
	},
	{
		label: "bilibili",
		value: 7
	}
];
export const settlementType: Array<DictType> = [
	{
		label: "拉新",
		value: 1
	},
	{
		label: "促成",
		value: 2
	},
	{
		label: "其他",
		value: 3
	}
];
