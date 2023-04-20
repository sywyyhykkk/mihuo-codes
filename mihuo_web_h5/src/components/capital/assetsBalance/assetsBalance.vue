<template>
    <el-container class="main">
		<el-header>
			<header-balance></header-balance>
		</el-header>
		<el-main>
			<div class="content">
				<span>近期交易记录</span>
				<span class="content-btn" @click="look">查看资金流水</span>
			</div>
			<div class="table">
				<el-table
					ref="factory_table"
					v-loading="loading"
					stripe
					:data="tableData"
					border
					style="width:100%;height: calc(100vh - 53rem) !important;"
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
						</template></el-table-column>
					<el-table-column label="资金流水编号" align="center" prop="orderNo"></el-table-column>
					<el-table-column label="类型" align="center" prop="type">
						<template #default="scope">
							<span
							:class="'type type_'+scope.row.changeType">
							{{scope.row.changeType=='0'?'收入':'支出'}}</span>
						</template>
					</el-table-column>
					<el-table-column label="摘要" align="center" prop="summary"></el-table-column>
					<el-table-column label="金额" header-align="center" align="right" prop="amount">
						<template #default="scope">
							<span class="money-font" v-if="scope.row.amount"
							:style="scope.row.changeType=='0'?'color:#F56C6C':'color:#67C23A'"
							>{{moneyTransform(scope.row.amount)}}</span>
							<span v-else></span>
						</template>
					</el-table-column>
					<el-table-column label="余额" header-align="center" align="right" prop="balanceAmount">
						<template #default="scope">
							<span class="money-font">{{moneyTransform(scope.row.balanceAmount)}}</span>
						</template>
					</el-table-column>
					<el-table-column label="操作人" align="center" prop="createByName" width="200">
						<template #default="scope">
							<div v-if="scope.row.createByName" class="people">
								<i></i>
								<span>{{scope.row.createByName}}</span>
							</div>
							<span v-else></span>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</el-main>
    </el-container>
</template>

<script lang='ts' setup>
	import { ref, onMounted, provide, watchEffect, watch, nextTick, reactive} from 'vue';
	import { fetch } from '_@/axios-config/axios'
	import { useRouter } from 'vue-router';
	const Router = useRouter();
	// import { TableCol } from './config/TableSet'
	const tableData = ref([])
	const loading = ref<boolean>(false)
	const tableText = ref("暂无数据~")
	
	const moneyTransform = (money:any)=> {
		if (money && money != null) {
			money = Number(money)/100
			money = String(money);
			let left = money.split('.')[0],
			right = money.split('.')[1];
			right = right ? (right.length >= 2 ? '.' + right.substr(0, 2) : '.' + right + '0') : '.00';
			let temp = left.split('').reverse().join('').match(/(\d{1,3})/g);
			return (Number(money) < 0 ? '-' : '') + temp.join(',').split('').reverse().join('') + right;
		} else if (money === 0) {
			return '0.00';
		} else {
			return '';
		}
	}
	const pageObj:any=reactive({
		currentPage: 1,
		rows: 15,
		total: 0,
		pageSize: 10,
	})
	const getListData = async () =>{
		loading.value = true;
		await fetch({
			url: '/pay/tradeorder/amountchangerecord/page',
			method: 'get',
			showErrorMessage:false,
			params: {
				current: pageObj.currentPage,
				size: pageObj.pageSize,
    		}
		}).then((res: any) => {
			if(res.code == '0'){
				tableData.value = res.data.records
			}
		}).finally(()=>{
			loading.value = false;
		})
	}
	provide('getListDataL',getListData)
	const windows:any = window
	const look = () =>{
		Router.push({path:'/capital/capitalFlow'})
	}
	onMounted(()=>{
		getListData()

	})
</script>

<style scoped lang="less">
.main{
	height: calc(100vh - 110px);
	.el-header{
		padding: 20px 0;
		box-sizing: border-box;
		height: 35rem !important;
	}
	.el-main{
		.iframe{
			width: 100%;
			height: calc(100% - 1rem);
		}
		.content{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.content-btn{
				font-size: 1.2rem;
				color: #0969DA;
				padding:.8rem 1rem;
				border-radius: 1.6rem;
				border: 1px solid #0969DA;
				cursor: pointer;
				&:hover{
					background: #ECF5FF;
				}
			}
		}
		.table{
			margin-top: 2rem;
			height: calc(100% - 6rem);
			box-sizing: border-box;
		}
	}
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
.money-font{
	font-family: SimSun;
	font-size: 1.6rem;
}
</style>
