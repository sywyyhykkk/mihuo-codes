<template>
	<view class="container" @tap="togglePicker(0)">
		<!--内容-->
		<view class="actionContent">
			<u-row :gutter="isSenderUser?1:2" item="center" justify="center">
				<u-col :span="isSenderUser?3:4" @click="exchangePhone">
					<view style="text-align: center;">
						<view class="imageContent">
							<image width="56rpx" height="56rpx" class="icon" src='/static/images/im-take-phone.png' />
						</view>
						<view>
							<text class="text">拨打电话</text>
						</view>
					</view>
				</u-col>
				<u-col :span="isSenderUser?3:4" @click="setUninterrested">
					<view style="text-align: center;">
						<view class="imageContent">
							<image width="56rpx" height="56rpx" class="icon" src='/static/images/im-uninterested.png' />
						</view>
						<view>
							<text class="text">不感兴趣</text>
						</view>
					</view>
				</u-col>
				<u-col :span="isSenderUser?3:4" @click="resolveFriend(2)" v-if="isSenderUser">
					<view style="text-align: center;">
						<view class="imageContent">
							<image width="56rpx" height="56rpx" class="icon" src='/static/images/im-edit-order.png' />
						</view>
						<view>
							<text class="text">修改订单</text>
						</view>
					</view>
				</u-col>
				<u-col :span="isSenderUser?3:4" @click="orderConfirm()">
					<view style="text-align: center;">
						<view class="imageContent">
							<image width="56rpx" height="56rpx" class="icon"
								src='/static/images/im-order-comfirm.png' />
						</view>
						<view>
							<text class="text">订单确认</text>
						</view>
					</view>
				</u-col>
			</u-row>
		</view>
		<view class="scroll" :style="{ height: scrollHeight }">
			<scroll-view scroll-anchoring upper-threshold="5" @scrolltoupper="scrpllTop"
				:scroll-into-view="scrollViewId" :scroll-y="isScroll" style="height: 100%">
				<view class="item-space"></view>
				<view v-for="(item, index) in $store.state.groupList" :key="item.KeyID">
					<view class="imdate" v-if="getDiffDate($store.state.groupList,item,index)">
						{{getDate(item.CreateTime)}}
					</view>
					<!--撤销-->
					<view v-if="item.Type == xsoftmsdk.enums.ContentType.ReCall" class="cancel">
						<text v-if="item.SourceId != $store.state.imUserInfo.imId"
							class="text">{{getImName(item)}}撤回了一条消息</text>
						<text v-else class="text">你撤回了一条消息</text>
					</view>
					<view v-else class="item flex-row"
						:class="[item.SourceId != $store.state.imUserInfo.imId ?'left': 'right']">
						<!--处理头像-->
						<view>
							<im-avatar :imId="item.SourceId" class="face" />
						</view>
						<!--消息操作-->
						<view class="message-action top" v-if="chooseId==item.KeyID">
							<span @click="copyText(item)" class="item-action"
								v-if="item.Type == xsoftmsdk.enums.ContentType.Text">复制</span>
							<!-- <span class="item-action">转发</span> -->
							<span @click="withdraw(item)" class="item-action"
								v-if="item.SourceId == $store.state.imUserInfo.imId && withdrawWhere(item)">
								撤回
							</span>
						</view>
						<!--消息内容-->
						<view>
							<view class="username" v-if="item.SourceId != $store.state.imUserInfo.imId">
								{{getImName(item)}}
							</view>
							<view class="messageItem" @longtap="messageLongPress(item)">
								<!--文本-->
								<view v-if="item.Type == xsoftmsdk.enums.ContentType.Text" @longpress="longPress(item)"
									class="content">
									{{item.Content}}
								</view>
								<!--图片-->
								<view v-if="item.Type == xsoftmsdk.enums.ContentType.Image">
									<view style="position: relative;">
										<view style="position: relative">
											<image @click="preview(item)" v-if="!item.Id || !item.FileId"
												mode="heightFix" style="max-height: 300rpx;" :src="item.Content" />
											<img-cache @click="preview(item)" v-else mode="heightFix"
												style="max-height: 300rpx;"
												:indexed="$util.getImFiles(item.FileId,true,false)"
												:src="$util.getImFiles(item.FileId,true)" />
										</view>
									</view>
								</view>
								<!--地图-->
								<view
									v-if="item.Type == xsoftmsdk.enums.ContentType.Custom && getJSON(item.CustomContent).contentType==12"
									class="content map" @tap="openLocation(getJSON(item.CustomContent))">
									<view class="title">{{ getJSON(item.CustomContent).name }}</view>
									<view class="subtitle">{{ getJSON(item.CustomContent).address }}</view>
									<image mode="aspectFill" class="box" src="/static/images/address_icon.png"></image>
									<!-- <map class="box" :latitude="getJSON(item.CustomContent).latitude" :longitude="getJSON(item.CustomContent).longitude"
										:markers="[{latitude: getJSON(item.CustomContent).latitude, longitude: getJSON(item.CustomContent).longitude, iconPath: '/static/images/icon-address/address-5.png'}]"
										@tap="openLocation(getJSON(item.CustomContent))"></map> -->
								</view>
								<!--我的语音-->
								<view v-if="item.Type == xsoftmsdk.enums.ContentType.Voice && item.SourceId != toUserId" @tap="playVoice(item)"
									class="content">
									<text class="duration">
										{{ getJSON(item.CustomContent).Duration + "''" }}
									</text>
									<image v-show="voicePlayingId != item.CustomContent"
										src="../../../static/images/audio-play_white.png" class="voice-icon">
									</image>
									<image v-show="voicePlayingId == item.CustomContent"
										src="../../../static/images/audio-play_white.gif" class="voice-icon">
									</image>
								</view>
								<!--别人发出来的语音-->
								<view v-if="item.Type == xsoftmsdk.enums.ContentType.Voice && item.SourceId == toUserId" @tap="playVoice(item)"
									class="content">
									<text class="duration">
										{{ getJSON(item.CustomContent).Duration + "''" }}
									</text>
									<image v-show="voicePlayingId != item.CustomContent"
										src="../../../static/images/audio.png" class="voice-icon">
									</image>
									<image v-show="voicePlayingId == item.CustomContent"
										src="../../../static/images/audio-play.gif" class="voice-icon">
									</image>
								</view>
								<!--链接-->
								<view v-if="item.Type == xsoftmsdk.enums.ContentType.Link">
									<!-- 如果数据里有orderSn字段,说明是材料订单, 负责是普通订单 -->
									<im-material-billorder-item v-if="getJSON(item.CustomContent).orderSn"
										:key="getJSON(item.CustomContent).GuidMini"
										:orderDetail="getJSON(item.CustomContent)" />
									<order-card-content v-else :orderDetail="getJSON(item.CustomContent)" />
								</view>
								<!--电话号码的交换 卡片 等自定义消息-->
								<view v-if="item.Type == xsoftmsdk.enums.ContentType.Custom">
									<view v-if='getJSON(item.CustomContent).contentType==1' class="extendChange">
										<text>
											{{getPhone(getJSON(item.CustomContent)).title}}
										</text>
										<view class="footer"
											v-if="getJSON(item.CustomContent).businessKey<3 && getJSON(item.CustomContent).sourceImId!=$store.state.imUserInfo.imId">
											<view class="actionButton">
												<button class="cancel cu-btn"
													@click="acceptPhone(4,getJSON(item.CustomContent))">拒绝</button>
												<view class="divider"></view>
												<button class="sure cu-btn"
													@click="acceptPhone(3,getJSON(item.CustomContent))">同意</button>
											</view>
										</view>
										<view class="footer" v-else>
											<view class="statu-text">
												<text
													class="statu-text">{{getPhone(getJSON(item.CustomContent)).status}}</text>
											</view>
										</view>
									</view>
									<!--发单人订单卡片-->
									<view
										v-if="$store.state.imUserInfo.imId == getJSON(item.CustomContent).demandImId && getJSON(item.CustomContent).contentType==2"
										class="card">
										<view class="title">
											<text v-if="getJSON(item.CustomContent).businessKey<3">您已发送订单，等待确认</text>
											<text v-if="getJSON(item.CustomContent).businessKey==3">您发送的订单，师傅已确认</text>
											<text v-if="getJSON(item.CustomContent).businessKey==4">您发送的订单，师傅已拒绝</text>
										</view>
										<view class="card-content">
											<view class="imageContent">
												<u-image border-radius="10" width="160" height="160"
													src="https://ns-strategy.cdn.bcebos.com/ns-strategy/upload/fc_big_pic/part-00047-3415.jpg" />
												</u-image>
											</view>
											<view v-if="getJSON(item.CustomContent).waitForDealDetailDTO">
												<view class="mini-title"><text
														class="ordertype">{{getJSON(item.CustomContent).waitForDealDetailDTO.requirementName || ''}}</text><text
														class="ordermoney">{{getJSON(item.CustomContent).waitForDealDetailDTO.price || "暂无报价"}}元</text>
												</view>
												<view class="order-no">
													订单号：{{getJSON(item.CustomContent).waitForDealDetailDTO.orderCode || "**********"}}
												</view>
												<view class="address">
													施工地址：{{getJSON(item.CustomContent).waitForDealDetailDTO.address || '************'}}
												</view>
											</view>
										</view>
										<view class="footer">
											<view v-if="getJSON(item.CustomContent).businessKey==4">
												<button class="status-button">已拒绝</button>
											</view>
											<view v-if="getJSON(item.CustomContent).businessKey==3">
												<button class="status-button">已确认</button>
											</view>
										</view>
									</view>
									<!--接单人订单卡片-->
									<view
										v-if="$store.state.imUserInfo.imId != getJSON(item.CustomContent).demandImId && getJSON(item.CustomContent).contentType==2"
										class="card">
										<view class="title">
											<text
												v-if="getJSON(item.CustomContent).businessKey<3">对方已经给您发送了订单，等待确认</text>
											<text v-if="getJSON(item.CustomContent).businessKey==3">订单已确认</text>
											<text v-if="getJSON(item.CustomContent).businessKey==4">订单已拒绝</text>
										</view>
										<view class="card-content">
											<view class="imageContent">
												<u-image border-radius="10" width="160" height="160"
													src="https://ns-strategy.cdn.bcebos.com/ns-strategy/upload/fc_big_pic/part-00047-3415.jpg" />
												</u-image>
											</view>
											<view>
												<view v-if="getJSON(item.CustomContent).waitForDealDetailDTO">
													<view class="mini-title"><text
															class="ordertype">{{getJSON(item.CustomContent).waitForDealDetailDTO.requirementName || ""}}</text><text
															class="ordermoney">{{getJSON(item.CustomContent).waitForDealDetailDTO.price || "暂无报价"}}元</text>
													</view>
													<view class="order-no">
														订单号：{{getJSON(item.CustomContent).waitForDealDetailDTO.orderCode || "**********"}}
													</view>
													<view class="address">
														施工地址：{{getJSON(item.CustomContent).waitForDealDetailDTO.address || '************'}}
													</view>
												</view>
											</view>
										</view>
										<view class="footer">
											<view class="actionButton" v-if="getJSON(item.CustomContent).businessKey<3">
												<button class="cancel cu-btn" style="background-color: #fff;"
													@click="resolveOrder(4)">拒绝</button>
												<button class="sure cu-btn" @click="resolveOrder(3)">确认</button>
											</view>
											<view v-if="getJSON(item.CustomContent).businessKey==4">
												<button class="status-button">已拒绝</button>
											</view>
											<view v-if="getJSON(item.CustomContent).businessKey==3">
												<button class="status-button">已确认</button>
											</view>
										</view>
									</view>
								</view>
								<!--卡片v-if="item.Type == xsoftmsdk.enums.ContentType.Custom"-->
								<view v-if="!item.Id" class="rowLoading">
									<u-loading mode="flower"></u-loading>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view id="bottom"></view>
			</scroll-view>
		</view>
		<!--订单链接发送-->
		<im-material-billorder v-if="orderDetail.id" :orderDetail="orderDetail" v-model="linkShow">
			<view slot="actionButton" class="actionButton">
				<button class="sure cu-btn" @tap="sendLink">发送</button>
			</view>
		</im-material-billorder>
		<!--输入-->
		<view class="oper flex-row" @tap.prevent.stop="">
			<!--语音切换-->
			<image v-if="isEdit" @tap="toggleEdit(false)" src="/static/images/voice-circle.png" class="icon">
			</image>
			<image v-else @tap="toggleEdit(true)" src="/static/images/keyboard.png" class="icon"></image>
			<!--语音切换-->
			<input v-if="isEdit" @focus="inputFocus" :focus="isFocus" :cursor-spacing="8" :adjust-position="false"
				type="text" confirm-type="send" @confirm="send" v-model="content" class="input" placeholder="请输入内容" />
			<view v-else @touchstart="startVoice" @touchend="endVoice" class="input" style="text-align: center;">松开发送语音
			</view>
			<!--表情-->
			<image @tap="togglePicker(200, 'emoji')" src="/static/images/emoji.png" class="icon"></image>
			<!--发送-->
			<view @touchend.prevent="send" v-show="content && platform=='android'" class="btn">发送</view>
			<!--附件-->
			<image @tap="togglePicker(100, 'file')" v-show="!content || platform=='ios'"
				src="../../../static/images/add.png" class="icon">
			</image>
		</view>
		<!--表情-->
		<view v-show="showEmoji" class="emoji" @tap.prevent.stop="">
			<view class="list">
				<view class="item" @tap="content += item" v-for="(item, index) in emojis" :key="index">{{ item }}</view>
			</view>
		</view>
		<!--附件-->
		<view v-show="showFile" class="file" @tap.prevent.stop="">
			<view class="list flex-row">
				<view class="item flex-column" @tap="uploadImage(['camera'])">
					<image src="/static/images/im-takephoto.png" class="icon"></image>
					<view class="text">拍照</view>
				</view>
				<view class="item flex-column" @tap="showLink">
					<image src="/static/images/im-link.png" class="icon"></image>
					<view class="text">链接</view>
				</view>
				<view class="item flex-column" @tap="uploadImage(['album'])">
					<image src="/static/images/im-photo.png" class="icon"></image>
					<view class="text">相册</view>
				</view>
				<!-- <view class="item flex-column">
					<image src="/static/images/im-file.png" class="icon"></image>
					<view class="text">文件</view>
				</view> -->
				<view class="item flex-column" @tap="getLocation">
					<image src="/static/images/im-address.png" mode="widthFix" class="icon"></image>
					<view class="text">位置</view>
				</view>
			</view>
		</view>
		<!--语音-->
		<my-voice v-show="showVoice"></my-voice>
		<uni-indexed-list :options="chooseList" :show-select="true" @click="" />
	</view>
