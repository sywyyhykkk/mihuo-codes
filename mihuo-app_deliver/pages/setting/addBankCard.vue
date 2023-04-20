<template>
	<view class="content">
		<z-nav-bar backState="1000">
			<view slot="default" class="nav-bar">银行卡</view>
		</z-nav-bar>
		<u-gap height="4" bg-color="#f4f4f4"></u-gap>
		<view class="bank_list">
			<view class="bank_item" v-for="item in bankList" :key="item.id" @click="goUnbind(item)"
				:style="{'background':item.theme}">
				<image class="bank_icon" src="/static/icon/bank_icon.png" />
				<view class="bank_info">
					<view class="bank">
						<image class="head_image" :src="$util.thumbnailImage(item.iconUrl)" />
					</view>
					<view class="bank_name">{{item.name}}</view>
				</view>
				<view class="card_num">
					{{cardIdReplace(item.cardNo)}}
				</view>
			</view>
		</view>
		<mh-empty v-show="bankList.length === 0" icon="/static/images/no_recommend.png" title="您还没有添加银行卡～～" />
		<bottom-button title="添加银行卡" @click="goAddBankCard()" />
	</view>
</template>

<script>
	export default{
		data(){
			return{
				bankList:[],
				total: 0,
				pageCurrent: 1,
				size: 10,
				name: '农业银行'
			}
		},
		
		onShow() {
			this.pageCurrent = 1
			this.getUserBank()
		},
		
		onReachBottom() {
			if (this.bankList.length === this.total) return
			this.getUserBank()
		},
		
		methods:{
			goUnbind(item){
				uni.navigateTo({
					url:`/pages/setting/unBindBank?bankCard=${JSON.stringify(item)}`
				})
			},
			//&#8226;
			cardIdReplace(cardno) {
				let array = cardno.replace(/\s/g,'').split('');
				for (let i = 0; i < array.length - 4; i+=1) {
					if( i >= 0 && i <= array.length - 4){
					    array[i] = '.';
					}
				    if( i % 4 == 3){
				          array[i] += ' '
				    }
				}
			    let str = '';
			    str = array.join('');
			    return str;
			},
			//获取银行卡图标和主题色
			getUserBankIcon(list,temNames){
				let names = []
					names = temNames.slice(0,temNames.length-1).split(',')
				this.$httpApi.getPaymentAccountBankCardIcon(names).then(res => {
					if(res){
						list.map(item => {
							res.map(m => {
								if(item.name === m.name){
									item['iconUrl'] = m.url
									item['theme'] = m.theme
								}
							})
						})
						this.bankList = list
					}
				}).catch((err) => {
					this.bankList = list
				})
			},
			//获取银行卡
			getUserBank(){
				let list = [],temNames = '',names = '';
				this.$httpApi.getPaymentAccountBankCard().then(res => {
					if(res){
						list = res
						res.map(item => {
							temNames += item.name + ','
						})
						this.getUserBankIcon(list,temNames)
					}
				})
			},
			goAddBankCard(){
				uni.navigateTo({
					url:"/pages/user/bindCard"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';
	.content{
		height: 100vh;
		background: #FFFFFF;
	}
	.nav-bar {
		@include nav-bar-title('#333')
	}
	.bank_list{
		padding: 0 48rpx;
		overflow: auto;
		.bank_item{
			height: 244rpx;
			margin-top: 34rpx;
			background: #1A66A2;
			border-radius: $middleBorderRadius;
			position: relative;
			.bank_icon{
				width: 208rpx;
				height: 114rpx;
				position: absolute;
				right: 8rpx;
				top: 0;
			}
			.bank_info{
				padding: 50rpx 0 0 50rpx;
				display: flex;
				align-items: center;
				.bank{
					width: 80rpx;
					height: 80rpx;
					background: #FFFFFF;
					border-radius: 50%;
					display: flex;
					justify-content: center;
					align-items: center;
					.head_image{
						width: 80rpx;
						height: 80rpx;
						border-radius: 50%;
					}
				}
				.bank_name{
					margin-left: 16rpx;
					font-weight: 700;
					font-size: $mainFontSize;
					color: #FFFFFF;
				}
			}
			.card_num{
				margin-left: 154rpx;
				font-weight: 700;
				font-size: $largeTitleSize;
				color: #FFFFFF;
			}
		}
	}
</style>
