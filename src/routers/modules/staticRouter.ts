import { RouteRecordRaw } from "vue-router";
import { HOME_URL, LOGIN_URL } from "@/config/config";
export const ADMIN: string = "1";
export const ADMIN2: string = "2";
export const ADMIN3: string = "3";
export const ADMIN4: string = "4";
export const ADMIN5: string = "5";
export const ADMIN6: string = "6";
export const ADMIN7: string = "7";
export const ADMIN8: string = "8";
/**
 * staticRouter(静态路由)
 */
export const staticRouter: RouteRecordRaw[] = [
	{
		path: "/",
		redirect: HOME_URL
	},
	{
		path: LOGIN_URL,
		name: "login",
		component: () => import("@/views/login/index.vue"),
		meta: {
			title: "登录"
		}
	},
	{
		path: "/layout",
		name: "layout",
		component: () => import("@/layouts/index.vue"),
		// component: () => import("@/layouts/indexAsync.vue"),
		redirect: HOME_URL,
		children: []
	}
];
export const businessRouter = [
	{
		path: "/workbench/index",
		name: "workbench",
		component: "/workbench/index",
		meta: {
			icon: "HomeFilled",
			title: "首页",
			isLink: "",
			isHide: false,
			isFull: false,
			isAffix: false,
			isKeepAlive: true
		}
	},
	{
		path: "/business",
		name: "business",
		meta: {
			icon: "Box",
			title: "商家",
			isLink: "",
			isHide: false,
			isFull: false,
			isAffix: false,
			isKeepAlive: true
		},
		children: [
			{
				path: "/business/manage",
				name: "businessManage",
				component: "/business/manage/index",
				meta: {
					icon: "Menu",
					title: "商家管理",
					permissions: [ADMIN, ADMIN2],
					isLink: "",
					isHide: false,
					isFull: false,
					isAffix: false,
					isKeepAlive: false
				}
			},
			{
				path: "/business/edit",
				name: "businessEdit",
				component: "/business/edit/index",
				meta: {
					icon: "Menu",
					title: "商家编辑",
					permissions: [ADMIN, ADMIN2],
					isLink: "",
					isHide: true,
					isFull: false,
					isAffix: false,
					isKeepAlive: false
				}
			},
			{
				path: "/business/renovation",
				name: "businessRenovation",
				component: "/business/renovation/index",
				meta: {
					icon: "Menu",
					title: "名片装修",
					isLink: "",
					isHide: false,
					isFull: false,
					isAffix: false,
					isKeepAlive: false
				}
			},
			{
				path: "/business/renovationEdit/:cardId?",
				name: "businessRenovationEdit",
				component: "/business/renovationEdit/index",
				meta: {
					icon: "Menu",
					title: "名片装修编辑",
					isLink: "",
					isHide: true,
					isFull: false,
					isAffix: false,
					isKeepAlive: false
				}
			}
		]
	},
	{
		path: "/product",
		name: "product",
		redirect: "/product/consultantManage",
		meta: {
			icon: "Box",
			title: "商品管理",

			isLink: "",
			isHide: false,
			isFull: false,
			isAffix: false,
			isKeepAlive: false
		},
		children: [
			{
				path: "/product/consultantManage",
				name: "productConsultantManage",
				component: "/product/consultantManage/index",
				meta: {
					icon: "Menu",
					title: "商家商品列表",

					isLink: "",
					isHide: false,
					isFull: false,
					isAffix: false,
					isKeepAlive: false
				}
			},
			{
				path: "/product/consultantEdit/:id?",
				name: "productConsultantEdit",
				component: "/product/consultantEdit/index",
				meta: {
					icon: "Menu",
					title: "商家商品编辑",

					isLink: "",
					isHide: true,
					isFull: false,
					isAffix: false,
					isKeepAlive: false
				}
			}
		]
	},
	{
		path: "/refund/mange",
		component: "/refund/manage/index",
		name: "refundManage",
		meta: {
			icon: "Document",
			title: "退款管理",
			permissions: [ADMIN, ADMIN2],
			isLink: "",
			isHide: false,
			isFull: false,
			isAffix: false,
			isKeepAlive: false
		},
		children: [
			{
				path: "/refund/detail",
				name: "refundDetail",
				component: "/refund/detail/index",
				meta: {
					icon: "Menu",
					title: "退款详情",
					isLink: "",
					isHide: true,
					isFull: false,
					isAffix: false,
					isKeepAlive: false
				}
			}
		]
	},
	{
		path: "/order",
		redirect: "/order/manage",
		name: "order",
		meta: {
			icon: "Document",
			title: "订单管理",
			permissions: [ADMIN, ADMIN2],
			isLink: "",
			isHide: false,
			isFull: false,
			isAffix: false,
			isKeepAlive: false
		},
		children: [
			{
				path: "/order/manage",
				name: "orderManage",
				component: "/order/manage/index",
				meta: {
					icon: "Menu",
					title: "订单列表",
					isLink: "",
					isHide: false,
					isFull: false,
					isAffix: false,
					isKeepAlive: false
				}
			},
			{
				path: "/order/detail",
				name: "orderDetail",
				component: "/order/detail/index",
				meta: {
					icon: "Menu",
					title: "订单详情",
					isLink: "",
					isHide: true,
					isFull: false,
					isAffix: false,
					isKeepAlive: false
				}
			}
		]
	},
	{
		path: "/customer/manage",
		name: "customerManage",
		component: "/customer/manage/index",
		meta: {
			icon: "User",
			title: "客户管理",
			permissions: [ADMIN, ADMIN2],
			isLink: "",
			isHide: false,
			isFull: false,
			isAffix: false,
			isKeepAlive: false
		}
	},
	{
		path: "/traffic-diversion-tool",
		name: "trafficDiversionTool",
		meta: {
			icon: "Box",
			title: "引流工具",
			isLink: "",
			isHide: false,
			isFull: false,
			isAffix: false,
			isKeepAlive: false
		},
		children: [
			{
				path: "/flyer",
				name: "flyer",
				component: "/flyer/index",
				meta: {
					icon: "Menu",
					title: "电子传单",
					isLink: "",
					isHide: false,
					isFull: false,
					isAffix: false,
					isKeepAlive: false
				}
			},
			{
				path: "/flyer/edit/:id?",
				name: "flyerEdit",
				component: "/flyer/edit/index",
				meta: {
					icon: "Menu",
					title: "电子传单编辑",
					isLink: "",
					isHide: true,
					isFull: false,
					isAffix: false,
					isKeepAlive: false
				}
			}
		]
	},
	{
		path: "/finance/manage",
		name: "financeManage",
		component: "/finance/manage/index",
		meta: {
			icon: "Money",
			title: "财务管理",
			permissions: [ADMIN, ADMIN2],
			isLink: "",
			isHide: false,
			isFull: false,
			isAffix: false,
			isKeepAlive: false
		}
	},
	// {
	// 	name: "property",
	// 	path: "/property",
	// 	meta: {
	// 		icon: "User",
	// 		title: "资产管理",
	// 		isLink: "",
	// 		isHide: false,
	// 		isFull: false,
	// 		isAffix: false,
	// 		isKeepAlive: false
	// 	},
	// 	children: [
	// 		{
	// 			path: "/property/settlementRule",
	// 			name: "propertySettlementRule",
	// 			component: "/property/settlementRule/index",
	// 			meta: {
	// 				icon: "Money",
	// 				title: "结算规则",
	// 				isLink: "",
	// 				isHide: false,
	// 				isFull: false,
	// 				isAffix: false,
	// 				isKeepAlive: false
	// 			},
	// 			children: [
	// 				{
	// 					path: "/property/settlementRule/detail/:id?",
	// 					name: "propertySettlementRuleDetail",
	// 					component: "/property/settlementRule/detail/index",
	// 					meta: {
	// 						icon: "Money",
	// 						title: "规则详情",
	// 						isLink: "",
	// 						isHide: true,
	// 						isFull: false,
	// 						isAffix: false,
	// 						isKeepAlive: false
	// 					}
	// 				}
	// 			]
	// 		},
	// 		{
	// 			path: "/property/settlementManage",
	// 			name: "propertySettlementManage",
	// 			component: "/property/settlementManage/index",
	// 			meta: {
	// 				icon: "Money",
	// 				title: "结算管理",
	// 				isLink: "",
	// 				isHide: false,
	// 				isFull: false,
	// 				isAffix: false,
	// 				isKeepAlive: false
	// 			},
	// 			children: [
	// 				{
	// 					path: "/property/settlementMange/detail/:id?",
	// 					name: "propertySettlementManageDetail",
	// 					component: "/property/settlementManage/detail/index",
	// 					meta: {
	// 						icon: "Money",
	// 						title: "管理详情",
	// 						isLink: "",
	// 						isHide: true,
	// 						isFull: false,
	// 						isAffix: false,
	// 						isKeepAlive: false
	// 					}
	// 				}
	// 			]
	// 		},
	// 		{
	// 			name: "propertyTrade",
	// 			path: "/property/trade",
	// 			component: "/property/trade/index",
	// 			meta: {
	// 				icon: "Money",
	// 				title: "交易管理",
	// 				isLink: "",
	// 				isHide: false,
	// 				isFull: false,
	// 				isAffix: false,
	// 				isKeepAlive: false
	// 			}
	// 		}
	// 	]
	// },
	{
		path: "/auth",
		name: "auth",
		redirect: "/auth/menu",
		meta: {
			icon: "Lock",
			permissions: [ADMIN, ADMIN2, ADMIN3, ADMIN7],
			title: "权限管理",
			isLink: "",
			isHide: false,
			isFull: false,
			isAffix: false,
			isKeepAlive: false
		},
		children: [
			{
				path: "/auth/user",
				name: "authUser",
				component: "/auth/user/index",
				meta: {
					icon: "Menu",
					title: "账户管理",
					isLink: "",
					isHide: false,
					isFull: false,
					isAffix: false,
					isKeepAlive: false
				},
				children: [
					{
						path: "/auth/user/edit/:id?",
						name: "authUserEdit",
						component: "/auth/user/edit/index",
						meta: {
							icon: "Menu",
							title: "账户管理",
							isLink: "",
							isHide: true,
							isFull: false,
							isAffix: false,
							isKeepAlive: false
						}
					}
				]
			}
		]
	}
];

/**
 * errorRouter(错误页面路由)
 */
export const errorRouter = [
	{
		path: "/403",
		name: "403",
		component: () => import("@/components/ErrorMessage/403.vue"),
		meta: {
			title: "403页面"
		}
	},
	{
		path: "/404",
		name: "404",
		component: () => import("@/components/ErrorMessage/404.vue"),
		meta: {
			title: "404页面"
		}
	},
	{
		path: "/500",
		name: "500",
		component: () => import("@/components/ErrorMessage/500.vue"),
		meta: {
			title: "500页面"
		}
	},
	// 解决刷新页面，路由警告
	{
		path: "/:pathMatch(.*)*",
		component: () => import("@/components/ErrorMessage/404.vue")
	}
];
export const wxRouter = [
	{
		path: "/wx",
		name: "推荐咨询",

		meta: {
			title: "推荐咨询",
			isLink: "",
			isHide: true,
			isFull: false,
			isAffix: false,
			isKeepAlive: false
		},
		children: [
			{
				path: "/wx/hotInfo",
				name: "wxHotInfo",
				component: () => import("@/views/wx/hotInfo/index.vue")
			}
		]
	}
];
