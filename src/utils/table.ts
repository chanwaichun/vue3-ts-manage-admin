import { TableColumnCtx } from "element-plus";
import { VNodeTypes } from "vue";
interface SpanMethodProps {
	row: any;
	column: TableColumnCtx<any>;
	rowIndex: number;
	columnIndex: number;
}
// 将第一行置为空的方法
export function emptyRowSpanMethod({ row, column, columnIndex, rowIndex }: SpanMethodProps, columnsLength: number) {
	// console.log(scope);
	if (rowIndex % 2 === 0) {
		return columnIndex === 0
			? {
					rowspan: 1,
					colspan: columnsLength
			  }
			: {
					rowspan: 0,
					colspan: 0
			  };
	} else {
		return {
			rowspan: 1,
			colspan: 1
		};
	}
}
export function emptyRowDataRender(vDom: VNodeTypes, fieldValue: any, rowIndex: number) {
	if (rowIndex % 2 === 0) {
		return vDom;
	}
	return fieldValue;
}
export function emptyRowDataFormat(data: []): [] {
	return data.reduce((prev: any, current: any) => {
		return prev.concat([current, current]);
	}, []);
}
