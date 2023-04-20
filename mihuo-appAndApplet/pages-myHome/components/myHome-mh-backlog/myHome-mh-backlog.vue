<template>
	<view>
		<view class="wait">
			<view @click="toDealt(data,false)">
				<view class="wait-top">
					<view class="flex-row_name flex-box" >
						<u-avatar v-if="data.userId" class="avatar" size="50"
							:src="$util.avatarImage(data.userId)" />
						<text class="name">{{data.userName }}</text>
						<text class="skill-name" v-if="data.skillName">{{data.skillName }}</text>
					</view>
					<view class="wait-top_date" v-if="data.created">{{ getNoticeDate(data.created) }}</view>
				</view>
				<view class="wait-main">
					<view class="wait-flex_box">
						<text class="wait-main_disco" v-if="data.businessParams.nodeType">{{ getName(data.businessParams.nodeType)}}</text>
						<!-- 无 -->
						<view class="wait-main_title" v-if="data.businessParams.nodeType== '1000'">
							{{ data.skillName || '' }}已提交{{ data.businessParams.nodeName || ''}}，请及时确认
						</view>
						<!-- 选材 -->
						<view class="wait-main_title" v-if="data.businessParams.nodeType== '1001'">
							选材清单已提交，请及时确认
						</view>
						<!-- 派单 -->
						<view class="wait-main_title" v-if="data.businessParams.nodeType == '1002'">
							{{ data.businessParams.offerSkillName || '' }}
							[{{ data.businessParams.offerPersonName }}]已接单，请及时确认
						</view>
						<!-- 预算 -->
						<view class="wait-main_title" v-if="data.businessParams.nodeType == '1003'">
							预算清单已提交，请及时确认
						</view>
						<!-- 施工 -->
						<view class="wait-main_title" v-if="data.businessParams.nodeType == '1004'">
							{{ data.businessParams.nodeName || '' }}已完成，请及时确认
						</view>
						<!-- 验收 -->
						<view class="wait-main_title" v-if="data.businessParams.nodeType == '1005'">
							{{ data.skillName || ''}}已完成{{ data.businessParams.nodeName || '' }}验收，请及时确认
						</view>
						<!-- 上传 -->
						<view class="wait-main_title" v-if="data.businessParams.nodeType == '1006'">
							{{ data.skillName || ''}}已完成{{ data.businessParams.nodeName || '' }}资料，请及时确认
						</view>
						<!-- 评价 -->
						<view class="wait-main_title" v-if="data.businessParams.nodeType == '1009'">
							{{ data.skillName || ''}}已完成评价，请及时确认
						</view>
						<!-- 交底 -->
						<view class="wait-main_title" v-if="data.businessParams.nodeType == '1010'">
							{{ data.skillName || ''}}已提交{{ data.businessParams.nodeName || '' }}，请及时确认
						</view>
						<!-- 量房 -->
						<view class="wait-main_title" v-if="data.businessParams.nodeType == '1011'">
							{{ data.skillName || ''}}已提交{{ data.businessParams.nodeName || '' }}信息，请及时确认
						</view>
						<!-- 收款 -->
						<view class="wait-main_title" v-if="['1012','1013','1014','1015'].includes(data.businessParams.nodeType)">
							{{ data.comment || ''}}
						</view>
						<view v-if="!data.businessParams.nodeType">
							<view v-if="data.businessParams.omsOrderId" class="wait-main_title">{{ data.comment || '所需材料已申请，为避免工期延迟，请及时确认并付款'}}</view>
							<view v-else class="wait-main_title">{{ data.comment || ''}}</view>
						</view>
					</view>
					<!-- 验收 -->
					<view v-if="data.businessParams.nodeType == '1005'">
						<view class="wait-main_common">
							完工情况：已完成{{ data.businessParams.nodeName }}，均按照施工标准流程
						</view>
						<view class="wait-check">
							<text :class="'check check_'+ data.businessParams.acceptanceStatus">
								{{ data.businessParams.acceptanceStatus == "1"?"验收通过":"验收不通过"}}
							</text>
							<text class="check-pass">
								{{ data.businessParams.acceptanceQualifiedCount || 0 }}项合格
							</text>
							<text class="check-no">
								{{ data.businessParams.acceptanceUnqualifiedCount || 0 }}项不合格
							</text>
						</view>
					</view>
					<!-- 上传 -->
					<view v-if="data.businessParams.nodeType == '1006'">
						<view class="wait-main_common">
							已完成上传，请确认
						</view>
					</view>
					<!-- 交底 -->
					<view v-if="data.businessParams.nodeType == '1010'">
						<view class="wait-main_common">
							交底时间：{{ data.created }}
						</view>
						<view class="wait-main_common">
							交底内容：已完成{{ data.businessParams.nodeName }}，均按照施工标准流程
						</view>
					</view>
					<!-- 量房 -->
					<view v-if="data.businessParams.nodeType == '1011'">
						<view class="flex-box">
							<text class="wait-main_common ">空间：</text>
							<text class="wait-main_common" v-for="(item,index) in spaceName" :key="index">
								{{ item.num + item.name }}
							</text>
						</view>
					</view>
				</view>
			</view>
			<view class="wait-buttom">
				<view class="flex-box" v-if="data.businessCode.startsWith('nodeReview')">
					<view class="button-finish" v-if="data.status >0">{{ data.status=="1"?"已拒绝":"已确认"}}</view>
					<view class="button-no" v-if="data.status == 0" @click="toDo(data,1)">不确认</view>
					<view class="button-confirm" v-if="data.status == 0" @click="toDo(data,2)">确认</view>
				</view>
				<view class="flex-box" v-else-if="data.businessCode.startsWith('discloseTodo')">
					<view class="button-confirm" v-if="data.status == 0" @click="toDealt(data)">去处理</view>
					<view class="button-finish" v-if="data.status == 2">已处理</view>
				</view>
				<view class="flex-box" v-else-if="data.businessCode.startsWith('alteration')">
					<view class="button-confirm" v-if="data.status == 0" @click="toDealt(data)">去处理</view>
				</view>
				<view class="flex-box" v-else>
					<view class="button-confirm" v-if="data.status == 0" @click="toDealt(data)">去支付</view>
					<view class="button-finish" v-if="data.status == 2" @click="toDealt(data)">已支付</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
