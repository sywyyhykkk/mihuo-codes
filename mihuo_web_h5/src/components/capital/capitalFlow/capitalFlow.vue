<template>
	<el-container class="container">
		<el-header>
			<formSearch id="form-search"></formSearch>
		</el-header>
		<el-main>
			<el-table
				ref="factory_table"
				v-loading="loading"
				stripe
				:data="tableData"
				border
				style="width:100%;height:calc(100vh - 40rem) !important"
				height="0"
				>
				<template v-slot:empty >
					<img src="@/assets/img/no_content.png" alt="" srcset="">
					<p :class="{'el-table-empty-p':tableText}">{{tableText}}</p>
				</template>
				<el-table-column
					type="index"
					width="50"
					align="center"
					label="序号"
				/>
				<el-table-column label="订单号/时间" align="center">
					<template #default="scope">
						<div>{{scope.row.bizOrderNo}}</div>
						<div>{{scope.row.createTime}}</div>
					</template>
				</el-table-column>
				<el-table-column label="资金流水编号" align="center" prop="orderNo"></el-table-column>
				<el-table-column label="类型" align="center" prop="changeType">
					<template #default="scope">
						<span
						:class="'type type_'+scope.row.changeType">
						{{scope.row.changeType=='0'?'收入':scope.row.changeType=='1'?'支出':''}}</span>
					</template>
				</el-table-column>
				<el-table-column label="摘要" align="center" prop="summary"></el-table-column>
				<el-table-column label="金额" header-align="center" align="right" prop="amount" :formatter="forMatter_">
					<template #default="scope">
						<div :class="'money-font num-money num-money-'+scope.row.changeType">
							<span>{{moneyTransform(scope.row.amount)}}</span>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="余额" header-align="center" align="right" prop="balanceAmount" >
					<template #default="scope">
						<span class="money-font">{{moneyTransform(scope.row.balanceAmount)}}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作人" align="center" prop="createByName" width="150">
					<template #default="scope">
						<div
						v-if="scope.row.createByName"
						class="people">
							<i></i><span>{{scope.row.createByName}}</span></div>
						<span v-else></span>
					</template>
				</el-table-column>
			</el-table>
			<div class="table-footer">
				<tr>
					<td></td>
					<td><div class="title">当前页合计</div></td>
					<td></td>
					<td></td>
					<td></td>
					<td>
						<div class="total">
							<el-popover
							 placement="top"
							 effect="dark"
							 popper-class="popper-item"
							 trigger="hover">
								<template #reference>
									<el-icon><question-filled /></el-icon>
								</template>
									<p>收入:
										<span style="margin-left:1rem;color:#F56C6C;font-family: SimSun;
										font-size: 1.6rem">{{getSummaries(true)}}</span>
									</p>
									<p>支出:
										<span style="margin-left:1rem;color:#67C23A;font-family: SimSun;
										font-size: 1.6rem">{{getSummaries(false)}}</span>
									</p>
							</el-popover>
							<span>{{getSummaries()}}</span>
						</div>
					</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td></td>
					<td><div class="title">和总计</div></td>
					<td></td>
					<td></td>
					<td></td>
					<td>
						<div class="total">
							<el-popover
							 placement="top"
							 effect="dark"
							 popper-class="popper-item"
							 trigger="hover">
								<template #reference>
									<el-icon><question-filled /></el-icon>
								</template>
									<p >收入:
										<span style="margin-left:1rem;color:#F56C6C;font-family: SimSun;
										font-size: 1.6rem">{{moneyTransform(total.val.incomeAmount)}}</span>
									</p>
									<p >支出:
										<span style="margin-left:1rem;color:#67C23A;font-family: SimSun;
										font-size: 1.6rem">{{moneyTransform(total.val.payAmount)}}</span>
									</p>
							</el-popover>
							<span>{{moneyTransform(total.val.total)}}</span>
						</div>
					</td>
					<td></td>
					<td></td>
				</tr>
			</div>
		</el-main>
		<el-footer>
			<el-pagination-new
			:current-page="pageObj.currentPage"
			:page-size="pageObj.pageSize"
			:total="pageObj.total"
			layout="total, prev, pager, next, jumper"
			@current-change="handleCurrentChange"
			/>
		</el-footer>
    </el-container>
</template>

