import { checkPaperAuditAll, checkPaperAuditSingle, getCardPaperList } from "@/api/card";
import { ElMessage } from "element-plus";

export default function (tableRef: any) {
	const isPreview = ref(false);
	const outsideShow = ref(false);
	const auditReason = ref("");
	const auditShow: any = ref(false);
	const cardId: any = ref("");
	const paperList: any = ref([]);
	const paperIndex: any = ref(0);
	function init() {
		auditReason.value = "";
	}
	// 获取证书列表
	async function handleGetPaperList(cardId: any) {
		const res = await getCardPaperList({ cardId });
		paperList.value = res.data;
	}
	// 处理不通过审核
	async function handleAuditReject() {
		if (auditReason.value.length < 5) {
			ElMessage.error("理由至少5个字符");
			return;
		}
		const currentPaper = paperList.value[paperIndex.value];
		const params = {
			auditReason: auditReason.value,
			id: currentPaper.id,
			cardId: cardId.value,
			paperStatus: 2
		};
		console.log(params);
		const res = await checkPaperAuditSingle(params);
		auditShow.value = false;
		await handleGetPaperList(cardId.value);
		if (paperList.value.length === 0) {
			outsideShow.value = false;
		}
		await nextTick(async () => {
			tableRef.value.getTableList();
		});
	}
	// 幻灯片切换缓存当前的索引
	function handleChangeImage(index: any) {
		console.log(index);
		paperIndex.value = index;
	}
	// 打开弹窗
	function handleOpenDialog(propsCardId: any, previewStatus: any) {
		if (paperList.value.length === 0) {
			ElMessage.warning("暂无审核内容");
			return;
		}
		// 初始化
		init();
		isPreview.value = previewStatus;
		cardId.value = propsCardId;
		outsideShow.value = true;
	}
	// 处理全部审核
	async function handleAuditAll(paperStatus: any) {
		const res = await checkPaperAuditAll({
			cardId: cardId.value,
			paperStatus: !paperStatus ? 2 : 3
		});
		outsideShow.value = false;
		await nextTick(async () => {
			tableRef.value.getTableList();
		});
	}
	//
	async function handleAuditSingle(paperStatus: any) {
		if (paperStatus) {
			const currentPaper = paperList.value[paperIndex.value];
			const params = {
				id: currentPaper.id,
				cardId: cardId.value,
				paperStatus: 3
			};
			console.log(params);
			const res = await checkPaperAuditSingle(params);
			outsideShow.value = false;
			await nextTick(async () => {
				tableRef.value.getTableList();
			});
		} else {
			auditShow.value = true;
		}
	}
	return {
		auditReason,
		// 是否是预览
		isPreview,
		outsideShow,
		auditShow,
		paperList,
		handleOpenDialog,
		handleAuditAll,
		handleAuditSingle,
		handleGetPaperList,
		handleChangeImage,
		handleAuditReject
	};
}
