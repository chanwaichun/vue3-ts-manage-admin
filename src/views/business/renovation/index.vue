<template>
	<div class="table-box">
		<el-dialog v-model="auditShow" title="审核不通过" align-center>
			<div class="auditDialog">
				<span>不通过理由：</span>
				<el-input v-model="auditReason" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" placeholder="至少五个字" />
			</div>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="auditShow = false">取消</el-button>
					<el-button type="primary" @click="handleAuditReject()">确定</el-button>
				</div>
			</template>
		</el-dialog>
		<el-dialog v-model="outsideShow" title="审核证书" width="40%">
			<el-carousel trigger="click" :autoplay="false" ref="carousel" indicator-position="outside" @change="handleChangeImage">
				<el-carousel-item v-for="item in paperList" :key="item">
					<el-image fit="contain" :style="{ height: '100%', width: '100%' }" :src="setImageUrl(item.imgUrl)"></el-image>
				</el-carousel-item>
			</el-carousel>
			<template #footer v-if="!isPreview">
				<div class="dialog-footer">
					<el-button @click="handleAuditSingle(false)">审核不通过</el-button>
					<el-button type="primary" @click="handleAuditSingle(true)">审核通过</el-button>
				</div>
			</template>
		</el-dialog>
		<ProTable ref="proTable" :columns="columns" :requestApi="getTableList">
			<template #tableHeader>
				<el-button type="primary" @click="handleUpdateStore(null, 'add')">新增</el-button>
			</template>
			<template #operation="scope">
				<el-button
					v-if="userInfo.roleId === '1' || userInfo.roleId === '2'"
					link
					type="primary"
					@click="handleUpdateStore(scope, 'examine')"
					>审核证书</el-button
				>
				<el-button link type="primary" @click="handleUpdateStore(scope, 'edit')">修改</el-button>
				<el-button link type="primary" @click="handleUpdateStore(scope, 'preview')">预览</el-button>
				<el-button type="primary" link @click="handleDelete(scope.row)">删除</el-button>
			</template>
		</ProTable>
	</div>
</template>

<script lang="tsx" name="businessRenovation" setup>
import { User } from "@/api/interface";
import { ColumnProps } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
import { getCardList, getCardPaperList, delCard } from "@/api/card/index";
import { setImageUrl } from "@/utils/format";
import { paperStatus } from "@/utils/serviceDict";
import { GlobalStore } from "@/stores";
import useHandleCheck from "@/views/business/renovation/useHandleCheck";
import { ElMessage } from "element-plus";
import { useHandleData } from "@/hooks/useHandleData";

const { userInfo } = GlobalStore();
const router = useRouter();
// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref();
const dialogShow: any = ref(false);

const {
	// 理由
	auditReason,
	// 是否预览
	isPreview,
	// 证书弹窗
	outsideShow,
	// 证书列表
	paperList,
	// 理由弹窗
	auditShow,
	handleOpenDialog,
	handleAuditSingle,
	handleAuditReject,
	handleGetPaperList,
	handleChangeImage
} = useHandleCheck(proTable);
// 表格配置项
const columns: ColumnProps<any>[] = [
	{
		prop: "id",
		label: "名片ID"
	},
	{
		prop: "shortName",
		label: "商家名称",
		search: { el: "input" }
	},
	{
		prop: "trueName",
		label: "姓名",
		search: { el: "input" }
	},
	{
		enum: paperStatus,
		prop: "paperStatus",
		label: "审核状态"
	},
	{
		prop: "createTime",
		label: "创建时间"
	},
	{
		prop: "createTime",
		label: "修改时间"
		// search: {
		// 	el: "date-picker",
		// 	props: {
		// 		type: "datetimerange",
		// 		valueFormat: "YYYY-MM-DD HH:mm:ss"
		// 	}
		// }
	},
	{ prop: "operation", label: "操作", fixed: "right", width: 180 }
];

function getTableList(params: any) {
	let newParams = JSON.parse(JSON.stringify(params));
	if (newParams.createTime && newParams.createTime.length > 0) {
		const [startTime, endTime] = newParams.createTime;
		newParams.startTime = startTime;
		newParams.endTime = endTime;
		delete newParams.createTime;
	}
	return getCardList(newParams);
}

function handleUpdateStore(scope: any, type: string): void {
	const handleMap: any = {
		add: function () {
			router.push({ path: "/business/renovationEdit" });
		},
		edit: function () {
			console.log(scope.row);
			router.push({ path: "/business/renovationEdit/" + scope.row.id });
		},
		examine: async function () {
			console.log("审核");
			// 获取证书列表
			await handleGetPaperList(scope.row.id);
			handleOpenDialog(scope.row.id, false);
		},
		preview: async function () {
			console.log("预览");
			await handleGetPaperList(scope.row.id);
			handleOpenDialog(scope.row.id, true);
		}
	};
	handleMap[type]();
	// if (type === "add") {
	// } else {
	// 	router.push({
	// 		path: "/business/edit",
	// 		query: scope.row
	// 	});
	// }
}

async function handleDelete(row: any) {
	await useHandleData(delCard, { cardId: row.id }, `删除`);
	proTable.value?.getTableList();
}
</script>
<style lang="scss" scoped>
:deep(.el-table__row) {
	.userAvatar {
		width: 100px;
		height: 100px;
	}
}
.auditDialog {
	display: flex;
	span {
		white-space: nowrap;
	}
}
</style>