<script lang="ts" setup>
	import { ref, reactive, provide, onMounted} from 'vue';
	import { PageObj } from './PageObj'
	import { fetch } from '_@/axios-config/axios'
	import { ElMessage } from 'element-plus';
	// import formSearch from './formSearch.vue'
	const formDmo:any = ref(null)
	const loading = ref<boolean>(false)
	const tableData:any = ref([])
	const tableText:any = ref('暂无数据~')
	const formData = reactive({
		val:{}
	} as any)
	provide("formData",formData)
	//分页
	const pageObj:PageObj=reactive({
		currentPage: 1,
		rows: 15,
		total: 0,
		pageSize: 20,
	})
	const total = reactive({
		val:{}
	}as any)
	const handleCurrentChange = (val: number) => {
		pageObj.currentPage = val
		getListData()
	}
	const getListData = async () =>{
		loading.value = true;
		await fetch({
			url: '/pay/tradeorder/amountchangerecord/page',
			method: 'get',
			params: {
				current: pageObj.currentPage,
				size: pageObj.pageSize,
				...formData.val
    		}
		}).then((res: any) => {
			if(res.code == '0'){
				tableData.value = res.data.records
				pageObj.total = res.data.total
			}
		}).finally(()=>{
			loading.value = false;
		})
	}
	provide('getListData',getListData)
	const getTotal = async () =>{
		await fetch({
			url: '/pay/tradeorder/amountchangerecord/total',
			method: 'get',
			params: {
				...formData.val
    		}
		}).then((res: any) => {
			if(res.code == '0'){
				total.val = res.data;
				total.val.total = Number(total.val.incomeAmount) + Number(total.val.payAmount)
			}
		})
	}
	const moneyTransform = (money:any)=> {
		if (money && money != null) {
			money = Number(money)/100;
			money = String(money);
			let left = money.split('.')[0],
			right = money.split('.')[1];
			right = right ? (right.length >= 2 ? '.' + right.substr(0, 2) : '.' + right + '0') : '.00';
			let temp = left.split('').reverse().join('').match(/(\d{1,3})/g);
			return (Number(money) < 0 ? '-' : '') + temp.join(',').split('').reverse().join('') + right;
		} else if (money === 0) {
			return '0.00';
		} else {
			return '0.00';
		}
	}
	const getSummaries = (type:any) => {
		let nums = 0;
        let values = tableData.value.map((item:any) => Number(item.amount));
		// 代表收入
		if(type == true){
			values = values.filter((item:number)=>{
                return item > 0
            })
		}else if(type == false){
			values = values.filter((item:number)=>{
                return item < 0
            })
		}
		nums = values.reduce((prev:any, curr:any) => {
			let value = Number(curr);
			if (!isNaN(value)) {
				return prev + value;
			} else {
				return prev;
			}
		}, 0);
		return moneyTransform(nums);
    }
	let document_ = document as any
	const onResize = () =>{
		let searcH:any = document_.querySelector("#form-search").offsetHeight
		let tableH:any = document_.querySelector(".el-table")
		tableH.style.height = `calc(100vh - 50rem) !important`
	}
	onMounted(()=>{
		//监听窗口变化
        // window.addEventListener('resize',(e)=>{
        //     onResize()
        // });
		getListData()
		getTotal()
		getSummaries(null);
	})
</script>

<style scoped lang="less">
.container{
	height: calc(100vh - 11rem);
}
:deep(.el-scrollbar__view){
	height: 100%;
}
.el-table__empty-text{
	img{
		height: 15rem;
	}
	.el-table-empty-p{
		color: #C0C4CC;
	}
}
.type{
	padding: 0.8rem;
	border-radius: .4rem;
	&.type_0{
		border: 1px solid #FEF0F0;
		color: #F56C6C ;
		background: #FDE2E2;
	}
	&.type_1{
		border: 1px solid #F0F9EB;
		color: #67C23A ;
		background: #E1F3D8;
	}
}
.num-money{
	color:#67C23A;
	&.num-money-0{
		color:#F56C6C;
	}
}
.people{
	display: inline-block;
	background: #ECF5FF;
	border-radius: 1.1rem;
	height: 2.2rem;
	line-height: 2.2rem;
	padding-right:1rem;
	padding-left: .5rem;
	display: inline-flex;
	align-items: center;
	i{
		display: inline-block;
		width: 1.8rem;
		height: 1.8rem;
		background: #0969DA;
		border-radius: 50%;
		margin-right: .5rem;
	}
}
.table-footer{
	width: calc(100% - .3rem);
	tr{
		width: 100%;
		display: flex;
		border: 1px solid #EBEEF5;
		border-top: transparent;
		background: #F5F7FA;
		td{
			height: 4.9rem;
			line-height: 4.9rem;
			text-align: center;
			border-right: 1px solid #EBEEF5;
			font-size: 1.2rem;
			width: calc((100% - 20.3rem) / 6);
			.title{
				text-align: center;
			}
			.total{
				font-size: 1.6rem;
				font-family: SimSun;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			div{
				padding: 0 1rem;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				.el-icon{
					margin-right: .5rem;
				}
			}
			&:first-child{
				width: 5.6rem !important;
			}
			&:last-child{
				border-right:transparent;
				width: 17rem;
			}
		}
	}
}
.popper-item{
	width: auto !important;
	p{
		font-size: 1.4rem;
		span{
			font-family: MicrosoftYaHei;
			&:last-child{
				font-size: 1.2rem;
			}
		}
	}
}
</style>