</template>

<script>
	import emoji from '../../../plugins/emoji.js'
	import imsdk from '@/plugins/im/imsdk.js';
	import myVoice from '../../../components/self-voice/index.vue'
	import {
		resolveFile
	} from '@/components/img-cache/index.js'
	import {
		tabSqls
	} from '@/plugins/im/tabSqls.js'
	import {
		imUpload
	} from '@/config/imUpload.js';
	import {
		getShowDate,
		setLocalStorage,
		getCurrentTamp
	} from '@/static/js/chat.js';
	import storage from '@/plugins/storage.js'
	const xsoftmsdk = require('@/plugins/im/xsoftimsdk.js');
	const innerAudioContext = uni.createInnerAudioContext()
	const recorderManager = uni.getRecorderManager()
	import tabInit from '@/plugins/im/tabInit.js';
	export default {
		components: {
			myVoice
		},
		data() {
			return {
				xsoftmsdk: xsoftmsdk,
				emojis: [],
				isEdit: true,
				isFocus: false,
				showEmoji: false,
				showFile: false,
				showVoice: false,
				scrollHeight: 'auto', // 内容区域高度
				statusBarHeight: 0, // 状态栏高度
				scrollViewId: '', // 滚动到最底部
				voicePlayingId: '', // 正在播放的消息ID
				content: '',
				list: [],
				num: 0,
				socketOpen: false,
				socketMsgQueue: [],
				fromUserId: uni.getStorageSync('userId'),
				fromUserFace: uni.getStorageSync('userFace'),
				toUserId: '',
				toUserName: '',
				flag: null,
				datetime: 0,
				allshow: true,
				imUser: this.$store.state.imUserInfo,
				linkShow: false,
				mySelf: uni.getStorageSync('userData') ? uni.getStorageSync('userData').sysUser : {},
				bidId: 0,
				orderId: 0,
				materialId: 0,
				senderImId: 0,
				orderDetail: {},
				companyId: '',
				chooseId: 0,
				isScroll: true,
				platform: uni.getSystemInfoSync().platform,
				userList: [],
				chooseList: []
			}
		},
		onLoad(option) {
			console.log(option)
			// 初始化内容高度
			this.setScrollHeight();
			this.initScrollBar();
			// 初始化状态栏高度
			uni.getSystemInfo({
				success: res => {
					this.statusBarHeight = res.statusBarHeight
				}
			})
			// 结束录音
			recorderManager.onStop(res => {
				this.flag = null;
				if (this.datetime < 1) {
					this.$util.toast('语音消息过短');
					return;
				}
				this.upload(res.tempFilePath);
			})

			// 结束播放
			innerAudioContext.onEnded(res => {
				this.voicePlayingId = ''
			})
			// 获取参数
			switch (option.type) {
				case 'supplierOrder':
					this.orderId = option.orderId;
					this.companyId = option.toUserId
					this.getSupplierImid(option.toUserId);
					this.gteOrderDetail();
					break;
				case 'supplierMaterial':
					break
				default:
					this.toUserId = option.toUserId
					this.toUserName = option.toUserName;
					this.bidId = option.bidId;
					this.senderImId = option.senderImId;
					uni.setNavigationBarTitle({
						title: option.toUserName
					});
					break
			}

			// 如果传递过来的并不是客户的imim 那么就要自己处理im相关信息
			this.emojis = emoji
		},
		onHide() {
			innerAudioContext.stop()
		},
		onBackPress() {
			this.$store.commit("WEBSOCKET_CHATCLEAR");
		},
		methods: {
			getSupplierImid(id) {
				const userInfo = uni.getStorageSync("imUserInfo")
				tabInit.getImUserInfo(tabSqls['ImUser'], `where AppUserId = '${userInfo.pre}_supplier_${id}'`).then(res => {
					if(!res || !res.length){
						this.$util.toast("供应商还未设置客服")
						setTimeout(()=>uni.navigateBack(),1500)
						return;
					}
					if(res.length){
						this.toUserId = res[0].ImId;
						this.toUserName = res[0].Name;
						this.$store.commit("WEBSOCKET_NORMAL", {
							TargetId: res[0].ImId
						});
						return;
					}
					this.$httpApi.getSuppllierImInfo(id).then(res => {
						if (!res) {
							uni.navigateBack();
							return;
						}
						this.toUserId = res.groupId;
						this.toUserName = res.name;
						// this.$store.commit('WEBSOCKET_GROUP', {
						// 	TargetId: res.groupId
						// });
						uni.setNavigationBarTitle({
							title: res.name
						});
						tabInit.writeImUserInfo(tabSqls.ImUser, {
							UserId: id,
							AppUserId: `${userInfo.pre}_supplier_${id}`,
							Name: this.toUserName,
							ImId: res.groupId,
							AvatarFileId: res.companyLogo || '',
							CustomField: JSON.stringify(res)
						})
					})
				});
			},
			//单据信息的获取通过报价id
			gteOrderDetail() {
				this.$http.get("mall/order/supplierOrderdetail", {
					orderId: this.orderId,
					currentCompanyId: this.companyId
				}).then(res => {
					this.orderDetail = res;
				})
			},
			//电话号码的交换同意与拒绝
			acceptPhone(status, item) {
				this.$http.post(`order/bidorder/modifyMessage`, {
					"businessKey": status,
					"contentType": 1,
					"id": item.bidId
				}).then(res => {
					console.log(res);
				})
			},
			getDiffDate(list, item, index) {
				if (index == 0) return true;
				if (item.CreateTime - list[index - 1].CreateTime > 500) {
					return true;
				}
			},
			getDate(tmp) {
				return getShowDate(tmp)
			},
			refusePhone() {

			},
			//链接显示控制
			showLink() {
				this.linkShow = !this.linkShow;
				this.togglePicker();
			},
			//不感兴趣
			setUninterrested() {
				console.log(this.isSenderUser);
				this.$http.post('order/bidorder/update', {
					"bidInterest": this.isSenderUser ? 2 : 1,
					"id": this.bidId,
				}).then(res => {
					uni.showToast({
						title: '已为您减少类似订单的推荐',
						icon: 'none'
					})
				})
			},
			//发起订单确认
			orderConfirm() {
				console.log({
					contentType: 2,
					id: parseInt(this.bidId),
					businessKey: 2,
					businessMsg: ""
				})
				this.$http.post(`order/bidorder/sendmsg`, {
					contentType: 2,
					id: parseInt(this.bidId),
					businessKey: 2,
					businessMsg: ""
				}).then(res => {
					console.log(res);
				});
			},
			//同意或者拒绝订单
			resolveOrder(status) {
				this.$http.post(`order/bidorder/modifyMessage`, {
					"businessKey": status,
					"contentType": 2,
					"id": this.bidId
				}).then(res => {
					console.log(res);
				})
			},
			//交换电话或者拨打电话
			exchangePhone() {
				this.$http.post(`order/bidorder/sendmsg`, {
					contentType: 1,
					id: parseInt(this.bidId),
					businessKey: 1,
					businessMsg: ""
				}).then(res => {
					console.log(res);

				});
			},
			//修改订单
			editOrder() {

			},
			async getCache(id) {
				let url = this.getFiles(id)
				let selectr = await storage.select({
					url
				});
				return selectr.path;
			},
			//附件的地址
			getFiles(id) {
				return this.$store.state.imUserInfo.baseUrl + `/api/Common/GetFile?fileId=${id}&isThumb=true`
			},
			//通过imid查询人的名称 第一页的聊天的人员我们采用本地的数据库查询
			getImName(message) {
				const user = this.$store.state.groupUserList.find(item => item.ImId == message.SourceId)
				if (user) {
					return user.Name;
				}
				return "";
			},
			//图片预览
			preview(item) {
				console.log(item)
				//type是聊天的类型 id单聊是对方id 否则是群id
				const myIm = uni.getStorageSync('imUserInfo');
				const myImUserId = myIm.imId;
				const where =
					`where GroupId=${item.GroupId} and (Type=${xsoftmsdk.enums.ContentType.Image})`
				tabInit.getFilesList(tabSqls.GroupMessage, where, 'ChangeTime', 'desc').then(
					res => {
						let piclist = res.map((data) => {
							return this.$util.getImFiles(data.FileId, false, true);
						});
						uni.previewImage({
							current: this.$util.getImFiles(item.FileId, false, true),
							urls: piclist.reverse(),
						});
					});
			},
			//滚到顶部加载数据
			scrpllTop() {
				this.$store.commit('WEBSOCKET_LOADNORMAL', {
					GroupId: this.toUserId
				});
			},
			// 初始化滚动
			initScrollBar() {
				setTimeout(() => {
					this.scrollViewId = ''
					setTimeout(() => {
						this.scrollViewId = 'bottom'
						setTimeout(() => {
							this.scrollViewId = ''
						}, 100)
					}, 100)
				}, 100)
			},
			// 监听输入聚焦
			inputFocus(e) {
				this.setScrollHeight(e.detail.height)
				this.initScrollBar()
				uni.onKeyboardHeightChange(res => {
					this.setScrollHeight(res.height)
					this.initScrollBar()
				})
			},
			// 设置scroll的高度
			setScrollHeight(descHeight = 0) {
				// #ifdef MP-WEIXIN
				this.scrollHeight = `calc(100vh - 250rpx - ${descHeight}px)`
				// #endif
				// #ifdef APP-PLUS
				this.scrollHeight = `calc(100vh - 250rpx - ${descHeight}px)`
				// #endif
				// #ifdef H5
				this.scrollHeight = `calc(100vh - 250rpx - 88rpx - ${descHeight}px)`
				// #endif
			},
			// 切换选择
			togglePicker(height = 0, type = '') {
				if (type) {
					this.linkShow = false
				};
				this.showEmoji = false
				this.showFile = false
				let status = height > 0 ? true : false;
				switch (type) {
					case 'emoji':
						this.showEmoji = status;
						break
					case 'file':
						this.showFile = status;
						break
				}
				setTimeout(() => {
					this.setScrollHeight(height);
					type && status && this.initScrollBar();
				}, 50)
			},
			// 切换语音与编辑
			toggleEdit(bool) {
				this.linkShow = false;
				this.isEdit = bool
				this.isFocus = bool
				this.setScrollHeight(0)
			},
			// 开始录音
			startVoice() {
				this.showVoice = true;
				this.datetime = 0;
				recorderManager.start();
				this.flag = setInterval(() => {
					this.datetime = this.datetime + 1
				}, 1000);
			},
			// 结束录音
			endVoice() {
				this.showVoice = false
				recorderManager.stop();
			},
			// 播放录音
			async playVoice(item) {
				if (this.voicePlayingId) {
					this.voicePlayingId = ''
				} else {
					let furl = !item.FileId ? this.getJSON(item.CustomContent).LocalPath : await setLocalStorage(item
						.FileId);
					this.voicePlayingId = this.getJSON(item.CustomContent).GuidMini;
					innerAudioContext.src = furl;
					innerAudioContext.play()
				}
			},
			//消息长按
			messageLongPress(item) {
				this.chooseId = item.KeyID;
			},
			// 消息复制
			copyText(item) {
				copy(item.Content)
				this.chooseId = '';
			},
			//消息撤回
			withdraw(item) {
				this.$store.commit("recallMessage", {
					"MessageId": item.Id,
					"Type": 1
				})
			},
			//撤回条件 三分钟内的可以撤回
			withdrawWhere(item) {
				let newTamp = new Date().getTime();
				newTamp = newTamp / 1000
				if (newTamp - item.ChangeTime > 3 * 60) {
					return false;
				}
				return true;
			},
			// 长按
			longPress(msg) {

			},
			// 获取位置
			getLocation() {
				uni.getLocation({
					type: 'gcj02',
					success: res => {
						console.log(res);
						let {
							latitude,
							longitude
						} = res
						uni.chooseLocation({
							latitude,
							longitude,
							success: chooseRes => {
								const sendMessage = {
									Id: 0,
									GroupId: parseInt(this.toUserId),
									Type: xsoftmsdk.enums.ContentType.Custom,
									Content: "[位置信息]",
									CreateTime: getCurrentTamp(),
									TargetName: this.toUserName,
									SourceId: parseInt(this.$store.state.imUserInfo.imId),
									CustomContent: JSON.stringify({
										GuidMini: xsoftmsdk.common.GuidMini(),
										contentType: 12,
										...chooseRes,
									}),
								}
								const temporaryMessage = xsoftmsdk.messages.GroupMessage.fromMap(
									sendMessage);
								imsdk.sendMessage(xsoftmsdk.messages.GroupMessage.fromMap(
									sendMessage));
								this.$store.state.groupList = [...this.$store.state.groupList,
									temporaryMessage
								];
							}
						})
					}
				})
			},
			// 打开位置
			openLocation(content) {
				let {
					latitude,
					longitude
				} = content
				uni.openLocation({
					latitude,
					longitude
				})
			},
			//发送链接
			sendLink() {
				const sendMessage = {
					Id: 0,
					GroupId: parseInt(this.toUserId),
					Type: xsoftmsdk.enums.ContentType.Link,
					Content: "[链接]",
					CreateTime: getCurrentTamp(),
					TargetName: this.toUserName,
					SourceId: parseInt(this.$store.state.imUserInfo.imId),
					CustomContent: JSON.stringify({
						GuidMini: xsoftmsdk.common.GuidMini(),
						contentType: 12,
						...this.orderDetail
					}),
				}
				const temporaryMessage = xsoftmsdk.messages.GroupMessage.fromMap(sendMessage);
				imsdk.sendMessage(xsoftmsdk.messages.GroupMessage.fromMap(sendMessage));
				this.$store.state.groupList = [...this.$store.state.groupList, temporaryMessage];
				this.linkShow = false;
			},
			//其他语音发送
			async upload(filePath) {
				let temporaryMessage = {
					Id: 0,
					GroupId: parseInt(this.toUserId),
					TargetName: this.toUserName,
					Type: xsoftmsdk.enums.ContentType.Voice,
					Content: "[语音]",
					CreateTime: getCurrentTamp(),
					SourceId: parseInt(this.$store.state.imUserInfo.imId),
					CustomContent: JSON.stringify({
						GuidMini: xsoftmsdk.common.GuidMini(),
						LocalPath: filePath,
						Duration: this.datetime
					})
				}
				this.$store.state.groupList.push(xsoftmsdk.messages.GroupMessage.fromMap(temporaryMessage));
				let fileid = await imUpload(filePath);
				temporaryMessage.FileId = fileid;
				imsdk.sendMessage(xsoftmsdk.messages.GroupMessage.fromMap(temporaryMessage));
				let url = this.getFiles(fileid);
				uni.saveFile({
					tempFilePath: filePath,
					success: function(res) {
						let local = res.savedFilePath;
						storage.insert({
							url,
							local
						});
					}
				});

			},
			// 发送图片
			uploadImage(sourceType = ['album']) {
				uni.chooseImage({
					count: 9, //默认9
					sizeType: ['original'],
					sourceType,
					success: chooseImageRes => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						tempFilePaths.forEach(async temp => {
							let originalPic = await this.compress(temp);
							let temporaryMessage = {
								Id: 0,
								GroupId: parseInt(this.toUserId),
								Type: xsoftmsdk.enums.ContentType.Image,
								Content: temp,
								TargetName: this.toUserName,
								CreateTime: getCurrentTamp(),
								SourceId: parseInt(this.$store.state.imUserInfo.imId),
								CustomContent: JSON.stringify({
									GuidMini: xsoftmsdk.common.GuidMini(),
									LocalPath: temp
								}),
							}
							this.$store.state.groupList.push(xsoftmsdk.messages.GroupMessage
								.fromMap(temporaryMessage));
							let fileid = await imUpload(temp);
							//保证上传
							temporaryMessage.FileId = fileid;
							imsdk.sendMessage(xsoftmsdk.messages.GroupMessage
								.fromMap(temporaryMessage));
							//图片在写进去本地区
							uni.saveFile({
								tempFilePath: tempFilePaths[0],
								success: (res) => {
									let local = res.savedFilePath;
									let url = this.getFiles(fileid);
									storage.insert({
										url,
										local
									});
								}
							})
						})
					}
				})
			},
			// 发送文本消息
			send() {
				const sendMessage = {
					Id: 0,
					GroupId: parseInt(this.toUserId),
					Type: xsoftmsdk.enums.ContentType.Text,
					Content: this.content,
					TargetName: this.toUserName,
					CreateTime: getCurrentTamp(),
					SourceId: parseInt(this.$store.state.imUserInfo.imId),
					CustomContent: JSON.stringify({
						GuidMini: xsoftmsdk.common.GuidMini()
					}),
				}
				const temporaryMessage = xsoftmsdk.messages.GroupMessage.fromMap(sendMessage);
				imsdk.sendMessage(xsoftmsdk.messages.GroupMessage.fromMap(sendMessage));
				this.$store.state.groupList = [...this.$store.state.groupList, temporaryMessage];
				this.content = '';
			},
			getJSON(string) {
				//这里是json字符串而不是单纯的字符串
				return JSON.parse(string);
			},
			//电话号码显示的状态
			getPhone(data) {
				let meText = "";
				let heText = "";
				//我是发单人 我发起的号码交换
				if (this.$store.state.imUserInfo.imId == data.sourceImId && this.$store.state.imUserInfo.imId == data
					.demandImId) {
					meText = "您";
					heText = "师傅";
				}
				//我是发单人 师傅发起的交换
				if (this.$store.state.imUserInfo.imId != data.sourceImId && this.$store.state.imUserInfo.imId == data
					.demandImId) {
					meText = "师傅";
					heText = "您";
				}
				//我是师傅 我发起的电话交换
				if (this.$store.state.imUserInfo.imId == data.sourceImId && this.$store.state.imUserInfo.imId != data
					.demandImId) {
					meText = "您";
					heText = "客户";
				}
				//我是师傅 客户的电话交换
				if (this.$store.state.imUserInfo.imId != data.sourceImId && this.$store.state.imUserInfo.imId != data
					.demandImId) {
					meText = "客户";
					heText = "您";
				}
				switch (data.businessKey) {
					case 1:
						return {
							title: `${meText}已发起电话号码交换，等待${heText}确认`,
								status: '等待确认'
						};
					case 2:
						return {
							title: `${meText}已发起电话号码交换，等待${heText}确认`,
								status: '等待确认'
						};
					case 3:
						return {
							title: `${meText}已发起电话号码交换，等待${heText}确认`,
								status: '已拒绝'
						};
					case 4:
						return {
							title: `${meText}已发起电话号码交换，等待${heText}确认`,
								status: '已同意'
						};
				}
			},
			compress(img) {
				let that = this
				return new Promise((res) => {
					// var localPath = plus.io.convertAbsoluteFileSystem(img);
					plus.io.resolveLocalFileSystemURL(img, (entry) => { //通过URL参数获取目录对象或文件对象
						entry.file((file) => { // 可通过entry对象操作图片
							console.log('压缩前图片信息:' + JSON.stringify(file)); //压缩前图片信息
							if (file.size > 504800) { //   如果大于500Kb进行压缩
								plus.zip.compressImage({ // 5+ plus.zip.compressImage 了解一下，有详细的示例
									src: img, //src: 压缩原始图片的路径
									dst: img.replace('.png', '2222.png').replace('.PNG',
											'2222.PNG').replace('.jpg', '2222.jpg')
										.replace('.JPG', '2222.JPG'),
									width: '200', //dst: (String 类型 )压缩转换目标图片的路径，这里先在后面原始名后面加一个2222区分一下
									height: '40%', //width,height: (String 类型 )缩放图片的宽度,高度
									quality: 10, //quality: (Number 类型 )压缩图片的质量
									overwrite: true, //overwrite: (Boolean 类型 )覆盖生成新文件
									// format:'jpg'   //format: (String 类型 )压缩转换后的图片格式
								}, (event) => {
									console.log('压缩后图片信息:' + JSON.stringify(
										event)); // 压缩后图片信息
									this.imageInfo = event
									let newImg = event.target;
									res(newImg); //返回新的图片地址，在uploadFile之前接收
								}, function(err) {
									// console.log('Resolve file URL failed: ' + err.message);
								});
							} else { //else小于500kb跳过压缩，直接返回现有的src
								res(img);
							}
						});
					}, (e) => { // 返回错误信息
						// console.log('Resolve file URL failed: ' + e.message);
					});
				})
			},
		},
		computed: {
			isSenderUser() {
				//判断当前单 当前是用户是发单人还是还是报价人
				if (this.senderImId == this.$store.state.imUserInfo.imId) {
					return true;
				}
				return false;
			},
			groupList() {
				return this.$store.state.groupList;
			},
		},
		watch: {
			groupList(newValue, oldValue) {
				//初始化加载这里不做处理或者上加载
				if ((newValue.length - oldValue.length) > 1 || (oldValue.length == 0 && newValue.length > 0) || (newValue
						.length - oldValue.length) == this.$store
					.state.size) {} else {
					//这里是监听的来源消息
					this.initScrollBar();
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/chat.scss';
</style>
