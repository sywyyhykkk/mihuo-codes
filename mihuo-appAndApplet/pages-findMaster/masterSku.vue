<template>
  <view class="container">
      <u-popup 
			v-model="show" 
			mode="bottom" 
			border-radius="30" 
			height="70%"
            @close="closePopup"
            @open="getTypeWork"
			:mask="false">
			<view class="content">
					<view class="content-item">
						<view class="master">快速找师傅</view>
						<view class="order" @click="lookOrder">
							<image class="img" :src="require('@/pages-findMaster/static/icon/work_type/order.png')"/>
							<text>订单</text>
                            <text class="tips" v-show="isSign"></text>
						</view>
					</view>
					<view class="content-address" @click="selectAddress">
						<image class="map" src="@/pages-findMaster/static/icon/address.png"/>
						<text v-if="completeAddress">{{ completeAddress }}</text>
                        <text v-else>请选择房屋地址</text>
						<u-icon size="24" class="arrow-right" name="arrow-right"></u-icon>
					</view>
					<view class="info-noti">
						<view class="info-left">
							<u-icon color="#808080" name="volume-fill" size="32"></u-icon>
							<text>请选择地址和工种后进行呼叫</text>
						</view>
                        <!-- <u-notice-bar type="none" volume-size="32" font-size="26" :is-circular="true" :speed="100" :list="['请选择地址和工种后进行呼叫']"></u-notice-bar> -->
						<view class="info-right" @click="releaseOrder">
							<image :src="require('@/pages-findMaster/static/icon/work_type/list-project.png')"/>
							<text>发布详细工单</text>
							<u-icon size="22" color="#808080" name="arrow-right"></u-icon>
						</view>
					</view>
                    <scroll-view scroll-y="true" style="height:calc(100% - 340rpx)">
                        <view class="select-master">
                            <view class="select-master_content" v-for="(item,index) in workTypeList" :key="index">
                                <view class="describe" @click="lookDetail(item)">
                                    <image :src="item.img" />
                                    <view class="describe-item">
                                        <view class="describe-item_top">
                                            <view class="col1">{{ item.skillName }}</view>
                                            <view class="clo2">
                                                <text>认证工匠</text>
                                                <u-icon color="#FE6E32" size="18" name="arrow-right"></u-icon>
                                            </view>
                                        </view>
                                        <view class="describe-item_bottom">
                                            <u-icon color="#808080" size="22" name="info-circle-fill"></u-icon>
                                            <text>{{ item.label }}</text>
                                        </view>
                                    </view>
                                </view>
                                <view class="radios">
                                    <!-- 呼叫中工种 -->
                                    <view class="wait-call" v-if="item.isServe">
                                        <view class="call">呼叫中</view>
                                        <text class="ellipsis"></text>
                                        <text class="ellipsis"></text>
                                        <text class="ellipsis"></text>
                                    </view>
                                    <!-- 选择工种 -->
                                    <text v-else class="radios-item" @click="selectWorkType(item,index)" :class="{selectedColor:currentSelect===index}"></text>
                                </view>
                            </view>
                            <findMaster-mh-empty class="empty" v-if="workTypeList.length === 0 "  title="暂无呼叫工种～～" />
                        </view>
                    </scroll-view>
				<bottom-button title="呼叫师傅" :isShow="true" @click="findMaster"></bottom-button>
			</view>
		</u-popup>
        <findMaster-mh-master-worker-detail v-if="showDetail" v-model="showDetail" :data="currentData" ></findMaster-mh-master-worker-detail>
        <call-master v-if="showCall" v-model="showCall" :data="currentData" :completeAddress="completeAddress" @getTypeWork="getTypeWork"></call-master>
  </view>
</template>

