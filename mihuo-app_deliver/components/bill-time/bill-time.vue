<template>
	<view class="time_line">
		<view class="time_view">
			<view class="line_item" v-for="(itm,idx) in lineList" :key="idx">
				<view class="upper align-center">
					<view v-if="lineList.length===4" class="line" :class="idx===0?'no_line':''"
						:style="!itm.leftLine&&idx!==0?'background:#f6f6f6':''" />
					<view v-if="lineList.length===2" class="line line2" :class="idx===0?'no_line':''"
						:style="!itm.leftLine&&idx!==0?'background:#f6f6f6':''" />
						
					<image class="not" src="/static/icon/not2.png" v-if="itm.state===0" />
					<image class="already" src="/static/icon/already2.png" v-if="[1,3,5,7].indexOf(itm.state)!==-1" />
					<image class="bill_refuse" src="/static/icon/bill_refuse2.png" v-if="itm.state===2" />
					<image class="not_received" src="/static/icon/not_received2.png" v-if="[4,6].indexOf(itm.state)!==-1" />
					
					<view v-if="lineList.length===4" class="line" :class="idx===3?'no_line':''"
						:style="!itm.rightLine&&idx!==3?'background:#f6f6f6':''" />
					<view v-if="lineList.length===2" class="line line2" :class="idx===1?'no_line':''"
						:style="!itm.rightLine&&idx!==1?'background:#f6f6f6':''" />
					
				</view>
				<view class="lower" :class="[2,4,6].indexOf(itm.state)===-1?'not_text':itm.state===9?'err_text':''">
					{{itm.title}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			item:{
				type:Object,
				default:()=>({})
			},
			length:{
				type:Number,
				default:4
			}
		},
		data(){
			return{
				lineList: [
					{state:0,title:'未下单',leftLine:false,rightLine:false},//已下单，供应商未接收，未发货，未验收未初始默认值
					{state:0,title:'供应商未接收',leftLine:false,rightLine:false},
					{state:0,title:'未发货',leftLine:false,rightLine:false},
					{state:0,title:'未验收',leftLine:false,rightLine:false}
				],
			}
		},

		mounted() {
			this.supplierStatus()
		},
		methods:{
			supplierStatus(){
				if(this.length === 2){
					this.lineList = [
						{state:0,title:'未下单',leftLine:false,rightLine:false},
						{state:0,title:'供应商未接收',leftLine:false,rightLine:false}
					]
				}
				this.lineList.map((m,i) => {
					if(this.item.supplierStatus === 0){
						this.lineList[0].state = 0
						this.lineList[0].rightLine = false
						this.lineList[0].title = '未下单'
						this.lineList[1].state = 0
						this.lineList[1].title = '供应商未接收'
						this.lineList[1].leftLine = false
						this.lineList[1].rightLine = false
						if(this.length === 4){
							this.lineList[2].state = 0
							this.lineList[2].title = '未发货'
							this.lineList[2].leftLine = false
							this.lineList[2].rightLine = false
							this.lineList[3].state = 0
							this.lineList[3].title = '未验收'
							this.lineList[3].leftLine = false
						}
					}
					if(this.item.supplierStatus >= 1 && this.item.supplierStatus < 9){
						this.lineList[0].state = 1
						this.lineList[0].rightLine = false
						this.lineList[0].title = this.item.createTime.replace(' ','\n') + '下单'
						this.lineList[1].leftLine = false
						this.lineList[1].state = 4
						this.lineList[1].title = '供应商未接收'
						if(this.item.isSupplierStatus === 0){
							this.lineList[1].state = 0
						}
					}
					if(this.item.supplierStatus === 2){
						this.lineList[1].state = 2
						this.lineList[1].title = '供应商已拒绝'
					}
					if(this.item.supplierStatus === 3){
						this.lineList[0].rightLine = true
						this.lineList[1].state = 3
						this.lineList[1].leftLine = true
						this.lineList[1].rightLine = false
						this.lineList[1].title = '供应商已接收'
						this.lineList[2].state = 0
						this.lineList[2].leftLine = false
						
					}
					if(this.item.supplierStatus > 3 && this.item.supplierStatus < 7){
						this.lineList[1].state = 3
						this.lineList[1].leftLine = true
						this.lineList[1].title = '供应商已接收'
						if(this.length===4){
							this.lineList[2].leftLine = true
							this.lineList[2].state = 4
						}
					}
					if(this.item.supplierStatus === 4){
						this.lineList[1].rightLine = true
						if(this.length === 4){
							this.lineList[0].rightLine = true
							this.lineList[2].state = 4
							this.lineList[2].title = '未发货'
						}
					}else if(this.item.supplierStatus >= 5 && this.item.supplierStatus < 9){
						this.lineList[0].rightLine = true
						this.lineList[1].rightLine = true
						if(this.length === 4){
							this.lineList[2].state = 5
							this.lineList[2].leftLine = true
							this.lineList[2].rightLine = true
							this.lineList[2].title = '已发货'
							this.lineList[3].leftLine = true
						}
					}
					if(this.item.supplierStatus === 6 && this.length === 4){
						this.lineList[3].state = 6
						this.lineList[3].title = '未验收'
					}
					if(this.item.supplierStatus === 7 && this.item.isSupplierStatus === 0 && this.length === 4){
						this.lineList[0].state = 1
						this.lineList[0].rightLine = true
						this.lineList[0].title = this.item.createTime.replace(' ','\n') + '下单'
						this.lineList[1].state = 0
						this.lineList[1].title = '供应商未接收'
						this.lineList[1].leftLine = true
						this.lineList[1].rightLine = false
						this.lineList[2].state = 0
						this.lineList[2].title = '未发货'
						this.lineList[2].leftLine = false
						this.lineList[2].rightLine = false
						this.lineList[3].state = 7
						this.lineList[3].title = '已验收'
						this.lineList[3].leftLine = false
					}else if(this.item.supplierStatus === 7 && this.item.isSupplierStatus === 1 && this.length === 4){
						this.lineList[0].state = 1
						this.lineList[0].rightLine = true
						this.lineList[0].title = this.item.createTime.replace(' ','\n') + '下单'
						this.lineList[1].state = 3
						this.lineList[1].title = '供应商已接收'
						this.lineList[1].leftLine = true
						this.lineList[1].rightLine = true
						this.lineList[2].state = 5
						this.lineList[2].title = '已发货'
						this.lineList[2].leftLine = true
						this.lineList[2].rightLine = true
						this.lineList[3].state = 7
						this.lineList[3].title = '已验收'
						this.lineList[3].leftLine = true
					}
					if(this.item.supplierStatus === 7 && this.length === 2){
						this.lineList[0].state = 1
						this.lineList[0].rightLine = true
						this.lineList[0].title = this.item.createTime.replace(' ','\n') + '下单'
						this.lineList[1].state = 7
						this.lineList[1].title = '已验收'
						this.lineList[1].leftLine = true
					}
					if(this.item.supplierStatus === 9){
						this.lineList[i].state = 0
						this.lineList[i].title = ''
						if(this.length === 2){
							this.lineList[1].state = 0
							this.lineList[1].title = ''
						}
					}
					if(this.item.supplierStatus === 10){
						this.lineList[0].state = 4
						this.lineList[0].title = '已取消'
						this.lineList[0].rightLine = false
						this.lineList[1].state = 0
						this.lineList[1].title = '供应商未接收'
						this.lineList[1].leftLine = false
						if(this.length === 2){
							this.lineList[1].state = 0
							this.lineList[1].title = '供应商未接收'
						}
					}
				})
			}
		},
		watch:{
			item:{
				handler(data) {
				    this.supplierStatus()
				},
				immediate: true
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';
	.time_line{
		height: 180rpx;
		background: #FFFFFF;
		padding: 42rpx 22rpx 32rpx;
		.time_view{
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.line_item{
			.upper{
				.first_line{
					width: 38rpx;
					height: 6rpx;
					background: #fff;
				}
				.last_line{
					width: 20rpx;
					height: 6rpx;
					background: #fff;
				}
				.line{
					width: 77rpx;
					height: 6rpx;
					background: #CFF3E5;
				}
				.no_line{
					background: transparent;
				}
				.line2{
					width: 210rpx;
				}
				.not,.not_received{
					width: 36rpx;
					height: 36rpx;
				}
				.already,.bill_refuse{
					width: 48rpx;
					height: 48rpx;
				}
				
			}
			.lower{
				height: 28rpx;
				color: $seconFontColor;
				font-size: $vsmallFontSize;
				line-height: 28rpx;
				margin-top: 10rpx;
				text-align: center;
				white-space:pre;
			}
			.err_text{
				color: $errorFontColor;
			}
			.not_text{
				color: $viceFontColor;
			}
		}
	}
	.align-center{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