/**
 * status	审查状态 
 * 0-待审查 
 * 1-审查不通过 
 * 2-审查通过	
 * 1000=无 1001=选材 1002=派单 1003=预算 
 * 1004=施工 1005=验收 1006=上传 1009=评价 1010=交底 1011=量房 1012=收款 1013=材料申请 1014=材料管理 1015=开单
 */
import {
		getNoticeDate
	} from '@/static/js/chat.js'
	export default {
		data() {
			return {
				nodeType:[
					{
						type:1000,
						name:"无"
					},
					{
						type:1001,
						name:"选材"
					},
					{
						type:1002,
						name:"派单"
					},
					{
						type:1003,
						name:"预算"
					},
					{
						type:1004,
						name:"施工"
					},
					{
						type:1005,
						name:"验收"
					},
					{
						type:1006,
						name:"上传"
					},
					{
						type:1009,
						name:"评价"
					},
					{
						type:1010,
						name:"交底"
					},
					{
						type:1011,
						name:"量房"
					},
					{
						type:1012,
						name:"收款"
					},
					{
						type:1013,
						name:"材料申请"
					},
					{
						type:1014,
						name:"材料管理"
					},
					{
						type:1015,
						name:"开单"
					},
				],
				spaceName:[],
				spaceNameList:[
					{
						label: '卧室',
						value: '室'
					},
					{
						label: '客厅',
						value: '厅'
					},
					{
						label: '厨房',
						value: '厨'
					},
					{
						label: '卫生间',
						value: '卫'
					},
					{
						label: '阳台',
						value: '阳台'
					}
				],
				getNoticeDate:getNoticeDate
			}
		},
		props:{
			data:{
				type:Object,
				default:()=>{}
			}
		},
		mounted() {
			let roomQuery = [];
			if(this.data && this.data.businessParams){
				if(this.data.businessParams.roomInfo && this.data.businessParams.roomInfo){
					this.data.businessParams.roomInfo.map(item=>{
						roomQuery.push({
							name: item.attributeName,
							num: Number(item.attributeValue)
						})
					})
				}
			}
			roomQuery.forEach((v, i) => {
				this.spaceNameList.map(el => {
					if (v.name.includes(el.label)) {
						v.name = el.value
					}
				})
			})
			this.spaceName = this.removeDuplicatedItem(roomQuery)
		},
		methods: {
			removeDuplicatedItem(arr){
				let newArr = Array.from(arr)
				for (var i = 0; i < newArr.length - 1; i++) {
					for (var j = i + 1; j < newArr.length; j++) {
						if (newArr[i].name == newArr[j].name) {
							newArr[i].num += 1
							newArr.splice(j, 1)// 将重复元素删掉
							j--// 删掉重复元素后下一位元素向前移动一位所以j--
						}
					}
				}
				return newArr
			},
			getName(type){
				let name = ''
				this.nodeType.some((item)=>{
					if(type == item.type){
						name = item.name;
						return true;
					}
				})
				return name
			},
			toDealt(node,type){
				// node.businessParams = JSON.stringify(node.businessParams)
				this.$emit("click",node)
			},
			toDo(data,type){
				this.toPage(`/pages-myHome/commonHandleTodo?reviewId=${data.businessParams.reviewId}&status=${type}&nodeId=${data.businessParams.nodeId}`)
			},
		}
	}