<script>
import MasterWorkerDetail from './masterWorkerDetail'
import CallMaster from './callMaster.nvue'
import { masterAvatar } from "@/plugins/orderStatus"
export default {
    components:{
        MasterWorkerDetail,
        CallMaster
    },
    props:{
        value:{
            type:Boolean,
            default: false,
        },
        completeAddress:{
            type:String,
            default: '',
        },

    },
    data() {
        return {
            show:false,
            showDetail:false,
            showCall:false,
            selectMaster:'',
            currentSelect:null,
            currentData:{},
            workTypeList:[],
            serverWork:[],
            ipImage:masterAvatar,
            form:{},
            latitude: uni.getStorageSync('latitude') || 0,
			longitude: uni.getStorageSync('longitude') || 0,
            // 订单标记点是否显示
            isSign:false,
        }
    },
    watch:{
        value(val){
            this.show = val
        },
    },
    onShow() {
        if(uni.getStorageSync('roomAddress')){
            let data = JSON.parse(uni.getStorageSync('roomAddress'))
            this.form.address = (data.province ||'')+(data.city||'')+(data.region||'')
                    +(data.villageName||'')+data.address||''
        };
        
    },
    methods: {
        closePopup(){
            this.show = false;
            this.$emit('input',false)
        },
        // 查看订单
        lookOrder(){
            this.toPage('/pages-findMaster/callOrder')
        },
        // 触发选择事件
        selectWorkType(data,index){
            this.currentData = data;
            this.currentSelect = index;
            this.form.skillId = data.skillId;
        },
        // 查看详情
        lookDetail(data){
            this.currentData = data;
            this.form.skillId = data.skillId;
            this.form.skillName = data.skillName;
            this.showDetail = true;
        },
        findMaster(){
            if(!this.completeAddress){
                this.$util.toast('请选择房屋地址')
                return
            }
            if(!this.form.skillId){
                this.$util.toast('请选择呼叫师傅所属工种')
                return
            }
            this.showCall = true;
        },
        //
        selectAddress(){
            this.toPage('/pages-findMaster/selectAddress')
        },
        releaseOrder(){
            this.toPage('/pages-findMaster/issueOrder?type=add')
        },
        /**
         * 获取工种
         * @type
         * 1:岗位
         * 2:工种
         */
        getTypeWork(){
            this.$http.get('admin/sysjobskill/getPlatformJobSkill',{
                type: '',
				clientType: "platform"
            }).then(res=>{
                // this.workTypeList = res;
                res.map(item=>{
                    this.ipImage.some((v,i)=>{
                        if(item.skillName.indexOf(v.name) !=-1){
                            item.img = v.img
                        }
                    })
                })
                this.getServerWork(res);
                this.sign();
            })
        },
        // 查询服务中的工种
        getServerWork(data){
            this.$http.get('order/capp/biz_order/getOrderSkillIds')
            .then(res=>{
                if(res && res.length){
                    res.map((item)=>{
                        data.forEach(ele => {
                            if(item == ele.skillId){
                                // true:代表服务中
                                ele.isServe = true
                            }
                        })
                    })
                }
                this.workTypeList = data;
            })
        },
        //判断订单是否又标记
        sign(){
            this.$http.get('order/biz_order/self/publish',{
                current:1,
                size:1,
                latitude:this.latitude,
                longitude:this.longitude,
            }).then(res=>{
                if(res && res.records.length){
                    this.isSign = true;
                }else{
                    this.isSign = false;
                }
            })
        },
    }
}
</script>

