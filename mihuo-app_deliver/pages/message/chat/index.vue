<template>
	<!--@tap="togglePicker(0)"-->
	<view class="container" @tap="togglePicker(0)" @touchmove.stop.prevent.self="moveHandle()">
		<view class="scroll" :style="{ height: scrollHeight }">
			<scroll-view scroll-anchoring upper-threshold="5" @scrolltoupper="scrpllTop"
				:scroll-into-view="scrollViewId" :scroll-y="isScroll" style="height: 100%; padding-bottom: 10rpx;">
				<view class="item-space"></view>
				<view v-for="(item, index) in $store.state.normalList" :id="'a'+getJSON(item.CustomContent).GuidMini"
					:key="getJSON(item.CustomContent).GuidMini">
					<!--时间-->
					<view class="imdate" v-if="getDiffDate($store.state.normalList,item,index)">
						{{getDate(item.CreateTime)}}
					</view>
					<view v-if="item.Type == xsoftmsdk.enums.ContentType.ReCall" class="cancel">
						<text v-if="item.SourceId != toUserId" class="text">你撤回了一条消息</text>
						<text v-else class="text">对方撤回了一条消息</text>
					</view>
					<view v-else class="item flex-row" :class="[item.SourceId == toUserId ? 'left' : 'right']">
						<!--处理头像-->
						<im-avatar :imId="item.SourceId" class="face" />
						<!--消息操作-->
						<view class="message-action top"
							v-if="chooseId==item.KeyID && item.Type == xsoftmsdk.enums.ContentType.Text && item.SourceId != toUserId && withdrawWhere(item)">
							<span @click="copyText(item)" class="item-action"
								v-if="item.Type == xsoftmsdk.enums.ContentType.Text">复制</span>
							<!-- <span class="item-action">转发</span> -->
							<span @click="withdraw(item)" class="item-action"
								v-if="item.SourceId != toUserId && withdrawWhere(item)">撤回</span>
						</view>
						<!--消息内容-->
						<view class="messageItem" @longtap="(e)=>messageLongPress(e,item)">
							<!--文本-->
							<view v-if="item.Type == xsoftmsdk.enums.ContentType.Text" class="content">
								{{ item.Content }}
							</view>
							<!--图片-->
							<view v-if="item.Type == xsoftmsdk.enums.ContentType.Image">
								<view style="position: relative">
									<image @click="()=>preview(item)" v-if="!item.Id || !item.FileId" mode="heightFix"
										style="max-height: 300rpx;" :src="item.Content" />
									<img-cache @click="()=>preview(item)" v-else mode="heightFix"
										style="max-height: 300rpx;" :indexed="$util.getImFiles(item.FileId,true,false)"
										:src="$util.getImFiles(item.FileId,true)" />
								</view>
							</view>
							<!--链接-->
							<view v-if="item.Type == xsoftmsdk.enums.ContentType.Link">
								<!-- 如果数据里有orderSn字段,说明是材料订单, 负责是普通订单 -->
								<im-material-item v-if="item.CustomType == customeType.supplierMaterial"
									:materialDetail="getJSON(item.CustomContent)" />
								<im-billorder-item v-else-if="item.CustomType == customeType.supplierOrder"
									:materialDetail="getJSON(item.CustomContent)" />
								<order-info v-else-if="item.CustomType == customeType.constructionOrder"
									:orderInfo="getJSON(item.CustomContent)"
									style="background: #fff;padding: 20rpx;border-radius: 20rpx;" />
								<order-card-content v-else :orderDetail="getJSON(item.CustomContent)" />
							</view>
							<!--地图-->
							<view
								v-if="item.Type == xsoftmsdk.enums.ContentType.Custom && getJSON(item.CustomContent).contentType == 12"
								class="content" :class="[item.SourceId == toUserId ? 'left-map' : 'right-map']"
								@tap="openLocation(getJSON(item.CustomContent))">
								<view class="title">
									{{
										getJSON(item.CustomContent).name
									}}
								</view>
								<view class="subtitle">
									{{
										getJSON(item.CustomContent).address
									}}
								</view>
								<image mode="aspectFill" class="box" src="@/static/images/address_icon.png"></image>
								<!-- <map class="box" :latitude="getJSON(item.CustomContent).latitude" :longitude="getJSON(item.CustomContent).longitude"
									:markers="[{latitude: getJSON(item.CustomContent).latitude, longitude: getJSON(item.CustomContent).longitude, iconPath: '@/static/images/icon-address/address-5.png'}]"
									@tap="openLocation(getJSON(item.CustomContent))"></map> -->
							</view>
							<!--我的语音-->
							<view v-if="item.Type == xsoftmsdk.enums.ContentType.Voice && item.SourceId != toUserId"
								@tap="()=>playVoice(item)" class="content">
								<text class="duration">
									{{ getJSON(item.CustomContent).Duration + "''" }}
								</text>
								<image v-if="voicePlayingId != item.CustomContent"
									src="@/static/images/audio-play_white.png" class="voice-icon">
								</image>
								<image v-if="voicePlayingId == item.CustomContent"
									src="@/static/images/audio-play_white.gif" class="voice-icon">
								</image>
							</view>
							<!--别人发出来的语音-->
							<view v-if="item.Type == xsoftmsdk.enums.ContentType.Voice && item.SourceId == toUserId"
								@tap="()=>playVoice(item)" class="content">
								<text class="duration">
									{{ getJSON(item.CustomContent).Duration + "''" }}
								</text>
								<image v-show="voicePlayingId != item.CustomContent" src="@/static/images/audio.png"
									class="voice-icon">
								</image>
								<image v-show="voicePlayingId == item.CustomContent"
									src="@/static/images/audio-play.gif" class="voice-icon">
								</image>
							</view>
							<message-mh-retranmission :item="item" />
						</view>
					</view>
				</view>
				<view id="bottom"></view>
			</scroll-view>
		</view>
		<!--订单链接发送-->
		<im-material-billorder v-model="linkShow" v-if="sourceType  && constructionOrder.id"
			:materialDetail="materialDetail" :orderDetail="orderDetail" :constructionOrder="constructionOrder">
			<view slot="actionButton" class="actionButton">
				<button class="sure cu-btn" @tap="sendLink">发送</button>
			</view>
		</im-material-billorder>
		<!--输入-->
		<view class="oper flex-row" @tap.prevent.stop="">
			<!--语音切换-->
			<image v-if="isEdit" @tap="toggleEdit(false)" src="@/static/images/voice-circle.png" class="icon">
			</image>
			<image v-else @tap="toggleEdit(true)" src="@/static/images/keyboard.png" class="icon"></image>
			<!--语音切换-->
			<!-- #ifdef APP -->
			<textarea v-if="isEdit" @click="inputFocus" :focus="isFocus" :inputBorder="false" v-model="content"
				@confirm="send" confirm-type="send" :adjust-position="false" :confirm-hold="true" class="input"
				placeholder="请输入内容" maxlength="-1" :auto-height="autoHeight" />
			<!-- #endif -->
			<!-- #ifdef MP -->
			<input v-if="isEdit" @focus="inputFocus" :focus="isFocus" :cursor-spacing="0" :adjust-position="false"
				type="text" confirm-type="send" v-model="content" @confirm="send" class="input" placeholder="请输入内容" />
			<!-- #endif -->
			<!-- <view v-else @touchstart="startVoice" @touchend="endVoice" class="input" style="text-align: center">松开发送语音
			</view> -->
			<view v-else class="voice-mode input" :class="[recording?'recording':'']" @touchstart="voiceBegin"
				@touchmove.stop.prevent="voiceIng" @touchend="voiceEnd" @touchcancel="voiceCancel">{{voiceTis}}</view>
			<!--表情-->
			<image @tap.prevent.stop="togglePicker(200, 'emoji')" src="@/static/images/emoji.png" class="icon"></image>
			<!--发送-->
			<view @touchend.prevent="send" v-show="content" class="btn">发送</view>
			<!--附件-->
			<image v-if="!content" @tap.prevent.stop="togglePicker(100, 'file')" src="@/static/images/add.png"
				class="icon">
			</image>
		</view>
		<!--表情-->
		<view v-show="showEmoji" class="emoji" @tap.prevent.stop="" @touchmove.stop="">
			<view class="list">
				<!-- <view class="action">
					<view class="delete" @touchend.prevent="clearMessage">
						<image src="@/static/images/clear-icon.png"></image>
					</view>
					<view v-if="platform == 'ios'" @touchend.prevent="send" :class="content?'active':'disable'"
						class="send">发送</view>
				</view> -->
				<view class="item" @tap="content += item" v-for="(item, index) in emojis" :key="index">{{ item }}</view>
			</view>
		</view>
		<!--附件-->
		<view v-show="showFile" class="file" @tap.prevent.stop="">
			<view class="list flex-row">
				<view class="item flex-column" @tap="uploadImage(['camera'])">
					<image src="@/static/images/im-takephoto.png" class="icon"></image>
					<view class="text">拍照</view>
				</view>
				<view class="item flex-column" v-if="sourceType && constructionOrder.id" @tap="showLink">
					<image src="@/static/images/im-link.png" class="icon"></image>
					<view class="text">链接</view>
				</view>
				<view class="item flex-column" @tap="uploadImage(['album'])">
					<image src="@/static/images/im-photo.png" class="icon"></image>
					<view class="text">相册</view>
				</view>
				<!-- <view class="item flex-column">
					<image src="@/static/images/im-file.png" class="icon"></image>
					<view class="text">文件</view>
				</view> -->
				<view class="item flex-column" @tap="getLocation">
					<image src="@/static/images/im-address.png" mode="widthFix" class="icon"></image>
					<view class="text">位置</view>
				</view>
			</view>
		</view>
		<!--语音-->
		<!-- 录音UI效果 -->
		<view class="record" :class="recording?'':'hidden'">
			<view class="ing" :class="willStop?'hidden':''">
				<view class="icon luyin2"></view>
			</view>
			<view class="cancel" :class="willStop?'':'hidden'">
				<view class="icon chehui"></view>
			</view>
			<view class="tis" :class="willStop?'change':''">{{recordTis}}</view>
		</view>
	</view>