</script>

<style lang="scss" scoped>
.wait{
	background: #FFFFFF;
	border-radius: 20rpx;
	padding: 20rpx 0;
	.wait-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 20rpx;
		.flex-row_name{
			text{
				margin-left: 14rpx;
			}
			.name{
				color: #000000;
				font-size: 24rpx;
				font-family: NotoSansHans-Regular;
			}
			.skill-name{
				color: #FE6E32;
				font-size: 20rpx;
				background: #FFF0EA;
				border-radius: 10rpx 0;
				padding: 2rpx 10rpx;
				font-weight: 600;
			}
		}
		.wait-top_date {
			padding-left: 10rpx;
			font-size: 24rpx;
			color: #808080;
		}
	}
	.wait-main{
		padding: 20rpx;
		.wait-flex_box{
			display: flex;
			align-items: flex-start
		}
		.wait-main_disco{
			background: #FE6E32;
			color: #FFFFFF;
			font-weight: bold;
			border-radius: 6rpx;
			font-family: HuXiaoBo-NanShen;
			font-size: 19rpx;
			padding: 5rpx 10rpx;
		}
		.wait-main_title{
			flex: 1;
			color: #000000;
			font-size: 28rpx;
			font-weight: bold;
			padding-left: 10rpx;
			// @include toe();
		}
		.wait-main_common{
			color: #808080;
			font-size: 24rpx;
			font-family: NotoSansHans-Regular;
			padding-top: 10rpx;
		}
		.wait-check{
			margin-top: 20rpx;
			text{
				font-family: PingFang-SC;
				font-size: 20rpx;
				font-weight: bold;
				margin-right: 20rpx;
			}
			.check{
				border-radius: 40rpx;
				padding: 10rpx 20rpx;
				&.check_1{
					color: #187518;
					background: #E7F1E7;
				}
				&.check_2{
					color: #ED3832;
					background: #F7E9E9;
				}
			}
			.check-pass{
				color: #187518;
			}
			.check-no{
				color: #ED3832;
			}
		}
	}
	.wait-buttom{
		border-top: 2rpx solid #F0F0F0;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding: 20rpx 20rpx 0;
		view {
			margin-left: 20rpx;
			font-size: 24rpx;
			padding: 15rpx 20rpx;
			border-radius: 60rpx;
			&:first-child {
				margin-left: 0;
			}
		}
		.button-finish {
			color: #000000;
			padding-right: 0;
		}
		.button-proceed {
			color: #FE6E32;
			padding-right: 0;
		}
		.button-confirm {
			color: #FFFFFF;
			background: #000000;
			border: 1.5rpx solid #000000;
		}
		.button-no {
			color: #000000;
			border: 1.5rpx solid #000000;
		}
	}
}
.flex-box {
	display: flex;
	align-items: center;
}
</style>
