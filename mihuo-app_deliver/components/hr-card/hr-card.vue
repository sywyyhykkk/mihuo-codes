<template>
	<view class="card" @click="clicked">
		<view class="card-top">
			<view class="avatar">
				<u-avatar  class="img" mode="square" :src="getAvatar" size="126"></u-avatar>
				<!-- <u-lazy-load  class="item-image" height="126" :style="{ width: '126rpx' }" @click="preview()"
					imgMode="aspectFill" border-radius="10" :image="getAvatar">
				</u-lazy-load> -->
				<!-- <image v-if="person.certificateFlag === '1'" class="icon" src="/static/icon/shield.png"></image> -->
				<view class="status">
					<view class="dot" :style="{ 'background-color':  getDotColor }"></view>
					<view class="dot-text">{{ getStatus }}</view>
				</view>
			</view>
			<view class="personal-info">
				<view class="header-content">
					<view class="info">
						<view class="name">
							{{ getName }}
						</view>
						<skill-level-tag bgColor="#EFF1FF" textColor="#002FA5" style="transform: scale(0.9);"
							:title="person && person.skillName || '其他'" :level="person && person.level"></skill-level-tag>
					</view>
					<view class="price" v-if="person && person.servicePrice">
						{{person.servicePrice || '0'}}
						<view class="price-unit">
							元/{{person.priceUnit || '天'}}
						</view>
					</view>
				</view>
				<view class="des">
					{{person && person.servicePromise || '暂无个性签名'}}
				</view>
				<view class="tags" v-if="person">
					<u-tag class="tag" :text="person && person.skillYearNum" :closeable="false" color="#002FA5" bg-color="#EFF1FF"
						border-color="#EFF1FF" />
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="item-contain">
				<view class="item-text">
					累计服务
				</view>
				<view class="item-num">
					{{person && person.serviceNum || 0}}
				</view>
			</view>
			<view class="item-contain">
				<view class="item-text">
					好评率
				</view>
				<view class="item-num">
					{{getRate}}
				</view>
			</view>
			<view class="item-contain">
				<view class="item-text">
					进行中
				</view>
				<view class="item-num">
					{{person && person.serviceNum}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "hr-card",
		props: {
			person: {}
		},
		data() {
			return {};
		},
		mounted() {},
		methods: {
			clicked() {
				if(this.person){
					this.$httpApi.addPersonHistory({
						personId: this.person.personId,
					}).then(res => {
						this.$emit('clicked');
					}).catch(e => console.log(e));
				}
			},
		},
		computed: {
			getDotColor() {
				// if(this.person){}
				if(this.person){
					if (!this.person.status) return '#6CDEAE'
					switch (+this.person.status) {
						case 0:
							return '#6CDEAE'; //空闲中
						case 1:
							return '#FF5D35'; //勿打扰
						case 2:
							return '#FFCB00'; //忙碌中
						default:
							return '#6CDEAE';
					}
				}else{
					return '#6CDEAE'
				}
				
			},
			getStatus() {
				if(this.person){
					if (!this.person.status) return '空闲中'
					switch (+this.person.status) {
						case 0:
							return '空闲中';
						case 1:
							return '勿打扰';
						case 2:
							return '忙碌中';
						default:
							return '空闲中';
					}
				}else{
					'空闲中'
				}
				
			},
			getAvatar() {
				if (this.person && this.person.avatar) {
					return this.$util.avatarImage(this.person.userId) + '?time=' + new Date().getTime();
				} else {
					return '';
				}
			},
			// 24162
			getName() {
				if(this.person){
					if (!this.person.name) return '师傅'
					let lastName = this.person.name.slice(0, 1);
					const compoundSurname = ['欧阳', '太史', '端木', '上官', '司马', '东方', '独孤', '南宫', '万俟', '闻人',
						'夏侯', '诸葛', '尉迟', '公羊', '赫连', '澹台', '皇甫', '宗政', '濮阳', '公冶',
						'太叔', '申屠', '公孙', '慕容', '仲孙', '钟离', '长孙', '宇文', '城池', '司徒',
						'鲜于', '司空', '汝嫣', '闾丘', '子车', '亓官', '司寇', '巫马', '公西', '颛孙',
						'壤驷', '公良', '漆雕', '乐正', '宰父', '谷梁', '拓跋', '夹谷', '轩辕', '令狐',
						'段干', '百里', '呼延', '东郭', '南门', '羊舌', '微生', '公户', '公玉', '公仪',
						'梁丘', '公仲', '公上', '公门', '公山', '公坚', '左丘', '公伯', '西门', '公祖',
						'第五', '公乘', '贯丘', '公皙', '南荣', '东里', '东宫', '仲长', '子书', '子桑',
						'即墨', '达奚', '褚师'
					]
					if (compoundSurname.includes(this.person.name.slice(0, 2))) {
						lastName = this.person.name.slice(0, 2)
					}
					switch (this.person.jobCode) {
						case 'R_WORKER':
							return lastName + '师傅';
						case 'R_PROJECT_MANAGER':
							return lastName + '工';
						case 'R_PROJECT_SUPERVISION':
							return lastName + '工';
						case 'R_DESIGNER':
							return lastName + '工';
						case 'JOB_WORKER':
							return lastName + '师傅';
						case 'JOB_MANAGER':
							return lastName + '工';
						case 'JOB_SUPERVISION':
							return lastName + '工';
						case 'JOB_DESIGNER':
							return lastName + '工';
						default:
							return lastName + '工';
					}
				}else{
					return '未实名'
				}
			},
			// getName() {
			// 	if (!this.person.name) return '未实名'
			// 	const lastName = this.person.name.slice(0, 1);
			// 	switch (this.person.jobCode) {
			// 		case 'R_WORKER':
			// 			return lastName + '师傅';
			// 		case 'R_PROJECT_MANAGER':
			// 			return lastName + '经理';
			// 		case 'R_PROJECT_SUPERVISION':
			// 			return lastName + '监理';
			// 		case 'R_DESIGNER':
			// 			return lastName + '设计师';
			// 		case 'JOB_WORKER':
			// 			return lastName + '师傅';
			// 		case 'JOB_MANAGER':
			// 			return lastName + '经理';
			// 		case 'JOB_SUPERVISION':
			// 			return lastName + '监理';
			// 		case 'JOB_DESIGNER':
			// 			return lastName + '设计师';
			// 		default:
			// 			return lastName + '师傅';
			// 	}
			// },
			getRate() {
				if(this.person){
					if (!this.person.evaluationRate) return '0%'
					return parseFloat(this.person.evaluationRate) * 100 + '%'
				}else{
					return '0%'
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-avatar{
		border-radius: 16rpx !important;
	}

	.card {
		background-color: #fff;
		border-radius: 10rpx;
		display: flex;
		// justify-content: space-around;
		// height: 236rpx;
		// padding: 20rpx 0rpx 20rpx 0rpx;
		overflow: hidden;
		width: 710rpx;
		margin-bottom: 12rpx;
		flex-direction: column;

		.card-top {
			display: flex;
			padding: 40rpx 32rpx 0rpx 32rpx;
			align-items: center;

		}

		.avatar {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			// width: 30%;
			position: relative;

			.img {
				width: 100%;
			}

			.icon {
				width: 40rpx;
				height: 40rpx;
				position: absolute;
				bottom: 45rpx;
				right: 45rpx;
				margin-top: 25rpx;
				margin-left: 40rpx;
			}

			.status {
				width: max-content;
				text-align: center;
				position: absolute;
				white-space: nowrap;
				top: 0;
				left: 0;
				background-color: rgba(0,0,0,0.5);
				border-radius: 16rpx 0rpx;
				display: flex;
				align-items: center;
				padding-right: 5rpx;

				.dot-text {
					width: max-content;
					font-family: PingFang SC;
					font-style: normal;
					font-size: 20rpx;
					color: #fff;
					transform: scale(0.85);
				}

				.dot {
					height: 10rpx;
					width: 10rpx;
					border-radius: 50%;
					display: inline-block;
					margin: 0rpx 10rpx 0rpx 8rpx;
				}
			}
		}

		.personal-info {
			margin-left: 12rpx;
			width: 100%;

			.header-content {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.info {
					width: max-content;
					display: flex;
					justify-content: flex-start;
					align-items: center;

					.name {
						font-family: PingFang SC;
						font-style: normal;
						font-weight: bold;
						line-height: 44rpx;
						color: $fontColor33;
					}
				}

				.price {
					display: flex;
					justify-content: flex-end;
					font-size: 40rpx;
					line-height: 40rpx;
					color: $errorFontColor;
					.price-num {
						width: max-content;
						font-style: normal;
						text-align: right;
						font-weight: bold;
						font-size: 30rpx;
						font-family: PingFang SC;
						color: $errorFontColor;
					}
					.price-unit{
						color: $errorFontColor;
						font-size: 24rpx;
						transform: scale(0.85);
						transform-origin: bottom;
					}
				}
			}

			.des {
				font-family: PingFang SC;
				font-style: normal;
				font-size: 24rpx;
				line-height: 34rpx;
				color: $mainFontColor;
				@include toe();
				padding-right: 20rpx;
			}

			.tags {
				margin-top: 10rpx;

				.tag {
					font-family: PingFang SC;
					font-style: normal;
					font-size: 20rpx;
					padding: 4rpx 12rpx;
					margin-right: 9rpx;
				}
			}
		}
	}

	.footer {
		margin-top: 36rpx;
		display: flex;
		justify-content: space-between;
		padding: 0rpx 68rpx 30rpx 68rpx;

		.item-contain {
			display: flex;
			justify-content: center;
			align-items: center;
			// margin-right: 110rpx;

			&:last-child{
				margin-right:0rpx;
			}

		}

		.item-num {
			text-align: center;
			color: $seconFontColor;
			font-size: $middleFontSize;
			font-weight: bold;
			// vertical-align: bottom;
		}

		.item-text {
			text-align: center;
			font-size: 24rpx;
			color: #999999;
			margin-right: 8rpx;
			// white-space: nowrap;
		}

		.text {
			display: flex;
			font-family: PingFang SC;
			font-style: normal;
			font-size: 24rpx;
			line-height: 36rpx;
			color: $fontColor99;
		}

		.count-text {
			color: $themeColor;
			font-family: PingFang SC;
			font-style: normal;
			font-size: 24rpx;
			line-height: 36rpx;
		}
	}
</style>