</template>

<script>
	import emoji from "@/plugins/emoji.js";
	import imsdk from "@/plugins/im/imsdk.js";
	import tabInit from "@/plugins/im/tabInit.js";
	import customeType from '@/plugins/im/customeType.js'
	import {
		resolveFile
	} from "@/components/img-cache/index.js";
	import {
		tabSqls
	} from "@/plugins/im/tabSqls.js";
	import {
		imUpload
	} from "@/config/imUpload.js";
	import {
		getShowDate,
		setLocalStorage,
		getCurrentTamp
	} from "@/static/js/chat.js";
	import {
		imgcache as storage
	} from "@/plugins/storage.js";
	import {
		copy
	} from '@/plugins/utils'
	import imHttp from '@/config/imRequest.js';
	const xsoftmsdk = require("@/plugins/im/xsoftimsdk.js");
	export default {
		data() {
			return {
				xsoftmsdk: xsoftmsdk,
				emojis: [],
				linkShow: false,
				isEdit: true,
				isFocus: false,
				showEmoji: false,
				showFile: false,
				autoHeight: true,
				customeType: customeType,
				showVoice: false,
				scrollHeight: "auto", // 内容区域高度
				statusBarHeight: 0, // 状态栏高度
				scrollViewId: "", // 滚动到最底部
				voicePlayingId: "", // 正在播放的消息ID
				content: "",
				isVoice: false,
				voiceTis: '按住说话',
				recordTis: "手指上滑取消发送",
				recording: false,
				willStop: false,
				RECORDER: uni.getRecorderManager(),
				AUDIO: uni.createInnerAudioContext(),
				initPoint: {
					identifier: 0,
					Y: 0
				},
				recordTimer: '',
				toUserId: 0,
				audioFile: {
					type: 'audio',
					url: '',
					timeLength: ''
				},
				orderDetail: {},
				materialDetail: {},
				mySelf: uni.getStorageSync("userData") ?
					uni.getStorageSync("userData").sysUser : {},
				toUserName: "",
				flag: null,
				datetime: 0,
				sourceType: '',
				constructionOrder: {},
				isScroll: true,
				chooseId: '',
				platform: uni.getSystemInfoSync().platform,
				chated: false,
			};
		},
		onLoad(option) {
			//console.log(option)
			// 初始化内容高度
			this.setScrollHeight();
			this.initScrollBar();
			// 初始化状态栏高度
			uni.getSystemInfo({
				success: (res) => {
					this.statusBarHeight = res.statusBarHeight;
				},
			});
			this.RECORDER.onStart((e) => {
				this.recordBegin(e);
			})
			//录音结束事件
			this.RECORDER.onStop((e) => {
				this.recordEnd(e);
			})
			// 结束播放
			this.AUDIO.onEnded((res) => {
				this.voicePlayingId = "";
			});
			this.sourceType = option.type;
			switch (option.type) {
				case "serviceTeam":
					setTimeout(() => {
						uni.setNavigationBarTitle({
							title: option.toUserName + '',
						});
					}, 200)
					this.toUserId = option.toUserId;
					this.toUserName = option.toUserName;
					this.getPersonImid(option.toUserId);
					break;
				case "constructionOrder":
					setTimeout(() => {
						uni.setNavigationBarTitle({
							title: option.toUserName + '',
						});
					}, 200)
					this.toUserName = option.toUserName;
					this.toUserId = option.toUserId;
					this.getPersonImid(option.toUserId);
					option.orderId > 0 && this.getConstructionInfo(option.orderId)
					break
				case "market":
					setTimeout(() => {
						uni.setNavigationBarTitle({
							title: option.toUserName + '',
						});
					}, 200)
					this.toUserName = option.toUserName;
					this.toUserId = option.toUserId;
					this.orderId = option.orderId;
					this.getPersonImid(option.toUserId);
					break;
				default:
					// 获取参数
					setTimeout(() => {
						uni.setNavigationBarTitle({
							title: option.toUserName + '',
						});
					}, 200)
					this.toUserId = option.toUserId;
					this.toUserName = option.toUserName;
					break;
			}
			this.emojis = emoji;
		},
		onShow() {
			uni.onKeyboardHeightChange((res) => {
				//这里减去的30是之前的地步安全区增加的多余的像素
				if (this.platform == 'ios') {
					this.setScrollHeight(res.height > 50 ? res.height - 30 : res.height);
				} else {
					this.setScrollHeight(res.height > 50 ? res.height : res.height);
				}
				this.initScrollBar();
			});
		},
		onHide() {
			uni.hideKeyboard();
			this.AUDIO.stop();
			this.setScrollHeight(0);
			uni.offKeyboardHeightChange(() => {})
		},
		onUnload() {
			this.$store.commit("WEBSOCKET_CHATCLEAR");
		},
		onBackPress() {
			this.$store.commit("WEBSOCKET_CHATCLEAR");
		},
		onNavigationBarButtonTap(e) {
			uni.hideKeyboard();
			this.toPage(`/pages/message/chat/member?id=${this.toUserId}`)
		},
		methods: {
			chooseVoice(data) {

			},
			moveHandle() {

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
			getAvatar(imId) {
				return this.$util.avatarImage(275);
			},
			getPersonImid(id) {
				const userInfo = uni.getStorageSync("imUserInfo")
				//查看本地是否存在
				// #ifdef APP
				tabInit.getImUserInfo(tabSqls['ImUser'], `where AppUserId = '${userInfo.pre}_${id}'`).then(res => {
					if (res.length) {
						this.toUserId = res[0].ImId;
						this.toUserName = res[0].Name;
						this.$store.commit("WEBSOCKET_NORMAL", {
							TargetId: res[0].ImId
						});
						return;
					}
					uni.showLoading({
						title: '信息同步中...',
						isFullScreen: true
					})
					this.$http.get(`basic/im/getimidbyuserid/${id}`).then((data) => {
						uni.hideLoading()
						this.toUserId = data.imId;
						this.toUserName = data.name;
						this.$store.commit("WEBSOCKET_NORMAL", {
							TargetId: data.imId
						});
					});
				});
				// #endif
				// #ifdef MP
				this.$http.get(`basic/im/getimidbyuserid/${id}`).then((data) => {
					uni.hideLoading()
					this.toUserId = data.imId;
					this.toUserName = data.name;
					this.$store.commit("WEBSOCKET_NORMAL", {
						TargetId: data.imId
					});
				});
				// #endif
			},
			//施工订单的详情
			getConstructionInfo(id) {
				console.log(id)
				this.$http.get(`order/bidorder/list?orderId=${id}`).then(res => {
					if (res) {
						console.log(res);
						this.constructionOrder = res.bizOrder;
					}
				})
			},
			//链接显示控制
			showLink() {
				this.linkShow = !this.linkShow;
				this.togglePicker();
			},
			//附件的地址
			getFiles(id, isThumb) {
				return this.$util.getImFiles(id, isThumb);
			},
			preview(item) {
				//type是聊天的类型 id单聊是对方id 否则是群id
				// #ifdef MP
				uni.previewImage({
					current: this.$util.getImFiles(item.FileId, false, true),
					urls: [this.$util.getImFiles(item.FileId, false, true)]
				});
				// #endif
				// #ifdef APP
				const myIm = uni.getStorageSync("imUserInfo");
				const myImUserId = myIm.imId;
				const where =
					`where ((SourceId=${myImUserId} and TargetId=${this.toUserId}) or (TargetId=${myImUserId} and SourceId=${this.toUserId})) and (Type=${xsoftmsdk.enums.ContentType.Image})`;
				tabInit
					.getFilesList(tabSqls.NormalMessage, where, "ChangeTime", "desc")
					.then((res) => {
						let piclist = res.map((data) => {
							// let [localPath] = await storage.select({
							// 	url: this.$util.getImFiles(data.FileId, true,false)
							// });
							// if (localPath) return localPath.local;
							return this.$util.getImFiles(data.FileId, false, true);
						});
						const currentData = res.find(mini => mini.Id == item.Id)
						uni.previewImage({
							current: currentData ? this.$util.getImFiles(currentData.FileId, false, true) :
								item.Content,
							urls: piclist.reverse(),
						});
					});
				// #endif
			},
			//滚到顶部加载数据
			scrpllTop() {
				const oldList = this.$store.state.normalList;
				this.$store.commit("WEBSOCKET_LOADNORMAL", {
					TargetId: this.toUserId,
				});
				this.isScroll = false;
				setTimeout(() => {
					this.scrollViewId = "";
					setTimeout(() => {
						this.isScroll = true
						this.scrollViewId = 'a' + oldList[0].KeyID;
						setTimeout(() => {
							this.scrollViewId = "";
						}, 60);
					}, 80);
				}, 100);
			},
			// 初始化滚动
			initScrollBar() {
				setTimeout(() => {
					this.scrollViewId = "";
					setTimeout(() => {
						this.scrollViewId = "bottom";
						setTimeout(() => {
							this.scrollViewId = "";
						}, 100);
					}, 100);
				}, 100);
			},
			// 监听输入聚焦
			inputFocus(e) {
				this.showEmoji = false;
				//this.setScrollHeight(e.detail.height - 30);
				this.initScrollBar();

			},
			// 设置scroll的高度
			setScrollHeight(descHeight = 0) {
				// #ifdef MP
				this.scrollHeight = `calc(100vh - 150rpx - ${descHeight}px)`;
				// #endif
				// #ifdef APP-PLUS
				if (uni.getSystemInfoSync().platform == "android") {
					this.scrollHeight = `calc(100vh - 150rpx - ${descHeight <= 0 ? descHeight : descHeight}px)`;
				} else {
					this.scrollHeight = `calc(100vh - 150rpx - ${descHeight}px)`;
				}
				// #endif
				// #ifdef H5
				this.scrollHeight = `calc(100vh - 120px - 88px - ${descHeight}px)`;
				// #endif
			},
			// 切换选择
			togglePicker(height = 0, type = "") {
				if (type) {
					this.linkShow = false
				};
				this.chooseId = '';
				let status = height > 0 ? true : false;
				switch (type) {
					case "emoji":
						if (status && this.showEmoji) {
							this.isFocus = true;
							this.showFile = false;
							this.showEmoji = false;
							this.isEdit = true;
							return;
						}
						this.isFocus = false;
						this.showFile = false;
						this.showEmoji = status;
						this.isEdit = true;
						break;
					case "file":
						if (status && this.showFile) {
							this.isFocus = true;
							this.showFile = false;
							this.showEmoji = false;
							return;
						}
						this.isFocus = false;
						this.showEmoji = false;
						this.showFile = status;
						break;
				}
				setTimeout(() => {
					this.setScrollHeight(height);
					status && this.initScrollBar();
				}, 100);
			},
			// 切换语音与编辑
			toggleEdit(bool) {
				this.isEdit = bool;
				this.isFocus = bool;
				this.linkShow = false;
				if (!bool) {
					this.showEmoji = false
				};
				this.setScrollHeight(0);
			},
			// 录音开始
			voiceBegin(e) {
				if (e.touches.length > 1) {
					return;
				}
				this.initPoint.Y = e.touches[0].clientY;
				this.initPoint.identifier = e.touches[0].identifier;
				this.RECORDER.start({
					format: "mp3"
				}); //录音开始,
			},
			//录音开始UI效果
			recordBegin(e) {
				this.recording = true;
				this.voiceTis = '松开 结束';
				this.recordLength = 0;
				this.recordTimer = setInterval(() => {
					this.recordLength++;
				}, 1000)
			},
			// 录音被打断
			voiceCancel() {
				this.recording = false;
				this.voiceTis = '按住 说话';
				this.recordTis = '手指上滑 取消发送'
				this.willStop = true; //不发送录音
				this.RECORDER.stop(); //录音结束
			},
			// 录音中(判断是否触发上滑取消发送)
			voiceIng(e) {
				if (!this.recording) {
					return;
				}
				let touche = e.touches[0];
				//上滑一个导航栏的高度触发上滑取消发送
				if (this.initPoint.Y - touche.clientY >= uni.upx2px(100)) {
					this.willStop = true;
					this.recordTis = '松开手指 取消发送'
				} else {
					this.willStop = false;
					this.recordTis = '手指上滑 取消发送'
				}
			},
			// 结束录音
			voiceEnd(e) {
				if (!this.recording) {
					return;
				}
				this.recording = false;
				this.voiceTis = '按住 说话';
				this.recordTis = '手指上滑 取消发送'
				this.RECORDER.stop(); //录音结束
			},
			//录音结束(回调文件)
			recordEnd(e) {
				clearInterval(this.recordTimer);
				if (!this.willStop) {
					let file = {
						length: 0,
						url: e.tempFilePath
					}
					let min = parseInt(this.recordLength / 60);
					let sec = this.recordLength % 60;
					min = min == 0 ? '' : min + "'";
					file.length = min + sec;
					this.upload(file)
				} else {
					console.log('取消发送录音');
				}
				this.willStop = false;
			},
			// 播放录音
			async playVoice(item) {
				if (this.voicePlayingId) {
					this.voicePlayingId = "";
				} else {
					let furl = !item.FileId ?
						this.getJSON(item.CustomContent).LocalPath :
						await setLocalStorage(item.FileId);
					this.voicePlayingId = item.CustomContent;
					this.AUDIO.src = furl;
					this.AUDIO.play();
				}
			},
			//判断消息是否发送失败
			getRetransmissionDate(item) {
				const current = new Date().getTime() / 1000;
				switch (item.Type) {
					case xsoftmsdk.enums.ContentType.Voice:
						if ((current - item.CreateTime) > 5 * 60) {
							return true;
						} else {
							return false;
						}
						break
					case xsoftmsdk.enums.ContentType.Image:
						if ((current - item.CreateTime) > 5 * 60) {
							return true;
						} else {
							return false;
						}
						break
					default:
						if ((current - item.CreateTime) > 10) {
							return true;
						} else {
							return false;
						}
				}
			},
			//消息长按
			messageLongPress(event, item) {
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
					"Type": 0
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
			//表情的删除按钮
			clearMessage() {
				if (!this.content) return;
				this.content = this.truncated(this.content, this.content.length - 1)
			},
			truncated(str) {
				let index = Array.from(str);
				let content = index.slice(0, index.length - 1).join('');
				return content
			},
			// 获取位置
			getLocation() {
				uni.getLocation({
					type: "gcj02",
					success: (res) => {
						console.log(res);
						let {
							latitude,
							longitude
						} = res;
						uni.chooseLocation({
							latitude,
							longitude,
							success: (chooseRes) => {
								const sendMessage = {
									Id: 0,
									TargetId: parseInt(this.toUserId),
									TargetName: this.toUserName,
									Type: xsoftmsdk.enums.ContentType.Custom,
									Content: "",
									CreateTime: getCurrentTamp(),
									SourceId: parseInt(this.$store.state.imUserInfo.imId),
									CustomContent: JSON.stringify({
										GuidMini: xsoftmsdk.common.GuidMini(),
										contentType: 12,
										...chooseRes,
									}),
								};
								const temporaryMessage =
									xsoftmsdk.messages.NormalMessage.fromMap(sendMessage);
								imsdk.sendMessage(
									xsoftmsdk.messages.NormalMessage.fromMap(sendMessage)
								);
								this.$store.state.normalList.push(temporaryMessage)
							},
						});
					},
				});
			},
			// 打开位置
			openLocation(content) {
				let {
					latitude,
					longitude
				} = content;
				uni.openLocation({
					latitude,
					longitude,
				});
			},
			//发送链接
			sendLink() {
				const sendMessage = {
					Id: 0,
					TargetId: parseInt(this.toUserId),
					Type: xsoftmsdk.enums.ContentType.Link,
					Content: "[链接]",
					CreateTime: getCurrentTamp(),
					TargetName: this.toUserName,
					CustomType: customeType[this.sourceType] + '',
					SourceId: parseInt(this.$store.state.imUserInfo.imId),
					CustomContent: JSON.stringify({
						GuidMini: xsoftmsdk.common.GuidMini(),
						...this.orderDetail,
						...this.materialDetail,
						...this.constructionOrder
					}),
				}
				const temporaryMessage = xsoftmsdk.messages.NormalMessage.fromMap(sendMessage);
				imsdk.sendMessage(xsoftmsdk.messages.NormalMessage.fromMap(sendMessage));
				this.$store.state.normalList = [...this.$store.state.normalList, temporaryMessage];
				this.linkShow = false;
			},
			//其他语音发送
			async upload(file) {
				let temporaryMessage = {
					Id: 0,
					TargetId: parseInt(this.toUserId),
					TargetName: this.toUserName,
					Type: xsoftmsdk.enums.ContentType.Voice,
					Content: file.url,
					CreateTime: getCurrentTamp(),
					SourceId: parseInt(this.$store.state.imUserInfo.imId),
					CustomContent: JSON.stringify({
						GuidMini: xsoftmsdk.common.GuidMini(),
						LocalPath: file.url,
						Duration: file.length
					}),
				};
				temporaryMessage.Content = file.url;
				let fileid = await imUpload(file.url);
				if (fileid) {
					temporaryMessage.FileId = fileid;
					imsdk.sendMessage(xsoftmsdk.messages.NormalMessage.fromMap(
						temporaryMessage));
					this.$store.state.normalList.push(
						xsoftmsdk.messages.NormalMessage.fromMap(temporaryMessage)
					);
					uni.saveFile({
						tempFilePath: file.url,
						success: (res) => {
							let local = res.savedFilePath;
							let url = this.getFiles(fileid);
							storage.insert({
								url,
								local,
							});
						},
					});
				} else {
					uni.saveFile({
						tempFilePath: file.url,
						success: (res) => {
							let local = res.savedFilePath;
							temporaryMessage.Content = local;
							imsdk.saveMessage(xsoftmsdk.messages
								.NormalMessage.fromMap(
									temporaryMessage))
							this.$store.state.normalList.push(
								xsoftmsdk.messages.NormalMessage
								.fromMap(temporaryMessage)
							);
						},
					});
				}
			},
			// 发送图片
			uploadImage(sourceType = ["album"]) {
				uni.chooseImage({
					count: 9, //默认9
					sizeType: ["original"],
					sourceType,
					success: async (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						tempFilePaths.forEach(async (temp) => {
							let temporaryMessage = {
								Id: 0,
								TargetId: parseInt(this.toUserId),
								Type: xsoftmsdk.enums.ContentType.Image,
								Content: temp,
								CreateTime: getCurrentTamp(),
								TargetName: this.toUserName,
								SourceId: parseInt(this.$store.state.imUserInfo.imId),
								CustomContent: JSON.stringify({
									GuidMini: xsoftmsdk.common.GuidMini(),
								}),
							};
							let fileid = await imUpload(temp);
							if (fileid) {
								temporaryMessage.FileId = fileid;
								imsdk.sendMessage(xsoftmsdk.messages.NormalMessage.fromMap(
									temporaryMessage));
								this.$store.state.normalList.push(
									xsoftmsdk.messages.NormalMessage.fromMap(temporaryMessage)
								);
								uni.saveFile({
									tempFilePath: temp,
									success: (res) => {
										let local = res.savedFilePath;
										let url = this.$util.getImFiles(fileid, true,
											false);
										storage.insert({
											url,
											local,
										});
									},
								});
							} else {
								uni.saveFile({
									tempFilePath: temp,
									success: (res) => {
										let local = res.savedFilePath;
										temporaryMessage.Content = local;
										imsdk.saveMessage(xsoftmsdk.messages
											.NormalMessage.fromMap(
												temporaryMessage))
										this.$store.state.normalList.push(
											xsoftmsdk.messages.NormalMessage
											.fromMap(temporaryMessage)
										);
									},
								});
							}
						});
					},
				});
			},
			// 发送文本消息
			send() {
				if (!this.content) return;
				const sendMessage = {
					Id: 0,
					TargetId: parseInt(this.toUserId),
					Type: xsoftmsdk.enums.ContentType.Text,
					Content: this.content,
					TargetName: this.toUserName,
					CreateTime: getCurrentTamp(),
					SourceId: parseInt(this.$store.state.imUserInfo.imId),
					CustomContent: JSON.stringify({
						GuidMini: xsoftmsdk.common.GuidMini(),
					}),
				};
				const temporaryMessage =
					xsoftmsdk.messages.NormalMessage.fromMap(sendMessage);
				imsdk.sendMessage(xsoftmsdk.messages.NormalMessage.fromMap(sendMessage));
				this.$store.state.normalList = [
					...this.$store.state.normalList,
					temporaryMessage,
				];
				this.content = "";
			},
			getJSON(string) {
				//这里是json字符串而不是单纯的字符串
				return JSON.parse(string);
			},
			compress(img) {
				let that = this;
				return new Promise((res) => {
					// var localPath = plus.io.convertAbsoluteFileSystem(img);
					plus.io.resolveLocalFileSystemURL(
						img,
						(entry) => {
							//通过URL参数获取目录对象或文件对象
							entry.file((file) => {
								// 可通过entry对象操作图片
								console.log("压缩前图片信息:" + JSON.stringify(file)); //压缩前图片信息
								if (file.size > 1572864) {
									//   如果大于1.5M进行压缩
									plus.zip.compressImage({
											// 5+ plus.zip.compressImage 了解一下，有详细的示例
											src: img, //src: 压缩原始图片的路径
											dst: img
												.replace(".png", "2222.png")
												.replace(".PNG", "2222.PNG")
												.replace(".jpg", "2222.jpg")
												.replace(".JPG", "2222.JPG"),
											width: "200", //dst: (String 类型 )压缩转换目标图片的路径，这里先在后面原始名后面加一个2222区分一下
											height: "20%", //width,height: (String 类型 )缩放图片的宽度,高度
											quality: 10, //quality: (Number 类型 )压缩图片的质量
											overwrite: true, //overwrite: (Boolean 类型 )覆盖生成新文件
											// format:'jpg'   //format: (String 类型 )压缩转换后的图片格式
										},
										(event) => {
											console.log("压缩后图片信息:" + JSON.stringify(
												event)); // 压缩后图片信息
											this.imageInfo = event;
											let newImg = event.target;
											res(newImg); //返回新的图片地址，在uploadFile之前接收
										},
										function(err) {
											// console.log('Resolve file URL failed: ' + err.message);
										}
									);
								} else {
									//else小于500kb跳过压缩，直接返回现有的src
									res(img);
								}
							});
						},
						(e) => {
							// 返回错误信息
							// console.log('Resolve file URL failed: ' + e.message);
						}
					);
				});
			},
		},
		computed: {
			normalList() {
				return this.$store.state.normalList;
			},
		},
		watch: {
			normalList(newValue, oldValue) {
				if (newValue.length > oldValue.length) {
					if (!this.chated) {
						this.chated = true;
						uni.$emit('chated', {
							status: 'success',
							orderId: this.orderId
						});
					}
				}
				if (
					newValue.length - oldValue.length > 1 ||
					(oldValue.length == 0 && newValue.length > 0) ||
					newValue.length - oldValue.length == this.$store.state.size
				) {

				} else {
					//这里是监听的来源消息
					this.initScrollBar();
				}
			},
			content(newData, oldData) {
				const length = Array.from(newData).length;
				if (length > 20) {
					this.autoHeight = false
				} else if (length == 0) {
					this.autoHeight = true
				}
			}
		},
	};
</script>
<style>
	.oper {
		background-color: #000;
		padding-bottom: 100rpx;
	}
</style>
<style lang="scss">
	@import "@/style/chat.scss";
</style>
