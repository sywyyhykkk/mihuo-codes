<template>
    <div>
        <el-form
			ref="formDmo"
			class="form_d"
			:model="formData.val"
			size="small"
			>
				<el-form-item prop="bizOrderNo">
					<el-input  v-model="formData.val.bizOrderNo" :prefix-icon="Search" placeholder="订单号"></el-input>
				</el-form-item>
				<el-form-item prop="orderNo">
					<el-input  v-model="formData.val.orderNo" :prefix-icon="Search" placeholder="资金流水编号"></el-input>
				</el-form-item>
				<el-form-item prop="changeType">
					<el-select  v-model="formData.val.changeType" placeholder="类型">
						<el-option
							v-for="item in enumObj.type"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop="createBy">
					<el-select  v-model="formData.val.createBy" placeholder="操作人">
						<el-option
							v-for="item in enumObj.companyName"
							:key="item.userId"
							:label="item.employeeName"
							:value="item.userId">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop="date">
					<el-date-picker
					v-model="formData.val.date"
					type="daterange"
					@change="dateChange"
					range-separator="至"
					value-format="YYYY-MM-DD"
					start-placeholder="开始日期"
					end-placeholder="结束日期">
					</el-date-picker>
				</el-form-item>
			</el-form>
			<div class="btn">
    			<el-button type="primary" icon="Search" @click="submitForm">查询</el-button>
				<el-button :icon="RefreshLeft" @click="resetForm">重置</el-button>
			</div>
    </div>
</template>

<script lang='ts' setup>
	import { inject,nextTick,onMounted, reactive, ref} from 'vue';
	import { RefreshLeft, Search } from '@element-plus/icons-vue';
	import { fetch } from '_@/axios-config/axios'
	const formData:any = inject('formData')
	const formDmo:any = ref(null)
	const getListData:any = inject('getListData')
	const enumObj = reactive({
		type:[
			{value:0,label:"收入"},
			{value:1,label:"支出"},
		],
		companyName:[]
	}as any)
	const submitForm = () =>{
		getListData()
	}
	const resetForm = () =>{
		nextTick(()=>{
			formDmo.value.resetFields();
			formData.val = {}
			getListData()
		})
	}
	const dateChange = (date:any) =>{
		formData.val.startCreateTime = date[0];
		formData.val.endCreateTime = date[1];
	}
	onMounted(async() => {
		// 获取人员
		let res = await fetch({
			url: '/admin/companyemployee/page',
			method: 'get',
			params: {
				current: 1,
				size: 999999,
    		}
		})
		enumObj.companyName = res.data.records || []
	})
</script>

<style scoped lang="less">
.form_d{
	display: flex;
	flex-flow: row nowrap;
	.el-form-item{
		margin-bottom: 0 !important;
		margin-right: 2rem !important;
		.el-form-item__content{
			.el-input{
				width: 100%;
			}
			.el-select{
				width: calc(100%);
				.el-input__inner{
					color: #606266;
				}
			}
		}
	}
}
.btn{
	padding: 2rem 0;
}
</style>
