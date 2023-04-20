<template>
  <view>
    <z-nav-bar bgColor="#F7F7F7" title="确认事项"></z-nav-bar>
    <view class="confirm-header">
      <myHome-mh-mihuo-tabs
        :data="tabs"
        fixed
        :subStyle="{
          width: '60rpx',
          marginTop: '20rpx'
        }"
        @click="tabsClick"
        :index="curIndex"
        bg="#F7F7F7"
      />
    </view>
    <view v-if="dataList.length">
      <view
        v-for="(item, index) in dataList"
        :key="index"
        :class="
          'confirm-main confirm-main_' +
          item.status +
          ' confirm-main_d_' +
          item.detailStatus
        "
      >
        <!-- 需确认底部操作 随频繁操作，但为适配小程序，使用v-if -->
        <view class="agenda" v-if="curIndex == 0 && item.businessCode.indexOf('disclose_')===-1">
          <myHome-mh-backlog :data="item" @click="toDealt"/>
        </view>
        <view v-if="curIndex == 1" class="disclosure">
          <view class="main-top">
            <view class="flex-row flex-row_name">
              <u-avatar
                v-if="item.userId"
                class="avatar"
                size="50"
                :src="$util.avatarImage(item.userId)"
              />
              <text class="name">{{ item.userName }}</text>
            </view>
            <view class="main-top_date" v-if="item.created">
				<!-- {{ item.created.substring(11, 16) }}</view> -->
				{{ getNoticeDate(item.created) }}</view>
          </view>
          <view class="main-center">{{ item.comment || '' }}</view>
          <!-- 交办底部操作 -->
          <view class="main-bottom" v-if="curIndex == 1">
            <view class="main-bottom_status" v-if="item.status == 0"
              >待处理</view
            >
            <view v-else>
              <view
                v-if="
                  item.bizPendingDetailList && item.bizPendingDetailList.length
                "
              >
                <view class="flex-row flex-row_name">
                  <u-avatar
                    class="avatar"
                    size="40"
                    :src="
                      $util.avatarImage(
                        item.bizPendingDetailList[
                          item.bizPendingDetailList.length - 1
                        ].handleUserId
                      )
                    "
                  />
                  <text class="name">{{
                    item.bizPendingDetailList[
                      item.bizPendingDetailList.length - 1
                    ].handlePersonName
                  }}</text>
                  <text class="skill-name">{{
                    item.bizPendingDetailList[
                      item.bizPendingDetailList.length - 1
                    ].handleSkillName
                  }}</text>
                </view>
              </view>
            </view>
            <view class="flex-row button">
              <view class="button-finish" v-if="item.status == 4">已确认</view>
              <view
                class="button-confirm"
                v-if="item.status == 2"
                @click="toDo(item, true)"
                >确认</view
              >
              <view class="button-look" @click="toDo(item, '')">查看</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <myHome-mh-empty
      v-if="dataList.length === 0"
      :title="titleEmpty[curIndex]"
    />
    <u-loadmore style="padding-top: 20rpx" v-else :status="status" />
    <bottom-button
      title="我有事要办"
      @click="addEvent"
      :styleObj="{
        background: '#FE6E32'
      }"
    ></bottom-button>

    <!-- 支付弹窗 -->
    <pay-popup
      v-model="showPopupPay"
      @callback="payConfirm"
      :money="node.amount"
    />
  </view>
</template>

