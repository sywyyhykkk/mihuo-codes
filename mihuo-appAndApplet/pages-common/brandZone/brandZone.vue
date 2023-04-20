<template>
	<view class="brand">
		<z-nav-bar backState="1000" :scrollTop="scrollTop" type="transparentFixed" bgColor="#FFFFFF">
			<view slot="default" class="nav-bar">品牌专区</view>
		</z-nav-bar>
		<view id="hot_top">
			<image
			class="brand-top_log" 
			mode="aspectFill" 
			:fade-show="false"
			:src="$util.thumbnailImage(options.banner, true)" />
			<!-- <view class="flex-box">
				<view class="hot-top_shit">
					<image
						class="img"
						src="@/pages-common/static/images/siht_max.png"
						mode="aspectFill"
					/>
					<text>觅活精选品牌</text>
				</view>
			</view> -->
			<view class="brand-main-sift padding_f">
				<view class="brand-title">精选品牌</view>
				<view class="brand-sift_content">
					<view v-for="(item,index) in siftList" :key="index" class="brand_log">
						<img-cache-temporary 
 						@click="goTOdetail('品牌',item)"
						v-if="item.logo"
						class="brand-sift_log" 
						mode="aspectFill" 
						:fade-show="false"
						:src="$util.thumbnailImage(item.logo, true)" />
					</view>
				</view>
			</view>
		</view>
		<view class="brand-main">
			<view class="padding_f" style="padding-right:40rpx">
				<view class="brand-title">品牌热门</view>
				<view class="brand-hot-list">
					<view v-for="(item,index) in hotList" :key="index">
						<view class="hot-row" v-if="item.data && item.data.length">
							<view :id="'hot_'+ item.id">
								<view class="hot"><text>{{ item.id }}</text></view>
								<view class="hot-list_item">
									<common-mh-brand-hot @goTOdetail="goTOdetail" :data="item.data"></common-mh-brand-hot>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 右边描点 -->
		<view class="brand-trace" :style="[traceStyle(scrollTop)]" v-if="listIndex && listIndex.length">
			<view 
				class="brand-trace_item"
				v-for="(item,index) in listIndex" :key="index"
				:class="{'trace-active':curIndex === index}"
				@click="tracePosition(item,index)"
				>{{ item }}</view>
		</view>
	</view>
</template>

<script>
	import {
		deepClone
	} from '@/plugins/utils.js'
	export default {
		data() {
			return {
				scrollTop:0,
				indexList:["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", 
				"R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
				hotListTree:[
					{
						sort: 1,
						id: 'A',
						data: []
					}
					, {
						sort: 2,
						id: 'B',
						data: []
					}, 
					{
						sort: 3,
						id: 'C',
						data: []
					},
					{
						sort: 4,
						id: 'D',
						data: []
					}, {
						sort: 5,
						id: 'E',
						data: []
					}, {
						sort: 6,
						id: 'F',
						data: []
					},
					{
						sort: 7,
						id: 'G',
						data: []
					}, {
						sort: 8,
						id: 'H',
						data: []
					}, {
						sort: 9,
						id: 'I',
						data: []
					},
					{
						sort: 10,
						id: 'J',
						data: []
					}, {
						sort: 11,
						id: 'K',
						data: []
					}, {
						sort: 12,
						id: 'L',
						data: []
					},
					{
						sort: 13,
						id: 'M',
						data: []
					}, {
						sort: 14,
						id: 'N',
						data: []
					}, {
						sort: 15,
						id: 'O',
						data: []
					},
					{
						sort: 16,
						id: 'P',
						data: []
					}, {
						sort: 17,
						id: 'Q',
						data: []
					}, {
						sort: 18,
						id: 'R',
						data: []
					},
					{
						sort: 19,
						id: 'S',
						data: []
					}, {
						sort: 20,
						id: 'T',
						data: []
					}, {
						sort: 21,
						id: 'U',
						data: []
					},
					{
						sort: 22,
						id: 'V',
						data: []
					}, {
						sort: 23,
						id: 'W',
						data: []
					}, {
						sort: 24,
						id: 'X',
						data: []
					},
					{
						sort: 25,
						id: 'Y',
						data: []
					}, {
						sort: 26,
						id: 'Z',
						data: []
					}
				],
				curIndex:null,
				HOT_TOP:0,
				scollChidH:[],
				options:{},
				siftList:[],
				hotList:[],
				listIndex:[],
			}
		},	
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
			this.debounce(() => {
				this.stickyPosition(e.scrollTop)
			}, 500)
		},
		onLoad(options) {
			this.options = options;
			this.getSiftList();
		},
		methods: {
			// 获取精选品牌
			getSiftList(){
				let params = {
					treeCode: this.options.treeCode || '',
					recommandStatus:1
				}
				this.$httpApi.getProductSift(params)
				.then(res=>{
					this.siftList = res;
					this.getHotList()
				})
			},
			// 获取热门品牌
			getHotList(){
				let tabH = [];
				let indexH = [];
				let params = {
					treeCode:this.options.treeCode || '',
				}
				this.$httpApi.getProductHot(params)
				.then(res=>{
					let dataList = deepClone(this.hotListTree);
					dataList.some((item)=>{
						let dataArr = res.filter((v)=> v.firstLetter.toUpperCase() == item.id) || [];
						item.data = dataArr
					})
					this.hotList = dataList;
					this.hotList.map((item)=>{
						if(item.data && item.data.length){
							indexH.push(item.id)
						}
					})
					this.listIndex = indexH;
					this.$nextTick(()=>{
						for (let index = 0; index < this.hotList.length; index++) {
							let query = uni.createSelectorQuery().select('#hot_' + this.hotList[index].id)
							query.fields({size: true},data => {
								tabH.push({
									id: this.hotList[index].id,
									scrollTop:(data && data.height) || 0
								})
							}).exec()
						}
						let query = uni.createSelectorQuery().select('#hot_top')
						query.fields({size: true},data => {
							let XHEIGHT = 10
							this.HOT_TOP = data.height
							tabH.unshift({
								id:null,
								scrollTop:data.height
							})
						}).exec();
						this.scollChidH = tabH;
					})
				})
			},
			tracePosition(data,index){
				this.curIndex = index;
				let value = this.scollChidH.findIndex((item)=> { return item.id == data})
				let height = this.scollChidH.slice(0, value)
				let scrollTop = height.reduce(function(total, value) {
					return total + value.scrollTop
				},0)
				let shiftHeight = 30
				uni.pageScrollTo({
					scrollTop: scrollTop - shiftHeight,
					duration: 300
				})
			},
			traceStyle(topScroll){
				if(topScroll>=this.HOT_TOP){
					return {
						top: '200rpx',
						position: 'fixed',
					}
				}else{
					return {
						top: this.HOT_TOP*2+ 140 + 'rpx',
						position: 'absolute',
					}
				}
			},
			stickyPosition(topScroll){
				var i = 0,
					sum = 0,
					len = this.scollChidH.length,
					shiftHeight = 30
				if (!(len > 0)) {
					return
				}
				for (i == 0; i < len; i++) {
					sum += this.scollChidH[i].scrollTop || 0;
					if ((sum - shiftHeight) >= topScroll) {
						let stickyObj =  this.scollChidH[i];
						let value  = this.listIndex.findIndex((v)=>{ return v == stickyObj.id});
						if(value != -1 ){
							this.curIndex = value;
						}
						// else{
						// 	let fristIndex = this.hotList.findIndex((v)=> v.data && v.data.length);
						// 	this.curIndex = this.hotList[fristIndex] && this.hotList[fristIndex].id;
						// }
						return
					}
				}
			},
			goTOdetail(type,v){
				let data = {
					brandId:v.id,
					treeCode:v.treeCode || ''
				}
				switch (type) {
					case "品牌":
						this.toPage(`/pages-mall/cateList/cateList?data=${JSON.stringify(data)}`);
						break;
					case "商品":
						this.toPage(`/pages-mall/productDetail/productDetail?id=${v.id}`)
						break;
					default:
						break;
				}
				
			}
		}
	}
