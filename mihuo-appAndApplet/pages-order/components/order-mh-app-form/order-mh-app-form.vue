<template>
	<view class="app-form">
		<order-mh-app-form-item v-for="item, index in forms" :key="index" :mode="item.mode" :model="item.model" :label="item.label"
			:placeholder="item.placeholder" :maxLength="item.maxLength" :type="item.type" :textColor="item.textColor"
			:labelColor="item.labelColor" :backgroundColor="item.backgroundColor" :disabled="item.disabled"
			:defaultValue="item.defaultValue" :required="item.required" @input="onInput" :reset="reset" />
	</view>
</template>

<script>
	export default {
		name: "AppForm",
		components: {
			
		},
		props: {
			forms: {
				type: Array,
				required: true,
				default: () => {
					return [{
						mode: 'input',
						model: '',
						defaultValue: '',
						label: '输入框标签',
						placeholder: '请输入内容',
						maxLength: 9999,
						type: 'text',
						textColor: '#141414',
						labelColor: '#141414',
						backgroundColor: '#F7F7F7',
						disabled: false,
						required: true,
					}]
				}
			},
			// 组件deactivated后是否重置表单
			reset: {
				type: Boolean,
				default: true,
			},
		},
		data() {
			return {
				submitForms: {}
			};
		},
		mounted() {
			this.forms.forEach((item, index) => {
				this.submitForms[item.model] = item.defaultValue || ''
			})
		},
		methods: {
			onInput(e, model) {
				this.submitForms[model] = e
			},
			onSubmit() {
				for (let i = 0; i < this.forms.length; i++) {
					const item = this.forms[i]
					let flag = true
					if (item['required'] === undefined) {
						flag = true
					} else {
						flag = item['required']
					}
					if (flag && this.submitForms[item.model] === '') {
						this.$util.toast(`${item.label}不能为空!`)
						return
					}
				}
				this.$emit('submit', this.submitForms)
			}
		},
	}
</script>

<style lang="scss" scoped>
	.app-form {
		width: 100%;
		height: 100%;
	}
</style>