<style scoped lang="scss">
.content{
		background:$themeBg;
		padding: 40rpx 30rpx;
		box-sizing: border-box;
		height: 100%;
        overflow: hidden;
        // height: calc(100% - 110rpx);
		.content-item{
			display: flex;
			justify-content: space-between;
			.master{
				color: #141414;
				font-size: 30rpx;
				font-weight: bold;
			}
			.order{
				display: flex;
				align-items: center;
                // margin-left: 20rpx;
                position: relative;
				text{
					font-size: 26rpx;
				}
                .img{
                    width: 24rpx;
                    height: 24rpx;
                    margin-right: 10rpx;
                }
				.tips{
                    position: absolute;
                    width: 10rpx;
                    height: 10rpx;
                    background: #FF5F00;
                    border-radius: 50%;
                    top: 0;
                    right: -10rpx;
				}
				.u-icon{
					margin-right: 10rpx;
				}
			}
		}
		.content-address{
			background: #fff;
			margin: 40rpx 0;
			height: 88rpx;
			border-radius: 24rpx;
			padding: 0 40rpx;
			display: flex;
			align-items: center;
			position: relative;
			.map{
				margin-right: 34rpx;
				height: 40rpx;
				width: 40rpx;
			}
			text{
				font-size: 26rpx;
				font-weight: bold;
			}
			.arrow-right{
				position: absolute;
				right: 0;
				padding-right: 20rpx;
			}
		}
		.info-noti{
			display: flex;
			justify-content: space-between;
			align-items: center;
            margin-bottom: 20rpx;
			.info-left{
				display: flex;
				align-items: center;
				.u-icon{
					margin-right: 20rpx;
				}
				text{
					color: #808080;
					font-size: $smallFontSize;
				}
			}
			.info-right{
				display: flex;
				align-items: center;
				image{
					width: 22rpx;
					height: 22rpx;
				}
				text{
					font-size: $smallFontSize;
					padding: 0 10rpx;
				}
			}
		}
        .empty{
            width: 100%;
            height: 50rpx;
        }
        .select-master{
            padding-top: 20rpx;
            .select-master_content{
                // height: 146rpx;
                background: #fff;
                border-radius: $mainBorderRadius;
                padding: 40rpx 40rpx 40rpx 20rpx;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20rpx;
                .describe{
                    display: flex;
                    align-items: center;
                    image{
                        width: 120rpx;
                        height: 100rpx;
                        margin-right: 30rpx;
                        flex-shrink: 0;
                        image-rendering: optimize-contrast;
                        image-rendering: -webkit-optimize-contrast;
                    }
                    .describe-item{
                        .describe-item_top{
                            display: flex;
                            align-items: center;
                            .col1{
                                color: #333333;
                                font-size: $middleFontSize;
                                font-weight: bold;
                                padding-right: 40rpx;
                            }
                            .clo2{
                                border-radius: 6rpx;
                                background: #FFF6F3;
                                padding: 0 10rpx;
                                height: 32rpx;
                                line-height: 32rpx;
                                text{
                                    color: #FE6E32;
                                    font-size: 18rpx;
                                    font-weight: bold;
                                }
                            }
                        }
                        .describe-item_bottom{
                            .u-icon{
                                padding-right: 10rpx;
                            }
                            text{
                                color: #808080;
                                font-size: 22rpx;
                                // @include bov(2);
                            }
                        }
                    }
                }
                .radios{
                    width: 120rpx;
                    flex-shrink: 0;
                    text-align: right;
                    margin-left: 20rpx;
                    .radios-item{
                        width: 40rpx;
                        height: 40rpx;
                        border-radius: 50%;
                        border: 1rpx solid #BDBDBD;
                        display: inline-block;
                    }
                    .selectedColor{
                        border: 4rpx solid #FE6E32;
                        position: relative;
                        &::before{
                            content: '✓';
                            color: #FE6E32;
                            font-size: 24rpx;
                            font-weight: bold;
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%,-50%);
                        }
                    }
                    .call{
                        color: #FE6E32;
                        font-size: 24rpx;
                        font-weight: bold;
                    }
                    .wait-call{
                        display: flex;
                        align-items: center;    
                        text{
                            width: 6rpx;
                            height: 6rpx;
                            border-radius: 50%;
                            background: #FE6E32;
                            margin-left: 5rpx;
                            -webkit-animation: bodong 2s infinite ease;
                            &:first-child {
                                -webkit-animation-delay: .2s;
                                animation-delay: .2s;
                            }

                            &:nth-child(2) {
                                -webkit-animation-delay: .3s;
                                animation-delay: .3s;
                            }

                            &:nth-child(3) {
                                -webkit-animation-delay: .4s;
                                animation-delay: .4s;
                            }
                        }
                    }
                }
            }
        }
	}
@-webkit-keyframes bodong {
    25% {
        width: 10rpx;
        height: 10rpx;
    }
    50%, 100% {
        width: 6rpx;
        height: 6rpx;
    }
    75% {
        width: 10rpx;
        height: 10rpx;
    }
}
// @-webkit-keyframes bodong {
//     25% {
//         // -webkit-transform: translateY(-4rpx);
//         transform: translateY(-4rpx)
//     }
//     50%, 100% {
//         // -webkit-transform: translateY(0);
//         transform: translateY(0)
//     }
//     75% {
//         // -webkit-transform: translateY(4rpx);
//         transform: translateY(4rpx)
//     }
// }
</style>
