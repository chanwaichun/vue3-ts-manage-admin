<template>
	<el-form-item v-for="(item, index) in props.config" :key="item.prop + index" v-bind="item">
		<component
			:is="item.render ? item.render : item.comName"
			v-model="props.form[item.prop]"
			v-bind="item.comProps"
			v-on="item.comEmit"
		>
		</component>
	</el-form-item>
</template>

<script setup lang="tsx">
import type { FormItemProps } from "./interface/index";
type DynamicsFormItem = {
	config: FormItemProps[];
	form: any;
};
const props = withDefaults(defineProps<DynamicsFormItem>(), {
	config: () => [],
	form: {}
});
</script>
