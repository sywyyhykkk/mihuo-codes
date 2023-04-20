"use strict";
Object.defineProperty(exports, "__esModule", {
	value: !0
});
import tabInit from './tabInit.js'
import {
	tabSqls
} from '@/plugins/im/tabSqls.js';
import api from '@/config/api'
import store from '@/store'
const xsoftmsdk = require('@/plugins/im/xsoftimsdk.js')
let reconnection_num = 0; //重连次数

class imsdk {
	constructor() {}
	static init(callbacks) {
		const imUserInfo = uni.getStorageSync('imUserInfo');
		//console.log("用户信息", imUserInfo)
		const deviceGuid = uni.getStorageSync('deviceGuid');
		// #ifdef APP
		let model = plus.device.model
		// #endif
		// #ifdef MP-WEIXIN
		let model = "MP-WEIXIN"
		// #endif
		const requestIm = new xsoftmsdk.httphelper.IMRequest(deviceGuid,
			imUserInfo.baseUrl,
			imUserInfo.socketUrl,
			imUserInfo.token,
			xsoftmsdk.enums.Platform.Phone,
			model);
		const {
			callNormal,
			callGroup,
			onGroupInvite,
			callMessageUpdate,
			callUpdateSession,
			callMessageRecall,
			callGroupUpdate
		} = callbacks;
		requestIm.initMessageCallback({
			onReceiveNormalMessage: (normal) => {
				callNormal(normal)
			},
			onReceiveGroupMessage: (group) => {
				callGroup(group);
			},
			onReceiveNotifyMessage: (notify) => {

			},
			onWsClose: (message) => {
				console.log(message)
			},
			onGroupInvite: (creator, groupId, isConfirm,
				time) => {
				//邀请进群的通知
				onGroupInvite(creator, groupId, isConfirm,
					time);
			},
			onMessageRecall: (sourceId, messageId, targetId,
				isGroup) => {
				callMessageRecall(sourceId, messageId,
					targetId,
					isGroup)
			},
			onMessageUpdate(message, isGroup) {
				callMessageUpdate(message, isGroup);
			},
			onUpdateSession: (session) => {
				callUpdateSession(session);
			},
			onPing(ping) {
				//console.log(ping)
			},
			onGroupUpdate(group) {
				callGroupUpdate(group)
			}
		})
		uni.closeSocket();
		uni.connectSocket({
			url: requestIm.getWsConnetc().replace(/\s*/g, ""),
			success: (res) => {
				console.log(res)
				//console.log(requestIm.getWsConnetc().replace(/\s*/g, ""))
			},
			fail: (res) => {
				//console.log("链接调用失败")
			}
		})
		uni.onSocketOpen((res) => {
			//console.log(res)
		})
		uni.onSocketMessage((res) => {
			//console.log(res);
			requestIm.onWsData(res.data);
		});
	}
	//消息存入数据库
	static async saveMessage(message) {
		const imUserInfo = uni.getStorageSync('imUserInfo');
		const imId = imUserInfo ? imUserInfo.imId : '';
		let customeContent = JSON.parse(message.CustomContent);
		let localMessage = {
			KeyID: customeContent.GuidMini,
			...message,
			SourceId: imId,
			ChangeTime: message.CreateTime,
			Status: 0,
		}
		delete localMessage.IsOffline;
		if (message.MessageType == xsoftmsdk.enums.MessageTypeEnum.Normal) {
			await tabInit.insertMessage(tabSqls.NormalMessage, localMessage);
		} else {
			await tabInit.insertMessage(tabSqls.GroupMessage, localMessage);
		}
	}
	//消息发送
	static async sendMessage(message) {
		//本地
		// #ifdef APP
		await this.saveMessage(message)
		// #endif
		let deviceGuid = uni.getStorageSync('deviceGuid')
		// #ifdef MP
		let buffer = xsoftmsdk.common.ToMessagePackBuffer(message).buffer;
		// #endif
		// #ifdef APP
		let buffer = xsoftmsdk.common.ToMessagePackBuffer(message)
		// #endif
		//console.log(buffer)
		uni.sendSocketMessage({
			data: buffer,
			success: (res) => {
				console.log(res)
			},
			fail: (res) => {
				console.log(res)
				this.reconnection(message)
			}
		})
	}
	//这里是当关闭im后进来重新连接
	static reconnection(message) {
		const reconnetion = setTimeout(() => {
			//重链应该关闭
			const http = new api();
			http.imToken().then((res) => {
				reconnection_num = reconnection_num + 1
				if (reconnection_num > 2) {
					reconnection_num = 0;
					return;
				};
				store.commit('WEBSOCKET_INIT', res);
				message && this.sendMessage(message);
			})
			clearTimeout(reconnetion)
		}, 500)
	}
	//手动关闭
	static onclose() {
		this.requestIm = '';
		uni.onSocketMessage((res) => {

		});
		uni.closeSocket();
	}
	//异常关闭
	static errorClose(callback) {
		uni.onSocketError((res) => {
			this.reconnection()
		});
	}
}
exports.default = imsdk;