<script>
	import {
		getNoticeDate
	} from '@/static/js/chat.js'
	import {
		toDoPage
	} from '@/static/js/toDo.js'
	export default {
		data() {
			return {
				tabs: [{
						name: "需要确认"
					},
					{
						name: "我交办的"
					},
				],
				businessCode: [
					{
						value:'disclose',
						name:'交底'
					},
					{
						value:'correction',
						name:'整改'
					},
					{
						value:'check',
						name:'验收'
					},
					{
						value:'payment',
						name:'付款'
					},
				],
				titleEmpty: ['暂无确认事件~~', '暂无交办事件~~'],
				curIndex: 0,
				status: 'nomore',
				pageObj: {
					current: 1,
					pageSize: 10,
					total: 3,
					pages: 0,
				},
				dataList: [],
				options: {},
				showPopupPay:false,
				node:{
					amount:0,
					nodeId:''
				},
				getNoticeDate:getNoticeDate,
				toDoPage:toDoPage
			}
		},
		components:{
			
		},
		onReachBottom() {
			if (this.dataList.length === Number(this.pageObj.total)) {
				this.status = 'nomore'
				return
			} else {
				this.status = 'loading'
				this.pageObj.pageSize += 20;
				setTimeout(() => {
					this.getListData()
				}, 200)
			}
		},
		onLoad(options) {
			this.options = options;
		},
		onShow() {
			uni.$once('tabsLocation', (data) => {
				if(data){
					this.curIndex = Number(data);
				}
			})
			this.getListData()
		},
		methods: {
			tabsClick(data, index) {
				this.curIndex = index;
				this.dataList = [];
				this.getListData()
			},
			addEvent() {
				this.toPage(`/pages-myHome/assignedEvents?addressId=${this.options.addressId}&projectId=${this.options.projectId}`)
			},
			getListData() {
				// 获取待办事项
				let url = ''
				if (this.curIndex === 0) {
					url = 'order/bizpending/getByAddressId'
				}
				// 获取交办事项
				if (this.curIndex === 1) {
					url = 'order/bizpending/releaseByAddressId'
				}
				this.$http.get(url, {
					addressId: this.options.addressId,
					size: this.pageObj.pageSize,
					isShowAll:true
				}).then(res => {
					if(res.records && res.records.length){
						res.records.map((item)=>{
							if(item.businessParams){
								item.businessParams = JSON.parse(item.businessParams)
							}
						})
					}
					if(this.pageObj.current == 1){
						this.dataList = res.records;
					} else {
						this.dataList.push(...res.records);
					}
					
					this.pageObj.total = res.total;
				})
			},
			// 待办去处理
			toDealt(node){
				const data = node.businessParams
				this.node = node;
				if (node.businessCode.startsWith('payment')) {
					// 支付收款
					this.$httpApi.getMoenyByNodeId(data.nodeId).then(response => {
						this.node.amount = response;
						// #ifdef APP-PLUS || H5
						this.showPopupPay = true
						// #endif
						// #ifdef MP-WEIXIN
						let param = {
							payType: 3,
							nodeId: this.node.nodeId,
							clientId: 'bmini',
							payAmount:this.node.amount,
						};
						this.$util.requestPay(3, param, 'nodePay',()=> {this.getListData()})
						// #endif
					})
				} else if(node.businessCode.startsWith('materialPayment')){		//材料支付
					// 解析明细id
					let mater = this.node.businessCode.split('_');
					this.node.materOredrId = mater[1];
					this.toPage(`/pages-order/payOrderDetails?id=${this.node.materOredrId}`)
				}else if (node.businessCode.startsWith('nodeReview')) {
					this.toDoPage(data)
				}else if(node.businessCode.startsWith('discloseTodo')){
					this.toPage(`/pages-myHome/giveNotice?projectId=${data.projectId}`)
				}else if(node.businessCode.startsWith('alteration')){
					let businessCodeId = this.node.businessCode.split('_')
					let resultId = businessCodeId[1]
					this.toPage(`/pages-myHome/changeRecordPage?businessCodeId=${resultId}`)
				}
			},
			toDo(data,flag) {
				let url = ''
				if(flag){
					url = `/pages-myHome/assignDetails?id=${data.id}&flag=${flag}`
				}else{
					url = `/pages-myHome/assignDetails?id=${data.id}`
				}
				this.toPage(url)
			},
			// 获取状态
			getStatusName(code){
				let name = '节点审查';
				this.businessCode.some(item=>{
					if(code.indexOf(item.value) != -1){
						name = item.name
						return name;
					}
				})
				return name;
			},
			async payConfirm(data){
				// 材料支付materialPayment
				if(this.node.businessCode.startsWith('payment')){
					if(data.payType == 4){
						// 支付宝支付
						const payRes = await this.$httpApi.payOrder({
							orderIds: [this.node.materOredrId],
							payMethod: data.payType
						})
						if (payRes.payInfo) {
							this.$util.requestPay(payType, {orderId:payRes.payInfo}, 'mallOrder')
						}
					} else {
						this.$util.requestPay(payType, {orderId: this.node.materOredrId}, 'mallOrder', () => {this.getListData()})
					}
				}else{	//施工订单支付
					let param = {
						payMethod: data.payType,
						nodeId: Number(this.node.materOredrId),
						clientId: 'bmini',
						payAmount:this.node.amount,
					};
					if (data.payType === 3) {
						this.$util.requestPay(data.payType, param, 'nodePay', ()=>{this.showPopupPay = false})
					} else {
						uni.showLoading({
							mask:true
						});
						this.$http.post('order/sopreceiptrecords/pay', param).then((res) => {
							if (res && res.payInfo) {
								this.$util.requestPay(data.payType, res.payInfo, 'workOrder', ()=>{this.showPopupPay = false})
							}
						}).finally(()=>{
							uni.hideLoading();
						})
					}
				}
			},
		}
	}
</script>
<style>
page {
  background: #f7f7f7 !important;
}
</style>
<style lang="scss" scoped>
.nav-bar {
  @include nav-bar-title(#000000);
}

.confirm-header {
  height: 110rpx;
}

.confirm-main {
  padding: 10rpx 30rpx;

  &.confirm-main_4 {
    background: #f8f8f8;
  }
  &.confirm-main_d_2 {
    background: #f8f8f8;
  }

  &:last-child {
    border: none;
  }
  .disclosure {
    background: #ffffff;
    border-radius: 20rpx;
    padding: 20rpx;
  }
  .main-top {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .main-top_title {
      font-size: 28rpx;
      color: #000000;
      margin-left: 20rpx;
    }

    .main-top_img {
      width: 60rpx;
      height: 60rpx;
      border-radius: 8rpx;
    }

    .main-top_date {
      padding-left: 10rpx;
      font-size: 24rpx;
      color: #808080;
    }
  }
  .main-center {
    padding: 20rpx 0;
    display: flex;
    align-items: center;
    font-size: 28rpx;
  }

  .main-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .main-bottom_status {
      color: #a8a8a8;
      font-size: 24rpx;
    }
  }
}
.flex-row {
  display: flex;
  align-items: center;

  &.button {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    view {
      margin-left: 20rpx;
      font-size: 24rpx;
      padding: 10rpx 20rpx;

      &:first-child {
        margin-left: 0;
      }
    }

    .button-look {
      background: #ffffff;
      color: #000000;
      border: 1.5rpx solid #000000;
      border-radius: 30rpx;
    }

    .button-finish {
      color: #fe6e32;
      padding-right: 0;
    }

    .button-handle {
      color: #919191;
      padding-right: 0;
    }

    .button-confirm {
      color: #ffffff;
      background: #000000;
      border: 1.5rpx solid #000000;
      border-radius: 30rpx;
    }
  }
}

.flex-row_name {
  text {
    margin-left: 10rpx;
    font-size: 24rpx;
  }

  .skill-name {
    font-size: 20rpx;
    font-weight: 600;
    color: #fe6e32;
    background: #fff0ea;
    padding: 5rpx 10rpx;
    border-radius: 4rpx;
  }
}

.flex-row_end {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
