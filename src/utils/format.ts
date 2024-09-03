// 获取当前静态文件地址
export const getImageUrl = (path: string) => {
	const current = `/assets${path}`;
	const modules = import.meta.glob("/src/assets/**/*.{png,svg,jpg,jpeg,json}", {
		eager: true,
		import: "default"
	});
	path = current.replace(/.*?(\/assets\/)/, "/src$1");
	return modules[path];
};
/**
 * @description：格式化输入后的url
 * @param imgStr
 */
export function setFormInputImage(imgStr: any): Array<any> {
	if (!imgStr) {
		return [];
	}
	return imgStr.split(",").map((strItem: string) => {
		return {
			url: strItem.includes("http") ? strItem : setImageUrl(strItem),
			res: strItem
		};
	});
}

/**
 * @description：设置输出后的image数据
 * @param imgArr
 */
export function setFormOutputImage(imgArr: any): string {
	return imgArr.map((item: any) => item.res).join(",");
}
/**
 * @description:设置图片的路径
 * @param {String} name 图片在数据库存储的名字
 */
export function setImageUrl(name: string) {
	if (!name) {
		return getImageUrl("/common/默认头像@3x.png");
	}
	if (name.includes("/")) {
		return name;
	}
	return import.meta.env.VITE_HOST_URL + "/productUploadImg/" + name;
}

/**
 * @description:设置合同的路径
 * @param {String} name 合同在数据库存储的名字
 */
export function setProtocolUrl(name: string) {
	return import.meta.env.VITE_HOST_URL + "/protocolUploadImg/" + name;
}

export function formatSelectData(data: any, labelKey: string = "label", valueKey: string = "value") {
	return data.map((item: any) => {
		return { label: item[labelKey], value: item[valueKey] };
	});
}
export function base64toFile(base64Data: any, fileName: any) {
	const arr = base64Data.split(",");
	const mime = arr[0].match(/:(.*?);/)[1];
	const bstr = window.atob(arr[1]);
	let n = bstr.length;
	let u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new File([u8arr], fileName, { type: "image/png" });
}