</script>

<style lang="scss" scoped>
.brand{
	position: relative;
	.hot-top_shit{
		display: flex;
		align-items: center;
		border-radius: 30rpx;
		padding: 10rpx 16rpx;
		background: rgba(255,255,255,.4);
		position: absolute;
		left: 30rpx;
		top: 300rpx;
		.img{
			height: 20rpx;
			width: 20rpx;
			margin-right: 10rpx;
		}
		text{
			color: #000000;
			font-size: 20rpx;
			font-family: NotoSansHans-Medium;
			font-weight: bold;
		}
	}
	.brand-top_log{
		height: 400rpx;
		width: 100%;
		border-radius: 0 0 50rpx 50rpx;
	}
	.brand-title{
		color: #000000;
		font-size: 28rpx;
		font-family: NotoSansHans-Medium;
		font-weight: bold;
		padding: 40rpx 0 30rpx;
	}
	.brand-main-sift{
		.brand-sift_content{
			display: flex;
			// justify-content: space-between;
			flex-wrap: wrap;
			.brand_log{
				display: flex;
				background: #F7F7F7;
				width: 130rpx;
				height: 130rpx;
				margin-right: 9rpx;
				margin-bottom: 9rpx;
				.brand-sift_log{
					width: 100%;
					height: 100%;
				}
			}
		}
	}
	.brand-main{
		.brand-hot-list{
			.hot-row{
				padding:30rpx 0 20rpx;
				&:first-child{
					padding-top: 0;
				}
			}
			.hot{
				padding-bottom: 20rpx;
				font-weight: bold;
				text{
					font-size: 24rpx;
					color: #000000;
					font-family: NotoSansHans-Medium;
					background: #F7F7F7;
					border-radius: 4rpx;
					text-align: center;
					display: inline-block;
					padding: 9rpx;
				}
			}
			.hot-list_item{
				width: 670rpx;
			}
		}
	}
	.brand-trace{
		right: 10rpx;
		.brand-trace_item{
			font-size: 20rpx;
			color: #000000;
			// font-weight: bold;
			width: 28rpx;
			height: 28rpx;
			line-height: 28rpx;
			text-align: center;
			font-family: NotoSansHans-Medium;
			margin-bottom: 10rpx;
		}
		.trace-active{
			color: #FFFFFF;
			background: #000000;
			border-radius: 50%;
		}
	}
}
.padding_f{
	padding: 0 30rpx;
}
.flex-box{
	display: flex;
	align-items: center;
}
</style>
